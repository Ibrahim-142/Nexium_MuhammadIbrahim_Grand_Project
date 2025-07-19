'use client'

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 dark:border-slate-700 pt-6 text-center text-sm text-slate-600 dark:text-slate-400">
      <p>
        © {new Date().getFullYear()} <span className="font-semibold text-slate-800 dark:text-slate-200">AI Recipe Generator</span> — Built with ❤️ using Groq AI & Next.js
      </p>
      <div className="mt-2 space-x-4">
        <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer" className="hover:underline">
          GitHub
        </a>
        <a href="/privacy" className="hover:underline">
          Privacy
        </a>
        <a href="/contact" className="hover:underline">
          Contact
        </a>
      </div>
    </footer>
  )
}
