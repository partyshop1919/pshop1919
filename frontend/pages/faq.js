import Head from "next/head";

export default function FaqPage() {
  return (
    <>
      <Head>
        <title>FAQ - Party Shop</title>
      </Head>
      <main className="container info-page">
        <section className="info-card">
          <h1>Intrebari Frecvente</h1>
          <p className="info-lead">Raspunsuri rapide la cele mai comune intrebari.</p>

          <div className="faq-list">
            <article className="faq-item">
              <h3>In cat timp ajunge comanda?</h3>
              <p>De regula, 24-48h pentru produsele in stoc.</p>
            </article>
            <article className="faq-item">
              <h3>Pot plati cu cardul?</h3>
              <p>Da, plata cu cardul este disponibila prin Stripe.</p>
            </article>
            <article className="faq-item">
              <h3>Cum verific statusul comenzii?</h3>
              <p>Din contul tau, in pagina My Orders.</p>
            </article>
          </div>
        </section>
      </main>
    </>
  );
}
