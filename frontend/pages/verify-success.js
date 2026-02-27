import Link from "next/link";

export default function VerifySuccess() {
  return (
    <div className="container" style={{ paddingTop: 60 }}>
      <h1>Cont confirmat</h1>
      <p>Emailul a fost verificat. Te poți autentifica acum.</p>

      <div style={{ marginTop: 18 }}>
        <Link href="/login" className="btn">
          Mergi la Login
        </Link>
      </div>
    </div>
  );
}
