import { faker } from "@faker-js/faker";
import { PrismaClient, unitOfMeasure } from "@prisma/client";

const prisma = new PrismaClient();

const customerSeedCount = 10;
const productsPerCustomer = 15;

const main = async () => {
  console.log("Seeding dev database...");
  const transaction = prisma.$transaction(async () => {
    try {
      await seedCustomers();
      await seedProducts();
      console.log("Seeding complete.");
    } catch (error) {
      console.error("Error during seeding process:", error);
      throw error;
    }
  });

  await transaction;
};

const seedCustomers = async () => {
  console.log("Seeding customers...");
  for (let i = 0; i < customerSeedCount; i++) {
    try {
      await prisma.customer.upsert({
        where: {
          id: i + 1,
        },
        create: {
          name: faker.company.name(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          street1: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          zipCode: faker.location.zipCode(),
        },
        update: {},
      });
    } catch (error) {
      console.error(`Error seeding customer ${i + 1}:`, error);
      throw error;
    }
  }
};

const seedProducts = async () => {
  console.log("Seeding products...");
  
  const customers = await prisma.customer.findMany();
  
  for (const customer of customers) {
    try {
      for (let i = 0; i < productsPerCustomer; i++) {
        const product = await prisma.product.create({
          data: {
            name: faker.commerce.productName(),
            unitOfMeasure: getRandomUnitOfMeasure(),
          },
        });

        await prisma.customerProduct.create({
          data: {
            customerId: customer.id,
            productId: product.id,
          },
        });
      }
    } catch (error) {
      console.error(`Error seeding products for customer ${customer.id}:`, error);
    }
  }
};

const getRandomUnitOfMeasure = (): unitOfMeasure => {
  const unitOfMeasures = Object.values(unitOfMeasure);
  const randomIndex = Math.floor(Math.random() * unitOfMeasures.length);
  return unitOfMeasures[randomIndex];
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

