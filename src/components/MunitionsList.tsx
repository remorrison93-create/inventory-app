import { useMemo, useState } from 'react'
import type { MunitionsItem } from '../types'
import MunitionsCard from './MunitionsCard'

interface Props {
  items: MunitionsItem[]
  onAdjust: (id: string, delta: number) => void
  onEdit: (item: MunitionsItem) => void
  onDelete: (id: string) => void
}

export default function MunitionsList({ items, onAdjust, onEdit, onDelete }: Props) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [locationFilter, setLocationFilter] = useState('All')

  const locations = useMemo(
    () => ['All', ...Array.from(new Set(items.map((i) => i.location).filter(Boolean))).sort()],
    [items],
  )

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return items.filter((item) => {
      const matchesType = typeFilter === 'All' || item.itemType === typeFilter
      const matchesLocation = locationFilter === 'All' || item.location === locationFilter
      const matchesSearch =
        item.name.toLowerCase().includes(q) ||
        item.manufacturer.toLowerCase().includes(q) ||
        item.caliber.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q)
      return matchesType && matchesLocation && matchesSearch
    })
  }, [items, search, typeFilter, locationFilter])

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <p>No ammo or gear yet. Tap "Add Item" to log your first one.</p>
      </div>
    )
  }

  return (
    <div className="inventory-list">
      <div className="list-filters">
        <input
          type="text"
          placeholder="Search name, manufacturer, caliber..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="All">All Types</option>
          <option value="Ammunition">Ammunition</option>
          <option value="Accessory">Accessory</option>
        </select>
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
          <p>No items match your filters.</p>
        </div>
      ) : (
        <div className="item-cards">
          {filtered.map((item) => (
            <MunitionsCard key={item.id} item={item} onAdjust={onAdjust} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
