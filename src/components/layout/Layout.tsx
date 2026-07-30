import { useEffect, useState } from "react";
import { useFinance } from "../../hooks/useFinance";
import { useI18n } from "../../hooks/useI18n";
import Header from "./Header";
import MobileNav from "./MobileNav";
import Sidebar from "./Sidebar";

const Layout = ({ activePage, onNavigate, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { settings } = useFinance();
  const { language, dir } = useI18n();
  const themeClass = settings.theme === "light" ? "theme-light" : "theme-dark";

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language, dir]);

  return (
    <div className={`app-shell ${themeClass}`} dir={dir} lang={language}>
      <div className="relative z-10 flex min-h-screen">
        <Sidebar activePage={activePage} onNavigate={onNavigate} />
        <MobileNav
          activePage={activePage}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          onNavigate={onNavigate}
        />
        <main className="min-w-0 flex-1">
          <Header
            activePage={activePage}
            onNavigate={onNavigate}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          />
          <div className="p-4 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
