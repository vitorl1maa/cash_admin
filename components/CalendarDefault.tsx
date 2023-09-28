"use client";

import React from "react";
import { Calendar } from "@/components/ui/calendar";

export const CalendarDefault = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border w-full"
    />
  );
};