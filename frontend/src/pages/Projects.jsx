import { projects } from "../data/projects";
import ProjectCard from "../components/ProjectCard";
import SEO from "../components/SEO";

export default function Projects() {
  const sortedProjects = [...projects].sort(
    (a, b) => new Date(b.updated || b.date) - new Date(a.updated || a.date)
  );

  return (
    <>
      <SEO
        title="Projects"
        description="Selected IT and cloud infrastructure projects by Mathew Ross — AWS, Terraform, identity, and managed file transfer work."
        url="/projects"
      />
      <section id="projects" className="section">
        <h1 className="sectionTitle">Projects</h1>
        <div className="sectionBody">
          {sortedProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
    </>
  );
}

