
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { ThemeProvider } from "@/components/theme-provider";

const openAiSans = localFont({
  src: [
    { path: "../../public/fonts/OpenAISans-Light.woff2", weight: "300", style: "normal" },
    { path: "../../public/fonts/OpenAISans-LightItalic.woff2", weight: "300", style: "italic" },
    { path: "../../public/fonts/OpenAISans-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/OpenAISans-RegularItalic.woff2", weight: "400", style: "italic" },
    { path: "../../public/fonts/OpenAISans-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/OpenAISans-MediumItalic.woff2", weight: "500", style: "italic" },
    { path: "../../public/fonts/OpenAISans-Semibold.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/OpenAISans-SemiboldItalic.woff2", weight: "600", style: "italic" },
    { path: "../../public/fonts/OpenAISans-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/OpenAISans-BoldItalic.woff2", weight: "700", style: "italic" },
  ],
  variable: "--font-openai",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Joshua Aaron | Modern Blog",
  description: "Personal blog of Joshua Aaron. Thoughts on technology, design, and the future.",
  openGraph: {
    title: "Joshua Aaron | Modern Blog",
    description: "Thoughts on technology, design, and the future.",
    type: "website",
    locale: "en_US",
    siteName: "Joshua Aaron Blog",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${openAiSans.variable} antialiased min-h-screen flex flex-col font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NavBar />
          <main className="flex-1">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
