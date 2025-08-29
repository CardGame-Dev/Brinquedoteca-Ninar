"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, RotateCcw, Edit, Trash2, Eye, Calendar, ArrowDownCircle } from "lucide-react";
import type { Item } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";
import { UseItemDialog } from "./use-item-dialog";
import { ReturnItemDialog } from "./return-item-dialog";
import { ItemDetailsDialog } from "./item-details-dialog";
import { AddItemDialog } from "./add-item-dialog";
import { ReserveItemDialog } from "./reserve-item-dialog";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { supabase } from "@/lib/supabase/client";
import { statusConfig } from "@/lib/item-status";

interface ItemCardProps {
  item: Item;
  onItemChanged?: () => Promise<void>;
}

export function ItemCard({ item, onItemChanged }: ItemCardProps) {
  const status = statusConfig[item.status] || { label: "Desconhecido", variant: "default", color: "bg-gray-500" };
  const { user, isAdmin } = useAuth() || { user: null, isAdmin: false };
  const isCurrentUserUsing = item.user_id && user?.id ? item.user_id === user.id : false;

  const [showUseDialog, setShowUseDialog] = useState(false);
  const [showReturnDialog, setShowReturnDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showReserveDialog, setShowReserveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = async () => {
    // Aqui faz a exclusão no Supabase
    await supabase.from("items").delete().eq("id", item.id);
    setShowDeleteDialog(false);
    if (onItemChanged) await onItemChanged();
  };

  return (
    <>
      <Card className="group hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-4">
          <div
            className="aspect-square bg-muted rounded-lg mb-3 overflow-hidden cursor-pointer"
            onClick={() => setShowDetailsDialog(true)}
          >
            {item.image_url ? (
              <img
                src={item.image_url || "/placeholder.svg"} // Use a URL salva ou um placeholder
                alt={item.name}
                className="w-full h-full object-cover"
              />
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

            <Badge variant={status.variant as "default" | "secondary" | "destructive" | "outline"} className="text-xs">
              {status.label}
            </Badge>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex gap-2">
          {item.status === "Disponível" && (
            <>
              <Button
                size="sm"
                className="flex-1 flex items-center justify-center"
                onClick={() => setShowUseDialog(true)}
              >
                <Play className="h-5 w-5" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="px-2 bg-transparent flex-1 flex items-center justify-center"
                onClick={() => setShowReserveDialog(true)}
              >
                <Calendar className="h-5 w-5" />
              </Button>
            </>
          )}

          {isCurrentUserUsing && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1 bg-transparent flex items-center justify-center"
              onClick={() => setShowReturnDialog(true)}
            >
              <ArrowDownCircle className="h-5 w-5" />
            </Button>
          )}

          <Button
            size="sm"
            variant="ghost"
            className="px-2 flex-1 flex items-center justify-center"
            onClick={() => setShowDetailsDialog(true)}
            title="Visualizar"
          >
            <Eye className="h-5 w-5" />
          </Button>

          {isAdmin && (
            <>
              <Button
                size="sm"
                variant="ghost"
                className="px-2 flex-1 flex items-center justify-center"
                onClick={() => setShowEditDialog(true)}
                title="Editar"
              >
                <Edit className="h-5 w-5" />
              </Button>

              <Button
                size="sm"
                variant="ghost"
                className="px-2 text-destructive hover:text-destructive flex-1 flex items-center justify-center"
                onClick={() => setShowDeleteDialog(true)}
                title="Excluir"
              >
                <Trash2 className="h-5 w-5" />
              </Button>

              <ConfirmDeleteDialog
                open={showDeleteDialog}
                onCancel={() => setShowDeleteDialog(false)}
                onConfirm={handleDelete}
                itemName={item.name}
              />
            </>
          )}
        </CardFooter>
      </Card>

      <UseItemDialog
        open={showUseDialog}
        onOpenChange={setShowUseDialog}
        item={item}
        onItemChanged={onItemChanged}
      />
      <ReturnItemDialog
        open={showReturnDialog}
        onOpenChange={setShowReturnDialog}
        item={item}
        onItemChanged={onItemChanged}
      />
      <ItemDetailsDialog
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
        item={item}
        onItemChanged={onItemChanged}
      />
      <AddItemDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        isEditMode={true}
        itemToEdit={{
          id: item.id,
          name: item.name,
          description: item.description,
          categoryId: item.category_id,
          status: item.status,
          cityId: item.city_id,
          roomId: item.rooms_id,
        }}
        onItemChanged={onItemChanged}
      />
      <ReserveItemDialog open={showReserveDialog} onOpenChange={setShowReserveDialog} preselectedItemId={item.id} />
    </>
  );
}