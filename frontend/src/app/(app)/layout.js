'use client'

import { useAuth } from '@/hooks/auth'
import Loading from '@/app/(app)/Loading'


export default function RootLayout({ children }) {
  const { user } = useAuth({ middleware: 'auth' })

  if (!user) {
    return <Loading />
  }

  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}