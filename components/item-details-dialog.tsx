"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase/client";
import type { Item } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { UseItemDialog } from "./use-item-dialog";
import { ReturnItemDialog } from "./return-item-dialog";
import { statusConfig } from "@/lib/item-status";

interface ItemDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Item | null;
  onItemChanged?: () => void | Promise<void>;
}

export function ItemDetailsDialog({ open, onOpenChange, item, onItemChanged }: ItemDetailsDialogProps) {
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [cityName, setCityName] = useState<string | null>(null);
  const [roomName, setRoomName] = useState<string | null>(null);
  const [showUseDialog, setShowUseDialog] = useState(false);
  const [showReturnDialog, setShowReturnDialog] = useState(false);
  const { user, isAdmin } = useAuth() || { user: null, isAdmin: false };

  useEffect(() => {
    const fetchExtraInfo = async () => {
      if (item?.category_id) {
        const { data, error } = await supabase
          .from("categories")
          .select("name")
          .eq("id", item.category_id)
          .single();
        setCategoryName(error ? "Categoria não encontrada" : data.name);
      }

      if (item?.city_id) {
        const { data, error } = await supabase
          .from("cities")
          .select("name_city")
          .eq("id_city", item.city_id)
          .single();
        setCityName(error ? "Não informado" : data.name_city);
      } else {
        setCityName(null);
      }

      if (item?.rooms_id) {
        const { data, error } = await supabase
          .from("rooms")
          .select("name_room")
          .eq("id_room", item.rooms_id)
          .single();
        setRoomName(error ? "Não informado" : data.name_room);
      } else {
        setRoomName(null);
      }
    };

    if (open) {
      fetchExtraInfo();
    }
  }, [item, open]);

  if (!item) return null;

  const status = statusConfig[item.status] || { label: "Desconhecido", variant: "default", color: "bg-gray-500" };

  const handleClose = (open: boolean) => {
    onOpenChange(open);
    if (!open && onItemChanged) {
      onItemChanged();
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{item.name}</DialogTitle>
            <DialogDescription>{item.description || "Sem descrição disponível."}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                {item.image_url ? (
                  <img
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl">🧸</span>
                )}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <Badge
                    variant={status.variant as "default" | "secondary" | "destructive" | "outline"}
                    className={`${status.color} ${item.status === "Em Uso" ? "text-white" : ""}`}
                  >
                    {status.label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Categoria: <span className="font-medium text-foreground">{categoryName || "Carregando..."}</span>
                </p>
                {isAdmin && (
                  <p className="text-sm text-muted-foreground">
                    Cidade: <span className="font-medium text-foreground">{cityName || "Não informado"}</span>
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Sala: <span className="font-medium text-foreground">{roomName || "Não informado"}</span>
                </p>
                {item.description && (
                  <p className="text-xs text-muted-foreground mt-2">{item.description}</p>
                )}
              </div>
            </div>

            <Separator />

            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => onOpenChange(false)}>
                Fechar
              </Button>
              {item.status === "Disponível" && (
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={() => setShowUseDialog(true)}
                >
                  Usar Item
                </Button>
              )}
              {item.user_id === user?.id && (
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={() => setShowReturnDialog(true)}
                >
                  Devolver Item
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showUseDialog && (
        <UseItemDialog
          open={showUseDialog}
          onOpenChange={(open) => {
            setShowUseDialog(open);
            if (!open) {
              onOpenChange(false);
              if (onItemChanged) onItemChanged();
            }
          }}
          item={item}
          onItemChanged={onItemChanged}
        />
      )}

      {showReturnDialog && (
        <ReturnItemDialog
          open={showReturnDialog}
          onOpenChange={(open) => {
            setShowReturnDialog(open);
            if (!open) {
              onOpenChange(false);
              if (onItemChanged) onItemChanged();
            }
          }}
          item={item}
        />
      )}
    </>
  );
}