import type { ReactNode } from "react";

const SectionHeader = ({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) => {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.24em] text-royal-secondary">{eyebrow}</p>}
        <h1 className="mt-2 text-2xl font-black text-royal-text md:text-3xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-royal-muted">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export default SectionHeader;
