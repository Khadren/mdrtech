import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { posts } from "../data/posts";
import { projects } from "../data/projects";
import PostCard from "../components/PostCard";
import ProjectCard from "../components/ProjectCard";
import remarkGfm from "remark-gfm";

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);

  if (!project) return <p>Project not found.</p>;

  const updatedText = project.updated || project.date;
  
  // Get the 2 most recent posts, excluding the one currently being read
  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .filter((p) => p.slug !== slug)
    .slice(0, 2);
  
  // Get the 2 most recent projects
  const recentProjects = [...projects]
    .sort((a, b) => {
      const aDate = new Date(a.updated || a.date);
      const bDate = new Date(b.updated || b.date);
      return bDate - aDate;
    })
    .slice(0, 2);

  return (
    <div className="contentGrid">

      {/* LEFT COLUMN: Main Project Content*/}
      <div className="contentLeft">
        <section className="section contentDetail">
          <header className="contentHeader">
            <h1 className="contentTitle">{project.title}</h1>
            <div className="contentMeta">Last updated {updatedText}</div>
          </header>

          <hr className="contentDivider" />

          {project.summary && (
            <h2 className="contentSectionTitle">
              {project.summary}
            </h2>
          )}

          <div className="contentBody prose">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {project.content}
            </ReactMarkdown>
          </div>
        </section>
      </div>

      {/* RIGHT COLUMN: Sidebar with recent content*/}
      <div className="contentRight">
        <div className="previousRail">
          
          <section className="section">
            <h2>Recent Projects</h2>
            {recentProjects.map((proj) => (
              <ProjectCard key={proj.slug} project={proj} />
            ))}
            <p><Link to="/projects">All projects →</Link></p>
          </section>

          <hr />

          <section className="section">
            <h2>Recent Posts</h2>
            {recentPosts.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
            <p><Link to="/posts">All posts →</Link></p>
          </section>
        </div>
      </div>        
    </div>
  );
}