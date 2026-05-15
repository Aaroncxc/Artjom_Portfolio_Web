/**
 * Central contact configuration for the Artjom portfolio.
 * Centralising the address keeps the footer, navigation, and the
 * "Hire Me" CTAs in the project modal in sync.
 */

export const CONTACT_EMAIL = 'hello@artjom-naninjan.com';

export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}`;

export function buildHireMailto(subject?: string): string {
  if (!subject) return CONTACT_MAILTO;
  return `${CONTACT_MAILTO}?subject=${encodeURIComponent(subject)}`;
}
