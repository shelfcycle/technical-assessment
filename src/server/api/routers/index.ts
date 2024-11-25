import { env } from "@/shared/env";

import { customersRouter } from "./customer";
import { productsRouter } from "./product";

import { createCallerFactory, publicProcedure, router } from "../trpc";

export const appRouter = router({
  healthcheck: publicProcedure.query(() => ({ message: "hello there!", env })),
  customers: customersRouter,
  products: productsRouter,
});

export const createCaller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;
