import { useEffect, useState } from "react";
import Link from "next/link";

const COOKIE_KEY = "cookie-consent-v1";
const DEFAULT_PREFS = {
  essential: true,
  statistics: false,
  marketing: false
};

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [preferences, setPreferences] = useState(DEFAULT_PREFS);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(COOKIE_KEY);
    if (!saved) {
      setVisible(true);
      return;
    }

    try {
      const parsed = JSON.parse(saved);
      if (!parsed || typeof parsed !== "object") return;
      setPreferences({
        essential: true,
        statistics: Boolean(parsed.statistics),
        marketing: Boolean(parsed.marketing)
      });
    } catch (error) {
      // Ignore parse errors
    }
  }, []);

  function saveConsent(value) {
    if (typeof window === "undefined") return;
    localStorage.setItem(COOKIE_KEY, JSON.stringify(value));
    setVisible(false);
  }

  const acceptNecessary = () => saveConsent({ essential: true, statistics: false, marketing: false });
  const acceptSelection = () => saveConsent({ essential: true, statistics: preferences.statistics, marketing: preferences.marketing });
  const acceptAll = () => saveConsent({ essential: true, statistics: true, marketing: true });

  if (!visible) return null;

  return (
    <div className="cookie-modal-overlay">
      <div className="cookie-modal">
        <div className="cookie-modal-content">
          <div className="cookie-modal-copy">
            <span className="cookie-modal-badge">Acest website folosește cookies</span>
            <h2>Folosim cookie-uri pentru o experiență mai bună</h2>
            <p>
              Folosim cookie-uri pentru a personaliza conținutul și anunțurile, pentru a oferi funcții de rețele
              sociale și pentru a analiza traficul. De asemenea, le oferim partenerilor de rețele sociale, de
              publicitate și de analize informații despre modul în care folosiți site-ul nostru.
            </p>
            <Link href="/politica-cookies" className="cookie-modal-link">
              Citește mai mult
            </Link>
          </div>

          <div className="cookie-modal-options">
            <div className="cookie-category">
              <div>
                <h3>Necesare</h3>
                <p>
                  Cookie-urile necesare ajută la a face un site utilizabil prin activarea funcțiilor de bază, precum
                  navigarea în pagină și accesul la zonele securizate de pe site.
                </p>
              </div>
              <label className="cookie-toggle cookie-toggle-disabled">
                <input type="checkbox" checked disabled readOnly />
                <span className="cookie-toggle-switch" />
              </label>
            </div>

            <div className="cookie-category">
              <div>
                <h3>Statistici</h3>
                <p>
                  Cookie-urile de statistică îți ajută pe proprietarii unui site să înțeleagă modul în care
                  vizitatorii interacționează cu site-ul prin colectarea și raportarea informațiilor în mod anonim.
                </p>
              </div>
              <label className="cookie-toggle">
                <input
                  type="checkbox"
                  checked={preferences.statistics}
                  onChange={(e) => setPreferences((prev) => ({ ...prev, statistics: e.target.checked }))}
                />
                <span className="cookie-toggle-switch" />
              </label>
            </div>

            <div className="cookie-category">
              <div>
                <h3>Marketing</h3>
                <p>
                  Cookie-urile de marketing sunt utilizate pentru a urmări utilizatorii de la un site la altul.
                  Intenția este de a afișa anunțuri relevante și antrenante pentru utilizatorii individuali.
                </p>
              </div>
              <label className="cookie-toggle">
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) => setPreferences((prev) => ({ ...prev, marketing: e.target.checked }))}
                />
                <span className="cookie-toggle-switch" />
              </label>
            </div>
          </div>
        </div>

        <div className="cookie-modal-actions">
          <button className="btn cookie-btn-secondary" type="button" onClick={acceptNecessary}>
            Accepta cele necesare
          </button>
          <button className="btn cookie-btn-secondary" type="button" onClick={acceptSelection}>
            Accepta selecția
          </button>
          <button className="btn cookie-btn-primary" type="button" onClick={acceptAll}>
            Accepta toate
          </button>
        </div>
      </div>
    </div>
  );
}
