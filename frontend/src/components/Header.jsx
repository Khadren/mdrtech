import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { LuMenu, LuX } from "react-icons/lu";

const navLinks = [
  { label: "About", to: "/about" },
  { label: "Posts", to: "/posts" },
  { label: "Projects", to: "/projects" },
  { label: "Contact", to: "/contact" },
];

const MOBILE_NAV_ID = "mobile-nav";

export default function Header() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const firstLinkRef = useRef(null);

  const closeMenu = () => setOpen(false);

  // Move focus into the menu when it opens; return it to the toggle on close.
  useEffect(() => {
    if (open) {
      firstLinkRef.current?.focus();
    } else if (document.activeElement === document.body) {
      // Only steal focus back if nothing else has claimed it.
      buttonRef.current?.focus();
    }
  }, [open]);

  // Close on Escape while the menu is open.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        closeMenu();
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="header">
      <div className="headerInner">
        <Link className="brand" to="/" onClick={closeMenu}>
          <img className="brandAvatar" src="/avatar-256.webp" alt="" aria-hidden="true" />
          <span className="brandText">MDR Technology Solutions</span>
        </Link>

        {/* Desktop nav (shown via CSS on larger screens) */}
        <nav className="desktopNav" aria-label="Primary">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                "desktopNavLink" + (isActive ? " isActive" : "")
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <button
          ref={buttonRef}
          className="hamburger"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={MOBILE_NAV_ID}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <LuX size={20} /> : <LuMenu size={20} />}
        </button>
      </div>

      {open && (
        <nav
          id={MOBILE_NAV_ID}
          className="mobileNav"
          aria-label="Mobile primary"
        >
          {navLinks.map((l, i) => (
            <NavLink
              key={l.to}
              to={l.to}
              ref={i === 0 ? firstLinkRef : undefined}
              className={({ isActive }) =>
                "mobileNavLink" + (isActive ? " isActive" : "")
              }
              onClick={closeMenu}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
