import Image from "next/image";
import type { Locale } from "@/lib/site";
import { WHATSAPP_NUMBER, INSTAGRAM_URL, TIKTOK_URL } from "@/lib/site";

const LABELS: Record<
  Locale,
  {
    role: string;
    location: string;
    whatsapp: string;
    call: string;
    soon: string;
    response: string;
    social: string;
  }
> = {
  es: {
    role: "Guía Oficial · Dunaria",
    location: "Marruecos",
    whatsapp: "Chatear en WhatsApp",
    call: "Llamar",
    soon: "Próximamente",
    response: "Responde en < 1 hora",
    social: "Redes sociales",
  },
  en: {
    role: "Official Guide · Dunaria",
    location: "Morocco",
    whatsapp: "Chat on WhatsApp",
    call: "Call",
    soon: "Coming soon",
    response: "Replies within 1 hour",
    social: "Social media",
  },
  fr: {
    role: "Guide Officiel · Dunaria",
    location: "Maroc",
    whatsapp: "Chat sur WhatsApp",
    call: "Appeler",
    soon: "Prochainement",
    response: "Répond en < 1 heure",
    social: "Réseaux sociaux",
  },
};

const WA_MESSAGE: Record<Locale, string> = {
  es: encodeURIComponent("Hola, me gustaría obtener información sobre los tours en Marruecos."),
  en: encodeURIComponent("Hello, I would like information about your tours in Morocco."),
  fr: encodeURIComponent("Bonjour, je souhaite des informations sur vos tours au Maroc."),
};

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.01 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="white" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="white" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.74a4.85 4.85 0 01-1.01-.05z" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function LightningIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

export function ContactCard({ locale }: { locale: Locale }) {
  const l = LABELS[locale];
  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${WA_MESSAGE[locale]}`;
  const telHref = `tel:+${WHATSAPP_NUMBER}`;
  const phone = "+212 612 896 157";

  return (
    <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-sand-300 bg-white shadow-md">

      {/* Header — subtle gradient background */}
      <div className="bg-gradient-to-b from-sand-100 to-white px-6 pb-5 pt-8 text-center">
        {/* Avatar */}
        <div className="relative mx-auto mb-4 h-28 w-28">
          <div className="h-28 w-28 overflow-hidden rounded-full shadow-md ring-4 ring-gold/35 ring-offset-2 ring-offset-white">
            <Image
              src="/photos/guide-contact.jpeg"
              alt="M. Youssef El Khannoubi"
              width={112}
              height={112}
              className="h-full w-full object-cover object-top"
              priority
            />
          </div>
          {/* Online indicator */}
          <span className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-green-500 ring-2 ring-white shadow-sm" />
        </div>

        <h2 className="font-display text-xl font-medium leading-snug text-night">
          M. Youssef El Khannoubi
        </h2>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-gold">
          {l.role}
        </p>

        {/* Location + response time */}
        <div className="mt-3 flex items-center justify-center gap-2.5 text-[11px] text-night-600/55">
          <span className="flex items-center gap-1">
            <MapPinIcon />
            {l.location}
          </span>
          <span className="text-sand-300">·</span>
          <span className="flex items-center gap-1">
            <LightningIcon />
            {l.response}
          </span>
        </div>
      </div>

      <div className="mx-5 border-t border-sand-200" />

      {/* CTA buttons */}
      <div className="flex flex-col gap-2.5 px-5 py-5">
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 active:scale-[.98]"
          style={{ backgroundColor: "#25D366" }}
        >
          <WhatsAppIcon />
          {l.whatsapp}
        </a>
        <a
          href={telHref}
          className="flex items-center justify-center gap-2 rounded-xl border-2 border-gold py-3 text-sm font-medium text-gold transition-colors hover:bg-gold/5 active:scale-[.98]"
        >
          <PhoneIcon />
          {l.call}
          <span className="ml-0.5 font-mono text-[12px] opacity-70">{phone}</span>
        </a>
      </div>

      <div className="mx-5 border-t border-sand-200" />

      {/* Social networks */}
      <div className="px-5 pb-6 pt-4">
        <p className="mb-3 text-center font-mono text-[10px] uppercase tracking-widest text-night-600/40">
          {l.social}
        </p>
        <div className="grid grid-cols-2 gap-3">

          {/* Instagram — official gradient */}
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram @dunaria"
            className="relative flex flex-col items-center gap-2 rounded-xl px-3 py-4 transition-opacity hover:opacity-85 active:scale-[.97]"
            style={{
              background: "linear-gradient(135deg, #f58529 0%, #dd2a7b 45%, #8134af 100%)",
            }}
          >
            <InstagramIcon />
            <span className="font-mono text-xs font-medium text-white">@dunaria</span>
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-2.5 py-0.5 font-mono text-[10px] font-semibold text-gold shadow-sm">
              {l.soon}
            </span>
          </a>

          {/* TikTok — brand black */}
          <a
            href={TIKTOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok @dunaria"
            className="relative flex flex-col items-center gap-2 rounded-xl px-3 py-4 transition-opacity hover:opacity-80 active:scale-[.97]"
            style={{ backgroundColor: "#010101" }}
          >
            <TikTokIcon />
            <span className="font-mono text-xs font-medium text-white">@dunaria</span>
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-2.5 py-0.5 font-mono text-[10px] font-semibold text-gold shadow-sm">
              {l.soon}
            </span>
          </a>

        </div>
      </div>
    </div>
  );
}
