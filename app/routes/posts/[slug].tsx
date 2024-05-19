import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { css } from "hono/css";
import type { FC } from "hono/jsx";
import { createRoute } from "honox/factory";
import { nanoid } from "nanoid/non-secure";
import { z } from "zod";
import { database } from "../../db/client";
import * as schema from "../../db/schema";

const formControl = css`
  display: flex;
  flex-direction: column;
  gap: var(--space-y-sm);
`;

const textInput = css`
  padding: var(--space-y-sm) var(--space-x-sm);
`;

const Page: FC<{
  post: {
    title: string;
    slug: string;
    body: string;
    createdAt: Date;
    isPublished: boolean;
  };
  error?: Record<string, string[] | undefined>;
}> = ({ post }) => {
  return (
    <div
      class={css`
      padding: var(--space-y-md) var(--space-x-md);
    `}
    >
      <h1>{post.title}</h1>
      <p>{post.createdAt.toLocaleDateString()}</p>
      <p>{post.body}</p>
      <hr />
      <form
        method={"POST"}
        class={css`
          display: flex;
          flex-direction: column;
          gap: var(--space-y-md);
        `}
      >
        <div class={formControl}>
          <label>title</label>
          <input class={textInput} name={"title"} value={post.title} />
        </div>
        <div class={formControl}>
          <label>slug</label>
          <input class={textInput} name={"slug"} value={post.slug} />
        </div>
        <div class={formControl}>
          <label>body</label>
          <textarea class={textInput} name={"body"} rows={10}>
            {post.body}
          </textarea>
        </div>
        <div>
          <label>publish</label>
          <input
            name={"isPublished"}
            type={"checkbox"}
            checked={post.isPublished}
          />
        </div>
        <div>
          <button type={"submit"}>POST</button>
        </div>
      </form>
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
    .where(eq(schema.post.slug, slug));
  if (!p) {
    return c.render(
      <Page
        post={{
          title: "",
          slug,
          body: "",
          createdAt: new Date(),
          isPublished: false,
        }}
      />,
    );
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
      title: `${p.title} | note.sushidesu.com`,
    },
  );
});

export const DELETE = createRoute(async (c) => {});

export const POST = createRoute(
  zValidator(
    "form",
    z.object({
      title: z.string().min(1),
      slug: z.string().min(1),
      body: z.string(),
      isPublished: z.literal("on").optional(),
    }),
    (result, c) => {
      if (!result.success) {
        return c.render(
          <Page
            post={{
              title: "",
              slug: "",
              createdAt: new Date(),
              isPublished: false,
              body: "",
            }}
            error={result.error.flatten().fieldErrors}
          />,
          {
            title: "New Post | note.sushidesu.com",
          },
        );
      }
    },
  ),
  async (c) => {
    const { slug: currentSlug } = c.req.param();
    const { title, slug, body, isPublished } = c.req.valid("form");

    const db = database(c.env);
    // await db.transaction(async (tx) => {
    const [p] = await db
      .select()
      .from(schema.post)
      .where(eq(schema.post.slug, currentSlug));
    if (!p) {
      // create new post
      await db.insert(schema.post).values({
        id: nanoid(),
        title,
        body,
        slug,
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: isPublished ? new Date() : null,
      });
    } else {
      // update post
      await db
        .update(schema.post)
        .set({
          title,
          body,
          slug,
          updatedAt: new Date(),
          publishedAt: isPublished ? new Date() : null,
        })
        .where(eq(schema.post.slug, currentSlug));
    }
    // });

    return c.redirect(`/posts/${slug}`, 303);
  },
);
