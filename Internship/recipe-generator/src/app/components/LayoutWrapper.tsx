'use client'
import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideNavbar = pathname.startsWith('/login')

  return (
    <>
      {!hideNavbar && <Navbar />}
      <main className="max-w-4xl mx-auto px-4">{children}</main>
    </>
  )
}
