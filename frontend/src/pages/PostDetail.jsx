import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { posts } from "../data/posts";
import { projects } from "../data/projects";
import PostCard from "../components/PostCard";
import ProjectCard from "../components/ProjectCard";
import remarkGfm from "remark-gfm";

export default function PostDetail() {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);

  if (!post) return <p>Post not found.</p>;

  const updatedText = post.updated || post.date;

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
    <div className="homeGrid">
      
      {/* LEFT COLUMN: Main Post Content (Restored the section box) */}
      <div className="homeLeft">
        <section className="section postDetail">
          <header className="postHeader">
            <h1 className="postTitle">{post.title}</h1>
            <div className="postMeta">Last updated {updatedText}</div>
          </header>

          <hr className="postDivider" />

          {post.summary && (
            <h2 className="postSectionTitle">
              {post.summary}
            </h2>
          )}

          <div className="postBody prose">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </section>
      </div>

      {/* RIGHT COLUMN: Sidebar matching Home exactly */}
      <div className="homeRight">
        <div className="previousRail">
          
          <section className="section">
            <h2>Recent Posts</h2>
            {recentPosts.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
            <p><Link to="/posts">All posts →</Link></p>
          </section>

          <hr />

          <section className="section">
            <h2>Recent Projects</h2>
            {recentProjects.map((proj) => (
              <ProjectCard key={proj.slug} project={proj} />
            ))}
            <p><Link to="/projects">All projects →</Link></p>
          </section>

        </div>
      </div>
      
    </div>
  );
}