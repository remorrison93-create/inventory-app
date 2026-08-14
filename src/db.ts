import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { Item, NewItem } from './types'

interface InventoryDB extends DBSchema {
  items: {
    key: string
    value: Item
    indexes: { room: string }
  }
}

let dbPromise: Promise<IDBPDatabase<InventoryDB>> | null = null

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<InventoryDB>('inventory-db', 1, {
      upgrade(db) {
        const store = db.createObjectStore('items', { keyPath: 'id' })
        store.createIndex('room', 'room')
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
