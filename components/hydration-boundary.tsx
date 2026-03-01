"use client";

import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/base";
import { del } from "idb-keyval";

export function HydrationBoundary({ children }: { children: React.ReactNode }) {
    const { state, dispatch } = useStore();

    const handleSoftReset = async () => {
        if (confirm("This will permanently delete all local expense data. Are you sure?")) {
            await del("expense-splitter-state");
            dispatch({ type: "SOFT_RESET" });
        }
    };

    if (state.requiresReset) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center space-y-6 animate-in fade-in duration-500">
                <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
                    <span className="text-4xl">⚠️</span>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Data Recovery Mode</h2>
                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed max-w-xs mx-auto">
                        Your offline storage ledger was corrupted. We locked the app to prevent accidental syncs.
                        You can attempt to extract it manually, or reset the app to continue.
                    </p>
                </div>
                <Button
                    variant="secondary"
                    className="w-full max-w-xs bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={handleSoftReset}
                >
                    Wipe Data & Restart
                </Button>
            </div>
        );
    }

    if (!state.loaded) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[100dvh] space-y-4">
                <div className="relative flex items-center justify-center">
                    {/* Pulsing ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" style={{ animationDuration: '2s' }} />
                    <div className="relative h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-xl backdrop-blur-sm">
                        💸
                    </div>
                </div>
                <div className="text-sm font-medium text-muted-foreground animate-pulse">
                    Decrypting Ledger...
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
