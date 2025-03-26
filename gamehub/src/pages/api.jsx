const API_KEY = '0eb171b788b945f4b71307847f6ff839';
const BASE_URL = 'https://api.rawg.io/api';

export async function fetchGames(params = {}) {
    const url = new URL(`${BASE_URL}/games`);
    url.searchParams.set('key', API_KEY);
    Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.set(key, value);
    });

    const response = await fetch(url);
    const data = await response.json();
    return data.results;
}