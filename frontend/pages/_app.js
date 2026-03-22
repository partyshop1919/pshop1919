import "../styles/globals.css";

import Navbar from "../components/navbar";
import CookieBanner from "../components/CookieBanner";
import { AuthProvider, AdminProvider } from "../lib/auth";
import { CartProvider } from "../lib/cart";
import { FavoritesProvider } from "../lib/favorites";
import Link from "next/link";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <AdminProvider>
        <CartProvider>
          <FavoritesProvider>
            <Navbar />
            <Component {...pageProps} />
            <footer className="site-footer-wrap">
              <div className="container site-footer">
                <div className="site-footer-top">
                  <h3>Informatii utile</h3>
                  <p>Date de contact, livrare, retur si raspunsuri rapide intr-un singur loc.</p>
                </div>

                <div className="site-footer-links">
                  <Link href="/contact">Contact</Link>
                  <Link href="/livrare">Livrare</Link>
                  <Link href="/retur">Retur</Link>
                  <Link href="/faq">FAQ</Link>
                </div>

                <div className="site-footer-links legal">
                  <Link href="/politica-confidentialitate">Politica de Confidentialitate</Link>
                  <Link href="/politica-cookies">Politica Cookies</Link>
                  <Link href="/termeni-si-conditii">Termeni si Conditii</Link>
                </div>
              </div>
            </footer>
            <CookieBanner />
          </FavoritesProvider>
        </CartProvider>
      </AdminProvider>
    </AuthProvider>
  );
}
