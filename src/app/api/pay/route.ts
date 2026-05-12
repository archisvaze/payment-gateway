import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const roll = Math.random();

    // ~60% success
    if (roll < 0.6) {
        await delay(2000);
        return NextResponse.json({ success: true });
    }

    // ~25% failure
    if (roll < 0.85) {
        await delay(2000);
        const reasons = ['Insufficient funds', 'Card declined', 'Do not honor'];
        const reason = reasons[Math.floor(Math.random() * reasons.length)];
        return NextResponse.json({ success: false, reason });
    }

    // ~15% timeout (responds after 8s, frontend aborts at 6s)
    await delay(8000);
    return NextResponse.json({ success: true });
}

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
