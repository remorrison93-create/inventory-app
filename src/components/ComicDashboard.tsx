import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { Comic } from '../types'

interface Props {
  comics: Comic[]
}

const BAR_COLOR = '#3b82f6'
const TOP_N = 15

export default function ComicDashboard({ comics }: Props) {
  const totalValue = useMemo(() => comics.reduce((sum, c) => sum + c.value, 0), [comics])

  const topComics = useMemo(() => {
    return [...comics]
      .sort((a, b) => b.value - a.value)
      .slice(0, TOP_N)
      .map((c) => ({
        name: c.issueNumber ? `${c.title} #${c.issueNumber}` : c.title,
        value: c.value,
      }))
      .reverse()
  }, [comics])

  if (comics.length === 0) {
    return (
      <div className="empty-state">
        <p>Add some comics to see your dashboard.</p>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <section className="dashboard-section">
        <div className="stat-tile">
          <span className="stat-label">Total Collection Value</span>
          <span className="stat-value">${totalValue.toFixed(2)}</span>
          <span className="stat-sub">{comics.length} comic{comics.length === 1 ? '' : 's'}</span>
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Most Valuable Comics</h2>
        <ResponsiveContainer width="100%" height={Math.max(200, topComics.length * 40)}>
          <BarChart data={topComics} layout="vertical" margin={{ left: 10, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tickFormatter={(v) => `$${v}`} />
            <YAxis type="category" dataKey="name" width={140} />
            <Tooltip formatter={(v) => `$${Number(v).toFixed(2)}`} />
            <Bar dataKey="value" fill={BAR_COLOR} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  )
}
