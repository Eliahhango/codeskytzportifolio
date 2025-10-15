import AdminLayout from '../../components/AdminLayout'

export const metadata = {
  title: 'Admin Dashboard - Codesky',
  description: 'Codesky Admin Management Portal',
}

export default function Layout({ children }) {
  return <AdminLayout>{children}</AdminLayout>
}

// Hide main navbar on admin pages
export const viewport = {
  themeColor: '#081A2E',
}