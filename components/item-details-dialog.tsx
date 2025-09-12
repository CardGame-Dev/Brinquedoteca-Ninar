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
import { User, Clock } from "lucide-react";

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
  const [movements, setMovements] = useState<any[]>([]);
  const [selectedMovement, setSelectedMovement] = useState<any | null>(null);
  const [showMovementDetails, setShowMovementDetails] = useState(false);
  const [showUseDialog, setShowUseDialog] = useState(false);
  const [showReturnDialog, setShowReturnDialog] = useState(false);
  const { user, isAdminMaster, isAdminUnidade, isUser } = useAuth() || { user: null, isAdminMaster: false, isAdminUnidade: false, isUser: false };

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

    const fetchMovements = async () => {
      if (item?.id) {
        const { data: movementsData, error } = await supabase
          .from("movements")
          .select("id, user_id, condition, condition_description, photos, created_at, type_movement")
          .eq("item_id", item.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Erro ao buscar movimentos:", error.message);
          return;
        }

        // Para cada movimentação, buscar o nome do usuário
        const movementsWithUserNames = await Promise.all(
          (movementsData || []).map(async (movement) => {
            if (movement.user_id) {
              const { data: userData, error: userError } = await supabase
                .from("users")
                .select("name")
                .eq("id", movement.user_id)
                .single();

              if (userError) {
                console.error(`Erro ao buscar nome do usuário ${movement.user_id}:`, userError.message);
                return { ...movement, user_name: "Usuário desconhecido" };
              }

              return { ...movement, user_name: userData?.name || "Usuário desconhecido" };
            }

            return { ...movement, user_name: "Usuário desconhecido" };
          })
        );

        setMovements(movementsWithUserNames);
      }
    };

    if (open) {
      fetchExtraInfo();
      fetchMovements();
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

  const fetchUserName = async (userId: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("name")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Erro ao buscar o nome do usuário:", error.message);
      return "Usuário desconhecido";
    }

    return data?.name || "Usuário desconhecido";
  };

  // Exibe cidade apenas para adminMaster e adminUnidade
  const canSeeCity = isAdminMaster || isAdminUnidade;

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{item.name}</DialogTitle>
            <DialogDescription>{categoryName || "Sem categoria disponível."}</DialogDescription>
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
                {/*<p className="text-sm text-muted-foreground">
                  Categoria: <span className="font-medium text-foreground">{categoryName || "Carregando..."}</span>
                </p> */}
                {canSeeCity && (
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

            {/* Histórico de Utilização */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Histórico de Utilização</h4>
              </div>
              <div className="space-y-2">
                {movements.map((movement) => (
                  <div
                    key={movement.id}
                    className="flex items-center gap-3 p-3 bg-muted rounded-lg cursor-pointer"
                    onClick={async () => {
                      const userName = await fetchUserName(movement.user_id);
                      setSelectedMovement({ ...movement, user_name: userName });
                      setShowMovementDetails(true);
                    }}
                  >
                    <div className="w-8 h-8 bg-background rounded-full flex items-center justify-center">
                      {movement.type_movement === "Usado" ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {movement.type_movement === "Usado" ? "Retirado por" : "Devolvido por"}{" "}
                        {movement.user_name || "Usuário desconhecido"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(movement.created_at).toLocaleString("pt-BR")}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {movement.condition === "normal" ? "Normal" : "Defeito"}
                    </Badge>
                  </div>
                ))}
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

      {/* Modal de Detalhes da Movimentação */}
      {showMovementDetails && selectedMovement && (
        <Dialog open={showMovementDetails} onOpenChange={setShowMovementDetails}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes da Movimentação</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>
                <strong>Usuário:</strong> {selectedMovement.user_name || "Usuário desconhecido"}
              </p>
              <p>
                <strong>Condição:</strong> {selectedMovement.condition === "normal" ? "Normal" : "Defeito"}
              </p>
              {selectedMovement.condition_description && (
                <p>
                  <strong>Descrição do Defeito:</strong> {selectedMovement.condition_description}
                </p>
              )}
              <p>
                <strong>Data:</strong>{" "}
                {new Date(selectedMovement.created_at).toLocaleString("pt-BR")}
              </p>
              <p>
                <strong>Fotos:</strong> {selectedMovement.photos?.length || 0}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {selectedMovement.photos?.map((photo: string, index: number) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
            <Button variant="outline" className="mt-4" onClick={() => setShowMovementDetails(false)}>
              Fechar
            </Button>
          </DialogContent>
        </Dialog>
      )}

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