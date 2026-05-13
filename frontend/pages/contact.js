import Head from "next/head";

export default function ContactPage() {
  const whatsappUrl =
    "https://wa.me/40700000000?text=Salut%20Party%20Shop!%20As%20dori%20detalii%20despre%20produse%20si%20comenzi.";

  return (
    <>
      <Head>
        <title>Contact - Party Shop</title>
      </Head>
      <main className="container info-page">
        <section className="info-card">
          <h1>Contact</h1>
          <p className="info-lead">Suntem aici sa te ajutam rapid cu orice intrebare legata de comenzi si produse.</p>

          <div className="contact-cta">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="btn whatsapp-btn"
            >
              Scrie pe WhatsApp
            </a>
            <a href="tel:+40700000000" className="btn secondary">
              Suna acum
            </a>
          </div>

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

          <div className="info-grid company-details">
            <div>
              <h3>Nume firmă</h3>
              <p>JUNIOR PARTY S.R.L.</p>
            </div>
            <div>
              <h3>Cod Unic de Înregistrare</h3>
              <p>36316790</p>
            </div>
            <div>
              <h3>Nr. Înmtrîculare</h3>
              <p>J21/309/2016</p>
            </div>
            <div>
              <h3>EUID</h3>
              <p>ROONRC.J21/309/2016</p>
            </div>
            <div>
              <h3>Data înființării</h3>
              <p>14-07-2016</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
