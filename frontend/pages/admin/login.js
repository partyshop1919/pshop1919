import { useState } from "react";
import { useRouter } from "next/router";
import { adminLogin } from "../../lib/api";
import { useAdmin } from "../../lib/auth";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { loginAdmin } = useAdmin();

  async function handleLogin(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await adminLogin(email, password);

      if (!res?.token) {
        throw new Error(res?.error || "Autentificarea a eșuat");
      }

      loginAdmin(res.token);
      router.push("/admin/products");
    } catch (err) {
      setError(err?.message || "Autentificarea a eșuat");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 380, margin: "60px auto" }}>
      <h2>Autentificare admin</h2>

      <form onSubmit={handleLogin}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: 8, marginTop: 6 }}
        />

        <label style={{ marginTop: 12, display: "block" }}>Parolă</label>
        <div className="password-field" style={{ marginTop: 6 }}>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

        {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}

        <button type="submit" disabled={loading} style={{ marginTop: 16, padding: "8px 16px" }}>
          {loading ? "Se autentifică..." : "Autentificare"}
        </button>
      </form>
    </div>
  );
}
