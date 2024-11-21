import { initTRPC } from "@trpc/server";

import type { Context } from "./context";
import { transformer } from "../../shared/transformer";

const t = initTRPC.context<Context>().create({
  transformer,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const router = t.router;

export const publicProcedure = t.procedure;

export const mergeRouters = t.mergeRouters;

export const createCallerFactory = t.createCallerFactory;
