import Head from "next/head";

export default function CookiesPage() {
  return (
    <>
      <Head>
        <title>Politica Cookies - Party Shop</title>
      </Head>
      <main className="container">
        <h1>Politica Cookies</h1>
        <p>Site-ul foloseste cookie-uri esentiale pentru autentificare si cosul de cumparaturi.</p>
        <h3>Cookie-uri esentiale</h3>
        <p>Necesare pentru functionarea site-ului. Nu pot fi dezactivate din banner.</p>
        <h3>Cookie-uri de analiza</h3>
        <p>Active doar dupa consimtamantul explicit al utilizatorului.</p>
      </main>
    </>
  );
}

