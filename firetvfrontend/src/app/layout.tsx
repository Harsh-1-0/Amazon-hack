// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { VoiceProvider } from "@humeai/voice-react";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flux Daylist",
  description: "Made for you by you",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* <--- FIX: Wrap everything with HumeProviders */}
      <VoiceProvider
        auth={{
          type: "apiKey",
          value: process.env.NEXT_PUBLIC_HUME_API_KEY as string,
        }}
      >
        {children}
      </VoiceProvider>
      </body>
    </html>
  );
}