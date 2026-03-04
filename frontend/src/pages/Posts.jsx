import { posts } from "../data/posts";
import PostCard from "../components/PostCard";

export default function Posts() {
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <section id="posts" className="section">
      <h3 className="sectionTitle">Posts</h3>
      <div className="sectionBody">
        {sortedPosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}