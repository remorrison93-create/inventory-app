import { useEffect, useState } from 'react'
import type { Comic } from '../types'

interface Props {
  comic: Comic
  onEdit: (comic: Comic) => void
  onDelete: (id: string) => void
}

export default function ComicCard({ comic, onEdit, onDelete }: Props) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const cover = comic.photos[0]

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
    <div className="item-card comic-card">
      <div className="item-photo">
        {photoUrl ? <img src={photoUrl} alt={comic.title} /> : <div className="photo-placeholder small">No photo</div>}
      </div>
      <div className="item-info">
        <div className="item-name">
          {comic.title}
          {comic.issueNumber && <span className="comic-issue"> #{comic.issueNumber}</span>}
        </div>
        <div className="item-room">
          {comic.publisher}
          {comic.location && <span> · {comic.location}</span>}
        </div>
        {comic.condition && <div className="comic-condition">{comic.condition}</div>}
      </div>
      <div className="comic-value">${comic.value.toFixed(2)}</div>
      <div className="item-actions">
        <button type="button" className="link-btn" onClick={() => onEdit(comic)}>
          Edit
        </button>
        <button type="button" className="link-btn danger" onClick={() => onDelete(comic.id)}>
          Delete
        </button>
      </div>
    </div>
  )
}
