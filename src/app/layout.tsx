import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'
import Navbar from '@/components/Navbar'
import ChatbotWrapper from '@/components/ChatbotWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'SeerBharat LMS',
  description: 'Learning Management System for SeerBharat',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <ChatbotWrapper />
        </AuthProvider>
      </body>
    </html>
  )
}
