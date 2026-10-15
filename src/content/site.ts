/**
 * Studio-wide settings. Everything a visitor sees about the studio's identity
 * and contact details is edited here.
 *
 * "Inbetween" is a working name — change `name`/`legalName` and the wordmark,
 * page title and footer update everywhere (also update index.html meta tags).
 */
export const site = {
  name: "Inbetween",
  legalName: "Inbetween Studio",
  descriptor: "Motion design & animation studio",
  /** Shown in the contact section, footer and mobile menu. Replace before launch. */
  email: "hello@example.com",
  /** Optional, e.g. "Lisbon — working worldwide". Leave empty to hide. */
  location: "",
  /** Replace each href with your profile URL. Entries with an empty href are hidden. */
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/" },
    { label: "Vimeo", href: "https://vimeo.com/" },
    { label: "Behance", href: "https://www.behance.net/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
  ],
  /** Top-level pages. Each is its own route (see src/App.tsx). */
  nav: [
    { label: "Work", href: "/work" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

export type NavItem = (typeof site.nav)[number];
