import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Custom hook to handle tab/window visibility changes
 * Redirects to a failure page if user leaves the tab/window
 */
export function useVisibilityChange() {
  const router = useRouter();

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // User left the tab/window
        localStorage.setItem("testFailed", "true");
        router.push("/failed");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [router]);
}
