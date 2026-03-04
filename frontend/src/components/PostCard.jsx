import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  return (
    <article className="contentCard">
      <h3>
        <Link to={`/posts/${post.slug}`}>
          {post.title}
        </Link>
      </h3>
      
      <p className="contentDate">
        {post.date}
      </p>

      <p className="contentSummary">
        {post.summary}
      </p>

      {post.excerpt && <p>{post.excerpt}</p>}

      <p>
        <Link to={`/posts/${post.slug}`}>
          Read more →
        </Link>
      </p>
    </article>
  );
}
