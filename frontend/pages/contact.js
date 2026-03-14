import Head from "next/head";

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>Contact - Party Shop</title>
      </Head>
      <main className="container">
        <h1>Contact</h1>
        <p>Email: support@partyshop.ro</p>
        <p>Telefon: +40 700 000 000</p>
        <p>Program: Luni - Vineri, 09:00 - 18:00</p>
      </main>
    </>
  );
}

