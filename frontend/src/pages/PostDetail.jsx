import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { posts } from "../data/posts";

export default function PostDetail() {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);

  if (!post) return <p>Post not found.</p>;

  const updatedText = post.updated || post.date;

  return (
    <section className="section postDetail">
      {/* HEADER */}
      <header className="postHeader">
        <h1 className="postTitle">{post.title}</h1>
        <div className="postMeta">Last updated {updatedText}</div>
      </header>

      <hr className="postDivider" />

      {/* SUMMARY AS SECTION TITLE */}
      {post.summary && (
        <h2 className="postSectionTitle">
          {post.summary}
        </h2>
      )}

      {/* BODY */}
      {/* BODY */}
      <div className="postBody">
        <div className="markdown">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </div>
    </section>
  );
}
