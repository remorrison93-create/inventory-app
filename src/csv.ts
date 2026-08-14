import type { Item } from './types'

function escapeCsvField(value: string | number): string {
  const str = String(value)
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function itemsToCsv(items: Item[]): string {
  const header = ['Name', 'Room', 'Quantity', 'Low Stock Threshold', 'Last Updated']
  const rows = items.map((item) => [
    item.name,
    item.room,
    item.quantity,
    item.lowStockThreshold,
    new Date(item.updatedAt).toISOString(),
  ])
  return [header, ...rows].map((row) => row.map(escapeCsvField).join(',')).join('\r\n')
}

export function downloadItemsCsv(items: Item[]): void {
  const csv = itemsToCsv(items)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const date = new Date().toISOString().slice(0, 10)
  a.href = url
  a.download = `inventory-${date}.csv`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
