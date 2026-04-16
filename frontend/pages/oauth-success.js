import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../lib/auth";

export default function OauthSuccessPage() {
  const router = useRouter();
  const { loginUser } = useAuth();
  const handledRef = useRef(false);

  useEffect(() => {
    if (!router.isReady || handledRef.current) return;
    handledRef.current = true;

    const qs = new URLSearchParams(window.location.search);
    const token = String(qs.get("token") || "").trim();
    const email = String(qs.get("email") || "").trim();
    const role = String(qs.get("role") || "user").trim() || "user";
    const error = String(qs.get("error") || "").trim();

    if (error) {
      window.location.replace(`/login?oauthError=${encodeURIComponent(error)}`);
      return;
    }

    if (!token) {
      window.location.replace("/login?oauthError=Missing token");
      return;
    }

    const fallbackEmail = email || "oauth-user@partyshop.local";
    loginUser(token, { email: fallbackEmail, role });
    window.location.replace("/");
  }, [router, loginUser]);

  return (
    <div className="container">
      <p>Autentificare in curs...</p>
    </div>
  );
}
