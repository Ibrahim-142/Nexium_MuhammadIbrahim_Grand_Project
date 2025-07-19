import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import LayoutWrapper from './components/LayoutWrapper'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI-Recipe-Generator',
  description: 'Discover recipes instantly with Groq AI',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`
          ${geistSans.variable} ${geistMono.variable}
          antialiased
          bg-gradient-to-br from-indigo-50 via-white to-slate-100 
          dark:from-slate-900 dark:via-slate-950 dark:to-slate-900
          text-slate-800 dark:text-slate-100
          min-h-screen
          transition-colors duration-300
        `}
      >
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  )
}
