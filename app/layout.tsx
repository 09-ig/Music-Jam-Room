import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "@/components/session-provider"
import type React from "react" // Added import for React

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "CCSJam",
  description: "A collaborative music streaming platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <main className="min-h-screen bg-background text-foreground">
              <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
                {children}
              </div>
            </main>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}

