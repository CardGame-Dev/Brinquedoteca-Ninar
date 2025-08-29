"use client";

import { useState, useEffect } from "react";
import { ItemCard } from "./item-card";
import { supabase } from "@/lib/supabase/client";

export function ItemGrid() {
  const [items, setItems] = useState<any[]>([]);

  // Função real para buscar itens do Supabase
  const loadItems = async () => {
    const { data, error } = await supabase.from("items").select("*");
    if (error) {
      console.error("Erro ao buscar itens:", error);
      setItems([]);
    } else {
      setItems(data ? [...data] : []); // força nova referência
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          onItemChanged={loadItems}
        />
      ))}
    </div>
  );
}