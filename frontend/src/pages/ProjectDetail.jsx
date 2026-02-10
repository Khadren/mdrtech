import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { projects } from "../data/projects";

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);

  if (!project) return <p>Project not found.</p>;

  const updatedText = project.updated || project.date;

  return (
    <section className="section projectDetail">
      <header className="projectHeader">
        <h1 className="projectTitle">{project.title}</h1>
        <div className="projectMeta">Last updated {updatedText}</div>
      </header>

      <hr className="projectDivider" />

      {project.summary && (
        <h2 className="projectSectionTitle">
          {project.summary}
        </h2>
      )}

      <div className="projectBody">
        <div className="markdown">
          <ReactMarkdown>{project.content}</ReactMarkdown>
        </div>
      </div>
    </section>
  );
}
