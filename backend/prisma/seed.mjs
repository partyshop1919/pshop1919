import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: "Balon latex rosu",
        slug: "balon-latex-rosu",
        priceCents: 300,
        stock: 100,
        image: "/images/products/Balon-latex-rosu.jpg"
      },
      {
        name: "Balon cifra 5",
        slug: "balon-cifra-5",
        priceCents: 1500,
        stock: 100,
        image: "/images/products/Balon-latex-5.jpg"
      },
      {
        name: "Ghirlanda aniversara",
        slug: "ghirlanda-aniversara",
        priceCents: 2500,
        stock: 100,
        image: "/images/products/Ghirlanda-aniversara.jpg"
      },
      {
        name: "Set pahare petrecere",
        slug: "set-pahare-petrecere",
        priceCents: 1200,
        stock: 100,
        image: "/images/products/set-pahare-petrecere.jpg"
      },
      {
        name: "Balon folie",
        slug: "balon-folie",
        priceCents: 1500,
        stock: 100,
        image: "/images/products/baloane-folie.png"
      },
      {
        name: "Confetti colorat",
        slug: "confetti-colorat",
        priceCents: 1500,
        stock: 100,
        image: "/images/products/confetti-pop.jpg"
      },
      {
        name: "Banner Happy New Year",
        slug: "banner-happy-new-year",
        priceCents: 1500,
        stock: 100,
        image: "/images/products/happynewyear.jpg"
      }
    ],
    skipDuplicates: true
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
