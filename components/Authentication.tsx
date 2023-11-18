import React, { useState } from "react";
import Login from "./Login";
import Image from "next/image";
import { BannerComponent } from "./BannerComponent";

export default async function Authentication() {
  return (
    <main className="flex h-screen w-screen lg:w-full">
      <section className="w-1/2 hidden lg:flex lg:flex-col items-start lg:h-ful">
        <BannerComponent />
      </section>
      <section className="w-full lg:w-1/2">
        <Login />
      </section>
    </main>
  );
}
