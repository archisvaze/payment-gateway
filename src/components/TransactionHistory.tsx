'use client';

import { Transaction } from '@/types';
import type { CollapseProps } from 'antd';
import { Collapse, Tag } from 'antd';

interface TransactionHistoryProps {
    transactions: Transaction[];
}

const statusMap: Record<
    string,
    {
        label: string;
        color: string;
    }
> = {
    success: {
        label: 'Success',
        color: 'green',
    },
    failed: {
        label: 'Failed',
        color: 'red',
    },
    timeout: {
        label: 'Timeout',
        color: 'orange',
    },
    processing: {
        label: 'Processing',
        color: 'blue',
    },
};

export default function TransactionHistory({ transactions }: TransactionHistoryProps) {
    if (transactions.length === 0) {
        return <div className='text-center text-gray-400 py-6 text-sm'>No transactions yet</div>;
    }

    const items: CollapseProps['items'] = transactions.map((tx) => {
        const status = statusMap[tx.status] || {
            label: tx.status,
            color: 'default',
        };

        return {
            key: tx.id,

            label: (
                <div className='w-full'>
                    <div className='flex items-center justify-between pr-2'>
                        <span className='text-sm font-mono text-gray-500'>{tx.id.slice(0, 8)}...</span>

                        <Tag color={status.color}>{status.label}</Tag>
                    </div>

                    <div className='flex items-center justify-between mt-1 pr-2'>
                        <span className='font-medium text-sm text-black'>
                            {tx.currency === 'INR' ? '₹' : '$'}
                            {tx.amount.toFixed(2)}
                        </span>

                        <span className='text-xs text-gray-400'>{new Date(tx.timestamp).toLocaleString()}</span>
                    </div>
                </div>
            ),

            children: (
                <div className='space-y-2 text-sm'>
                    <div className='flex justify-between gap-4'>
                        <span className='text-gray-500'>Transaction ID</span>

                        <span className='font-mono break-all text-right'>{tx.id}</span>
                    </div>

                    <div className='flex justify-between gap-4'>
                        <span className='text-gray-500'>Amount</span>

                        <span>
                            {tx.currency === 'INR' ? '₹' : '$'}
                            {tx.amount.toFixed(2)} {tx.currency}
                        </span>
                    </div>

                    <div className='flex justify-between gap-4'>
                        <span className='text-gray-500'>Status</span>

                        <Tag
                            color={status.color}
                            className='m-0'
                        >
                            {status.label}
                        </Tag>
                    </div>

                    {tx.reason && (
                        <div className='flex justify-between gap-4'>
                            <span className='text-gray-500'>Reason</span>

                            <span className='text-right'>{tx.reason}</span>
                        </div>
                    )}

                    <div className='flex justify-between gap-4'>
                        <span className='text-gray-500'>Attempts</span>

                        <span>{tx.attempts}</span>
                    </div>

                    <div className='flex justify-between gap-4'>
                        <span className='text-gray-500'>Time</span>

                        <span className='text-right'>{new Date(tx.timestamp).toLocaleString()}</span>
                    </div>
                </div>
            ),

            classNames: {
                header: '!items-start',
            },
        };
    });

    return (
        <Collapse
            accordion
            items={items}
        />
    );
}
