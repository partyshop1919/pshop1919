import Head from "next/head";

export default function PrivacyPage() {
  return (
    <>
      <Head>
        <title>Politica de Confidentialitate - Party Shop</title>
      </Head>
      <main className="container">
        <h1>Politica de Confidentialitate</h1>
        <p>Aceasta pagina explica ce date colectam si cum le folosim pentru procesarea comenzilor.</p>
        <h3>Date colectate</h3>
        <p>Nume, email, telefon, adresa de livrare, date comanda.</p>
        <h3>Scop</h3>
        <p>Procesare comenzi, comunicare cu clientul, conformitate legala si prevenire frauda.</p>
        <h3>Drepturile tale</h3>
        <p>Poti solicita acces, rectificare sau stergere date prin emailul de contact al magazinului.</p>
      </main>
    </>
  );
}

