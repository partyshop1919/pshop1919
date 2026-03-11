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
            <footer className="container" style={{ paddingTop: 10, paddingBottom: 30, fontSize: 14, opacity: 0.9 }}>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <Link href="/politica-confidentialitate">Politica de Confidentialitate</Link>
                <Link href="/politica-cookies">Politica Cookies</Link>
                <Link href="/termeni-si-conditii">Termeni si Conditii</Link>
              </div>
            </footer>
            <CookieBanner />
          </FavoritesProvider>
        </CartProvider>
      </AdminProvider>
    </AuthProvider>
  );
}
