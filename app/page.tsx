"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { Button, Card, Input } from "@/components/ui/base"
import { Modal } from "@/components/ui/modal"
import { Header } from "@/components/layout/header"
import { SettingsModal } from "@/components/settings/settings-modal"
import { Plus, Trash2, Settings } from "lucide-react"

export default function HomePage() {
  const { state, dispatch } = useStore()
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")


  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return
    dispatch({ type: "CREATE_GROUP", payload: { name: newGroupName.trim() } })
    setNewGroupName("")
    setIsModalOpen(false)
  }

  const handleDeleteGroup = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (confirm("Delete this group? This action cannot be undone.")) {
      dispatch({ type: "DELETE_GROUP", payload: { id } })
    }
  }


  return (
    <div className="min-h-screen bg-background pb-20">
      <Header
        title=""
        rightAction={
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>
        }
      />

      <main className="p-4 max-w-md mx-auto space-y-5">
        {/* Hero */}
        <section className="pt-4 pb-2">
          <h2 className="text-3xl font-bold tracking-tight">Your Groups</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {state.loaded && state.groups.length > 0
              ? `${state.groups.length} group${state.groups.length > 1 ? 's' : ''} · Split expenses effortlessly`
              : 'Split expenses with friends, family & teams'}
          </p>
        </section>

        {state.loaded && state.groups.length === 0 && (
          <div className="text-center py-16 px-6">
            <div className="text-5xl mb-4">💸</div>
            <p className="text-lg font-semibold text-foreground">No groups yet</p>
            <p className="text-sm text-muted-foreground mt-1">Create one to start splitting expenses</p>
          </div>
        )}

        {state.groups.map(group => {
          const timeAgo = (() => {
            const diff = Date.now() - group.lastUpdated
            const mins = Math.floor(diff / 60000)
            if (mins < 1) return 'Just now'
            if (mins < 60) return `${mins}m ago`
            const hrs = Math.floor(mins / 60)
            if (hrs < 24) return `${hrs}h ago`
            const days = Math.floor(hrs / 24)
            return `${days}d ago`
          })()

          return (
            <Card
              key={group.id}
              onClick={() => router.push(`/group/${group.id}`)}
              className="p-5 cursor-pointer hover:bg-muted/50 transition-all active:scale-[0.98]"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg truncate">{group.name}</h3>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10">
                        <span className="text-[10px] font-bold text-primary">{group.members.length}</span>
                      </span>
                      members
                    </span>
                    <span className="text-muted-foreground/30">·</span>
                    <span className="text-xs text-muted-foreground">{group.expenses.filter(e => e.type !== 'settlement').length} expenses</span>
                    <span className="text-muted-foreground/30">·</span>
                    <span className="text-xs text-muted-foreground/60">{timeAgo}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <button
                    onClick={(e) => handleDeleteGroup(e, group.id)}
                    className="p-2 text-destructive/50 hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                  <span className="text-muted-foreground/30 text-lg">›</span>
                </div>
              </div>
            </Card>
          )
        })}

        <div className="fixed bottom-8 right-5 z-30 pb-[env(safe-area-inset-bottom)]">
          <Button
            size="icon"
            className="h-14 w-14 rounded-full shadow-xl shadow-primary/25 active:scale-90 transition-transform"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={24} />
          </Button>
        </div>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Group"
      >
        <div className="space-y-4">
          <Input
            autoFocus
            placeholder="Group Name (e.g. Goa Trip)"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateGroup()}
          />
          <Button className="w-full" onClick={handleCreateGroup}>
            Create Group
          </Button>
        </div>
      </Modal>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  )
}
