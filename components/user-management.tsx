"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Sidebar } from "@/components/sidebar";
import { Plus } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  position: string;
  citie: string;
}

interface City {
  id: string;
  name: string;
}

export function UserManagement() {
  const { isAdmin } = useAuth() || { isAdmin: false };

  const [users, setUsers] = useState<User[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    position: "",
    citie: "",
  });

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchCities();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from("users").select("*"); // Busca todos os usuários
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
      const { data, error } = await supabase.from("cities").select("*"); // Busca todas as cidades
      if (error) {
        console.error("Erro ao buscar cidades:", error.message);
      } else {
        setCities(data || []);
      }
    } catch (error) {
      console.error("Erro inesperado ao buscar cidades:", error);
    }
  };

  const handleSaveUser = async () => {
    if (editingUser) {
      const { error } = await supabase
        .from("users")
        .update(formData)
        .eq("id", editingUser.id);

      if (error) {
        console.error("Erro ao atualizar usuário:", error.message);
      }
    } else {
      const { error } = await supabase.from("users").insert([formData]);

      if (error) {
        console.error("Erro ao adicionar usuário:", error.message);
      }
    }

    setShowDialog(false);
    setEditingUser(null);
    setFormData({ name: "", email: "", role: "", position: "", citie: "" });
    fetchUsers();
  };

  const handleDeleteUser = async (userId: string) => {
    const { error } = await supabase.from("users").delete().eq("id", userId);

    if (error) {
      console.error("Erro ao excluir usuário:", error.message);
    } else {
      fetchUsers();
    }
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

        {/* Exibição de usuários em cartões */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold text-gray-800">{user.name}</h2>
              <p className="text-sm text-gray-600">Email: {user.email}</p>
              <p className="text-sm text-gray-600">Role: {user.role}</p>
              <p className="text-sm text-gray-600">Cargo: {user.position}</p>
              <p className="text-sm text-gray-600">Cidade: {user.citie}</p>
              <div className="mt-4 flex justify-between">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingUser(user);
                    setFormData({
                      name: user.name || "",
                      email: user.email || "",
                      role: user.role || "",
                      position: user.position || "",
                      citie: user.citie || "",
                    });
                    setShowDialog(true);
                  }}
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  Excluir
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Botão flutuante para adicionar usuário */}
        <Button
          onClick={() => setShowDialog(true)}
          className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg"
        >
          <Plus className="h-6 w-6" />
        </Button>

        {/* Dialog para Adicionar/Editar Usuário */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent aria-describedby="dialog-description">
            <DialogHeader>
              <DialogTitle>{editingUser ? "Editar Usuário" : "Adicionar Usuário"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="position">Cargo</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="citie">Cidade</Label>
                <select
                  id="citie"
                  value={formData.citie}
                  onChange={(e) => setFormData({ ...formData, citie: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-2"
                >
                  <option value="">Selecione uma cidade</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                onClick={handleSaveUser}
                className="bg-blue-500 hover:bg-blue-600 text-white w-full"
              >
                {editingUser ? "Salvar Alterações" : "Adicionar Usuário"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}