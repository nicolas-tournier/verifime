'use server';

const host = 'api.frankfurter.app';

export type T_ConvertedCurrency = {
    amount: number;
    currencyTo: string;
    currencyFrom: string;
}

/**
 * Fetches the amount of one currency when converted from another.
 *
 * @param amount - The amount of currency to convert.
 * @param from - The currency to convert from.
 * @param to - The currency to convert to.
 * @returns A Promise that resolves to a string representing the conversion result.
 */
export async function fetchCurrency(amount: number, from: string, to: string): Promise<T_ConvertedCurrency> {
    // Cannot be the same as 'from'
    if ((from === to) || amount === 0 || isNaN(amount)) {
        return Promise.resolve({
            amount: amount,
            currencyTo: to,
            currencyFrom: from
        });
    }

    // Set cache headers for 1 hour (3600 seconds)
    const cacheOptions = {
        next: {
            revalidate: 3600
        }
    };

    try {
        const response = await fetch(`https://${host}/latest?amount=${amount}&from=${from}&to=${to}`, cacheOptions);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        return {
            amount: data.rates[to],
            currencyTo: to,
            currencyFrom: from
        };
    } catch (error) {
        console.error('Error fetching conversions:', error);
        throw new Error('Error fetching conversions.');
    }
}
