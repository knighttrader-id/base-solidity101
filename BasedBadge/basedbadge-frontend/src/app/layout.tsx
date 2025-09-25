import type { Metadata } from "next";
import { Providers } from "@/providers/WagmiProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "BasedBadge - ERC1155 Multi-Token System",
  description: "Create, issue, and manage badges, certificates, and achievements on Base",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}