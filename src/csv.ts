import type { Comic, Item } from './types'

function escapeCsvField(value: string | number): string {
  const str = String(value)
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function triggerDownload(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
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
  const date = new Date().toISOString().slice(0, 10)
  triggerDownload(itemsToCsv(items), `inventory-${date}.csv`)
}

export function comicsToCsv(comics: Comic[]): string {
  const customKeys = Array.from(new Set(comics.flatMap((c) => c.customFields.map((f) => f.key)))).sort()

  const header = [
    'Title',
    'Issue Number',
    'Publisher',
    'Condition',
    'Value',
    'Photo Count',
    'Notes',
    'Last Updated',
    ...customKeys,
  ]

  const rows = comics.map((comic) => {
    const fieldMap = new Map(comic.customFields.map((f) => [f.key, f.value]))
    return [
      comic.title,
      comic.issueNumber,
      comic.publisher,
      comic.condition,
      comic.value.toFixed(2),
      comic.photos.length,
      comic.notes,
      new Date(comic.updatedAt).toISOString(),
      ...customKeys.map((key) => fieldMap.get(key) ?? ''),
    ]
  })

  return [header, ...rows].map((row) => row.map(escapeCsvField).join(',')).join('\r\n')
}

export function downloadComicsCsv(comics: Comic[]): void {
  const date = new Date().toISOString().slice(0, 10)
  triggerDownload(comicsToCsv(comics), `comics-${date}.csv`)
}
