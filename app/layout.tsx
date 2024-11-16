import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignOutButton,
} from "@clerk/nextjs";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import { MdPerson } from "react-icons/md";
import { Toaster } from "sonner";

import { ClientDevelopments } from "@/components/client-developments";
import { LoggedOutTop } from "@/components/logged-out-top";
import { ServerDevelopments } from "@/components/server-developments";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { LanguageSelector } from "@/components/language-selector";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "AI Buidathon Web",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={cn(
            `${geistSans.variable} ${geistMono.variable} antialiased`,
            "bg-slate-100",
          )}
        >
          <SignedIn>
            <header className="px-2 py-2 md:px-4">
              <nav className="flex items-center justify-between">
                <div>
                  <Link href="/">TOP</Link>
                </div>
                <div className="flex justify-end gap-4">
                  <LanguageSelector locale={"en"} />
                  <Link
                    href="/mypage"
                    className={cn(buttonVariants({ variant: "outline" }))}
                  >
                    <MdPerson size={24} />
                  </Link>
                  <div className={cn(buttonVariants({ variant: "outline" }))}>
                    <SignOutButton />
                  </div>
                </div>
              </nav>
            </header>
            <div
              className={cn(
                "mx-auto px-4 py-4 md:w-11/12 md:px-0 md:py-8",
                "mb-16",
              )}
            >
              {children}
            </div>
          </SignedIn>
          <SignedOut>
            <LoggedOutTop />
          </SignedOut>
          <div className="fixed bottom-0 flex flex-col gap-4">
            <ClientDevelopments />
            <ServerDevelopments />
          </div>
          <Toaster position="top-center" richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}
