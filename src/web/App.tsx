import { enableReactTracking } from "@legendapp/state/config/enableReactTracking";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import t, { queryClient, trpcClient } from "@shared/config";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  NotFoundRoute,
  RouterProvider,
  createRouter,
} from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "react-toastify/dist/ReactToastify.css";
import "virtual:uno.css";
import { globalState$ } from "../shared/state";
import "./App.css";
import { NotFoundPage } from "./components";
import { routeTree } from "./routeTree.gen";
import { Route as rootRoute } from "./routes/__root";

enableReactTracking({
  auto: true,
});

const notFoundRoute = new NotFoundRoute({
  getParentRoute: () => rootRoute,
  component: () => <NotFoundPage />,
});

const router = createRouter({ routeTree, notFoundRoute });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root");

if (!rootElement?.innerHTML) {
  const root = ReactDOM.createRoot(rootElement!);

  root.render(
    <StrictMode>
      <t.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <Theme
            radius="medium"
            accentColor="violet"
            appearance={globalState$.colorMode.get()}
            grayColor="gray"
          >
            <RouterProvider router={router} />
          </Theme>
        </QueryClientProvider>
      </t.Provider>
    </StrictMode>,
  );
}
