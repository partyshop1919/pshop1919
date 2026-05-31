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
    } catch {
      // Ignore parse errors
    }
  }, []);

  function saveConsent(value) {
    if (typeof window === "undefined") return;
    localStorage.setItem(COOKIE_KEY, JSON.stringify(value));
    setVisible(false);
  }

  const acceptNecessary = () => saveConsent({ essential: true, statistics: false, marketing: false });
  const acceptSelection = () =>
    saveConsent({ essential: true, statistics: preferences.statistics, marketing: preferences.marketing });
  const acceptAll = () => saveConsent({ essential: true, statistics: true, marketing: true });

  if (!visible) return null;

  return (
    <div className="cookie-modal-overlay">
      <div className="cookie-modal">
        <div className="cookie-modal-content">
          <div className="cookie-modal-copy">
            <span className="cookie-modal-badge">This website uses cookies</span>
            <h2>We use cookies for a better experience</h2>
            <p>
              We use cookies to personalize content and ads, provide social media features, and analyze our
              traffic. We also share information about your use of our site with our social media, advertising,
              and analytics partners.
            </p>
            <Link href="/politica-cookies" className="cookie-modal-link">
              Read more
            </Link>
          </div>

          <div className="cookie-modal-options">
            <div className="cookie-category">
              <div>
                <h3>Necessary</h3>
                <p>
                  Necessary cookies help make the website usable by enabling core functions such as page
                  navigation and access to secure areas of the site.
                </p>
              </div>
              <label className="cookie-toggle cookie-toggle-disabled">
                <input type="checkbox" checked disabled readOnly />
                <span className="cookie-toggle-switch" />
              </label>
            </div>

            <div className="cookie-category">
              <div>
                <h3>Statistics</h3>
                <p>
                  Statistics cookies help website owners understand how visitors interact with websites by
                  collecting and reporting information anonymously.
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
                  Marketing cookies are used to track visitors across websites. The intention is to display ads
                  that are relevant and engaging for individual users.
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
            Accept necessary only
          </button>
          <button className="btn cookie-btn-secondary" type="button" onClick={acceptSelection}>
            Accept selection
          </button>
          <button className="btn cookie-btn-primary" type="button" onClick={acceptAll}>
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
