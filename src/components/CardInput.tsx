'use client';

import { Currency } from '@/types';
import { detectCardType, formatCardNumber, formatExpiry } from '@/utils/format';
import { validateAmount, validateCardNumber, validateCVV, validateExpiry, validateName } from '@/utils/validate';
import { Alert, Button, Input, Select, Tag } from 'antd';
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
    const [selected, setSelected] = useState<Record<string, boolean>>({});

    const cardType = detectCardType(form.cardNumber);

    const errors = {
        cardholderName: validateName(form.cardholderName),
        cardNumber: validateCardNumber(form.cardNumber),
        expiry: validateExpiry(form.expiry),
        cvv: validateCVV(form.cvv, cardType),
        amount: validateAmount(form.amount),
    };

    console.log(errors);

    const isValid = Object.values(errors).every((e) => e === null);

    function update(field: keyof CardFormData, value: string) {
        onChange({ ...form, [field]: value });
    }

    function handleBlur(field: string) {
        setSelected((prev) => ({ ...prev, [field]: true }));
        onFocusChange(undefined);
    }

    function handleSubmit(e: { preventDefault: () => void }) {
        e.preventDefault();

        if (!isValid || disabled) {
            return;
        }

        onSubmit();
    }

    return (
        <form
            onSubmit={handleSubmit}
            className='space-y-4 w-full'
        >
            <div className='form-field-container'>
                <label htmlFor='cardholderName'>Cardholder Name</label>
                <Input
                    id='cardholderName'
                    type='text'
                    value={form.cardholderName}
                    onChange={(e) => update('cardholderName', e.target.value)}
                    placeholder='John Doe'
                    disabled={disabled}
                    size='large'
                    onFocus={() => onFocusChange('name')}
                    onBlur={() => handleBlur('cardholderName')}
                />
                {selected.cardholderName && errors.cardholderName && (
                    <Alert
                        title={errors.cardholderName}
                        type='error'
                    />
                )}
            </div>

            <div className='form-field-container'>
                <label htmlFor='cardNumber'>Card Number</label>
                <Input
                    id='cardNumber'
                    type='text'
                    value={form.cardNumber}
                    onChange={(e) => update('cardNumber', formatCardNumber(e.target.value))}
                    maxLength={19}
                    placeholder='4242 4242 4242 4242'
                    disabled={disabled}
                    size='large'
                    suffix={cardType !== 'unknown' ? <Tag>{cardType}</Tag> : null}
                />
                {selected.cardNumber && errors.cardNumber && (
                    <Alert
                        title={errors.cardNumber}
                        type='error'
                    />
                )}
            </div>

            <div className='form-field-container'>
                <label htmlFor='expiry'>Expiry (MM/YY)</label>
                <Input
                    id='expiry'
                    type='text'
                    value={form.expiry}
                    onChange={(e) => update('expiry', formatExpiry(e.target.value))}
                    maxLength={5}
                    placeholder='12/26'
                    disabled={disabled}
                    size='large'
                />
                {selected.expiry && errors.expiry && (
                    <Alert
                        title={errors.expiry}
                        type='error'
                    />
                )}
            </div>

            <div className='form-field-container'>
                <label htmlFor='cvv'>CVV</label>
                <Input
                    id='cvv'
                    type='password'
                    value={form.cvv}
                    onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '');
                        update('cvv', digits.slice(0, 3));
                    }}
                    maxLength={3}
                    placeholder='123'
                    disabled={disabled}
                    size='large'
                />
                {selected.cvv && errors.cvv && (
                    <Alert
                        title={errors.cvv}
                        type='error'
                    />
                )}
            </div>

            <div className='form-field-container'>
                <label htmlFor='amount'>Amount</label>
                <Input
                    id='amount'
                    type='text'
                    value={form.amount}
                    onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9.]/g, '');
                        update('amount', val);
                    }}
                    placeholder='100.00'
                    disabled={disabled}
                    size='large'
                />
                {selected.amount && errors.amount && (
                    <Alert
                        title={errors.amount}
                        type='error'
                    />
                )}
            </div>

            <div className='form-field-container'>
                <label htmlFor='currency'>Currency</label>
                <Select
                    id='currency'
                    value={form.currency}
                    disabled={disabled}
                    className='w-full'
                    onSelect={(v) => update('currency', v)}
                    options={[
                        { value: 'INR', label: 'INR' },
                        { value: 'USD', label: 'USD' },
                    ]}
                    size='large'
                />
            </div>

            <Button
                htmlType='submit'
                type='primary'
                className='w-full mt-2'
                size='large'
                disabled={!isValid || disabled}
            >
                Pay {form.amount && !errors.amount ? `${form.currency === 'INR' ? '₹ ' : '$ '}${form.amount}` : ''}
            </Button>
        </form>
    );
}
