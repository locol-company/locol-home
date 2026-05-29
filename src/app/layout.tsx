import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";

const ibmPlex = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["200", "300", "400", "500", "700"],
  variable: "--font-ibm-plex",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LOCOL — The Ranch",
  description: "LOCOL service directory and health dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={ibmPlex.variable}>
      <body>{children}</body>
    </html>
  );
}
