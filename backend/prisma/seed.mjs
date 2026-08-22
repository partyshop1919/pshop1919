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
  {
    name: "Balon folie La multi ani auriu",
    slug: "balon-folie-la-multi-ani-auriu",
    category: "Baloane folie",
    priceCents: 2499,
    stock: 40,
    image: "/images/products/balon-folie-lamultiani-auriu.png",
    images: ["/images/products/balon-folie-lamultiani-auriu.png"],
    featured: true,
    description: "Balon folie cu mesaj La multi ani, in nuanta aurie, potrivit pentru aniversari elegante si decoruri festive."
  },
  {
    name: "Balon folie La multi ani argintiu",
    slug: "balon-folie-la-multi-ani-argintiu",
    category: "Baloane folie",
    priceCents: 2499,
    stock: 40,
    image: "/images/products/balon-folie-lamultiani-argintiu.png",
    images: ["/images/products/balon-folie-lamultiani-argintiu.png"],
    featured: false,
    description: "Balon folie cu mesaj La multi ani, in nuanta argintie, ideal pentru petreceri moderne si aniversari speciale."
  },
  {
    name: "Balon folie La multi ani rosu",
    slug: "balon-folie-la-multi-ani-rosu",
    category: "Baloane folie",
    priceCents: 2499,
    stock: 40,
    image: "/images/products/balon-folie-lamultiani-rosu.png",
    images: ["/images/products/balon-folie-lamultiani-rosu.png"],
    featured: false,
    description: "Balon folie La multi ani in rosu, usor de integrat in decorurile aniversare vibrante si pline de energie."
  },
  {
    name: "Balon folie La multi ani mov",
    slug: "balon-folie-la-multi-ani-mov",
    category: "Baloane folie",
    priceCents: 2499,
    stock: 40,
    image: "/images/products/balon-folie-lamultiani-mov.png",
    images: ["/images/products/balon-folie-lamultiani-mov.png"],
    featured: false,
    description: "Balon folie La multi ani in mov, potrivit pentru aniversari elegante si decoruri colorate."
  },
  {
    name: "Balon folie Happy Birthday argintiu",
    slug: "balon-folie-happy-birthday-argintiu",
    category: "Baloane folie",
    priceCents: 2299,
    stock: 45,
    image: "/images/products/balon-folie-happybirthday-argintiu.png",
    images: ["/images/products/balon-folie-happybirthday-argintiu.png"],
    featured: false,
    description: "Balon folie Happy Birthday argintiu, ideal pentru decoruri aniversare moderne si elegante."
  },
  {
    name: "Balon folie Happy Birthday auriu",
    slug: "balon-folie-happy-birthday-auriu",
    category: "Baloane folie",
    priceCents: 2299,
    stock: 45,
    image: "/images/products/balon-folie-happybirthday-gold.png",
    images: ["/images/products/balon-folie-happybirthday-gold.png"],
    featured: false,
    description: "Balon folie Happy Birthday auriu, perfect pentru petreceri festive cu accent elegant."
  },
  {
    name: "Balon folie Happy Birthday mov",
    slug: "balon-folie-happy-birthday-mov",
    category: "Baloane folie",
    priceCents: 2299,
    stock: 45,
    image: "/images/products/balon-folie-happybirthday-mov.png",
    images: ["/images/products/balon-folie-happybirthday-mov.png"],
    featured: false,
    description: "Balon folie Happy Birthday mov, potrivit pentru aniversari vesele si decoruri personalizate."
  },
  {
    name: "Balon folie Happy Birthday multicolor",
    slug: "balon-folie-happy-birthday-multicolor",
    category: "Baloane folie",
    priceCents: 2399,
    stock: 45,
    image: "/images/products/balon-folie-happybirthday-multicolor.png",
    images: ["/images/products/balon-folie-happybirthday-multicolor.png"],
    featured: true,
    description: "Balon folie Happy Birthday multicolor, excelent pentru decoruri jucause si petreceri pline de culoare."
  },
  {
    name: "Set 13 baloane folie Happy Birthday",
    slug: "set-13-baloane-folie-happy-birthday",
    category: "Baloane folie",
    priceCents: 4999,
    stock: 25,
    image: "/images/products/balon-folie-happybirthday-13buc.png",
    images: ["/images/products/balon-folie-happybirthday-13buc.png"],
    featured: true,
    description: "Set de 13 baloane folie Happy Birthday, gata pentru un decor aniversar complet si spectaculos."
  },
  {
    name: "Set 8 baloane Happy Birthday",
    slug: "set-8-baloane-happy-birthday",
    category: "Baloane folie",
    priceCents: 3499,
    stock: 30,
    image: "/images/products/set-8-baloane-happybirthday.png",
    images: ["/images/products/set-8-baloane-happybirthday.png"],
    featured: false,
    description: "Set de 8 baloane Happy Birthday pentru decoruri aniversare rapide si usor de montat."
  },
  {
    name: "Set 6 baloane folie celebrare",
    slug: "set-6-baloane-folie-celebrare",
    category: "Baloane folie",
    priceCents: 2999,
    stock: 30,
    image: "/images/products/balon-folie-6buc-celebrare.png",
    images: ["/images/products/balon-folie-6buc-celebrare.png"],
    featured: false,
    description: "Set de 6 baloane folie pentru celebrare, potrivit pentru aniversari si evenimente festive."
  },
  {
    name: "Balon folie 1st Birthday albastru",
    slug: "balon-folie-1st-birthday-albastru",
    category: "Baloane folie",
    priceCents: 2599,
    stock: 35,
    image: "/images/products/balon-folie-1stbirthday-albastru.png",
    images: ["/images/products/balon-folie-1stbirthday-albastru.png"],
    featured: false,
    description: "Balon folie 1st Birthday albastru, ideal pentru prima aniversare si decoruri tematice pentru baietei."
  },
  {
    name: "Balon folie 1st Birthday roz",
    slug: "balon-folie-1st-birthday-roz",
    category: "Baloane folie",
    priceCents: 2599,
    stock: 35,
    image: "/images/products/balon-folie-1stbirthday-roz.png",
    images: ["/images/products/balon-folie-1stbirthday-roz.png"],
    featured: false,
    description: "Balon folie 1st Birthday roz, potrivit pentru prima aniversare si decoruri delicate pentru fetite."
  },
  {
    name: "Set balon Hello Baby roz",
    slug: "set-balon-hello-baby-roz",
    category: "Baloane folie",
    priceCents: 2999,
    stock: 25,
    image: "/images/products/set-balon-hellobaby-roz.png",
    images: ["/images/products/set-balon-hellobaby-roz.png"],
    featured: false,
    description: "Set de baloane Hello Baby roz, perfect pentru baby shower, botez sau prima petrecere a bebelusului."
  },
  {
    name: "Balon It's a Boy",
    slug: "balon-its-a-boy",
    category: "Baloane folie",
    priceCents: 1999,
    stock: 35,
    image: "/images/products/balon-itsaboy.jpg",
    images: ["/images/products/balon-itsaboy.jpg"],
    featured: false,
    description: "Balon foil It's a Boy pentru baby shower, gender reveal sau decoruri de bun venit pentru baietel."
  },
  {
    name: "Balon It's a Girl model 1",
    slug: "balon-its-a-girl-model-1",
    category: "Baloane folie",
    priceCents: 1999,
    stock: 35,
    image: "/images/products/balon-itsagirl1.jpg",
    images: ["/images/products/balon-itsagirl1.jpg"],
    featured: false,
    description: "Balon It's a Girl pentru baby shower sau petreceri de bun venit, cu design jucaus si festiv."
  },
  {
    name: "Balon It's a Girl model 2",
    slug: "balon-its-a-girl-model-2",
    category: "Baloane folie",
    priceCents: 1999,
    stock: 35,
    image: "/images/products/balon-itsagirl2.jpg",
    images: ["/images/products/balon-itsagirl2.jpg"],
    featured: false,
    description: "Balon It's a Girl, ideal pentru decoruri baby shower, botez sau prima aniversare."
  },
  {
    name: "Balon Baby Boy",
    slug: "balon-baby-boy",
    category: "Baloane folie",
    priceCents: 1899,
    stock: 30,
    image: "/images/products/babyboy.png",
    images: ["/images/products/babyboy.png"],
    featured: false,
    description: "Balon Baby Boy pentru decoruri tematice, baby shower si evenimente speciale dedicate baieteilor."
  },
  {
    name: "Balon Baby Girl",
    slug: "balon-baby-girl",
    category: "Baloane folie",
    priceCents: 1899,
    stock: 30,
    image: "/images/products/babygirl.png",
    images: ["/images/products/babygirl.png"],
    featured: false,
    description: "Balon Baby Girl pentru decoruri tematice, baby shower si petreceri dedicate fetitelor."
  },
  {
    name: "Balon baby model 1",
    slug: "balon-baby-model-1",
    category: "Baloane folie",
    priceCents: 1899,
    stock: 30,
    image: "/images/products/balon-bebe.jpg",
    images: ["/images/products/balon-bebe.jpg"],
    featured: false,
    description: "Balon baby pentru decoruri dulci si festive la botez, baby shower sau prima petrecere."
  },
  {
    name: "Balon baby model 2",
    slug: "balon-baby-model-2",
    category: "Baloane folie",
    priceCents: 1899,
    stock: 30,
    image: "/images/products/balon-bebe2.jpg",
    images: ["/images/products/balon-bebe2.jpg"],
    featured: false,
    description: "Balon baby cu design vesel, potrivit pentru decoruri pentru nou-nascuti si petreceri tematice."
  },
  {
    name: "Set boy or girl",
    slug: "set-boy-or-girl",
    category: "Baloane folie",
    priceCents: 2999,
    stock: 20,
    image: "/images/products/boy-girl.jpg",
    images: ["/images/products/boy-girl.jpg"],
    featured: false,
    description: "Set de baloane Boy or Girl, ideal pentru gender reveal si decoruri surpriza."
  },
  {
    name: "Balon gender reveal",
    slug: "balon-gender-reveal",
    category: "Baloane folie",
    priceCents: 2199,
    stock: 25,
    image: "/images/products/balon-gender.jpg",
    images: ["/images/products/balon-gender.jpg"],
    featured: false,
    description: "Balon pentru gender reveal, perfect pentru anunturi speciale si decoruri tematice de petrecere."
  },
  {
    name: "Balon folie avion",
    slug: "balon-folie-avion",
    category: "Baloane folie",
    priceCents: 2299,
    stock: 25,
    image: "/images/products/balon-folie-avion.png",
    images: ["/images/products/balon-folie-avion.png"],
    featured: false,
    description: "Balon folie in forma de avion, potrivit pentru petreceri tematice si decoruri pentru copii."
  },
  {
    name: "Balon folie masina",
    slug: "balon-folie-masina",
    category: "Baloane folie",
    priceCents: 2299,
    stock: 25,
    image: "/images/products/balon-folie-masina.png",
    images: ["/images/products/balon-folie-masina.png"],
    featured: false,
    description: "Balon folie in forma de masina, ideal pentru aniversari tematice si decoruri de petrecere pentru copii."
  },
  {
    name: "Balon folie minge",
    slug: "balon-folie-minge",
    category: "Baloane folie",
    priceCents: 1999,
    stock: 25,
    image: "/images/products/balon-folie-minge.png",
    images: ["/images/products/balon-folie-minge.png"],
    featured: false,
    description: "Balon folie in forma de minge, excelent pentru petreceri sportive si aniversari energice."
  },
  {
    name: "Set baloane mingi",
    slug: "set-baloane-mingi",
    category: "Baloane folie",
    priceCents: 3299,
    stock: 20,
    image: "/images/products/set-baloane-mingi.png",
    images: ["/images/products/set-baloane-mingi.png"],
    featured: false,
    description: "Set de baloane cu tema mingi, potrivit pentru petreceri cu tematica sportiva si decoruri dinamice."
  },
  {
    name: "Balon leu",
    slug: "balon-leu",
    category: "Baloane folie",
    priceCents: 2199,
    stock: 25,
    image: "/images/products/balon-leu1.png",
    images: ["/images/products/balon-leu1.png"],
    featured: false,
    description: "Balon folie cu leu, excelent pentru petreceri tematice safari si decoruri pentru copii."
  },
  {
    name: "Balon girafa",
    slug: "balon-girafa",
    category: "Baloane folie",
    priceCents: 2199,
    stock: 25,
    image: "/images/products/girafa1.jpeg",
    images: ["/images/products/girafa1.jpeg"],
    featured: false,
    description: "Balon girafa cu design simpatic, potrivit pentru tematici safari, zoo si aniversari pentru copii."
  },
  {
    name: "Balon tigru",
    slug: "balon-tigru",
    category: "Baloane folie",
    priceCents: 2199,
    stock: 25,
    image: "/images/products/balon-tigru2.png",
    images: ["/images/products/balon-tigru2.png"],
    featured: false,
    description: "Balon folie cu tigru, potrivit pentru decoruri tematice cu animale si petreceri energice."
  },
  {
    name: "Balon cheeta",
    slug: "balon-cheeta",
    category: "Baloane folie",
    priceCents: 2199,
    stock: 25,
    image: "/images/products/balon-cheeta1.png",
    images: ["/images/products/balon-cheeta1.png"],
    featured: false,
    description: "Balon cheeta cu tema safari, ideal pentru decoruri creative si petreceri pentru copii."
  },
  {
    name: "Balon fluture",
    slug: "balon-fluture",
    category: "Baloane folie",
    priceCents: 1999,
    stock: 25,
    image: "/images/products/balon-fluture.jpg",
    images: ["/images/products/balon-fluture.jpg"],
    featured: false,
    description: "Balon folie in forma de fluture, potrivit pentru decoruri delicate, primavaratice si aniversari."
  },
  {
    name: "Balon dinozaur",
    slug: "balon-dinozaur",
    category: "Baloane folie",
    priceCents: 2299,
    stock: 25,
    image: "/images/products/dino1.jpeg",
    images: ["/images/products/dino1.jpeg"],
    featured: false,
    description: "Balon dinozaur pentru petreceri tematice cu dinozauri si decoruri spectaculoase pentru copii."
  },
  {
    name: "Balon dinozaur model 2",
    slug: "balon-dinozaur-model-2",
    category: "Baloane folie",
    priceCents: 2299,
    stock: 25,
    image: "/images/products/balon-dino2.png",
    images: ["/images/products/balon-dino2.png"],
    featured: false,
    description: "Balon dinozaur cu design vesel, ideal pentru aniversari tematice si decoruri pentru copii."
  },
  {
    name: "Set 5 baloane dinozauri",
    slug: "set-5-baloane-dinozauri",
    category: "Baloane folie",
    priceCents: 3999,
    stock: 20,
    image: "/images/products/set-5-baloane-dino.png",
    images: ["/images/products/set-5-baloane-dino.png"],
    featured: false,
    description: "Set de 5 baloane cu tema dinozauri, potrivit pentru decor aniversar complet si distractiv."
  },
  {
    name: "Set 5 baloane dinozauri model 2",
    slug: "set-5-baloane-dinozauri-model-2",
    category: "Baloane folie",
    priceCents: 3999,
    stock: 20,
    image: "/images/products/set-5-baloane-dino2.png",
    images: ["/images/products/set-5-baloane-dino2.png"],
    featured: false,
    description: "Set de 5 baloane dinozauri, varianta colorata pentru petreceri tematice si decoruri atractive."
  },
  {
    name: "Set 5 baloane dinozauri model 3",
    slug: "set-5-baloane-dinozauri-model-3",
    category: "Baloane folie",
    priceCents: 3999,
    stock: 20,
    image: "/images/products/set-5-baloane-dino3.png",
    images: ["/images/products/set-5-baloane-dino3.png"],
    featured: false,
    description: "Set de 5 baloane dinozauri pentru aniversari tematice si decoruri memorabile."
  },
  {
    name: "Set 5 baloane dinozauri model 4",
    slug: "set-5-baloane-dinozauri-model-4",
    category: "Baloane folie",
    priceCents: 3999,
    stock: 20,
    image: "/images/products/set-5-baloane-dino4.png",
    images: ["/images/products/set-5-baloane-dino4.png"],
    featured: false,
    description: "Set de 5 baloane dinozauri, potrivit pentru petreceri tematice creative si colorate."
  },
  {
    name: "Set 5 baloane briosa",
    slug: "set-5-baloane-briosa",
    category: "Baloane folie",
    priceCents: 3599,
    stock: 20,
    image: "/images/products/set-5-baloane-briosa.png",
    images: ["/images/products/set-5-baloane-briosa.png"],
    featured: false,
    description: "Set de 5 baloane cu briosa, ideal pentru aniversari dulci si decoruri simpatice."
  },
  {
    name: "Set 5 baloane smile",
    slug: "set-5-baloane-smile",
    category: "Baloane folie",
    priceCents: 3299,
    stock: 20,
    image: "/images/products/set-5-baloane-smile.png",
    images: ["/images/products/set-5-baloane-smile.png"],
    featured: false,
    description: "Set de 5 baloane smile, potrivit pentru petreceri vesele si decoruri pline de energie."
  },
  {
    name: "Balon Cheers",
    slug: "balon-cheers",
    category: "Baloane folie",
    priceCents: 1899,
    stock: 25,
    image: "/images/products/balon-cheers.png",
    images: ["/images/products/balon-cheers.png"],
    featured: false,
    description: "Balon Cheers pentru petreceri de adulti, aniversari si evenimente festive cu atmosfera eleganta."
  },
  {
    name: "Balon stea auriu",
    slug: "balon-stea-auriu",
    category: "Baloane folie",
    priceCents: 1299,
    stock: 50,
    image: "/images/products/balon-stea-auriu.jpg",
    images: ["/images/products/balon-stea-auriu.jpg", "/images/products/balon-folie-stea-gold.jpeg"],
    featured: false,
    description: "Balon stea auriu pentru decoruri elegante, arcade festive si combinatii moderne de baloane."
  },
  {
    name: "Balon stea argintiu",
    slug: "balon-stea-argintiu",
    category: "Baloane folie",
    priceCents: 1299,
    stock: 50,
    image: "/images/products/balon-folie-stea-argintiu.jpg",
    images: ["/images/products/balon-folie-stea-argintiu.jpg"],
    featured: false,
    description: "Balon stea argintiu, ideal pentru decoruri moderne, aniversari si petreceri tematice."
  },
  {
    name: "Balon stea gold",
    slug: "balon-stea-gold",
    category: "Baloane folie",
    priceCents: 1299,
    stock: 50,
    image: "/images/products/balon-folie-stea-gold.jpeg",
    images: ["/images/products/balon-folie-stea-gold.jpeg"],
    featured: false,
    description: "Balon stea gold pentru decoruri stralucitoare, elegante si usor de combinat."
  },
  {
    name: "Balon stea roz",
    slug: "balon-stea-roz",
    category: "Baloane folie",
    priceCents: 1299,
    stock: 50,
    image: "/images/products/balon-stea-roz.jpg",
    images: ["/images/products/balon-stea-roz.jpg"],
    featured: false,
    description: "Balon stea roz potrivit pentru petreceri delicate, aniversari si decoruri pastelate."
  },
  {
    name: "Balon stea gri",
    slug: "balon-stea-gri",
    category: "Baloane folie",
    priceCents: 1299,
    stock: 50,
    image: "/images/products/balon-stea-gri.jpg",
    images: ["/images/products/balon-stea-gri.jpg"],
    featured: false,
    description: "Balon stea gri pentru decoruri moderne si combinatii elegante de culori."
  },
  {
    name: "Set 5 baloane stea auriu",
    slug: "set-5-baloane-stea-auriu",
    category: "Baloane folie",
    priceCents: 2999,
    stock: 25,
    image: "/images/products/balon-folie-5-stele-gold.png",
    images: ["/images/products/balon-folie-5-stele-gold.png"],
    featured: false,
    description: "Set de 5 baloane stea aurii, excelent pentru decoruri festive si arcade spectaculoase."
  },
  {
    name: "Set 5 baloane stea rosu",
    slug: "set-5-baloane-stea-rosu",
    category: "Baloane folie",
    priceCents: 2999,
    stock: 25,
    image: "/images/products/balon-folie-5-stele-rosu.png",
    images: ["/images/products/balon-folie-5-stele-rosu.png"],
    featured: false,
    description: "Set de 5 baloane stea rosii pentru decoruri intense si petreceri energice."
  },
  {
    name: "Set 5 baloane stea",
    slug: "set-5-baloane-stea",
    category: "Baloane folie",
    priceCents: 2999,
    stock: 25,
    image: "/images/products/balon-folie-5-stele.png",
    images: ["/images/products/balon-folie-5-stele.png"],
    featured: false,
    description: "Set de 5 baloane stea, potrivit pentru decoruri aniversare si evenimente festive."
  },
  {
    name: "Set baloane mixte model 1",
    slug: "set-baloane-mixte-model-1",
    category: "Baloane folie",
    priceCents: 3499,
    stock: 20,
    image: "/images/products/set-baloane-mixte.jpg",
    images: ["/images/products/set-baloane-mixte.jpg"],
    featured: false,
    description: "Set baloane mixte pentru decoruri variate, usor de folosit la aniversari si evenimente speciale."
  },
  {
    name: "Set baloane mixte model 2",
    slug: "set-baloane-mixte-model-2",
    category: "Baloane folie",
    priceCents: 3499,
    stock: 20,
    image: "/images/products/set-baloane-mixte2.jpg",
    images: ["/images/products/set-baloane-mixte2.jpg"],
    featured: false,
    description: "Set baloane mixte, varianta colorata pentru petreceri memorabile si decoruri diverse."
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

