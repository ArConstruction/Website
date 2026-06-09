"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, HardHat, Loader2, ShieldCheck } from "lucide-react";
import { getTrackSupabase } from "@/lib/supabaseTrack";

const inputClass =
  "w-full min-h-11 border border-white/10 bg-ink-700 px-4 py-3 text-base text-white outline-none transition placeholder:text-white/30 focus:border-gold sm:min-h-0 sm:text-sm";
const labelClass = "text-xs font-semibold uppercase tracking-[0.14em] text-white/45 sm:tracking-[0.18em]";
const primaryButtonClass =
  "inline-flex min-h-11 w-full items-center justify-center gap-2 bg-gold px-6 py-3.5 font-display text-sm font-semibold uppercase tracking-wider text-ink transition hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-60 sm:py-4";

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
    <main className="relative min-h-[100dvh] overflow-x-hidden bg-ink text-white supports-[min-height:100dvh]:min-h-dvh">
      <div className="absolute inset-0">
        <Image
          src="/images/epoxy-application.jpg"
          alt="AR Construction contractor work"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/92 to-ink/75 sm:bg-gradient-to-r sm:from-ink sm:via-ink/90 sm:to-ink/60" />
        <div className="noise absolute inset-0 opacity-50" />
      </div>

      <div className="relative mx-auto flex min-h-[100dvh] max-w-7xl flex-col justify-center gap-8 px-4 py-8 supports-[min-height:100dvh]:min-h-dvh sm:gap-10 sm:px-8 sm:py-10 lg:grid lg:min-h-screen lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <section className="text-center lg:text-left">
          <Image
            src="/images/logo-full.png"
            alt="AR Construction"
            width={150}
            height={162}
            className="mx-auto h-16 w-auto sm:h-20 lg:mx-0"
          />
          <p className="eyebrow mt-6 text-gold sm:mt-10">Contractor Access</p>
          <h1 className="font-display mt-4 text-4xl font-bold uppercase leading-none sm:mt-5 sm:text-5xl lg:max-w-2xl lg:text-7xl">
            Create Your Track Account
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/65 sm:mt-6 sm:text-base sm:leading-7 lg:mx-0">
            Your admin must add you first. Sign up with the same email they used, or the phone
            number they added if no email was provided.
          </p>
        </section>

        <form onSubmit={handleSignup} className="border border-white/10 bg-ink-800/85 p-5 sm:p-8">
          <HardHat className="h-8 w-8 text-gold" />
          <h2 className="font-display mt-5 text-xl font-semibold uppercase sm:text-2xl">
            Contractor Signup
          </h2>
          <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5">
            <label className="block sm:col-span-2">
              <span className={labelClass}>Full Name</span>
              <input className={`${inputClass} mt-2`} name="full_name" required autoComplete="name" />
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
              <input className={`${inputClass} mt-2`} name="phone" type="tel" autoComplete="tel" />
            </label>
            <label className="block sm:col-span-2">
              <span className={labelClass}>Email</span>
              <input className={`${inputClass} mt-2`} name="email" type="email" required autoComplete="email" />
            </label>
            <label className="block sm:col-span-2">
              <span className={labelClass}>Password</span>
              <input
                className={`${inputClass} mt-2`}
                name="password"
                type="password"
                minLength={8}
                required
                autoComplete="new-password"
              />
            </label>
          </div>

          {error && (
            <p className="mt-5 border border-red-300/20 bg-red-300/10 px-4 py-3 text-sm text-red-100">
              {error}
            </p>
          )}

          <div className="mt-6 grid gap-3 sm:mt-7">
            <button type="submit" disabled={loading} className={primaryButtonClass}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              Create Account
            </button>
            <Link
              href="/track"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 border border-white/10 px-6 py-3.5 font-display text-sm font-semibold uppercase tracking-wider text-white/65 transition hover:border-gold hover:text-gold sm:py-4"
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
