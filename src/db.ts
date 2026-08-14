import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { Comic, Item, MunitionsItem, NewComic, NewItem, NewMunitionsItem } from './types'

interface InventoryDB extends DBSchema {
  items: {
    key: string
    value: Item
    indexes: { room: string }
  }
  comics: {
    key: string
    value: Comic
  }
  munitions: {
    key: string
    value: MunitionsItem
  }
}

let dbPromise: Promise<IDBPDatabase<InventoryDB>> | null = null

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<InventoryDB>('inventory-db', 3, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          const store = db.createObjectStore('items', { keyPath: 'id' })
          store.createIndex('room', 'room')
        }
        if (oldVersion < 2) {
          db.createObjectStore('comics', { keyPath: 'id' })
        }
        if (oldVersion < 3) {
          db.createObjectStore('munitions', { keyPath: 'id' })
        }
      },
    })
  }
  return dbPromise
}

export async function getAllItems(): Promise<Item[]> {
  const db = await getDB()
  const items = await db.getAll('items')
  return items.sort((a, b) => b.updatedAt - a.updatedAt)
}

export async function addItem(item: NewItem): Promise<Item> {
  const db = await getDB()
  const now = Date.now()
  const full: Item = {
    ...item,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  }
  await db.put('items', full)
  return full
}

export async function updateItem(item: Item): Promise<void> {
  const db = await getDB()
  await db.put('items', { ...item, updatedAt: Date.now() })
}

export async function deleteItem(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('items', id)
}

export async function adjustQuantity(id: string, delta: number): Promise<Item | undefined> {
  const db = await getDB()
  const item = await db.get('items', id)
  if (!item) return undefined
  const updated: Item = {
    ...item,
    quantity: Math.max(0, item.quantity + delta),
    updatedAt: Date.now(),
  }
  await db.put('items', updated)
  return updated
}

export async function getAllComics(): Promise<Comic[]> {
  const db = await getDB()
  const comics = await db.getAll('comics')
  return comics.sort((a, b) => b.updatedAt - a.updatedAt)
}

export async function addComic(comic: NewComic): Promise<Comic> {
  const db = await getDB()
  const now = Date.now()
  const full: Comic = {
    ...comic,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  }
  await db.put('comics', full)
  return full
}

export async function updateComic(comic: Comic): Promise<void> {
  const db = await getDB()
  await db.put('comics', { ...comic, updatedAt: Date.now() })
}

export async function deleteComic(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('comics', id)
}

export async function getAllMunitions(): Promise<MunitionsItem[]> {
  const db = await getDB()
  const munitions = await db.getAll('munitions')
  return munitions.sort((a, b) => b.updatedAt - a.updatedAt)
}

export async function addMunitionsItem(item: NewMunitionsItem): Promise<MunitionsItem> {
  const db = await getDB()
  const now = Date.now()
  const full: MunitionsItem = {
    ...item,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  }
  await db.put('munitions', full)
  return full
}

export async function updateMunitionsItem(item: MunitionsItem): Promise<void> {
  const db = await getDB()
  await db.put('munitions', { ...item, updatedAt: Date.now() })
}

export async function deleteMunitionsItem(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('munitions', id)
}

export async function adjustMunitionsQuantity(id: string, delta: number): Promise<MunitionsItem | undefined> {
  const db = await getDB()
  const item = await db.get('munitions', id)
  if (!item) return undefined
  const updated: MunitionsItem = {
    ...item,
    quantity: Math.max(0, item.quantity + delta),
    updatedAt: Date.now(),
  }
  await db.put('munitions', updated)
  return updated
}
