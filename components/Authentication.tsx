import React, { useState } from "react";
import Login from "./Login";

export default async function Authentication() {
  return (
    <main className="flex h-screen w-screen">
      <section className="w-custom hidden lg:block lg:h-full">
        <video
          autoPlay
          loop
          src="/Cash Admin.mp4"
          className="h-full w-full inset-0 object-cover"
        />
      </section>
      <section className="w-full lg:w-1/2">
        <Login />
      </section>
    </main>
  );
}
