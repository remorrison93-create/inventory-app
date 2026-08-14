import { useState, type ChangeEvent, type KeyboardEvent } from 'react'

interface Props {
  label: string
  presetOptions: string[]
  customOptions: string[]
  presetGroupLabel: string
  customGroupLabel: string
  addLabel: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  required?: boolean
}

const ADD_NEW = '__add_new__'

export default function PresetSelect({
  label,
  presetOptions,
  customOptions,
  presetGroupLabel,
  customGroupLabel,
  addLabel,
  placeholder,
  value,
  onChange,
  required = true,
}: Props) {
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState('')

  const known = new Set([...presetOptions, ...customOptions].map((o) => o.toLowerCase()))
  const extraCurrentValue = value && !known.has(value.toLowerCase()) ? [value] : []

  function handleSelectChange(e: ChangeEvent<HTMLSelectElement>) {
    const v = e.target.value
    if (v === ADD_NEW) {
      setDraft('')
      setAdding(true)
      return
    }
    onChange(v)
  }

  function confirmAdd() {
    const trimmed = draft.trim()
    if (trimmed) onChange(trimmed)
    setAdding(false)
  }

  if (adding) {
    return (
      <div className="preset-select">
        <span className="preset-select-label">{label}</span>
        <div className="preset-add-row">
          <input
            type="text"
            autoFocus
            value={draft}
            placeholder={placeholder}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e: KeyboardEvent) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                confirmAdd()
              }
            }}
          />
          <button type="button" className="secondary" onClick={confirmAdd}>
            Add
          </button>
          <button type="button" className="link-btn" onClick={() => setAdding(false)}>
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <label>
      {label}
      <select value={value} onChange={handleSelectChange} required={required}>
        <option value="" disabled={required}>
          {required ? 'Select...' : 'None'}
        </option>
        {extraCurrentValue.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
        {presetOptions.length > 0 && (
          <optgroup label={presetGroupLabel}>
            {presetOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </optgroup>
        )}
        {customOptions.length > 0 && (
          <optgroup label={customGroupLabel}>
            {customOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </optgroup>
        )}
        <option value={ADD_NEW}>{addLabel}</option>
      </select>
    </label>
  )
}
