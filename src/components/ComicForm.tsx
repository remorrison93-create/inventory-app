import { useState, type FormEvent } from 'react'
import MultiPhotoInput from './MultiPhotoInput'
import CustomFieldsEditor from './CustomFieldsEditor'
import type { Comic, CustomField, NewComic } from '../types'

interface Props {
  initial?: Comic
  onSubmit: (comic: NewComic) => void
  onCancel: () => void
}

export default function ComicForm({ initial, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [issueNumber, setIssueNumber] = useState(initial?.issueNumber ?? '')
  const [publisher, setPublisher] = useState(initial?.publisher ?? '')
  const [condition, setCondition] = useState(initial?.condition ?? '')
  const [value, setValue] = useState(initial?.value ?? 0)
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [photos, setPhotos] = useState<Blob[]>(initial?.photos ?? [])
  const [customFields, setCustomFields] = useState<CustomField[]>(initial?.customFields ?? [])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit({
      title: title.trim(),
      issueNumber: issueNumber.trim(),
      publisher: publisher.trim(),
      condition: condition.trim(),
      value,
      notes: notes.trim(),
      photos,
      customFields: customFields.filter((f) => f.key.trim() !== ''),
    })
  }

  return (
    <form className="item-form" onSubmit={handleSubmit}>
      <MultiPhotoInput value={photos} onChange={setPhotos} />

      <label>
        Title
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Amazing Spider-Man"
          required
        />
      </label>

      <label>
        Issue Number
        <input
          type="text"
          value={issueNumber}
          onChange={(e) => setIssueNumber(e.target.value)}
          placeholder="e.g. 300"
        />
      </label>

      <label>
        Publisher
        <input
          type="text"
          value={publisher}
          onChange={(e) => setPublisher(e.target.value)}
          placeholder="e.g. Marvel"
        />
      </label>

      <label>
        Condition
        <input
          type="text"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          placeholder="e.g. NM, VF/NM, 9.4"
        />
      </label>

      <label>
        Value ($)
        <input
          type="number"
          min={0}
          step="0.01"
          value={value}
          onChange={(e) => setValue(Math.max(0, Number(e.target.value)))}
        />
      </label>

      <label>
        Notes
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Anything else worth remembering"
          rows={3}
        />
      </label>

      <CustomFieldsEditor fields={customFields} onChange={setCustomFields} />

      <div className="form-actions">
        <button type="button" className="secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="primary">
          {initial ? 'Save Changes' : 'Add Comic'}
        </button>
      </div>
    </form>
  )
}
