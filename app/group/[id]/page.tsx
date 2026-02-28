"use client"

import { useState, useEffect, use, memo, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { Header } from "@/components/layout/header"
import { Button, Card, Input } from "@/components/ui/base"
import { Modal } from "@/components/ui/modal"
import { ArrowLeft, Plus, Users, Receipt, FileText, Trash2, Settings, ArrowRight, Contact } from "lucide-react"
import { calculateBalances } from "@/lib/logic/calculateBalances"
import { cn, formatAmount } from "@/lib/utils"
import { Group, Expense, Member } from "@/types"

import { optimizeSettlement, Transaction } from "@/lib/logic/optimizeSettlement"

const MemberItem = memo(({ member, allTransactions, groupMembers, isSelf, selfId, selfBalance, onSettle }: {
    member: Member, allTransactions: Transaction[], groupMembers: Member[], isSelf: boolean, selfId: string | undefined, selfBalance: number,
    onSettle: (type: 'pay' | 'receive' | 'record', payerId: string, receiverId: string, amount: number) => void
}) => {
    let isPositive = false
    let isZero = true
    let amount = 0
    let type: 'pay' | 'receive' | 'record' = 'pay'
    let text = "Settled up"
    let actionPayerId = ""
    let actionReceiverId = ""

    if (isSelf) {
        // Self card shows overall global balance
        isPositive = selfBalance > 0
        isZero = Math.abs(selfBalance) < 0.01
        amount = Math.abs(selfBalance)
        text = isPositive ? "Gets back overall" : "Owes overall"
    } else {
        // Find best transaction involving this member
        // Priority 1: Direct transaction with Self
        let tx = selfId ? allTransactions.find(t =>
            (t.from === selfId && t.to === member.id) ||
            (t.from === member.id && t.to === selfId)
        ) : undefined

        // Priority 2: Any transaction involving this member (Third-Party Debt)
        if (!tx) {
            tx = allTransactions.find(t => t.from === member.id || t.to === member.id)
        }

        if (tx) {
            isZero = false
            amount = tx.amount
            actionPayerId = tx.from
            actionReceiverId = tx.to

            if (tx.from === member.id && tx.to === selfId) {
                // They owe YOU
                isPositive = true
                type = 'receive'
                text = "Owes you"
            } else if (tx.from === selfId && tx.to === member.id) {
                // YOU owe them
                isPositive = false
                type = 'pay'
                text = "You owe"
            } else {
                // Third party debt
                type = 'record'
                const otherId = tx.from === member.id ? tx.to : tx.from
                const otherName = groupMembers.find(m => m.id === otherId)?.name || "Unknown"
                if (tx.from === member.id) {
                    // They owe a third party
                    isPositive = false
                    text = `Owes ${otherName}`
                } else {
                    // They get back from a third party
                    isPositive = true
                    text = `Gets back from ${otherName}`
                }
            }
        }
    }

    const getButton = () => {
        if (isSelf) return null // No buttons on self card
        if (type === 'record') return "Record"
        return isPositive ? "Collect" : "Settle"
    }

    return (
        <Card className={cn("p-4 flex justify-between items-center active-press", isSelf && "ring-1 ring-primary/20", isSelf && "bg-primary/5")}>
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center text-foreground font-bold text-base relative">
                    {member.name.substring(0, 2).toUpperCase()}
                    {isSelf && (
                        <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[8px] font-black px-1.5 py-0.5 rounded-full leading-none shadow-sm">
                            YOU
                        </div>
                    )}
                    {!isZero && !isSelf && (
                        <div className={cn(
                            "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card",
                            isPositive ? "bg-emerald-500" : "bg-rose-500",
                            type === 'record' && "bg-blue-500" // Optional: distinct color for third-party
                        )} />
                    )}
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold text-base">{member.name}</span>
                    {member.upiId && (
                        <span className="text-[11px] text-muted-foreground/70 tabular-nums">{member.upiId}</span>
                    )}
                    {!isZero && (
                        <span className={cn(
                            "text-xs font-bold tabular-nums",
                            !isSelf ? (isPositive ? "text-emerald-500" : "text-rose-500") : "text-muted-foreground",
                            type === 'record' && "text-blue-500" // Optional: distinct color for third-party
                        )}>
                            {text} {formatAmount(amount)}
                        </span>
                    )}
                    {isZero && <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{isSelf ? "Settled up overall" : "Settled up"}</span>}
                </div>
            </div>

            {!isZero && !isSelf && (
                <Button
                    size="sm"
                    variant={isPositive ? "secondary" : "destructive"}
                    className={cn(
                        "h-9 px-4 text-xs font-bold shadow-sm transition-all active:scale-95 rounded-xl",
                        isPositive ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20" : "bg-rose-500/10 text-rose-600 hover:bg-rose-500/20",
                        type === 'record' && "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
                    )}
                    onClick={(e) => {
                        e.stopPropagation()
                        onSettle(type, actionPayerId, actionReceiverId, amount)
                    }}
                >
                    {getButton()}
                </Button>
            )}
        </Card>
    )
})
MemberItem.displayName = "MemberItem"

const ExpenseItem = memo(({ expense, group, onClick }: { expense: Expense, group: Group, onClick: (eId: string) => void }) => {
    const payer = group.members.find(m => m.id === expense.paidBy)?.name || "Unknown"
    const isSettlement = expense.type === 'settlement'

    // For settlement, find who received it
    const receiverId = isSettlement ? Object.keys(expense.splits)[0] : null
    const receiver = receiverId ? group.members.find(m => m.id === receiverId)?.name || "Unknown" : ""

    return (
        <Card
            className="p-4 active-press relative group overflow-hidden cursor-pointer"
            onClick={() => onClick(expense.id)}
        >
            <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                    <span className="font-semibold text-lg leading-tight text-foreground">{expense.title}</span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                        {isSettlement ? (
                            <>
                                <span className="font-medium text-foreground bg-secondary px-2 py-0.5 rounded-md flex items-center gap-1">
                                    {payer} <ArrowRight size={10} /> {receiver}
                                </span>
                                {expense.settlementMethod && (
                                    <span className={cn(
                                        "text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-md",
                                        expense.settlementMethod === 'upi'
                                            ? "bg-violet-500/10 text-violet-600"
                                            : "bg-emerald-500/10 text-emerald-600"
                                    )}>
                                        {expense.settlementMethod === 'upi' ? 'UPI' : 'Cash'}
                                    </span>
                                )}
                            </>
                        ) : (
                            <span className="font-medium text-foreground bg-secondary px-2 py-0.5 rounded-md">{payer} paid</span>
                        )}
                        <span>•</span>
                        <span>{new Date(expense.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="font-bold text-xl tabular-nums tracking-tight">{formatAmount(expense.amount)}</span>
                    <span className="text-muted-foreground/40 text-lg ml-1">›</span>
                </div>
            </div>
        </Card>
    )
})
ExpenseItem.displayName = "ExpenseItem"

import { SettlementModal } from "@/components/group/settlement-modal"

// ... imports remain the same

export default function GroupPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const { state, dispatch } = useStore()
    const router = useRouter()
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
    const [newMemberName, setNewMemberName] = useState("")
    const [newMemberUpi, setNewMemberUpi] = useState("")

    // Detect Contact Picker API on client (cannot check during SSR)
    const [contactsSupported, setContactsSupported] = useState(false)
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const nav = navigator as any
        if ('contacts' in navigator && typeof nav.contacts?.select === 'function') {
            setContactsSupported(true)
        }
    }, [])

    // Settlement Logic
    const [settlementModalOpen, setSettlementModalOpen] = useState(false)
    const [settlementContext, setSettlementContext] = useState<{
        payerId?: string,
        receiverId?: string,
        maxAmount: number,
        mode: 'settle' | 'collect' | 'record'
    }>({ maxAmount: 0, mode: 'settle' })

    const group = state.groups.find(g => g.id === id)
    const balances = useMemo(() => group ? calculateBalances(group) : {}, [group])
    const transactions = useMemo(() => optimizeSettlement(balances), [balances])

    const selfId = group?.selfId
    const [selfPickerOpen, setSelfPickerOpen] = useState(false)

    // Show self-picker when selfId is unset and group has members
    useEffect(() => {
        if (group && group.members.length > 0 && !group.selfId) {
            setSelfPickerOpen(true)
        }
    }, [group])

    const handleSetSelf = useCallback((memberId: string) => {
        dispatch({ type: "SET_SELF", payload: { groupId: id, memberId } })
        setSelfPickerOpen(false)
    }, [dispatch, id])

    const handleAddMember = useCallback(() => {
        if (!newMemberName.trim()) return
        const upiVal = newMemberUpi.trim()
        dispatch({
            type: "ADD_MEMBER",
            payload: { groupId: id, name: newMemberName.trim(), ...(upiVal ? { upiId: upiVal } : {}) }
        })
        setNewMemberName("")
        setNewMemberUpi("")
        setIsAddMemberOpen(false)
    }, [dispatch, id, newMemberName, newMemberUpi])

    const handleImportContact = useCallback(async () => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const nav = navigator as any
            if (!('contacts' in navigator) || !nav.contacts?.select) return
            const contacts = await nav.contacts.select(['name', 'tel'], { multiple: false })
            if (contacts && contacts.length > 0) {
                const c = contacts[0]
                if (c.name && c.name.length > 0) setNewMemberName(c.name[0])
                if (c.tel && c.tel.length > 0) setNewMemberUpi(c.tel[0].replace(/\D/g, ''))
            }
        } catch {
            // User cancelled or API error — ignore
        }
    }, [])

    const handleDeleteExpense = useCallback((groupId: string, expenseId: string) => {
        dispatch({
            type: "DELETE_EXPENSE",
            payload: { groupId, expenseId }
        })
    }, [dispatch])

    const openSettlement = useCallback((type: 'pay' | 'receive' | 'record', payerId: string, receiverId: string, amount: number) => {
        if (!selfId) return
        setSettlementContext({
            payerId: payerId,
            receiverId: receiverId,
            maxAmount: amount,
            mode: type === 'record' ? 'record' : (type === 'pay' ? 'settle' : 'collect')
        })
        setSettlementModalOpen(true)
    }, [selfId])

    const totalSpend = useMemo(() =>
        group ? group.expenses.filter(e => e.type !== 'settlement').reduce((sum, e) => sum + e.amount, 0) : 0
        , [group])

    const sortedExpenses = useMemo(() =>
        group ? group.expenses.slice().sort((a, b) => b.createdAt - a.createdAt) : []
        , [group])

    const expensesOnly = useMemo(() => sortedExpenses.filter(e => e.type !== 'settlement'), [sortedExpenses])
    const settlementsOnly = useMemo(() => sortedExpenses.filter(e => e.type === 'settlement'), [sortedExpenses])

    if (!state.loaded) return <div className="p-10 text-center text-muted-foreground">Loading...</div>
    if (!group) return <div className="p-10 text-center text-muted-foreground">Group not found</div>


    return (
        <div className="min-h-screen bg-background pb-32">
            <Header
                title={group.name}
                rightAction={
                    <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
                        <ArrowLeft className="text-foreground" size={20} />
                    </Button>
                }
            />

            <main className="p-5 max-w-md mx-auto space-y-8">

                {/* Hero Total Spend */}
                <section className="text-center py-6">
                    <h2 className="text-label mb-2">Total Expenses</h2>
                    <div className="text-hero tabular-nums">
                        <span className="text-3xl font-normal text-muted-foreground align-top mt-2 inline-block mr-1">₹</span>
                        {totalSpend.toFixed(2)}
                    </div>
                </section>

                {/* Member List */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-label">Members</h3>
                        <Button size="sm" variant="ghost" className="h-8 text-xs hover:bg-secondary" onClick={() => setIsAddMemberOpen(true)}>
                            <Plus size={14} className="mr-1" /> Add
                        </Button>
                    </div>
                    <div className="grid gap-3">
                        {group.members.map(member => (
                            <MemberItem
                                key={member.id}
                                member={member}
                                allTransactions={transactions}
                                groupMembers={group.members}
                                isSelf={member.id === selfId}
                                selfId={selfId}
                                selfBalance={balances[member.id] || 0}
                                onSettle={openSettlement}
                            />
                        ))}
                        {group.members.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground bg-secondary/50 rounded-3xl border border-dashed border-border/50">
                                No members yet.
                            </div>
                        )}
                    </div>
                </section>

                {/* Expenses List */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-label">Expenses</h3>
                    </div>
                    <div className="grid gap-3">
                        {expensesOnly.length > 0 ? (
                            expensesOnly.map(expense => (
                                <ExpenseItem
                                    key={expense.id}
                                    expense={expense}
                                    group={group}
                                    onClick={(eId) => router.push(`/group/${id}/expense/${eId}`)}
                                />
                            ))
                        ) : (
                            <div className="text-center py-12 text-muted-foreground bg-secondary/50 rounded-3xl border border-dashed border-border/50">
                                <p>No expenses yet.</p>
                                <p className="text-sm mt-1 opacity-70">Tap <span className="font-semibold">+ Add Expense</span> to get started</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Settled Activity List */}
                {settlementsOnly.length > 0 && (
                    <section className="space-y-4 pt-4">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="text-label">Settled Activity</h3>
                        </div>
                        <div className="grid gap-3">
                            {settlementsOnly.map(expense => (
                                <ExpenseItem
                                    key={expense.id}
                                    expense={expense}
                                    group={group}
                                    onClick={(eId) => router.push(`/group/${id}/expense/${eId}`)}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Floating Actions */}
                <div className="fixed bottom-8 left-0 right-0 z-30 flex justify-center gap-4 pointer-events-none px-6">
                    <Button
                        onClick={() => router.push(`/group/${id}/statement`)}
                        className="h-14 flex-1 rounded-2xl shadow-xl bg-secondary text-foreground font-semibold pointer-events-auto border border-white/5 active:scale-95 transition-transform"
                    >
                        <FileText size={20} className="mr-2 opacity-50" /> Statement
                    </Button>
                    <Button
                        onClick={() => router.push(`/group/${id}/expense/new`)}
                        className="h-14 flex-[1.5] rounded-2xl shadow-xl bg-primary text-primary-foreground font-bold pointer-events-auto active:scale-95 transition-transform"
                    >
                        <Plus size={22} className="mr-2" /> Add Expense
                    </Button>
                </div>

            </main>

            {/* Add Member Modal */}
            <Modal
                isOpen={isAddMemberOpen}
                onClose={() => setIsAddMemberOpen(false)}
                title="Add Member"
            >
                <div className="space-y-4 pt-2">
                    {contactsSupported && (
                        <button
                            onClick={handleImportContact}
                            className="w-full flex items-center justify-center gap-2 h-12 rounded-2xl bg-secondary hover:bg-secondary/80 text-sm font-semibold transition-all active:scale-[0.97]"
                        >
                            <Contact size={18} className="text-primary" />
                            Import from Contacts
                        </button>
                    )}
                    <Input
                        autoFocus
                        placeholder="Enter name"
                        value={newMemberName}
                        onChange={(e) => setNewMemberName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
                        className="text-lg bg-secondary"
                    />
                    <Input
                        placeholder="UPI ID or Phone (optional)"
                        value={newMemberUpi}
                        onChange={(e) => setNewMemberUpi(e.target.value)}
                        className="text-base bg-secondary"
                        autoCapitalize="none"
                        autoCorrect="off"
                    />
                    <Button className="w-full" size="lg" onClick={handleAddMember}>Add to Group</Button>
                </div>
            </Modal>

            {/* Self Picker */}
            <Modal
                isOpen={selfPickerOpen}
                onClose={() => setSelfPickerOpen(false)}
                title="Which one is you?"
            >
                <div className="grid gap-3 pt-2">
                    {group.members.map(m => (
                        <button
                            key={m.id}
                            onClick={() => handleSetSelf(m.id)}
                            className="flex items-center gap-4 p-4 rounded-2xl bg-secondary hover:bg-secondary/80 transition-all active:scale-[0.97]"
                        >
                            <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center text-foreground font-bold text-base">
                                {m.name.substring(0, 2).toUpperCase()}
                            </div>
                            <span className="font-semibold text-lg">{m.name}</span>
                        </button>
                    ))}
                </div>
            </Modal>

            {/* Settlement Modal */}
            <SettlementModal
                isOpen={settlementModalOpen}
                onClose={() => setSettlementModalOpen(false)}
                group={group}
                initialPayerId={settlementContext.payerId}
                initialReceiverId={settlementContext.receiverId}
                maxAmount={settlementContext.maxAmount}
                mode={settlementContext.mode}
            />
        </div>
    )
}
