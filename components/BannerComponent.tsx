"use client";

import { ExcludeSquare } from "@phosphor-icons/react";
import Image from "next/image";
import React from "react";

export const BannerComponent = () => {
  return (
    <div>
      <div className="flex items-center ml-20 mt-10">
        <ExcludeSquare size={40} weight="fill" />
        <h1 className="text-4xl pl-2 font-extrabold">Cash Admin</h1>
      </div>
      <Image
        src="/dashboard.gif"
        width={1000}
        height={1000}
        alt=""
        className="ml-20 mt-20 rounded-xl"
      />
    </div>
  );
};
