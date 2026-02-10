import { projects } from "../data/projects";
import ProjectCard from "../components/ProjectCard";

export default function Projects() {
  const sortedProjects = [...projects].sort(
    (a, b) => new Date(b.updated) - new Date(a.updated)
  );

  return (
    <section className="section">
      <h1>Projects</h1>

      {sortedProjects.map((project) => (
        <ProjectCard
          key={project.slug}
          project={project}
        />
      ))}
    </section>
  );
}
