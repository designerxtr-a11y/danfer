"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Calendar, User, CreditCard, Loader2, CheckCircle2, Minus, Plus } from "lucide-react";
import { createBooking } from "./actions";

interface Props {
  tourId: string;
  tourTitle: string;
  tourSlug: string;
  priceUsd: number;
  initialDate: string;
  initialTravelers: number;
  maxGroupSize: number;
}

type Step = "details" | "customer" | "payment";

export function CheckoutForm(props: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [step, setStep] = useState<Step>("details");
  const [error, setError] = useState<string | null>(null);

  const [date, setDate] = useState(props.initialDate);
  const [travelers, setTravelers] = useState(props.initialTravelers);
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    requests: "",
  });

  const total = props.priceUsd * travelers;

  function next() {
    if (step === "details") setStep("customer");
    else if (step === "customer") setStep("payment");
  }
  function back() {
    if (step === "payment") setStep("customer");
    else if (step === "customer") setStep("details");
  }

  function submit() {
    setError(null);
    startTransition(async () => {
      const result = await createBooking({
        tour_id: props.tourId,
        travel_date: date,
        travelers,
        total_amount: total,
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone || null,
        customer_country: customer.country || null,
        special_requests: customer.requests || null,
      });
      if ("error" in result) {
        setError(result.error);
        return;
      }
      router.push(`/reservar/confirmacion?code=${result.code}`);
    });
  }

  return (
    <div>
      {/* Steps progress */}
      <div className="flex items-center gap-3 mb-8">
        <StepDot active={step === "details"} done={step !== "details"} label="Detalles" n={1} />
        <Bar done={step !== "details"} />
        <StepDot
          active={step === "customer"}
          done={step === "payment"}
          label="Tus datos"
          n={2}
        />
        <Bar done={step === "payment"} />
        <StepDot active={step === "payment"} done={false} label="Pago" n={3} />
      </div>

      <div className="bg-white border border-night/8 rounded-2xl p-6 md:p-8">
        <AnimatePresence mode="wait">
          {step === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="font-display text-2xl text-night mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gold" />
                Cuándo y cuántos
              </h2>

              <Field label="Fecha de salida">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 10)}
                  className="w-full bg-stone border border-night/10 rounded-xl px-4 py-3 text-night focus:outline-none focus:border-gold"
                />
              </Field>

              <Field label="Viajeros">
                <div className="flex items-center justify-between bg-stone rounded-xl px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setTravelers((t) => Math.max(1, t - 1))}
                    className="w-9 h-9 rounded-full bg-white shadow-soft grid place-items-center text-night hover:bg-gold hover:text-white transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-display text-2xl text-night">
                    {travelers}{" "}
                    <span className="text-sm text-night/50 font-body">
                      {travelers === 1 ? "persona" : "personas"}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setTravelers((t) => Math.min(props.maxGroupSize, t + 1))
                    }
                    className="w-9 h-9 rounded-full bg-white shadow-soft grid place-items-center text-night hover:bg-gold hover:text-white transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </Field>
            </motion.div>
          )}

          {step === "customer" && (
            <motion.div
              key="customer"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="font-display text-2xl text-night mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-gold" />
                Tus datos
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Nombre completo" required>
                  <Input
                    value={customer.name}
                    onChange={(v) => setCustomer({ ...customer, name: v })}
                    required
                  />
                </Field>
                <Field label="Email" required>
                  <Input
                    type="email"
                    value={customer.email}
                    onChange={(v) => setCustomer({ ...customer, email: v })}
                    required
                  />
                </Field>
                <Field label="Teléfono / WhatsApp">
                  <Input
                    value={customer.phone}
                    onChange={(v) => setCustomer({ ...customer, phone: v })}
                    placeholder="+51 999 999 999"
                  />
                </Field>
                <Field label="País de origen">
                  <Input
                    value={customer.country}
                    onChange={(v) => setCustomer({ ...customer, country: v })}
                  />
                </Field>
              </div>

              <Field label="Requerimientos especiales (opcional)">
                <textarea
                  value={customer.requests}
                  onChange={(e) =>
                    setCustomer({ ...customer, requests: e.target.value })
                  }
                  rows={3}
                  className="w-full bg-stone border border-night/10 rounded-xl px-4 py-3 text-night focus:outline-none focus:border-gold resize-y"
                  placeholder="Alergias, dietas, peticiones..."
                />
              </Field>
            </motion.div>
          )}

          {step === "payment" && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="font-display text-2xl text-night mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gold" />
                Pago
              </h2>

              <div className="rounded-xl border border-dashed border-night/20 p-6 bg-stone text-center">
                <p className="text-night/60 text-sm">
                  Integración de Stripe pendiente. Por ahora se creará la reserva como{" "}
                  <strong>pendiente de pago</strong> y recibirás un email con
                  instrucciones.
                </p>
              </div>

              <div className="mt-6 space-y-3 text-sm">
                <Row label="Tour" value={props.tourTitle} />
                <Row label="Fecha" value={new Date(date + "T00:00:00").toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric" })} />
                <Row label={`${travelers} × US$${props.priceUsd.toFixed(0)}`} value={`US$${(props.priceUsd * travelers).toFixed(0)}`} />
                <div className="pt-3 border-t border-night/8 flex items-baseline justify-between">
                  <span className="text-night font-medium">Total</span>
                  <span className="font-display text-3xl text-gold font-bold">
                    US${total.toLocaleString()}
                  </span>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
                  {error}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nav buttons */}
        <div className="mt-8 flex items-center justify-between">
          {step !== "details" ? (
            <button
              type="button"
              onClick={back}
              className="text-night/60 hover:text-night text-sm transition"
            >
              ← Atrás
            </button>
          ) : (
            <span />
          )}

          {step !== "payment" ? (
            <button
              type="button"
              onClick={next}
              disabled={
                step === "customer" && (!customer.name || !customer.email)
              }
              className="bg-night hover:bg-gold text-white font-semibold px-8 py-3 rounded-full transition disabled:opacity-50"
            >
              Continuar
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={pending}
              className="flex items-center gap-2 bg-gold hover:bg-gold-bright text-white font-semibold px-8 py-3 rounded-full transition disabled:opacity-50"
            >
              {pending && <Loader2 className="w-4 h-4 animate-spin" />}
              <CheckCircle2 className="w-4 h-4" />
              Confirmar reserva
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepDot({
  active,
  done,
  label,
  n,
}: {
  active: boolean;
  done: boolean;
  label: string;
  n: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-8 h-8 rounded-full grid place-items-center text-xs font-bold transition ${
          done
            ? "bg-gold text-white"
            : active
            ? "bg-night text-white"
            : "bg-night/10 text-night/40"
        }`}
      >
        {done ? "✓" : n}
      </div>
      <span
        className={`text-sm hidden sm:inline ${
          active ? "text-night font-medium" : "text-night/50"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function Bar({ done }: { done: boolean }) {
  return (
    <span
      className={`flex-1 h-px transition ${
        done ? "bg-gold" : "bg-night/10"
      }`}
    />
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block mb-4">
      <span className="text-xs uppercase tracking-wider text-night/50">
        {label} {required && <span className="text-rose-500">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function Input({
  value,
  onChange,
  type = "text",
  ...props
}: {
  value: string;
  onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-stone border border-night/10 rounded-xl px-4 py-3 text-night focus:outline-none focus:border-gold"
      {...props}
    />
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-night/70">
      <span>{label}</span>
      <span className="text-night font-medium">{value}</span>
    </div>
  );
}
