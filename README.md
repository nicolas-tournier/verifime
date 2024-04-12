# Invoice Calculator

See it running here: https://supercorp-plum.vercel.app/invoicing

This application is an invoice calculator that allows users to convert line item values of any given currency to a base currency and display an invoice total.

A separate report is provided which shows totals by invoice after conversion to the nominated base currency, in addition to totals for the line items grouped by currency type in the original denominations.

Invoices can be imported and exported via copy and paste of JSON according to the following schema:

```json
{
    "invoices": [
        {
            "currency": "NZD",
            "date": "2020-07-07",
            "lines": [
                { "description": "Intel Core i9", "currency": "USD", "amount": 700 },
                { "description": "ASUS ROG Strix", "currency": "AUD", "amount": 500 },
                { "description": "ASUS ROG Strixx", "currency": "AUD", "amount": 5100 }
            ]
        },
        {
            "currency": "EUR",
            "date": "2020-07-07",
            "lines": [
                { "description": "Intel Core i9", "currency": "CAD", "amount": 700 },
                { "description": "ASUS ROG Strix", "currency": "NZD", "amount": 500 }
            ]
        }
    ]
}

```

## Conervsion Service

Conversion is handled by the https://www.frankfurter.app/ service.

## Material UI

This application uses [Material-UI](https://mui.com/), a popular React UI framework, for its user interface. Material-UI provides a set of React components that implement Google's Material Design.

## Next.js

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
