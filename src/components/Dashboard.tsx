import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { Item } from '../types'

interface Props {
  items: Item[]
}

const BAR_COLOR = '#3b82f6'
const LOW_COLOR = '#ef4444'

export default function Dashboard({ items }: Props) {
  const byRoom = useMemo(() => {
    const map = new Map<string, number>()
    for (const item of items) {
      map.set(item.room, (map.get(item.room) ?? 0) + item.quantity)
    }
    return Array.from(map.entries())
      .map(([room, quantity]) => ({ room, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
  }, [items])

  const byItem = useMemo(() => {
    return [...items]
      .sort((a, b) => a.quantity - b.quantity)
      .slice(0, 15)
      .map((item) => ({
        name: item.name,
        quantity: item.quantity,
        low: item.quantity <= item.lowStockThreshold,
      }))
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

      <section className="dashboard-section">
        <h2>Quantity by Room</h2>
        <ResponsiveContainer width="100%" height={Math.max(200, byRoom.length * 50)}>
          <BarChart data={byRoom} layout="vertical" margin={{ left: 10, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="room" width={90} />
            <Tooltip />
            <Bar dataKey="quantity" fill={BAR_COLOR} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="dashboard-section">
        <h2>Item Quantities (lowest first)</h2>
        <ResponsiveContainer width="100%" height={Math.max(200, byItem.length * 40)}>
          <BarChart data={byItem} layout="vertical" margin={{ left: 10, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="name" width={110} />
            <Tooltip />
            <Bar dataKey="quantity" radius={[0, 4, 4, 0]}>
              {byItem.map((entry, index) => (
                <Cell key={index} fill={entry.low ? LOW_COLOR : BAR_COLOR} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  )
}
