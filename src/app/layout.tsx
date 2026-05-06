import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const heebo = Heebo({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-heebo",
});

export const metadata: Metadata = {
  title: "Luz Creator – מחולל לו״ז ללמידה מרחוק",
  description: "בנה לו״ז יומי מקצועי ללמידה מרחוק בעזרת בינה מלאכותית",
  openGraph: {
    title: "Luz Creator – מחולל לו״ז ללמידה מרחוק",
    description: "בנה לו״ז יומי מקצועי ללמידה מרחוק בעזרת בינה מלאכותית",
    url: "https://luzon-ruthys.vercel.app",
    siteName: "Luz Creator",
    locale: "he_IL",
    type: "website",
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
