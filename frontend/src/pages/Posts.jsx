import { posts } from "../data/posts";
import PostCard from "../components/PostCard";
import Section from "../components/Section";

export default function Posts() {
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <Section id="posts" title="Posts">
      {sortedPosts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </Section>
  );
}