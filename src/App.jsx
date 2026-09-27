import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SalesProvider, useSalesContext } from './context/SalesContext.jsx'
import LandingPage from './pages/LandingPage.jsx'
import ManagerDashboard from './pages/ManagerDashboard.jsx'
import SalesHistoryPage from './pages/SalesHistoryPage.jsx'
import SalespersonsPage from './pages/SalespersonsPage.jsx'
import ShopsPage from './pages/ShopsPage.jsx'
import SalespersonDashboard from './pages/SalespersonDashboard.jsx'
import RecordSale from './pages/RecordSale.jsx'

// Guard: redirect to landing if no role set
function RequireRole({ role: required, children }) {
  const { role } = useSalesContext();
  if (!role) return <Navigate to="/" replace />;
  if (required && role !== required) {
    return <Navigate to={role === 'manager' ? '/manager' : '/salesperson'} replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      {/* Manager routes */}
      <Route path="/manager" element={
        <RequireRole role="manager"><ManagerDashboard /></RequireRole>
      } />
      <Route path="/manager/history" element={
        <RequireRole role="manager"><SalesHistoryPage /></RequireRole>
      } />
      <Route path="/manager/reps" element={
        <RequireRole role="manager"><SalespersonsPage /></RequireRole>
      } />
      <Route path="/manager/shops" element={
        <RequireRole role="manager"><ShopsPage /></RequireRole>
      } />

      {/* Salesperson routes */}
      <Route path="/salesperson" element={
        <RequireRole role="salesperson"><SalespersonDashboard /></RequireRole>
      } />
      <Route path="/salesperson/record" element={
        <RequireRole role="salesperson"><RecordSale /></RequireRole>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <SalesProvider>
        <AppRoutes />
      </SalesProvider>
    </BrowserRouter>
  )
}

export default App
