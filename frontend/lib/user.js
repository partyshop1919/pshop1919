import { getUserToken } from "./auth";

/* =====================
   USER IDENTIFIER
===================== */
export function getUserId() {
  if (typeof window === "undefined") {
    return null;
  }

  /* =====================
     AUTHENTICATED USER
  ===================== */
  const token = getUserToken();

  if (token) {
    try {
      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      if (
        payload &&
        typeof payload.id === "string" &&
        payload.id.length > 0
      ) {
        return `user:${payload.id}`;
      }
    } catch {
      // token invalid → fallback to guest
    }
  }

  /* =====================
     GUEST FALLBACK
  ===================== */
  const KEY = "guestId";
  let guestId = localStorage.getItem(KEY);

  if (!guestId) {
    guestId =
      typeof crypto !== "undefined" &&
      crypto.randomUUID
        ? crypto.randomUUID()
        : `guest-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}`;

    localStorage.setItem(KEY, guestId);
  }

  return `guest:${guestId}`;
}
