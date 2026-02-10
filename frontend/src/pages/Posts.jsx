import { posts } from "../data/posts";
import PostCard from "../components/PostCard";

export default function Posts() {
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <section className="section">
      <h1>Posts</h1>

      {sortedPosts.map((post) => (
        <PostCard
          key={post.slug}
          post={post}
        />
      ))}
    </section>
  );
}
