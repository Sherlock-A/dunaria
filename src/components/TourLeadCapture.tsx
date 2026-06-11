"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import type { Locale } from "@/lib/site";

type Step1 = { firstName: string; email: string };
type Step2 = { lastName: string; phone: string; tourInterest: string };

export function TourLeadCapture({
  locale,
  tourName,
}: {
  locale: Locale;
  tourName?: string;
}) {
  const t = useTranslations("leadCapture");
  const [step, setStep] = useState<1 | 2>(1);
  const [step1, setStep1] = useState<Step1>({ firstName: "", email: "" });
  const [step2, setStep2] = useState<Step2>({
    lastName: "",
    phone: "",
    tourInterest: tourName ?? "",
  });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validStep1 =
    step1.firstName.trim().length > 0 && step1.email.includes("@");

  const validStep2 =
    step2.lastName.trim().length > 0 && step2.phone.trim().length > 0;

  function nextStep() {
    if (validStep1) setStep(2);
  }

  async function submit() {
    if (!validStep2) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: step1.email,
          firstName: step1.firstName,
          lastName: step2.lastName,
          phone: step2.phone,
          tourInterest: step2.tourInterest,
          locale,
          type: "tour",
        }),
      });
      if (res.ok) {
        setDone(true);
      } else {
        setError(t("errorRetry"));
      }
    } catch {
      setError(t("errorRetry"));
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-gold/30 bg-sand-200 p-6">
        <p className="font-display text-xl font-medium text-gold-600">
          {t("success")}
        </p>
        <p className="mt-1 text-night-700">{t("successBody")}</p>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-lg border border-sand-400 bg-white px-4 py-2.5 text-night outline-none placeholder:text-night-600/40 focus:border-gold";

  return (
    <div
      className="rounded-2xl border border-gold/30 bg-sand-200 p-6 space-y-5"
      id="contact"
    >
      {/* Header + step dots */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-xl font-medium text-night">
            {t("title")}
          </p>
          <p className="mt-1 text-night-700">{t("body")}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 pt-1">
          {([1, 2] as const).map((n) => (
            <motion.div
              key={n}
              animate={{
                width: step === n ? 24 : 8,
                backgroundColor: step === n ? "#C8A45D" : "#EBDBBF",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="h-2 rounded-full"
            />
          ))}
        </div>
      </div>

      {/* Steps */}
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.22, ease: [0, 0, 0.2, 1] }}
            className="space-y-4"
          >
            <input
              type="text"
              placeholder={`${t("firstName")} *`}
              value={step1.firstName}
              onChange={(e) =>
                setStep1((p) => ({ ...p, firstName: e.target.value }))
              }
              className={inputCls}
              autoComplete="given-name"
            />
            <input
              type="email"
              placeholder={`${t("emailPlaceholder")} *`}
              value={step1.email}
              onChange={(e) =>
                setStep1((p) => ({ ...p, email: e.target.value }))
              }
              className={inputCls}
              autoComplete="email"
              onKeyDown={(e) => e.key === "Enter" && nextStep()}
            />
            <div className="flex justify-end">
              <button
                onClick={nextStep}
                disabled={!validStep1}
                className="rounded-lg bg-gold px-6 py-2.5 font-medium text-night transition-colors hover:bg-gold-600 disabled:opacity-50"
              >
                {t("next")}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.22, ease: [0, 0, 0.2, 1] }}
            className="space-y-4"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                placeholder={`${t("lastName")} *`}
                value={step2.lastName}
                onChange={(e) =>
                  setStep2((p) => ({ ...p, lastName: e.target.value }))
                }
                className={inputCls}
                autoComplete="family-name"
              />
              <input
                type="tel"
                placeholder={`${t("phonePlaceholder")} *`}
                value={step2.phone}
                onChange={(e) =>
                  setStep2((p) => ({ ...p, phone: e.target.value }))
                }
                className={inputCls}
                autoComplete="tel"
              />
            </div>
            <input
              type="text"
              placeholder={t("tourInterestPlaceholder")}
              value={step2.tourInterest}
              onChange={(e) =>
                setStep2((p) => ({ ...p, tourInterest: e.target.value }))
              }
              className={inputCls}
            />

            {error && (
              <p className="text-sm font-medium text-red-600">{error}</p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setStep(1)}
                className="text-sm text-night-600/60 transition-colors hover:text-night"
              >
                {t("back")}
              </button>
              <div className="flex flex-wrap items-center gap-4">
                <p className="text-xs text-night-600/50">{t("privacy")}</p>
                <button
                  onClick={submit}
                  disabled={loading || !validStep2}
                  className="shrink-0 rounded-lg bg-gold px-6 py-2.5 font-medium text-night transition-colors hover:bg-gold-600 disabled:opacity-50"
                >
                  {loading ? "…" : t("button")}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
