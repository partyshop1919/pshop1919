import Head from "next/head";

export default function TermsPage() {
  return (
    <>
      <Head>
        <title>Termeni si Conditii - Party Shop</title>
      </Head>
      <main className="container">
        <h1>Termeni si Conditii</h1>
        <p>Prin utilizarea site-ului accepti termenii de mai jos.</p>
        <h3>Comenzi si plata</h3>
        <p>Comenzile se confirma in limita stocului disponibil. Plata poate fi ramburs sau card.</p>
        <h3>Livrare si retur</h3>
        <p>Conditiile de livrare/retur se aplica conform legislatiei in vigoare.</p>
        <h3>Limitare raspundere</h3>
        <p>Informatiile sunt oferite cu buna-credinta; ne rezervam dreptul de actualizare fara notificare prealabila.</p>
      </main>
    </>
  );
}

