import { useMemo, useState } from 'react'
import type { Item } from '../types'
import ItemCard from './ItemCard'

interface Props {
  items: Item[]
  onAdjust: (id: string, delta: number) => void
  onEdit: (item: Item) => void
  onDelete: (id: string) => void
}

export default function InventoryList({ items, onAdjust, onEdit, onDelete }: Props) {
  const [search, setSearch] = useState('')
  const [roomFilter, setRoomFilter] = useState('All')

  const rooms = useMemo(
    () => ['All', ...Array.from(new Set(items.map((i) => i.room))).sort()],
    [items],
  )

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesRoom = roomFilter === 'All' || item.room === roomFilter
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
      return matchesRoom && matchesSearch
    })
  }, [items, roomFilter, search])

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <p>No items yet. Tap "Add Item" to photograph your first one.</p>
      </div>
    )
  }

  return (
    <div className="inventory-list">
      <div className="list-filters">
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={roomFilter} onChange={(e) => setRoomFilter(e.target.value)}>
          {rooms.map((r) => (
            <option key={r} value={r}>
              {r}
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
            <ItemCard key={item.id} item={item} onAdjust={onAdjust} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
