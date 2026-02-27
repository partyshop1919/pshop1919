import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: "Balon latex roșu",
        priceCents: 300,
        stock: 100,
        image: "/images/products/Balon-latex-rosu.jpg"
      },
      {
        name: "Balon cifră 5",
        priceCents: 1500,
        stock: 100,
        image: "/images/products/Balon-latex-5.jpg"
      },
      {
        name: "Ghirlandă aniversară",
        priceCents: 2500,
        stock: 100,
        image: "/images/products/Ghirlanda-aniversara.jpg"
      },
      {
        name: "Set pahare petrecere",
        priceCents: 1200,
        stock: 100,
        image: "/images/products/set-pahare-petrecere.jpg"
      },
      {
        name: "Balon folie",
        priceCents: 1500,
        stock: 100,
        image: "/images/products/baloane-folie.png"
      },
      {
        name: "Confetti colorat",
        priceCents: 1500,
        stock: 100,
        image: "/images/products/confetti-pop.jpg"
      },
      {
        name: "Banner Happy New Year",
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
