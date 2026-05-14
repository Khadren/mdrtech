import { projects } from "../data/projects";
import { posts } from "../data/posts";
import ProjectCard from "../components/ProjectCard";
import PostCard from "../components/PostCard";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import SEO from "../components/SEO";

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
  // Posts: chronological — newest first.
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Projects: the loader already sorts featured-first, then alphabetical.
  // If you've flagged anything as `featured: true`, those float to the top
  // and feed the Home rail. If nothing's flagged, we fall back to the full
  // alphabetical list so the page still has content.
  const featured = projects.filter((p) => p.featured);
  const displayProjects = featured.length ? featured : projects;

  const newestProject = displayProjects[0];
  const previousProjects = displayProjects.slice(1, 3);
  const newestPost = sortedPosts[0];
  const previousPosts = sortedPosts.slice(1, 3);

  const projectRailLabel = featured.length ? "Featured Projects" : "Projects";
  const projectHeroLabel = featured.length ? "Featured Project" : "Project";

  return (
    <>
      <SEO
        title="MDR Technology Solutions"
        description="Enterprise-focused cloud architecture, automation, and infrastructure projects by Mathew Ross (MDR Tech)."
        url="/"
      />

      <Hero />

      <section className="contentGrid">
        {/* LEFT COLUMN — NEWEST POST + FEATURED PROJECT */}
        <div className="contentLeft section">
          {newestPost && (
            <article className="newestBlock">
              <h2>Latest Post</h2>
              <h3>
                <Link to={`/posts/${newestPost.slug}`}>{newestPost.title}</Link>
              </h3>
              <p className="contentDate">{newestPost.date}</p>
              {newestPost.summary && <p className="summary">{newestPost.summary}</p>}
              <p className="preview">{getPreview(newestPost.content, 2)}</p>
              <p><Link to={`/posts/${newestPost.slug}`}>Read full post →</Link></p>
            </article>
          )}

          {newestProject && (
            <article className="newestBlock">
              <h2>{projectHeroLabel}</h2>
              <h3>
                <Link to={`/projects/${newestProject.slug}`}>{newestProject.title}</Link>
              </h3>
              {newestProject.summary && <p className="summary">{newestProject.summary}</p>}
              <p className="preview">{getPreview(newestProject.content, 2)}</p>
              <p><Link to={`/projects/${newestProject.slug}`}>View project →</Link></p>
            </article>
          )}
        </div>

        {/* RIGHT COLUMN — RAILS */}
        <div className="contentRight">
          <div className="previousRail">
            <section className="section">
              <h2>{projectRailLabel}</h2>
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
      </section>
    </>
  );
}
