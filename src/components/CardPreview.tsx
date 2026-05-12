'use client';

import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';

interface CardPreviewProps {
    cardNumber: string;
    cardholderName: string;
    expiry: string;
    cvv: string;
    focused: 'number' | 'name' | 'expiry' | 'cvc' | undefined;
}

export default function CardPreview({ cardNumber, cardholderName, expiry, cvv, focused }: CardPreviewProps) {
    return (
        <div className='flex justify-center'>
            <Cards
                number={cardNumber.replace(/\s/g, '')}
                name={cardholderName || 'YOUR NAME'}
                expiry={expiry.replace('/', '')}
                cvc={cvv}
                focused={focused}
            />
        </div>
    );
}
