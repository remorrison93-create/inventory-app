import { useEffect, useMemo, useState } from 'react'
import './App.css'
import InventoryList from './components/InventoryList'
import ItemForm from './components/ItemForm'
import Dashboard from './components/Dashboard'
import { addItem, adjustQuantity, deleteItem, getAllItems, updateItem } from './db'
import type { Item, NewItem } from './types'

type View = 'inventory' | 'add' | 'edit' | 'dashboard'

function App() {
  const [items, setItems] = useState<Item[]>([])
  const [view, setView] = useState<View>('inventory')
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    getAllItems().then((data) => {
      setItems(data)
      setLoaded(true)
    })
  }, [])

  const rooms = useMemo(() => Array.from(new Set(items.map((i) => i.room))).sort(), [items])

  async function handleAdd(newItem: NewItem) {
    const created = await addItem(newItem)
    setItems((prev) => [created, ...prev])
    setView('inventory')
  }

  async function handleUpdate(updates: NewItem) {
    if (!editingItem) return
    const updated: Item = { ...editingItem, ...updates, updatedAt: Date.now() }
    await updateItem(updated)
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))
    setEditingItem(null)
    setView('inventory')
  }

  async function handleAdjust(id: string, delta: number) {
    const updated = await adjustQuantity(id, delta)
    if (updated) {
      setItems((prev) => prev.map((i) => (i.id === id ? updated : i)))
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this item?')) return
    await deleteItem(id)
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function startEdit(item: Item) {
    setEditingItem(item)
    setView('edit')
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Home Inventory</h1>
      </header>

      <main className="app-main">
        {!loaded ? (
          <div className="empty-state">
            <p>Loading...</p>
          </div>
        ) : view === 'inventory' ? (
          <InventoryList items={items} onAdjust={handleAdjust} onEdit={startEdit} onDelete={handleDelete} />
        ) : view === 'add' ? (
          <ItemForm rooms={rooms} onSubmit={handleAdd} onCancel={() => setView('inventory')} />
        ) : view === 'edit' && editingItem ? (
          <ItemForm
            rooms={rooms}
            initial={editingItem}
            onSubmit={handleUpdate}
            onCancel={() => {
              setEditingItem(null)
              setView('inventory')
            }}
          />
        ) : (
          <Dashboard items={items} />
        )}
      </main>

      <nav className="bottom-nav">
        <button
          type="button"
          className={view === 'inventory' ? 'active' : ''}
          onClick={() => setView('inventory')}
        >
          Inventory
        </button>
        <button type="button" className={view === 'add' ? 'active' : ''} onClick={() => setView('add')}>
          Add Item
        </button>
        <button
          type="button"
          className={view === 'dashboard' ? 'active' : ''}
          onClick={() => setView('dashboard')}
        >
          Dashboard
        </button>
      </nav>
    </div>
  )
}

export default App
