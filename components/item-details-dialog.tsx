"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, User } from "lucide-react"
import type { Item } from "@/lib/types"

interface ItemDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: Item | null
}

const statusConfig = {
  available: { label: "Disponível", variant: "default" as const, color: "bg-green-500" },
  in_use: { label: "Em Uso", variant: "secondary" as const, color: "bg-blue-500" },
  overdue: { label: "Em Atraso", variant: "destructive" as const, color: "bg-red-500" },
  in_process: { label: "Em Processo", variant: "outline" as const, color: "bg-yellow-500" },
  reserved: { label: "Reservado", variant: "outline" as const, color: "bg-purple-500" },
}

// Mock data for demonstration
const mockMovements = [
  {
    id: "1",
    action: "checkout",
    userName: "João Silva",
    date: "2024-01-20T10:00:00Z",
    condition: "normal",
  },
  {
    id: "2",
    action: "return",
    userName: "João Silva",
    date: "2024-01-20T14:30:00Z",
    condition: "normal",
  },
]

const mockReservations = [
  {
    id: "1",
    userName: "Maria Santos",
    startTime: "2024-01-25T09:00:00Z",
    endTime: "2024-01-25T13:00:00Z",
    status: "active",
  },
]

export function ItemDetailsDialog({ open, onOpenChange, item }: ItemDetailsDialogProps) {
  if (!item) return null

  const status = statusConfig[item.status]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Brinquedo</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Item Info */}
          <div className="flex gap-4">
            <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
              {item.imageUrl ? (
                <img src={item.imageUrl || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <span className="text-2xl">🧸</span>
                </div>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <Badge variant={status.variant}>{status.label}</Badge>
              <p className="text-sm text-muted-foreground">Categoria: {item.category}</p>
              <p className="text-sm">{item.description}</p>
            </div>
          </div>

          <Separator />

          {/* Usage History */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Histórico de Utilização</h4>
              <Button variant="link" size="sm" className="p-0 h-auto">
                Mostrar detalhes
              </Button>
            </div>
            <div className="space-y-2">
              {mockMovements.slice(0, 3).map((movement) => (
                <div key={movement.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div className="w-8 h-8 bg-background rounded-full flex items-center justify-center">
                    {movement.action === "checkout" ? <User className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {movement.action === "checkout" ? "Retirado por" : "Devolvido por"} {movement.userName}
                    </p>
                    <p className="text-xs text-muted-foreground">{new Date(movement.date).toLocaleString("pt-BR")}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {movement.condition === "normal" ? "Normal" : "Defeito"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Related Reservations */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Reservas Relacionadas</h4>
              <Button variant="link" size="sm" className="p-0 h-auto">
                Mostrar detalhes
              </Button>
            </div>
            <div className="space-y-2">
              {mockReservations.map((reservation) => (
                <div key={reservation.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div className="w-8 h-8 bg-background rounded-full flex items-center justify-center">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Reservado por {reservation.userName}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(reservation.startTime).toLocaleString("pt-BR")} -{" "}
                      {new Date(reservation.endTime).toLocaleString("pt-BR")}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {reservation.status === "active" ? "Ativa" : "Concluída"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
