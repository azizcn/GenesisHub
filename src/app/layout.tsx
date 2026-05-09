import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GenesisHub — Hackathon Survival & Deep Rust Learning",
  description:
    "Your personalized path from zero to Solana smart contracts. GenesisHub adapts to your coding background, teaches Rust through analogies, and generates hackathon project ideas with the Colosseum Copilot.",
  keywords: [
    "genesishub",
    "hackathon",
    "solana",
    "rust",
    "web3",
    "blockchain",
    "beginner",
    "learn",
    "colosseum",
    "anchor",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
