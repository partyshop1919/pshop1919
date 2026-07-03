import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { categories } from "../lib/categories";
import { fetchProducts } from "../lib/api";

import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const testimonials = [
    { id: 1, name: "Andreea, Bucharest", text: "My order arrived quickly and the decor looked exactly how we wanted it for the birthday party.", rating: 5 },
    { id: 2, name: "Mihai, Cluj-Napoca", text: "Party Builder helped me choose the right products for the number of guests.", rating: 5 },
    { id: 3, name: "Ioana, Iasi", text: "Great products, fair prices, and clear communication throughout the order.", rating: 4 }
  ];

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const list = await fetchProducts();
        if (!active) return;
        setItems(Array.isArray(list) ? list : []);
      } catch {
        if (active) setItems([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const featuredProducts = useMemo(() => {
    if (!Array.isArray(items) || items.length === 0) return [];
    const featured = items.filter((p) => Boolean(p.featured));
    if (featured.length > 0) return featured.slice(0, 9);
    return items.slice(0, 9);
  }, [items]);

  const [featuredSlideIndex, setFeaturedSlideIndex] = useState(0);
  const featuredSlides = useMemo(() => {
    const pageSize = 3;
    const chunks = [];
    for (let i = 0; i < featuredProducts.length; i += pageSize) chunks.push(featuredProducts.slice(i, i + pageSize));
    return chunks;
  }, [featuredProducts]);

  useEffect(() => {
    if (featuredSlides.length > 0 && featuredSlideIndex >= featuredSlides.length) setFeaturedSlideIndex(0);
  }, [featuredSlideIndex, featuredSlides.length]);

  useEffect(() => {
    if (featuredSlides.length === 0) return;
    const interval = setInterval(() => setFeaturedSlideIndex((prev) => (prev + 1) % featuredSlides.length), 4200);
    return () => clearInterval(interval);
  }, [featuredSlides.length]);

  return (
    <>
      <Head>
        <title>Evamat - Party Supplies</title>
        <meta name="description" content="Balloons, decorations, and festive accessories for birthdays, parties, and special events." />
      </Head>

      <main className="homepage">
        <section className="hero">
          <div className="hero-content">
            <h1>Everything for unforgettable parties</h1>
            <p>Discover balloons, decorations, and festive accessories for birthdays, themed parties, and special events.</p>
            <ul className="hero-benefits">
              <li>Fast delivery from stock</li>
              <li>Products for all ages</li>
              <li>Affordable prices</li>
            </ul>

            <Link href="#categories" className="hero-btn">
              View categories
            </Link>
          </div>
        </section>

        <section className="home-featured">
          <h2>Featured products</h2>
          {!loading && featuredSlides.length > 0 && (
            <div className="featured-slider">
              <div className="slider-controls">
                <button type="button" className="slider-arrow" onClick={() => setFeaturedSlideIndex((prev) => (prev - 1 + featuredSlides.length) % featuredSlides.length)} aria-label="Previous">{"<"}</button>
                <button type="button" className="slider-arrow" onClick={() => setFeaturedSlideIndex((prev) => (prev + 1) % featuredSlides.length)} aria-label="Next">{">"}</button>
              </div>

              <div className="slider-viewport">
                <div className="slider-track" style={{ transform: `translateX(-${featuredSlideIndex * 100}%)` }}>
                  {featuredSlides.map((slide, slideIndex) => (
                    <div className="slider-panel" key={slideIndex}>
                      <div className="products-grid">
                        {slide.map((product) => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!loading && featuredSlides.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">New</div>
              <h3>More products coming soon</h3>
              <p>We are adding new products soon. Please check back shortly.</p>
            </div>
          )}
        </section>

        <section id="categories" className="home-categories">
          <h2>Popular categories</h2>
          <div className="categories-grid">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>

        <section className="home-promo">
          <h2>Planning a party?</h2>
          <p>Choose from hundreds of festive products and build a memorable setup in minutes.</p>
          <div className="promo-actions">
            <Link href="/products" className="promo-btn">View products</Link>
            <Link href="/party-builder" className="promo-btn promo-btn-secondary">Try Party Builder</Link>
          </div>
        </section>

        <section className="home-testimonials">
          <h2>Customer feedback</h2>
          <p className="testimonials-subtitle">A few highlights from recent customer feedback.</p>
          <div className="testimonials-grid">
            {testimonials.map((t) => (
              <article key={t.id} className="testimonial-card">
                <div className="testimonial-head">
                  <div className="testimonial-avatar">{t.name.charAt(0)}</div>
                  <div>
                    <h3>{t.name}</h3>
                    <div className="testimonial-stars" aria-label={`Rating ${t.rating} out of 5 stars`}>
                      {"*".repeat(t.rating)}
                    </div>
                  </div>
                </div>
                <p>{t.text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
