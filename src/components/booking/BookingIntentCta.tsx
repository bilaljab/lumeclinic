"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { useBookingIntent, type BookingIntent } from "./BookingIntentContext";

type Props = {
  intent: Partial<BookingIntent>;
  children: ReactNode;
  variant?: "primary" | "secondary" | "whatsapp" | "outline-light";
  className?: string;
  "aria-label"?: string;
};

/**
 * A Button that both records intent (so the booking form preselects the
 * right treatment/doctor/package and skips the step the visitor already
 * resolved) and navigates to #booking-form — same anchor every other
 * "Book Consultation" CTA already uses, so this is a drop-in swap.
 */
export function BookingIntentCta({ intent, children, ...props }: Props) {
  const { setIntent } = useBookingIntent();
  return (
    <Button href="/#booking-form" onClick={() => setIntent(intent)} {...props}>
      {children}
    </Button>
  );
}
