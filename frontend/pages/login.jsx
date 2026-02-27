import { useState } from "react";
import { useRouter } from "next/router";
import { API_URL } from "../lib/api";
import { useAuth } from "../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { loginUser } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function updateField(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Autentificare eșuată"
        );
      }

      // salvează în AuthContext (REACTIV)
      loginUser(data.token, data.user);

      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 380, margin: "60px auto" }}>
      <h2>Autentificare</h2>

      <form onSubmit={handleLogin}>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={updateField}
          required
          style={{ width: "100%", padding: 8, marginTop: 6 }}
        />

        <label style={{ marginTop: 12, display: "block" }}>
          Parolă
        </label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={updateField}
          required
          style={{ width: "100%", padding: 8, marginTop: 6 }}
        />

        {error && (
          <div style={{ color: "red", marginTop: 12 }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{ marginTop: 18, padding: "8px 16px" }}
        >
          {loading ? "Se autentifică…" : "Login"}
        </button>

        <p style={{ marginTop: 12 }}>
          Nu ai cont?{" "}
          <a href="/register">Înregistrează-te</a>
        </p>

      </form>
    </div>
  );
}
