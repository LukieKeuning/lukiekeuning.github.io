"use client";
import { usePreferences } from "@/context/preferences";
import { assetPath } from "@/lib/paths";
export default function NotFound() {
  const { t } = usePreferences();
  return (
    <main className="shell not-found">
      <p className="eyebrow">404</p>
      <h1>{t.notFound}</h1>
      <a className="primary-button" href={assetPath("/")}>
        {t.back}
      </a>
    </main>
  );
}
