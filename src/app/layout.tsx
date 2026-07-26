import type { Metadata } from "next";
import { DM_Sans, Francois_One } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const francoisOne = Francois_One({
  variable: "--font-francois-one",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Sweet Disorder Wholesale",
  description: "Prescribing fun, wholesale-side. Order history and reordering for Sweet Disorder stockists.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${francoisOne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
