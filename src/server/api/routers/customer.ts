import { getAllCustomers, getCustomerById, updateCustomer } from "@/server/data/prisma.service";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { router, publicProcedure } from "../trpc";

const getByIdSchema = z.object({
  id: z.number().int(),
});

const updateCustomerSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  email: z.string().optional(),
  phone: z.string().optional(),
  street1: z.string().optional(),
  street2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
});

export const customersRouter = router({
  list: publicProcedure.query(async () => {
    try {
      const customers = await getAllCustomers();
      return { items: customers };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch customers",
      });
    }
  }),

  getById: publicProcedure.input(getByIdSchema).query(async ({ input }) => {
    const customer = await getCustomerById(input.id);
    if (!customer) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Customer with Id [${input.id}] not found`,
      });
    }
    return { item: customer };
  }),

  update: publicProcedure.input(updateCustomerSchema).mutation(async ({ input }) => {
    try {
      const updatedCustomer = await updateCustomer(input);
      return { item: updatedCustomer };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update customer",
      });
    }
  }),
});
