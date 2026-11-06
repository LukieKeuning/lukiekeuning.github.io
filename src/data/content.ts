import nl from "./nl.json" with { type: "json" };
import en from "./en.json" with { type: "json" };
import type { Language, Profile } from "../types/profile";

export type InterfaceText = Record<keyof typeof nl.ui, string>;
export interface SiteContent {
  profile: Profile;
  ui: InterfaceText;
}

// Both JSON files are checked against the same content structure at build time.
export const content: Record<Language, SiteContent> = { nl, en };
