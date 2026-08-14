import { useEffect, useState } from 'react'
import type { Item } from '../types'

interface Props {
  item: Item
  onAdjust: (id: string, delta: number) => void
  onEdit: (item: Item) => void
  onDelete: (id: string) => void
}

export default function ItemCard({ item, onAdjust, onEdit, onDelete }: Props) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const isLow = item.quantity <= item.lowStockThreshold

  useEffect(() => {
    if (!item.photo) {
      setPhotoUrl(null)
      return
    }
    const url = URL.createObjectURL(item.photo)
    setPhotoUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [item.photo])

  return (
    <div className={`item-card${isLow ? ' low-stock' : ''}`}>
      <div className="item-photo">
        {photoUrl ? <img src={photoUrl} alt={item.name} /> : <div className="photo-placeholder small">No photo</div>}
      </div>
      <div className="item-info">
        <div className="item-name">{item.name}</div>
        <div className="item-room">{item.room}</div>
        {isLow && <div className="low-stock-badge">Low stock</div>}
      </div>
      <div className="item-controls">
        <button
          type="button"
          className="qty-btn"
          onClick={() => onAdjust(item.id, -1)}
          disabled={item.quantity <= 0}
          aria-label={`Decrease ${item.name}`}
        >
          −1
        </button>
        <span className="qty-value">{item.quantity}</span>
        <button
          type="button"
          className="qty-btn"
          onClick={() => onAdjust(item.id, 1)}
          aria-label={`Increase ${item.name}`}
        >
          +1
        </button>
      </div>
      <div className="item-actions">
        <button type="button" className="link-btn" onClick={() => onEdit(item)}>
          Edit
        </button>
        <button type="button" className="link-btn danger" onClick={() => onDelete(item.id)}>
          Delete
        </button>
      </div>
    </div>
  )
}
