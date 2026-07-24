import Head from "next/head";

export default function ReturnPage() {
  return (
    <>
      <Head>
        <title>Retur - Evamat</title>
      </Head>
      <main className="container info-page">
        <section className="info-card">
          <h1>Politica de retur</h1>
          <p className="info-lead">Un proces simplu și transparent, în conformitate cu legislația în vigoare.</p>
          <div className="info-grid">
            <div><h3>Termen</h3><p>Produsele pot fi returnate în termen de 14 zile calendaristice.</p></div>
            <div><h3>Condiții</h3><p>Produsele trebuie să fie nefolosite și în ambalajul original.</p></div>
            <div><h3>Asistență retur</h3><p>Scrie-ne la support@evamat.ro și te ghidăm pas cu pas.</p></div>
          </div>
        </section>
      </main>
    </>
  );
}
