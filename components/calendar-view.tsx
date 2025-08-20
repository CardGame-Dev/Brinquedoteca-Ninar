"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Plus, CalendarIcon, Clock } from "lucide-react"
import { ReserveItemDialog } from "./reserve-item-dialog"

type ViewMode = "day" | "week" | "month"

// Mock reservations data for calendar
const mockCalendarReservations = [
  {
    id: "1",
    itemName: "Quebra-cabeça 1000 peças",
    userName: "João Silva",
    date: "2024-01-25",
    startTime: "09:00",
    endTime: "13:00",
    status: "active",
  },
  {
    id: "2",
    itemName: "Lego Classic",
    userName: "Maria Santos",
    date: "2024-01-25",
    startTime: "14:00",
    endTime: "18:00",
    status: "active",
  },
  {
    id: "3",
    itemName: "Boneca Barbie",
    userName: "Ana Costa",
    date: "2024-01-26",
    startTime: "10:00",
    endTime: "14:00",
    status: "active",
  },
  {
    id: "4",
    itemName: "Carrinho Hot Wheels",
    userName: "Pedro Lima",
    date: "2024-01-27",
    startTime: "15:00",
    endTime: "19:00",
    status: "active",
  },
]

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<ViewMode>("month")
  const [showReserveDialog, setShowReserveDialog] = useState(false)

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)

    switch (viewMode) {
      case "day":
        newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1))
        break
      case "week":
        newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7))
        break
      case "month":
        newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1))
        break
    }

    setCurrentDate(newDate)
  }

  const getReservationsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return mockCalendarReservations.filter((reservation) => reservation.date === dateStr)
  }

  const formatDateHeader = () => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
    }

    switch (viewMode) {
      case "day":
        return currentDate.toLocaleDateString("pt-BR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      case "week":
        const weekStart = new Date(currentDate)
        weekStart.setDate(currentDate.getDate() - currentDate.getDay())
        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 6)
        return `${weekStart.toLocaleDateString("pt-BR", { day: "numeric", month: "short" })} - ${weekEnd.toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" })}`
      case "month":
        return currentDate.toLocaleDateString("pt-BR", options)
    }
  }

  const renderDayView = () => {
    const reservations = getReservationsForDate(currentDate)

    return (
      <div className="space-y-4">
        <div className="text-center p-4 bg-muted rounded-lg">
          <h3 className="text-lg font-semibold">{formatDateHeader()}</h3>
        </div>

        {reservations.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            <CalendarIcon className="h-12 w-12 mx-auto mb-4" />
            <p>Nenhuma reserva para este dia</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reservations.map((reservation) => (
              <Card key={reservation.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{reservation.itemName}</h4>
                      <p className="text-sm text-muted-foreground">{reservation.userName}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3" />
                        {reservation.startTime} - {reservation.endTime}
                      </div>
                    </div>
                    <Badge variant="outline">Ativa</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderWeekView = () => {
    const weekStart = new Date(currentDate)
    weekStart.setDate(currentDate.getDate() - currentDate.getDay())

    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(weekStart)
      day.setDate(weekStart.getDate() + i)
      return day
    })

    return (
      <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
        {weekDays.map((day, index) => {
          const reservations = getReservationsForDate(day)
          const isToday = day.toDateString() === new Date().toDateString()

          return (
            <Card key={index} className={isToday ? "ring-2 ring-primary" : ""}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-center">
                  <div className="font-medium">{day.toLocaleDateString("pt-BR", { weekday: "short" })}</div>
                  <div className={`text-lg ${isToday ? "text-primary font-bold" : ""}`}>{day.getDate()}</div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-1">
                  {reservations.slice(0, 3).map((reservation) => (
                    <div key={reservation.id} className="text-xs p-1 bg-primary/10 rounded text-primary">
                      {reservation.startTime} {reservation.itemName.substring(0, 15)}...
                    </div>
                  ))}
                  {reservations.length > 3 && (
                    <div className="text-xs text-muted-foreground">+{reservations.length - 3} mais</div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

  const renderMonthView = () => {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    const startDate = new Date(monthStart)
    startDate.setDate(startDate.getDate() - monthStart.getDay())

    const days = []
    const date = new Date(startDate)

    while (date <= monthEnd || days.length < 42) {
      days.push(new Date(date))
      date.setDate(date.getDate() + 1)
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}

        {days.map((day, index) => {
          const reservations = getReservationsForDate(day)
          const isCurrentMonth = day.getMonth() === currentDate.getMonth()
          const isToday = day.toDateString() === new Date().toDateString()

          return (
            <Card
              key={index}
              className={`min-h-[80px] ${!isCurrentMonth ? "opacity-50" : ""} ${isToday ? "ring-2 ring-primary" : ""}`}
            >
              <CardContent className="p-2">
                <div className={`text-sm font-medium mb-1 ${isToday ? "text-primary" : ""}`}>{day.getDate()}</div>
                <div className="space-y-1">
                  {reservations.slice(0, 2).map((reservation) => (
                    <div key={reservation.id} className="text-xs p-1 bg-primary/10 rounded text-primary">
                      {reservation.itemName.substring(0, 10)}...
                    </div>
                  ))}
                  {reservations.length > 2 && (
                    <div className="text-xs text-muted-foreground">+{reservations.length - 2}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

  const renderCalendarContent = () => {
    switch (viewMode) {
      case "day":
        return renderDayView()
      case "week":
        return renderWeekView()
      case "month":
        return renderMonthView()
    }
  }

  return (
    <>
      <div className="space-y-4 p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Calendário</h2>
          <Button variant="outline" size="sm" onClick={goToToday} className="bg-transparent text-primary">
            Hoje
          </Button>
        </div>

        {/* Navigation and View Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigateDate("prev")} className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => navigateDate("next")} className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
            <h3 className="text-lg font-medium ml-2">{formatDateHeader()}</h3>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant={viewMode === "day" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("day")}
              className={viewMode !== "day" ? "bg-transparent" : ""}
            >
              Dia
            </Button>
            <Button
              variant={viewMode === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("week")}
              className={viewMode !== "week" ? "bg-transparent" : ""}
            >
              Semana
            </Button>
            <Button
              variant={viewMode === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("month")}
              className={viewMode !== "month" ? "bg-transparent" : ""}
            >
              Mês
            </Button>
          </div>
        </div>

        {/* Calendar Content */}
        <div className="min-h-[400px]">{renderCalendarContent()}</div>

        {/* Add Reservation Button */}
        <Button
          onClick={() => setShowReserveDialog(true)}
          size="lg"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow z-40"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      <ReserveItemDialog open={showReserveDialog} onOpenChange={setShowReserveDialog} />
    </>
  )
}
