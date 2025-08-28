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
import { statusConfig, statusMapping } from "@/lib/item-status";

interface ItemDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Item | null;
  onItemChanged?: () => Promise<void>;
}

export function ItemDetailsDialog({ open, onOpenChange, item, onItemChanged }: ItemDetailsDialogProps) {
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [cityName, setCityName] = useState<string | null>(null);
  const [roomName, setRoomName] = useState<string | null>(null);
  const [showUseDialog, setShowUseDialog] = useState(false);
  const { isAdmin } = useAuth() || { isAdmin: false };

  useEffect(() => {
    const fetchExtraInfo = async () => {
      // Categoria
      if (item?.category_id) {
        const { data, error } = await supabase
          .from("categories")
          .select("name")
          .eq("id", item.category_id)
          .single();
        setCategoryName(error ? "Categoria não encontrada" : data.name);
      }

      // Cidade
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

      // Sala
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

  const statusKey = statusMapping[item.status];
  const status = statusKey
    ? statusConfig[statusKey]
    : { label: "Desconhecido", variant: "default", color: "bg-gray-500" };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{item.name}</DialogTitle>
            <DialogDescription>{item.description || "Sem descrição disponível."}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Item Info */}
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
                    className={`${status.color} ${statusKey === "in_use" ? "text-white" : ""}`}
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

            {/* Usage History */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Histórico de Utilização</h4>
                <Button variant="link" size="sm" className="p-0 h-auto">
                  Mostrar detalhes
                </Button>
              </div>
              {/* Mock data for demonstration */}
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
              {/* Mock data for demonstration */}
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => onOpenChange(false)}>
                Fechar
              </Button>
              {statusKey === "available" && (
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={() => setShowUseDialog(true)}
                >
                  Usar Item
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {showUseDialog && (
        <UseItemDialog
          open={showUseDialog}
          onOpenChange={setShowUseDialog}
          item={item}
          onItemChanged={onItemChanged}
        />
      )}
    </>
  );
}