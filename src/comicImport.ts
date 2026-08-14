export function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false
  let i = 0
  const len = text.length

  while (i < len) {
    const char = text[i]
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i += 2
          continue
        }
        inQuotes = false
        i++
        continue
      }
      field += char
      i++
      continue
    }
    if (char === '"') {
      inQuotes = true
      i++
      continue
    }
    if (char === ',') {
      row.push(field)
      field = ''
      i++
      continue
    }
    if (char === '\r') {
      i++
      continue
    }
    if (char === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
      i++
      continue
    }
    field += char
    i++
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  return rows.filter((r) => !(r.length === 1 && r[0].trim() === ''))
}

export function rowsToRecords(rows: string[][]): { headers: string[]; records: Record<string, string>[] } {
  if (rows.length === 0) return { headers: [], records: [] }
  const headers = rows[0].map((h) => h.trim())
  const records = rows.slice(1).map((r) => {
    const obj: Record<string, string> = {}
    headers.forEach((h, idx) => {
      obj[h] = (r[idx] ?? '').trim()
    })
    return obj
  })
  return { headers, records }
}

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

function normalize(header: string): string {
  return header.toLowerCase().replace(/[^a-z0-9#]/g, '')
}

export function guessColumnMapping(headers: string[]): Record<CoreField, string> {
  const normalized = headers.map((h) => ({ original: h, normalized: normalize(h) }))
  const mapping = {} as Record<CoreField, string>
  for (const field of CORE_FIELDS) {
    let match = ''
    for (const alias of ALIASES[field.key]) {
      const found = normalized.find((h) => h.normalized === alias)
      if (found) {
        match = found.original
        break
      }
    }
    mapping[field.key] = match
  }
  return mapping
}
