import { z } from "zod";

/** Client-UX validation only — no backend consumes this. Re-validate server-side before any real API trusts this data. */
export const bookingSchema = z.object({
  treatmentSlug: z.string(),
  doctorSlug: z.string(),
  /** Carried from a Package CTA elsewhere on the page — display-only, no dedicated step/validation. */
  packageSlug: z.string(),
  date: z.string().refine((val) => {
    if (!val) return false;
    const chosen = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return chosen >= today;
  }),
  name: z.string().trim().min(2),
  phone: z.string().trim().min(8),
  email: z.union([z.literal(""), z.string().trim().email()]),
  notes: z.string().max(500),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;

export const bookingDefaults: BookingFormValues = {
  treatmentSlug: "",
  doctorSlug: "",
  packageSlug: "",
  date: "",
  name: "",
  phone: "",
  email: "",
  notes: "",
};

/** Fields validated before each step advances. */
export const stepFields: (keyof BookingFormValues)[][] = [
  ["treatmentSlug"],
  ["doctorSlug"],
  ["date"],
  ["name", "phone", "email"],
];
