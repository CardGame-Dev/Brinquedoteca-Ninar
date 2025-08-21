"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"
import { Shield, User } from "lucide-react"

export function LoginPage() {
  const [error, setError] = useState("")
  const { signIn, isLoading } = useAuth()

  const handleAdminLogin = async () => {
    setError("")
    const { error: signInError } = await signIn("laffaietycomigo@gmail.com", "123")
    if (signInError) {
      setError("Erro ao fazer login como Admin")
    }
  }

  const handleUserLogin = async () => {
    setError("")
    const { error: signInError } = await signIn("mussphel@gmail.com", "123")
    if (signInError) {
      setError("Erro ao fazer login como Usuário")
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 text-6xl">🧸</div>
          <CardTitle className="text-2xl">Brinquedoteca</CardTitle>
          <CardDescription>Sistema de Controle de Estoque</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <Button onClick={handleAdminLogin} className="w-full h-12 text-lg" disabled={isLoading} variant="default">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Entrando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Entrar como Admin
                </div>
              )}
            </Button>

            <Button
              onClick={handleUserLogin}
              className="w-full h-12 text-lg bg-transparent"
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  Entrando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Entrar como Usuário
                </div>
              )}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">Acesso Rápido:</p>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p>
                <strong>Admin:</strong> Acesso completo ao sistema
              </p>
              <p>
                <strong>Usuário:</strong> Acesso limitado às funcionalidades básicas
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
