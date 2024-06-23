import { css } from "hono/css";
import { createRoute } from "honox/factory";
import { database } from "../../../db/client";
import { post } from "../../../db/schema";

export default createRoute(async (c) => {
  const db = database(c.env);
  const posts = await db.select().from(post);

  return c.render(
    <div
      class={css`
        padding: var(--space-y-md) var(--space-x-md);
      `}
    >
      <h1>Hello Admin</h1>
      <div
        class={css`
          display: flex;
          flex-direction: column;
          gap: var(--space-y-md);
        `}
      >
        <a href={"/admin/posts/new"}>Create New</a>
        <ul
          class={css`
            display: flex;
            flex-direction: column;
            gap: var(--space-y-sm);
          `}
        >
          {posts.map((p) => (
            <li
              key={p.slug}
              class={css`
                display: flex;
                flex-direction: row;
                gap: var(--space-x-sm);
              `}
            >
              <a href={`/admin/posts/${p.slug}`}>{p.title}</a>
              {p.publishedAt && <p>PUBLISHED</p>}
            </li>
          ))}
        </ul>
      </div>
    </div>,
  );
});
