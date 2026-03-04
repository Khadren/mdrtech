import { LuFileText, LuGithub, LuLinkedin, LuMail } from "react-icons/lu";
import Section from "../components/Section";

export default function Contact() {
  return (
    <Section id="contact" title="Get In Touch">
      <p>
        I'm always open to discussing new opportunities, cloud architecture, or even open if you just want to pick my brain.
      </p>

      {/* Links */}
      <div className="linksRow" style={{ marginBottom: "2rem" }}>
        <a href="mailto:mathew.ross@mdrtech.ca" className="linksbtn" target="_blank" rel="noreferrer">
          <LuMail size={15} />
          <span>E-mail</span>
        </a>
        <a href="https://www.linkedin.com/in/mathewdross/" className="linksbtn" target="_blank" rel="noreferrer">
          <LuLinkedin size={15} />
          <span>LinkedIn</span>
        </a>
        </div>
    </Section>
  );
}

