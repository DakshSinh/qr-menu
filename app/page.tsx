"use client";

import { authClient } from "@/auth/auth-client";

export default function Home() {
  const session = authClient.useSession().data;

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {session ? (
          <>
            <h1 className="text-3xl font-bold">
              Welcome back, {session.user.name}!
              You are: {session.user.role}!
            </h1>
            <button
              onClick={async () => {
                await authClient.signOut();
              }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <button
            onClick={async () => {
              await authClient.signIn.social({ provider: "google" });
            }}
          >
            Login with Google
          </button>
        )}
      </main>
    </div>
  );
}
