import type { Metadata } from "next";
import "./globals.css";
import "./billing.css";
import navStyles from "./nav.module.css";

export const metadata: Metadata = {
  title: "BrewSupport Flow AI",
  description: "Trustworthy AI-assisted SaaS support operations dashboard",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <nav className={navStyles.nav} aria-label="Portfolio views">
          <a href="/">Support workspace</a>
          <a href="/intelligence">Operations intelligence</a>
        </nav>
        {children}
      </body>
    </html>
  );
}
