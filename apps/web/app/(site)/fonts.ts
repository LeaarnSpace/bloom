import { Manrope } from "next/font/google";

// Self-hosted at build time by next/font (no request to Google from visitors).
export const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});
