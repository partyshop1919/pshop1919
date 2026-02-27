import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAdmin } from "../lib/auth";

export default function AdminGuard({ children }) {
  const router = useRouter();
  const { token, loading } = useAdmin();

  useEffect(() => {
    if (!loading && !token) {
      router.replace("/admin/login");
    }
  }, [token, loading, router]);

  if (loading || !token) {
    return null;
  }

  return children;
}
