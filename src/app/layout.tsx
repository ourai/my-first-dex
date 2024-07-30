import type { Metadata } from "next";
import type { PropsWithChildren } from 'react';
import "./globals.css";

export const metadata: Metadata = {
  title: "My First DEX - DEX demo with Uniswap SDK",
  description: "Created by Ourai L.",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
