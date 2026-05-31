import Head from "next/head";

export default function TermsPage() {
  return (
    <>
      <Head>
        <title>Terms and Conditions - Party Shop</title>
      </Head>
      <main className="container">
        <h1>Terms and Conditions</h1>
        <p>By using this website, you agree to the terms below.</p>
        <h3>Orders and payment</h3>
        <p>Orders are confirmed subject to stock availability. Payment can be cash on delivery or card.</p>
        <h3>Shipping and returns</h3>
        <p>Shipping and return conditions apply in accordance with current legislation.</p>
        <h3>Limitation of liability</h3>
        <p>The information is provided in good faith; we reserve the right to update it without prior notice.</p>
      </main>
    </>
  );
}
