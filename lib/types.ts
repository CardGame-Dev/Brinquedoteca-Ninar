export interface Item {
  id: string
  name: string
  description: string
  category: string
  categoryId: string
  imageUrl?: string
  status: "available" | "in_use" | "overdue" | "in_process" | "reserved"
  currentUserId?: string
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  description: string
}

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user"
}

export interface Movement {
  id: string
  itemId: string
  userId: string
  action: "checkout" | "return"
  condition: "normal" | "defect"
  defectDescription?: string
  photoUrls: string[]
  startedAt: string
  returnedAt?: string
}

export interface Reservation {
  id: string
  itemId: string
  userId: string
  startTime: string
  endTime: string
  status: "active" | "completed" | "cancelled"
  createdAt: string
  updatedAt: string
}
