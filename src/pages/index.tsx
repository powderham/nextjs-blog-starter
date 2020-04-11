import matter from "gray-matter";
import Link from "next/link";
import { IBlogPost } from "./blog/[slug]";

const Index = ({ blogPosts }: { blogPosts: BlogPostsType }) => {
  return (
    <div>
      <ul>
        {blogPosts.map((post) => {
          return (
            <li>
              <Link href={{ pathname: `/blog/${post.slug}` }}>
                {post.metadata.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Index;

export async function getStaticProps() {
  //get posts & context from folder
  const posts = getContentFromPosts(require.context("../posts", true, /\.md$/));

  return {
    props: {
      blogPosts: posts,
    },
  };
}

type BlogPostsType = IBlogPost[];

const getContentFromPosts = (context) => {
  const keys = context.keys();
  const values = keys.map(context);

  const data: BlogPostsType = keys.map((key, index) => {
    // Create slug from filename
    const slug = key
      .replace(/^.*[\\\/]/, "")
      .split(".")
      .slice(0, -1)
      .join(".");
    const value = values[index];
    // Parse yaml metadata & markdownbody in document
    const document = matter(value.default);

    return {
      metadata: document.data,
      body: document.content,
      slug,
    };
  });
  return data;
};
