import { Spinner } from "@phosphor-icons/react";
import React from "react";

export const IsLoading = () => {
  return (
    <span>
      <Spinner className="mr-2  animate-spin" size={50} />
    </span>
  );
};
