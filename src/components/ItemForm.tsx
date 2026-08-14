import { useState, type FormEvent } from 'react'
import PhotoInput from './PhotoInput'
import type { Item, NewItem } from '../types'

interface Props {
  rooms: string[]
  initial?: Item
  onSubmit: (item: NewItem) => void
  onCancel: () => void
}

export default function ItemForm({ rooms, initial, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [room, setRoom] = useState(initial?.room ?? '')
  const [quantity, setQuantity] = useState(initial?.quantity ?? 1)
  const [lowStockThreshold, setLowStockThreshold] = useState(initial?.lowStockThreshold ?? 1)
  const [photo, setPhoto] = useState<Blob | null>(initial?.photo ?? null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !room.trim()) return
    onSubmit({
      name: name.trim(),
      room: room.trim(),
      quantity,
      lowStockThreshold,
      photo,
    })
  }

  return (
    <form className="item-form" onSubmit={handleSubmit}>
      <PhotoInput value={photo} onChange={setPhoto} />

      <label>
        Item name
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Paper towels"
          required
        />
      </label>

      <label>
        Room
        <input
          type="text"
          list="room-options"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="e.g. Kitchen"
          required
        />
        <datalist id="room-options">
          {rooms.map((r) => (
            <option key={r} value={r} />
          ))}
        </datalist>
      </label>

      <label>
        Quantity
        <input
          type="number"
          min={0}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(0, Number(e.target.value)))}
          required
        />
      </label>

      <label>
        Low stock warning at
        <input
          type="number"
          min={0}
          value={lowStockThreshold}
          onChange={(e) => setLowStockThreshold(Math.max(0, Number(e.target.value)))}
          required
        />
      </label>

      <div className="form-actions">
        <button type="button" className="secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="primary">
          {initial ? 'Save Changes' : 'Add Item'}
        </button>
      </div>
    </form>
  )
}
