import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Bounce, ToastContainer } from "react-toastify";
import { Layout } from "../components";
import { globalState$ } from "../state";

export const Route = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        theme={globalState$.colorMode.get()}
        transition={Bounce}
      />
    </Layout>
  ),
});
