'use client';

import { Currency } from '@/types';
import { useState } from 'react';

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

export default function CardInput({ form, onChange, onFocusChange, onSubmit, disabled }: CardInputProps) {
    const [selected, setSelected] = useState({});
    return <div>CardInput</div>;
}
