import { useEffect, useMemo, useState } from 'react'
import './App.css'
import InventoryList from './components/InventoryList'
import ItemForm from './components/ItemForm'
import Dashboard from './components/Dashboard'
import ComicList from './components/ComicList'
import ComicForm from './components/ComicForm'
import ComicDashboard from './components/ComicDashboard'
import ComicImport from './components/ComicImport'
import {
  addComic,
  addItem,
  adjustQuantity,
  deleteComic,
  deleteItem,
  getAllComics,
  getAllItems,
  updateComic,
  updateItem,
} from './db'
import { downloadComicsCsv, downloadItemsCsv } from './csv'
import type { Comic, Item, NewComic, NewItem } from './types'

type Collection = 'household' | 'comics'
type View = 'list' | 'add' | 'edit' | 'dashboard' | 'import'

function App() {
  const [collection, setCollection] = useState<Collection>('household')
  const [view, setView] = useState<View>('list')
  const [loaded, setLoaded] = useState(false)

  const [items, setItems] = useState<Item[]>([])
  const [editingItem, setEditingItem] = useState<Item | null>(null)

  const [comics, setComics] = useState<Comic[]>([])
  const [editingComic, setEditingComic] = useState<Comic | null>(null)

  useEffect(() => {
    Promise.all([getAllItems(), getAllComics()]).then(([itemData, comicData]) => {
      setItems(itemData)
      setComics(comicData)
      setLoaded(true)
    })
  }, [])

  const rooms = useMemo(() => Array.from(new Set(items.map((i) => i.room))).sort(), [items])
  const itemNames = useMemo(() => Array.from(new Set(items.map((i) => i.name))).sort(), [items])

  function switchCollection(next: Collection) {
    setCollection(next)
    setView('list')
    setEditingItem(null)
    setEditingComic(null)
  }

  async function handleAdd(newItem: NewItem) {
    const created = await addItem(newItem)
    setItems((prev) => [created, ...prev])
    setView('list')
  }

  async function handleUpdate(updates: NewItem) {
    if (!editingItem) return
    const updated: Item = { ...editingItem, ...updates, updatedAt: Date.now() }
    await updateItem(updated)
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))
    setEditingItem(null)
    setView('list')
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

  async function handleAddComic(newComic: NewComic) {
    const created = await addComic(newComic)
    setComics((prev) => [created, ...prev])
    setView('list')
  }

  async function handleUpdateComic(updates: NewComic) {
    if (!editingComic) return
    const updated: Comic = { ...editingComic, ...updates, updatedAt: Date.now() }
    await updateComic(updated)
    setComics((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
    setEditingComic(null)
    setView('list')
  }

  async function handleDeleteComic(id: string) {
    if (!confirm('Delete this comic?')) return
    await deleteComic(id)
    setComics((prev) => prev.filter((c) => c.id !== id))
  }

  function startEditComic(comic: Comic) {
    setEditingComic(comic)
    setView('edit')
  }

  async function handleImportComics(newComics: NewComic[]) {
    const created: Comic[] = []
    for (const newComic of newComics) {
      created.push(await addComic(newComic))
    }
    setComics((prev) => [...created, ...prev])
  }

  const isHousehold = collection === 'household'

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-top">
          <h1>{isHousehold ? 'Home Inventory' : 'Comic Collection'}</h1>
          <div className="header-actions">
            {!isHousehold && (
              <button type="button" className="export-btn" onClick={() => setView('import')}>
                Import CSV
              </button>
            )}
            <button
              type="button"
              className="export-btn"
              onClick={() => (isHousehold ? downloadItemsCsv(items) : downloadComicsCsv(comics))}
              disabled={isHousehold ? items.length === 0 : comics.length === 0}
            >
              Export CSV
            </button>
          </div>
        </div>
        <div className="collection-switcher">
          <button
            type="button"
            className={isHousehold ? 'active' : ''}
            onClick={() => switchCollection('household')}
          >
            Household
          </button>
          <button
            type="button"
            className={!isHousehold ? 'active' : ''}
            onClick={() => switchCollection('comics')}
          >
            Comics
          </button>
        </div>
      </header>

      <main className="app-main">
        {!loaded ? (
          <div className="empty-state">
            <p>Loading...</p>
          </div>
        ) : isHousehold ? (
          view === 'list' ? (
            <InventoryList items={items} onAdjust={handleAdjust} onEdit={startEdit} onDelete={handleDelete} />
          ) : view === 'add' ? (
            <ItemForm
              rooms={rooms}
              itemNames={itemNames}
              onSubmit={handleAdd}
              onCancel={() => setView('list')}
            />
          ) : view === 'edit' && editingItem ? (
            <ItemForm
              rooms={rooms}
              itemNames={itemNames}
              initial={editingItem}
              onSubmit={handleUpdate}
              onCancel={() => {
                setEditingItem(null)
                setView('list')
              }}
            />
          ) : (
            <Dashboard items={items} />
          )
        ) : view === 'list' ? (
          <ComicList comics={comics} onEdit={startEditComic} onDelete={handleDeleteComic} />
        ) : view === 'import' ? (
          <ComicImport onImport={handleImportComics} onCancel={() => setView('list')} />
        ) : view === 'add' ? (
          <ComicForm onSubmit={handleAddComic} onCancel={() => setView('list')} />
        ) : view === 'edit' && editingComic ? (
          <ComicForm
            initial={editingComic}
            onSubmit={handleUpdateComic}
            onCancel={() => {
              setEditingComic(null)
              setView('list')
            }}
          />
        ) : (
          <ComicDashboard comics={comics} />
        )}
      </main>

      <nav className="bottom-nav">
        <button type="button" className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>
          {isHousehold ? 'Inventory' : 'Comics'}
        </button>
        <button type="button" className={view === 'add' ? 'active' : ''} onClick={() => setView('add')}>
          {isHousehold ? 'Add Item' : 'Add Comic'}
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
