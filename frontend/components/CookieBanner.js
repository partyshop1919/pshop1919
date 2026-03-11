import { useEffect, useState } from "react";
import Link from "next/link";

const COOKIE_KEY = "cookie-consent-v1";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(COOKIE_KEY);
    if (!saved) setVisible(true);
  }, []);

  function saveConsent(value) {
    if (typeof window === "undefined") return;
    localStorage.setItem(COOKIE_KEY, JSON.stringify(value));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: 16,
        right: 16,
        bottom: 16,
        zIndex: 3000,
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: 12,
        padding: 14,
        boxShadow: "0 12px 24px rgba(0,0,0,0.12)"
      }}
    >
      <p style={{ margin: 0 }}>
        Folosim cookie-uri esentiale pentru functionarea site-ului. Cookie-urile de analiza se activeaza doar cu
        acordul tau. Vezi{" "}
        <Link href="/politica-cookies">Politica Cookies</Link> si{" "}
        <Link href="/politica-confidentialitate">Politica de Confidentialitate</Link>.
      </p>
      <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
        <button className="btn" type="button" onClick={() => saveConsent({ essential: true, analytics: false })}>
          Refuz analytics
        </button>
        <button className="btn" type="button" onClick={() => saveConsent({ essential: true, analytics: true })}>
          Accept toate
        </button>
      </div>
    </div>
  );
}

