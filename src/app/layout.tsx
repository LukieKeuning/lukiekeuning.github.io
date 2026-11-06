import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { PreferencesProvider } from "@/context/preferences";
import { profile } from "@/data/profile";
import { assetPath } from "@/lib/paths";
import "./globals.css";

const geist = localFont({
  src: "../../public/fonts/geist-latin.woff2",
  variable: "--font-geist",
  display: "swap",
  weight: "100 900",
});
export const metadata: Metadata = {
  title: `${profile.personal.name} — ${profile.personal.title}`,
  description: profile.personal.introduction,
  icons: { icon: assetPath("favicon.svg") },
  openGraph: {
    title: `${profile.personal.name} — ${profile.personal.title}`,
    description: profile.personal.introduction,
    type: "website",
    locale: "nl_NL",
  },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1 };
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{document.documentElement.dataset.theme=localStorage.getItem('lk-theme')==='dark'?'dark':'light'}catch{}",
          }}
        />
      </head>
      <body className={geist.variable}>
        <PreferencesProvider>{children}</PreferencesProvider>
      </body>
    </html>
  );
}
