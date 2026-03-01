"use client"

import { use, memo } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { Header } from "@/components/layout/header"
import { Button, Card } from "@/components/ui/base"
import { ArrowLeft, Edit2, Trash2, Receipt } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ExpenseDetailPage({ params }: { params: Promise<{ id: string, expenseId: string }> }) {
    const { id, expenseId } = use(params)
    const { state, dispatch } = useStore()
    const router = useRouter()

    const group = state.groups.find(g => g.id === id)
    const expense = group?.expenses.find(e => e.id === expenseId)

    if (!state.loaded) return <div className="p-10 text-center text-muted-foreground">Loading...</div>
    if (!group || !expense) return <div className="p-10 text-center text-muted-foreground">Expense not found</div>

    const payer = group.members.find(m => m.id === expense.paidBy)?.name || "Unknown"

    const handleDelete = () => {
        if (confirm("Permanently delete this expense?")) {
            dispatch({ type: "DELETE_EXPENSE", payload: { groupId: group.id, expenseId: expense.id } })
            router.back()
        }
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            <Header
                title="Expense Details"
                rightAction={
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="text-foreground" />
                    </Button>
                }
            />

            <main className="p-5 max-w-md mx-auto space-y-6">

                {/* Receipt Card */}
                <div className="bg-card text-card-foreground rounded-3xl p-6 shadow-xl space-y-5 relative overflow-hidden border border-border/30">
                    {/* Decorative Top */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30" />

                    <div className="text-center space-y-1 pt-3">
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">Amount</div>
                        <div className="text-5xl font-extrabold tabular-nums tracking-tight">₹{expense.amount.toFixed(2)}</div>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <div className="text-lg font-bold text-center">{expense.title}</div>
                        <div className="text-xs text-muted-foreground bg-secondary px-3 py-1.5 rounded-full font-medium">
                            Paid by <span className="font-bold text-foreground">{payer}</span>
                        </div>
                        {expense.type === 'settlement' && expense.settlementMethod && (
                            <div className={cn(
                                "text-[10px] font-bold uppercase px-3 py-1 rounded-full",
                                expense.settlementMethod === 'upi'
                                    ? "bg-amber-600/10 text-amber-700 dark:text-amber-500"
                                    : "bg-primary/10 text-primary"
                            )}>
                                via {expense.settlementMethod === 'upi' ? 'UPI' : 'Cash'}
                            </div>
                        )}
                    </div>

                    <div className="h-px bg-border/40 w-full" />

                    {/* Split Breakdown */}
                    <div className="space-y-3">
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.12em] mb-3">Split Breakdown</div>
                        {Object.entries(expense.splits).map(([memberId, splitAmount]) => {
                            const memberName = group.members.find(m => m.id === memberId)?.name || "Unknown"
                            const isExcluded = splitAmount <= 0;
                            return (
                                <div key={memberId} className={cn("flex justify-between items-center text-sm", isExcluded && "opacity-50")}>
                                    <div className="flex items-center gap-3">
                                        <div className={cn("h-2 w-2 rounded-full", isExcluded ? "bg-muted-foreground/20" : "bg-primary/20")} />
                                        <span className="font-medium">{memberName}</span>
                                    </div>
                                    <span className={cn("font-bold tabular-nums", isExcluded && "font-normal text-muted-foreground")}>
                                        {isExcluded ? "Excluded" : `₹${splitAmount.toFixed(2)}`}
                                    </span>
                                </div>
                            )
                        })}
                    </div>

                    {/* Date */}
                    <div className="text-center text-[10px] text-muted-foreground/40 pt-2 font-mono">
                        {new Date(expense.createdAt).toLocaleString()}
                    </div>
                </div>

                {/* Actions — hide for settlements */}
                {expense.type !== 'settlement' && (
                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <Button
                            variant="secondary"
                            size="lg"
                            className="w-full text-foreground gap-2 h-14 rounded-2xl"
                            onClick={() => router.push(`/group/${id}/expense/${expense.id}/edit`)}
                        >
                            <Edit2 size={18} /> Edit
                        </Button>
                        <Button
                            size="lg"
                            className="w-full bg-destructive/10 text-destructive hover:bg-destructive/20 gap-2 h-14 rounded-2xl"
                            onClick={handleDelete}
                        >
                            <Trash2 size={18} /> Delete
                        </Button>
                    </div>
                )}

            </main>
        </div>
    )
}
