import { and, eq, isNotNull } from "drizzle-orm";
import { css } from "hono/css";
import type { FC } from "hono/jsx";
import { createRoute } from "honox/factory";
import { database } from "../../db/client";
import * as schema from "../../db/schema";

const Page: FC<{
  post: {
    title: string;
    slug: string;
    body: string;
    createdAt: Date;
    isPublished: boolean;
  };
}> = ({ post }) => {
  return (
    <div
      class={css`
      padding: var(--space-y-md) var(--space-x-md);
    `}
    >
      <h1>{post.title}</h1>
      <p>{post.createdAt.toLocaleDateString()}</p>
      <p
        class={css`
          white-space: pre-wrap;
        `}
      >
        {post.body}
      </p>
    </div>
  );
};

export default createRoute(async (c) => {
  const { slug } = c.req.param();
  if (!slug) {
    return c.notFound();
  }
  const db = database(c.env);
  const [p] = await db
    .select()
    .from(schema.post)
    .where(and(eq(schema.post.slug, slug), isNotNull(schema.post.publishedAt)));

  if (!p) {
    return c.notFound();
  }

  return c.render(
    <Page
      post={{
        title: p.title,
        slug: p.slug,
        body: p.body,
        createdAt: p.createdAt,
        isPublished: p.publishedAt !== null,
      }}
    />,
    {
      title: `${p.title} | text.sushidesu.com`,
    },
  );
});
