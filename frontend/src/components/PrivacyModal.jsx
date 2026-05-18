import { useEffect, useRef } from "react";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export default function PrivacyModal({ open, onClose }) {
  const panelRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    previouslyFocusedRef.current = document.activeElement;

    // Move focus into the modal on open.
    const panel = panelRef.current;
    if (panel) panel.focus();

    const onKey = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panel) return;

      // Simple focus trap: cycle Tab and Shift+Tab between first and last
      // focusable element inside the panel.
      const nodes = panel.querySelectorAll(FOCUSABLE);
      if (nodes.length === 0) {
        e.preventDefault();
        panel.focus();
        return;
      }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === first || active === panel)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);

    // Lock background scroll while the modal is open.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      // Restore focus to the element that opened the modal.
      const prev = previouslyFocusedRef.current;
      if (prev && typeof prev.focus === "function") prev.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modalBackdrop"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        className="modalPanel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacyModalTitle"
        aria-describedby="privacyModalBody"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modalHeader">
          <h2 id="privacyModalTitle" className="modalTitle">Privacy</h2>
          <button
            type="button"
            className="modalClose"
            onClick={onClose}
            aria-label="Close privacy notice"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div id="privacyModalBody" className="modalBody">
          <p>This is a personal portfolio site. Here is what happens when you visit:</p>

          <p>
            When a page loads, the site sends a small notification to me containing
            an approximate geographic location (typically country and city) derived
            from your IP address by Amazon CloudFront. I use this to know that
            someone visited and roughly where from. The notification lands in my
            email inbox.
          </p>

          <p>
            I do not store IP addresses, browser identifiers, cookies, or any
            per-visitor records in a database. There is no analytics service,
            no tracking pixels, and no third-party scripts collecting data
            about you. I do not sell, share, or pass any of this information
            to anyone else.
          </p>

          <p>
            Standard server logs (request method, status, timing) are kept by
            AWS for a few days for operational purposes and contain no
            information that identifies you.
          </p>

          <p>
            If you have questions, or you would like me to delete the
            notification email associated with a visit you made, email me at{" "}
            <a href="mailto:mathew.d.ross@gmail.com">mathew.d.ross@gmail.com</a>.
          </p>

          <p className="modalMeta">Last updated: May 2026</p>
        </div>
      </div>
    </div>
  );
}
