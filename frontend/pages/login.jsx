import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { API_URL, BACKEND_URL } from "../lib/api";
import { useAuth } from "../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { loginUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!router.isReady) return;
    const oauthError = String(router.query?.oauthError || "").trim();
    if (oauthError) setError(oauthError);
  }, [router.isReady, router.query?.oauthError]);

  function updateField(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Autentificarea a eșuat");
      loginUser(data.token, data.user);
      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container auth-page">
      <div className="auth-card">
        <h2>Intră în cont</h2>
        <p className="auth-muted">Te poți autentifica instant și cu login social.</p>

        <div className="auth-social">
          <a className="auth-social-btn google" href={`${BACKEND_URL}/api/auth/oauth/google/start`}>
            <span className="auth-social-logo" aria-hidden="true"><img src="/icons/google.svg" alt="" /></span>
            <span>Continuă cu Google</span>
          </a>
          <a className="auth-social-btn apple" href={`${BACKEND_URL}/api/auth/oauth/apple/start`}>
            <span className="auth-social-logo" aria-hidden="true"><img src="/icons/apple.svg" alt="" /></span>
            <span>Continuă cu Apple</span>
          </a>
          <a className="auth-social-btn github" href={`${BACKEND_URL}/api/auth/oauth/github/start`}>
            <span className="auth-social-logo" aria-hidden="true"><img src="/icons/github.svg" alt="" /></span>
            <span>Continuă cu GitHub</span>
          </a>
        </div>

        <div className="auth-divider">
          <span>sau</span>
        </div>

        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={updateField} required style={{ width: "100%", padding: 8, marginTop: 6 }} />

          <label style={{ marginTop: 12, display: "block" }}>Parolă</label>
          <div className="password-field" style={{ marginTop: 6 }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={updateField}
              required
              style={{ width: "100%", padding: "8px 44px 8px 8px" }}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Ascunde parola" : "Arată parola"}
              aria-pressed={showPassword}
            >
              {showPassword ? "Ascunde" : "Arată"}
            </button>
          </div>

          {error && <div style={{ color: "red", marginTop: 12 }}>{error}</div>}

          <button type="submit" disabled={loading} style={{ marginTop: 18, padding: "8px 16px" }}>
            {loading ? "Se autentifică..." : "Intră în cont"}
          </button>

          <p style={{ marginTop: 12 }}>
            Nu ai cont? <a href="/register">Creează unul</a>
          </p>
        </form>
      </div>
    </div>
  );
}
