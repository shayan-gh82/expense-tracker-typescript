import { lazy, Suspense, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useFinance } from "./hooks/useFinance";
import { useI18n } from "./hooks/useI18n";
import Layout from "./components/layout/Layout";
import Auth from "./pages/Auth";

const Categories = lazy(() => import("./pages/Categories"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Reminders = lazy(() => import("./pages/Reminders"));
const Reports = lazy(() => import("./pages/Reports"));
const Settings = lazy(() => import("./pages/Settings"));
const Transactions = lazy(() => import("./pages/Transactions"));
const Wallets = lazy(() => import("./pages/Wallets"));

const pages = {
  dashboard: Dashboard,
  transactions: Transactions,
  categories: Categories,
  wallets: Wallets,
  reminders: Reminders,
  reports: Reports,
  settings: Settings,
};

const PageLoader = () => {
  const { t } = useI18n();

  return (
    <div className="glass-card grid min-h-[320px] place-items-center p-8" role="status" aria-live="polite">
      <div className="text-center text-royal-muted">
        <LoaderCircle className="mx-auto animate-spin text-royal-secondary" size={34} />
        <p className="mt-3 text-sm font-semibold">{t("common.loading")}</p>
      </div>
    </div>
  );
};

const App = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const { currentUser } = useFinance();
  const ActivePage = pages[activePage] || Dashboard;

  if (!currentUser) {
    return <Auth />;
  }

  return (
    <Layout activePage={activePage} onNavigate={setActivePage}>
      <Suspense fallback={<PageLoader />}>
        <ActivePage onNavigate={setActivePage} />
      </Suspense>
    </Layout>
  );
};

export default App;
