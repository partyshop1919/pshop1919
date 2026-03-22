import Head from "next/head";

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>Contact - Party Shop</title>
      </Head>
      <main className="container info-page">
        <section className="info-card">
          <h1>Contact</h1>
          <p className="info-lead">Suntem aici sa te ajutam rapid cu orice intrebare legata de comenzi si produse.</p>
          <div className="info-grid">
            <div>
              <h3>Email suport</h3>
              <p>support@partyshop.ro</p>
            </div>
            <div>
              <h3>Telefon</h3>
              <p>+40 700 000 000</p>
            </div>
            <div>
              <h3>Program</h3>
              <p>Luni - Vineri, 09:00 - 18:00</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
