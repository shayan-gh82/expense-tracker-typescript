import { validateUserBackup } from "./backup";

const PDF_DATA_PREFIX = "ETP_DATA_V1:";

const sanitizeFileName = (value) =>
  String(value || "expense-tracker-report")
    .trim()
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "expense-tracker-report";

export const exportReportToPdf = async ({ element, backup, fileName }) => {
  if (!element) throw new Error("REPORT_ELEMENT_NOT_FOUND");

  const [{ default: html2canvas }, { jsPDF }, { default: LZString }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
    import("lz-string"),
  ]);

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    windowWidth: Math.max(element.scrollWidth, 1100),
  });

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
  const encodedBackup = LZString.compressToBase64(JSON.stringify(backup));
  pdf.setProperties({
    title: "Expense Tracker Pro Financial Report",
    subject: `${PDF_DATA_PREFIX}${encodedBackup}`,
    author: backup.user?.name || "Expense Tracker Pro",
    creator: "Expense Tracker Pro",
    keywords: "expense tracker, finance report, importable backup",
  });

  const margin = 10;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const printableWidth = pageWidth - margin * 2;
  const printableHeight = pageHeight - margin * 2;
  const imageHeight = (canvas.height * printableWidth) / canvas.width;
  const image = canvas.toDataURL("image/png", 1);

  let y = margin;
  pdf.addImage(image, "PNG", margin, y, printableWidth, imageHeight, undefined, "FAST");

  let remainingHeight = imageHeight - printableHeight;
  while (remainingHeight > 0) {
    pdf.addPage();
    y -= printableHeight;
    pdf.addImage(image, "PNG", margin, y, printableWidth, imageHeight, undefined, "FAST");
    remainingHeight -= printableHeight;
  }

  pdf.save(`${sanitizeFileName(fileName)}.pdf`);
};

const decodePdfText = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let text = new TextDecoder("latin1").decode(bytes);

  if (!text.includes(PDF_DATA_PREFIX)) {
    text = text.replace(/\u0000/g, "");
  }

  return text;
};

export const importBackupFromPdf = async (file) => {
  const { default: LZString } = await import("lz-string");
  const text = decodePdfText(await file.arrayBuffer());
  const start = text.indexOf(PDF_DATA_PREFIX);
  if (start < 0) throw new Error("PDF_NOT_CREATED_BY_APP");

  const encodedStart = start + PDF_DATA_PREFIX.length;
  const closingParenthesis = text.indexOf(")", encodedStart);
  const raw = text.slice(encodedStart, closingParenthesis > encodedStart ? closingParenthesis : undefined);
  const encoded = raw
    .replace(/\\\r?\n/g, "")
    .replace(/\\\(/g, "(")
    .replace(/\\\)/g, ")")
    .replace(/\\\\/g, "\\")
    .replace(/\s/g, "");

  const json = LZString.decompressFromBase64(encoded);
  if (!json) throw new Error("PDF_BACKUP_DECODE_FAILED");

  const backup = JSON.parse(json);
  return { backup, data: validateUserBackup(backup) };
};
