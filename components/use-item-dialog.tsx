"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Camera } from "lucide-react"
import type { Item } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"

interface UseItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: Item | null
}

export function UseItemDialog({ open, onOpenChange, item }: UseItemDialogProps) {
  const { user } = useAuth()
  const [condition, setCondition] = useState<"normal" | "defect">("normal")
  const [defectDescription, setDefectDescription] = useState("")
  const [photos, setPhotos] = useState<File[]>([])
  const [photoCount, setPhotoCount] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (condition === "defect" && (!defectDescription || photos.length === 0)) {
      alert("Para itens com defeito, é obrigatório descrever o problema e adicionar fotos")
      setIsLoading(false)
      return
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("Usando item:", {
      itemId: item?.id,
      userId: user?.id,
      condition,
      defectDescription,
      photos,
    })

    // Reset form
    setCondition("normal")
    setDefectDescription("")
    setPhotos([])
    setPhotoCount(1)
    setIsLoading(false)
    onOpenChange(false)
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0]
    if (file) {
      const newPhotos = [...photos]
      newPhotos[index] = file
      setPhotos(newPhotos)
    }
  }

  if (!item) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Usar Item</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Usuário</p>
            <p className="font-medium">{user?.name}</p>
            <p className="text-sm text-muted-foreground mt-2">Item Selecionado</p>
            <p className="font-medium">{item.name}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <Label>Condição do Brinquedo</Label>
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
  )
}
