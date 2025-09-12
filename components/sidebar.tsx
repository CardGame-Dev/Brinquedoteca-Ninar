"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Library, Calendar, Clock, BookOpen, X, Briefcase } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

const navigation = [
  {
    name: "Biblioteca",
    href: "/",
    icon: Library,
  },
  {
    name: "Calendário",
    href: "/calendar",
    icon: Calendar,
  },
  {
    name: "Reservas Agendadas",
    href: "/reservations",
    icon: Clock,
  },
  {
    name: "Manual de Instruções",
    href: "/manual",
    icon: BookOpen,
  },
]

export function Sidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { isAdminMaster } = useAuth() || { isAdminMaster: false }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Brinquedoteca</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setOpen(false)}
          className="md:hidden"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              </li>
            )
          })}
          {/* Exibe os links de gerenciamento apenas para adminMaster */}
          {isAdminMaster && (
            <>
              <li>
                <Link
                  href="/usermanagement"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname === "/usermanagement"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  <BookOpen className="h-4 w-4" />
                  Gerenciamento de Usuários
                </Link>
              </li>
              <li>
                <Link
                  href="/cargomanagement"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname === "/cargomanagement"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  <Briefcase className="h-4 w-4" />
                  Gerenciamento de Cargos
                </Link>
              </li>
              <li>
                <Link
                  href="/citiemanagement"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname === "/citiemanagement"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  <Briefcase className="h-4 w-4" />
                  Gerenciamento de Cidades
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  )

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-background border-r">
        <SidebarContent />
      </div>
    </>
  )
}