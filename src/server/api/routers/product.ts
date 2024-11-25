import { createProductForCustomer, addProductToCustomer, getProductsByCustomerId, getProductsByNotCustomerId, prisma } from "@/server/data/prisma.service"; 
import { unitOfMeasure } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { router, publicProcedure } from "../trpc";

const listAllByCustomerIdSchema = z.object({
  customerId: z.number().int(),
});

const createForCustomerSchema = z.object({
  customerId: z.number().int(),
  name: z.string(),
  unitOfMeasure: z.nativeEnum(unitOfMeasure),
});

const createCustomerProductSchema = z.object({
  customerId: z.number().int(),
  productId: z.number().int(),
});

export const productsRouter = router({
  listAllByCustomerId: publicProcedure
    .input(listAllByCustomerIdSchema)
    .query(async ({ input }) => {
      try {
        const products = await getProductsByCustomerId(input.customerId); 
        return { items: products };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to fetch products for customer with Id [${input.customerId}]`,
        });
      }
    }),

    listAllByNotCustomerId: publicProcedure
    .input(listAllByCustomerIdSchema)
    .query(async ({ input }) => {
      try {
        const products = await getProductsByNotCustomerId(input.customerId);
        return { items: products };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to fetch products not associated with customer with Id [${input.customerId}]`,
        });
      }
    }),

  addToCustomer: publicProcedure
    .input(createCustomerProductSchema)
    .mutation(async ({ input }) => {
      const { customerId, productId } = input;

      try {
        const result = await addProductToCustomer(customerId, productId);
        return result;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to add product with Id [${productId}] to customer with Id [${customerId}]`,
        });
      }
    }),

    createForCustomer: publicProcedure
    .input(createForCustomerSchema)
    .mutation(async ({ input }) => {
      const { customerId, name, unitOfMeasure } = input;

      try {
        const result = await createProductForCustomer({
          customerId,
          name,
          unitOfMeasure,
        });

        return result;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to create product and associate with customer with Id [${customerId}]`,
        });
      }
    }),
});
