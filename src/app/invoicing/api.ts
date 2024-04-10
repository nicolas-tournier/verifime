'use server';

const host = 'api.frankfurter.app';

export type T_ConvertedCurrency = {
    base: string;
    date: string;
    rates: Record<string, number>;
}
/**
 * Fetches the amount of one currency when converted from another.
 *
 * @param amount - The amount of currency to convert.
 * @param from - The currency to convert from.
 * @param to - The currency to convert to.
 * @returns A Promise that resolves to a string representing the conversion result.
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
