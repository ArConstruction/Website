"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { services } from "@/lib/data";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Front-end demo only; wire to your backend / email service here.
    setSent(true);
  };

  const inputClasses =
    "w-full border border-white/15 bg-ink px-4 py-3.5 text-sm text-white placeholder-white/35 outline-none transition-colors focus:border-gold";
  const labelClasses =
    "mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-white/60";

  if (sent) {
    return (
      <div className="flex h-full min-h-[420px] flex-col items-center justify-center border border-gold/30 bg-ink-700 p-10 text-center">
        <CheckCircle2 className="h-14 w-14 text-gold" />
        <h3 className="font-display mt-5 text-2xl font-semibold text-white">
          Thank you!
        </h3>
        <p className="mt-3 max-w-sm text-sm text-white/60">
          Your message has been received. A member of the AR Construction team
          will be in touch within one business day.
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-7 font-display text-sm font-medium uppercase tracking-wider text-gold hover:text-gold-light"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-white/10 bg-ink-700 p-7 sm:p-9"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClasses} htmlFor="name">
            Full Name
          </label>
          <input id="name" name="name" required placeholder="John Smith" className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses} htmlFor="phone">
            Phone
          </label>
          <input id="phone" name="phone" type="tel" placeholder="(647) 000-0000" className={inputClasses} />
        </div>
      </div>

      <div className="mt-5">
        <label className={labelClasses} htmlFor="email">
          Email
        </label>
        <input id="email" name="email" type="email" required placeholder="you@email.com" className={inputClasses} />
      </div>

      <div className="mt-5">
        <label className={labelClasses} htmlFor="service">
          Service of Interest
        </label>
        <select id="service" name="service" className={inputClasses} defaultValue="">
          <option value="" disabled>
            Select a service…
          </option>
          {services.map((s) => (
            <option key={s.slug} value={s.title} className="bg-ink">
              {s.title}
            </option>
          ))}
          <option value="Other" className="bg-ink">
            Other / General Inquiry
          </option>
        </select>
      </div>

      <div className="mt-5">
        <label className={labelClasses} htmlFor="message">
          Project Details
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Tell us about your project, timeline and location…"
          className={`${inputClasses} resize-none`}
        />
      </div>

      <button
        type="submit"
        className="group mt-7 inline-flex w-full items-center justify-center gap-2 bg-gold px-8 py-4 font-display text-sm font-medium uppercase tracking-wider text-ink transition-all duration-300 hover:bg-gold-light sm:w-auto"
      >
        Send Message
        <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </form>
  );
}
