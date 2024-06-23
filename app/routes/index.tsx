import { isNotNull } from "drizzle-orm";
import { css } from "hono/css";
import type { FC } from "hono/jsx";
import { createRoute } from "honox/factory";
import { database } from "../db/client";
import { post } from "../db/schema";
import { Header } from "../ui/header";
import { Layout } from "../ui/layout";

export default createRoute(async (c) => {
  const db = database(c.env);
  const posts = await db.select().from(post).where(isNotNull(post.publishedAt));

  return c.render(
    <Layout header={<Header isTop />}>
      <div
        class={css`
        margin-top: var(--space-y-md);
        padding: 0 var(--space-x-md);
      `}
      >
        <article>
          <ul
            class={css`
            margin-top: var(--space-y-md);
            list-style-type: none;
            display: flex;
            flex-direction: column;
            gap: var(--space-y-sm);
          `}
          >
            {posts.map((post) => (
              <PostListItem title={post.title} slug={post.slug} />
            ))}
          </ul>
        </article>
      </div>
    </Layout>,
    { title: "text.sushidesu.com" },
  );
});

const PostListItem: FC<{
  title: string;
  slug: string;
}> = ({ title, slug }) => {
  return (
    <li
      class={css`
        display: flex;
        flex-direction: column;
        gap: var(--space-y-sm);
      `}
    >
      <a
        href={`/posts/${slug}`}
        class={css`
          color: var(--color-text-link);
        `}
      >
        {title}
      </a>
      <span>2024/06/09</span>
    </li>
  );
};
