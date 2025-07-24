import { useEffect, useState } from 'react'
export function useDarkMode() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldUseDark = stored === 'dark' || (!stored && prefersDark)

    setIsDark(shouldUseDark)
    document.documentElement.classList.toggle('dark', shouldUseDark)
  }, [])

  const toggleDark = () => {
    const newDark = !isDark
    setIsDark(newDark)
    localStorage.setItem('theme', newDark ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', newDark)
  }

  return { isDark, toggleDark }
}
