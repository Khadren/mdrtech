import Layout from "./components/Layout";
import Section from "./components/Section";
import ProjectCard from "./components/ProjectCard";
import { projects } from "./data/projects";

export default function App() {
  return (
    <Layout>
      <Section id="projects" title="Projects">
        <div className="grid">
          {projects.map((p) => (
            <ProjectCard key={p.title} {...p} />
          ))}
        </div>
      </Section>

      <Section id="posts" title="Recent Posts">
        <ul className="list">
          <li><a href="#">Example post title #1</a><span className="meta"></span></li>
          <li><a href="#">Example post title #2</a><span className="meta"></span></li>
        </ul>
        <p className="subtle">Tip: you can replace this section with a “Write-ups” page later.</p>
      </Section>

      <Section id="contact" title="Contact">
        <p>
          <strong>Email -</strong> {""}
          <a href="mailto:mathew.d.ross@gmail.com">
            mathew.d.ross@gmail.com
          </a>
        </p>
      </Section>

      <footer className="footer">
        © {new Date().getFullYear()} Mathew Ross • Built for the Cloud Resume Challenge
      </footer>
    </Layout>
  );
}