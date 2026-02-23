import { projects } from "../data/projects";
import { posts } from "../data/posts";
import ProjectCard from "../components/ProjectCard";
import PostCard from "../components/PostCard";
import { Link } from "react-router-dom";
import VisitorCounter from "../components/VisitorCounter";

function getPreview(content, count = 2) {
  if (!content) return "";
  const plainText = content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`.*?`/g, "")
    .replace(/[#_*~>-]/g, "")
    .replace(/\n+/g, " ")
    .trim();
  const sentences = plainText.split(/(?<=[.!?])\s+/);
  return sentences.slice(0, count).join(" ");
}

export default function Home() {
  const sortedProjects = [...projects].sort((a, b) => {
    const aDate = new Date(a.updated || a.date);
    const bDate = new Date(b.updated || b.date);
    return bDate - aDate;
  });

  const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

  const newestProject = sortedProjects[0];
  const previousProjects = sortedProjects.slice(1, 3);
  const newestPost = sortedPosts[0];
  const previousPosts = sortedPosts.slice(1, 3);

  return (
    <section className="homeGrid">
      {/* LEFT COLUMN — NEWEST CONTENT */}
      <div className="homeLeft section">
        {newestPost && (
          <article className="newestBlock">
            <h1>Latest Post</h1>
            <h2>
              <Link to={`/posts/${newestPost.slug}`}>{newestPost.title}</Link>
            </h2>
            <small>{newestPost.date}</small>
            {newestPost.summary && <p className="summary">{newestPost.summary}</p>}
            <p className="preview">{getPreview(newestPost.content, 2)}</p>
            <p><Link to={`/posts/${newestPost.slug}`}>Read full post →</Link></p>
          </article>
        )}

        {newestProject && (
          <article className="newestBlock">
            <h1>Latest Project</h1>
            <h2>
              <Link to={`/projects/${newestProject.slug}`}>{newestProject.title}</Link>
            </h2>
            <small>Last updated {newestProject.updated}</small>
            {newestProject.summary && <p className="summary">{newestProject.summary}</p>}
            <p className="preview">{getPreview(newestProject.content, 2)}</p>
            <p><Link to={`/projects/${newestProject.slug}`}>View project →</Link></p>
          </article>
        )}
      </div>

      {/* RIGHT COLUMN — PREVIOUS CONTENT */}
      <div className="homeRight">
        <div className="previousRail">
          <section className="section">
            <h2>Recent Projects</h2>
            {previousProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
            <p><Link to="/projects">All projects →</Link></p>
          </section>

          <hr />

          <section className="section">
            <h2>Recent Posts</h2>
            {previousPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
            <p><Link to="/posts">All posts →</Link></p>
          </section>
        </div>
      </div>
      <footer className="siteFooter">
        <VisitorCounter />
      </footer>
    </section>
  );
}