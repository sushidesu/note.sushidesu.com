import { css } from "hono/css";
import { createRoute } from "honox/factory";
import { database } from "../db/client";
import { post } from "../db/schema";

type Post = {
  title: string;
  slug: string;
};

export default createRoute(async (c) => {
  const posts = await getPosts();
  return c.render(
    <div
      class={css`
        padding: var(--space-y-md) var(--space-x-md);
      `}
    >
      <ul
        class={css`
          list-style-type: none;
          display: flex;
          flex-direction: column;
          gap: var(--space-y-sm);
        `}
      >
        {posts.map((post) => (
          <li key={post.slug}>
            <a
              href={`/posts/${post.slug}`}
              class={css`
                color: var(--color-text-link);
              `}
            >
              {post.title}
            </a>
          </li>
        ))}
      </ul>
    </div>,
    { title: "hono" },
  );
});

const getPosts = async (): Promise<Post[]> => {
  const db = database();
  const posts = await db.select().from(post);

  return posts.map((p) => ({
    title: p.title,
    slug: p.slug,
  }));
};
