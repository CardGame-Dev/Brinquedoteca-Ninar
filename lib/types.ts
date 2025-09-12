export interface Item {
  id: string
  name: string
  description: string
  category: string
  category_id: string
  image_url?: string
  status: "Disponível" | "Em Uso" | "Em Atraso" | "Em Processo" | "Reservado";
  created_at: string
  updated_at: string
  city_id: string;    
  rooms_id: string;   
  currentUserId?: string | null;
  user_id?: string | null; 
}

export interface Category {
  id: string
  name: string
  description: string
}

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user"
}

export interface Profile {
  id: string
  name: string
  email: string
  role: "adminMaster" | "adminUnidade" | "user" | undefined
  created_at: string
}

export interface Movement {
  id: string
  item_id: string
  user_id: string
  type: "uso" | "devolucao"
  condition: "normal" | "defeito"
  condition_description?: string
  photos: string[]
  created_at: string
}

export interface Reservation {
  id: string
  item_id: string
  user_id: string
  start_time: string
  end_time: string
  status: "ativa" | "concluida" | "cancelada"
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: Category
        Insert: Omit<Category, "id">
        Update: Partial<Omit<Category, "id">>
      }
      items: {
        Row: Item
        Insert: Omit<Item, "id" | "created_at" | "updated_at">
        Update: Partial<Omit<Item, "id" | "created_at" | "updated_at">>
      }
      profiles: {
        Row: Profile
        Insert: Omit<Profile, "created_at">
        Update: Partial<Omit<Profile, "id" | "created_at">>
      }
      movements: {
        Row: Movement
        Insert: Omit<Movement, "id" | "created_at">
        Update: Partial<Omit<Movement, "id" | "created_at">>
      }
      reservations: {
        Row: Reservation
        Insert: Omit<Reservation, "id" | "created_at">
        Update: Partial<Omit<Reservation, "id" | "created_at">>
      }
    }
  }
}
