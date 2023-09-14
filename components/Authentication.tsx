import React, { useState } from "react";
import Login from "./Login";
import { getCurrentUser } from "@/lib/session";

export default async function Authentication() {
  const user = await getCurrentUser();
  return (
    <main className="flex h-screen w-full">
      <section className="w-1/2 hidden lg:block">
        <img src="/banner2.jpg" alt="" className="h-full w-full" />
      </section>
      <section className="w-full lg:w-1/2">
        <Login />
      </section>
    </main>
  );
}
