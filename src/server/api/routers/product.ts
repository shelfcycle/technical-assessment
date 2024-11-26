import { addProductToCustomer, createProductForCustomer, deleteProductFromCustomer, getProductsByCustomerId, getProductsByNotCustomerId } from "@/server/data/prisma.service"; 
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

const addToCustomerSchema = z.object({
  customerId: z.number().int(),
  productId: z.number().int(),
});

const deleteFromCustomerSchema = z.object({
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
          message: `Failed to fetch un-added products customer with Id [${input.customerId}]`,
        });
      }
    }),

  addToCustomer: publicProcedure
    .input(addToCustomerSchema)
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
          message: `Failed to create product for customer with Id [${customerId}]`,
        });
      }
    }),

    deleteFromCustomer: publicProcedure
    .input(deleteFromCustomerSchema)
    .mutation(async ({ input }) => {
      const { customerId, productId } = input;

      try {
        const result = await deleteProductFromCustomer(customerId, productId);
        return result;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to delete product with Id [${productId}] from customer with Id [${customerId}]`,
        });
      }
    }),
});
