import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DealPrep - Company Research & Sales Prep",
  description: "Turn a company URL into a complete outbound research packet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
