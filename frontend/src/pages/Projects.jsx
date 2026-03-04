import { projects } from "../data/projects";
import ProjectCard from "../components/ProjectCard";
import Section from "../components/Section";

export default function Projects() {
  const sortedProjects = [...projects].sort(
    (a, b) => new Date(b.updated || b.date) - new Date(a.updated || a.date)
  );

  return (
    <section id="posts" className="section">
      <h3 className="sectionTitle">Posts</h3>
      <div className="sectionBody">
        {sortedProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}

