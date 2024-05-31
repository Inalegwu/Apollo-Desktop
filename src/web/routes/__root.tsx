import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Bounce, ToastContainer } from "react-toastify";
import { globalState$ } from "../../shared/state";
import { Layout } from "../components";

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
