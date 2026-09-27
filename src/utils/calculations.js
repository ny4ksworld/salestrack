// Sales calculation utilities — KES (Kenyan Shilling)
// All functions are pure — they accept arrays and return derived values.
// Import sales and salesReps from mockData / useSales as needed.

import { toDateString, lastNDays, isSameDay } from './dateHelpers.js';
import { SALE_STATUSES } from '../data/mockData.js';

// ─── Filtering helpers ────────────────────────────────────────────────────────

/** Only sales with status === 'Approved' count toward revenue/targets. */
export function approvedSales(sales) {
  return sales.filter(s => s.status === SALE_STATUSES.APPROVED);
}

/** Sales submitted today (any status). */
export function todaySales(sales) {
  const today = toDateString();
  return sales.filter(s => isSameDay(s.timestamp, today));
}

/** Sales for a specific rep. */
export function salesByRep(sales, repId) {
  return sales.filter(s => s.repId === repId);
}

/** Sales for a specific shop. */
export function salesByShop(sales, shopId) {
  return sales.filter(s => s.shopId === shopId);
}

/** Sales on a specific "YYYY-MM-DD" date. */
export function salesOnDate(sales, dateStr) {
  return sales.filter(s => isSameDay(s.timestamp, dateStr));
}

/** Sales pending manager review. */
export function pendingSales(sales) {
  return sales.filter(s => s.status === SALE_STATUSES.PENDING);
}

// ─── Aggregation ──────────────────────────────────────────────────────────────

/** Sum totalAmount for a sales array (approved only by default). */
export function totalRevenue(sales, approvedOnly = true) {
  const list = approvedOnly ? approvedSales(sales) : sales;
  return list.reduce((sum, s) => sum + s.totalAmount, 0);
}

/** Count distinct repIds that have at least one sale today. */
export function activeRepsToday(sales, salesReps) {
  const today = toDateString();
  const repIds = new Set(
    sales
      .filter(s => isSameDay(s.timestamp, today))
      .map(s => s.repId)
  );
  // Only count reps who are still marked active
  return salesReps.filter(r => r.active && repIds.has(r.id)).length;
}

/**
 * Build daily revenue totals for the last N days.
 * Returns [{ date: 'YYYY-MM-DD', revenue: number }] newest-last.
 */
export function revenueByDay(sales, days = 7) {
  const dates = lastNDays(days).reverse(); // oldest → newest
  return dates.map(date => ({
    date,
    revenue: totalRevenue(salesOnDate(approvedSales(sales), date), false),
  }));
}

/**
 * Build per-rep revenue totals (approved sales only).
 * Returns [{ repId, name, revenue }] sorted descending.
 */
export function revenueByRep(sales, salesReps) {
  const map = {};
  for (const s of approvedSales(sales)) {
    map[s.repId] = (map[s.repId] || 0) + s.totalAmount;
  }
  return salesReps
    .map(r => ({ repId: r.id, name: r.name, revenue: map[r.id] || 0 }))
    .sort((a, b) => b.revenue - a.revenue);
}

/**
 * Build per-shop revenue totals (approved sales only).
 * Returns [{ shopId, name, revenue }] sorted descending.
 */
export function revenueByShop(sales, shops) {
  const map = {};
  for (const s of approvedSales(sales)) {
    map[s.shopId] = (map[s.shopId] || 0) + s.totalAmount;
  }
  return shops
    .map(sh => ({ shopId: sh.id, name: sh.name, revenue: map[sh.id] || 0 }))
    .sort((a, b) => b.revenue - a.revenue);
}

/**
 * Break down revenue by payment method (approved sales only).
 * Returns [{ method, revenue, count }].
 */
export function revenueByPaymentMethod(sales) {
  const map = {};
  for (const s of approvedSales(sales)) {
    if (!map[s.paymentMethod]) map[s.paymentMethod] = { revenue: 0, count: 0 };
    map[s.paymentMethod].revenue += s.totalAmount;
    map[s.paymentMethod].count  += 1;
  }
  return Object.entries(map).map(([method, val]) => ({ method, ...val }));
}

// ─── Target progress ──────────────────────────────────────────────────────────

/**
 * Calculate a rep's approved revenue vs their monthly target.
 * Returns { revenue, target, percent } where percent is 0–100.
 */
export function repTargetProgress(sales, rep) {
  const revenue = totalRevenue(salesByRep(approvedSales(sales), rep.id), false);
  const percent = rep.target > 0
    ? Math.min(100, Math.round((revenue / rep.target) * 100))
    : 0;
  return { revenue, target: rep.target, percent };
}

// ─── WhatsApp summary ─────────────────────────────────────────────────────────

/**
 * Build a plain-text WhatsApp-style daily summary for a given date.
 * Pass in all sales, salesReps, and shops arrays.
 *
 * @param {object[]} sales
 * @param {object[]} salesReps
 * @param {object[]} shops
 * @param {string}   [dateStr]  "YYYY-MM-DD" — defaults to today
 * @returns {string}
 */
export function buildWhatsAppSummary(sales, salesReps, shops, dateStr = toDateString()) {
  const daySales = salesOnDate(approvedSales(sales), dateStr);

  const repMap  = Object.fromEntries(salesReps.map(r  => [r.id,  r.name]));
  const shopMap = Object.fromEntries(shops.map(sh => [sh.id, sh.name]));

  const totalAmt = daySales.reduce((s, x) => s + x.totalAmount, 0);

  const lines = [
    `📊 *SalesTrack Daily Summary — ${dateStr}*`,
    `Total Sales: KSh ${totalAmt.toLocaleString('en-KE')}`,
    `Transactions: ${daySales.length}`,
    ``,
  ];

  if (daySales.length === 0) {
    lines.push('No approved sales recorded today.');
  } else {
    daySales.forEach((s, i) => {
      lines.push(
        `${i + 1}. *${s.productName}* (${s.sku})` +
        `\n   Rep: ${repMap[s.repId] ?? s.repId}` +
        `\n   Shop: ${shopMap[s.shopId] ?? s.shopId}` +
        `\n   Qty: ${s.quantity}  |  KSh ${s.totalAmount.toLocaleString('en-KE')}  |  ${s.paymentMethod}` +
        (s.serialNumber ? `\n   S/N: ${s.serialNumber}` : '')
      );
    });
  }

  lines.push(`\n_Generated by SalesTrack_`);
  return lines.join('\n');
}
