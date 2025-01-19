import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <main className="min-h-screen bg-background text-foreground">
            <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
              {children}
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}

