import { Group } from "@/types";
import { calculateShares } from "./calculateShares";
import { safeFloat } from "./rounding";

/**
 * Calculates the net balance for each member in the group.
 * Positive balance = owed money (gets back).
 * Negative balance = owes money (pays).
 */
export const calculateBalances = (group: Group): Record<string, number> => {
    const balances: Record<string, number> = {};

    // Initialize 0 balance
    group.members.forEach(m => balances[m.id] = 0);

    group.expenses.forEach(expense => {
        // 1. Payer gets credit (only if they still exist in balances)
        if (balances[expense.paidBy] !== undefined) {
            balances[expense.paidBy] = safeFloat(balances[expense.paidBy] + expense.amount);
        }

        // 2. Splitters get debit
        // We re-calculate shares to ensure consistency, or store calculated shares in expense?
        // Storing in expense.splits is better for performance if 'splits' key in Expense is already the *calculated amounts*?
        // In `types/index.ts`, `splits` is `Record<string, number>`.
        // For 'equal', splits might be empty or 1.
        // Ideally, we compute shares on the fly or persist them.
        // The prompt says "replicate logic... pure functions".
        // The `calculateShares` function returns amounts.
        // We should compute shares here based on expense config.
        // Wait, Expense.splits in types: "amount, percent, or 0/1".

        // We need to re-run distribution logic to get exact amounts.
        // OR we can assume when saving expense we save the raw input and compute.
        // Re-computing ensures data integrity if logic changes.

        try {
            // Strike Iota Fix: Construct historical members exclusively from the frozen expense.splits array.
            // This prevents Dynamic Ledger Corruption if group members are later deleted or excluded.
            // We NO LONGER pass active `group.members` because that forces historical expenses to adapt
            // to modern membership permutations, corrupting historical balances natively.
            const historicMembers = Object.keys(expense.splits).map(id => ({ id, name: "Historical" } as any));

            const shares = calculateShares(
                expense.amount,
                expense.type,
                expense.splits,
                historicMembers
            );

            Object.entries(shares).forEach(([memberId, shareAmount]) => {
                if (balances[memberId] !== undefined) {
                    balances[memberId] = safeFloat(balances[memberId] - shareAmount);
                }
            });

        } catch (e) {
            console.warn(`Error calculating shares for expense ${expense.id}:`, e);
        }
    });

    // Sanitize negative-zero values
    Object.keys(balances).forEach(id => {
        if (Object.is(balances[id], -0) || Math.abs(balances[id]) < 0.005) {
            balances[id] = 0;
        }
    });

    return balances;
};
