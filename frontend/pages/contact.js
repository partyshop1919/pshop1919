import Head from "next/head";

export default function ContactPage() {
  const whatsappUrl =
    "https://wa.me/40700000000?text=Hello%20Party%20Shop!%20I%20would%20like%20more%20details%20about%20products%20and%20orders.";

  return (
    <>
      <Head>
        <title>Contact - Evamat</title>
      </Head>
      <main className="container info-page">
        <section className="info-card">
          <h1>Contact</h1>
          <p className="info-lead">We are here to help quickly with any questions about products or orders.</p>

          <div className="contact-cta">
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn whatsapp-btn">
              Message on WhatsApp
            </a>
            <a href="tel:+40700000000" className="btn secondary">
              Call now
            </a>
          </div>

          <div className="info-grid">
            <div><h3>Support email</h3><p>support@evamat.ro</p></div>
            <div><h3>Phone</h3><p>+40 700 000 000</p></div>
            <div><h3>Business hours</h3><p>Monday - Friday, 09:00 - 18:00</p></div>
          </div>

          <div className="info-grid company-details">
            <div><h3>Company name</h3><p>JUNIOR PARTY S.R.L.</p></div>
            <div><h3>Tax ID</h3><p>36316790</p></div>
            <div><h3>Registration No.</h3><p>J21/309/2016</p></div>
            <div><h3>EUID</h3><p>ROONRC.J21/309/2016</p></div>
            <div><h3>Incorporation date</h3><p>14-07-2016</p></div>
          </div>
        </section>
      </main>
    </>
  );
}
