"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Trash2, Play } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useState } from "react"
import { UseItemDialog } from "./use-item-dialog"
import { mockItems } from "@/lib/mock-data"

// Mock reservations data
const mockReservations = [
  {
    id: "1",
    itemId: "1",
    itemName: "Quebra-cabeça 1000 peças",
    itemCategory: "Jogos de Tabuleiro",
    userId: "user-1",
    date: "2024-01-25",
    startTime: "09:00",
    endTime: "13:00",
    status: "active",
  },
  {
    id: "2",
    itemId: "3",
    itemName: "Boneca Barbie",
    itemCategory: "Bonecas e Bonecos",
    userId: "user-1",
    date: "2024-01-26",
    startTime: "14:00",
    endTime: "18:00",
    status: "active",
  },
]

export function ScheduledReservations() {
  const { user } = useAuth()
  const [showUseDialog, setShowUseDialog] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  const userReservations = mockReservations.filter((reservation) => reservation.userId === user?.id)

  const handleCancelReservation = (reservationId: string) => {
    if (confirm("Tem certeza que deseja cancelar esta reserva?")) {
      console.log("Cancelando reserva:", reservationId)
    }
  }

  const handleUseReservedItem = (reservation: any) => {
    const item = mockItems.find((item) => item.id === reservation.itemId)
    if (item) {
      setSelectedItem(item)
      setShowUseDialog(true)
    }
  }

  const isReservationActive = (date: string, startTime: string, endTime: string) => {
    const now = new Date()
    const reservationStart = new Date(`${date}T${startTime}:00`)
    const reservationEnd = new Date(`${date}T${endTime}:00`)

    return now >= reservationStart && now <= reservationEnd
  }

  if (userReservations.length === 0) {
    return (
      <div className="p-6 text-center">
        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Nenhuma reserva agendada</h3>
        <p className="text-muted-foreground">Você não possui reservas ativas no momento.</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4 p-4">
        <h2 className="text-xl font-semibold">Minhas Reservas Agendadas</h2>

        <div className="space-y-3">
          {userReservations.map((reservation) => {
            const isActive = isReservationActive(reservation.date, reservation.startTime, reservation.endTime)

            return (
              <Card key={reservation.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{reservation.itemName}</CardTitle>
                      <p className="text-sm text-muted-foreground">{reservation.itemCategory}</p>
                    </div>
                    <Badge variant={isActive ? "default" : "outline"}>{isActive ? "Ativa" : "Agendada"}</Badge>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(reservation.date).toLocaleDateString("pt-BR")}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {reservation.startTime} - {reservation.endTime}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {isActive && (
                      <Button size="sm" className="flex-1" onClick={() => handleUseReservedItem(reservation)}>
                        <Play className="h-3 w-3 mr-1" />
                        Usar Item
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-transparent"
                      onClick={() => handleCancelReservation(reservation.id)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <UseItemDialog open={showUseDialog} onOpenChange={setShowUseDialog} item={selectedItem} />
    </>
  )
}
