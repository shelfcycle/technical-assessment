import { unitOfMeasure } from "@prisma/client";
import { prisma } from "./prisma";

export const getAllCustomers = async () => {
  return prisma.customer.findMany();
};

export const getCustomerById = async (id: number) => {
  return prisma.customer.findFirst({
    where: {
      id,
    },
  });
};

export const createCustomer = async (data: {
  name: string;
  email?: string;
  phone?: string;
  street1?: string;
  street2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}) => {
  return prisma.customer.create({
    data,
  });
};

export const getProductsByCustomerId = async (customerId: number) => {
  return prisma.product.findMany({
    where: {
      CustomerProduct: {
        some: {
          customerId,
        },
      },
    },
  });
};

export const getProductsByNotCustomerId = async (customerId: number) => {
  return prisma.product.findMany({
    where: {
      NOT: {
        CustomerProduct: {
          some: {
            customerId,
          },
        },
      },
    },
  });
};

export const createProduct = async (data: {
  name: string;
  unitOfMeasure: unitOfMeasure;
}) => {
  return prisma.product.create({
    data,
  });
};

export const addProductToCustomer = async (customerId: number, productId: number) => {
  return prisma.$transaction(async (tx) => {
    const customer = await tx.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new Error(`Customer with Id [${customerId}] not found`);
    }

    const product = await tx.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error(`Product with Id [${productId}] not found`);
    }

    await tx.customerProduct.upsert({
      where: {
        customerId_productId: {
          customerId,
          productId,
        },
      },
      update: {},
      create: {
        customerId,
        productId,
      },
    });

    return { message: `${product.name} successfully added to customer` };
  });
};

export { prisma };