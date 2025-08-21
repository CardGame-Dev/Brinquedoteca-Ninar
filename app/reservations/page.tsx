"use client"

import { useAuth } from "@/lib/auth-context"
import { Sidebar } from "@/components/sidebar"
import { ScheduledReservations } from "@/components/scheduled-reservations"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ReservationsPage() {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:ml-64">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center px-4 md:px-6">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <h1 className="ml-4 text-lg font-semibold">Reservas Agendadas</h1>
          </div>
        </header>
        <main className="p-4 md:p-6">
          <ScheduledReservations />
        </main>
      </div>
    </div>
  )
}
