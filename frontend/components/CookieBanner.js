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
        inset: 0,
        zIndex: 3000,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16
      }}
    >
      <div
        style={{
          width: "min(680px, 100%)",
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: 12,
          padding: 16,
          boxShadow: "0 18px 30px rgba(0,0,0,0.22)"
        }}
      >
        <p style={{ margin: 0 }}>
          Folosim cookie-uri esentiale pentru functionarea site-ului. Cookie-urile de analiza se activeaza doar cu
          acordul tau. Vezi{" "}
          <Link href="/politica-cookies">Politica Cookies</Link> si{" "}
          <Link href="/politica-confidentialitate">Politica de Confidentialitate</Link>.
        </p>
        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
          <button className="btn" type="button" onClick={() => saveConsent({ essential: true, analytics: false })}>
            Refuz analytics
          </button>
          <button className="btn" type="button" onClick={() => saveConsent({ essential: true, analytics: true })}>
            Accept toate
          </button>
        </div>
      </div>
    </div>
  );
}
