'use client';

import { PaymentStatus } from '@/types';
import { Button, Spin } from 'antd';
import { BiSolidError, BiSolidTime } from 'react-icons/bi';
import { TiTick } from 'react-icons/ti';

interface StatusScreenProps {
    status: PaymentStatus;
    failReason: string | null;
    attemptCount: number;
    maxRetries: number;
    canRetry: boolean;
    onRetry: () => void;
    onNewPayment: () => void;
}

export default function StatusScreen({ status, failReason, attemptCount, maxRetries, canRetry, onRetry, onNewPayment }: StatusScreenProps) {
    if (status === 'processing') {
        return (
            <div
                className='w-full flex flex-col items-center text-center py-10'
                role='status'
            >
                <Spin size='large' />
                <p className='text-lg font-medium'>Payment processing...</p>
                <p className='text-sm text-gray-500 mt-1'>Do not close this page</p>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className='w-full flex flex-col items-center text-center py-10'>
                <TiTick
                    className='text-green-700'
                    size={42}
                />
                <h2 className='text-xl font-semibold text-green-700'>Payment Successful</h2>
                <p className='text-gray-500 mt-4'>Your transaction has been completed</p>
                <Button
                    onClick={onNewPayment}
                    type='primary'
                    size='large'
                    className='mt-4'
                >
                    New Payment
                </Button>
            </div>
        );
    }

    if (status === 'failed' || status === 'timeout') {
        const exhausted = attemptCount >= maxRetries;

        return (
            <div className='w-full flex flex-col items-center text-center py-10'>
                {status === 'timeout' ? (
                    <BiSolidTime
                        className='text-red-700'
                        size={42}
                    />
                ) : (
                    <BiSolidError
                        className='text-red-700'
                        size={42}
                    />
                )}
                <h2 className='text-xl font-semibold text-red-700'>{status === 'timeout' ? 'Request Timed Out' : 'Payment Failed'}</h2>
                <p className='text-gray-500 mt-1'>{failReason}</p>
                <p className='text-sm text-gray-400 mt-2'>
                    Attempt {attemptCount} of {maxRetries}
                </p>

                {exhausted ? (
                    <div className='mt-6'>
                        <p className='text-red-600 font-medium mb-3'>Maximum attempts reached</p>
                        <Button
                            onClick={onNewPayment}
                            size='large'
                            variant='solid'
                            color='danger'
                        >
                            Start New Payment
                        </Button>
                    </div>
                ) : canRetry ? (
                    <Button
                        onClick={onRetry}
                        type='primary'
                        size='large'
                        className='mt-6'
                        variant='solid'
                    >
                        Retry Payment
                    </Button>
                ) : null}
            </div>
        );
    }

    return null;
}
