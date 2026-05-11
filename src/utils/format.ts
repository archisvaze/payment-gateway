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
