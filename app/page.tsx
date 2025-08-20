"use client"

import { useAuth } from "@/lib/auth-context"
import { LoginPage } from "@/components/login-page"
import { LibraryHeader } from "@/components/library-header"
import { ItemGrid } from "@/components/item-grid"
import { SideMenu } from "@/components/side-menu"
import { AddItemButton } from "@/components/add-item-button"

export default function HomePage() {
  const { user, isLoading } = useAuth()

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
      <SideMenu />
      <div className="flex flex-col">
        <LibraryHeader />
        <main className="flex-1 p-4 md:p-6">
          <ItemGrid />
        </main>
        <AddItemButton />
      </div>
    </div>
  )
}
