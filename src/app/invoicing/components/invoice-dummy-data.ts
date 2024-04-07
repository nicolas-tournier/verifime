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
