"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type BookingIntent = {
  treatmentSlug: string;
  doctorSlug: string;
  packageSlug: string;
};

const emptyIntent: BookingIntent = { treatmentSlug: "", doctorSlug: "", packageSlug: "" };

const BookingIntentCtx = createContext<{
  intent: BookingIntent;
  setIntent: (patch: Partial<BookingIntent>) => void;
} | null>(null);

/**
 * Page-wide booking intent — lets a Treatment/Doctor/Package CTA elsewhere on
 * the page preselect the booking form's fields instead of only handing off to
 * WhatsApp. Plain context + local state (no URL/localStorage): it only needs
 * to survive an in-page anchor scroll to #booking-form, not a reload.
 */
export function BookingIntentProvider({ children }: { children: ReactNode }) {
  const [intent, setIntentState] = useState<BookingIntent>(emptyIntent);

  function setIntent(patch: Partial<BookingIntent>) {
    setIntentState((prev) => ({ ...prev, ...patch }));
  }

  return <BookingIntentCtx.Provider value={{ intent, setIntent }}>{children}</BookingIntentCtx.Provider>;
}

export function useBookingIntent() {
  const ctx = useContext(BookingIntentCtx);
  if (!ctx) throw new Error("useBookingIntent must be used within a BookingIntentProvider");
  return ctx;
}
