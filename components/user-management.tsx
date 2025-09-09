"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Sidebar } from "@/components/sidebar";
import { Plus, Edit, Trash2 } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  position: string;
  citie: string; // UUID da cidade
}

interface City {
  id: string; // UUID
  name: string;
  uf: string;
}

interface Cargo {
  id: string;
  name: string;
}

export function UserManagement() {
  const { isAdmin } = useAuth() || { isAdmin: false };

  const [users, setUsers] = useState<User[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    position: "",
    citieId: "",
  });
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchCities();
      fetchCargos();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from("users").select("*");
      if (error) {
        console.error("Erro ao buscar usuários:", error.message);
      } else {
        setUsers(data || []);
      }
    } catch (error) {
      console.error("Erro inesperado ao buscar usuários:", error);
    }
  };

  const fetchCities = async () => {
    try {
      const { data, error } = await supabase.from("cities").select("id_city, name_city, uf");
      if (error) {
        console.error("Erro ao buscar cidades:", error.message);
      } else if (data) {
        setCities(
          data.map((city) => ({
            id: city.id_city,
            name: city.name_city,
            uf: city.uf,
          }))
        );
      }
    } catch (error) {
      console.error("Erro inesperado ao buscar cidades:", error);
    }
  };

  const fetchCargos = async () => {
    try {
      const { data, error } = await supabase.from("cargos").select("id, name");
      if (error) {
        console.error("Erro ao buscar cargos:", error.message);
      } else if (data) {
        setCargos(data);
      }
    } catch (error) {
      console.error("Erro inesperado ao buscar cargos:", error);
    }
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editUser) {
      const { error } = await supabase
        .from("users")
        .update({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          position: formData.position,
          citie: formData.citieId,
        })
        .eq("id", editUser.id);

      if (error) {
        alert("Erro ao atualizar usuário: " + error.message);
      }
    } else {
      const { error } = await supabase.from("users").insert([
        {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          position: formData.position,
          citie: formData.citieId,
        },
      ]);
      if (error) {
        alert("Erro ao adicionar usuário: " + error.message);
      }
    }

    setShowDialog(false);
    setEditUser(null);
    setFormData({ name: "", email: "", role: "", position: "", citieId: "" });
    fetchUsers();
  };

  const handleEditUser = (user: User) => {
    setEditUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "",
      position: user.position || "",
      citieId: user.citie || "",
    });
    setShowDialog(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      const { error } = await supabase.from("users").delete().eq("id", userId);
      if (error) {
        if (
          error.message.includes("violates foreign key constraint") ||
          error.message.includes("violates")
        ) {
          setDeleteError("Há outros registros que usam este usuário. Exclua ou altere esses registros antes de remover este usuário.");
        } else {
          setDeleteError("Erro ao excluir usuário: " + error.message);
        }
      } else {
        fetchUsers();
      }
    }
  };

  const handleCityChange = (cityId: string) => {
    setFormData({ ...formData, citieId: cityId });
  };

  if (!isAdmin) {
    return <p>Você não tem permissão para acessar esta página.</p>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 border-r hidden md:block">
        <Sidebar />
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 p-4 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Usuários</h1>

        {/* Tabela de Usuários */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Nome</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Email</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Role</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Cargo</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Cidade</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const city = cities.find((c) => c.id === user.citie);
                return (
                  <tr key={user.id} className="border-t">
                    <td className="px-4 py-2 text-sm text-gray-800">{user.name}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{user.email}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{user.role}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{user.position}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{city ? city.name : user.citie}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        title="Editar"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        title="Excluir"
                        onClick={() => handleDeleteUser(user.id)}
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

        {/* Botão flutuante para adicionar usuário */}
        <Button
          onClick={() => {
            setEditUser(null);
            setFormData({ name: "", email: "", role: "", position: "", citieId: "" });
            setShowDialog(true);
          }}
          size="lg"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow z-40"
        >
          <Plus className="h-6 w-6" />
        </Button>

        {/* Dialog para Adicionar/Editar Usuário */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editUser ? "Editar Usuário" : "Adicionar Usuário"}</DialogTitle>
              <DialogDescription>
                {editUser
                  ? "Altere os dados do usuário e salve."
                  : "Preencha os dados para adicionar um novo usuário."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="position">Cargo</Label>
                <select
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  required
                >
                  <option value="">Selecione um cargo</option>
                  {cargos.map((cargo) => (
                    <option key={cargo.id} value={cargo.id}>
                      {cargo.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="citie">Cidade</Label>
                <select
                  id="citie"
                  value={formData.citieId}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  required
                >
                  <option value="">Selecione uma cidade</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name} - {city.uf}
                    </option>
                  ))}
                </select>
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
                <Button type="submit" className="flex-1">
                  {editUser ? "Salvar Alterações" : "Adicionar Usuário"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Modal de erro ao excluir */}
        <Dialog open={!!deleteError} onOpenChange={() => setDeleteError(null)}>
          <DialogContent className="sm:max-w-xs text-center">
            <DialogHeader>
              <DialogTitle>Não foi possível excluir</DialogTitle>
            </DialogHeader>
            <div className="py-2">{deleteError}</div>
            <Button onClick={() => setDeleteError(null)} className="mx-auto mt-2">Ok</Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}