"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { createOrder, captureOrder } from "./actions";

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: Record<string, unknown>) => { render: (el: HTMLElement) => void };
    };
  }
}

export function PaypalButton({
  token,
  clientId,
  chargeLabel,
}: {
  token: string;
  clientId: string;
  chargeLabel: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "paid" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const scriptId = "paypal-sdk";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    function renderButtons() {
      if (!window.paypal || !containerRef.current) return;
      containerRef.current.innerHTML = "";
      window.paypal
        .Buttons({
          style: { layout: "vertical", color: "gold", shape: "pill", label: "pay" },
          createOrder: async () => {
            const res = await createOrder(token);
            if (!res.ok) {
              setStatus("error");
              setError(res.error);
              throw new Error(res.error);
            }
            return res.orderId;
          },
          onApprove: async (data: { orderID: string }) => {
            const res = await captureOrder(data.orderID);
            if (!res.ok) {
              setStatus("error");
              setError(res.error);
              return;
            }
            setStatus("paid");
          },
          onError: (err: unknown) => {
            setStatus("error");
            setError(err instanceof Error ? err.message : "Payment could not be completed");
          },
        })
        .render(containerRef.current);
      setStatus("ready");
    }

    if (script) {
      if (window.paypal) renderButtons();
      else script.addEventListener("load", renderButtons);
      return;
    }

    script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture`;
    script.addEventListener("load", renderButtons);
    script.addEventListener("error", () => {
      setStatus("error");
      setError("Could not load PayPal");
    });
    document.body.appendChild(script);
  }, [clientId, token]);

  if (status === "paid") {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-700">
        <CheckCircle2 className="w-5 h-5 shrink-0" />
        <p className="text-sm font-medium">
          Payment received — thank you! We&rsquo;ll be in touch on WhatsApp to confirm everything.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div ref={containerRef} className="max-w-sm" />
      {status === "loading" && (
        <div className="flex items-center gap-2 text-night/50 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading payment options…
        </div>
      )}
      {status === "error" && error && <p className="text-sm text-rose-600 mt-2">{error}</p>}
      <p className="text-xs text-night/50 mt-3">
        Charged in USD via PayPal, {chargeLabel} (includes PayPal&rsquo;s processing fee).
      </p>
    </div>
  );
}
