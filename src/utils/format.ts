import { CardType } from '@/types';

export function detectCardType(cardNumber: string): CardType {
    const digits = cardNumber.replace(/\s/g, '');
    if (/^4/.test(digits)) {
        return 'visa';
    }
    if (/^5[1-5]/.test(digits)) {
        return 'mastercard';
    }
    return 'unknown';
}

export function formatCardNumber(value: string): string {
    const digits = value.replace(/\D/g, '');
    const trimmed = digits.slice(0, 16);
    return trimmed.replace(/(.{4})/g, '$1 ').trim();
}

export function formatExpiry(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) {
        return digits.slice(0, 2) + '/' + digits.slice(2);
    }
    return digits;
}
