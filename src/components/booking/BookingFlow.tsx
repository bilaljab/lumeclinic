"use client";

import { forwardRef, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { zodResolver } from "@/lib/formResolver";
import { doctors } from "@/data/doctors";
import { treatments } from "@/data/treatments";
import type { LocalizedText } from "@/data/types";
import { bookingWhatsAppMessage, buildWhatsAppLink } from "@/lib/whatsapp";
import { bookingDefaults, bookingSchema, stepFields, type BookingFormValues } from "./schema";

type T = ReturnType<typeof useTranslations>;

const STEP_COUNT = stepFields.length; // 4 form steps; a 5th "confirm" state follows submission

function ProgressRail({ current, t }: { current: number; t: T }) {
  const labels = ["stepTreatment", "stepDoctor", "stepDate", "stepDetails", "stepConfirm"] as const;
  return (
    <div>
      <p className="sr-only" role="status">
        {t("stepIndicator", { current: current + 1, total: labels.length })}
      </p>
      <ol className="flex gap-2" aria-hidden>
        {labels.map((key, i) => (
          <li
            key={key}
            className={cn(
              "h-1 flex-1 rounded-full",
              i <= current ? "bg-accent" : "bg-border",
            )}
            title={t(key)}
          />
        ))}
      </ol>
    </div>
  );
}

const Field = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }>(
  function Field({ label, error, id, ...props }, ref) {
    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={id} className="text-label uppercase tracking-label text-neutral">
          {label}
        </label>
        <input
          id={id}
          ref={ref}
          className="border border-border bg-canvas px-4 py-3 text-body focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          {...props}
        />
        {error ? <p className="text-label text-accent">{error}</p> : null}
      </div>
    );
  },
);

const OptionCard = forwardRef<
  HTMLInputElement,
  { active: boolean; children: ReactNode } & InputHTMLAttributes<HTMLInputElement>
>(function OptionCard({ active, children, ...inputProps }, ref) {
  return (
    <label
      className={cn(
        "cursor-pointer rounded-sm border px-4 py-3 text-body transition-colors duration-200 ease-out focus-within:outline-2 focus-within:outline-accent focus-within:outline-offset-2",
        active ? "border-accent text-accent" : "border-border text-ink hover:border-ink",
      )}
    >
      <input ref={ref} type="radio" className="sr-only" {...inputProps} />
      {children}
    </label>
  );
});

/** PRD §6, §13, §17 — mock booking flow: Treatment → Doctor → Date → Details → Confirmation. No backend. */
export function BookingFlow() {
  const lang = useLocale() as keyof LocalizedText;
  const t = useTranslations("booking");
  const tCta = useTranslations("cta");
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState<BookingFormValues | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setFocus,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: bookingDefaults,
    mode: "onBlur",
  });

  async function goNext() {
    const fields = stepFields[step];
    const valid = await trigger(fields);
    if (valid) {
      setStep((s) => Math.min(s + 1, STEP_COUNT - 1));
      return;
    }
    const firstInvalid = fields.find((f) => errors[f]) ?? fields[0];
    setFocus(firstInvalid);
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  if (submitted) {
    const treatment = treatments.find((tr) => tr.slug === submitted.treatmentSlug);
    const doctor = doctors.find((d) => d.slug === submitted.doctorSlug);

    return (
      <div className="flex flex-col gap-6">
        <ProgressRail current={STEP_COUNT} t={t} />
        <h3 className="font-display text-display-m">{t("confirmTitle")}</h3>
        <p className="max-w-md text-body text-ink/80">{t("confirmBody")}</p>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-border pt-4 text-body">
          <dt className="text-label uppercase tracking-label text-neutral">{t("stepTreatment")}</dt>
          <dd>{treatment ? treatment.name[lang] : t("notSure")}</dd>
          <dt className="text-label uppercase tracking-label text-neutral">{t("stepDoctor")}</dt>
          <dd>{doctor ? doctor.name[lang] : t("noPreference")}</dd>
          <dt className="text-label uppercase tracking-label text-neutral">{t("stepDate")}</dt>
          <dd>
            {new Date(submitted.date).toLocaleDateString(lang === "ar" ? "ar" : "en", {
              dateStyle: "long",
            })}
          </dd>
          <dt className="text-label uppercase tracking-label text-neutral">{t("fieldName")}</dt>
          <dd>{submitted.name}</dd>
        </dl>

        <div className="flex flex-wrap gap-4">
          <Button
            href={buildWhatsAppLink(lang, bookingWhatsAppMessage(treatment?.name ?? null))}
            external
            variant="whatsapp"
          >
            {tCta("whatsapp")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setSubmitted(null);
              setStep(0);
            }}
          >
            {t("newRequest")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit((values) => setSubmitted(values))} className="flex flex-col gap-8">
      <ProgressRail current={step} t={t} />

      {step === 0 ? (
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-1 text-label uppercase tracking-label text-neutral">
            {t("fieldTreatment")}
          </legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <OptionCard value="" active={watch("treatmentSlug") === ""} {...register("treatmentSlug")}>
              {t("notSure")}
            </OptionCard>
            {treatments.map((tr) => (
              <OptionCard
                key={tr.slug}
                value={tr.slug}
                active={watch("treatmentSlug") === tr.slug}
                {...register("treatmentSlug")}
              >
                {tr.name[lang]}
              </OptionCard>
            ))}
          </div>
        </fieldset>
      ) : null}

      {step === 1 ? (
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-1 text-label uppercase tracking-label text-neutral">
            {t("fieldDoctor")}
          </legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <OptionCard value="" active={watch("doctorSlug") === ""} {...register("doctorSlug")}>
              {t("noPreference")}
            </OptionCard>
            {doctors.map((d) => (
              <OptionCard
                key={d.slug}
                value={d.slug}
                active={watch("doctorSlug") === d.slug}
                {...register("doctorSlug")}
              >
                {d.name[lang]}
              </OptionCard>
            ))}
          </div>
        </fieldset>
      ) : null}

      {step === 2 ? (
        <Field
          id="date"
          type="date"
          label={t("fieldDate")}
          error={errors.date ? t("errorDate") : undefined}
          className="max-w-xs"
          min={new Date().toISOString().slice(0, 10)}
          {...register("date")}
        />
      ) : null}

      {step === 3 ? (
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            id="name"
            label={t("fieldName")}
            error={errors.name ? t("errorRequired") : undefined}
            {...register("name")}
          />
          <Field
            id="phone"
            type="tel"
            label={t("fieldPhone")}
            placeholder="+966 5X XXX XXXX"
            error={errors.phone ? t("errorPhone") : undefined}
            {...register("phone")}
          />
          <Field
            id="email"
            type="email"
            label={t("fieldEmail")}
            error={errors.email ? t("errorEmail") : undefined}
            {...register("email")}
          />
          <div className="flex flex-col gap-2 sm:col-span-2">
            <label htmlFor="notes" className="text-label uppercase tracking-label text-neutral">
              {t("fieldNotes")}
            </label>
            <textarea
              id="notes"
              rows={3}
              className="border border-border bg-canvas px-4 py-3 text-body focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
              {...register("notes")}
            />
          </div>
        </div>
      ) : null}

      <div className="flex gap-4">
        {step > 0 ? (
          <Button type="button" variant="secondary" onClick={goBack}>
            {t("back")}
          </Button>
        ) : null}
        {step < STEP_COUNT - 1 ? (
          <Button type="button" variant="primary" onClick={goNext}>
            {t("next")}
          </Button>
        ) : (
          <Button type="submit" variant="primary">
            {t("submit")}
          </Button>
        )}
      </div>
    </form>
  );
}
