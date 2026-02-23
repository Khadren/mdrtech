import { LuFileText, LuGithub, LuLinkedin, LuMail } from "react-icons/lu";
import Section from "../components/Section";

export default function About() {
  return (
    <div className="pageContent">
      <Section id="about" title="About Me">
        
        {/* Skills & Location Pills */}
        <div className="aboutpillRow" style={{ marginBottom: "1.5rem" }}>
          <span className="aboutpill">Toronto, CA</span>
          <span className="aboutpill">AWS • Azure • M365</span>
        </div>

        {/* Bio Paragraphs */}
        <div className="aboutBio">
          <p>
            Hi, I'm Mathew. I am a Systems & Cloud Administrator based in Toronto, specializing in building, securing, and maintaining robust infrastructure across AWS, Azure, and Microsoft 365 environments.
          </p>
          <p>
            My background spans from on-premise system administration to modern cloud architecture. I thrive on solving complex problems, automating repetitive workflows, and ensuring high availability for critical business systems.
          </p>
          <p>
            When I'm not architecting cloud solutions or writing scripts, I'm documenting my journey and sharing what I learn through my blog and projects like the Cloud Resume Challenge.
          </p>
        </div>

        {/* Links */}
        <div className="linksRow" style={{ marginBottom: "2rem" }}>
          <a href="https://github.com/Khadren" className="linksbtn" target="_blank" rel="noreferrer">
            <LuGithub size={15} />
            <span>GitHub</span>
          </a>
          <a href="https://www.linkedin.com/in/mathewdross/" className="linksbtn" target="_blank" rel="noreferrer">
            <LuLinkedin size={15} />
            <span>LinkedIn</span>
          </a>
          <a href="/MathewRossResume.pdf" className="linksbtn" target="_blank" rel="noreferrer">
            <LuFileText size={15} />
            <span>Resume</span>
          </a>
        </div>
      </Section>
    </div>
  );
}