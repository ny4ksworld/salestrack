/**
 * SalesContext — provides sales data and actions to the entire app.
 * Also exposes role/currentRep simulation via localStorage.
 */
import { createContext, useContext, useState, useCallback } from 'react';
import { useSales } from '../hooks/useSales.js';
import { useOfflineQueue } from '../hooks/useOfflineQueue.js';
import { salesReps, shops, products, STORAGE_KEYS } from '../data/mockData.js';

const SalesContext = createContext(null);

// ─── Role helpers ─────────────────────────────────────────────────────────────
function loadRole() {
  return localStorage.getItem(STORAGE_KEYS.ROLE) || null;
}
function loadCurrentRepId() {
  return localStorage.getItem(STORAGE_KEYS.CURRENT_REP) || null;
}

export function SalesProvider({ children }) {
  const { sales, addSale, approveSale, rejectSale, resubmitSale, resetToSeed } = useSales();
  const { isOnline, queueLength, enqueue } = useOfflineQueue(addSale);

  const [role, setRoleState] = useState(() => loadRole());
  const [currentRepId, setCurrentRepIdState] = useState(() => loadCurrentRepId());

  const setRole = useCallback((r) => {
    if (r) localStorage.setItem(STORAGE_KEYS.ROLE, r);
    else localStorage.removeItem(STORAGE_KEYS.ROLE);
    setRoleState(r);
  }, []);

  const setCurrentRepId = useCallback((id) => {
    if (id) localStorage.setItem(STORAGE_KEYS.CURRENT_REP, id);
    else localStorage.removeItem(STORAGE_KEYS.CURRENT_REP);
    setCurrentRepIdState(id);
  }, []);

  const currentRep = salesReps.find(r => r.id === currentRepId) || null;

  return (
    <SalesContext.Provider value={{
      // data
      sales,
      salesReps,
      shops,
      products,
      // actions
      addSale,
      approveSale,
      rejectSale,
      resubmitSale,
      resetToSeed,
      // offline queue
      isOnline,
      queueLength,
      enqueue,
      // role simulation
      role,
      setRole,
      currentRepId,
      setCurrentRepId,
      currentRep,
    }}>
      {children}
    </SalesContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSalesContext() {
  const ctx = useContext(SalesContext);
  if (!ctx) throw new Error('useSalesContext must be used inside SalesProvider');
  return ctx;
}
