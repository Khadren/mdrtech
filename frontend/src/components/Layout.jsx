import { Outlet } from "react-router-dom";
import Header from "./Header";
import ScrollToTop from "./ScrollToTop";
import VisitorCounter from "./VisitorCounter";

// `children` is rendered when Layout is used as an `errorElement` wrapper
// (where there's no nested route to fill the Outlet). For normal routing,
// child routes render through <Outlet />. Pages own their own hero/banner
// content — Layout just provides the chrome.
export default function Layout({ children }) {
  const year = new Date().getFullYear();
  return (
    <div className="page">
      <Header />
      <ScrollToTop />

      <main className="content">
        {children ?? <Outlet />}
      </main>

      <footer className="siteFooter">
        <span className="footerMeta">
          © {year} MDR Technology Solutions ·{" "}
          <a href="https://github.com/Khadren/mdrtech" target="_blank" rel="noreferrer">
            Source
          </a>
        </span>
        <VisitorCounter />
      </footer>
    </div>
  );
}
