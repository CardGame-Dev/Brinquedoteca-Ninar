"use client";

import { useState, useEffect } from "react";
import { ItemCard } from "./item-card";
import { supabase } from "@/lib/supabase/client";

export function ItemGrid({ filters }: { filters: any }) {
  const [items, setItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);

  // Função real para buscar itens do Supabase
  const loadItems = async () => {
    const { data, error } = await supabase.from("items").select("*");
    if (error) {
      console.error("Erro ao buscar itens:", error);
      setItems([]);
    } else {
      console.log("Itens carregados do Supabase:", data); // <-- Aqui!
      setItems(data ? [...data] : []); // força nova referência
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    let filtered = items;
    console.log("Filtro status:", filters?.status); // <-- Aqui!
    console.log("Itens antes do filtro:", items.map(item => item.status)); // <-- Aqui!

    if (filters?.searchName) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(filters.searchName.toLowerCase())
      );
    }
    if (filters?.category && filters.category !== "all") {
      filtered = filtered.filter(item => item.category_id === filters.category);
    }
    if (filters?.status && filters.status !== "all") {
      filtered = filtered.filter(item => item.status === filters.status);
    }
    console.log("Itens após filtro:", filtered.map(item => item.status)); // <-- Aqui!
    setFilteredItems(filtered);
  }, [items, filters]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {filteredItems.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          onItemChanged={loadItems}
        />
      ))}
    </div>
  );
}