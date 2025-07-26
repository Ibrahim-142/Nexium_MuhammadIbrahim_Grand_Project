import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import LayoutWrapper from './components/LayoutWrapper'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'

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
          <Toaster
            position="top-center"
            theme="light"
            toastOptions={{
              className: `
                bg-white dark:bg-black
                text-black dark:text-white
                border border-black/10 dark:border-white/20
                shadow-md rounded-xl px-4 py-3
              `,
              descriptionClassName: 'text-xs text-gray-600 dark:text-gray-400 mt-1',
              closeButton: true,
              duration: 4000,
            }}
          />
          <LayoutWrapper>{children}</LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
