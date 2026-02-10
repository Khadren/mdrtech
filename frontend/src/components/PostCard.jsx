import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  return (
    <article className="postCard">
      <h3>
        <Link to={`/posts/${post.slug}`}>
          {post.title}
        </Link>
      </h3>

      <p className="postSummary">
        {post.summary}
      </p>

      <small className="postDate">
        {post.date}
      </small>

      <p>{post.excerpt}</p>

      <p>
        <Link to={`/posts/${post.slug}`}>
          Read more →
        </Link>
      </p>
    </article>
  );
}
