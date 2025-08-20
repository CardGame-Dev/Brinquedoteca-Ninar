"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useState } from "react"
import { AddItemDialog } from "./add-item-dialog"

export function AddItemButton() {
  const { isAdmin } = useAuth()
  const [showDialog, setShowDialog] = useState(false)

  if (!isAdmin) {
    return null
  }

  return (
    <>
      <Button
        onClick={() => setShowDialog(true)}
        size="lg"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow z-40"
      >
        <Plus className="h-6 w-6" />
      </Button>

      <AddItemDialog open={showDialog} onOpenChange={setShowDialog} />
    </>
  )
}
