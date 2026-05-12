import { Currency, PaymentStatus, Transaction } from '@/types';
import { create } from 'zustand';

interface PaymentState {
    status: PaymentStatus;
    transactionId: string | null;
    attemptCount: number;
    failReason: string | null;
    transactions: Transaction[];

    startPayment: (transactionId: string) => void;
    paymentSuccess: (amount: number, currency: Currency) => void;
    paymentFailed: (reason: string, amount: number, currency: Currency) => void;
    paymentTimeout: (amount: number, currency: Currency) => void;
    resetPayment: () => void;
    loadHistory: () => void;
}

function saveHistory(transactions: Transaction[]) {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function addOrUpdateTransaction(
    transactions: Transaction[],
    id: string,
    amount: number,
    currency: Currency,
    status: PaymentStatus,
    attempts: number,
    reason?: string,
): Transaction[] {
    const existing = transactions.findIndex((t) => t.id === id);
    const transaction: Transaction = {
        id,
        amount,
        currency,
        status,
        reason,
        attempts,
        timestamp: new Date().toISOString(),
    };

    if (existing >= 0) {
        const updated = [...transactions];
        updated[existing] = transaction;
        return updated;
    }
    return [transaction, ...transactions];
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
    status: 'idle',
    transactionId: null,
    attemptCount: 0,
    failReason: null,
    transactions: [],

    startPayment: (transactionId) => {
        const { attemptCount, transactionId: existingId } = get();
        set({
            status: 'processing',
            transactionId: existingId ?? transactionId,
            attemptCount: attemptCount + 1,
            failReason: null,
        });
    },

    paymentSuccess: (amount, currency) => {
        const { transactionId, attemptCount, transactions } = get();
        if (!transactionId) return;
        const updated = addOrUpdateTransaction(transactions, transactionId, amount, currency, 'success', attemptCount);
        saveHistory(updated);
        set({ status: 'success', transactions: updated });
    },

    paymentFailed: (reason, amount, currency) => {
        const { transactionId, attemptCount, transactions } = get();
        if (!transactionId) return;
        const updated = addOrUpdateTransaction(transactions, transactionId, amount, currency, 'failed', attemptCount, reason);
        saveHistory(updated);
        set({ status: 'failed', failReason: reason, transactions: updated });
    },

    paymentTimeout: (amount, currency) => {
        const { transactionId, attemptCount, transactions } = get();
        if (!transactionId) return;
        const updated = addOrUpdateTransaction(transactions, transactionId, amount, currency, 'timeout', attemptCount, 'Request timed out');
        saveHistory(updated);
        set({ status: 'timeout', failReason: 'Request timed out', transactions: updated });
    },

    resetPayment: () => {
        set({
            status: 'idle',
            transactionId: null,
            attemptCount: 0,
            failReason: null,
        });
    },

    loadHistory: () => {
        const stored = localStorage.getItem('transactions');
        if (stored) {
            set({ transactions: JSON.parse(stored) });
        }
    },
}));
