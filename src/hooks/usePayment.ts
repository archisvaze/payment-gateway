import { usePaymentStore } from '@/store/usePaymentStore';
import { Currency, PaymentPayload } from '@/types';
import { useCallback } from 'react';

const MAX_RETRIES = 3;
const TIMEOUT_MS = 6000;

export function usePayment() {
    const { status, transactionId, attemptCount, failReason, startPayment, paymentSuccess, paymentFailed, paymentTimeout, resetPayment } =
        usePaymentStore();

    const canRetry = attemptCount < MAX_RETRIES && (status === 'failed' || status === 'timeout');

    const submitPayment = useCallback(
        async (formData: {
            cardholderName: string;
            cardNumber: string;
            expiry: string;
            cvv: string;
            amount: string;
            currency: Currency;
        }) => {
            const id = transactionId ?? crypto.randomUUID();
            const amount = parseFloat(formData.amount);

            startPayment(id);

            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

            try {
                const payload: PaymentPayload = {
                    transactionId: id,
                    cardholderName: formData.cardholderName,
                    cardNumber: formData.cardNumber.replace(/\s/g, ''),
                    expiry: formData.expiry,
                    cvv: formData.cvv,
                    amount,
                    currency: formData.currency,
                };

                const res = await fetch('/api/pay', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                    signal: controller.signal,
                });

                clearTimeout(timer);

                const data = await res.json();

                if (data.success) {
                    paymentSuccess(amount, formData.currency);
                } else {
                    paymentFailed(data.reason || 'Payment declined', amount, formData.currency);
                }
            } catch (err: unknown) {
                clearTimeout(timer);

                if (err instanceof DOMException && err.name === 'AbortError') {
                    paymentTimeout(amount, formData.currency);
                } else {
                    paymentFailed('Network error. Please try again.', amount, formData.currency);
                }
            }
        },
        [transactionId, startPayment, paymentSuccess, paymentFailed, paymentTimeout],
    );

    return {
        status,
        transactionId,
        attemptCount,
        failReason,
        canRetry,
        maxRetries: MAX_RETRIES,
        submitPayment,
        resetPayment,
    };
}
