import AdminLayout from '../../components/AdminLayout'

export const metadata = {
  title: 'Admin Dashboard - Codesky',
  description: 'Codesky Admin Management Portal',
}

export default function Layout({ children }) {
  return <AdminLayout>{children}</AdminLayout>
}