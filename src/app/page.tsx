'use client';

import CardInput, { CardFormData } from '@/components/CardInput';
import CardPreview from '@/components/CardPreview';
import StatusScreen from '@/components/StatusScreen';
import TransactionHistory from '@/components/TransactionHistory';
import { usePayment } from '@/hooks/usePayment';
import { usePaymentStore } from '@/store/usePaymentStore';
import { Button, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { FaHistory } from 'react-icons/fa';
import { TiCreditCard } from 'react-icons/ti';

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
    const [historyOpen, setHistoryOpen] = useState(false);

    const { status, attemptCount, failReason, canRetry, maxRetries, submitPayment, resetPayment } = usePayment();

    const transactions = usePaymentStore((s) => s.transactions);
    const loadHistory = usePaymentStore((s) => s.loadHistory);

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    function handleSubmit() {
        submitPayment(form);
    }

    function handleRetry() {
        submitPayment(form);
    }

    function handleNewPayment() {
        resetPayment();
        setForm(initialForm);
    }

    const showForm = status === 'idle';
    const showStatus = status !== 'idle';

    return (
        <>
            <main className='min-h-screen bg-gray-50 py-8 px-4'>
                <div className='max-w-5xl mx-auto'>
                    <div className='w-full flex items-start justify-between gap-4 mb-8'>
                        <div className='flex flex-col items-center text-center flex-1'>
                            <TiCreditCard size={42} />
                            <h1 className='text-2xl font-extrabold mb-4'>Payment Gateway</h1>

                            <Button
                                onClick={() => setHistoryOpen(true)}
                                size='large'
                                type='default'
                                variant='filled'
                            >
                                <FaHistory />
                                <span>Transactions</span>
                            </Button>
                        </div>
                    </div>

                    <CardPreview
                        cardNumber={form.cardNumber}
                        cardholderName={form.cardholderName}
                        expiry={form.expiry}
                        cvv={form.cvv}
                        focused={focusedField}
                    />

                    <div className='my-8'></div>

                    {showForm && (
                        <CardInput
                            form={form}
                            onChange={setForm}
                            onFocusChange={setFocusedField}
                            onSubmit={handleSubmit}
                            disabled={false}
                        />
                    )}

                    {showStatus && (
                        <StatusScreen
                            key={status}
                            status={status}
                            failReason={failReason}
                            attemptCount={attemptCount}
                            maxRetries={maxRetries}
                            canRetry={canRetry}
                            onRetry={handleRetry}
                            onNewPayment={handleNewPayment}
                        />
                    )}
                </div>
            </main>

            <Modal
                title='Transaction History'
                open={historyOpen}
                onCancel={() => setHistoryOpen(false)}
                footer={null}
                width={700}
            >
                <TransactionHistory transactions={transactions} />
            </Modal>
        </>
    );
}
