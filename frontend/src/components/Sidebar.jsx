import { FileText, Github, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const nav = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Posts", to: "/posts" },
  { label: "Projects", to: "/projects" },
];


export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="profile">
        <img className="avatar" src="/avatar.png" alt="Profile" />
        <h2 className="name">Mathew Ross</h2>
        <p className="role">Systems & Cloud Administrator</p>

        <div className="pillRow">
          <span className="pill">Toronto, CA</span>
          <span className="pill">AWS • Azure • M365</span>
        </div>

<div className="socialRow left">
  <a
    href="/MathewRossResume.pdf"
    className="socialInline"
    target="_blank"
    rel="noreferrer"
  >
    <FileText size={14} />
    <span>Resume</span>
  </a>

  <a
    href="https://github.com/Khadren"
    className="socialInline"
    target="_blank"
    rel="noreferrer"
  >
    <Github size={14} />
    <span>GitHub</span>
  </a>

  <a
    href="https://www.linkedin.com/in/mathewdross/"
    className="socialInline"
    target="_blank"
    rel="noreferrer"
  >
    <Linkedin size={14} />
    <span>LinkedIn</span>
  </a>
</div>
      </div>

      <nav className="sideNav">
        {nav.map((n) => (
          <Link key={n.to} to={n.to} className="sideLink">
            {n.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}