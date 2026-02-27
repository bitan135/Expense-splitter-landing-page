export type SplitType = 'equal' | 'exact' | 'custom' | 'percent' | 'exclude' | 'settlement';

export interface Member {
    id: string;
    name: string;
    contact?: string; // sanitised phone number (digits only)
    upiId?: string;   // UPI VPA (e.g. name@upi) or phone number for UPI settlement
}

export interface Expense {
    id: string;
    groupId: string;
    title: string;
    amount: number;
    paidBy: string; // memberId
    type: SplitType;
    splits: Record<string, number>; // memberId -> value (amount, percent, or 0/1 for exclude)
    settlementMethod?: 'cash' | 'upi'; // only set for type === 'settlement'
    createdAt: number;
}

export interface Group {
    id: string;
    name: string;
    members: Member[];
    expenses: Expense[];
    currency: string;
    lastUpdated: number;
    selfId?: string; // memberId of the current user in this group
}
