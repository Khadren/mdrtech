import { useState } from "react";
import { Link } from "react-router-dom";
import { LuMenu, LuX } from "react-icons/lu"; 

const navLinks = [
  { label: "About", to: "/about" },
  { label: "Posts", to: "/posts" },
  { label: "Projects", to: "/projects" },
  { label: "Contact", to: "/contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="header">
      <div className="headerInner">
        <Link className="brand" to="/" onClick={() => setOpen(false)}>
          MDR Technology Solutions
        </Link>

        {/* Desktop nav (shown via CSS on larger screens) */}
        <nav className="desktopNav" aria-label="Primary">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className="desktopNavLink">
              {l.label}
            </Link>
          ))}
        </nav>

        <button 
          className="hamburger" 
          onClick={() => setOpen((v) => !v)} 
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {open ? <LuX size={20} /> : <LuMenu size={20} />}
        </button>
      </div>

      {open && (
        <nav className="mobileNav">
          {navLinks.map((l) => (
            <Link 
              key={l.to} 
              to={l.to} 
              className="mobileNavLink"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}