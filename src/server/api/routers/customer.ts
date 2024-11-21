/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import type { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { prisma } from "@/server/data/prisma";

import { router, publicProcedure } from "../trpc";

const getByIdSchema = z.object({
  id: z.number().int(),
});

export const customersRouter = router({
  list: publicProcedure.query(async () => {
    const customers = await prisma.customer.findMany({});
    return { items: customers };
  }),
  getById: publicProcedure.input(getByIdSchema).query(async ({ input }) => {
    const customer = await prisma.customer.findFirst({
      where: {
        id: input.id,
      },
    });
    if (!customer) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Customer with Id [${input.id}] not found`,
      });
    }
    return { item: customer };
  }),
});
