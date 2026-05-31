import Link from "next/link";

export default function VerifySuccess() {
  return (
    <div className="container" style={{ paddingTop: 60 }}>
      <h1>Account confirmed</h1>
      <p>Your email has been verified. You can sign in now.</p>
      <div style={{ marginTop: 18 }}>
        <Link href="/login" className="btn">
          Go to sign in
        </Link>
      </div>
    </div>
  );
}
