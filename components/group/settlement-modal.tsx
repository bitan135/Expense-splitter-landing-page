"use client"

import { useState, useEffect, useCallback } from "react"
import { Button, Input } from "@/components/ui/base"
import { Modal } from "@/components/ui/modal"
import { Group } from "@/types"
import { useStore } from "@/lib/store"
import { useUpiConfig } from "@/lib/upi-store"
import { safeFloat } from "@/lib/logic/rounding"
import { ArrowRight, Banknote, QrCode, Smartphone } from "lucide-react"
import { UpiQrModal } from "@/components/group/upi-qr-modal"

type SettlementStep = "form" | "method" | "upi-app-select" | "upi-confirm"

interface SettlementModalProps {
    isOpen: boolean
    onClose: () => void
    group: Group
    initialPayerId?: string
    initialReceiverId?: string
    maxAmount?: number
    mode?: 'settle' | 'collect' | 'record'
}

export function SettlementModal({
    isOpen,
    onClose,
    group,
    initialPayerId,
    initialReceiverId,
    maxAmount = 0,
    mode = 'settle'
}: SettlementModalProps) {
    const { dispatch } = useStore()
    const { upiId, name: upiName, isValid: upiIsValid } = useUpiConfig()
    const [amount, setAmount] = useState("")
    const [payerId, setPayerId] = useState(initialPayerId || "")
    const [receiverId, setReceiverId] = useState(initialReceiverId || "")
    const [step, setStep] = useState<SettlementStep>("method")
    const [upiQrOpen, setUpiQrOpen] = useState(false)
    const [upiError, setUpiError] = useState("")

    useEffect(() => {
        if (isOpen) {
            setPayerId(initialPayerId || "")
            setReceiverId(initialReceiverId || "")
            if (maxAmount > 0) {
                setAmount(maxAmount.toString())
            } else {
                setAmount("")
            }
            // If we have both payer and receiver pre-filled from Group page, skip form
            if (initialPayerId && initialReceiverId && maxAmount > 0) {
                setStep("method")
            } else {
                setStep("form")
            }
            setUpiError("")
        }
    }, [isOpen, initialPayerId, initialReceiverId, maxAmount])

    const numAmount = safeFloat(parseFloat(amount))
    const formValid = !!payerId && !!receiverId && payerId !== receiverId && !isNaN(numAmount) && numAmount > 0

    const recordSettlement = useCallback((method: 'cash' | 'upi') => {
        const settleAmount = safeFloat(parseFloat(amount))
        if (!payerId || !receiverId || payerId === receiverId || isNaN(settleAmount) || settleAmount <= 0) return

        const payer = group.members.find(m => m.id === payerId)
        const receiver = group.members.find(m => m.id === receiverId)
        if (!payer || !receiver) return

        dispatch({
            type: "ADD_EXPENSE",
            payload: {
                groupId: group.id,
                expense: {
                    id: crypto.randomUUID(),
                    groupId: group.id,
                    title: "Settlement",
                    amount: settleAmount,
                    paidBy: payerId,
                    createdAt: Date.now(),
                    type: 'settlement',
                    settlementMethod: method,
                    splits: {
                        [receiverId]: settleAmount
                    }
                }
            }
        })
        onClose()
    }, [amount, payerId, receiverId, group, dispatch, onClose])

    const handleProceed = () => {
        if (!formValid) return
        setStep("method")
    }

    const handleCash = () => {
        recordSettlement('cash')
    }

    const handleUpi = () => {
        if (!upiIsValid) {
            setUpiError("Set up UPI details in Settings first")
            return
        }
        setUpiError("")
        setUpiQrOpen(true)
    }

    // UPI Pay: deep-link using receiver's upiId (or phone)
    const receiverMember = group.members.find(m => m.id === receiverId)
    const receiverHasUpi = !!receiverMember?.upiId

    const handlePayViaApp = useCallback((app: 'phonepe' | 'gpay' | 'paytm' | 'generic') => {
        if (!receiverMember?.upiId) return
        const rawId = receiverMember.upiId.trim()
        const settleAmount = safeFloat(parseFloat(amount))
        if (isNaN(settleAmount) || settleAmount <= 0) return

        // If upiId contains @, use as-is. Otherwise treat as phone + @upi
        const vpa = rawId.includes('@') ? rawId : `${rawId.replace(/\D/g, '')}@upi`

        const params = new URLSearchParams({
            pa: vpa,
            pn: receiverMember.name,
            am: settleAmount.toFixed(2),
            cu: 'INR',
            tn: 'Split Settlement',
        })

        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
        let url: string

        if (isIOS) {
            if (app === 'phonepe') {
                url = `phonepe://pay?${params.toString()}`
            } else if (app === 'gpay') {
                url = `gpay://upi/pay?${params.toString()}`
            } else if (app === 'paytm') {
                url = `paytmmp://pay?${params.toString()}`
            } else {
                url = `upi://pay?${params.toString()}`
            }
        } else {
            // Android: explicit intent with action + category to force package targeting
            let pkg = 'in.org.npci.upiapp' // generic BHIM fallback
            if (app === 'phonepe') pkg = 'com.phonepe.app'
            if (app === 'gpay') pkg = 'com.google.android.apps.nbu.paisa.user'
            if (app === 'paytm') pkg = 'net.one97.paytm'

            const playStoreUrl = `https://play.google.com/store/apps/details?id=${pkg}`

            if (app === 'generic') {
                // generic intent
                url = `intent://pay?${params.toString()}#Intent;scheme=upi;action=android.intent.action.VIEW;category=android.intent.category.DEFAULT;end`
            } else {
                url = `intent://pay?${params.toString()}#Intent;scheme=upi;package=${pkg};action=android.intent.action.VIEW;category=android.intent.category.DEFAULT;S.browser_fallback_url=${encodeURIComponent(playStoreUrl)};end`
            }
        }

        window.location.href = url
        setTimeout(() => setStep("upi-confirm"), 800)
    }, [receiverMember, amount])

    const handleUpiDone = () => {
        setUpiQrOpen(false)
        recordSettlement('upi')
    }

    const setMax = () => {
        if (maxAmount > 0) setAmount(maxAmount.toFixed(2))
    }

    const handleBack = () => {
        // If the form was skipped (pre-filled from member card), close the modal entirely
        if (initialPayerId && initialReceiverId && maxAmount > 0) {
            onClose()
        } else {
            setStep("form")
        }
        setUpiError("")
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title="Settle Up">
                <div className="space-y-6 pt-2">

                    {step === "form" && (
                        <>
                            {/* Visual Flow */}
                            <div className="flex items-center justify-between bg-secondary/30 p-4 rounded-2xl">
                                <div className="flex flex-col items-center gap-1 w-1/3">
                                    <span className="text-xs text-muted-foreground font-bold uppercase">From</span>
                                    <select
                                        value={payerId}
                                        onChange={(e) => setPayerId(e.target.value)}
                                        className="bg-transparent font-semibold text-sm text-center w-full appearance-none outline-none min-h-[44px]"
                                    >
                                        <option value="" disabled>Select</option>
                                        {group.members.map(m => (
                                            <option key={m.id} value={m.id}>{m.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <ArrowRight className="text-muted-foreground/50" />

                                <div className="flex flex-col items-center gap-1 w-1/3">
                                    <span className="text-xs text-muted-foreground font-bold uppercase">To</span>
                                    <select
                                        value={receiverId}
                                        onChange={(e) => setReceiverId(e.target.value)}
                                        className="bg-transparent font-semibold text-sm text-center w-full appearance-none outline-none min-h-[44px]"
                                    >
                                        <option value="" disabled>Select</option>
                                        {group.members.map(m => (
                                            <option key={m.id} value={m.id}>{m.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Amount Input */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Amount</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">₹</span>
                                    <Input
                                        type="number"
                                        inputMode="decimal"
                                        min="0"
                                        autoFocus
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        onKeyDown={(e) => { if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault() }}
                                        className="pl-8 text-2xl font-bold h-14"
                                        placeholder="0.00"
                                    />
                                    {maxAmount > 0 && (
                                        <button
                                            onClick={setMax}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                                        >
                                            MAX
                                        </button>
                                    )}
                                </div>
                                {maxAmount > 0 && (
                                    <div className="text-right text-xs text-muted-foreground mr-1">
                                        Owed: ₹{maxAmount.toFixed(2)}
                                    </div>
                                )}
                            </div>

                            <Button
                                className="w-full h-12 text-lg font-bold shadow-lg"
                                onClick={handleProceed}
                                disabled={!formValid}
                            >
                                Continue
                            </Button>
                        </>
                    )}

                    {step === "method" && (
                        <>
                            {/* Amount + Direction Summary */}
                            <div className="text-center py-2">
                                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Settling</p>
                                <p className="text-3xl font-bold tabular-nums">
                                    <span className="text-xl text-muted-foreground mr-1">₹</span>
                                    {numAmount.toFixed(2)}
                                </p>
                                {payerId && receiverId && (
                                    <p className="text-sm text-muted-foreground mt-2 flex items-center justify-center gap-2">
                                        <span className="font-semibold text-foreground">{group.members.find(m => m.id === payerId)?.name}</span>
                                        <ArrowRight size={14} className="text-muted-foreground/50" />
                                        <span className="font-semibold text-foreground">{group.members.find(m => m.id === receiverId)?.name}</span>
                                    </p>
                                )}
                            </div>

                            {/* Method Selection */}
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
                                Choose Method
                            </p>

                            <div className="grid grid-cols-2 gap-3">
                                {mode === 'record' ? (
                                    /* Record mode: logging a 3rd party transaction */
                                    <>
                                        <button
                                            onClick={handleCash}
                                            className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-secondary hover:bg-secondary/80 transition-all duration-150 active:scale-[0.97]"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Banknote size={24} className="text-primary" />
                                            </div>
                                            <span className="font-semibold text-sm">Record Cash</span>
                                        </button>
                                        <button
                                            onClick={() => recordSettlement('upi')}
                                            className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-secondary hover:bg-secondary/80 transition-all duration-150 active:scale-[0.97]"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-amber-600/10 flex items-center justify-center">
                                                <Smartphone size={24} className="text-amber-700 dark:text-amber-500" />
                                            </div>
                                            <span className="font-semibold text-sm">Record UPI</span>
                                        </button>
                                    </>
                                ) : mode === 'collect' ? (
                                    /* Collect mode: receiving money */
                                    <>
                                        <button
                                            onClick={handleCash}
                                            className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-secondary hover:bg-secondary/80 transition-all duration-150 active:scale-[0.97]"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Banknote size={24} className="text-primary" />
                                            </div>
                                            <span className="font-semibold text-sm">Cash</span>
                                        </button>
                                        <button
                                            onClick={handleUpi}
                                            className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-secondary hover:bg-secondary/80 transition-all duration-150 active:scale-[0.97]"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-amber-600/10 flex items-center justify-center">
                                                <QrCode size={24} className="text-amber-700 dark:text-amber-500" />
                                            </div>
                                            <span className="font-semibold text-sm">Show QR</span>
                                        </button>
                                    </>
                                ) : (
                                    /* Settle mode: paying money */
                                    <>
                                        <button
                                            onClick={handleCash}
                                            className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-secondary hover:bg-secondary/80 transition-all duration-150 active:scale-[0.97]"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                <Banknote size={24} className="text-primary" />
                                            </div>
                                            <span className="font-semibold text-sm">Cash</span>
                                        </button>
                                        <button
                                            onClick={() => receiverHasUpi ? setStep("upi-app-select") : recordSettlement('upi')}
                                            className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-secondary hover:bg-secondary/80 transition-all duration-150 active:scale-[0.97]"
                                        >
                                            <div className="w-12 h-12 rounded-full bg-amber-600/10 flex items-center justify-center">
                                                <Smartphone size={24} className="text-amber-700 dark:text-amber-500" />
                                            </div>
                                            <span className="font-semibold text-sm">Pay UPI</span>
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* UPI Error */}
                            {upiError && (
                                <div className="bg-destructive/10 text-destructive text-sm font-medium px-4 py-3 rounded-2xl text-center">
                                    {upiError}
                                </div>
                            )}

                            <button
                                onClick={handleBack}
                                className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                            >
                                ← Back
                            </button>
                        </>
                    )}

                    {step === "upi-app-select" && (
                        <>
                            {/* Amount Summary */}
                            <div className="text-center py-2">
                                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Pay via</p>
                                <p className="text-3xl font-bold tabular-nums">
                                    <span className="text-xl text-muted-foreground mr-1">₹</span>
                                    {numAmount.toFixed(2)}
                                </p>
                                {receiverMember && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        to <span className="font-semibold text-foreground">{receiverMember.name}</span>
                                    </p>
                                )}
                            </div>

                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
                                Choose App
                            </p>

                            <div className="grid grid-cols-2 gap-3">
                                {/* GPay */}
                                <button
                                    onClick={() => handlePayViaApp('gpay')}
                                    className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-secondary hover:bg-secondary/80 transition-all duration-150 active:scale-[0.97]"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-white border border-border flex items-center justify-center shadow-sm">
                                        <img src="/icons/gpay.svg" alt="GPay" className="w-8 h-8 object-contain" />
                                    </div>
                                    <span className="font-semibold text-sm">GPay</span>
                                </button>

                                {/* Paytm */}
                                <button
                                    onClick={() => handlePayViaApp('paytm')}
                                    className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-secondary hover:bg-secondary/80 transition-all duration-150 active:scale-[0.97]"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-[#002970] flex items-center justify-center shadow-md">
                                        <img src="/icons/paytm.svg" alt="Paytm" className="w-9 h-9 object-contain" />
                                    </div>
                                    <span className="font-semibold text-sm">Paytm</span>
                                </button>

                                {/* PhonePe */}
                                <button
                                    onClick={() => handlePayViaApp('phonepe')}
                                    className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-secondary hover:bg-secondary/80 transition-all duration-150 active:scale-[0.97]"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                                        <img src="/icons/phonepe.svg" alt="PhonePe" className="w-8 h-8 object-contain invert" />
                                    </div>
                                    <span className="font-semibold text-sm">PhonePe</span>
                                </button>
                            </div>

                            <button
                                onClick={() => setStep("method")}
                                className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                            >
                                ← Back
                            </button>
                        </>
                    )}

                    {step === "upi-confirm" && (
                        <>
                            <div className="text-center py-4">
                                <div className="w-16 h-16 rounded-full bg-amber-600/10 flex items-center justify-center mx-auto mb-4">
                                    <Smartphone size={32} className="text-amber-700 dark:text-amber-500" />
                                </div>
                                <p className="text-lg font-bold mb-1">Payment initiated</p>
                                <p className="text-sm text-muted-foreground">
                                    Did you complete the UPI payment of <span className="font-bold tabular-nums">₹{numAmount.toFixed(2)}</span>?
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    variant="secondary"
                                    className="h-12 font-bold"
                                    onClick={handleBack}
                                >
                                    No, Go Back
                                </Button>
                                <Button
                                    className="h-12 font-bold"
                                    onClick={() => recordSettlement('upi')}
                                >
                                    Yes, Settled
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </Modal>

            {/* UPI QR Modal */}
            <UpiQrModal
                isOpen={upiQrOpen}
                onClose={() => setUpiQrOpen(false)}
                upiId={upiId}
                payeeName={upiName}
                amount={numAmount}
                note={group.name}
                onDone={handleUpiDone}
            />
        </>
    )
}
