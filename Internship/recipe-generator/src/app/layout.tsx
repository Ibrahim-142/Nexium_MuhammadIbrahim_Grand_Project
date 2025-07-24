import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import LayoutWrapper from './components/LayoutWrapper'
import { ThemeProvider } from 'next-themes'
const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })
export const metadata: Metadata = {
  title: 'AI-Recipe-Generator',
  description: 'Discover recipes instantly with Groq AI',
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`
          ${geistSans.variable} ${geistMono.variable}
          antialiased
          min-h-screen
          text-foreground
          bg-gradient-to-br from-indigo-100 via-white to-pink-100
          dark:from-slate-900 dark:via-slate-950 dark:to-slate-900
          bg-fixed bg-no-repeat
          transition-colors duration-300
          selection:bg-primary/20 selection:text-primary
        `}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LayoutWrapper>{children}</LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
