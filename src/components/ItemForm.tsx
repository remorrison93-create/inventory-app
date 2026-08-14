import { useMemo, useState, type FormEvent } from 'react'
import PhotoInput from './PhotoInput'
import PresetSelect from './PresetSelect'
import { COMMON_ITEMS, COMMON_ROOMS } from '../presets'
import type { Item, NewItem } from '../types'

interface Props {
  rooms: string[]
  itemNames: string[]
  initial?: Item
  onSubmit: (item: NewItem) => void
  onCancel: () => void
}

function dedupeCustom(known: string[], presets: string[]): string[] {
  const presetSet = new Set(presets.map((p) => p.toLowerCase()))
  return Array.from(new Set(known.filter((k) => !presetSet.has(k.toLowerCase())))).sort()
}

export default function ItemForm({ rooms, itemNames, initial, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [room, setRoom] = useState(initial?.room ?? '')
  const [quantity, setQuantity] = useState(initial?.quantity ?? 1)
  const [lowStockThreshold, setLowStockThreshold] = useState(initial?.lowStockThreshold ?? 1)
  const [photo, setPhoto] = useState<Blob | null>(initial?.photo ?? null)

  const customRooms = useMemo(() => dedupeCustom(rooms, COMMON_ROOMS), [rooms])
  const customItems = useMemo(() => dedupeCustom(itemNames, COMMON_ITEMS), [itemNames])

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

      <PresetSelect
        label="Item name"
        value={name}
        onChange={setName}
        presetOptions={COMMON_ITEMS}
        customOptions={customItems}
        presetGroupLabel="Common Items"
        customGroupLabel="Your Items"
        addLabel="+ Add new item..."
        placeholder="e.g. Waffle mix"
      />

      <PresetSelect
        label="Room"
        value={room}
        onChange={setRoom}
        presetOptions={COMMON_ROOMS}
        customOptions={customRooms}
        presetGroupLabel="Common Rooms"
        customGroupLabel="Your Rooms"
        addLabel="+ Add new room..."
        placeholder="e.g. Mudroom"
      />

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
