'use client';

import { Currency } from '@/types';
import { detectCardType } from '@/utils/format';
import { validateAmount, validateCardNumber, validateCVV, validateExpiry, validateName } from '@/utils/validate';

export interface CardFormData {
    cardholderName: string;
    cardNumber: string;
    expiry: string;
    cvv: string;
    amount: string;
    currency: Currency;
}

interface CardInputProps {
    form: CardFormData;
    onChange: (form: CardFormData) => void;
    onFocusChange: (field: 'name' | 'number' | 'expiry' | 'cvc' | undefined) => void;
    onSubmit: () => void;
    disabled: boolean;
}

export default function CardInput({ form, onSubmit, disabled }: CardInputProps) {
    const cardType = detectCardType(form.cardNumber);

    const errors = {
        cardholderName: validateName(form.cardholderName),
        cardNumber: validateCardNumber(form.cardNumber),
        expiry: validateExpiry(form.expiry),
        cvv: validateCVV(form.cvv, cardType),
        amount: validateAmount(form.amount),
    };

    const isValid = Object.values(errors).every((e) => e === null);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!isValid || disabled) return;
        onSubmit();
    }

    return (
        <form
            onSubmit={handleSubmit}
            className='space-y-4 w-full'
        >
            CardInput
        </form>
    );
}
