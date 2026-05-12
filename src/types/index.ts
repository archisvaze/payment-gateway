export type CardType = 'visa' | 'mastercard' | 'amex' | 'unknown';
export type Currency = 'INR' | 'USD';
export type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed' | 'timeout';

export interface Transaction {
    id: string;
    amount: number;
    currency: Currency;
    status: PaymentStatus;
    reason?: string;
    attempts: number;
    timestamp: string;
}

export interface PaymentResponse {
    success: boolean;
    reason?: string;
}

export interface PaymentPayload {
    transactionId: string;
    cardholderName: string;
    cardNumber: string;
    expiry: string;
    cvv: string;
    amount: number;
    currency: Currency;
}
