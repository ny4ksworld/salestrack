/**
 * RecordSaleForm — fast, linear sale entry form.
 * Flow: Shop → Product → Quantity → Price → Payment → Serial (if needed) → Notes (optional) → Submit
 *
 * Props:
 *   salesReps     — from context
 *   shops         — from context
 *   products      — from context
 *   currentRep    — pre-selected rep or null
 *   onSubmit(saleData) — called with validated sale data (new sale)
 *   initialSale   — rejected sale to pre-fill for resubmit; if set, resubmit mode is active
 *   onResubmit(saleId, updates) — called when resubmitting a rejected sale
 */
import { useState, useEffect } from 'react'
import { PAYMENT_METHODS } from '../../data/mockData.js'

const EMPTY = {
  repId:         '',
  shopId:        '',
  productId:     '',
  quantity:      1,
  unitPrice:     '',
  paymentMethod: PAYMENT_METHODS[0],
  serialNumber:  '',
  notes:         '',
}

function buildInitial(currentRep, salesReps, initialSale) {
  if (initialSale) {
    return {
      repId:         initialSale.repId,
      shopId:        initialSale.shopId,
      productId:     initialSale.productId,
      quantity:      initialSale.quantity,
      unitPrice:     initialSale.unitPrice,
      paymentMethod: initialSale.paymentMethod,
      serialNumber:  initialSale.serialNumber || '',
      notes:         '', // notes will show history; don't pre-fill for editing
    }
  }
  return {
    ...EMPTY,
    repId:  currentRep?.id  || '',
    shopId: currentRep ? salesReps.find(r => r.id === currentRep.id)?.shopId || '' : '',
  }
}

export default function RecordSaleForm({
  salesReps,
  shops,
  products,
  currentRep,
  onSubmit,
  initialSale = null,
  onResubmit = null,
}) {
  const isResubmit = !!initialSale

  const [form, setForm]     = useState(() => buildInitial(currentRep, salesReps, initialSale))
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  // Reset form if initialSale changes (e.g. switching between rejections)
  useEffect(() => {
    setForm(buildInitial(currentRep, salesReps, initialSale))
    setErrors({})
    setSubmitted(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSale?.id])

  // When rep changes, auto-set their shop
  useEffect(() => {
    if (form.repId && !isResubmit) {
      const rep = salesReps.find(r => r.id === form.repId)
      if (rep) setForm(f => ({ ...f, shopId: rep.shopId }))
    }
  }, [form.repId, salesReps, isResubmit])

  // When product changes, auto-fill unit price (only if price wasn't already customised by user)
  useEffect(() => {
    if (form.productId && !isResubmit) {
      const prod = products.find(p => p.id === form.productId)
      if (prod) setForm(f => ({ ...f, unitPrice: prod.price, serialNumber: '' }))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.productId, products])

  const selectedProduct = products.find(p => p.id === form.productId) || null
  const needsSerial = selectedProduct?.hasSerial || false
  const totalAmount = (Number(form.quantity) || 0) * (Number(form.unitPrice) || 0)

  function set(key, value) {
    setForm(f => ({ ...f, [key]: value }))
    setErrors(e => ({ ...e, [key]: null }))
  }

  function validate() {
    const e = {}
    if (!form.repId)         e.repId         = 'Select a sales rep'
    if (!form.shopId)        e.shopId        = 'Select a shop'
    if (!form.productId)     e.productId     = 'Select a product'
    if (!form.quantity || Number(form.quantity) < 1) e.quantity = 'Quantity must be at least 1'
    if (!form.unitPrice || Number(form.unitPrice) <= 0) e.unitPrice = 'Enter a valid price'
    if (needsSerial && !form.serialNumber.trim()) e.serialNumber = 'Serial number required for this product'
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }

    const rep  = salesReps.find(r => r.id === form.repId)
    const prod = products.find(p => p.id === form.productId)

    if (isResubmit && onResubmit) {
      onResubmit(initialSale.id, {
        productId:     form.productId,
        sku:           prod.sku,
        productName:   prod.name,
        serialNumber:  needsSerial ? form.serialNumber.trim() : null,
        quantity:      Number(form.quantity),
        unitPrice:     Number(form.unitPrice),
        paymentMethod: form.paymentMethod,
      })
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
      return
    }

    onSubmit({
      repId:         form.repId,
      shopId:        form.shopId,
      productId:     form.productId,
      sku:           prod.sku,
      productName:   prod.name,
      serialNumber:  needsSerial ? form.serialNumber.trim() : null,
      quantity:      Number(form.quantity),
      unitPrice:     Number(form.unitPrice),
      paymentMethod: form.paymentMethod,
      notes:         form.notes.trim(),
    })

    setSubmitted(true)
    setForm({ ...EMPTY, repId: form.repId, shopId: rep?.shopId || '' })
    setTimeout(() => setSubmitted(false), 3000)
  }

  const fieldCls = (key) =>
    `w-full border rounded-md px-3 py-2 text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 ${
      errors[key]
        ? 'border-red-400 focus:ring-red-200'
        : 'border-gray-300 focus:ring-blue-200 focus:border-blue-400'
    }`

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-5 max-w-lg w-full">
      <h2 className="text-base font-semibold text-gray-900">
        {isResubmit ? 'Edit & Resubmit Sale' : 'Record a Sale'}
      </h2>

      {/* Rejection history banner */}
      {isResubmit && initialSale.notes && (
        <div className="bg-red-50 border border-red-200 text-red-800 text-sm rounded-md px-4 py-3">
          <p className="font-semibold text-xs uppercase tracking-wide text-red-600 mb-0.5">Rejection reason</p>
          <p className="text-sm">{initialSale.notes}</p>
        </div>
      )}

      {submitted && (
        <div className="bg-green-50 border border-green-200 text-green-800 text-sm rounded-md px-4 py-3 font-medium">
          {isResubmit
            ? '✓ Sale resubmitted and is pending manager review.'
            : '✓ Sale submitted successfully and is pending review.'
          }
        </div>
      )}

      {/* Rep */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Sales Rep</label>
        <select
          value={form.repId}
          onChange={e => set('repId', e.target.value)}
          disabled={isResubmit}
          className={`${fieldCls('repId')} ${isResubmit ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          <option value="">— Select rep —</option>
          {salesReps.filter(r => r.active).map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
        {errors.repId && <p className="text-xs text-red-500 mt-0.5">{errors.repId}</p>}
      </div>

      {/* Shop (auto-filled, but editable) */}
      {!isResubmit && (
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Shop</label>
          <select value={form.shopId} onChange={e => set('shopId', e.target.value)} className={fieldCls('shopId')}>
            <option value="">— Select shop —</option>
            {shops.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          {errors.shopId && <p className="text-xs text-red-500 mt-0.5">{errors.shopId}</p>}
        </div>
      )}

      {/* Product */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Product</label>
        <select value={form.productId} onChange={e => set('productId', e.target.value)} className={fieldCls('productId')}>
          <option value="">— Select product —</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name} — KSh {p.price.toLocaleString('en-KE')}</option>
          ))}
        </select>
        {errors.productId && <p className="text-xs text-red-500 mt-0.5">{errors.productId}</p>}
      </div>

      {/* Quantity + Price row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Quantity</label>
          <input
            type="number"
            min={1}
            value={form.quantity}
            onChange={e => set('quantity', e.target.value)}
            className={fieldCls('quantity')}
          />
          {errors.quantity && <p className="text-xs text-red-500 mt-0.5">{errors.quantity}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Unit Price (KSh)</label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={form.unitPrice}
            onChange={e => set('unitPrice', e.target.value)}
            className={fieldCls('unitPrice')}
          />
          {errors.unitPrice && <p className="text-xs text-red-500 mt-0.5">{errors.unitPrice}</p>}
        </div>
      </div>

      {/* Total preview */}
      {totalAmount > 0 && (
        <div className="bg-blue-50 border border-blue-100 rounded-md px-4 py-2 text-sm text-blue-800 font-semibold">
          Total: KSh {totalAmount.toLocaleString('en-KE')}
        </div>
      )}

      {/* Payment method */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Payment Method</label>
        <div className="flex gap-3 flex-wrap">
          {PAYMENT_METHODS.map(m => (
            <label key={m} className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value={m}
                checked={form.paymentMethod === m}
                onChange={() => set('paymentMethod', m)}
                className="accent-blue-600"
              />
              <span className="text-sm text-gray-700">{m}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Serial number (conditional) */}
      {needsSerial && (
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
            Serial Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.serialNumber}
            onChange={e => set('serialNumber', e.target.value)}
            placeholder="e.g. SN1A2B3C4D"
            className={fieldCls('serialNumber')}
          />
          {errors.serialNumber && <p className="text-xs text-red-500 mt-0.5">{errors.serialNumber}</p>}
        </div>
      )}

      {/* Notes (optional, only for new sales) */}
      {!isResubmit && (
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
            Notes <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
            rows={2}
            placeholder="Any additional notes…"
            className={`${fieldCls('notes')} resize-none`}
          />
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2.5 rounded-md transition-colors text-sm"
      >
        {isResubmit ? 'Resubmit for Approval' : 'Submit Sale'}
      </button>
    </form>
  )
}
