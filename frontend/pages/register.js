import { useState } from "react";
import Link from "next/link";
import { API_URL, BACKEND_URL } from "../lib/api";

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [acceptedLegal, setAcceptedLegal] = useState(false);

  function onChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function submit(e) {
    e.preventDefault();
    if (!acceptedLegal) {
      setError("Trebuie sa accepti Termenii si Politica de Confidentialitate.");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setMessage("Cont creat. Verifica emailul pentru confirmare.");
      setForm({ email: "", password: "" });
      setAcceptedLegal(false);
    } catch (err) {
      setError(err.message || "Eroare la inregistrare");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container auth-page">
      <div className="auth-card">
      <h1>Creeaza cont</h1>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <p className="auth-muted">Poti crea cont instant cu social login.</p>
      <div className="auth-social">
        <a className="auth-social-btn google" href={`${BACKEND_URL}/api/auth/oauth/google/start`}>
          Inregistrare rapida cu Google
        </a>
        <a className="auth-social-btn github" href={`${BACKEND_URL}/api/auth/oauth/github/start`}>
          Inregistrare rapida cu GitHub
        </a>
        <a className="auth-social-btn facebook" href={`${BACKEND_URL}/api/auth/oauth/facebook/start`}>
          Inregistrare rapida cu Facebook
        </a>
      </div>

      <div className="auth-divider">
        <span>sau</span>
      </div>

      <form onSubmit={submit} className="auth-form">
        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            required
          />
        </label>

        <label>
          Parola
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            required
          />
        </label>

        <label className="auth-inline-check">
          <input
            type="checkbox"
            checked={acceptedLegal}
            onChange={(e) => setAcceptedLegal(e.target.checked)}
            required
          />
          <span>
            Sunt de acord cu <Link href="/termeni-si-conditii">Termenii si Conditiile</Link> si cu{" "}
            <Link href="/politica-confidentialitate">Politica de Confidentialitate</Link>.
          </span>
        </label>

        <button className="btn full" disabled={loading || !acceptedLegal}>
          {loading ? "Se creeaza..." : "Inregistreaza-te"}
        </button>
      </form>
      </div>
    </div>
  );
}
