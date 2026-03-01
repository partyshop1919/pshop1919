import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PRODUCTS = [
  {
    name: "Balon latex rosu",
    slug: "balon-latex-rosu",
    category: "Baloane latex",
    priceCents: 300,
    stock: 100,
    image: "/images/products/balon-latex-rosu.jpg",
    featured: true
  },
  {
    name: "Balon cifra 5",
    slug: "balon-cifra-5",
    category: "Baloane cifre",
    priceCents: 1500,
    stock: 100,
    image: "/images/products/Balon-latex-5.jpg",
    featured: true
  },
  {
    name: "Ghirlanda aniversara",
    slug: "ghirlanda-aniversara",
    category: "Ghirlande",
    priceCents: 2500,
    stock: 100,
    image: "/images/products/Ghirlanda-aniversara.jpg",
    featured: true
  },
  {
    name: "Set pahare petrecere",
    slug: "set-pahare-petrecere",
    category: "Decor petrecere",
    priceCents: 1200,
    stock: 100,
    image: "/images/products/set-pahare-petrecere.jpg",
    featured: false
  },
  {
    name: "Balon folie",
    slug: "balon-folie",
    category: "Baloane folie",
    priceCents: 1500,
    stock: 100,
    image: "/images/products/baloane-folie.png",
    featured: true
  },
  {
    name: "Confetti colorat",
    slug: "confetti-colorat",
    category: "Confetti",
    priceCents: 1500,
    stock: 100,
    image: "/images/products/confetti-pop.jpg",
    featured: false
  },
  {
    name: "Banner Happy New Year",
    slug: "banner-happy-new-year",
    category: "Bannere",
    priceCents: 1500,
    stock: 100,
    image: "/images/products/happynewyear.jpg",
    featured: false
  }
];

async function main() {
  for (const product of PRODUCTS) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      create: product,
      update: {
        name: product.name,
        category: product.category,
        priceCents: product.priceCents,
        stock: product.stock,
        image: product.image,
        featured: product.featured
      }
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
