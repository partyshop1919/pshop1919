import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

/* =====================
   STORAGE KEYS
===================== */
const USER_TOKEN_KEY = "authToken";
const USER_KEY = "authUser";
const ADMIN_TOKEN_KEY = "adminToken";

/* =====================
   SAFE STORAGE
===================== */
function safeGet(key) {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key, value) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, value);
  } catch {}
}

function safeRemove(key) {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch {}
}

/* =====================================================
   USER AUTH CONTEXT
===================================================== */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =====================
     HYDRATE ON CLIENT
  ===================== */
  useEffect(() => {
    const savedToken = safeGet(USER_TOKEN_KEY);
    const savedUser = safeGet(USER_KEY);

    if (savedToken) {
      setToken(savedToken);
    }

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        safeRemove(USER_KEY);
      }
    }

    setLoading(false);
  }, []);

  /* =====================
     LOGIN / LOGOUT
  ===================== */
  function loginUser(jwtToken, userData) {
    if (!jwtToken || !userData) return;

    safeSet(USER_TOKEN_KEY, jwtToken);
    safeSet(USER_KEY, JSON.stringify(userData));

    setToken(jwtToken);
    setUser(userData);
  }

  function logoutUser() {
    safeRemove(USER_TOKEN_KEY);
    safeRemove(USER_KEY);

    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isLoggedIn: Boolean(user),
        loginUser,
        logoutUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }
  return ctx;
}

/* =====================================================
   ADMIN AUTH CONTEXT
===================================================== */
export const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = safeGet(ADMIN_TOKEN_KEY);
    if (saved) setToken(saved);
    setLoading(false);
  }, []);

  function loginAdmin(jwtToken) {
    if (!jwtToken) return;
    safeSet(ADMIN_TOKEN_KEY, jwtToken);
    setToken(jwtToken);
  }

  function logoutAdmin() {
    safeRemove(ADMIN_TOKEN_KEY);
    setToken(null);
  }

  return (
    <AdminContext.Provider
      value={{
        token,
        loading,
        isLoggedIn: Boolean(token),
        loginAdmin,
        logoutAdmin
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error(
      "useAdmin must be used inside AdminProvider"
    );
  }
  return ctx;
}

/* =====================================================
   RAW TOKEN ACCESS (API / CART / USER ID)
===================================================== */
export function getUserToken() {
  return safeGet(USER_TOKEN_KEY);
}

export function getAdminToken() {
  return safeGet(ADMIN_TOKEN_KEY);
}
export function getUser() {
  const raw = safeGet(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    safeRemove(USER_KEY);
    return null;
  }
}

