import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // Catalog and vehicle detail loaders are backed by live D1 data. Never
    // consider route data fresh just because the same route was visited before.
    defaultStaleTime: 0,
    defaultStaleReloadMode: "blocking",
    defaultPreloadStaleTime: 0,
  });

  return router;
};
