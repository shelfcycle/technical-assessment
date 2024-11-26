import { Prisma, unitOfMeasure } from "@prisma/client";
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

export const updateCustomer = async (data: {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  street1?: string;
  street2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}) => {
  if (!data.name) {
    throw new Error("Name is required");
  }
  return prisma.customer.update({
    where: {
      id: data.id,
    },
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      street1: data.street1,
      street2: data.street2,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
    },
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

export const createProductForCustomer = async (data: {
  customerId: number;
  name: string;
  unitOfMeasure: unitOfMeasure;
}) => {
  const { customerId, name, unitOfMeasure } = data;

  const existingProduct = await prisma.product.findFirst({
    where: {
      name,
      CustomerProduct: {
        some: {
          customerId,
        },
      },
    },
  });

  if (existingProduct) {
    throw new Error(`Product with name "${name}" already exists for this customer.`);
  }

  try {
    return await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name,
          unitOfMeasure,
        },
      });

      await addProductToCustomer(customerId, product.id, tx);

      return { message: `${product.name} created for customer` };
    });
  } catch (error) {
    throw new Error(`Failed to create product and associate with customer with Id [${customerId}]`);
  }
};

export const addProductToCustomer = async (customerId: number, productId: number, tx?: Prisma.TransactionClient) => {
  const prismaClient = tx ?? prisma;
  try {
    const customer = await prismaClient.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new Error(`Customer with Id [${customerId}] not found`);
    }

    const product = await prismaClient.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error(`Product with Id [${productId}] not found`);
    }

    await prismaClient.customerProduct.upsert({
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


    return { message: `${product.name} added to customer` };
  } catch (error) {
    throw new Error(`Failed to add product to customer with Id [${customerId}]`);
  }
};

export const deleteProductFromCustomer = async (customerId: number, productId: number) => {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.customerProduct.delete({
        where: {
          customerId_productId: {
            customerId,
            productId,
          },
        },
      });

      await tx.product.deleteMany({
        where: {
          CustomerProduct: {
            none: {},
          },
        },
      });
    });
  }
  catch (error) {
    throw new Error(`Failed to delete product from customer with Id [${customerId}]`);
  }
}

export { prisma };