import "../styles/globals.css";

import Navbar from "../components/navbar";
import { AuthProvider, AdminProvider } from "../lib/auth";
import { CartProvider } from "../lib/cart";
import { FavoritesProvider } from "../lib/favorites";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <AdminProvider>
        <CartProvider>
          <FavoritesProvider>
            <Navbar />
            <Component {...pageProps} />
          </FavoritesProvider>
        </CartProvider>
      </AdminProvider>
    </AuthProvider>
  );
}
