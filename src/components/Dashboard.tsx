import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { Item } from '../types'

interface Props {
  items: Item[]
}

const BAR_COLOR = '#3b82f6'
const LOW_COLOR = '#ef4444'

export default function Dashboard({ items }: Props) {
  const rooms = useMemo(() => {
    const map = new Map<string, Item[]>()
    for (const item of items) {
      const list = map.get(item.room) ?? []
      list.push(item)
      map.set(item.room, list)
    }
    return Array.from(map.entries())
      .map(([room, roomItems]) => ({
        room,
        data: roomItems
          .slice()
          .sort((a, b) => a.quantity - b.quantity)
          .map((item) => ({
            name: item.name,
            quantity: item.quantity,
            low: item.quantity <= item.lowStockThreshold,
          })),
      }))
      .sort((a, b) => a.room.localeCompare(b.room))
  }, [items])

  const lowStockItems = useMemo(
    () => items.filter((i) => i.quantity <= i.lowStockThreshold).sort((a, b) => a.quantity - b.quantity),
    [items],
  )

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <p>Add some items to see your dashboard.</p>
      </div>
    )
  }

  return (
    <div className="dashboard">
      {lowStockItems.length > 0 && (
        <section className="dashboard-section">
          <h2>Low Stock Warnings</h2>
          <ul className="warning-list">
            {lowStockItems.map((item) => (
              <li key={item.id} className="warning-item">
                <span className="warning-name">{item.name}</span>
                <span className="warning-room">{item.room}</span>
                <span className="warning-qty">{item.quantity} left</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {rooms.map(({ room, data }) => (
        <section className="dashboard-section" key={room}>
          <h2>{room}</h2>
          <ResponsiveContainer width="100%" height={Math.max(120, data.length * 40)}>
            <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="name" width={110} />
              <Tooltip />
              <Bar dataKey="quantity" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.low ? LOW_COLOR : BAR_COLOR} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </section>
      ))}
    </div>
  )
}
