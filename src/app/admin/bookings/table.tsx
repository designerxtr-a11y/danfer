"use client";

import { useState, useTransition } from "react";
import { updateBookingStatus } from "./actions";

interface Booking {
  id: string;
  booking_code: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  travel_date: string;
  travelers: number;
  total_amount: number;
  currency: string;
  status: string;
  payment_status: string;
  created_at: string;
  tourTitle: string;
}

const statusOptions = ["pending", "confirmed", "cancelled", "completed", "refunded"];

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-300",
  confirmed: "bg-emerald-100 text-emerald-800 border-emerald-300",
  cancelled: "bg-rose-100 text-rose-800 border-rose-300",
  completed: "bg-blue-100 text-blue-800 border-blue-300",
  refunded: "bg-night/10 text-night/70 border-night/20",
};

export function BookingsTable({ bookings }: { bookings: Booking[] }) {
  const [filter, setFilter] = useState<string>("all");

  const filtered = bookings.filter((b) => filter === "all" || b.status === filter);

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-4">
        {["all", ...statusOptions].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs border transition ${
              filter === s
                ? "bg-night text-white border-night"
                : "bg-white border-night/10 text-night/70 hover:border-night/30"
            }`}
          >
            {s === "all" ? "Todas" : s}
            <span className="ml-1.5 text-[10px] opacity-70">
              {s === "all"
                ? bookings.length
                : bookings.filter((b) => b.status === s).length}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-white border border-night/8 rounded-2xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-night/40">Sin reservas.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-stone">
              <tr className="text-left text-night/50 text-xs uppercase tracking-wider">
                <th className="px-6 py-3 font-medium">Código</th>
                <th className="px-6 py-3 font-medium">Cliente</th>
                <th className="px-6 py-3 font-medium">Tour</th>
                <th className="px-6 py-3 font-medium">Fecha</th>
                <th className="px-6 py-3 font-medium">Personas</th>
                <th className="px-6 py-3 font-medium">Total</th>
                <th className="px-6 py-3 font-medium">Pago</th>
                <th className="px-6 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <BookingRow key={b.id} booking={b} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

function BookingRow({ booking }: { booking: Booking }) {
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState(booking.status);

  function changeStatus(next: string) {
    setStatus(next);
    startTransition(() => updateBookingStatus(booking.id, next));
  }

  return (
    <tr className="border-t border-night/5 hover:bg-stone/40">
      <td className="px-6 py-3 font-mono text-xs text-night/70">{booking.booking_code}</td>
      <td className="px-6 py-3">
        <div className="text-night font-medium">{booking.customer_name}</div>
        <div className="text-xs text-night/50">{booking.customer_email}</div>
      </td>
      <td className="px-6 py-3 text-night/80">{booking.tourTitle}</td>
      <td className="px-6 py-3 text-night/70">
        {new Date(booking.travel_date).toLocaleDateString("es-PE", {
          day: "numeric", month: "short", year: "numeric",
        })}
      </td>
      <td className="px-6 py-3 text-center text-night/70">{booking.travelers}</td>
      <td className="px-6 py-3 font-medium text-night">
        {booking.currency} {Number(booking.total_amount).toLocaleString()}
      </td>
      <td className="px-6 py-3">
        <span
          className={`px-2 py-0.5 rounded text-xs ${
            booking.payment_status === "paid"
              ? "bg-emerald-100 text-emerald-800"
              : "bg-night/10 text-night/70"
          }`}
        >
          {booking.payment_status}
        </span>
      </td>
      <td className="px-6 py-3">
        <select
          value={status}
          onChange={(e) => changeStatus(e.target.value)}
          disabled={pending}
          className={`text-xs border rounded-full px-2.5 py-1 focus:outline-none disabled:opacity-50 ${statusColors[status]}`}
        >
          {statusOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </td>
    </tr>
  );
}
