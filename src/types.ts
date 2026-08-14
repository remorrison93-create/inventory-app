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

export interface CustomField {
  key: string
  value: string
}

export interface Comic {
  id: string
  title: string
  issueNumber: string
  publisher: string
  condition: string
  value: number
  notes: string
  photos: Blob[]
  customFields: CustomField[]
  createdAt: number
  updatedAt: number
}

export type NewComic = Omit<Comic, 'id' | 'createdAt' | 'updatedAt'>
