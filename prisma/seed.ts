import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function seedCategories() {
  console.log("Categories seeding started.");

  function createRandomUser(): {
    interestId: string;
    interestName: string;
  } {
    return {
      interestId: faker.string.uuid(),
      interestName: faker.commerce.productName(),
    };
  }
  const USERS: {
    interestId: string;
    interestName: string;
  }[] = faker.helpers.multiple(createRandomUser, {
    count: 100,
  });
  try {
    const interests = USERS;
    const currentInterests = await prisma.category.findMany({});
    if (currentInterests.length > 0) {
      console.log("Data already exist");
    }
    const modifiedInterests = interests.map((o) => {
      return { id: o.interestId, name: o.interestName };
    });
    await prisma.category.createMany({
      data: modifiedInterests,
    });

    console.log("Categories seeding finished successfully!.");
  } catch (error) {
    console.error(error);
  }
}

seedCategories()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch((error) => {
    console.error("Error seeding categories:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
