import React from "react";
import { getCurrentUser } from "@/lib/session";
import ClientAuth from "@/components/ClientAuth";
import ServerAuth from "@/components/ServerAuth";
import Dashboard from "@/components/Dashboard";

export default async function dashboard() {
  return (
    <>
      <Dashboard />
    </>
  );
}
