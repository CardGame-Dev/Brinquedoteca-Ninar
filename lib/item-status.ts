export const statusConfig = {
  available: { label: "Disponível", variant: "default", color: "bg-green-500" },
  in_use: { label: "Em Uso", variant: "secondary", color: "bg-blue-500" },
  overdue: { label: "Em Atraso", variant: "destructive", color: "bg-red-500" },
  in_process: { label: "Em Processo", variant: "outline", color: "bg-yellow-500" },
  reserved: { label: "Reservado", variant: "outline", color: "bg-purple-500" },
} as const;

export const statusMapping: Record<string, keyof typeof statusConfig> = {
  disponivel: "available",
  em_uso: "in_use",
  em_atraso: "overdue",
  em_processo: "in_process",
  reservado: "reserved",
};