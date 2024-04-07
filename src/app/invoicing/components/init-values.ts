import dayjs, { Dayjs } from 'dayjs';

export const invoiceInit = [
    {
        id: 0,
        baseCurrency: 'NZD',
        totalAfterConversion: 0,
        issueDate: dayjs().format('YYYY-MM-DD'),
        lineItems: [
            { id: 0, description: "", currency: "AUD", amount: 1 }
        ]
    }
]

export const lineItemInit = {
    id: 0,
    description: '',
    currency: 'AUD',
    amount: 1
}