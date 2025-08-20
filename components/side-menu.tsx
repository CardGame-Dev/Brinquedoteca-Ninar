"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Calendar, Clock, Info, BarChart3 } from "lucide-react"
import { ScheduledReservations } from "./scheduled-reservations"
import { CalendarView } from "./calendar-view"
import { UserDashboard } from "./user-dashboard"

export function SideMenu() {
  const [open, setOpen] = useState(false)
  const [currentView, setCurrentView] = useState<"menu" | "dashboard" | "calendar" | "reservations" | "about">("menu")

  const handleNavigation = (view: "menu" | "dashboard" | "calendar" | "reservations" | "about") => {
    setCurrentView(view)
  }

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <UserDashboard />
      case "calendar":
        return <CalendarView />
      case "reservations":
        return <ScheduledReservations />
      case "about":
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Sobre o Sistema</h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                O Sistema de Controle de Estoque da Brinquedoteca foi desenvolvido para facilitar o gerenciamento e
                empréstimo de brinquedos educativos.
              </p>
              <p>
                <strong>Funcionalidades principais:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Controle de estoque de brinquedos</li>
                <li>Sistema de reservas com calendário</li>
                <li>Histórico de movimentações</li>
                <li>Registro fotográfico de condições</li>
                <li>Diferentes níveis de usuário</li>
              </ul>
              <p>
                Desenvolvido com foco na responsividade, funcionando perfeitamente em dispositivos móveis e desktop.
              </p>
            </div>
          </div>
        )
      default:
        return (
          <div className="flex flex-col gap-4 mt-8">
            <h2 className="text-lg font-semibold">Menu</h2>

            <nav className="flex flex-col gap-2">
              <Button variant="ghost" className="justify-start" onClick={() => handleNavigation("dashboard")}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Dashboard
              </Button>

              <Button variant="ghost" className="justify-start" onClick={() => handleNavigation("calendar")}>
                <Calendar className="h-4 w-4 mr-2" />
                Calendário
              </Button>

              <Button variant="ghost" className="justify-start" onClick={() => handleNavigation("reservations")}>
                <Clock className="h-4 w-4 mr-2" />
                Reservas Agendadas
              </Button>

              <Button variant="ghost" className="justify-start" onClick={() => handleNavigation("about")}>
                <Info className="h-4 w-4 mr-2" />
                Sobre
              </Button>
            </nav>
          </div>
        )
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-80">
        {currentView !== "menu" && (
          <Button variant="ghost" size="sm" onClick={() => handleNavigation("menu")} className="mb-4">
            ← Voltar ao Menu
          </Button>
        )}
        {renderContent()}
      </SheetContent>
    </Sheet>
  )
}
