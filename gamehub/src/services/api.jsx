
const API_KEY = '0eb171b788b945f4b71307847f6ff839';
const BASE_URL = 'https://api.rawg.io/api';

export async function fetchGames(params = {}) {
    const url = new URL(`${BASE_URL}/games`);
    url.searchParams.set('key', API_KEY);

    Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.set(key, value);
    });

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error fetching games:', error);
        return { results: [] };
    }
}

export async function fetchGameDetails(id) {
    if (!id) return null;

    try {
        const response = await fetch(`${BASE_URL}/games/${id}?key=${API_KEY}`);
        if (!response.ok) throw new Error('Game not found');
        return await response.json();
    } catch (error) {
        console.error('Error fetching game details:', error);
        return null;
    }
}

export async function searchGames(query) {
    try {
        const response = await fetch(`${BASE_URL}/games?search=${query}&page_size=5&key=${API_KEY}`);
        if (!response.ok) throw new Error('Network error');
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error('Search failed:', error);
        return [];
    }
}