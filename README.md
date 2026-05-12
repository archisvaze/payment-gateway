# Payment Gateway

A simulated payment gateway UI built with Next.js (App Router), TypeScript, Tailwind CSS, Ant Design and Zustand.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

- **Next.js 16**
- **TypeScript**
- **Tailwind CSS**
- **Zustand**
- **react-credit-cards-2**

## Features

- Real-time form validation with per-field error messages on blur
- Auto-formatting card number (spaces every 4 digits) and expiry (MM/YY)
- Card type detection (Visa, Mastercard)
- Live card preview that updates as you type
- Full payment lifecycle: Idle → Processing → Success / Failed / Timeout
- Mock API at `/api/pay` with randomized outcomes (60% success, 25% failure, 15% timeout)
- Frontend timeout handling via AbortController (6s cutoff)
- Retry logic with max 3 attempts per transaction
- Idempotent transactions using `crypto.randomUUID()`
- Persistent transaction history via localStorage
- Expandable transaction detail view
- Responsive layout

## Assumptions

- Card validation is format-based only (length, prefix, expiry date)
- The mock API uses `Math.random()` for outcome simulation.
- Currency selector supports INR and USD. No exchange rate logic.
- Transaction history is stored in localStorage with no size limit enforcement.

## What I'd Improve Given More Time

- Add transition animations between payment states
- Add unit tests for validation and formatting utils
- Add export/clear functionality for transaction history
- Add Accessiblilty visible labels, `aria-describedby` on errors, focus management on state transitions
