import type { Metadata } from "next";
import FontLoader from "@/components/FontLoader";
import "./globals.css";

export const metadata: Metadata = {
  title: "StagiaireConnect - Gestion de Stages",
  description: "La plateforme tout-en-un pour la gestion des stages",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased" suppressHydrationWarning>
        <FontLoader />
        {children}
      </body>
    </html>
  );
}
