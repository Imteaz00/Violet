import { faker } from "@faker-js/faker";
import { productImages } from "./src/modules/productImages/productImages.schema";
import { products } from "./src/modules/products/products.schema";
import { users } from "./src/modules/users/users.schema";
import { categories } from "./src/modules/categories/categories.schema";
import { db } from "./src/config/db";

const USERS_COUNT = 10;
const PRODUCTS_PER_USER = 3;
const IMAGES_PER_PRODUCT = 2;

async function seed() {
  console.log("🌱 Starting database seed...");

  /* ---------- CLEAN TABLES (ORDER MATTERS) ---------- */
  await db.delete(productImages);
  await db.delete(products);
  await db.delete(users);
  await db.delete(categories);
  // categories are static → do NOT delete

  /* ---------- CATEGORIES ---------- */
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

  /* ---------- USERS ---------- */
  console.log("👤 Seeding users...");

  const insertedUsers = await db
    .insert(users)
    .values(
      Array.from({ length: USERS_COUNT }).map(() => ({
        id: `user_${faker.string.uuid()}`,
        email: faker.internet.email(),
        name: faker.person.fullName(),
        imageUrl: faker.helpers.maybe(() => faker.image.avatar()),
        phone: faker.helpers.maybe(() => faker.phone.number()),
        location: faker.helpers.arrayElement(["Dhaka", "Chittagong", "Sylhet", "Rajshahi"]),
        balance: 0,
      }))
    )
    .returning();

  /* ---------- PRODUCTS ---------- */
  console.log("📦 Seeding products...");

  const productValues = insertedUsers.flatMap((user) =>
    Array.from({ length: PRODUCTS_PER_USER }).map(() => {
      const type = faker.helpers.arrayElement(["sell", "share"]) as "sell" | "share";

      const noOfShares = type === "sell" ? 1 : faker.number.int({ min: 2, max: 5 });

      const remainingShares = type === "sell" ? 1 : faker.number.int({ min: 1, max: noOfShares });

      return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        boughtFrom: faker.company.name(),
        sellingReason: faker.helpers.maybe(() => faker.lorem.sentence()),

        expiryDate: faker.date.future({ years: 2 }).toISOString().split("T")[0],

        location: user.location ?? "Dhaka",
        userId: user.id,

        askingPrice: faker.number.int({ min: 300, max: 5000 }),

        type,
        noOfShares,
        remainingShares,

        quantity: faker.helpers.arrayElement(["80%", "90%", "95%"]),
        condition: faker.helpers.arrayElement(["Like New", "Very Good", "Excellent"]),

        status: "validating" as "validating",
        categoryId: faker.helpers.arrayElement(insertedCategories).slug,
      };
    })
  );

  const insertedProducts = await db.insert(products).values(productValues).returning();

  /* ---------- PRODUCT IMAGES ---------- */
  console.log("🖼️ Seeding product images...");

  await db.insert(productImages).values(
    insertedProducts.flatMap((product) =>
      Array.from({ length: IMAGES_PER_PRODUCT }).map(() => ({
        id: `img_${faker.string.uuid()}`,
        productId: product.id,
        userId: product.userId,
      }))
    )
  );

  console.log("✅ Database seeded successfully");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed", err);
  process.exit(1);
});
