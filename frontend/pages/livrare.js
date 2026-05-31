import Head from "next/head";

export default function DeliveryPage() {
  return (
    <>
      <Head>
        <title>Shipping - Party Shop</title>
      </Head>
      <main className="container info-page">
        <section className="info-card">
          <h1>Shipping information</h1>
          <p className="info-lead">Orders are processed quickly from stock with simple tracking.</p>
          <div className="info-grid">
            <div><h3>Delivery time</h3><p>24-48 hours for in-stock products.</p></div>
            <div><h3>Shipping cost</h3><p>19.99 RON. Free for orders over 199 RON.</p></div>
            <div><h3>Coverage</h3><p>We deliver across Romania via fast courier.</p></div>
          </div>
        </section>
      </main>
    </>
  );
}
