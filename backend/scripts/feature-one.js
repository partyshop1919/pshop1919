import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const first = await prisma.product.findFirst({ orderBy: { createdAt: "asc" } });
  if (!first) {
    console.log("No products in DB");
    return;
  }

  const updated = await prisma.product.update({
    where: { id: first.id },
    data: { featured: true }
  });

  console.log("Featured set:", updated.id, updated.name);
}

main()
  .catch(console.error)
  .finally(async () => prisma.$disconnect());
