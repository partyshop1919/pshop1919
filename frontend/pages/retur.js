import Head from "next/head";

export default function ReturnPage() {
  return (
    <>
      <Head>
        <title>Returns - Party Shop</title>
      </Head>
      <main className="container info-page">
        <section className="info-card">
          <h1>Return policy</h1>
          <p className="info-lead">A simple and transparent process, in line with current legislation.</p>
          <div className="info-grid">
            <div><h3>Timeframe</h3><p>Products can be returned within 14 calendar days.</p></div>
            <div><h3>Conditions</h3><p>Products must be unused and in their original packaging.</p></div>
            <div><h3>Return support</h3><p>Email us at support@partyshop.ro and we will guide you step by step.</p></div>
          </div>
        </section>
      </main>
    </>
  );
}
