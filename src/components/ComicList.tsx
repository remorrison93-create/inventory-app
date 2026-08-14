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
  const [locationFilter, setLocationFilter] = useState('All')

  const locations = useMemo(
    () => ['All', ...Array.from(new Set(comics.map((c) => c.location).filter(Boolean))).sort()],
    [comics],
  )

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return comics.filter((c) => {
      const matchesLocation = locationFilter === 'All' || c.location === locationFilter
      const matchesSearch =
        c.title.toLowerCase().includes(q) ||
        c.publisher.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q)
      return matchesLocation && matchesSearch
    })
  }, [comics, search, locationFilter])

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
          placeholder="Search title, publisher, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
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
