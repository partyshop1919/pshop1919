import Head from "next/head";

export default function PrivacyPage() {
  return (
    <>
      <Head>
        <title>Politica de confidențialitate - Evamat</title>
      </Head>
      <main className="container">
        <h1>Politica de confidențialitate</h1>
        <p>Această pagină explică ce date colectăm și cum le folosim pentru procesarea comenzilor.</p>
        <h3>Date colectate</h3>
        <p>Nume, email, număr de telefon, adresă de livrare și detalii despre comandă.</p>
        <h3>Scop</h3>
        <p>Procesarea comenzilor, comunicarea cu clienții, conformarea legală și prevenirea fraudelor.</p>
        <h3>Drepturile tale</h3>
        <p>Poți solicita accesul, corectarea sau ștergerea datelor tale prin emailul de contact al magazinului.</p>
      </main>
    </>
  );
}
