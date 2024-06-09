import { createRoute } from "honox/factory";
import { database } from "../../../../db/client";
import { post } from "../../../../db/schema";
import { eq } from "drizzle-orm";

export const POST = createRoute(async (c) => {
  const slug = c.req.param("slug");
  if (!slug) {
    return c.notFound();
  }

  const db = database(c.env);
  await db.delete(post).where(eq(post.slug, c.req.param("slug")));

  return c.render(
    <div>
      <p>Deleted {slug}</p>
      <a href={"/admin/posts"}>return to posts</a>
    </div>,
  );
});
