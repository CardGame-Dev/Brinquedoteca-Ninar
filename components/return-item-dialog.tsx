"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Camera } from "lucide-react"
import type { Item } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase/client"

interface ReturnItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: Item | null
  onItemChanged?: () => void | Promise<void>; // Adicione esta linha
}

export function ReturnItemDialog({ open, onOpenChange, item, onItemChanged }: ReturnItemDialogProps) {
  const { user } = useAuth()
  const [condition, setCondition] = useState<"normal" | "defect">("normal")
  const [defectDescription, setDefectDescription] = useState("")
  const [photo, setPhoto] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!photo) {
      alert("É obrigatório anexar uma foto na devolução")
      setIsLoading(false)
      return
    }

    if (condition === "defect" && !defectDescription) {
      alert("Para itens com defeito, é obrigatório descrever o problema")
      setIsLoading(false)
      return
    }

    try {
      console.log("Registrando devolução...")
      const { error: movementError } = await supabase.from("movements").insert([
        {
          item_id: item?.id,
          user_id: user?.id,
          condition,
          condition_description: condition === "normal" ? "normal" : defectDescription,
          photo: photo.name,
          created_at: new Date().toISOString(),
        },
      ])

      if (movementError) {
        console.error("Erro ao registrar devolução:", movementError)
        setIsLoading(false)
        return
      }

      console.log("Atualizando status do item...")
      const { error: itemError } = await supabase
        .from("items")
        .update({
          status: "available",
          user_id: null,
        })
        .eq("id", item?.id)

      if (itemError) {
        console.error("Erro ao atualizar status do item:", itemError)
        setIsLoading(false)
        return
      }

      // Chame onItemChanged após a atualização bem-sucedida
      if (onItemChanged) {
        console.log("Chamando onItemChanged...")
        await onItemChanged()
      }

      onOpenChange(false)
    } catch (err) {
      console.error("Erro inesperado:", err)
    } finally {
      setCondition("normal")
      setDefectDescription("")
      setPhoto(null)
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Devolver Item</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <Label>Condição Atual do Brinquedo</Label>
            <RadioGroup value={condition} onValueChange={(value: "normal" | "defect") => setCondition(value)}>
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
          )}

          <div className="space-y-2">
            <Label>Foto da Devolução *</Label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
              className="hidden"
              id="return-photo"
              required
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("return-photo")?.click()}
              className="flex-1"
            >
              <Camera className="h-4 w-4 mr-2" />
              {photo ? photo.name : "Tirar Foto"}
            </Button>
          </div>

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
              {isLoading ? "Devolvendo..." : "Devolver"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
