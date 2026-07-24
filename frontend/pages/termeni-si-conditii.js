import Head from "next/head";

export default function TermsPage() {
  return (
    <>
      <Head>
        <title>Termeni și condiții - Evamat</title>
      </Head>
      <main className="container">
        <h1>Termeni și condiții</h1>
        <p>Prin utilizarea acestui website, ești de acord cu termenii de mai jos.</p>
        <h3>Comenzi și plată</h3>
        <p>Comenzile sunt confirmate în funcție de disponibilitatea stocului. Plata se poate face ramburs sau cu cardul.</p>
        <h3>Livrare și retur</h3>
        <p>Condițiile de livrare și retur se aplică în conformitate cu legislația în vigoare.</p>
        <h3>Limitarea răspunderii</h3>
        <p>Informațiile sunt oferite cu bună-credință; ne rezervăm dreptul de a le actualiza fără notificare prealabilă.</p>
      </main>
    </>
  );
}
