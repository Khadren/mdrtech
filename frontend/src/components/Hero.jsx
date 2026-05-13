import { LuFileText, LuGithub, LuLinkedin, LuMail } from "react-icons/lu";

/**
 * Single, responsive hero used on the Home page.
 *
 * Layout adapts via a container query on .hero — stacked + centred on narrow
 * widths, horizontal + left-aligned once the container has room. No JS, no
 * duplicate DOM, same content at every viewport.
 */
export default function Hero() {
  return (
    <section className="hero" aria-label="Mathew Ross">
      <img
        className="heroAvatar"
        src="/avatar-256.webp"
        alt="Mathew Ross"
      />

      <div className="heroBody">
        <h1 className="heroName">Mathew Ross</h1>
        <p className="heroRole">Systems &amp; Cloud Administrator</p>

        <div className="heroPills">
          <span className="pill">Toronto, CA</span>
          <span className="pill">AWS · Azure · M365</span>
          <span className="pill">Terraform · GitHub Actions</span>
        </div>

        <div className="heroLinks">
          <a
            href="/MathewRossResume.pdf"
            className="heroLink"
            target="_blank"
            rel="noreferrer"
          >
            <LuFileText size={14} />
            <span>Resume</span>
          </a>

          <a
            href="https://github.com/Khadren"
            className="heroLink"
            target="_blank"
            rel="noreferrer"
          >
            <LuGithub size={14} />
            <span>GitHub</span>
          </a>

          <a
            href="https://www.linkedin.com/in/mathewdross/"
            className="heroLink"
            target="_blank"
            rel="noreferrer"
          >
            <LuLinkedin size={14} />
            <span>LinkedIn</span>
          </a>

          <a
            href="mailto:mathew.ross@mdrtech.ca"
            className="heroLink"
          >
            <LuMail size={14} />
            <span>E-Mail</span>
          </a>
        </div>
      </div>
    </section>
  );
}
