"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Camera, Play } from "lucide-react"
import type { Item } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase/client"

interface UseItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Item | null;
  onSuccess?: () => void;
  onItemChanged?: () => void | Promise<void>; // Permite funções síncronas ou assíncronas
}

export function UseItemDialog({ open, onOpenChange, item, onSuccess, onItemChanged }: UseItemDialogProps) {
  const { user } = useAuth();
  const [condition, setCondition] = useState<"normal" | "defect">("normal");
  const [defectDescription, setDefectDescription] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoCount, setPhotoCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (condition === "defect" && (!defectDescription || photos.length === 0)) {
      alert("Para itens com defeito, é obrigatório descrever o problema e adicionar fotos");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Inserindo movimentação...");
      const { error: movementError } = await supabase.from("movements").insert([
        {
          item_id: item?.id,
          user_id: user?.id,
          condition,
          condition_description: condition === "normal" ? "normal" : defectDescription,
          photos: photos.map((photo) => photo.name),
          created_at: new Date().toISOString(),
          category_id: item?.category_id,
          city_id: item?.city_id,
          room_id: item?.rooms_id,
        },
      ]);

      if (movementError) {
        console.error("Erro ao salvar movimentação:", movementError);
        setIsLoading(false);
        return;
      }

      console.log("Atualizando status do item...");
      const { error: itemError } = await supabase
        .from("items")
        .update({
          status: "em_uso",
          user_id: user?.id,
        })
        .eq("id", item?.id);

      if (itemError) {
        console.error("Erro ao atualizar status do item:", itemError);
        setIsLoading(false);
        return;
      }

      if (onItemChanged) {
        console.log("Chamando onItemChanged...");
        await onItemChanged();
      } else {
        console.log("onItemChanged não está definido.");
      }

      setShowSuccessDialog(true);
    } catch (err) {
      console.error("Erro inesperado:", err);
    } finally {
      setCondition("normal");
      setDefectDescription("");
      setPhotos([]);
      setPhotoCount(1);
      setIsLoading(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const newPhotos = [...photos];
      newPhotos[index] = file;
      setPhotos(newPhotos);
    }
  };

  if (!item) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Usar Item</DialogTitle>
            <DialogDescription>
              Informe a condição do brinquedo e registre a movimentação.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mt-2">Item Selecionado</p>
              <p className="font-medium">{item?.name}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-3">
                <Label>Condição do Brinquedo</Label>
                <RadioGroup
                  value={condition}
                  onValueChange={(value: "normal" | "defect") => setCondition(value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="normal" id="normal" />
                    <Label htmlFor="normal">Normal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="defect" id="defect" />
                    <Label htmlFor="defect">Defeito</Label>
                  </div>
                </RadioGroup>
              </div>

              {condition === "defect" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="defect-description">Descrição do Defeito *</Label>
                    <Textarea
                      id="defect-description"
                      placeholder="Descreva o defeito identificado..."
                      value={defectDescription}
                      onChange={(e) => setDefectDescription(e.target.value)}
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Quantas fotos deseja adicionar?</Label>
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      value={photoCount}
                      onChange={(e) => setPhotoCount(Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Fotos do Defeito *</Label>
                    {Array.from({ length: photoCount }).map((_, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handlePhotoChange(e, index)}
                          className="hidden"
                          id={`photo-${index}`}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById(`photo-${index}`)?.click()}
                          className="flex-1"
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          {photos[index] ? photos[index].name : `Foto ${index + 1}`}
                        </Button>
                        {photos[index] && (
                          <img
                            src={URL.createObjectURL(photos[index]) || "/placeholder.svg"}
                            alt={`Preview ${index + 1}`}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </>
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
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-xs text-center">
          <DialogHeader>
            <DialogTitle>Sucesso!</DialogTitle>
            <DialogDescription>
              Movimentação registrada com sucesso!
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => {
              setShowSuccessDialog(false);
              onOpenChange(false);
            }}
          >
            OK
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}