import './globals.css'
import ClientWrapper from '../components/ClientWrapper'

export const metadata = {
  title: 'Codeskytz - Innovation With No Limit',
  description: 'Codeskytz — modern web, AI and security solutions',
}

const fontLink = 'https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap'

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={fontLink} rel="stylesheet" />
      </head>
      <body className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-h-full">
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  )
}
