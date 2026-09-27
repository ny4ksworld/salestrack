import { useNavigate } from 'react-router-dom'
import { useSalesContext } from '../context/SalesContext.jsx'

export default function LandingPage() {
  const { setRole, setCurrentRepId, salesReps } = useSalesContext()
  const navigate = useNavigate()

  function pickManager() {
    setRole('manager')
    setCurrentRepId(null)
    navigate('/manager')
  }

  function pickSalesperson() {
    const firstRep = salesReps.find(r => r.active)
    setRole('salesperson')
    setCurrentRepId(firstRep?.id || null)
    navigate('/salesperson')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: '#f8f9fb' }}>
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">SalesTrack</h1>
        <p className="text-gray-500 mt-2 text-sm">Kenya Sales Management — select your role to continue</p>
      </div>

      {/* Role cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-lg">
        {/* Manager */}
        <button
          type="button"
          onClick={pickManager}
          className="group bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-sm p-7 text-left transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <div className="w-9 h-9 rounded-md bg-blue-50 flex items-center justify-center mb-4">
            <span className="text-blue-600 text-base font-bold select-none">M</span>
          </div>
          <h2 className="text-base font-semibold text-gray-900 group-hover:text-blue-700">Manager</h2>
          <p className="text-sm text-gray-500 mt-1">
            View dashboards, approve or reject sales, and track rep performance.
          </p>
        </button>

        {/* Salesperson */}
        <button
          type="button"
          onClick={pickSalesperson}
          className="group bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-sm p-7 text-left transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <div className="w-9 h-9 rounded-md bg-gray-100 flex items-center justify-center mb-4">
            <span className="text-gray-500 text-base font-bold select-none">S</span>
          </div>
          <h2 className="text-base font-semibold text-gray-900 group-hover:text-blue-700">Salesperson</h2>
          <p className="text-sm text-gray-500 mt-1">
            Record new sales, view your performance and track your targets.
          </p>
        </button>
      </div>

      <p className="text-xs text-gray-400 mt-10">Demo mode — no login required</p>
    </div>
  )
}
