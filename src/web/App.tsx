import { enableReactTracking } from "@legendapp/state/config/enableReactTracking";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import t, { queryClient, trpcClient } from "@shared/config";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createRouter,
  createHashHistory,
} from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "react-toastify/dist/ReactToastify.css";
import "virtual:uno.css";
import "./defaults.css";
import { routeTree } from "./routeTree.gen";

enableReactTracking({
  auto: true,
});

const history = createHashHistory();

const router = createRouter({ routeTree, history });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root");

if (!rootElement?.innerHTML) {
  // biome-ignore lint/style/noNonNullAssertion: the root element is being constructed
  const root = ReactDOM.createRoot(rootElement!);

  root.render(
    <StrictMode>
      <t.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <Theme radius="medium" accentColor="gray" grayColor="gray">
            <RouterProvider router={router} />
          </Theme>
        </QueryClientProvider>
      </t.Provider>
    </StrictMode>,
  );
}
