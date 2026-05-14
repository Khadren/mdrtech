import { Link } from "react-router-dom";

export default function ProjectCard({ project }) {
  return (
    <article className="contentCard">
      <h3>
        <Link to={`/projects/${project.slug}`}>
          {project.title}
        </Link>
      </h3>

      <p className="contentSummary">
        {project.summary}
      </p>

      {project.excerpt && <p>{project.excerpt}</p>}

      <p>
        <Link to={`/projects/${project.slug}`}>
          Read more →
        </Link>
      </p>
    </article>
  );
}
