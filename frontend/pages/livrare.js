import Head from "next/head";

export default function DeliveryPage() {
  return (
    <>
      <Head>
        <title>Livrare - Evamat</title>
      </Head>
      <main className="container info-page">
        <section className="info-card">
          <h1>Informații despre livrare</h1>
          <p className="info-lead">Comenzile sunt procesate rapid din stoc, cu urmărire simplă.</p>
          <div className="info-grid">
            <div><h3>Timp de livrare</h3><p>24-48 de ore pentru produsele aflate în stoc.</p></div>
            <div><h3>Cost livrare</h3><p>19.99 RON. Gratuit pentru comenzi de peste 199 RON.</p></div>
            <div><h3>Acoperire</h3><p>Livrăm în toată România prin curier rapid.</p></div>
          </div>
        </section>
      </main>
    </>
  );
}
