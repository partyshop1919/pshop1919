import Head from "next/head";

export default function FaqPage() {
  return (
    <>
      <Head>
        <title>FAQ - Evamat</title>
      </Head>
      <main className="container info-page">
        <section className="info-card">
          <h1>Întrebări frecvente</h1>
          <p className="info-lead">Răspunsuri rapide la cele mai frecvente întrebări.</p>

          <div className="faq-list">
            <article className="faq-item">
              <h3>Cât durează livrarea?</h3>
              <p>De obicei 24-48 de ore pentru produsele aflate în stoc.</p>
            </article>
            <article className="faq-item">
              <h3>Pot plăti cu cardul?</h3>
              <p>Da, plățile online cu cardul sunt disponibile prin Stripe.</p>
            </article>
            <article className="faq-item">
              <h3>Cum verific statusul comenzii?</h3>
              <p>Din contul tău, în pagina Comenzile mele.</p>
            </article>
          </div>
        </section>
      </main>
    </>
  );
}
