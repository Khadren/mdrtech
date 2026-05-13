import { posts } from "../data/posts";
import PostCard from "../components/PostCard";
import SEO from "../components/SEO";

export default function Posts() {
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <>
      <SEO
        title="Posts"
        description="Field notes, write-ups, and the occasional rant from Mathew Ross on systems, cloud, and the job hunt."
        url="/posts"
      />
      <section id="posts" className="section">
        <h1 className="sectionTitle">Posts</h1>
        <div className="sectionBody">
          {sortedPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </>
  );
}