import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PRODUCTS = [
  {
    name: "Balon latex roșu",
    slug: "balon-latex-rosu",
    category: "Baloane latex",
    priceCents: 300,
    stock: 100,
    image: "/images/products/balon-latex-rosu.jpg",
    images: [
      "/images/products/balon-latex-rosu.jpg",
      "/images/products/baloane.jpg",
      "/images/products/balloons.jpg"
    ],
    featured: true
  },
  {
    name: "Balon cifră 5",
    slug: "balon-cifra-5",
    category: "Baloane cifre",
    priceCents: 1500,
    stock: 100,
    image: "/images/products/Balon-latex-5.jpg",
    images: [
      "/images/products/Balon-latex-5.jpg",
      "/images/products/baloane-folie.png",
      "/images/products/baloane.jpg"
    ],
    featured: true
  },
  {
    name: "Ghirlandă aniversară",
    slug: "ghirlanda-aniversara",
    category: "Ghirlande",
    priceCents: 2500,
    stock: 100,
    image: "/images/products/Ghirlanda-aniversara.jpg",
    images: [
      "/images/products/Ghirlanda-aniversara.jpg",
      "/images/products/decor.png",
      "/images/products/Set 3 ghirlande de hartie colorate.png"
    ],
    featured: true
  },
  {
    name: "Set pahare petrecere",
    slug: "set-pahare-petrecere",
    category: "Pahare și farfurii",
    priceCents: 1200,
    stock: 100,
    image: "/images/products/set-pahare-petrecere.jpg",
    images: [
      "/images/products/set-pahare-petrecere.jpg",
      "/images/products/set-farfurii-petrecere.jpg",
      "/images/products/decor.png"
    ],
    featured: false
  },
  {
    name: "Balon folie",
    slug: "balon-folie",
    category: "Baloane folie",
    priceCents: 1500,
    stock: 100,
    image: "/images/products/baloane-folie.png",
    images: [
      "/images/products/baloane-folie.png",
      "/images/products/baloane.jpg",
      "/images/products/balloons.jpg"
    ],
    featured: true
  },
  {
    name: "Colorful Confetti",
    slug: "confetti-colorat",
    category: "Confetti",
    priceCents: 1500,
    stock: 100,
    image: "/images/products/confetti-pop.jpg",
    images: [
      "/images/products/confetti-pop.jpg",
      "/images/products/confetti.jpg",
      "/images/products/decor.png"
    ],
    featured: false
  },
  {
    name: "Banner La mulți ani",
    slug: "banner-happy-new-year",
    category: "Bannere",
    priceCents: 1500,
    stock: 100,
    image: "/images/products/happynewyear.jpg",
    images: [
      "/images/products/happynewyear.jpg",
      "/images/products/banner-la-multi-ani-premium.jpg",
      "/images/products/decor.png"
    ],
    featured: false
  },
  {
    name: "Set lumânări aniversare",
    slug: "set-lumanari-aniversare",
    category: "Lumânări",
    priceCents: 799,
    stock: 80,
    image: "/images/products/candles.jpeg",
    images: ["/images/products/candles.jpeg", "/images/products/decor.png"],
    featured: false
  },
  {
    name: "Set coifuri petrecere",
    slug: "set-coifuri-petrecere",
    category: "Coifuri și accesorii",
    priceCents: 1299,
    stock: 80,
    image: "/images/products/hats.jpg",
    images: ["/images/products/hats.jpg", "/images/products/decor.png"],
    featured: false
  },
  {
    name: "Set farfurii petrecere",
    slug: "set-farfurii-petrecere",
    category: "Pahare și farfurii",
    priceCents: 1399,
    stock: 80,
    image: "/images/products/set-farfurii-petrecere.jpg",
    images: [
      "/images/products/set-farfurii-petrecere.jpg",
      "/images/products/set-pahare-petrecere.jpg"
    ],
    featured: false
  },
  {
    name: "Set baloane pastel - 50 bucăți",
    slug: "set-baloane-pastel-50-buc",
    category: "Baloane latex",
    priceCents: 2999,
    stock: 80,
    image: "/images/products/set-baloane-pastel-50-buc.jpg",
    images: [
      "/images/products/set-baloane-pastel-50-buc.jpg",
      "/images/products/baloane.jpg",
      "/images/products/balloons.jpg"
    ],
    featured: true
  },
  {
    name: "Arc baloane DIY - 120 piese",
    slug: "arc-baloane-diy-120-piese",
    category: "Baloane latex",
    priceCents: 8999,
    stock: 40,
    image: "/images/products/arc-baloane-diy-120-piese.jpg",
    images: [
      "/images/products/arc-baloane-diy-120-piese.jpg",
      "/images/products/baloane.jpg",
      "/images/products/decor.png"
    ],
    featured: true
  },
  {
    name: "Banner premium La mulți ani",
    slug: "banner-la-multi-ani-premium",
    category: "Bannere",
    priceCents: 2499,
    stock: 70,
    image: "/images/products/banner-la-multi-ani-premium.jpg",
    images: [
      "/images/products/banner-la-multi-ani-premium.jpg",
      "/images/products/happynewyear.jpg"
    ],
    featured: false
  },
  {
    name: "Tun confetti multicolor - 40 cm",
    slug: "tun-confetti-multicolor-40cm",
    category: "Confetti",
    priceCents: 1999,
    stock: 100,
    image: "/images/products/tun-confetti-multicolor-40cm.jpg",
    images: [
      "/images/products/tun-confetti-multicolor-40cm.jpg",
      "/images/products/confetti-pop.jpg",
      "/images/products/confetti.jpg"
    ],
    featured: false
  },
  {
    name: "Set pahare și farfurii - 24 persoane",
    slug: "set-pahare-si-farfurii-24-persoane",
    category: "Pahare și farfurii",
    priceCents: 4599,
    stock: 60,
    image: "/images/products/set-pahare-si-farfurii-24-persoane.jpg",
    images: [
      "/images/products/set-pahare-si-farfurii-24-persoane.jpg",
      "/images/products/set-farfurii-petrecere.jpg",
      "/images/products/set-pahare-petrecere.jpg"
    ],
    featured: false
  },
  {
    name: "Pompă manuală pentru baloane",
    slug: "pompa-manuala-baloane",
    category: "Coifuri și accesorii",
    priceCents: 2499,
    stock: 75,
    image: "/images/products/balloons.jpg",
    images: ["/images/products/balloons.jpg", "/images/products/baloane.jpg"],
    featured: false
  },
  {
    name: "Bandă pentru arc de baloane",
    slug: "banda-prindere-arc-baloane",
    category: "Coifuri și accesorii",
    priceCents: 899,
    stock: 120,
    image: "/images/products/decor.png",
    images: ["/images/products/decor.png", "/images/products/baloane.jpg"],
    featured: false
  },
  {
    name: "Set greutăți pentru baloane - 10 bucăți",
    slug: "greutati-baloane-set-10",
    category: "Coifuri și accesorii",
    priceCents: 1599,
    stock: 60,
    image: "/images/products/baloane-folie.png",
    images: ["/images/products/baloane-folie.png", "/images/products/balloons.jpg"],
    featured: false
  },
];

function buildDescription(product) {
  const name = String(product?.name || "Produs");
  const category = String(product?.category || "articole de petrecere");
  return `${name} face parte din colecția ${category} și este potrivit pentru aniversări, petreceri tematice și evenimente speciale.`;
}

async function main() {
  for (const product of PRODUCTS) {
    const { images, ...base } = product;
    const description = String(base.description || "").trim() || buildDescription(base);
    const saved = await prisma.product.upsert({
      where: { slug: base.slug },
      create: { ...base, description },
      update: {
        name: base.name,
        description,
        category: base.category,
        priceCents: base.priceCents,
        stock: base.stock,
        image: base.image,
        featured: base.featured
      }
    });

    const gallery = Array.isArray(images) ? images.filter(Boolean) : [base.image].filter(Boolean);

    await prisma.productImage.deleteMany({ where: { productId: saved.id } });
    if (gallery.length > 0) {
      await prisma.productImage.createMany({
        data: gallery.map((url, idx) => ({
          productId: saved.id,
          url: String(url),
          sortOrder: idx
        }))
      });
    }
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
