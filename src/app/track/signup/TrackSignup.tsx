"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, HardHat, Loader2, ShieldCheck } from "lucide-react";
import { getTrackSupabase } from "@/lib/supabaseTrack";

const inputClass =
  "w-full border border-white/10 bg-ink-700 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-gold";
const labelClass = "text-xs font-semibold uppercase tracking-[0.18em] text-white/45";

export default function TrackSignup() {
  const router = useRouter();
  const supabase = useMemo(() => getTrackSupabase(), []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");

    setLoading(true);
    setError("");

    const response = await fetch("/api/track/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: formData.get("full_name"),
        email,
        password,
        trade: formData.get("trade"),
        phone: formData.get("phone"),
      }),
    });

    const payload = (await response.json()) as { error?: string };

    if (!response.ok) {
      setError(payload.error ?? "Could not create account.");
      setLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("Account created. Return to login and sign in with your password.");
      setLoading(false);
      return;
    }

    router.push("/track");
    router.refresh();
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-ink text-white">
      <div className="absolute inset-0">
        <Image
          src="/images/epoxy-application.jpg"
          alt="AR Construction contractor work"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/60" />
        <div className="noise absolute inset-0 opacity-50" />
      </div>

      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section>
          <Image
            src="/images/logo-full.png"
            alt="AR Construction"
            width={150}
            height={162}
            className="h-20 w-auto"
          />
          <p className="eyebrow mt-10 text-gold">Contractor Access</p>
          <h1 className="font-display mt-5 max-w-2xl text-5xl font-bold uppercase leading-none sm:text-6xl lg:text-7xl">
            Create Your Track Account
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/65">
            Contractor accounts can receive assigned tasks, update field progress,
            upload proof photos, and mark work complete.
          </p>
        </section>

        <form onSubmit={handleSignup} className="border border-white/10 bg-ink-800/85 p-6 sm:p-8">
          <HardHat className="h-8 w-8 text-gold" />
          <h2 className="font-display mt-5 text-2xl font-semibold uppercase">
            Contractor Signup
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className={labelClass}>Full Name</span>
              <input className={`${inputClass} mt-2`} name="full_name" required />
            </label>
            <label className="block">
              <span className={labelClass}>Trade / Role</span>
              <input
                className={`${inputClass} mt-2`}
                name="trade"
                placeholder="Drywall, flooring, plumbing..."
                required
              />
            </label>
            <label className="block">
              <span className={labelClass}>Phone</span>
              <input className={`${inputClass} mt-2`} name="phone" type="tel" />
            </label>
            <label className="block sm:col-span-2">
              <span className={labelClass}>Email</span>
              <input className={`${inputClass} mt-2`} name="email" type="email" required />
            </label>
            <label className="block sm:col-span-2">
              <span className={labelClass}>Password</span>
              <input
                className={`${inputClass} mt-2`}
                name="password"
                type="password"
                minLength={8}
                required
              />
            </label>
          </div>

          {error && (
            <p className="mt-5 border border-red-300/20 bg-red-300/10 px-4 py-3 text-sm text-red-100">
              {error}
            </p>
          )}

          <div className="mt-7 grid gap-3 sm:grid-cols-[1fr_auto]">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 bg-gold px-6 py-4 font-display text-sm font-semibold uppercase tracking-wider text-ink transition hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              Create Account
            </button>
            <Link
              href="/track"
              className="inline-flex items-center justify-center gap-2 border border-white/10 px-6 py-4 font-display text-sm font-semibold uppercase tracking-wider text-white/65 transition hover:border-gold hover:text-gold"
            >
              <ArrowLeft className="h-4 w-4" />
              Login
            </Link>
          </div>

          <div className="mt-6 flex items-start gap-3 border border-white/10 bg-ink-700/70 px-4 py-4 text-sm leading-6 text-white/55">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            Admin accounts are not self-registered from this page.
          </div>
        </form>
      </div>
    </main>
  );
}
