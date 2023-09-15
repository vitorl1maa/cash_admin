import React, { useState } from "react";
import Login from "./Login";
import { getCurrentUser } from "@/lib/session";

export default async function Authentication() {
  const user = await getCurrentUser();
  return (
    <main className="flex h-screen w-screen">
      <section className="w-custom hidden lg:block">
        <img src="/banner2.png" alt="" className="h-full w-screen" />
      </section>
      <section className="w-full lg:w-1/2">
        <Login />
      </section>
    </main>
  );
}
