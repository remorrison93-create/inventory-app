import { guessColumnMapping as guessMapping } from './csvParse'

export { parseCsv, rowsToRecords } from './csvParse'

export type CoreField = 'title' | 'issueNumber' | 'publisher' | 'condition' | 'location' | 'value' | 'notes'

export const CORE_FIELDS: { key: CoreField; label: string; required?: boolean }[] = [
  { key: 'title', label: 'Title', required: true },
  { key: 'issueNumber', label: 'Issue Number' },
  { key: 'publisher', label: 'Publisher' },
  { key: 'condition', label: 'Condition' },
  { key: 'location', label: 'Location' },
  { key: 'value', label: 'Value' },
  { key: 'notes', label: 'Notes' },
]

const ALIASES: Record<CoreField, string[]> = {
  title: ['title', 'series', 'name', 'comic', 'book'],
  issueNumber: ['issuenumber', 'issue#', 'issue', 'number'],
  publisher: ['publisher', 'pub'],
  condition: ['condition', 'grade'],
  location: ['location', 'box', 'bin', 'slabbox', 'storage', 'shelf'],
  value: ['estvalue', 'uservalue', 'askingprice', 'marketvalue', 'value', 'price'],
  notes: ['notes', 'note', 'comments'],
}

export function guessColumnMapping(headers: string[]): Record<CoreField, string> {
  return guessMapping(
    headers,
    CORE_FIELDS.map((f) => f.key),
    ALIASES,
  )
}
