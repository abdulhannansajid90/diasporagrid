import type { Metadata } from "next";
import { Cairo, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from "@/i18n/routing";

const cairo = Cairo({
  subsets: ["latin", "arabic"],
  variable: "--font-cairo",
  weight: ["300", "400", "500", "600", "700"],
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-ibm-plex",
  weight: ["300", "400", "500", "600", "700"],
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "DIASPORA-GRID | Pakistan's Digital Embassy",
  description: "The world's first AI-powered, multi-jurisdictional digital sovereignty and protection platform for Pakistan's 10 million overseas citizens.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function RootLayout({
  children,
  params: {locale}
}: Readonly<{
  children: React.ReactNode;
  params: {locale: string};
}>) {
  setRequestLocale(locale);
  const messages = await getMessages();
  
  // Set RTL direction for specific languages
  const dir = ['ur', 'ar', 'pa', 'ps', 'sd'].includes(locale) ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} className={cn("font-sans", cairo.variable, ibmPlexSans.variable, jetBrainsMono.variable)}>
      <body className={`${ibmPlexSans.className} antialiased bg-background text-foreground dark`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
