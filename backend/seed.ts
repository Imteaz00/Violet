import { faker } from "@faker-js/faker";
import { db } from "./src/config/db";
import {
  categories,
  connections,
  productImages,
  products,
  transactions,
  users,
} from "./src/config/schema";

const USER_COUNT = 10;
const PRODUCT_COUNT = 20;
const CONNECTION_COUNT = 25;
const TRANSACTION_COUNT = 15;

export async function seed() {
  console.log("🌱 Seeding database...");

  /* -------------------- USERS -------------------- */
  const userRows = Array.from({ length: USER_COUNT }).map(() => ({
    id: faker.string.uuid(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    imageUrl: faker.image.avatar(),
    phone: faker.helpers.maybe(() => faker.phone.number()),
    location: faker.location.city(),
    role: "user" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await db.insert(users).values(userRows);
  console.log("✅ Users seeded");

  /* -------------------- CATEGORIES -------------------- */
  console.log("🏷️ Seeding categories...");

  const categoryValues = [
    { name: "Skincare", slug: "skincare" },
    { name: "Hair Care", slug: "hair-care" },
    { name: "Makeup", slug: "makeup" },
    { name: "Fragrance", slug: "fragrance" },
    { name: "Body Care", slug: "body-care" },
  ];

  await db.insert(categories).values(categoryValues).onConflictDoNothing();

  const insertedCategories = await db.select().from(categories);

  /* -------------------- PRODUCTS -------------------- */
  const productRows = Array.from({ length: PRODUCT_COUNT }).map(() => ({
    id: faker.string.uuid(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    boughtFrom: faker.company.name(),
    askingPrice: Number(faker.finance.amount({ min: 10, max: 500 })),
    sellingReason: faker.helpers.maybe(() => faker.lorem.sentence()),
    expiryDate: faker.date.future({ years: 2 }).toISOString().split("T")[0],
    location: faker.location.city(),
    district: faker.location.city(),
    type: "sell" as const,
    noOfShares: 5,
    remainingShares: faker.number.int({ min: 1, max: 5 }),
    quantity: faker.commerce.productAdjective(),
    condition: faker.helpers.arrayElement(["new", "used", "sealed"]),
    status: faker.helpers.arrayElement(["validating", "active", "sold"]) as any,
    slug: faker.helpers.slugify(faker.commerce.productName()),
    userId: faker.helpers.arrayElement(userRows).id,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await db.insert(products).values(productRows);
  console.log("✅ Products seeded");

  /* -------------------- PRODUCT IMAGES -------------------- */
  const imageRows = productRows.flatMap((product) =>
    Array.from({ length: faker.number.int({ min: 1, max: 3 }) }).map(() => ({
      id: faker.string.uuid(),
      productId: product.id,
      userId: product.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  );

  await db.insert(productImages).values(imageRows);
  console.log("✅ Product images seeded");

  /* -------------------- CONNECTIONS -------------------- */
  const connectionRows = Array.from({ length: CONNECTION_COUNT }).map(() => {
    const product = faker.helpers.arrayElement(productRows);
    const buyer = faker.helpers.arrayElement(userRows);

    return {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      district: faker.location.city(),
      address: faker.location.streetAddress(),
      noOfShares: faker.number.int({ min: 1, max: product.noOfShares }),
      status: faker.helpers.arrayElement(["pending"]) as any,
      productId: product.id,
      buyerId: faker.helpers.maybe(() => buyer.id),
      guestBuyer: faker.datatype.boolean(),
      sellerId: product.userId,
      location: faker.location.city(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  await db.insert(connections).values(connectionRows);
  console.log("✅ Connections seeded");

  /* -------------------- TRANSACTIONS -------------------- */
  const transactionRows = Array.from({ length: TRANSACTION_COUNT }).map(() => {
    const product = faker.helpers.arrayElement(productRows);
    const buyer = faker.helpers.arrayElement(userRows);
    const seller = userRows.find((u) => u.id === product.userId)!;

    return {
      id: faker.string.uuid(),
      productName: product.title,
      buyerName: buyer.name,
      sellerName: seller.name,
      noOfShares: faker.number.int({ min: 1, max: product.noOfShares }),
      sharePrice: Number(faker.finance.amount({ min: 10, max: 300 })),
      productId: product.id,
      buyerId: buyer.id,
      sellerId: seller.id,
      createdAt: new Date(),
    };
  });

  await db.insert(transactions).values(transactionRows);
  console.log("✅ Transactions seeded");

  console.log("🌱 Seeding complete!");
}

await seed();
process.exit(0);
