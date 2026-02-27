import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(input) {
  return String(input || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

async function ensureUniqueSlug(base, excludeId = null) {
  const cleanBase = slugify(base) || "product";
  let slug = cleanBase;
  let i = 2;

  while (true) {
    const exists = await prisma.product.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {})
      },
      select: { id: true }
    });

    if (!exists) return slug;
    slug = `${cleanBase}-${i++}`;
  }
}

async function main() {
  const products = await prisma.product.findMany({
    where: { slug: null },
    select: { id: true, name: true }
  });

  for (const p of products) {
    const slug = await ensureUniqueSlug(p.name, p.id);
    await prisma.product.update({
      where: { id: p.id },
      data: { slug }
    });
    console.log("SET", p.name, "->", slug);
  }

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
