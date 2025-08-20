"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart3,
  Calendar,
  Clock,
  Package,
  Play,
  RotateCcw,
  TrendingUp,
  Users,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useState } from "react"
import { ReserveItemDialog } from "./reserve-item-dialog"
import { mockItems } from "@/lib/mock-data"

// Mock data for dashboard
const mockUserStats = {
  itemsInUse: 2,
  activeReservations: 3,
  totalUsage: 15,
  overdueItems: 0,
}

const mockAdminStats = {
  totalItems: 25,
  availableItems: 18,
  itemsInUse: 5,
  overdueItems: 2,
  totalUsers: 12,
  activeReservations: 8,
}

const mockUserActivity = [
  {
    id: "1",
    action: "checkout",
    itemName: "Lego Classic",
    date: "2024-01-20T10:00:00Z",
    status: "active",
  },
  {
    id: "2",
    action: "return",
    itemName: "Quebra-cabeça 1000 peças",
    date: "2024-01-19T15:30:00Z",
    status: "completed",
  },
  {
    id: "3",
    action: "reservation",
    itemName: "Boneca Barbie",
    date: "2024-01-25T09:00:00Z",
    status: "scheduled",
  },
]

const mockUpcomingReservations = [
  {
    id: "1",
    itemName: "Quebra-cabeça 1000 peças",
    date: "2024-01-25",
    startTime: "09:00",
    endTime: "13:00",
  },
  {
    id: "2",
    itemName: "Boneca Barbie",
    date: "2024-01-26",
    startTime: "14:00",
    endTime: "18:00",
  },
]

export function UserDashboard() {
  const { user, isAdmin } = useAuth()
  const [showReserveDialog, setShowReserveDialog] = useState(false)

  const userItemsInUse = mockItems.filter((item) => item.currentUserId === user?.id)

  const renderUserStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{mockUserStats.itemsInUse}</p>
              <p className="text-xs text-muted-foreground">Em Uso</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{mockUserStats.activeReservations}</p>
              <p className="text-xs text-muted-foreground">Reservas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-purple-500" />
            <div>
              <p className="text-2xl font-bold">{mockUserStats.totalUsage}</p>
              <p className="text-xs text-muted-foreground">Total Usado</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <div>
              <p className="text-2xl font-bold">{mockUserStats.overdueItems}</p>
              <p className="text-xs text-muted-foreground">Em Atraso</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderAdminStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{mockAdminStats.totalItems}</p>
              <p className="text-xs text-muted-foreground">Total Itens</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{mockAdminStats.availableItems}</p>
              <p className="text-xs text-muted-foreground">Disponíveis</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Play className="h-4 w-4 text-orange-500" />
            <div>
              <p className="text-2xl font-bold">{mockAdminStats.itemsInUse}</p>
              <p className="text-xs text-muted-foreground">Em Uso</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <div>
              <p className="text-2xl font-bold">{mockAdminStats.overdueItems}</p>
              <p className="text-xs text-muted-foreground">Em Atraso</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-500" />
            <div>
              <p className="text-2xl font-bold">{mockAdminStats.totalUsers}</p>
              <p className="text-xs text-muted-foreground">Usuários</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-cyan-500" />
            <div>
              <p className="text-2xl font-bold">{mockAdminStats.activeReservations}</p>
              <p className="text-xs text-muted-foreground">Reservas Ativas</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <>
      <div className="space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Bem-vindo, {user?.name} {isAdmin && "(Administrador)"}
            </p>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        {/* Statistics */}
        {isAdmin ? renderAdminStats() : renderUserStats()}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button className="h-auto p-4 flex flex-col gap-2" onClick={() => setShowReserveDialog(true)}>
                <Calendar className="h-5 w-5" />
                <span className="text-sm">Nova Reserva</span>
              </Button>

              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2 bg-transparent">
                <BarChart3 className="h-5 w-5" />
                <span className="text-sm">Relatórios</span>
              </Button>

              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2 bg-transparent">
                <Package className="h-5 w-5" />
                <span className="text-sm">Biblioteca</span>
              </Button>

              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2 bg-transparent">
                <Clock className="h-5 w-5" />
                <span className="text-sm">Histórico</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Items in Use */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5" />
                Itens em Uso
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userItemsInUse.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Nenhum item em uso no momento</p>
              ) : (
                <div className="space-y-3">
                  {userItemsInUse.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                      </div>
                      <Button size="sm" variant="outline" className="bg-transparent">
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Devolver
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Reservations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Próximas Reservas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mockUpcomingReservations.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Nenhuma reserva agendada</p>
              ) : (
                <div className="space-y-3">
                  {mockUpcomingReservations.map((reservation) => (
                    <div key={reservation.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <h4 className="font-medium">{reservation.itemName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(reservation.date).toLocaleDateString("pt-BR")} - {reservation.startTime}
                        </p>
                      </div>
                      <Badge variant="outline">Agendada</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockUserActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div className="w-8 h-8 bg-background rounded-full flex items-center justify-center">
                    {activity.action === "checkout" && <Play className="h-4 w-4 text-blue-500" />}
                    {activity.action === "return" && <RotateCcw className="h-4 w-4 text-green-500" />}
                    {activity.action === "reservation" && <Calendar className="h-4 w-4 text-purple-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">
                      {activity.action === "checkout" && "Retirou"}
                      {activity.action === "return" && "Devolveu"}
                      {activity.action === "reservation" && "Reservou"} {activity.itemName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(activity.date).toLocaleDateString("pt-BR")} às{" "}
                      {new Date(activity.date).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <Badge
                    variant={
                      activity.status === "active"
                        ? "default"
                        : activity.status === "completed"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {activity.status === "active" && "Ativo"}
                    {activity.status === "completed" && "Concluído"}
                    {activity.status === "scheduled" && "Agendado"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Admin Analytics */}
        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Análise do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Taxa de Utilização</span>
                  <span>72%</span>
                </div>
                <Progress value={72} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Itens Disponíveis</span>
                  <span>85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Reservas Ativas</span>
                  <span>32%</span>
                </div>
                <Progress value={32} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <ReserveItemDialog open={showReserveDialog} onOpenChange={setShowReserveDialog} />
    </>
  )
}
