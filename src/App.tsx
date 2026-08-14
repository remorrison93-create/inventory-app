import { useEffect, useMemo, useState } from 'react'
import './App.css'
import InventoryList from './components/InventoryList'
import ItemForm from './components/ItemForm'
import Dashboard from './components/Dashboard'
import ComicList from './components/ComicList'
import ComicForm from './components/ComicForm'
import ComicDashboard from './components/ComicDashboard'
import ComicImport from './components/ComicImport'
import MunitionsList from './components/MunitionsList'
import MunitionsForm from './components/MunitionsForm'
import MunitionsDashboard from './components/MunitionsDashboard'
import MunitionsImport from './components/MunitionsImport'
import {
  addComic,
  addItem,
  addMunitionsItem,
  adjustMunitionsQuantity,
  adjustQuantity,
  deleteComic,
  deleteItem,
  deleteMunitionsItem,
  getAllComics,
  getAllItems,
  getAllMunitions,
  updateComic,
  updateItem,
  updateMunitionsItem,
} from './db'
import { downloadComicsCsv, downloadItemsCsv, downloadMunitionsCsv } from './csv'
import type { Comic, Item, MunitionsItem, NewComic, NewItem, NewMunitionsItem } from './types'

type Collection = 'household' | 'comics' | 'munitions'
type View = 'list' | 'add' | 'edit' | 'dashboard' | 'import'

const COLLECTION_LABELS: Record<Collection, string> = {
  household: 'Household',
  comics: 'Comics',
  munitions: 'Munitions',
}

const COLLECTION_TITLES: Record<Collection, string> = {
  household: 'Home Inventory',
  comics: 'Comic Collection',
  munitions: 'Munitions',
}

function App() {
  const [collection, setCollection] = useState<Collection>('household')
  const [view, setView] = useState<View>('list')
  const [loaded, setLoaded] = useState(false)

  const [items, setItems] = useState<Item[]>([])
  const [editingItem, setEditingItem] = useState<Item | null>(null)

  const [comics, setComics] = useState<Comic[]>([])
  const [editingComic, setEditingComic] = useState<Comic | null>(null)

  const [munitions, setMunitions] = useState<MunitionsItem[]>([])
  const [editingMunitionsItem, setEditingMunitionsItem] = useState<MunitionsItem | null>(null)

  useEffect(() => {
    Promise.all([getAllItems(), getAllComics(), getAllMunitions()]).then(
      ([itemData, comicData, munitionsData]) => {
        setItems(itemData)
        setComics(comicData)
        setMunitions(munitionsData)
        setLoaded(true)
      },
    )
  }, [])

  const rooms = useMemo(() => Array.from(new Set(items.map((i) => i.room))).sort(), [items])
  const itemNames = useMemo(() => Array.from(new Set(items.map((i) => i.name))).sort(), [items])
  const comicLocations = useMemo(
    () => Array.from(new Set(comics.map((c) => c.location).filter(Boolean))).sort(),
    [comics],
  )
  const munitionsLocations = useMemo(
    () => Array.from(new Set(munitions.map((m) => m.location).filter(Boolean))).sort(),
    [munitions],
  )

  function switchCollection(next: Collection) {
    setCollection(next)
    setView('list')
    setEditingItem(null)
    setEditingComic(null)
    setEditingMunitionsItem(null)
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

  async function handleAddMunitionsItem(newItem: NewMunitionsItem) {
    const created = await addMunitionsItem(newItem)
    setMunitions((prev) => [created, ...prev])
    setView('list')
  }

  async function handleUpdateMunitionsItem(updates: NewMunitionsItem) {
    if (!editingMunitionsItem) return
    const updated: MunitionsItem = { ...editingMunitionsItem, ...updates, updatedAt: Date.now() }
    await updateMunitionsItem(updated)
    setMunitions((prev) => prev.map((m) => (m.id === updated.id ? updated : m)))
    setEditingMunitionsItem(null)
    setView('list')
  }

  async function handleAdjustMunitions(id: string, delta: number) {
    const updated = await adjustMunitionsQuantity(id, delta)
    if (updated) {
      setMunitions((prev) => prev.map((m) => (m.id === id ? updated : m)))
    }
  }

  async function handleDeleteMunitionsItem(id: string) {
    if (!confirm('Delete this item?')) return
    await deleteMunitionsItem(id)
    setMunitions((prev) => prev.filter((m) => m.id !== id))
  }

  function startEditMunitionsItem(item: MunitionsItem) {
    setEditingMunitionsItem(item)
    setView('edit')
  }

  async function handleImportMunitions(newItems: NewMunitionsItem[]) {
    const created: MunitionsItem[] = []
    for (const newItem of newItems) {
      created.push(await addMunitionsItem(newItem))
    }
    setMunitions((prev) => [...created, ...prev])
  }

  const hasImport = collection !== 'household'
  const currentCount =
    collection === 'household' ? items.length : collection === 'comics' ? comics.length : munitions.length

  function handleExport() {
    if (collection === 'household') downloadItemsCsv(items)
    else if (collection === 'comics') downloadComicsCsv(comics)
    else downloadMunitionsCsv(munitions)
  }

  function renderMain() {
    if (!loaded) {
      return (
        <div className="empty-state">
          <p>Loading...</p>
        </div>
      )
    }

    if (collection === 'household') {
      if (view === 'list') {
        return <InventoryList items={items} onAdjust={handleAdjust} onEdit={startEdit} onDelete={handleDelete} />
      }
      if (view === 'add') {
        return (
          <ItemForm rooms={rooms} itemNames={itemNames} onSubmit={handleAdd} onCancel={() => setView('list')} />
        )
      }
      if (view === 'edit' && editingItem) {
        return (
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
        )
      }
      return <Dashboard items={items} />
    }

    if (collection === 'comics') {
      if (view === 'list') {
        return <ComicList comics={comics} onEdit={startEditComic} onDelete={handleDeleteComic} />
      }
      if (view === 'import') {
        return <ComicImport onImport={handleImportComics} onCancel={() => setView('list')} />
      }
      if (view === 'add') {
        return <ComicForm locations={comicLocations} onSubmit={handleAddComic} onCancel={() => setView('list')} />
      }
      if (view === 'edit' && editingComic) {
        return (
          <ComicForm
            locations={comicLocations}
            initial={editingComic}
            onSubmit={handleUpdateComic}
            onCancel={() => {
              setEditingComic(null)
              setView('list')
            }}
          />
        )
      }
      return <ComicDashboard comics={comics} />
    }

    if (view === 'list') {
      return (
        <MunitionsList
          items={munitions}
          onAdjust={handleAdjustMunitions}
          onEdit={startEditMunitionsItem}
          onDelete={handleDeleteMunitionsItem}
        />
      )
    }
    if (view === 'import') {
      return <MunitionsImport onImport={handleImportMunitions} onCancel={() => setView('list')} />
    }
    if (view === 'add') {
      return (
        <MunitionsForm
          locations={munitionsLocations}
          onSubmit={handleAddMunitionsItem}
          onCancel={() => setView('list')}
        />
      )
    }
    if (view === 'edit' && editingMunitionsItem) {
      return (
        <MunitionsForm
          locations={munitionsLocations}
          initial={editingMunitionsItem}
          onSubmit={handleUpdateMunitionsItem}
          onCancel={() => {
            setEditingMunitionsItem(null)
            setView('list')
          }}
        />
      )
    }
    return <MunitionsDashboard items={munitions} />
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-top">
          <h1>{COLLECTION_TITLES[collection]}</h1>
          <div className="header-actions">
            {hasImport && (
              <button type="button" className="export-btn" onClick={() => setView('import')}>
                Import CSV
              </button>
            )}
            <button type="button" className="export-btn" onClick={handleExport} disabled={currentCount === 0}>
              Export CSV
            </button>
          </div>
        </div>
        <div className="collection-switcher">
          {(Object.keys(COLLECTION_LABELS) as Collection[]).map((key) => (
            <button
              key={key}
              type="button"
              className={collection === key ? 'active' : ''}
              onClick={() => switchCollection(key)}
            >
              {COLLECTION_LABELS[key]}
            </button>
          ))}
        </div>
      </header>

      <main className="app-main">{renderMain()}</main>

      <nav className="bottom-nav">
        <button type="button" className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>
          {collection === 'household' ? 'Inventory' : COLLECTION_LABELS[collection]}
        </button>
        <button type="button" className={view === 'add' ? 'active' : ''} onClick={() => setView('add')}>
          Add {collection === 'household' ? 'Item' : collection === 'comics' ? 'Comic' : 'Item'}
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
