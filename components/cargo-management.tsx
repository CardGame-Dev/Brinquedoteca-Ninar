"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar } from "@/components/sidebar";
import { supabase } from "@/lib/supabase/client";
import { LibraryHeader } from "@/components/library-header";

interface Cargo {
  id: string; // UUID
  name: string;
  citie: string; // UUID da cidade
  uf: string;
}

interface City {
  id: string; // UUID
  name: string;
  uf: string;
}

export function CargoManagement() {
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    citieId: "",
    uf: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [editCargo, setEditCargo] = useState<Cargo | null>(null);
  const [editCargoForm, setEditCargoForm] = useState({ name: "", citieId: "", uf: "" });
  const [showEditCargoDialog, setShowEditCargoDialog] = useState(false);

  useEffect(() => {
    fetchCargos();
    fetchCities();
  }, []);

  const fetchCargos = async () => {
    try {
      const { data, error } = await supabase
        .from("cargos")
        .select("id, name, citie, uf");
      if (error) {
        console.error("Erro ao buscar cargos:", error.message);
      } else {
        setCargos(data || []);
      }
    } catch (error) {
      console.error("Erro inesperado ao buscar cargos:", error);
    }
  };

  const fetchCities = async () => {
    try {
      const { data, error } = await supabase.from("cities").select("id_city, name_city, uf");
      if (error) {
        console.error("Erro ao buscar cidades:", error.message);
        return;
      }
      if (data) {
        setCities(
          data.map((city) => ({
            id: city.id_city, // UUID da cidade
            name: city.name_city,
            uf: city.uf,
          }))
        );
      }
    } catch (error) {
      console.error("Erro inesperado ao buscar cidades:", error);
    }
  };

  const handleSaveCargo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.from("cargos").insert([
      {
        name: formData.name,
        citie: formData.citieId, // UUID da cidade
        uf: formData.uf,
      },
    ]);

    if (error) {
      alert("Erro ao adicionar cargo: " + error.message);
      setIsLoading(false);
      return;
    }

    setFormData({ name: "", citieId: "", uf: "" });
    setIsLoading(false);
    setShowDialog(false);
    fetchCargos(); // Atualiza a lista de cargos
  };

  const handleEditCargo = (cargo: Cargo) => {
    setEditCargo(cargo);
    setEditCargoForm({
      name: cargo.name,
      citieId: cargo.citie,
      uf: cargo.uf,
    });
    setShowEditCargoDialog(true);
  };

  const handleSaveEditCargo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCargo) return;
    console.log("Editando cargo:", editCargo);
    console.log("Payload:", editCargoForm);
    console.log("Payload antes do update:", editCargoForm);

    const cargoId = editCargo?.id;
    const { error, data } = await supabase
      .from("cargos")
      .update({
        name: editCargoForm.name,
        citie: editCargoForm.citieId,
        uf: editCargoForm.uf,
      })
      .eq("id", cargoId);

    console.log("Resultado do update:", data, error);

    if (error) {
      console.error("Erro ao editar cargo:", error);
      alert("Erro ao editar cargo: " + error.message);
    } else {
      setShowEditCargoDialog(false);
      setEditCargo(null);
      fetchCargos();
    }
  };

  const handleDeleteCargo = async (cargoId: string) => {
    if (confirm("Tem certeza que deseja excluir este cargo?")) {
      console.log("Excluindo cargo id:", cargoId);

      const { error } = await supabase.from("cargos").delete().eq("id", cargoId);

      if (error) {
        console.error("Erro ao excluir cargo:", error);
        alert("Erro ao excluir cargo: " + error.message);
      } else {
        fetchCargos();
      }
    }
  };

  const handleCityChange = (cityId: string) => {
    const selectedCity = cities.find((city) => city.id === cityId);
    setFormData({
      ...formData,
      citieId: cityId, // UUID da cidade
      uf: selectedCity ? selectedCity.uf : "",
    });
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 border-r hidden md:block">
        <Sidebar />
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1">
        <LibraryHeader showFilterButton={false} title="Gerenciamento de Cargos" />
        <div className="p-4 space-y-6">
          {/* Tabela de Cargos */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Nome</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Cidade</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">UF</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Ações</th>
                </tr>
              </thead>
              <tbody>
                {cargos.map((cargo) => {
                  const city = cities.find((c) => c.id === cargo.citie);
                  return (
                    <tr key={cargo.id} className="border-t">
                      <td className="px-4 py-2 text-sm text-gray-800">{cargo.name}</td>
                      <td className="px-4 py-2 text-sm text-gray-800">{city ? city.name : cargo.citie}</td>
                      <td className="px-4 py-2 text-sm text-gray-800">{cargo.uf}</td>
                      <td className="px-4 py-2 flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          title="Editar"
                          onClick={() => handleEditCargo(cargo)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          title="Excluir"
                          onClick={() => handleDeleteCargo(cargo.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Botão flutuante para adicionar cargo */}
          <Button
            onClick={() => setShowDialog(true)}
            size="lg"
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow z-40"
          >
            <Plus className="h-6 w-6" />
          </Button>

          {/* Diálogo para Adicionar Cargo */}
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Cargo</DialogTitle>
                <DialogDescription>Preencha os dados para adicionar um novo cargo.</DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSaveCargo} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Cargo *</Label>
                  <Input
                    id="name"
                    placeholder="Digite o nome do cargo"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="citie">Cidade *</Label>
                  <Select
                    value={formData.citieId}
                    onValueChange={(value) => handleCityChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma cidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.id}>
                          {city.name} - {city.uf}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => setShowDialog(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading || !formData.name || !formData.citieId}>
                    {isLoading ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Diálogo para Edição de Cargo */}
          <Dialog open={showEditCargoDialog} onOpenChange={setShowEditCargoDialog}>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Editar Cargo</DialogTitle>
                <DialogDescription>Altere os dados do cargo e salve.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSaveEditCargo} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-cargo-name">Nome do Cargo</Label>
                  <Input
                    id="edit-cargo-name"
                    value={editCargoForm.name}
                    onChange={e => {
                      console.log("Alterando nome:", e.target.value);
                      setEditCargoForm({ ...editCargoForm, name: e.target.value });
                    }}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-cargo-citie">Cidade</Label>
                  <Select
                    value={editCargoForm.citieId}
                    onValueChange={value => {
                      const selectedCity = cities.find((city) => city.id === value);
                      setEditCargoForm({
                        ...editCargoForm,
                        citieId: value,
                        uf: selectedCity ? selectedCity.uf : "",
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma cidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.id}>
                          {city.name} - {city.uf}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-cargo-uf">UF</Label>
                  <Input
                    id="edit-cargo-uf"
                    value={editCargoForm.uf}
                    onChange={e => setEditCargoForm({ ...editCargoForm, uf: e.target.value })}
                    required
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => setShowEditCargoDialog(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1">
                    Salvar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}