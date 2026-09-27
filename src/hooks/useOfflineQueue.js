/**
 * useOfflineQueue — lightweight offline-first write queue.
 *
 * When a salesperson submits a sale without network access, the action is
 * pushed onto a persistent queue in localStorage.  When connectivity is
 * restored (or on mount if the device is online) the queue is drained and
 * the real useSales.addSale action is called for each item.
 *
 * For the MVP there is no real API, so "draining" the queue simply calls
 * the local addSale action — simulating what would happen once a backend
 * is added.  The queue also provides a visible offline indicator.
 *
 * Usage:
 *   const { isOnline, queueLength, enqueue } = useOfflineQueue(addSale);
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { STORAGE_KEYS } from '../data/mockData.js';

// ─── localStorage helpers ─────────────────────────────────────────────────────

function loadQueue() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUEUE);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistQueue(queue) {
  try {
    localStorage.setItem(STORAGE_KEYS.QUEUE, JSON.stringify(queue));
  } catch {
    // ignore quota errors
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * @param {(saleData: object) => void} addSale  — from useSales
 */
export function useOfflineQueue(addSale) {
  const [isOnline, setIsOnline]   = useState(() => navigator.onLine);
  const [queue,    setQueue]      = useState(() => loadQueue());
  const addSaleRef                = useRef(addSale);
  addSaleRef.current              = addSale; // stay up to date without re-running effects

  // ─── Track online / offline status ─────────────────────────────────────────
  useEffect(() => {
    const goOnline  = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online',  goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online',  goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  // ─── Drain queue when coming back online ───────────────────────────────────
  useEffect(() => {
    if (!isOnline) return;

    setQueue(prev => {
      if (prev.length === 0) return prev;
      // Process each queued item through the real addSale action
      prev.forEach(item => addSaleRef.current(item));
      persistQueue([]);
      return [];
    });
  }, [isOnline]);

  // ─── Enqueue a sale action ──────────────────────────────────────────────────
  /**
   * If online: call addSale directly.
   * If offline: push onto the queue and persist to localStorage.
   *
   * @param {object} saleData
   */
  const enqueue = useCallback((saleData) => {
    if (navigator.onLine) {
      addSaleRef.current(saleData);
      return;
    }
    setQueue(prev => {
      const next = [...prev, saleData];
      persistQueue(next);
      return next;
    });
  }, []);

  return {
    isOnline,
    queueLength: queue.length,
    enqueue,
  };
}
