"use client"

import { useState, useEffect } from "react"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/base"
import { useTheme } from "next-themes"
import { useUpiConfig, isValidUpiId } from "@/lib/upi-store"
import { Moon, Sun, Monitor, Check } from "lucide-react"

interface SettingsModalProps {
    isOpen: boolean
    onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const { theme, setTheme } = useTheme()
    const { upiId, name, setUpiId, setName, loaded } = useUpiConfig()
    const [mounted, setMounted] = useState(false)

    useEffect(() => { setMounted(true) }, [])

    const upiIdError = upiId.trim().length > 0 && !isValidUpiId(upiId)
    const activeTheme = mounted ? theme : 'system'

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Settings">
            <div className="space-y-8 pt-2 pb-4">

                {/* Theme */}
                <section>
                    <h3 className="text-sm font-extrabold text-foreground tracking-tight mb-1 ml-1">
                        Appearance
                    </h3>
                    <p className="text-xs text-muted-foreground/80 mb-4 ml-1">
                        Customize the visual frequency of the application.
                    </p>
                    <div className="flex p-1 bg-secondary/50 rounded-[24px] border border-border/50 ring-1 ring-black/5 dark:ring-white/5 relative">
                        {([
                            { key: 'system', icon: Monitor, label: 'Auto' },
                            { key: 'light', icon: Sun, label: 'Light' },
                            { key: 'dark', icon: Moon, label: 'Dark' },
                        ] as const).map(({ key, icon: Icon, label }) => {
                            const isActive = activeTheme === key;
                            return (
                                <button
                                    key={key}
                                    onClick={() => setTheme(key)}
                                    className={`active-press flex-1 flex flex-col items-center justify-center gap-1.5 h-16 rounded-[20px] font-semibold text-xs transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] relative z-10 ${isActive
                                        ? "text-primary-foreground shadow-lg shadow-black/10 dark:shadow-black/20"
                                        : "text-muted-foreground hover:bg-foreground/5 bg-transparent"
                                        }`}
                                >
                                    {isActive && (
                                        <div className="absolute inset-0 bg-primary rounded-[20px] -z-10 shadow-organic" />
                                    )}
                                    <Icon size={18} className={isActive ? "opacity-100" : "opacity-60"} />
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                </section>

                <div className="border-t border-border/40" />

                {/* UPI Details */}
                <section>
                    <h3 className="text-sm font-extrabold text-foreground tracking-tight mb-1 ml-1">
                        Financial Profile
                    </h3>
                    <p className="text-xs text-muted-foreground/80 mb-5 ml-1 leading-relaxed">
                        Your UPI ID is used to instantly generate QR codes for friends when they settle balances with you.
                    </p>
                    {loaded && (
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-semibold text-foreground/70 ml-1 mb-1 block">
                                    UPI ID
                                </label>
                                <Input
                                    type="text"
                                    placeholder="yourname@upi"
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                    className={`h-12 text-base ${upiIdError ? "ring-2 ring-destructive/50" : ""}`}
                                    autoCapitalize="none"
                                    autoCorrect="off"
                                    spellCheck={false}
                                />
                                {upiIdError && (
                                    <p className="text-xs text-destructive mt-1 ml-1">
                                        UPI ID must contain &quot;@&quot; (e.g. name@upi)
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-foreground/70 ml-1 mb-1 block">
                                    Display Name
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Your Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="h-12 text-base"
                                />
                            </div>
                        </div>
                    )}

                    {loaded && upiId.trim() && name.trim() && !upiIdError && (
                        <div className="flex items-center gap-2 mt-3 ml-1">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <span className="text-xs text-primary font-medium">UPI configured</span>
                        </div>
                    )}
                </section>
            </div>
        </Modal>
    )
}
