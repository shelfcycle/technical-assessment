import { env } from "@/shared/env";

import { customersRouter } from "./customer";

import { createCallerFactory, publicProcedure, router } from "../trpc";

export const appRouter = router({
  healthcheck: publicProcedure.query(() => ({ message: "hello there!", env })),
  customers: customersRouter,
});

export const createCaller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;
