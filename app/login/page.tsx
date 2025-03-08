"use client";

import { useState } from "react";
import { authClient } from "@/auth/auth-client";
import { useRouter } from "next/navigation";
import { hasRole } from "@/auth/utils";
import { getUserData } from "@/auth/data";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleLogin() {
    setIsLoading(true);
    setError("");

    try {
      const response = await authClient.signIn.social({
        provider: "google",
      });

      if (response.data) {
        const session = await getUserData(); // Fetch session data

        if (!session) {
          setError("Failed to retrieve user session.");
          return;
        }

        const userRole = session.user.role;

        // Redirect based on role
        if (hasRole(session.user, "admin")) {
          router.push("/admin/dashboard");
        } else if (hasRole(session.user, "owner")) {
          router.push("/owner/restaurants");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Sign In</h1>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>
        )}

        <div>
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign in with Google"}
          </button>
        </div>
      </div>
    </div>
  );
}
