"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn, refreshAccessToken } from "@/lib/auth";
import { Loader2 } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    async function check() {
      if (isLoggedIn()) {
        setAuthorized(true);
        setChecking(false);
        return;
      }

      // Try refresh
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        setAuthorized(true);
      } else {
        router.replace("/fr/login");
      }
      setChecking(false);
    }
    check();
  }, [router]);

  if (checking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!authorized) return null;

  return <>{children}</>;
}
