import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface ErrorBoundaryProps { children?: ReactNode }
interface ErrorBoundaryState { hasError: boolean }

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Expense Tracker render error", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const isPersian = document.documentElement.lang === "fa";
    const copy = isPersian
      ? {
          title: "خطایی رخ داد",
          description: "اطلاعات ذخیره‌شده شما محفوظ است، اما این صفحه نمایش داده نشد. صفحه را دوباره بارگذاری و مجدداً امتحان کنید.",
          reload: "بارگذاری دوباره برنامه",
        }
      : {
          title: "Something went wrong",
          description: "The application protected your saved data, but this screen could not be rendered. Reload the page and try again.",
          reload: "Reload application",
        };

    return (
      <div className="theme-dark grid min-h-screen place-items-center bg-royal-bg p-6 text-royal-text">
        <div className="glass-card max-w-lg p-8 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-royal-expense/15 text-royal-expense">
            <AlertTriangle size={30} />
          </div>
          <h1 className="mt-5 text-2xl font-black">{copy.title}</h1>
          <p className="mt-3 text-sm leading-7 text-royal-muted">{copy.description}</p>
          <button type="button" className="btn-primary mt-6" onClick={() => window.location.reload()}>
            <RefreshCcw size={18} /> {copy.reload}
          </button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
