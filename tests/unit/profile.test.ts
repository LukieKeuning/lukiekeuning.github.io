import { test } from "node:test";
import assert from "node:assert/strict";
import {
  assetPath,
  resolveBasePath,
  safeExternalUrl,
} from "../../src/lib/paths.ts";
import { visibleSections, formatDate } from "../../src/lib/profile.ts";
import type { Profile } from "../../src/types/profile.ts";

test("root and repository deployments resolve without double prefixes", () => {
  assert.equal(resolveBasePath("someone/someone.github.io"), "");
  assert.equal(resolveBasePath("someone/portfolio"), "/portfolio");
  assert.equal(resolveBasePath(""), "");
  assert.equal(resolveBasePath("someone/portfolio", ""), "");
  assert.equal(
    assetPath("cv/resume.pdf", "/portfolio"),
    "/portfolio/cv/resume.pdf",
  );
  assert.equal(
    assetPath("/portfolio/cv/resume.pdf", "/portfolio"),
    "/portfolio/cv/resume.pdf",
  );
  assert.equal(
    assetPath("https://example.com/a.jpg", "/portfolio"),
    "https://example.com/a.jpg",
  );
  assert.throws(() => resolveBasePath("", "../bad"));
});
test("optional sections appear only for supplied information", () => {
  const empty = {
    education: [],
    qualifications: [],
    experience: [],
    skills: [],
    projects: [],
    interests: [],
    contact: { email: "", phone: "", linkedin: "" },
    assets: { cvFile: "" },
  } as unknown as Profile;
  assert.equal(visibleSections(empty).projects, false);
  assert.equal(visibleSections(empty).contact, false);
  const updated = structuredClone(empty);
  updated.projects = [{ title: "Studieproject" }] as Profile["projects"];
  updated.contact.email = "test@example.com";
  assert.equal(visibleSections(updated).projects, true);
  assert.equal(visibleSections(updated).contact, true);
  updated.qualifications = [
    { id: "certificate", name: "Certificate", date: "2026" },
  ];
  assert.equal(visibleSections(updated).education, true);
});
test("dates are localized and unsafe external links are rejected", () => {
  assert.match(formatDate("2026-09", "nl"), /2026/);
  assert.match(formatDate("2026-09", "en"), /Sept/);
  assert.equal(formatDate("2019", "nl"), "2019");
  assert.equal(formatDate("2026-03-23", "en"), "23 Mar 2026");
  assert.equal(safeExternalUrl("javascript:alert(1)"), undefined);
  assert.equal(safeExternalUrl(""), undefined);
});
