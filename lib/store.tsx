"use client";

import React, { createContext, useContext, useEffect, useReducer } from "react";
import { get, set, del } from "idb-keyval";
import { Group, Expense } from "@/types";

// State Shape
interface AppState {
    groups: Group[];
    activeGroupId: string | null;
    loaded: boolean;
    requiresReset?: boolean;
}

// Actions
type Action =
    | { type: "LOAD_STATE"; payload: AppState }
    | { type: "SOFT_RESET" }
    | { type: "CREATE_GROUP"; payload: { name: string } }
    | { type: "DELETE_GROUP"; payload: { id: string } }
    | { type: "SET_ACTIVE_GROUP"; payload: { id: string | null } }
    | { type: "ADD_MEMBER"; payload: { groupId: string; name: string; contact?: string; upiId?: string } }
    | { type: "ADD_EXPENSE"; payload: { groupId: string; expense: Expense } }
    | { type: "UPDATE_EXPENSE"; payload: { groupId: string; expense: Expense } }
    | { type: "DELETE_EXPENSE"; payload: { groupId: string; expenseId: string } }
    | { type: "SET_SELF"; payload: { groupId: string; memberId: string } };

// Initial State
const initialState: AppState = {
    groups: [],
    activeGroupId: null,
    loaded: false,
};

// Reducer
const reducer = (state: AppState, action: Action): AppState => {
    switch (action.type) {
        case "LOAD_STATE":
            return { ...action.payload, loaded: true };

        case "SOFT_RESET":
            return { ...initialState, loaded: true };

        case "CREATE_GROUP": {
            const newGroup: Group = {
                id: Date.now().toString(36) + Math.random().toString(36).slice(2),
                name: action.payload.name,
                members: [],
                expenses: [],
                currency: "INR",
                lastUpdated: Date.now(),
            };
            return { ...state, groups: [...state.groups, newGroup] };
        }

        case "DELETE_GROUP":
            return {
                ...state,
                groups: state.groups.filter((g) => g.id !== action.payload.id),
                activeGroupId: state.activeGroupId === action.payload.id ? null : state.activeGroupId,
            };

        case "SET_ACTIVE_GROUP":
            return { ...state, activeGroupId: action.payload.id };

        case "ADD_MEMBER":
            return {
                ...state,
                groups: state.groups.map((g) => {
                    if (g.id !== action.payload.groupId) return g;
                    return {
                        ...g,
                        members: [
                            ...g.members,
                            {
                                id: Date.now().toString(36) + Math.random().toString(36).slice(2),
                                name: action.payload.name,
                                ...(action.payload.contact ? { contact: action.payload.contact } : {}),
                                ...(action.payload.upiId ? { upiId: action.payload.upiId } : {}),
                            },
                        ],
                        lastUpdated: Date.now(),
                    };
                }),
            };

        case "ADD_EXPENSE":
            return {
                ...state,
                groups: state.groups.map((g) => {
                    if (g.id !== action.payload.groupId) return g;
                    return {
                        ...g,
                        expenses: [...g.expenses, action.payload.expense],
                        lastUpdated: Date.now(),
                    };
                }),
            };

        case "UPDATE_EXPENSE":
            return {
                ...state,
                groups: state.groups.map((g) => {
                    if (g.id !== action.payload.groupId) return g;
                    return {
                        ...g,
                        expenses: g.expenses.map((e) =>
                            e.id === action.payload.expense.id ? action.payload.expense : e
                        ),
                        lastUpdated: Date.now(),
                    };
                }),
            };

        case "DELETE_EXPENSE":
            return {
                ...state,
                groups: state.groups.map((g) => {
                    if (g.id !== action.payload.groupId) return g;
                    return {
                        ...g,
                        expenses: g.expenses.filter((e) => e.id !== action.payload.expenseId),
                        lastUpdated: Date.now(),
                    };
                }),
            };

        case "SET_SELF":
            return {
                ...state,
                groups: state.groups.map((g) => {
                    if (g.id !== action.payload.groupId) return g;
                    return { ...g, selfId: action.payload.memberId, lastUpdated: Date.now() };
                }),
            };

        default:
            return state;
    }
};

// Context
const StoreContext = createContext<{
    state: AppState;
    dispatch: React.Dispatch<Action>;
} | null>(null);

// Provider
export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // Load from IndexedDB (Async, Non-Blocking)
    useEffect(() => {
        const loadState = async () => {
            try {
                const saved = await get("expense-splitter-state");
                if (saved) {
                    // Structural validation: ensure data has expected shape
                    if (
                        typeof saved === 'object' &&
                        Array.isArray(saved.groups) &&
                        saved.groups.every((g: unknown) =>
                            g && typeof g === 'object' &&
                            typeof (g as Record<string, unknown>).id === 'string' &&
                            Array.isArray((g as Record<string, unknown>).members) &&
                            Array.isArray((g as Record<string, unknown>).expenses)
                        )
                    ) {
                        dispatch({ type: "LOAD_STATE", payload: saved as AppState });
                    } else {
                        console.warn("Corrupt IndexedDB state. Soft-locking to prevent data loss.");
                        dispatch({ type: "LOAD_STATE", payload: { ...initialState, requiresReset: true } });
                    }
                } else {
                    // Just trigger loaded if empty
                    dispatch({ type: "LOAD_STATE", payload: initialState });
                }
            } catch (e) {
                console.error("Failed to load state from IndexedDB", e);
                dispatch({ type: "LOAD_STATE", payload: { ...initialState, requiresReset: true } });
            }
        };
        loadState();
    }, []);

    // Save to IndexedDB (Async, Non-Blocking)
    useEffect(() => {
        if (state.loaded) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { loaded, ...persistedState } = state;
            // Write to IndexedDB without blocking the UI main thread
            set("expense-splitter-state", persistedState).catch(e => {
                console.error("Failed to save state to IndexedDB", e);
            });
        }
    }, [state]);

    return (
        <StoreContext.Provider value={{ state, dispatch }}>
            {children}
        </StoreContext.Provider>
    );
};

// Hook
export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) throw new Error("useStore must be used within StoreProvider");
    return context;
};
