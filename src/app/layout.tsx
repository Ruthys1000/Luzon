import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const heebo = Heebo({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-heebo",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://luzon-ruthys.vercel.app"),
  title: "Luz Creator – מחולל לו״ז ללמידה מרחוק",
  description: "תכננו יום למידה מרחוק בלי להשקיע שעות — לו״ז מלא + הודעת WhatsApp תוך 3 דקות",
  openGraph: {
    title: "Luz Creator – מחולל לו״ז ללמידה מרחוק",
    description: "תכננו יום למידה מרחוק בלי להשקיע שעות — לו״ז מלא + הודעת WhatsApp תוך 3 דקות",
    url: "https://luzon-ruthys.vercel.app",
    siteName: "Luz Creator",
    locale: "he_IL",
    type: "website",
    images: [
      {
        url: "/hero-illustration.png",
        width: 1200,
        height: 630,
        alt: "Luz Creator — מחולל לו״ז ללמידה מרחוק",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
