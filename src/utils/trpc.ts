import { unstable_httpBatchStreamLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { NextPageContext } from "next";

import type { AppRouter } from "@/server/api/routers";
import { transformer } from "@/shared/transformer";

function getBaseUrl() {
  if (typeof window !== "undefined") {
    return "";
  }
  return `http://127.0.0.1:${process.env.PORT ?? 3000}`;
}

export interface SSRContext extends NextPageContext {
  status?: number;
}

export const trpc = createTRPCNext<AppRouter, SSRContext>({
  config({ ctx }) {
    return {
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
          url: `${getBaseUrl()}/api/trpc`,
          headers() {
            if (!ctx?.req?.headers) {
              return {};
            }

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { connection: _connection, ...headers } = ctx.req.headers;
            return headers;
          },
          transformer,
        }),
      ],
    };
  },
  ssr: false,
  transformer,
});

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
