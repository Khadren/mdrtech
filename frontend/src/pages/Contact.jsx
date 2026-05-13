import { LuLinkedin, LuMail } from "react-icons/lu";
import Section from "../components/Section";
import SEO from "../components/SEO";

export default function Contact() {
  return (
    <>
      <SEO
        title="Contact"
        description="Get in touch with Mathew Ross — email or LinkedIn for cloud, systems, and infrastructure conversations."
        url="/contact"
      />
      <Section id="contact" title="Say Hi">
        <p>
          I'm always open to discussing new opportunities, cloud architecture, or just want to pick my brain.
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
    </>
  );
}
