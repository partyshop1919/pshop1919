import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../lib/auth";

export default function OauthSuccessPage() {
  const router = useRouter();
  const { loginUser } = useAuth();

  useEffect(() => {
    if (!router.isReady) return;

    const token = String(router.query?.token || "").trim();
    const email = String(router.query?.email || "").trim();
    const role = String(router.query?.role || "user").trim() || "user";
    const error = String(router.query?.error || "").trim();

    if (error) {
      router.replace(`/login?oauthError=${encodeURIComponent(error)}`);
      return;
    }

    if (!token) {
      router.replace("/login?oauthError=Missing token");
      return;
    }

    const fallbackEmail = email || "oauth-user@partyshop.local";
    loginUser(token, { email: fallbackEmail, role });
    router.replace("/");
  }, [router, loginUser]);

  return (
    <div className="container">
      <p>Autentificare in curs...</p>
    </div>
  );
}
