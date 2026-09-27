import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSalesContext } from '../../context/SalesContext.jsx'

// Manager nav links
const MANAGER_LINKS = [
  { to: '/manager',         label: 'Dashboard',    icon: '▦' },
  { to: '/manager/history', label: 'Sales History', icon: '≡' },
  { to: '/manager/reps',    label: 'Salespersons',  icon: '◎' },
  { to: '/manager/shops',   label: 'Shops',         icon: '⌂' },
]

const SALESPERSON_LINKS = [
  { to: '/salesperson',        label: 'My Dashboard', icon: '▦' },
  { to: '/salesperson/record', label: 'Record Sale',  icon: '+' },
]

export default function Navbar() {
  const { role, setRole, isOnline, queueLength, currentRep, salesReps, setCurrentRepId } = useSalesContext()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const links = role === 'manager' ? MANAGER_LINKS : role === 'salesperson' ? SALESPERSON_LINKS : []

  function handleSwitchRole() {
    setRole(null)
    setCurrentRepId(null)
    navigate('/')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 h-14 flex items-center px-4 gap-3">
      {/* Logo */}
      <span className="font-bold text-blue-600 text-base tracking-tight select-none mr-3 shrink-0">
        SalesTrack
      </span>

      {/* Desktop nav links */}
      {role && (
        <nav className="hidden md:flex items-center gap-0.5 flex-1">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/manager' || l.to === '/salesperson'}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      )}

      {/* Spacer */}
      <div className="flex-1 md:hidden" />

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Offline badge */}
        {!isOnline && (
          <span className="bg-amber-50 text-amber-700 text-xs font-medium px-2 py-0.5 rounded border border-amber-200">
            Offline{queueLength > 0 ? ` · ${queueLength} queued` : ''}
          </span>
        )}

        {/* Rep selector (salesperson only) */}
        {role === 'salesperson' && (
          <select
            className="text-sm border border-gray-200 rounded-md px-2 py-1.5 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            value={currentRep?.id || ''}
            onChange={e => setCurrentRepId(e.target.value || null)}
          >
            <option value="">— Select rep —</option>
            {salesReps.filter(r => r.active).map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        )}

        {/* Role badge + switch */}
        {role && (
          <button
            onClick={handleSwitchRole}
            className="text-xs bg-white hover:bg-gray-50 text-gray-600 px-2.5 py-1.5 rounded-md border border-gray-200 transition-colors font-medium"
            title="Switch role"
          >
            {role === 'manager' ? 'Manager' : (currentRep?.name || 'Rep')} · Switch
          </button>
        )}

        {/* Mobile hamburger */}
        {role && (
          <button
            className="md:hidden p-1.5 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        )}
      </div>

      {/* Mobile dropdown */}
      {menuOpen && role && (
        <div className="absolute top-14 left-0 right-0 bg-white border-b border-gray-200 shadow-sm md:hidden">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/manager' || l.to === '/salesperson'}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 text-sm font-medium border-b border-gray-100 ${
                  isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  )
}
