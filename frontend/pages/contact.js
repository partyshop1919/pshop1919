import Head from "next/head";

export default function ContactPage() {
  const whatsappUrl =
    "https://wa.me/40761189399?text=Bună!%20Aș%20dori%20mai%20multe%20detalii%20despre%20produse%20și%20comenzi.";

  return (
    <>
      <Head>
        <title>Contact - Evamat</title>
      </Head>
      <main className="container info-page">
        <section className="info-card">
          <h1>Contact</h1>
          <p className="info-lead">Suntem aici să te ajutăm rapid cu orice întrebare despre produse sau comenzi.</p>

          <div className="contact-cta">
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn whatsapp-btn">
              Scrie-ne pe WhatsApp
            </a>
            <a href="tel:+40761189399" className="btn secondary">
              Sună acum
            </a>
          </div>

          <div className="info-grid">
            <div><h3>Email suport</h3><p>support@evamat.ro</p></div>
            <div><h3>Telefon</h3><p>+40 761 189 399</p></div>
            <div><h3>Program</h3><p>Luni - Vineri, 09:00 - 18:00</p></div>
          </div>

          <div className="info-grid company-details">
            <div><h3>Denumire firmă</h3><p>JUNIOR PARTY S.R.L.</p></div>
            <div><h3>CUI</h3><p>36316790</p></div>
            <div><h3>Nr. înregistrare</h3><p>J21/309/2016</p></div>
            <div><h3>EUID</h3><p>ROONRC.J21/309/2016</p></div>
            <div><h3>Data înființării</h3><p>14-07-2016</p></div>
          </div>
        </section>
      </main>
    </>
  );
}
