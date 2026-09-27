/**
 * useSales — central data hook for the SalesTrack MVP.
 *
 * Responsibilities:
 *  - Seed localStorage from initialSales on first load.
 *  - Expose the full sales array + CRUD actions to any component.
 *  - Handle approveSale / rejectSale (manager workflow).
 *  - Persist every change to localStorage so the tab survives a refresh.
 *
 * Usage:
 *   const { sales, addSale, approveSale, rejectSale, resetToSeed } = useSales();
 */

import { useState, useCallback } from 'react';
import { initialSales, STORAGE_KEYS, SALE_STATUSES } from '../data/mockData.js';

// ─── localStorage helpers ─────────────────────────────────────────────────────

function loadSales() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SALES);
    if (raw) return JSON.parse(raw);
  } catch {
    // corrupted — fall through to seed
  }
  return null;
}

function persistSales(sales) {
  try {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  } catch {
    // Storage quota exceeded — silently skip (MVP behaviour)
  }
}

/** Generate a short unique ID for new sales submitted at runtime. */
function newSaleId() {
  return `sale-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSales() {
  const [sales, setSales] = useState(() => {
    const stored = loadSales();
    if (stored) return stored;
    // First visit — seed from mock data and persist
    persistSales(initialSales);
    return initialSales;
  });

  /** Internal updater — update state and persist atomically. */
  const commit = useCallback((updater) => {
    setSales(prev => {
      const next = updater(prev);
      persistSales(next);
      return next;
    });
  }, []);

  // ─── Actions ───────────────────────────────────────────────────────────────

  /**
   * Submit a new sale as Pending.
   *
   * @param {{
   *   repId:         string,
   *   shopId:        string,
   *   productId:     string,
   *   sku:           string,
   *   productName:   string,
   *   serialNumber:  string | null,
   *   quantity:      number,
   *   unitPrice:     number,
   *   paymentMethod: string,
   *   notes?:        string,
   * }} saleData
   */
  const addSale = useCallback((saleData) => {
    const sale = {
      id:            newSaleId(),
      repId:         saleData.repId,
      shopId:        saleData.shopId,
      productId:     saleData.productId,
      sku:           saleData.sku,
      productName:   saleData.productName,
      serialNumber:  saleData.serialNumber ?? null,
      quantity:      Number(saleData.quantity),
      unitPrice:     Number(saleData.unitPrice),
      totalAmount:   Number(saleData.quantity) * Number(saleData.unitPrice),
      paymentMethod: saleData.paymentMethod,
      status:        SALE_STATUSES.PENDING,
      notes:         saleData.notes ?? '',
      timestamp:     new Date().toISOString(),
      reviewedAt:    null,
      reviewedBy:    null,
    };
    commit(prev => [sale, ...prev]);
    return sale;
  }, [commit]);

  /**
   * Approve a pending sale.
   * @param {string} saleId
   * @param {string} [reviewerName]
   */
  const approveSale = useCallback((saleId, reviewerName = 'Manager') => {
    commit(prev =>
      prev.map(s =>
        s.id === saleId
          ? { ...s, status: SALE_STATUSES.APPROVED, reviewedAt: new Date().toISOString(), reviewedBy: reviewerName }
          : s
      )
    );
  }, [commit]);

  /**
   * Reject a pending sale with an optional reason appended to notes.
   * @param {string} saleId
   * @param {string} [reason]
   * @param {string} [reviewerName]
   */
  const rejectSale = useCallback((saleId, reason = '', reviewerName = 'Manager') => {
    commit(prev =>
      prev.map(s => {
        if (s.id !== saleId) return s;
        const notes = reason
          ? `${s.notes ? s.notes + ' | ' : ''}Rejected: ${reason}`
          : s.notes;
        return { ...s, status: SALE_STATUSES.REJECTED, notes, reviewedAt: new Date().toISOString(), reviewedBy: reviewerName };
      })
    );
  }, [commit]);

  /**
   * Resubmit a rejected sale in-place.
   * Keeps same ID, sets status back to Pending, updates editable fields.
   * The rejection reason/history in notes is preserved.
   *
   * @param {string} saleId
   * @param {{
   *   productId:     string,
   *   sku:           string,
   *   productName:   string,
   *   serialNumber:  string | null,
   *   quantity:      number,
   *   unitPrice:     number,
   *   paymentMethod: string,
   *   notes?:        string,
   * }} updates
   */
  const resubmitSale = useCallback((saleId, updates) => {
    commit(prev =>
      prev.map(s => {
        if (s.id !== saleId) return s;
        return {
          ...s,
          productId:     updates.productId,
          sku:           updates.sku,
          productName:   updates.productName,
          serialNumber:  updates.serialNumber ?? null,
          quantity:      Number(updates.quantity),
          unitPrice:     Number(updates.unitPrice),
          totalAmount:   Number(updates.quantity) * Number(updates.unitPrice),
          paymentMethod: updates.paymentMethod,
          // Preserve rejection history; append resubmit note
          notes:         s.notes
            ? `${s.notes} | Resubmitted`
            : (updates.notes ?? ''),
          status:        SALE_STATUSES.PENDING,
          reviewedAt:    null,
          reviewedBy:    null,
          timestamp:     new Date().toISOString(),
        };
      })
    );
  }, [commit]);

  /**
   * Wipe localStorage and reseed from mock data.
   * Useful during development / demo reset.
   */
  const resetToSeed = useCallback(() => {
    persistSales(initialSales);
    setSales(initialSales);
  }, []);

  return { sales, addSale, approveSale, rejectSale, resubmitSale, resetToSeed };
}
