import Head from "next/head";

export default function DeliveryPage() {
  return (
    <>
      <Head>
        <title>Livrare - Party Shop</title>
      </Head>
      <main className="container info-page">
        <section className="info-card">
          <h1>Informatii Livrare</h1>
          <p className="info-lead">Comenzile sunt procesate rapid, direct din stoc, cu urmarire simpla.</p>
          <div className="info-grid">
            <div>
              <h3>Timp de livrare</h3>
              <p>24-48h pentru produsele aflate in stoc.</p>
            </div>
            <div>
              <h3>Cost transport</h3>
              <p>19.99 RON. Gratuit pentru comenzi peste 199 RON.</p>
            </div>
            <div>
              <h3>Acoperire</h3>
              <p>Livram in toata Romania prin curier rapid.</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
