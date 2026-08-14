import { guessColumnMapping as guessMapping } from './csvParse'

export { parseCsv, rowsToRecords } from './csvParse'

export type CoreField =
  | 'name'
  | 'manufacturer'
  | 'caliber'
  | 'category'
  | 'bulletWeightGr'
  | 'bulletType'
  | 'roundsPerBox'
  | 'quantity'
  | 'lowStockThreshold'
  | 'location'
  | 'condition'
  | 'notes'

export const CORE_FIELDS: { key: CoreField; label: string; required?: boolean }[] = [
  { key: 'name', label: 'Name', required: true },
  { key: 'manufacturer', label: 'Manufacturer' },
  { key: 'caliber', label: 'Caliber' },
  { key: 'category', label: 'Category (accessories)' },
  { key: 'bulletWeightGr', label: 'Bullet Weight (gr)' },
  { key: 'bulletType', label: 'Bullet Type' },
  { key: 'roundsPerBox', label: 'Rounds per Box' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'lowStockThreshold', label: 'Low Stock Threshold' },
  { key: 'location', label: 'Location' },
  { key: 'condition', label: 'Condition' },
  { key: 'notes', label: 'Notes' },
]

const ALIASES: Record<CoreField, string[]> = {
  name: ['name', 'title', 'item', 'description'],
  manufacturer: ['manufacturer', 'brand', 'maker'],
  caliber: ['caliber', 'cal'],
  category: ['category', 'parttype', 'accessorytype'],
  bulletWeightGr: ['bulletweight', 'weightgr', 'weight', 'grains', 'gr'],
  bulletType: ['bullettype', 'bullet', 'projectile'],
  roundsPerBox: ['roundsperbox', 'roundsbox', 'perbox', 'roundcount'],
  quantity: ['quantity', 'qty', 'boxes', 'count'],
  lowStockThreshold: ['lowstockthreshold', 'threshold', 'minqty', 'reorderpoint'],
  location: ['location', 'box', 'bin', 'storage', 'safe'],
  condition: ['condition', 'grade'],
  notes: ['notes', 'note', 'comments'],
}

export function guessColumnMapping(headers: string[]): Record<CoreField, string> {
  return guessMapping(
    headers,
    CORE_FIELDS.map((f) => f.key),
    ALIASES,
  )
}
