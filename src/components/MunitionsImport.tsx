import { useState } from 'react'
import { CORE_FIELDS, guessColumnMapping, parseCsv, rowsToRecords, type CoreField } from '../munitionsImport'
import type { MunitionsType, NewMunitionsItem } from '../types'

interface Props {
  onImport: (items: NewMunitionsItem[]) => Promise<void>
  onCancel: () => void
}

type Step = 'pick' | 'map' | 'done'

const emptyMapping: Record<CoreField, string> = {
  name: '',
  manufacturer: '',
  caliber: '',
  category: '',
  bulletWeightGr: '',
  bulletType: '',
  roundsPerBox: '',
  quantity: '',
  lowStockThreshold: '',
  location: '',
  condition: '',
  notes: '',
}

export default function MunitionsImport({ onImport, onCancel }: Props) {
  const [step, setStep] = useState<Step>('pick')
  const [fileName, setFileName] = useState('')
  const [headers, setHeaders] = useState<string[]>([])
  const [records, setRecords] = useState<Record<string, string>[]>([])
  const [mapping, setMapping] = useState<Record<CoreField, string>>(emptyMapping)
  const [includedExtraColumns, setIncludedExtraColumns] = useState<Set<string>>(new Set())
  const [importType, setImportType] = useState<MunitionsType>('Ammunition')
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<{ imported: number; skipped: number } | null>(null)
  const [error, setError] = useState('')

  async function handleFile(file: File) {
    setError('')
    try {
      const text = await file.text()
      const rows = parseCsv(text)
      const { headers: hdrs, records: recs } = rowsToRecords(rows)
      if (hdrs.length === 0) {
        setError('That file appears to be empty.')
        return
      }
      const guessed = guessColumnMapping(hdrs)
      const mappedValues = new Set(Object.values(guessed).filter(Boolean))
      setFileName(file.name)
      setHeaders(hdrs)
      setRecords(recs)
      setMapping(guessed)
      setIncludedExtraColumns(new Set(hdrs.filter((h) => !mappedValues.has(h))))
      setStep('map')
    } catch {
      setError('Could not read that file. Please upload a .csv file.')
    }
  }

  function updateMapping(field: CoreField, column: string) {
    setMapping((prev) => ({ ...prev, [field]: column }))
  }

  function toggleExtraColumn(column: string) {
    setIncludedExtraColumns((prev) => {
      const next = new Set(prev)
      if (next.has(column)) next.delete(column)
      else next.add(column)
      return next
    })
  }

  async function handleImport() {
    setImporting(true)
    const mappedHeaders = new Set(Object.values(mapping).filter(Boolean))
    const isAmmo = importType === 'Ammunition'
    let imported = 0
    let skipped = 0
    const items: NewMunitionsItem[] = []

    for (const row of records) {
      const name = mapping.name ? (row[mapping.name] ?? '').trim() : ''
      if (!name) {
        skipped++
        continue
      }
      const customFields = headers
        .filter((h) => includedExtraColumns.has(h) && !mappedHeaders.has(h))
        .map((h) => ({ key: h, value: row[h] ?? '' }))
        .filter((f) => f.value !== '')

      const numOrNull = (col: string) => {
        if (!col) return null
        const n = Number.parseFloat(row[col] ?? '')
        return Number.isFinite(n) ? n : null
      }

      items.push({
        itemType: importType,
        name,
        manufacturer: mapping.manufacturer ? (row[mapping.manufacturer] ?? '') : '',
        caliber: mapping.caliber ? (row[mapping.caliber] ?? '') : '',
        category: isAmmo ? '' : mapping.category ? (row[mapping.category] ?? '') : '',
        bulletWeightGr: isAmmo ? numOrNull(mapping.bulletWeightGr) : null,
        bulletType: isAmmo && mapping.bulletType ? (row[mapping.bulletType] ?? '') : '',
        roundsPerBox: isAmmo ? numOrNull(mapping.roundsPerBox) : null,
        quantity: mapping.quantity ? numOrNull(mapping.quantity) || 0 : 0,
        lowStockThreshold: mapping.lowStockThreshold ? numOrNull(mapping.lowStockThreshold) || 0 : 0,
        location: mapping.location ? (row[mapping.location] ?? '') : '',
        condition: mapping.condition ? (row[mapping.condition] ?? '') : '',
        notes: mapping.notes ? (row[mapping.notes] ?? '') : '',
        photos: [],
        customFields,
      })
      imported++
    }

    await onImport(items)
    setImporting(false)
    setResult({ imported, skipped })
    setStep('done')
  }

  const mappedHeaders = new Set(Object.values(mapping).filter(Boolean))
  const unmappedHeaders = headers.filter((h) => !mappedHeaders.has(h))

  if (step === 'pick') {
    return (
      <div className="import-wizard">
        <p className="import-help">
          Upload a CSV of your ammo or gear. If you're working from a spreadsheet with multiple
          tabs, export just the tab with your rows as CSV first.
        </p>
        <label className="secondary import-file-btn">
          Choose CSV File
          <input
            type="file"
            accept=".csv,text/csv"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFile(file)
            }}
          />
        </label>
        {error && <p className="import-error">{error}</p>}
        <div className="form-actions">
          <button type="button" className="secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    )
  }

  if (step === 'map') {
    return (
      <div className="import-wizard">
        <p className="import-help">
          {fileName} — {records.length} row{records.length === 1 ? '' : 's'} found. Map your
          columns below, then choose which remaining columns become custom fields.
        </p>

        <div className="type-toggle">
          <button
            type="button"
            className={importType === 'Ammunition' ? 'active' : ''}
            onClick={() => setImportType('Ammunition')}
          >
            Import as Ammunition
          </button>
          <button
            type="button"
            className={importType === 'Accessory' ? 'active' : ''}
            onClick={() => setImportType('Accessory')}
          >
            Import as Accessory
          </button>
        </div>

        <div className="import-mapping">
          {CORE_FIELDS.map((field) => (
            <label key={field.key}>
              {field.label}
              {field.required && ' *'}
              <select value={mapping[field.key]} onChange={(e) => updateMapping(field.key, e.target.value)}>
                <option value="">-- Not mapped --</option>
                {headers.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>

        {unmappedHeaders.length > 0 && (
          <div className="import-extra-columns">
            <span className="custom-fields-label">Bring in remaining columns as custom fields</span>
            {unmappedHeaders.map((h) => (
              <label key={h} className="import-checkbox-row">
                <input
                  type="checkbox"
                  checked={includedExtraColumns.has(h)}
                  onChange={() => toggleExtraColumn(h)}
                />
                {h}
              </label>
            ))}
          </div>
        )}

        {!mapping.name && <p className="import-error">Map a Name column to continue.</p>}

        <div className="form-actions">
          <button type="button" className="secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="primary" disabled={!mapping.name || importing} onClick={handleImport}>
            {importing ? 'Importing...' : `Import ${records.length} Row${records.length === 1 ? '' : 's'}`}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="import-wizard">
      <p className="import-result">
        Imported {result?.imported ?? 0} item{result?.imported === 1 ? '' : 's'}.
        {result && result.skipped > 0
          ? ` Skipped ${result.skipped} row${result.skipped === 1 ? '' : 's'} with no name.`
          : ''}
      </p>
      <div className="form-actions">
        <button type="button" className="primary" onClick={onCancel}>
          Done
        </button>
      </div>
    </div>
  )
}
