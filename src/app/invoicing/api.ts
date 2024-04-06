'use server';

const host = 'api.frankfurter.app';

export type T_ConvertedCurrency = {
    amount: number;
    currencyTo: string;
    currencyFrom: string;
}

/**


Fetches the amount of one currency when converted from another.

@param amount - The amount of currency to convert.

@param from - The currency to convert from.

@param to - The currency to convert to.

@returns A Promise that resolves to a string representing the conversion result.
*/

export async function fetchCurrency(amount: number, from: string, to: string): Promise<T_ConvertedCurrency> {
    return fetch(`https://${host}/latest?amount=${amount}&from=${from}&to=${to}`)
        .then(resp => resp.json())
        .then((data) => {
            console.log('data ', data);
            return {
                amount: data.rates[to],
                currencyTo: to,
                currencyFrom: from
            }
        });
}