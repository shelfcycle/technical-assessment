/**
 * This file contains tRPC's HTTP response handler
 */
import * as trpcNext from "@trpc/server/adapters/next";

import { createContext } from "@/server/api/context";
import { appRouter } from "@/server/api/routers";

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
  onError({ error }) {
    if (error.code === "INTERNAL_SERVER_ERROR") {
      console.error("Something went wrong", error);
    }
  },
});
