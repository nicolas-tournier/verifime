export const invoiceDummyData = {
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

const a = { "invoices": [{ "id": 0, "totalAfterConversion": 1150.94, "baseCurrency": "NZD", "issueDate": "2020-07-07", "lineItems": [{ "id": 0, "description": "Intel Core i9", "currency": "USD", "amount": 700 }] }, { "id": 1, "totalAfterConversion": 475.29, "baseCurrency": "EUR", "issueDate": "2020-07-07", "lineItems": [{ "id": 0, "description": "Intel Core i9", "currency": "CAD", "amount": 700 }] }] }

// value sent to invoices
export type T_InvoiceData = {
    id: number;
    currency: string;
    date: string;
    lines: {
        id: number;
        description: string;
        currency: string;
        amount: number;
    }[];
}

export type T_InvoicesData = {
    invoices: T_InvoiceData[];
}
