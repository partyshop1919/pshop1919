import { useState } from "react";
import { useRouter } from "next/router";
import { adminLogin } from "../../lib/api";
import { useAdmin } from "../../lib/auth";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { loginAdmin } = useAdmin();

  async function handleLogin(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await adminLogin(password);

      if (!res?.token) {
        throw new Error(res?.error || "Login failed");
      }

      loginAdmin(res.token);
      router.push("/admin/products");
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 380, margin: "60px auto" }}>
      <h2>Admin Login</h2>

      <form onSubmit={handleLogin}>
        <label>Password</label>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: 8, marginTop: 6 }}
        />

        {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}

        <button type="submit" disabled={loading} style={{ marginTop: 16, padding: "8px 16px" }}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
