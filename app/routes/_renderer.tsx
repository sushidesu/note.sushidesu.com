import { Style, css } from "hono/css";
import { jsxRenderer } from "hono/jsx-renderer";
import { Script } from "honox/server";
import { Header } from "../ui/header";
import { Layout } from "../ui/layout";

export default jsxRenderer(({ children, title }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <Script src="/app/client.ts" async />
        <Style>{css`
          :root {
            --space-x-sm: 0.5rem;
            --space-x-md: 1rem;
            --space-x-lg: 2rem;
            --space-y-sm: 0.5rem;
            --space-y-md: 1rem;
            --space-y-lg: 2rem;
            --color-text-link: #0070f3;
          }
          *, *::before, *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            font-family: sans-serif;
          }
        `}</Style>
      </head>
      <body>
        <Layout header={<Header />}>{children}</Layout>
      </body>
    </html>
  );
});
