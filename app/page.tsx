"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { LoginPage } from "@/components/login-page"
import { Sidebar } from "@/components/sidebar"
import { LibraryHeader } from "@/components/library-header"
import { ItemGrid } from "@/components/item-grid"
import { AddItemButton } from "@/components/add-item-button"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const [filters, setFilters] = useState({})

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:ml-64">
        <LibraryHeader onApplyFilters={setFilters} />
        <main className="p-4 md:p-6">
          <ItemGrid filters={filters} />
        </main>
        <AddItemButton />
      </div>
    </div>
  )
}
