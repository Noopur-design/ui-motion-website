import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, CircleAlert, Copy, LoaderCircle, Mail } from "lucide-react";
import { site } from "@/content/site";
import { budgetRanges, projectTypes } from "@/content/studio";
import { Field, Input, Textarea } from "@/components/ui/field";
import { Button, ArrowNudge } from "@/components/ui/button";
import { Reveal, SectionLabel, SplitReveal } from "@/components/decor/Reveal";
import { HandArrow } from "@/components/decor/Scribbles";
import { hand } from "@/components/art/palette";
import { cn } from "@/lib/utils";
import { easeOutExpo } from "@/lib/motion";
import { useSearchParams } from "react-router";

const ENDPOINT = (import.meta.env.VITE_FORM_ENDPOINT as string | undefined)?.trim() || "";

type Values = {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  message: string;
  /** Honeypot — real visitors never see or fill this. */
  website: string;
};
type Errors = Partial<Record<keyof Values, string>>;
type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; name: string; email: string }
  | { kind: "mailto" }
  | { kind: "error"; message: string };

const empty: Values = { name: "", email: "", company: "", projectType: "", budget: "", message: "", website: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Please tell us your name.";
  if (!v.email.trim()) e.email = "We need an email address to reply to.";
  else if (!EMAIL_RE.test(v.email.trim())) e.email = "That email address doesn’t look quite right.";
  if (!v.projectType) e.projectType = "Pick the closest project type.";
  if (v.message.trim().length < 20) e.message = "A sentence or two about the idea helps us reply properly (20+ characters).";
  return e;
}

const fieldOrder: (keyof Values)[] = ["name", "email", "company", "projectType", "budget", "message"];

export function Contact({ index = "01", headingAs = "h1" }: { index?: string; headingAs?: "h1" | "h2" }) {
  const [params] = useSearchParams();
  const prefill = params.get("type") ?? "";
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const formRef = useRef<HTMLFormElement>(null);
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;

  // A service or case study can pre-select the project type.
  useEffect(() => {
    if (prefill && projectTypes.includes(prefill)) {
      setValues((v) => ({ ...v, projectType: prefill }));
      setErrors((e) => ({ ...e, projectType: undefined }));
    }
  }, [prefill]);

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    const next = { ...values, [key]: value };
    setValues(next);
    if (touched[key] || errors[key]) setErrors((e) => ({ ...e, [key]: validate(next)[key] }));
  };

  const blur = (key: keyof Values) => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors((e) => ({ ...e, [key]: validate(values)[key] }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status.kind === "submitting") return;

    const found = validate(values);
    setErrors(found);
    setTouched(Object.fromEntries(fieldOrder.map((k) => [k, true])));
    const firstInvalid = fieldOrder.find((k) => found[k]);
    if (firstInvalid) {
      const el = formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`);
      el?.focus();
      return;
    }

    // Bots fill the hidden field; drop the submission quietly.
    if (values.website) {
      setStatus({ kind: "success", name: values.name.trim(), email: values.email.trim() });
      return;
    }

    const payload = {
      name: values.name.trim(),
      email: values.email.trim(),
      company: values.company.trim(),
      projectType: values.projectType,
      budget: values.budget,
      message: values.message.trim(),
      _subject: `New project enquiry — ${values.company.trim() || values.name.trim()}`,
    };

    if (!ENDPOINT) {
      // No form service configured: hand the message to the visitor's email app.
      const body = [
        `Name: ${payload.name}`,
        `Email: ${payload.email}`,
        payload.company ? `Company: ${payload.company}` : null,
        `Project type: ${payload.projectType}`,
        payload.budget ? `Budget: ${payload.budget}` : null,
        "",
        payload.message,
      ]
        .filter((line) => line !== null)
        .join("\n");
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(payload._subject)}&body=${encodeURIComponent(body)}`;
      setStatus({ kind: "mailto" });
      return;
    }

    setStatus({ kind: "submitting" });
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      if (!res.ok) {
        let detail = "";
        try {
          const data = (await res.json()) as { errors?: { message?: string }[]; error?: string };
          detail = data.errors?.map((x) => x.message).filter(Boolean).join(" ") || data.error || "";
        } catch {
          /* non-JSON error body */
        }
        throw new Error(detail || `The form service responded with ${res.status}.`);
      }
      setStatus({ kind: "success", name: payload.name, email: payload.email });
      setValues(empty);
      setTouched({});
    } catch (err) {
      const aborted = err instanceof DOMException && err.name === "AbortError";
      setStatus({
        kind: "error",
        message: aborted ? "The request timed out." : err instanceof Error ? err.message : "Something went wrong.",
      });
    } finally {
      window.clearTimeout(timeout);
    }
  };

  const describedBy = (k: keyof Values, hint = false) =>
    errors[k] ? `${id(k)}-error` : hint ? `${id(k)}-hint` : undefined;

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative pb-24 pt-8 md:pb-32 md:pt-14">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <SectionLabel index={index}>Contact</SectionLabel>
          <SplitReveal
            as={headingAs}
            immediate={headingAs === "h1"}
            id="contact-title"
            className="display mt-6 text-[clamp(2.8rem,6.4vw,6rem)]"
            parts={[
              { text: "Got an Idea That", breakAfter: true },
              { text: "Deserves to" },
              { text: "Move?", className: "serif-accent text-orange" },
            ]}
          />
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-md text-xl leading-relaxed text-ink-soft">
              Tell us what you’re imagining. Let’s turn it into something worth watching.
            </p>
          </Reveal>

          <Reveal delay={0.2} className="mt-12 border-t border-ink/15 pt-8">
            <p className="label-mono text-ink-soft">Prefer email?</p>
            <EmailLink />
            {site.location && <p className="mt-4 text-ink-soft">{site.location}</p>}
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {site.socials
                .filter((s) => s.href)
                .map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium underline decoration-ink/25 underline-offset-4 transition-colors hover:decoration-ink"
                    >
                      {s.label} <span aria-hidden>↗</span>
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
            </ul>
          </Reveal>
        </div>

        <div className="relative lg:col-span-7">
          <HandArrow className="absolute -left-16 -top-6 hidden h-16 w-20 text-cobalt xl:block" delay={0.4} />
          <Reveal className="relative rounded-md bg-paper-2 p-6 shadow-[inset_0_0_0_1px_rgb(20_18_16/0.08)] sm:p-8 md:p-10">
            <AnimatePresence mode="wait" initial={false}>
              {status.kind === "success" ? (
                <Result key="success" title={`Thanks${status.name ? `, ${status.name.split(" ")[0]}` : ""}. Your brief is with us.`}>
                  <p>
                    We’ll reply to <strong className="text-ink">{status.email}</strong>. Keep an eye on your inbox (and the
                    spam folder, just in case).
                  </p>
                  <Button variant="outline" className="mt-8" onClick={() => setStatus({ kind: "idle" })}>
                    Send another message
                  </Button>
                </Result>
              ) : (
                <motion.form
                  key="form"
                  ref={formRef}
                  noValidate
                  onSubmit={onSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid gap-8"
                  aria-describedby={`${id("form")}-note`}
                >
                  <p id={`${id("form")}-note`} className="text-sm text-ink-soft">
                    Fields marked <span aria-hidden>*</span>
                    <span className="sr-only">with an asterisk</span> are required.
                  </p>

                  <div className="grid gap-8 sm:grid-cols-2">
                    <Field id={id("name")} label="Name *" error={errors.name}>
                      <Input
                        id={id("name")}
                        name="name"
                        autoComplete="name"
                        value={values.name}
                        onChange={(e) => set("name", e.target.value)}
                        onBlur={() => blur("name")}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={describedBy("name")}
                        aria-required
                        placeholder="Your name"
                      />
                    </Field>
                    <Field id={id("email")} label="Email *" error={errors.email}>
                      <Input
                        id={id("email")}
                        name="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        value={values.email}
                        onChange={(e) => set("email", e.target.value)}
                        onBlur={() => blur("email")}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={describedBy("email")}
                        aria-required
                        placeholder="you@company.com"
                      />
                    </Field>
                  </div>

                  <Field id={id("company")} label="Company or brand" optional>
                    <Input
                      id={id("company")}
                      name="company"
                      autoComplete="organization"
                      value={values.company}
                      onChange={(e) => set("company", e.target.value)}
                      placeholder="Who’s it for?"
                    />
                  </Field>

                  <fieldset aria-describedby={errors.projectType ? `${id("projectType")}-error` : undefined}>
                    <legend className="label-mono text-ink-soft">Project type *</legend>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {projectTypes.map((t) => (
                        <label key={t} className="relative">
                          <input
                            type="radio"
                            name="projectType"
                            value={t}
                            checked={values.projectType === t}
                            onChange={() => {
                              set("projectType", t);
                              setTouched((x) => ({ ...x, projectType: true }));
                            }}
                            className="peer sr-only"
                          />
                          <span
                            className={cn(
                              "inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full px-4 text-sm font-medium transition-colors duration-200",
                              "bg-paper shadow-[inset_0_0_0_1px_rgb(20_18_16/0.2)] hover:shadow-[inset_0_0_0_1px_var(--color-ink)]",
                              "peer-checked:bg-ink peer-checked:text-paper peer-checked:shadow-none",
                              "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-cobalt",
                            )}
                          >
                            {values.projectType === t && <Check className="size-3.5 text-lime" aria-hidden />}
                            {t}
                          </span>
                        </label>
                      ))}
                    </div>
                    {errors.projectType && (
                      <p id={`${id("projectType")}-error`} className="mt-3 flex items-center gap-1.5 text-sm font-medium text-rust">
                        <CircleAlert className="size-4" aria-hidden />
                        {errors.projectType}
                      </p>
                    )}
                  </fieldset>

                  <Field id={id("budget")} label="Estimated budget" optional>
                    <div className="relative">
                      <select
                        id={id("budget")}
                        name="budget"
                        value={values.budget}
                        onChange={(e) => set("budget", e.target.value)}
                        className="w-full appearance-none rounded-none border-0 border-b-[1.5px] border-ink/25 bg-transparent py-3 pr-8 text-lg text-ink transition-colors hover:border-ink/50 focus:border-cobalt focus:outline-none"
                      >
                        <option value="">Select a range</option>
                        {budgetRanges.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                      <span aria-hidden className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-ink-soft">
                        ↓
                      </span>
                    </div>
                  </Field>

                  <Field id={id("message")} label="Project description *" error={errors.message} hint="What is it, who is it for, and when do you need it?">
                    <Textarea
                      id={id("message")}
                      name="message"
                      value={values.message}
                      onChange={(e) => set("message", e.target.value)}
                      onBlur={() => blur("message")}
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={describedBy("message", true)}
                      aria-required
                      placeholder="Tell us about the idea…"
                      rows={5}
                    />
                  </Field>

                  {/* Honeypot */}
                  <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
                    <label htmlFor={id("website")}>Leave this field empty</label>
                    <input
                      id={id("website")}
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={values.website}
                      onChange={(e) => set("website", e.target.value)}
                    />
                  </div>

                  <div aria-live="polite" aria-atomic="true">
                    {status.kind === "error" && (
                      <div role="alert" className="flex gap-3 rounded-md bg-orange/10 p-4 text-ink shadow-[inset_0_0_0_1px_rgb(240_75_20/0.4)]">
                        <CircleAlert className="mt-0.5 size-5 shrink-0 text-rust" aria-hidden />
                        <div className="text-sm leading-relaxed">
                          <p className="font-semibold">Your message wasn’t sent.</p>
                          <p className="mt-1 text-ink-soft">
                            {status.message} Your details are still here — try again, or email us at{" "}
                            <a className="font-semibold text-ink underline underline-offset-2" href={`mailto:${site.email}`}>
                              {site.email}
                            </a>
                            .
                          </p>
                        </div>
                      </div>
                    )}
                    {status.kind === "mailto" && (
                      <div className="flex gap-3 rounded-md bg-lavender-soft p-4 text-sm leading-relaxed">
                        <Mail className="mt-0.5 size-5 shrink-0" aria-hidden />
                        <p>
                          We’ve opened your email app with the message ready to go — it’s only sent once you press send
                          there. Nothing opened? Write to{" "}
                          <a className="font-semibold underline underline-offset-2" href={`mailto:${site.email}`}>
                            {site.email}
                          </a>
                          .
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                    <Button type="submit" size="lg" disabled={status.kind === "submitting"} aria-disabled={status.kind === "submitting"}>
                      {status.kind === "submitting" ? (
                        <>
                          <LoaderCircle className="size-5 animate-spin" aria-hidden /> Sending…
                        </>
                      ) : (
                        <>
                          Let’s Make It Happen <ArrowNudge />
                        </>
                      )}
                    </Button>
                    <p className="text-xl text-ink-soft" style={hand} aria-hidden>
                      no brief too small (or too weird)
                    </p>
                  </div>
                  {import.meta.env.DEV && !ENDPOINT && (
                    <p className="label-mono text-ink-faint">Dev: set VITE_FORM_ENDPOINT to post submissions to a form service.</p>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Result({ title, children }: { title: string; children: ReactNode }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => ref.current?.focus(), []);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: easeOutExpo }}
      className="py-6 text-lg leading-relaxed text-ink-soft"
      role="status"
    >
      <span className="grid size-14 place-items-center rounded-full bg-lime text-ink">
        <Check className="size-7" aria-hidden />
      </span>
      <h3 ref={ref} tabIndex={-1} className="display mt-6 text-[clamp(2rem,4vw,3.25rem)] text-ink outline-none">
        {title}
      </h3>
      <div className="mt-4">{children}</div>
    </motion.div>
  );
}

function EmailLink() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };
  return (
    <div className="mt-3 flex flex-wrap items-center gap-3">
      <a
        href={`mailto:${site.email}`}
        className="display break-all text-[clamp(1.6rem,3vw,2.5rem)] underline decoration-ink/20 decoration-2 underline-offset-[6px] transition-colors hover:decoration-orange"
      >
        {site.email}
      </a>
      <button
        type="button"
        onClick={copy}
        className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-semibold shadow-[inset_0_0_0_1px_rgb(20_18_16/0.25)] transition-colors hover:bg-ink hover:text-paper"
      >
        {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
        <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
      </button>
    </div>
  );
}
