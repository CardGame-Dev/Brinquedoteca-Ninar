"use client"

import { ItemCard } from "./item-card"
import { mockItems } from "@/lib/mock-data"

export function ItemGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {mockItems.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  )
}
