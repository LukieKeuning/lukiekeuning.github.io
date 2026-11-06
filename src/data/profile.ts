import { content } from "./content.ts";

// Edit nl.json and en.json. This module only exposes the typed content.
export const profiles = { nl: content.nl.profile, en: content.en.profile };
export const profile = profiles.nl;
