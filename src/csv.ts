import type { Comic, Item, MunitionsItem } from './types'

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
    'Location',
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
      comic.location,
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

export function munitionsToCsv(items: MunitionsItem[]): string {
  const customKeys = Array.from(new Set(items.flatMap((i) => i.customFields.map((f) => f.key)))).sort()

  const header = [
    'Type',
    'Name',
    'Manufacturer',
    'Caliber',
    'Category',
    'Bullet Weight (gr)',
    'Bullet Type',
    'Rounds per Box',
    'Quantity',
    'Total Rounds',
    'Low Stock Threshold',
    'Location',
    'Condition',
    'Photo Count',
    'Notes',
    'Last Updated',
    ...customKeys,
  ]

  const rows = items.map((item) => {
    const fieldMap = new Map(item.customFields.map((f) => [f.key, f.value]))
    const totalRounds =
      item.itemType === 'Ammunition' && item.roundsPerBox ? item.quantity * item.roundsPerBox : ''
    return [
      item.itemType,
      item.name,
      item.manufacturer,
      item.caliber,
      item.category,
      item.bulletWeightGr ?? '',
      item.bulletType,
      item.roundsPerBox ?? '',
      item.quantity,
      totalRounds,
      item.lowStockThreshold,
      item.location,
      item.condition,
      item.photos.length,
      item.notes,
      new Date(item.updatedAt).toISOString(),
      ...customKeys.map((key) => fieldMap.get(key) ?? ''),
    ]
  })

  return [header, ...rows].map((row) => row.map(escapeCsvField).join(',')).join('\r\n')
}

export function downloadMunitionsCsv(items: MunitionsItem[]): void {
  const date = new Date().toISOString().slice(0, 10)
  triggerDownload(munitionsToCsv(items), `munitions-${date}.csv`)
}
