import Head from "next/head";

export default function FaqPage() {
  return (
    <>
      <Head>
        <title>FAQ - Evamat</title>
      </Head>
      <main className="container info-page">
        <section className="info-card">
          <h1>Frequently asked questions</h1>
          <p className="info-lead">Quick answers to the most common questions.</p>

          <div className="faq-list">
            <article className="faq-item">
              <h3>How long does delivery take?</h3>
              <p>Usually 24-48 hours for in-stock products.</p>
            </article>
            <article className="faq-item">
              <h3>Can I pay by card?</h3>
              <p>Yes, online card payments are available through Stripe.</p>
            </article>
            <article className="faq-item">
              <h3>How can I check my order status?</h3>
              <p>From your account, on the My Orders page.</p>
            </article>
          </div>
        </section>
      </main>
    </>
  );
}
