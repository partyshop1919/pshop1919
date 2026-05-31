import Head from "next/head";

export default function PrivacyPage() {
  return (
    <>
      <Head>
        <title>Privacy Policy - Party Shop</title>
      </Head>
      <main className="container">
        <h1>Privacy Policy</h1>
        <p>This page explains what data we collect and how we use it to process orders.</p>
        <h3>Collected data</h3>
        <p>Name, email, phone number, shipping address, and order details.</p>
        <h3>Purpose</h3>
        <p>Order processing, customer communication, legal compliance, and fraud prevention.</p>
        <h3>Your rights</h3>
        <p>You can request access, correction, or deletion of your data via the store contact email.</p>
      </main>
    </>
  );
}
