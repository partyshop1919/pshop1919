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
                  <h3>Useful information</h3>
                  <p>Contact details, shipping, returns, and quick answers all in one place.</p>
                </div>

                <div className="site-footer-links">
                  <Link href="/contact">Contact</Link>
                  <Link href="/livrare">Shipping</Link>
                  <Link href="/retur">Returns</Link>
                  <Link href="/faq">FAQ</Link>
                </div>

                <div className="site-footer-links legal">
                  <Link href="/politica-confidentialitate">Privacy Policy</Link>
                  <Link href="/politica-cookies">Cookie Policy</Link>
                  <Link href="/termeni-si-conditii">Terms and Conditions</Link>
                </div>

                <div className="site-footer-cta">
                  <a
                    href="https://wa.me/40700000000?text=Hello%20Evamat!%20I%20would%20like%20more%20details%20about%20your%20products."
                    target="_blank"
                    rel="noreferrer"
                    className="btn whatsapp-btn"
                  >
                    WhatsApp Contact
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
