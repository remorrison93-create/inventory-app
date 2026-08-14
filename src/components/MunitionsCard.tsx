import { useEffect, useState } from 'react'
import type { MunitionsItem } from '../types'

interface Props {
  item: MunitionsItem
  onAdjust: (id: string, delta: number) => void
  onEdit: (item: MunitionsItem) => void
  onDelete: (id: string) => void
}

export default function MunitionsCard({ item, onAdjust, onEdit, onDelete }: Props) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const cover = item.photos[0]
  const isLow = item.quantity <= item.lowStockThreshold
  const isAmmo = item.itemType === 'Ammunition'
  const totalRounds = isAmmo && item.roundsPerBox ? item.quantity * item.roundsPerBox : null

  useEffect(() => {
    if (!cover) {
      setPhotoUrl(null)
      return
    }
    const url = URL.createObjectURL(cover)
    setPhotoUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [cover])

  return (
    <div className={`item-card${isLow ? ' low-stock' : ''}`}>
      <div className="item-photo">
        {photoUrl ? <img src={photoUrl} alt={item.name} /> : <div className="photo-placeholder small">No photo</div>}
      </div>
      <div className="item-info">
        <div className="item-name">{item.name}</div>
        <div className="item-room">
          {[item.itemType, item.caliber, item.location].filter(Boolean).join(' · ')}
        </div>
        {totalRounds !== null && <div className="comic-condition">{totalRounds} rounds total</div>}
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
