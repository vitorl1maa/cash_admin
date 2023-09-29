"use client";

import React from "react";
import { Calendar } from "@/components/ui/calendar";
import ptBR from "date-fns/esm/locale/pt-BR/index";

export const CalendarDefault = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      locale={ptBR}
      className="rounded-md border w-full"
    />
  );
};
