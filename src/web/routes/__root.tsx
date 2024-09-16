import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Layout } from "../components";

const isDev = import.meta.env.DEV;

export const Route = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
      {/* <Notifier /> */}
      {isDev && <TanStackRouterDevtools />}
    </Layout>
  ),
});
