"use client"

import { useAuth } from "@/lib/auth-context"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, BookOpen, Download } from "lucide-react"
import Link from "next/link"

export default function ManualPage() {
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
            <h1 className="ml-4 text-lg font-semibold">Manual de Instruções</h1>
          </div>
        </header>
        <main className="p-4 md:p-6 max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Manual de Utilização</CardTitle>
              <CardDescription>Guia completo para utilização do sistema Brinquedoteca</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  O manual de instruções será disponibilizado em breve. Este documento conterá todas as informações
                  necessárias para utilizar o sistema de forma eficiente.
                </p>
                <Button disabled className="gap-2">
                  <Download className="h-4 w-4" />
                  Download do Manual (Em breve)
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Para Usuários</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Como navegar pela biblioteca</li>
                      <li>• Reservar e usar itens</li>
                      <li>• Devolver brinquedos</li>
                      <li>• Visualizar histórico</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Para Administradores</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Gerenciar brinquedos</li>
                      <li>• Adicionar categorias</li>
                      <li>• Controlar usuários</li>
                      <li>• Relatórios e estatísticas</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
