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
  location: string
  value: number
  notes: string
  photos: Blob[]
  customFields: CustomField[]
  createdAt: number
  updatedAt: number
}

export type NewComic = Omit<Comic, 'id' | 'createdAt' | 'updatedAt'>

export type MunitionsType = 'Ammunition' | 'Accessory'

export interface MunitionsItem {
  id: string
  itemType: MunitionsType
  name: string
  manufacturer: string
  caliber: string
  category: string
  bulletWeightGr: number | null
  bulletType: string
  roundsPerBox: number | null
  quantity: number
  lowStockThreshold: number
  location: string
  condition: string
  notes: string
  photos: Blob[]
  customFields: CustomField[]
  createdAt: number
  updatedAt: number
}

export type NewMunitionsItem = Omit<MunitionsItem, 'id' | 'createdAt' | 'updatedAt'>
