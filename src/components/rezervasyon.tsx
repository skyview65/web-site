"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { Rich, useLanguage } from "./language-provider";
import { Rv } from "./reveal";
import { DATE_FORMATS, FORM, formatDate } from "@/lib/form-dictionary";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Values {
  ad: string;
  email: string;
  tel: string;
  giris: string;
  cikis: string;
  kisi: string;
  not: string;
}

const INITIAL: Values = { ad: "", email: "", tel: "", giris: "", cikis: "", kisi: "2", not: "" };

type ErrorField = "ad" | "email" | "giris" | "cikis";
type FieldErrors = Partial<Record<ErrorField, string>>;

/** yyyy-mm-dd in the visitor's local timezone (the original used UTC, which
 * blocks "today" for users west of Greenwich until their local midnight). */
function localISO(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function nextDay(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + 1);
  return localISO(d);
}

const FOCUS_IDS: Record<ErrorField, string> = {
  ad: "rz-ad",
  email: "rz-mail",
  giris: "rz-giris",
  cikis: "rz-cikis",
};

function DateField({
  id,
  label,
  value,
  min,
  lang,
  error,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  min: string;
  lang: Parameters<typeof formatDate>[1];
  error?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="rez-field">
      <label htmlFor={id}>{label}</label>
      <div className={`datewrap${error ? " hata" : ""}`}>
        <input
          id={`${id}-v`}
          className="dateview"
          type="text"
          readOnly
          tabIndex={-1}
          aria-hidden="true"
          placeholder={DATE_FORMATS[lang].ph}
          value={formatDate(value, lang)}
        />
        <input
          id={id}
          className="datenat"
          type="date"
          required
          min={min}
          value={value}
          onChange={onChange}
          aria-label={label}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-err` : undefined}
        />
        <svg
          className="datecal"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          aria-hidden="true"
        >
          <rect x="3" y="4.5" width="18" height="16" rx="2" />
          <path d="M3 9h18M8 3v3M16 3v3" />
        </svg>
      </div>
      {error && (
        <span className="rez-err" id={`${id}-err`}>
          {error}
        </span>
      )}
    </div>
  );
}

export function Rezervasyon() {
  const { lang, t } = useLanguage();
  const fs = FORM[lang];
  const [values, setValues] = useState<Values>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submission, setSubmission] = useState<Values | null>(null);
  // Today's date in the visitor's timezone, empty during SSR — string
  // snapshots compare by value, so this stays stable all day.
  const today = useSyncExternalStore(
    () => () => {},
    () => localISO(new Date()),
    () => "",
  );
  const okRef = useRef<HTMLDivElement>(null);
  const formWrapRef = useRef<HTMLDivElement>(null);

  const set =
    (key: keyof Values) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setValues((v) => ({ ...v, [key]: value }));
      if (key === "ad" || key === "email" || key === "giris" || key === "cikis") {
        setErrors((er) => ({ ...er, [key]: undefined }));
      }
    };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const ad = values.ad.trim();
    const email = values.email.trim();
    const er: FieldErrors = {};
    if (!ad) er.ad = fs.errors.ad;
    if (!email || !EMAIL_RE.test(email)) er.email = fs.errors.email;
    if (!values.giris) er.giris = fs.errors.giris;
    if (!values.cikis) er.cikis = fs.errors.cikis;
    else if (values.giris && values.cikis <= values.giris) er.cikis = fs.errors.sira;
    setErrors(er);
    const firstInvalid = (Object.keys(FOCUS_IDS) as ErrorField[]).find((k) => er[k]);
    if (firstInvalid) {
      document.getElementById(FOCUS_IDS[firstInvalid])?.focus();
      return;
    }
    setSubmission({ ...values, ad, email });
  };

  useEffect(() => {
    if (!submission || !okRef.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    okRef.current.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    okRef.current.focus({ preventScroll: true });
  }, [submission]);

  const yeni = () => {
    setSubmission(null);
    setValues(INITIAL);
    setErrors({});
    requestAnimationFrame(() => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      formWrapRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
      document.getElementById("rz-ad")?.focus({ preventScroll: true });
    });
  };

  // Localized with the *current* language, so switching languages after
  // submitting re-renders the confirmation too (the original left it stale).
  const ozet = useMemo(() => {
    if (!submission) return "";
    const L = fs.L;
    const lines = [`${L.ad} · ${submission.ad}`, `${L.mail} · ${submission.email}`];
    if (submission.tel.trim()) lines.push(`${L.tel} · ${submission.tel.trim()}`);
    lines.push(`${L.giris} · ${formatDate(submission.giris, lang)}`);
    lines.push(`${L.cikis} · ${formatDate(submission.cikis, lang)}`);
    lines.push(`${L.kisi} · ${fs.guests[Number(submission.kisi) - 1] ?? submission.kisi}`);
    if (submission.not.trim()) lines.push(`${L.not} · ${submission.not.trim()}`);
    return lines.join("\n");
  }, [submission, fs, lang]);

  return (
    <section id="rezervasyon">
      <div className="rez-wrap">
        <div className="rez-left">
          <Rv as="span" className="etiket">
            {t("rez_tag")}
          </Rv>
          <Rv as="h2">
            <Rich text={t("rez_h2")} />
          </Rv>
          <Rv as="p" className="rez-intro">
            {fs.intro}
          </Rv>
        </div>
        <div className="rez-right">
          {!submission ? (
            <Rv>
              <div ref={formWrapRef}>
                <form className="rez-form" onSubmit={onSubmit} noValidate>
                  <div className="rez-baslik">{fs.baslik}</div>
                  <div className="rez-grid">
                    <div className="rez-field full">
                      <label htmlFor="rz-ad">{fs.ad}</label>
                      <input
                        id="rz-ad"
                        name="ad"
                        type="text"
                        autoComplete="name"
                        required
                        value={values.ad}
                        onChange={set("ad")}
                        aria-invalid={errors.ad ? true : undefined}
                        aria-describedby={errors.ad ? "rz-ad-err" : undefined}
                      />
                      {errors.ad && (
                        <span className="rez-err" id="rz-ad-err">
                          {errors.ad}
                        </span>
                      )}
                    </div>
                    <div className="rez-field">
                      <label htmlFor="rz-mail">{fs.mail}</label>
                      <input
                        id="rz-mail"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={values.email}
                        onChange={set("email")}
                        aria-invalid={errors.email ? true : undefined}
                        aria-describedby={errors.email ? "rz-mail-err" : undefined}
                      />
                      {errors.email && (
                        <span className="rez-err" id="rz-mail-err">
                          {errors.email}
                        </span>
                      )}
                    </div>
                    <div className="rez-field">
                      <label htmlFor="rz-tel">{fs.tel}</label>
                      <input
                        id="rz-tel"
                        name="tel"
                        type="tel"
                        autoComplete="tel"
                        value={values.tel}
                        onChange={set("tel")}
                      />
                    </div>
                    <DateField
                      id="rz-giris"
                      label={fs.giris}
                      value={values.giris}
                      min={today}
                      lang={lang}
                      error={errors.giris}
                      onChange={set("giris")}
                    />
                    <DateField
                      id="rz-cikis"
                      label={fs.cikis}
                      value={values.cikis}
                      min={values.giris ? nextDay(values.giris) : today}
                      lang={lang}
                      error={errors.cikis}
                      onChange={set("cikis")}
                    />
                    <div className="rez-field full">
                      <label htmlFor="rz-kisi">{fs.kisi}</label>
                      <select id="rz-kisi" name="kisi" value={values.kisi} onChange={set("kisi")}>
                        {fs.guests.map((label, i) => (
                          <option key={label} value={String(i + 1)}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="rez-field full">
                      <label htmlFor="rz-not">{fs.notlbl}</label>
                      <textarea
                        id="rz-not"
                        name="not"
                        placeholder={fs.ph}
                        value={values.not}
                        onChange={set("not")}
                      />
                    </div>
                  </div>
                  <button className="rez-cta" type="submit">
                    <span>{fs.btn}</span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      aria-hidden="true"
                    >
                      <path d="M3 12h18M14 5l7 7-7 7" />
                    </svg>
                  </button>
                  <div className="rez-note">{fs.note}</div>
                </form>
              </div>
            </Rv>
          ) : (
            <div ref={okRef} className="rez-ok rv on" role="status" tabIndex={-1}>
              <div className="seal" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M5 12.5l4 4L19 7" />
                </svg>
              </div>
              <h3 className="serif">{fs.okb}</h3>
              <p>{fs.body.replace("{ad}", submission.ad)}</p>
              <div className="ozet">{ozet}</div>
              <button type="button" className="rez-yeni" onClick={yeni}>
                {fs.yeni}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
