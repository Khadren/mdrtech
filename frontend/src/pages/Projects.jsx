import { projects } from "../data/projects";
import ProjectCard from "../components/ProjectCard";
import Section from "../components/Section";

export default function Projects() {
  const sortedProjects = [...projects].sort(
    (a, b) => new Date(b.updated || b.date) - new Date(a.updated || a.date)
  );

  return (
    <Section id="projects" title="Projects">
      {sortedProjects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </Section>
  );
}