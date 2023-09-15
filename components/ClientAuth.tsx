"use client";

import { useSession } from "next-auth/react";

export default function ClientAuth() {
  const session = useSession();

  return (
    <>
      {session?.data && (
        <div className="bg-red-300 w-full h-60">
          <h1 className="text-3xl font-bold">Client component</h1>
          {JSON.stringify(session)}
        </div>
      )}
    </>
  );
}
