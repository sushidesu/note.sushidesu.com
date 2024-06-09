import { createRoute } from "honox/factory";

export default createRoute(async (c) => {
  return c.render(
    <div>
      <h1>Hello Admin</h1>
    </div>
  )
})
