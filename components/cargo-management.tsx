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
  const [editCity, setEditCity] = useState<City | null>(null);
  const [editCityForm, setEditCityForm] = useState({ name: "", uf: "" });
  const [showEditCityDialog, setShowEditCityDialog] = useState(false);

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
        console.log("Cargos retornados do Supabase:", data);
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
      console.error("Erro ao adicionar cargo:", error);
      setIsLoading(false);
      return;
    }

    setFormData({ name: "", citieId: "", uf: "" });
    setIsLoading(false);
    setShowDialog(false);
    fetchCargos(); // Atualiza a lista de cargos
  };

  const handleCityChange = (cityId: string) => {
    const selectedCity = cities.find((city) => city.id === cityId);
    setFormData({
      ...formData,
      citieId: cityId, // UUID da cidade
      uf: selectedCity ? selectedCity.uf : "",
    });
  };

  const handleEditCity = (city: City) => {
    setEditCity(city);
    setEditCityForm({ name: city.name, uf: city.uf });
    setShowEditCityDialog(true);
  };

  const handleDeleteCity = async (cityId: string) => {
    if (confirm("Tem certeza que deseja excluir esta cidade?")) {
      const { error } = await supabase.from("cities").delete().eq("id_city", cityId);
      if (error) {
        alert("Erro ao excluir cidade: " + error.message);
      } else {
        fetchCities(); // Atualiza a lista após exclusão
      }
    }
  };

  const handleUpdateCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCity) return;

    const { error } = await supabase
      .from("cities")
      .update({ name_city: editCityForm.name, uf: editCityForm.uf })
      .eq("id_city", editCity.id);

    if (error) {
      alert("Erro ao atualizar cidade: " + error.message);
      console.error("Erro ao atualizar cidade:", error);
    } else {
      setShowEditCityDialog(false);
      fetchCities(); // Atualiza a lista de cidades
    }
  };

  const handleSaveEditCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCity) return;
    const { error } = await supabase
      .from("cities")
      .update({ name_city: editCityForm.name, uf: editCityForm.uf })
      .eq("id_city", editCity.id);
    if (error) {
      alert("Erro ao editar cidade: " + error.message);
    } else {
      setShowEditCityDialog(false);
      setEditCity(null);
      fetchCities();
    }
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
                      <td className="px-4 py-2 text-sm text-gray-800">{cargo.uf}</td>
                      <td className="px-4 py-2 flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          title="Editar"
                          onClick={() => handleEditCity(city!)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          title="Excluir"
                          onClick={() => handleDeleteCity(city!.id)}
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

          {/* Tabela de Cidades */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Cidade</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">UF</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Ações</th>
                </tr>
              </thead>
              <tbody>
                {cities.map((city) => (
                  <tr key={city.id} className="border-t">
                    <td className="px-4 py-2 text-sm text-gray-800">{city.name}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{city.uf}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        title="Editar"
                        onClick={() => handleEditCity(city)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        title="Excluir"
                        onClick={() => handleDeleteCity(city.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
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

          {/* Diálogo para Edição de Cidade */}
          <Dialog open={showEditCityDialog} onOpenChange={setShowEditCityDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Editar Cidade</DialogTitle>
                <DialogDescription>Altere os dados da cidade e salve.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSaveEditCity} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-city-name">Nome da Cidade</Label>
                  <Input
                    id="edit-city-name"
                    value={editCityForm.name}
                    onChange={e => setEditCityForm({ ...editCityForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-city-uf">UF</Label>
                  <Input
                    id="edit-city-uf"
                    value={editCityForm.uf}
                    onChange={e => setEditCityForm({ ...editCityForm, uf: e.target.value })}
                    required
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => setShowEditCityDialog(false)}
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