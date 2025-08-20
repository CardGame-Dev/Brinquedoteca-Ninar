"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Clock } from "lucide-react"
import { mockItems } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"

interface ReserveItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  preselectedItemId?: string
}

export function ReserveItemDialog({ open, onOpenChange, preselectedItemId }: ReserveItemDialogProps) {
  const { user } = useAuth()
  const [selectedItemId, setSelectedItemId] = useState(preselectedItemId || "")
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Calculate end time automatically (start time + 4 hours)
  const calculateEndTime = (startTimeValue: string) => {
    if (!startTimeValue) return ""

    const [hours, minutes] = startTimeValue.split(":").map(Number)
    const startDate = new Date()
    startDate.setHours(hours, minutes, 0, 0)

    const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000) // Add 4 hours

    return `${endDate.getHours().toString().padStart(2, "0")}:${endDate.getMinutes().toString().padStart(2, "0")}`
  }

  const handleStartTimeChange = (value: string) => {
    setStartTime(value)
    setEndTime(calculateEndTime(value))
  }

  const checkReservationConflict = (
    itemId: string,
    selectedDate: string,
    selectedStartTime: string,
    selectedEndTime: string,
  ) => {
    // Mock conflict check - in real app, this would be an API call
    const mockReservations = [
      {
        itemId: "2",
        date: "2024-01-25",
        startTime: "10:00",
        endTime: "14:00",
      },
    ]

    return mockReservations.some(
      (reservation) =>
        reservation.itemId === itemId &&
        reservation.date === selectedDate &&
        ((selectedStartTime >= reservation.startTime && selectedStartTime < reservation.endTime) ||
          (selectedEndTime > reservation.startTime && selectedEndTime <= reservation.endTime) ||
          (selectedStartTime <= reservation.startTime && selectedEndTime >= reservation.endTime)),
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!selectedItemId || !date || !startTime) {
      setError("Por favor, preencha todos os campos obrigatórios")
      setIsLoading(false)
      return
    }

    // Check for conflicts
    const hasConflict = checkReservationConflict(selectedItemId, date, startTime, endTime)
    if (hasConflict) {
      setError("O item não está disponível para o horário selecionado. Tente outro horário.")
      setIsLoading(false)
      return
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("Criando reserva:", {
      itemId: selectedItemId,
      userId: user?.id,
      date,
      startTime,
      endTime,
    })

    // Reset form
    setSelectedItemId("")
    setDate("")
    setStartTime("")
    setEndTime("")
    setError("")
    setIsLoading(false)
    onOpenChange(false)
  }

  const availableItems = mockItems.filter((item) => item.status === "available")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Reservar Item</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="item">Item para Reserva *</Label>
            <Select value={selectedItemId} onValueChange={setSelectedItemId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um item" />
              </SelectTrigger>
              <SelectContent>
                {availableItems.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name} - {item.category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Data da Reserva *</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="start-time">Horário de Retirada *</Label>
            <Input
              id="start-time"
              type="time"
              value={startTime}
              onChange={(e) => handleStartTimeChange(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-time">Horário de Devolução</Label>
            <Input id="end-time" type="time" value={endTime} readOnly className="bg-muted" />
            <p className="text-xs text-muted-foreground">Calculado automaticamente (horário de retirada + 4 horas)</p>
          </div>

          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <span className="font-medium">Importante:</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              O brinquedo deve ser devolvido até o horário limite. Após 10 minutos de tolerância, o status será alterado
              para "Atrasado".
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading || !selectedItemId || !date || !startTime}>
              {isLoading ? "Reservando..." : "Reservar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
