import { useState } from "react";
import { API_URL } from "../lib/api";

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  function onChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function submit(e) {
    e.preventDefault();
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

      setMessage(
        "Cont creat. Verifică emailul pentru confirmare."
      );
      setForm({ email: "", password: "" });
    } catch (err) {
      setError(err.message || "Eroare la înregistrare");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container auth-page">
      <h1>Creează cont</h1>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

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
          Parolă
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            required
          />
        </label>

        <button className="btn full" disabled={loading}>
          {loading ? "Se creează…" : "Înregistrează-te"}
        </button>
      </form>
    </div>
  );
}
