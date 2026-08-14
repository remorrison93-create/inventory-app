import { useMemo, useState } from 'react'
import type { Comic } from '../types'
import ComicCard from './ComicCard'

interface Props {
  comics: Comic[]
  onEdit: (comic: Comic) => void
  onDelete: (id: string) => void
}

export default function ComicList({ comics, onEdit, onDelete }: Props) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return comics.filter(
      (c) => c.title.toLowerCase().includes(q) || c.publisher.toLowerCase().includes(q),
    )
  }, [comics, search])

  if (comics.length === 0) {
    return (
      <div className="empty-state">
        <p>No comics yet. Tap "Add Comic" to log your first one.</p>
      </div>
    )
  }

  return (
    <div className="inventory-list">
      <div className="list-filters">
        <input
          type="text"
          placeholder="Search title or publisher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>No comics match your search.</p>
        </div>
      ) : (
        <div className="item-cards">
          {filtered.map((comic) => (
            <ComicCard key={comic.id} comic={comic} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
