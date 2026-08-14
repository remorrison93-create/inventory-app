export interface Item {
  id: string
  name: string
  room: string
  quantity: number
  lowStockThreshold: number
  photo: Blob | null
  createdAt: number
  updatedAt: number
}

export type NewItem = Omit<Item, 'id' | 'createdAt' | 'updatedAt'>
