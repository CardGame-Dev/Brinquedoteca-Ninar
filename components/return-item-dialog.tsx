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

interface ReturnItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: Item | null
}

export function ReturnItemDialog({ open, onOpenChange, item }: ReturnItemDialogProps) {
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

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("Devolvendo item:", {
      itemId: item?.id,
      userId: user?.id,
      condition,
      defectDescription,
      photo,
    })

    // Reset form
    setCondition("normal")
    setDefectDescription("")
    setPhoto(null)
    setIsLoading(false)
    onOpenChange(false)
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhoto(file)
    }
  }

  if (!item) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Devolver Item</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Usuário</p>
            
            <p className="text-sm text-muted-foreground mt-2">Item Selecionado</p>
            <p className="font-medium">{item.name}</p>
          </div>

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
              <p className="text-xs text-muted-foreground">
                É obrigatório anexar uma foto para registrar a condição do brinquedo na devolução
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
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
              {photo && (
                <div className="mt-2">
                  <img
                    src={URL.createObjectURL(photo) || "/placeholder.svg"}
                    alt="Preview da devolução"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                </div>
              )}
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
              <Button type="submit" className="flex-1" disabled={isLoading || !photo}>
                {isLoading ? "Devolvendo..." : "Devolver"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
