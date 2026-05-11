import { CardType } from '@/types';

export function validateName(name: string): string | null {
    if (name.trim().length === 0) {
        return 'Cardholder name is required';
    }
    return null;
}

export function validateCardNumber(cardNumber: string): string | null {
    const digits = cardNumber.replace(/\s/g, '');
    if (digits.length === 0) {
        return 'Card number is required';
    }
    if (digits.length < 15 || digits.length > 16) {
        return 'Card number must be 15-16 digits';
    }
    return null;
}

export function validateExpiry(expiry: string): string | null {
    if (expiry.length === 0) {
        return 'Expiry date is required';
    }
    const match = expiry.match(/^(\d{2})\/(\d{2})$/);
    if (!match) {
        return 'Use MM/YY format';
    }

    const month = parseInt(match[1], 10);
    const year = parseInt(match[2], 10) + 2000;

    if (month < 1 || month > 12) {
        return 'Invalid month';
    }

    const now = new Date();
    const expiryDate = new Date(year, month);
    if (expiryDate <= now) {
        return 'Card has expired';
    }

    return null;
}

export function validateCVV(cvv: string, cardType: CardType): string | null {
    if (cvv.length === 0) {
        return 'CVV is required';
    }
    if (cvv.length !== 3) {
        return `CVV must be 3 digits`;
    }
    return null;
}

export function validateAmount(amount: string): string | null {
    if (amount.length === 0) {
        return 'Amount is required';
    }
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
        return 'Amount must be greater than 0';
    }
    return null;
}
