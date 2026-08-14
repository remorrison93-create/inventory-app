import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { MunitionsItem } from '../types'

interface Props {
  items: MunitionsItem[]
}

const BAR_COLOR = '#3b82f6'
const LOW_COLOR = '#ef4444'

export default function MunitionsDashboard({ items }: Props) {
  const locations = useMemo(() => {
    const map = new Map<string, MunitionsItem[]>()
    for (const item of items) {
      const key = item.location || 'Unassigned'
      const list = map.get(key) ?? []
      list.push(item)
      map.set(key, list)
    }
    return Array.from(map.entries())
      .map(([location, locationItems]) => ({
        location,
        data: locationItems
          .slice()
          .sort((a, b) => a.quantity - b.quantity)
          .map((item) => ({
            name: item.name,
            quantity: item.quantity,
            low: item.quantity <= item.lowStockThreshold,
          })),
      }))
      .sort((a, b) => a.location.localeCompare(b.location))
  }, [items])

  const roundsByCaliber = useMemo(() => {
    const map = new Map<string, number>()
    for (const item of items) {
      if (item.itemType !== 'Ammunition' || !item.caliber) continue
      const rounds = item.roundsPerBox ? item.quantity * item.roundsPerBox : item.quantity
      map.set(item.caliber, (map.get(item.caliber) ?? 0) + rounds)
    }
    return Array.from(map.entries())
      .map(([caliber, rounds]) => ({ caliber, rounds }))
      .sort((a, b) => b.rounds - a.rounds)
  }, [items])

  const lowStockItems = useMemo(
    () => items.filter((i) => i.quantity <= i.lowStockThreshold).sort((a, b) => a.quantity - b.quantity),
    [items],
  )

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <p>Add some ammo or gear to see your dashboard.</p>
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
                <span className="warning-room">{item.location || 'Unassigned'}</span>
                <span className="warning-qty">{item.quantity} left</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {roundsByCaliber.length > 0 && (
        <section className="dashboard-section">
          <h2>Rounds by Caliber</h2>
          <ResponsiveContainer width="100%" height={Math.max(120, roundsByCaliber.length * 40)}>
            <BarChart data={roundsByCaliber} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="caliber" width={90} />
              <Tooltip />
              <Bar dataKey="rounds" fill={BAR_COLOR} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>
      )}

      {locations.map(({ location, data }) => (
        <section className="dashboard-section" key={location}>
          <h2>{location}</h2>
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
