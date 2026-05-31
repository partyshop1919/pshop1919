import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PRODUCTS = [
  {
    name: "Red Latex Balloon",
    slug: "balon-latex-rosu",
    category: "Latex Balloons",
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
    name: "Number 5 Balloon",
    slug: "balon-cifra-5",
    category: "Number Balloons",
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
    name: "Birthday Garland",
    slug: "ghirlanda-aniversara",
    category: "Garlands",
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
    name: "Party Cups Set",
    slug: "set-pahare-petrecere",
    category: "Cups & Plates",
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
    name: "Foil Balloon",
    slug: "balon-folie",
    category: "Foil Balloons",
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
    name: "Banner Happy New Year",
    slug: "banner-happy-new-year",
    category: "Banners",
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
    name: "Birthday Candle Set",
    slug: "set-lumanari-aniversare",
    category: "Candles",
    priceCents: 799,
    stock: 80,
    image: "/images/products/candles.jpeg",
    images: ["/images/products/candles.jpeg", "/images/products/decor.png"],
    featured: false
  },
  {
    name: "Party Hats Set",
    slug: "set-coifuri-petrecere",
    category: "Party Hats & Accessories",
    priceCents: 1299,
    stock: 80,
    image: "/images/products/hats.jpg",
    images: ["/images/products/hats.jpg", "/images/products/decor.png"],
    featured: false
  },
  {
    name: "Party Plates Set",
    slug: "set-farfurii-petrecere",
    category: "Cups & Plates",
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
    name: "Pastel Balloon Set - 50 Pieces",
    slug: "set-baloane-pastel-50-buc",
    category: "Latex Balloons",
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
    name: "DIY Balloon Arch - 120 Pieces",
    slug: "arc-baloane-diy-120-piese",
    category: "Latex Balloons",
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
    name: "Premium Happy Birthday Banner",
    slug: "banner-la-multi-ani-premium",
    category: "Banners",
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
    name: "Multicolor Confetti Cannon - 40 cm",
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
    name: "Cups and Plates Set - 24 Guests",
    slug: "set-pahare-si-farfurii-24-persoane",
    category: "Cups & Plates",
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
    name: "Manual Balloon Pump",
    slug: "pompa-manuala-baloane",
    category: "Party Hats & Accessories",
    priceCents: 2499,
    stock: 75,
    image: "/images/products/balloons.jpg",
    images: ["/images/products/balloons.jpg", "/images/products/baloane.jpg"],
    featured: false
  },
  {
    name: "Balloon Arch Strip",
    slug: "banda-prindere-arc-baloane",
    category: "Party Hats & Accessories",
    priceCents: 899,
    stock: 120,
    image: "/images/products/decor.png",
    images: ["/images/products/decor.png", "/images/products/baloane.jpg"],
    featured: false
  },
  {
    name: "Balloon Weights Set - 10 Pieces",
    slug: "greutati-baloane-set-10",
    category: "Party Hats & Accessories",
    priceCents: 1599,
    stock: 60,
    image: "/images/products/baloane-folie.png",
    images: ["/images/products/baloane-folie.png", "/images/products/balloons.jpg"],
    featured: false
  },
];

function buildDescription(product) {
  const name = String(product?.name || "Product");
  const category = String(product?.category || "party supplies");
  return `${name} is part of the ${category} collection and is suitable for birthdays, themed celebrations, and special events.`;
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
