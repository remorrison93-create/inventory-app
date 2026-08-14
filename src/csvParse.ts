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

function normalizeHeader(header: string): string {
  return header.toLowerCase().replace(/[^a-z0-9#]/g, '')
}

export function guessColumnMapping<F extends string>(
  headers: string[],
  fieldKeys: F[],
  aliases: Record<F, string[]>,
): Record<F, string> {
  const normalized = headers.map((h) => ({ original: h, normalized: normalizeHeader(h) }))
  const mapping = {} as Record<F, string>
  for (const field of fieldKeys) {
    let match = ''
    for (const alias of aliases[field]) {
      const found = normalized.find((h) => h.normalized === alias)
      if (found) {
        match = found.original
        break
      }
    }
    mapping[field] = match
  }
  return mapping
}
