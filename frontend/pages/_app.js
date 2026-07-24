import "../styles/globals.css";
import Head from "next/head";

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
            <Head>
              <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
            </Head>
            <Navbar />
            <Component {...pageProps} />
            <footer className="site-footer-wrap">
              <div className="container site-footer">
                <div className="site-footer-top">
                  <h3>Informații utile</h3>
                  <p>Date de contact, livrare, retururi și răspunsuri rapide, toate într-un singur loc.</p>
                </div>

                <div className="site-footer-links">
                  <Link href="/contact">Contact</Link>
                  <Link href="/livrare">Livrare</Link>
                  <Link href="/retur">Retur</Link>
                  <Link href="/faq">FAQ</Link>
                </div>

                <div className="site-footer-links legal">
                  <Link href="/politica-confidentialitate">Politica de confidențialitate</Link>
                  <Link href="/politica-cookies">Politica de cookies</Link>
                  <Link href="/termeni-si-conditii">Termeni și condiții</Link>
                </div>

                <div className="site-footer-cta">
                  <a
                    href="https://wa.me/40761189399?text=Bună%20Evamat!%20Aș%20dori%20mai%20multe%20detalii%20despre%20produsele%20voastre."
                    target="_blank"
                    rel="noreferrer"
                    className="btn whatsapp-btn"
                  >
                    Contact WhatsApp
                  </a>
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
