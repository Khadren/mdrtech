import { LuFileText, LuGithub, LuLinkedin, LuMail } from "react-icons/lu";

export default function Profile() {
  return (
    <div className="hero">
      <div className="profile">
        <img className="avatar" src="/avatar-128.webp" alt="Profile" />
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
    <LuFileText size={14} />
    <span>Resume</span>
  </a>

  <a
    href="https://github.com/Khadren"
    className="socialInline"
    target="_blank"
    rel="noreferrer"
  >
    <LuGithub size={14} />
    <span>GitHub</span>
  </a>

  <a
    href="https://www.linkedin.com/in/mathewdross/"
    className="socialInline"
    target="_blank"
    rel="noreferrer"
  >
    <LuLinkedin size={14} />
    <span>LinkedIn</span>
  </a>
  <a
    href="mailto:mathew.ross@mdrtech.ca"
    className="socialInline"
    target="_blank"
    rel="noreferrer"
  >
    <LuMail size={14} />
    <span>E-Mail</span>
  </a>
</div>
      </div>
    </div>
  );
}