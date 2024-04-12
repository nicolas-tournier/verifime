'use server';

const host = 'api.frankfurter.app';

export type T_ConvertedCurrency = {
    base: string;
    date: string;
    rates: Record<string, number>;
}

/**


Fetches currency exchange rates from a given date for a specific base currency and target currencies.

@param date - The date for which to fetch the exchange rates.
@param from - The base currency.
@param to - An array of target currencies.
@returns A promise that resolves to an object containing the base currency, date, and rates.
@throws An error if the data fetching fails.
*/
export async function fetchCurrencyExchangeRates(date: string, from: string, to: Array<string>): Promise<T_ConvertedCurrency> {

    // Set cache headers for 1 hour (3600 seconds)
    const cacheOptions = {
        next: {
            revalidate: 3600
        }
    };

    try {
        const url = `https://${host}/${date}?from=${from}&to=${to.join(",")}`;
        console.log('fetching from:', url);
        const response = await fetch(url, cacheOptions);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data: T_ConvertedCurrency = await response.json();

        return {
            base: data.base,
            date: data.date,
            rates: data.rates
        };
    } catch (error) {
        console.error('Error fetching conversions:', error);
        throw new Error('Error fetching conversions.');
    }
}
