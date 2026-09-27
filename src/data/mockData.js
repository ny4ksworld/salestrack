// ─── SalesTrack Mock Data ────────────────────────────────────────────────────
// All monetary values are in KES (Kenyan Shilling).

// ─── Shops / Stations ────────────────────────────────────────────────────────
export const shops = [
  { id: 'shop-1', name: 'Nairobi CBD Branch',  location: 'Nairobi CBD',        active: true  },
  { id: 'shop-2', name: 'Mombasa Station',      location: 'Mombasa Old Town',   active: true  },
  { id: 'shop-3', name: 'Kisumu Outlet',         location: 'Kisumu Market',      active: true  },
];

// ─── Sales Representatives ────────────────────────────────────────────────────
export const salesReps = [
  { id: 'rep-1', name: 'Brian Otieno',    shopId: 'shop-1', phone: '0712-001-001', active: true,  target: 12000 },
  { id: 'rep-2', name: 'Grace Wanjiku',   shopId: 'shop-1', phone: '0722-001-002', active: true,  target: 10000 },
  { id: 'rep-3', name: 'Kevin Kamau',     shopId: 'shop-2', phone: '0733-001-003', active: true,  target: 11000 },
  { id: 'rep-4', name: 'Faith Achieng',   shopId: 'shop-2', phone: '0700-001-004', active: true,  target: 9500  },
  { id: 'rep-5', name: 'Dennis Mwangi',   shopId: 'shop-3', phone: '0711-001-005', active: true,  target: 10500 },
  { id: 'rep-6', name: 'Mercy Njeri',     shopId: 'shop-3', phone: '0721-001-006', active: true,  target: 8000  },
  { id: 'rep-7', name: 'Samuel Kipchoge', shopId: 'shop-1', phone: '0731-001-007', active: false, target: 9000  },
  { id: 'rep-8', name: 'Vivian Adhiambo', shopId: 'shop-2', phone: '0701-001-008', active: true,  target: 11500 },
];

// ─── Product Catalogue ────────────────────────────────────────────────────────
// Lightweight product list; serial numbers are generated per-sale where applicable.
export const products = [
  { id: 'prod-1',  sku: 'SAM-S24-BLK',  name: 'Samsung Galaxy S24',        category: 'Smartphone',  price: 7200,  hasSerial: true  },
  { id: 'prod-2',  sku: 'SAM-A55-BLU',  name: 'Samsung Galaxy A55',        category: 'Smartphone',  price: 4500,  hasSerial: true  },
  { id: 'prod-3',  sku: 'TCL-43S5-SLV', name: 'TCL 43" Smart TV',          category: 'Television',  price: 3800,  hasSerial: true  },
  { id: 'prod-4',  sku: 'HAI-WM7KG-WH', name: 'Haier Washing Machine 7kg', category: 'Appliance',   price: 2900,  hasSerial: true  },
  { id: 'prod-5',  sku: 'BRK-HDPH-BLK', name: 'Brookstone Headphones',     category: 'Accessory',   price:  320,  hasSerial: false },
  { id: 'prod-6',  sku: 'GEN-CBLE-USB',  name: 'USB-C Charging Cable',      category: 'Accessory',   price:   45,  hasSerial: false },
  { id: 'prod-7',  sku: 'INF-HOT50-GLD', name: 'Infinix Hot 50',            category: 'Smartphone',  price: 2100,  hasSerial: true  },
  { id: 'prod-8',  sku: 'TEC-SPK-RED',   name: 'Tecno Bluetooth Speaker',   category: 'Accessory',   price:  280,  hasSerial: false },
  { id: 'prod-9',  sku: 'LG-REF-350-SV', name: 'LG Refrigerator 350L',      category: 'Appliance',   price: 5600,  hasSerial: true  },
  { id: 'prod-10', sku: 'SAM-TAB-A9-GR', name: 'Samsung Tab A9',            category: 'Tablet',      price: 3200,  hasSerial: true  },
];

// ─── Payment Methods ──────────────────────────────────────────────────────────
export const PAYMENT_METHODS = ['Cash', 'M-Pesa', 'Card'];

// ─── Sale Statuses ────────────────────────────────────────────────────────────
export const SALE_STATUSES = {
  PENDING:  'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

// ─── Helper — build a realistic ISO timestamp within the last N days ──────────
function daysAgo(n, hour = 10, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

// ─── Helper — random serial (10 hex chars) ────────────────────────────────────
function serial(prefix = 'SN') {
  return `${prefix}${Math.random().toString(16).slice(2, 10).toUpperCase()}`;
}

// ─── Sales Records ────────────────────────────────────────────────────────────
// Each sale record shape:
// {
//   id           : string   — unique sale ID
//   repId        : string   — references salesReps[].id
//   shopId       : string   — references shops[].id
//   productId    : string   — references products[].id
//   sku          : string   — denormalised for quick display
//   productName  : string   — denormalised for quick display
//   serialNumber : string | null
//   quantity     : number
//   unitPrice    : number   — price at time of sale (may differ from catalogue)
//   totalAmount  : number   — quantity × unitPrice
//   paymentMethod: 'Cash' | 'M-Pesa' | 'Card'
//   status       : 'Pending' | 'Approved' | 'Rejected'
//   notes        : string
//   timestamp    : ISO string
//   reviewedAt   : ISO string | null
//   reviewedBy   : string | null  — manager name or ID
// }

export const initialSales = [
  // ── Day 0 (today) ────────────────────────────────────────────────────────────
  {
    id: 'sale-001',
    repId: 'rep-1', shopId: 'shop-1',
    productId: 'prod-1', sku: 'SAM-S24-BLK', productName: 'Samsung Galaxy S24',
    serialNumber: serial('SN'), quantity: 1, unitPrice: 7200, totalAmount: 7200,
    paymentMethod: 'M-Pesa', status: 'Pending',
    notes: '', timestamp: daysAgo(0, 9, 15), reviewedAt: null, reviewedBy: null,
  },
  {
    id: 'sale-002',
    repId: 'rep-2', shopId: 'shop-1',
    productId: 'prod-5', sku: 'BRK-HDPH-BLK', productName: 'Brookstone Headphones',
    serialNumber: null, quantity: 2, unitPrice: 320, totalAmount: 640,
    paymentMethod: 'Cash', status: 'Approved',
    notes: 'Customer paid exact amount.', timestamp: daysAgo(0, 10, 5),
    reviewedAt: daysAgo(0, 10, 30), reviewedBy: 'Manager',
  },
  {
    id: 'sale-003',
    repId: 'rep-3', shopId: 'shop-2',
    productId: 'prod-7', sku: 'INF-HOT50-GLD', productName: 'Infinix Hot 50',
    serialNumber: serial('SN'), quantity: 1, unitPrice: 2100, totalAmount: 2100,
    paymentMethod: 'Card', status: 'Pending',
    notes: '', timestamp: daysAgo(0, 11, 0), reviewedAt: null, reviewedBy: null,
  },
  {
    id: 'sale-004',
    repId: 'rep-8', shopId: 'shop-2',
    productId: 'prod-10', sku: 'SAM-TAB-A9-GR', productName: 'Samsung Tab A9',
    serialNumber: serial('SN'), quantity: 1, unitPrice: 3200, totalAmount: 3200,
    paymentMethod: 'M-Pesa', status: 'Pending',
    notes: '', timestamp: daysAgo(0, 11, 45), reviewedAt: null, reviewedBy: null,
  },
  {
    id: 'sale-005',
    repId: 'rep-5', shopId: 'shop-3',
    productId: 'prod-3', sku: 'TCL-43S5-SLV', productName: 'TCL 43" Smart TV',
    serialNumber: serial('SN'), quantity: 1, unitPrice: 3800, totalAmount: 3800,
    paymentMethod: 'Cash', status: 'Approved',
    notes: '', timestamp: daysAgo(0, 12, 30),
    reviewedAt: daysAgo(0, 13, 0), reviewedBy: 'Manager',
  },

  // ── Day 1 (yesterday) ────────────────────────────────────────────────────────
  {
    id: 'sale-006',
    repId: 'rep-1', shopId: 'shop-1',
    productId: 'prod-2', sku: 'SAM-A55-BLU', productName: 'Samsung Galaxy A55',
    serialNumber: serial('SN'), quantity: 1, unitPrice: 4500, totalAmount: 4500,
    paymentMethod: 'Card', status: 'Approved',
    notes: '', timestamp: daysAgo(1, 9, 0),
    reviewedAt: daysAgo(1, 9, 45), reviewedBy: 'Manager',
  },
  {
    id: 'sale-007',
    repId: 'rep-6', shopId: 'shop-3',
    productId: 'prod-6', sku: 'GEN-CBLE-USB', productName: 'USB-C Charging Cable',
    serialNumber: null, quantity: 5, unitPrice: 45, totalAmount: 225,
    paymentMethod: 'Cash', status: 'Approved',
    notes: 'Bulk purchase.', timestamp: daysAgo(1, 10, 20),
    reviewedAt: daysAgo(1, 11, 0), reviewedBy: 'Manager',
  },
  {
    id: 'sale-008',
    repId: 'rep-4', shopId: 'shop-2',
    productId: 'prod-4', sku: 'HAI-WM7KG-WH', productName: 'Haier Washing Machine 7kg',
    serialNumber: serial('SN'), quantity: 1, unitPrice: 2900, totalAmount: 2900,
    paymentMethod: 'M-Pesa', status: 'Rejected',
    notes: 'Serial number mismatch — does not match warehouse record.',
    timestamp: daysAgo(1, 13, 15),
    reviewedAt: daysAgo(1, 14, 0), reviewedBy: 'Manager',
  },
  {
    id: 'sale-009',
    repId: 'rep-3', shopId: 'shop-2',
    productId: 'prod-8', sku: 'TEC-SPK-RED', productName: 'Tecno Bluetooth Speaker',
    serialNumber: null, quantity: 3, unitPrice: 280, totalAmount: 840,
    paymentMethod: 'Cash', status: 'Approved',
    notes: '', timestamp: daysAgo(1, 15, 0),
    reviewedAt: daysAgo(1, 15, 30), reviewedBy: 'Manager',
  },
  {
    id: 'sale-010',
    repId: 'rep-2', shopId: 'shop-1',
    productId: 'prod-9', sku: 'LG-REF-350-SV', productName: 'LG Refrigerator 350L',
    serialNumber: serial('SN'), quantity: 1, unitPrice: 5600, totalAmount: 5600,
    paymentMethod: 'Card', status: 'Approved',
    notes: '', timestamp: daysAgo(1, 16, 10),
    reviewedAt: daysAgo(1, 16, 45), reviewedBy: 'Manager',
  },

  // ── Day 2 ────────────────────────────────────────────────────────────────────
  {
    id: 'sale-011',
    repId: 'rep-5', shopId: 'shop-3',
    productId: 'prod-1', sku: 'SAM-S24-BLK', productName: 'Samsung Galaxy S24',
    serialNumber: serial('SN'), quantity: 1, unitPrice: 7200, totalAmount: 7200,
    paymentMethod: 'M-Pesa', status: 'Approved',
    notes: '', timestamp: daysAgo(2, 10, 0),
    reviewedAt: daysAgo(2, 10, 40), reviewedBy: 'Manager',
  },
  {
    id: 'sale-012',
    repId: 'rep-1', shopId: 'shop-1',
    productId: 'prod-3', sku: 'TCL-43S5-SLV', productName: 'TCL 43" Smart TV',
    serialNumber: serial('SN'), quantity: 1, unitPrice: 3800, totalAmount: 3800,
    paymentMethod: 'Cash', status: 'Approved',
    notes: '', timestamp: daysAgo(2, 11, 30),
    reviewedAt: daysAgo(2, 12, 0), reviewedBy: 'Manager',
  },
  {
    id: 'sale-013',
    repId: 'rep-8', shopId: 'shop-2',
    productId: 'prod-2', sku: 'SAM-A55-BLU', productName: 'Samsung Galaxy A55',
    serialNumber: serial('SN'), quantity: 2, unitPrice: 4500, totalAmount: 9000,
    paymentMethod: 'Card', status: 'Approved',
    notes: '', timestamp: daysAgo(2, 14, 0),
    reviewedAt: daysAgo(2, 14, 30), reviewedBy: 'Manager',
  },

  // ── Day 3 ────────────────────────────────────────────────────────────────────
  {
    id: 'sale-014',
    repId: 'rep-6', shopId: 'shop-3',
    productId: 'prod-7', sku: 'INF-HOT50-GLD', productName: 'Infinix Hot 50',
    serialNumber: serial('SN'), quantity: 1, unitPrice: 2100, totalAmount: 2100,
    paymentMethod: 'M-Pesa', status: 'Approved',
    notes: '', timestamp: daysAgo(3, 9, 30),
    reviewedAt: daysAgo(3, 10, 0), reviewedBy: 'Manager',
  },
  {
    id: 'sale-015',
    repId: 'rep-4', shopId: 'shop-2',
    productId: 'prod-5', sku: 'BRK-HDPH-BLK', productName: 'Brookstone Headphones',
    serialNumber: null, quantity: 1, unitPrice: 320, totalAmount: 320,
    paymentMethod: 'Cash', status: 'Approved',
    notes: '', timestamp: daysAgo(3, 11, 0),
    reviewedAt: daysAgo(3, 11, 30), reviewedBy: 'Manager',
  },
  {
    id: 'sale-016',
    repId: 'rep-3', shopId: 'shop-2',
    productId: 'prod-10', sku: 'SAM-TAB-A9-GR', productName: 'Samsung Tab A9',
    serialNumber: serial('SN'), quantity: 1, unitPrice: 3200, totalAmount: 3200,
    paymentMethod: 'Card', status: 'Rejected',
    notes: 'Price entered does not match agreed price. Flagged for review.',
    timestamp: daysAgo(3, 13, 45),
    reviewedAt: daysAgo(3, 14, 15), reviewedBy: 'Manager',
  },
  {
    id: 'sale-017',
    repId: 'rep-2', shopId: 'shop-1',
    productId: 'prod-4', sku: 'HAI-WM7KG-WH', productName: 'Haier Washing Machine 7kg',
    serialNumber: serial('SN'), quantity: 1, unitPrice: 2900, totalAmount: 2900,
    paymentMethod: 'M-Pesa', status: 'Approved',
    notes: '', timestamp: daysAgo(3, 15, 0),
    reviewedAt: daysAgo(3, 15, 45), reviewedBy: 'Manager',
  },

  // ── Day 4 ────────────────────────────────────────────────────────────────────
  {
    id: 'sale-018',
    repId: 'rep-1', shopId: 'shop-1',
    productId: 'prod-9', sku: 'LG-REF-350-SV', productName: 'LG Refrigerator 350L',
    serialNumber: serial('SN'), quantity: 1, unitPrice: 5600, totalAmount: 5600,
    paymentMethod: 'Card', status: 'Approved',
    notes: '', timestamp: daysAgo(4, 10, 0),
    reviewedAt: daysAgo(4, 10, 30), reviewedBy: 'Manager',
  },
  {
    id: 'sale-019',
    repId: 'rep-5', shopId: 'shop-3',
    productId: 'prod-8', sku: 'TEC-SPK-RED', productName: 'Tecno Bluetooth Speaker',
    serialNumber: null, quantity: 4, unitPrice: 280, totalAmount: 1120,
    paymentMethod: 'Cash', status: 'Approved',
    notes: '', timestamp: daysAgo(4, 12, 15),
    reviewedAt: daysAgo(4, 13, 0), reviewedBy: 'Manager',
  },
  {
    id: 'sale-020',
    repId: 'rep-8', shopId: 'shop-2',
    productId: 'prod-1', sku: 'SAM-S24-BLK', productName: 'Samsung Galaxy S24',
    serialNumber: serial('SN'), quantity: 1, unitPrice: 7200, totalAmount: 7200,
    paymentMethod: 'M-Pesa', status: 'Approved',
    notes: '', timestamp: daysAgo(4, 14, 0),
    reviewedAt: daysAgo(4, 14, 40), reviewedBy: 'Manager',
  },

  // ── Day 5 ────────────────────────────────────────────────────────────────────
  {
    id: 'sale-021',
    repId: 'rep-6', shopId: 'shop-3',
    productId: 'prod-2', sku: 'SAM-A55-BLU', productName: 'Samsung Galaxy A55',
    serialNumber: serial('SN'), quantity: 1, unitPrice: 4500, totalAmount: 4500,
    paymentMethod: 'Card', status: 'Approved',
    notes: '', timestamp: daysAgo(5, 9, 0),
    reviewedAt: daysAgo(5, 9, 45), reviewedBy: 'Manager',
  },
  {
    id: 'sale-022',
    repId: 'rep-1', shopId: 'shop-1',
    productId: 'prod-6', sku: 'GEN-CBLE-USB', productName: 'USB-C Charging Cable',
    serialNumber: null, quantity: 10, unitPrice: 45, totalAmount: 450,
    paymentMethod: 'Cash', status: 'Approved',
    notes: '', timestamp: daysAgo(5, 11, 0),
    reviewedAt: daysAgo(5, 11, 30), reviewedBy: 'Manager',
  },
  {
    id: 'sale-023',
    repId: 'rep-4', shopId: 'shop-2',
    productId: 'prod-3', sku: 'TCL-43S5-SLV', productName: 'TCL 43" Smart TV',
    serialNumber: serial('SN'), quantity: 2, unitPrice: 3800, totalAmount: 7600,
    paymentMethod: 'M-Pesa', status: 'Approved',
    notes: '', timestamp: daysAgo(5, 13, 0),
    reviewedAt: daysAgo(5, 13, 45), reviewedBy: 'Manager',
  },

  // ── Day 6 ────────────────────────────────────────────────────────────────────
  {
    id: 'sale-024',
    repId: 'rep-3', shopId: 'shop-2',
    productId: 'prod-9', sku: 'LG-REF-350-SV', productName: 'LG Refrigerator 350L',
    serialNumber: serial('SN'), quantity: 1, unitPrice: 5600, totalAmount: 5600,
    paymentMethod: 'Card', status: 'Approved',
    notes: '', timestamp: daysAgo(6, 10, 0),
    reviewedAt: daysAgo(6, 10, 30), reviewedBy: 'Manager',
  },
  {
    id: 'sale-025',
    repId: 'rep-2', shopId: 'shop-1',
    productId: 'prod-7', sku: 'INF-HOT50-GLD', productName: 'Infinix Hot 50',
    serialNumber: serial('SN'), quantity: 2, unitPrice: 2100, totalAmount: 4200,
    paymentMethod: 'Cash', status: 'Approved',
    notes: '', timestamp: daysAgo(6, 12, 30),
    reviewedAt: daysAgo(6, 13, 0), reviewedBy: 'Manager',
  },
  {
    id: 'sale-026',
    repId: 'rep-5', shopId: 'shop-3',
    productId: 'prod-10', sku: 'SAM-TAB-A9-GR', productName: 'Samsung Tab A9',
    serialNumber: serial('SN'), quantity: 1, unitPrice: 3200, totalAmount: 3200,
    paymentMethod: 'M-Pesa', status: 'Approved',
    notes: '', timestamp: daysAgo(6, 14, 0),
    reviewedAt: daysAgo(6, 14, 30), reviewedBy: 'Manager',
  },
  {
    id: 'sale-027',
    repId: 'rep-8', shopId: 'shop-2',
    productId: 'prod-5', sku: 'BRK-HDPH-BLK', productName: 'Brookstone Headphones',
    serialNumber: null, quantity: 2, unitPrice: 320, totalAmount: 640,
    paymentMethod: 'Cash', status: 'Rejected',
    notes: 'Quantity on receipt does not match inventory deduction.',
    timestamp: daysAgo(6, 15, 30),
    reviewedAt: daysAgo(6, 16, 0), reviewedBy: 'Manager',
  },
];

// ─── Manager (single account for MVP) ────────────────────────────────────────
export const manager = {
  id: 'mgr-1',
  name: 'Manager',
  role: 'manager',
};

// ─── localStorage keys ────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  SALES:       'salestrack_sales',
  QUEUE:       'salestrack_offline_queue',
  CURRENT_REP: 'salestrack_current_rep',
  ROLE:        'salestrack_role',
};
