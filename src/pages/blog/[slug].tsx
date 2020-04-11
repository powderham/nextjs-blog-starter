import * as glob from "glob";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";

export default function BlogPost(props: IBlogPost) {
  return (
    <div>
      <article>
        <h1>{props.metadata.title}</h1>
        <div>
          <ReactMarkdown source={props.body} />
        </div>
      </article>
    </div>
  );
}

export type MetadataType = Partial<{
  title: string;
  date: string;
}>;

export interface IBlogPost {
  metadata: MetadataType;
  body: string;
  slug: string;
}

/**
 *
 * Pre render this page at build time using props returned by this function
 */
export async function getStaticProps({ ...ctx }) {
  const { slug } = ctx.params;
  const content = await import(`../../posts/${slug}.md`);
  const data = matter(content.default);

  return {
    props: {
      metadata: data.data,
      body: data.content,
    },
  };
}

/**
 * Define the list of paths to be rendered in to HTML at build time
 */
export async function getStaticPaths() {
  //get all .md files in the posts dir
  const blogs = glob.sync("src/posts/**/*.md");

  //remove path and extension to leave filename only
  const blogSlugs = blogs.map(getFilenameFromPath);

  // create paths with `slug` param
  const paths = blogSlugs.map(createPathWithSlugFromFilename);

  return {
    paths,
    /**
     * If fallback is false, then any paths not returned by getStaticPaths will result in a 404 page
     * Set to true if wanting to avoid a full re-build when adding new pages
     */
    fallback: false,
  };
}

const getFilenameFromPath = (path: string) =>
  path.split("/")[2].replace(/ /g, "-").slice(0, -3).trim();

const createPathWithSlugFromFilename = (filename: string) =>
  `/blog/${filename}`;
