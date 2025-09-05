"use client"

import { RotateCcw, Filter, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { FilterDialog } from "./filter-dialog"
import { useAuth } from "@/lib/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface LibraryHeaderProps {
  onSearch?: (term: string) => void
  onApplyFilters?: (filters: any) => void
  showFilterButton?: boolean
  title?: string
}

export function LibraryHeader({
  onSearch,
  onApplyFilters,
  showFilterButton = true,
  title = "Biblioteca",
}: LibraryHeaderProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const { user, profile, logout, isAdmin } = useAuth()

  const handleRefresh = () => {
    window.location.reload()
  }

  useEffect(() => {
    onSearch?.(searchTerm)
  }, [searchTerm])

  return (
    <header className="sticky top-0 z-10 bg-background border-b border-border">
      <div className="flex items-center justify-between p-4 md:p-6">
        <div className="flex items-center gap-4 flex-1">
          <h1 className="text-xl md:text-2xl font-semibold text-foreground">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          {showFilterButton && (
            <Button variant="outline" size="icon" onClick={() => setShowFilters(true)} className="h-9 w-9">
              <Filter className="h-4 w-4" />
            </Button>
          )}

          <Button variant="outline" size="icon" onClick={handleRefresh} className="h-9 w-9 bg-transparent">
            <RotateCcw className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9 bg-transparent">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{profile?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                  <p className="text-xs text-muted-foreground">{isAdmin ? "Administrador" : "Usuário"}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {showFilterButton && (
        <FilterDialog
          open={showFilters}
          onOpenChange={setShowFilters}
          onApplyFilters={onApplyFilters}
        />
      )}
    </header>
  )
}
