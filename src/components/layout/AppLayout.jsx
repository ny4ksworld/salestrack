/**
 * AppLayout — wraps all authenticated pages with Navbar + content padding.
 */
import Navbar from './Navbar.jsx'

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen" style={{ background: '#f8f9fb' }}>
      <Navbar />
      <main className="pt-14">
        {children}
      </main>
    </div>
  )
}
