import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OAuth Launch Planner & Feasibility Engine | Composio APM",
  description: "Plan your AI agent's OAuth critical path to 'any user can connect', flag fatal capability ceilings, and discover when to use Composio Managed Auth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-zinc-100 min-h-screen antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
        {children}
      </body>
    </html>
  );
}
