'use client';

import CardInput, { CardFormData } from '@/components/CardInput';
import CardPreview from '@/components/CardPreview';
import { usePayment } from '@/hooks/usePayment';
import { usePaymentStore } from '@/store/usePaymentStore';
import { useState } from 'react';

const initialForm: CardFormData = {
    cardholderName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    amount: '',
    currency: 'INR',
};

export default function page() {
    const [form, setForm] = useState<CardFormData>(initialForm);
    const [focusedField, setFocusedField] = useState<'name' | 'number' | 'expiry' | 'cvc' | undefined>(undefined);

    const { status, attemptCount, failReason, canRetry, maxRetries, submitPayment, resetPayment } = usePayment();

    const transactions = usePaymentStore((s) => s.transactions);
    const loadHistory = usePaymentStore((s) => s.loadHistory);

    function handleSubmit() {
        console.log(form);
    }

    return (
        <main className='min-h-screen bg-gray-50 py-8 px-4'>
            <div className='max-w-5xl mx-auto border'>
                <h1 className='text-2xl font-bold text-center my-8'>Payment Gateway</h1>

                <CardPreview
                    cardNumber={form.cardNumber}
                    cardholderName={form.cardholderName}
                    expiry={form.expiry}
                    cvv={form.cvv}
                    focused={focusedField}
                />

                <CardInput
                    form={form}
                    onChange={setForm}
                    onFocusChange={setFocusedField}
                    onSubmit={handleSubmit}
                    disabled={false}
                />
            </div>
        </main>
    );
}
