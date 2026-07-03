import Head from "next/head";

export default function CookiesPage() {
  return (
    <>
      <Head>
        <title>Cookie Policy - Evamat</title>
      </Head>
      <main className="container">
        <h1>Cookie Policy</h1>
        <p>This site uses essential cookies for authentication and the shopping cart.</p>
        <h3>Essential cookies</h3>
        <p>Required for the website to function. They cannot be disabled from the banner.</p>
        <h3>Analytics cookies</h3>
        <p>Enabled only after the user gives explicit consent.</p>
      </main>
    </>
  );
}
