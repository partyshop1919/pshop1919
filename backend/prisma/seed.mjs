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
    category: "Accesorii pentru baloane",
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
    category: "Accesorii pentru baloane",
    priceCents: 2499,
    stock: 75,
    image: "/images/products/balloons.jpg",
    images: ["/images/products/balloons.jpg", "/images/products/baloane.jpg"],
    featured: false
  },
  {
    name: "Bandă pentru arc de baloane",
    slug: "banda-prindere-arc-baloane",
    category: "Accesorii pentru baloane",
    priceCents: 899,
    stock: 120,
    image: "/images/products/decor.png",
    images: ["/images/products/decor.png", "/images/products/baloane.jpg"],
    featured: false
  },
  {
    name: "Set greutăți pentru baloane - 10 bucăți",
    slug: "greutati-baloane-set-10",
    category: "Accesorii pentru baloane",
    priceCents: 1599,
    stock: 60,
    image: "/images/products/baloane-folie.png",
    images: ["/images/products/baloane-folie.png", "/images/products/balloons.jpg"],
    featured: false
  },
  {
    name: "Balon latex alb",
    slug: "balon-latex-alb",
    category: "Baloane latex",
    priceCents: 300,
    stock: 120,
    image: "/images/products/balon-latex-alb.jpeg",
    images: ["/images/products/balon-latex-alb.jpeg"],
    featured: false,
    description: "Balon latex alb, potrivit pentru aranjamente elegante, arcade de baloane si decoruri pentru aniversari, botezuri sau petreceri tematice."
  },
  {
    name: "Balon latex alb pastel",
    slug: "balon-latex-alb-pastel",
    category: "Baloane latex",
    priceCents: 300,
    stock: 120,
    image: "/images/products/balon-latex-alb-pal.jpeg",
    images: ["/images/products/balon-latex-alb-pal.jpeg"],
    featured: false,
    description: "Balon latex alb pastel cu aspect delicat, ideal pentru decoruri rafinate, candy bar, evenimente festive si combinatii cromatice soft."
  },
  {
    name: "Balon latex bleu",
    slug: "balon-latex-bleu",
    category: "Baloane latex",
    priceCents: 300,
    stock: 120,
    image: "/images/products/balon-latex-bleu.jpeg",
    images: ["/images/products/balon-latex-bleu.jpeg"],
    featured: false,
    description: "Balon latex bleu pentru decoruri vesele si moderne, perfect pentru petreceri aniversare, baby shower si arcade colorate."
  },
  {
    name: "Balon latex bleu deschis",
    slug: "balon-latex-bleu-deschis",
    category: "Baloane latex",
    priceCents: 300,
    stock: 120,
    image: "/images/products/balon-latex-bleu-deschis.jpeg",
    images: ["/images/products/balon-latex-bleu-deschis.jpeg"],
    featured: false,
    description: "Balon latex bleu deschis, recomandat pentru decoruri aerisite si combinatii pastelate la petreceri, botezuri si evenimente speciale."
  },
  {
    name: "Balon latex galben",
    slug: "balon-latex-galben",
    category: "Baloane latex",
    priceCents: 300,
    stock: 120,
    image: "/images/products/balon-latex-galben.jpeg",
    images: ["/images/products/balon-latex-galben.jpeg"],
    featured: false,
    description: "Balon latex galben cu aspect luminos, potrivit pentru decoruri energice, aniversari pentru copii si petreceri pline de culoare."
  },
  {
    name: "Balon latex mov",
    slug: "balon-latex-mov",
    category: "Baloane latex",
    priceCents: 300,
    stock: 120,
    image: "/images/products/balon-latex-mov.jpeg",
    images: ["/images/products/balon-latex-mov.jpeg"],
    featured: false,
    description: "Balon latex mov pentru decoruri elegante si creative, usor de integrat in arcade, buchete de baloane sau aranjamente tematice."
  },
  {
    name: "Balon latex portocaliu",
    slug: "balon-latex-portocaliu",
    category: "Baloane latex",
    priceCents: 300,
    stock: 120,
    image: "/images/products/balon-latex-portocaliu.jpeg",
    images: ["/images/products/balon-latex-portocaliu.jpeg"],
    featured: false,
    description: "Balon latex portocaliu, ideal pentru decoruri calde si vibrante la petreceri aniversare, evenimente tematice si aranjamente festive."
  },
  {
    name: "Balon latex roz",
    slug: "balon-latex-roz",
    category: "Baloane latex",
    priceCents: 300,
    stock: 120,
    image: "/images/products/balon-latex-roz.jpeg",
    images: ["/images/products/balon-latex-roz.jpeg"],
    featured: false,
    description: "Balon latex roz pentru decoruri jucause si elegante, potrivit pentru zile de nastere, petreceri tematice si candy bar."
  },
  {
    name: "Balon latex roz deschis",
    slug: "balon-latex-roz-deschis",
    category: "Baloane latex",
    priceCents: 300,
    stock: 120,
    image: "/images/products/balon-latex-roz-deschis.jpeg",
    images: ["/images/products/balon-latex-roz-deschis.jpeg"],
    featured: false,
    description: "Balon latex roz deschis cu nuanta delicata, potrivit pentru decoruri pastelate, petreceri feminine si evenimente speciale."
  },
  {
    name: "Balon latex roz pal",
    slug: "balon-latex-roz-pal",
    category: "Baloane latex",
    priceCents: 300,
    stock: 120,
    image: "/images/products/balon-latex-roz-pal.jpeg",
    images: ["/images/products/balon-latex-roz-pal.jpeg"],
    featured: false,
    description: "Balon latex roz pal pentru decoruri romantice si rafinate, ideal pentru botez, aniversari si aranjamente in tonuri pastel."
  },
  {
    name: "Balon latex verde",
    slug: "balon-latex-verde",
    category: "Baloane latex",
    priceCents: 300,
    stock: 120,
    image: "/images/products/balon-latex-verde.jpeg",
    images: ["/images/products/balon-latex-verde.jpeg"],
    featured: false,
    description: "Balon latex verde, potrivit pentru decoruri fresh, tematici naturale, aniversari si arcade spectaculoase de baloane."
  },
  {
    name: "Balon latex verde deschis",
    slug: "balon-latex-verde-deschis",
    category: "Baloane latex",
    priceCents: 300,
    stock: 120,
    image: "/images/products/balon-latex-verde-deschis.jpeg",
    images: ["/images/products/balon-latex-verde-deschis.jpeg"],
    featured: false,
    description: "Balon latex verde deschis cu aspect pastel, recomandat pentru decoruri luminoase si combinatii cromatice moderne."
  },
  {
    name: "Banda pentru arcada de baloane",
    slug: "banda-pentru-arcada-de-baloane",
    category: "Accesorii pentru baloane",
    priceCents: 1299,
    stock: 90,
    image: "/images/products/banda-pentru-arcada.jpeg",
    images: ["/images/products/banda-pentru-arcada.jpeg"],
    featured: false,
    description: "Banda pentru arcada de baloane, utila pentru montarea rapida si usoara a decorurilor tip arcada la aniversari si evenimente."
  },
  {
    name: "Bete pentru rozete si baloane",
    slug: "bete-pentru-rozete-si-baloane",
    category: "Accesorii pentru baloane",
    priceCents: 999,
    stock: 100,
    image: "/images/products/bete-rozete.jpeg",
    images: ["/images/products/bete-rozete.jpeg"],
    featured: false,
    description: "Set de bete pentru rozete si baloane, ideal pentru realizarea decorurilor personalizate si a aranjamentelor de petrecere."
  },
  {
    name: "Buline adezive pentru baloane",
    slug: "buline-adezive-pentru-baloane",
    category: "Accesorii pentru baloane",
    priceCents: 899,
    stock: 140,
    image: "/images/products/buline-adezive-pentru-baloane.jpg",
    images: ["/images/products/buline-adezive-pentru-baloane.jpg"],
    featured: false,
    description: "Buline adezive pentru baloane, accesorii practice pentru prindere, fixare si realizarea rapida a decorurilor festive."
  },
  {
    name: "Pompa electrica de baloane",
    slug: "pompa-electrica-de-baloane",
    category: "Accesorii pentru baloane",
    priceCents: 7999,
    stock: 35,
    image: "/images/products/pompa-electrica-de-baloane.jpeg",
    images: ["/images/products/pompa-electrica-de-baloane.jpeg"],
    featured: true,
    description: "Pompa electrica de baloane pentru umflare rapida si eficienta, ideala pentru pregatirea decorurilor de petrecere si a aranjamentelor mari."
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

