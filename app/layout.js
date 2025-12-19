import './globals.css'
import { ThemeProvider } from '@/contexts/ThemeContext'

export const metadata = {
  title: 'CODESKYTZ - Portfolio',
  description: 'Professional coding company portfolio',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="relative">
        <ThemeProvider>
          {/* App Background Patterns */}
          <div className="app-background-pattern"></div>
          <div className="app-background-grid"></div>
          <div className="app-background-waves"></div>
          <div className="relative z-10">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  )
}

