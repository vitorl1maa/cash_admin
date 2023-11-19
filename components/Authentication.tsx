import React, { useState } from "react";
import Login from "./Login";
import Image from "next/image";
import { BannerComponent } from "./BannerComponent";

export default async function Authentication() {
  return (
    <main className="flex gap-24 h-screen w-screen lg:w-full">
      <section className="w-1/2 hidden lg:flex lg:flex-col items-center justify-center lg:h-full">
        <BannerComponent />
      </section>
      <section className="w-full lg:w-1/2 ">
        <Login />
      </section>
    </main>
  );
}
