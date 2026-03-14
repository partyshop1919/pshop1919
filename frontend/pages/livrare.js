import Head from "next/head";

export default function DeliveryPage() {
  return (
    <>
      <Head>
        <title>Livrare - Party Shop</title>
      </Head>
      <main className="container">
        <h1>Informatii Livrare</h1>
        <p>Livrare standard: 24-48h pentru produsele aflate in stoc.</p>
        <p>Cost transport: 19.99 RON. Gratuit peste 199 RON.</p>
        <p>Livrarea se face prin curier rapid, in toata Romania.</p>
      </main>
    </>
  );
}

