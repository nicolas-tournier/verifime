export const invoiceDummyData = {
    "invoices": [
        {
            "currency": "NZD",
            "date": "2020-07-07",
            "lines": [
                { "description": "Intel Core i9", "currency": "USD", "amount": 700 },
                { "description": "ASUS ROG Strix", "currency": "AUD", "amount": 500 }
            ]
        },
        {
            "currency": "EUR",
            "date": "2020-07-07",
            "lines": [
                { "description": "Intel Core i9", "currency": "USD", "amount": 700 },
                { "description": "ASUS ROG Strix", "currency": "AUD", "amount": 500 }
            ]
        }
    ]
}

export type T_InvoiceDummyData = {
    invoices: {
        currency: string;
        date: string;
        lines: {
            description: string;
            currency: string;
            amount: number;
        }[];
    }[];
}