import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const customerSeedCount = 10;

const main = async () => {
  for (let i = 0; i < customerSeedCount; i++) {
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
  }
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
