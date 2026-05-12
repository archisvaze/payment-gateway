'use client';

import { CardFormData } from '@/components/CardInput';
import CardPreview from '@/components/CardPreview';
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

    return (
        <main className='min-h-screen bg-gray-50 py-8 px-4'>
            <div className='max-w-5xl mx-auto border'>
                <h1 className='text-2xl font-bold text-center mb-8'>Payment Gateway</h1>

                <CardPreview
                    cardNumber={form.cardNumber}
                    cardholderName={form.cardholderName}
                    expiry={form.expiry}
                    cvv={form.cvv}
                    focused={focusedField}
                />
            </div>
        </main>
    );
}
