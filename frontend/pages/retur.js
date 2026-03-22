import Head from "next/head";

export default function ReturnPage() {
  return (
    <>
      <Head>
        <title>Retur - Party Shop</title>
      </Head>
      <main className="container info-page">
        <section className="info-card">
          <h1>Politica de Retur</h1>
          <p className="info-lead">Proces simplu si transparent, conform legislatiei in vigoare.</p>
          <div className="info-grid">
            <div>
              <h3>Termen</h3>
              <p>Produsele pot fi returnate in 14 zile calendaristice.</p>
            </div>
            <div>
              <h3>Conditii</h3>
              <p>Produsele trebuie sa fie nefolosite, in ambalajul original.</p>
            </div>
            <div>
              <h3>Suport retur</h3>
              <p>Scrie-ne la support@partyshop.ro si te ghidam pas cu pas.</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
