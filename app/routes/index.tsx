import type { Env } from "hono";
import { css } from "hono/css";
import { createRoute } from "honox/factory";
import { database } from "../db/client";
import { post } from "../db/schema";
import { isNotNull } from "drizzle-orm";

type Post = {
  title: string;
  slug: string;
};

export default createRoute(async (c) => {
  const posts = await getPosts(c.env);
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

const getPosts = async (env: Env["Bindings"]): Promise<Post[]> => {
  const db = database(env);
  const posts = await db.select().from(post).where(isNotNull(post.publishedAt));

  return posts.map((p) => ({
    title: p.title,
    slug: p.slug,
  }));
};
