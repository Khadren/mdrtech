import { Link } from "react-router-dom";

export default function ProjectCard({ project }) {
  return (
    <article className="projectCard">
      <h3>
        <Link to={`/projects/${project.slug}`}>
          {project.title}
        </Link>
      </h3>

      <p className="projectSummary">
        {project.summary}
      </p>

      <small className="projectDate">
        {project.date}
      </small>

      <p>{project.excerpt}</p>

      <p>
        <Link to={`/projects/${project.slug}`}>
          Read more →
        </Link>
      </p>
    </article>
  );
}