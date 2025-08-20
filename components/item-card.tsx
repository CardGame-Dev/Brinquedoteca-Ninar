"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, RotateCcw, Edit, Trash2, Eye, Calendar } from "lucide-react"
import type { Item } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"
import { useState } from "react"
import { UseItemDialog } from "./use-item-dialog"
import { ReturnItemDialog } from "./return-item-dialog"
import { ItemDetailsDialog } from "./item-details-dialog"
import { AddItemDialog } from "./add-item-dialog"
import { ReserveItemDialog } from "./reserve-item-dialog"

interface ItemCardProps {
  item: Item
}

const statusConfig = {
  available: { label: "Disponível", variant: "default" as const, color: "bg-green-500" },
  in_use: { label: "Em Uso", variant: "secondary" as const, color: "bg-blue-500" },
  overdue: { label: "Em Atraso", variant: "destructive" as const, color: "bg-red-500" },
  in_process: { label: "Em Processo", variant: "outline" as const, color: "bg-yellow-500" },
  reserved: { label: "Reservado", variant: "outline" as const, color: "bg-purple-500" },
}

export function ItemCard({ item }: ItemCardProps) {
  const status = statusConfig[item.status]
  const { user, isAdmin } = useAuth()
  const isCurrentUserUsing = item.currentUserId === user?.id

  const [showUseDialog, setShowUseDialog] = useState(false)
  const [showReturnDialog, setShowReturnDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showReserveDialog, setShowReserveDialog] = useState(false)

  const handleDelete = () => {
    if (confirm("Tem certeza que deseja excluir este brinquedo?")) {
      console.log("Excluindo item:", item.id)
    }
  }

  return (
    <>
      <Card className="group hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-4">
          <div
            className="aspect-square bg-muted rounded-lg mb-3 overflow-hidden cursor-pointer"
            onClick={() => setShowDetailsDialog(true)}
          >
            {item.imageUrl ? (
              <img src={item.imageUrl || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <span className="text-4xl">🧸</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3
                className="font-semibold text-sm leading-tight line-clamp-2 cursor-pointer hover:text-primary"
                onClick={() => setShowDetailsDialog(true)}
              >
                {item.name}
              </h3>
              <div className={`w-3 h-3 rounded-full ${status.color} flex-shrink-0 mt-0.5`} />
            </div>

            <p className="text-xs text-muted-foreground line-clamp-1">{item.category}</p>

            <Badge variant={status.variant} className="text-xs">
              {status.label}
            </Badge>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex gap-2">
          {item.status === "available" && (
            <>
              <Button size="sm" className="flex-1" onClick={() => setShowUseDialog(true)}>
                <Play className="h-3 w-3 mr-1" />
                Usar
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="px-2 bg-transparent"
                onClick={() => setShowReserveDialog(true)}
              >
                <Calendar className="h-3 w-3" />
              </Button>
            </>
          )}

          {isCurrentUserUsing && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => setShowReturnDialog(true)}
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Devolver
            </Button>
          )}

          <Button size="sm" variant="ghost" className="px-2" onClick={() => setShowDetailsDialog(true)}>
            <Eye className="h-3 w-3" />
          </Button>

          {isAdmin && (
            <>
              <Button size="sm" variant="ghost" className="px-2" onClick={() => setShowEditDialog(true)}>
                <Edit className="h-3 w-3" />
              </Button>

              <Button
                size="sm"
                variant="ghost"
                className="px-2 text-destructive hover:text-destructive"
                onClick={handleDelete}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </>
          )}
        </CardFooter>
      </Card>

      <UseItemDialog open={showUseDialog} onOpenChange={setShowUseDialog} item={item} />
      <ReturnItemDialog open={showReturnDialog} onOpenChange={setShowReturnDialog} item={item} />
      <ItemDetailsDialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog} item={item} />
      <AddItemDialog open={showEditDialog} onOpenChange={setShowEditDialog} />
      <ReserveItemDialog open={showReserveDialog} onOpenChange={setShowReserveDialog} preselectedItemId={item.id} />
    </>
  )
}
