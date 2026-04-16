import { useId, useState } from "react";
import Link from "next/link";
import { API_URL, BACKEND_URL } from "../lib/api";

export default function RegisterPage() {
  const emailPopupId = useId();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [acceptedLegal, setAcceptedLegal] = useState(false);
  const [showEmailPopup, setShowEmailPopup] = useState(false);

  function onChange(e) {
    if (e.target.name === "email" && showEmailPopup) {
      setShowEmailPopup(false);
    }

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  function handleEmailInvalid(e) {
    e.preventDefault();
    setShowEmailPopup(true);
  }

  async function submit(e) {
    e.preventDefault();
    if (!e.currentTarget.checkValidity()) {
      e.currentTarget.reportValidity();
      return;
    }

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
      {showEmailPopup && (
        <div className="auth-popup-overlay" onClick={() => setShowEmailPopup(false)}>
          <div
            className="auth-popup"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={`${emailPopupId}-title`}
            aria-describedby={`${emailPopupId}-desc`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="auth-popup-close"
              aria-label="Inchide alerta"
              onClick={() => setShowEmailPopup(false)}
            >
              X
            </button>
            <div className="auth-popup-icon" aria-hidden="true">
              !
            </div>
            <h2 id={`${emailPopupId}-title`}>Email nevalid</h2>
            <p id={`${emailPopupId}-desc`}>
              Te rog introdu o adresa de email valida, de exemplu <strong>nume@domeniu.ro</strong>.
            </p>
            <button type="button" className="btn" onClick={() => setShowEmailPopup(false)}>
              Am inteles
            </button>
          </div>
        </div>
      )}

      <p className="auth-muted">Poti crea cont instant cu social login.</p>
      <div className="auth-social">
        <a className="auth-social-btn google" href={`${BACKEND_URL}/api/auth/oauth/google/start`}>
          <span className="auth-social-logo" aria-hidden="true">
            <img src="/icons/google.svg" alt="" />
          </span>
          <span>Continue with Google</span>
        </a>
        <a className="auth-social-btn apple" href={`${BACKEND_URL}/api/auth/oauth/apple/start`}>
          <span className="auth-social-logo" aria-hidden="true">
            <img src="/icons/apple.svg" alt="" />
          </span>
          <span>Continue with Apple</span>
        </a>
        <a className="auth-social-btn github" href={`${BACKEND_URL}/api/auth/oauth/github/start`}>
          <span className="auth-social-logo" aria-hidden="true">
            <img src="/icons/github.svg" alt="" />
          </span>
          <span>Continue with GitHub</span>
        </a>
      </div>

      <div className="auth-divider">
        <span>sau</span>
      </div>

      <form onSubmit={submit} className="auth-form" noValidate>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            onInvalid={handleEmailInvalid}
            aria-describedby={showEmailPopup ? `${emailPopupId}-desc` : undefined}
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
