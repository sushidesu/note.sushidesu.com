import { css } from "hono/css";
import { createRoute } from "honox/factory";

type Post = {
  title: string;
  slug: string;
};

export default createRoute((c) => {
  const posts = getPosts();
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

const getPosts = (): Post[] => {
  return [
    {
      title: "HonoXで小さいブログを作った",
      slug: "hono-x-blog",
    },
    {
      title: "ラップしたくない",
      slug: "i-do-not-want-to-wrap",
    },
    {
      title: "それは関数型プログラミングではありません",
      slug: "it-is-not-functional-programming",
    },
  ];
};
