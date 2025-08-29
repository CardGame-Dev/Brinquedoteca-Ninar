"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase/client";
import { Upload } from "lucide-react";

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditMode?: boolean;
  itemToEdit?: {
    id: string;
    name: string;
    description: string;
    categoryId: string;
    status: "Disponível" | "Em Uso" | "Em Atraso" | "Em Processo" | "Reservado";
    cityId: string;
    roomId: string;
  };
  onItemChanged?: () => Promise<void>;
}

export function AddItemDialog({ open, onOpenChange, isEditMode, itemToEdit, onItemChanged }: AddItemDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    status: "Disponível",
    cityId: "",
    roomId: "",
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cities, setCities] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);

  // Preenche os campos ao abrir em modo edição
  useEffect(() => {
    if (isEditMode && itemToEdit && open) {
      setFormData({
        name: itemToEdit.name || "",
        description: itemToEdit.description || "",
        categoryId: itemToEdit.categoryId || "",
        status: itemToEdit.status || "Disponível",
        cityId: itemToEdit.cityId || "",
        roomId: itemToEdit.roomId || "",
      });
    } else if (!isEditMode && open) {
      setFormData({
        name: "",
        description: "",
        categoryId: "",
        status: "Disponível",
        cityId: "",
        roomId: "",
      });
      setImageFile(null);
    }
  }, [isEditMode, itemToEdit, open]);

  useEffect(() => {
    const loadCategories = async () => {
      const { data } = await supabase.from("categories").select("*");
      setCategories(data || []);
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadCities = async () => {
      const { data } = await supabase.from("cities").select("*");
      setCities(data || []);
    };
    loadCities();
  }, []);

  useEffect(() => {
    const loadRooms = async () => {
      const { data } = await supabase.from("rooms").select("*");
      setRooms(data || []);
    };
    loadRooms();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let imageUrl = null;

    // Fazer upload da imagem, se houver
    if (imageFile) {
      const fileName = `${Date.now()}-${imageFile.name}`; // Nome único para o arquivo
      const { data, error: uploadError } = await supabase.storage
        .from("item-images") // Nome do bucket
        .upload(fileName, imageFile);

      if (uploadError) {
        alert("Erro ao fazer upload da imagem: " + uploadError.message);
        setIsLoading(false);
        return;
      }

      // Obter a URL pública da imagem
      const { data: publicUrlData } = supabase.storage.from("item-images").getPublicUrl(fileName);
      imageUrl = publicUrlData.publicUrl;
    }

    if (isEditMode && itemToEdit) {
      // Atualizar item existente
      const { error } = await supabase
        .from("items")
        .update({
          name: formData.name,
          description: formData.description,
          category_id: formData.categoryId,
          status: formData.status,
          city_id: formData.cityId,
          rooms_id: formData.roomId,
          image_url: imageUrl, // Salvar a URL da imagem no banco
        })
        .eq("id", itemToEdit.id);

      if (error) {
        alert("Erro ao atualizar item: " + error.message);
        setIsLoading(false);
        return;
      }
      if (onItemChanged) {
        await onItemChanged(); // Atualiza a lista de itens no componente pai
      }
    } else {
      // Criar novo item
      const { error } = await supabase
        .from("items")
        .insert([
          {
            name: formData.name,
            description: formData.description,
            category_id: formData.categoryId,
            status: formData.status,
            city_id: formData.cityId,
            rooms_id: formData.roomId,
            image_url: imageUrl, // Salvar a URL da imagem no banco
          },
        ]);

      if (error) {
        alert("Erro ao adicionar item: " + error.message);
        setIsLoading(false);
        return;
      }
      if (onItemChanged) {
        await onItemChanged(); // Atualiza a lista de itens no componente pai
      }
    }

    setFormData({
      name: "",
      description: "",
      categoryId: "",
      status: "Disponível",
      cityId: "",
      roomId: "",
    });
    setImageFile(null);
    setIsLoading(false);
    onOpenChange(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Editar Brinquedo" : "Adicionar Novo Brinquedo"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Altere as informações do brinquedo e clique em salvar."
              : "Preencha os dados para adicionar um novo brinquedo."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Brinquedo *</Label>
            <Input
              id="name"
              placeholder="Digite o nome do brinquedo"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria *</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descreva o brinquedo..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status Inicial</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Disponível">Disponível</SelectItem>
                <SelectItem value="Em Uso">Em Uso</SelectItem>
                <SelectItem value="Em Atraso">Em Atraso</SelectItem>
                <SelectItem value="Em Processo">Em Processo</SelectItem>
                <SelectItem value="Reservado">Reservado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">Cidade *</Label>
            <Select
              value={formData.cityId}
              onValueChange={(value) =>
                setFormData({ ...formData, cityId: value, roomId: "" })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma cidade" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.id_city} value={city.id_city}>
                    {city.name_city} - {city.uf}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="room">Sala *</Label>
            <Select
              value={formData.roomId}
              onValueChange={(value) => setFormData({ ...formData, roomId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma sala" />
              </SelectTrigger>
              <SelectContent>
                {rooms
                  .filter((room) => room.city_id === formData.cityId)
                  .map((room) => (
                    <SelectItem key={room.id_room} value={room.id_room}>
                      {room.name_room}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Imagem de Capa</Label>
            <div className="flex items-center gap-2">
              <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("image")?.click()}
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                {imageFile ? imageFile.name : "Selecionar Imagem"}
              </Button>
            </div>
            {imageFile && (
              <div className="mt-2">
                <img
                  src={URL.createObjectURL(imageFile) || "/placeholder.svg"}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-lg"
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
            <Button type="submit" className="flex-1" disabled={isLoading || !formData.name || !formData.categoryId}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}