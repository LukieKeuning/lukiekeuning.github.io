import type { Language, Profile } from "../types/profile.ts";
import { safeExternalUrl } from "./paths.ts";

export function visibleSections(profile: Profile) {
  return {
    about: true,
    education:
      profile.education.length > 0 ||
      profile.qualifications.some((item) => item.name),
    experience: profile.experience.length > 0,
    skills: profile.skills.some((group) => group.items.some((item) => item)),
    projects: profile.projects.some((project) => project.title),
    interests: profile.interests.some((item) => item),
    contact: Boolean(
      profile.contact.email ||
      profile.contact.phone ||
      safeExternalUrl(profile.contact.linkedin) ||
      profile.assets.cvFile,
    ),
  };
}
export function formatDate(value: string, language: Language): string {
  if (/^\d{4}$/.test(value)) return value;
  const hasDay = /^\d{4}-\d{2}-\d{2}$/.test(value);
  return new Intl.DateTimeFormat(language === "nl" ? "nl-NL" : "en-GB", {
    ...(hasDay ? ({ day: "numeric" } as const) : {}),
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${hasDay ? value : `${value}-01`}T12:00:00Z`));
}
