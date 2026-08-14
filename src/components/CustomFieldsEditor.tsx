import type { CustomField } from '../types'

interface Props {
  fields: CustomField[]
  onChange: (fields: CustomField[]) => void
}

export default function CustomFieldsEditor({ fields, onChange }: Props) {
  function updateField(index: number, patch: Partial<CustomField>) {
    onChange(fields.map((f, i) => (i === index ? { ...f, ...patch } : f)))
  }

  function removeField(index: number) {
    onChange(fields.filter((_, i) => i !== index))
  }

  function addField() {
    onChange([...fields, { key: '', value: '' }])
  }

  return (
    <div className="custom-fields">
      <span className="custom-fields-label">Custom Fields</span>
      {fields.map((field, index) => (
        <div className="custom-field-row" key={index}>
          <input
            type="text"
            placeholder="Field name"
            value={field.key}
            onChange={(e) => updateField(index, { key: e.target.value })}
          />
          <input
            type="text"
            placeholder="Value"
            value={field.value}
            onChange={(e) => updateField(index, { value: e.target.value })}
          />
          <button
            type="button"
            className="link-btn danger"
            onClick={() => removeField(index)}
            aria-label="Remove field"
          >
            ×
          </button>
        </div>
      ))}
      <button type="button" className="secondary" onClick={addField}>
        + Add Custom Field
      </button>
    </div>
  )
}
