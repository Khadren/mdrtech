import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import ScrollToTop from "./ScrollToTop";
import PrivacyModal from "./PrivacyModal";

// `children` is rendered when Layout is used as an `errorElement` wrapper
// (where there's no nested route to fill the Outlet). For normal routing,
// child routes render through <Outlet />. Pages own their own hero/banner
// content — Layout just provides the chrome.
export default function Layout({ children }) {
  const year = new Date().getFullYear();
  const [privacyOpen, setPrivacyOpen] = useState(false);

  // Fire a silent visit ping once per app load. The endpoint reads the
  // CloudFront geo headers server-side and sends a notification email.
  // No body, no identifiers, no return value used.
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        fetch("/api/visit", { method: "POST", keepalive: true }).catch(() => {});
      } catch {
        /* ignore — best-effort notification only */
      }
    }, 750);
    return () => clearTimeout(t);
  }, []);

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
        <button
          type="button"
          className="footerLinkBtn"
          onClick={() => setPrivacyOpen(true)}
        >
          Privacy
        </button>
      </footer>

      <PrivacyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </div>
  );
}
