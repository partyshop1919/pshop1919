import Head from "next/head";

export default function ReturnPage() {
  return (
    <>
      <Head>
        <title>Retur - Party Shop</title>
      </Head>
      <main className="container">
        <h1>Politica de Retur</h1>
        <p>Produsele pot fi returnate in termen de 14 zile calendaristice, conform legislatiei.</p>
        <p>Produsele trebuie sa fie nefolosite, in ambalajul original, cu toate accesoriile.</p>
        <p>Pentru retur, contacteaza-ne la support@partyshop.ro.</p>
      </main>
    </>
  );
}

