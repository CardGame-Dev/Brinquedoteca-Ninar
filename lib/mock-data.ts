/*
import type { Item, Category } from "./types"

export const mockCategories: Category[] = [
  { id: "1", name: "Jogos de Tabuleiro", description: "Jogos que são jogados em um tabuleiro" },
  { id: "2", name: "Brinquedos Educativos", description: "Brinquedos que auxiliam no aprendizado" },
  { id: "3", name: "Bonecas e Bonecos", description: "Figuras humanoides para brincadeiras" },
  { id: "4", name: "Carrinhos e Veículos", description: "Brinquedos de transporte e veículos" },
  { id: "5", name: "Jogos de Construção", description: "Blocos e peças para construir" },
  { id: "6", name: "Instrumentos Musicais", description: "Brinquedos que produzem sons musicais" },
]

export const mockItems: Item[] = [
  {
    id: "1",
    name: "Quebra-cabeça 1000 peças",
    description: "Quebra-cabeça com paisagem natural",
    category: "Jogos de Tabuleiro",
    categoryId: "1",
    imageUrl: "/colorful-jigsaw-puzzle.png",
    status: "available",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Lego Classic",
    description: "Conjunto de blocos de construção coloridos",
    category: "Jogos de Construção",
    categoryId: "5",
    imageUrl: "/colorful-lego-pile.png",
    status: "in_use",
    currentUserId: "user456",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "3",
    name: "Boneca Barbie",
    description: "Boneca com roupas e acessórios",
    category: "Bonecas e Bonecos",
    categoryId: "3",
    imageUrl: "/fashion-doll.png",
    status: "available",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "4",
    name: "Carrinho Hot Wheels",
    description: "Carrinho de corrida em miniatura",
    category: "Carrinhos e Veículos",
    categoryId: "4",
    imageUrl: "/red-toy-car.png",
    status: "reserved",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "5",
    name: "Xilofone Infantil",
    description: "Instrumento musical colorido",
    category: "Instrumentos Musicais",
    categoryId: "6",
    imageUrl: "/colorful-xylophone.png",
    status: "overdue",
    currentUserId: "user789",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "6",
    name: "Jogo da Memória",
    description: "Cartas para desenvolver a memória",
    category: "Brinquedos Educativos",
    categoryId: "2",
    imageUrl: "/memory-game.png",
    status: "in_process",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
]
*/


import { createClient } from "@supabase/supabase-js";

// Inicialize o cliente do Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Função para buscar categorias do Supabase
export const fetchCategories = async () => {
  const { data, error } = await supabase.from("categories").select("*");

  if (error) {
    console.error("Erro ao buscar categorias do Supabase:", error);
    return [];
  }

  return data;
};

// Função para buscar itens do Supabase
export const fetchItems = async () => {
  const { data, error } = await supabase.from("items").select("*");

  if (error) {
    console.error("Erro ao buscar itens do Supabase:", error);
    return [];
  }

  return data;
};

// Exemplo de uso: exportar os dados como promessas
export const mockCategories = fetchCategories();
export const mockItems = fetchItems();