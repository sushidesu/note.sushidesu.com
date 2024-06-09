import { css } from "hono/css";
import type { FC } from "hono/jsx";

type HeaderProps = Record<string, unknown>;

export const Header: FC<HeaderProps> = () => {
  return (
    <div:w
      class={css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--space-y-md) var(--space-x-md);
      `}
    >
      <a href={"/"}>
        <h1
          class={css`
          font-size: 1rem;
          font-weight: bold;
        `}
        >
          text.sushidesu.com
        </h1>
      </a>
      <div>links</div>
    </div:w>
  );
};
