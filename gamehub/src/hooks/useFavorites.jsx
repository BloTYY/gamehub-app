import { useState, useEffect } from 'react';

export const useFavorites = () => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const loadFavorites = () => {
            try {
                const saved = localStorage.getItem('favoriteGames');
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (Array.isArray(parsed)) {
                        setFavorites(parsed);
                    }
                }
            } catch (error) {
                console.error("Failed to load favorites:", error);
                localStorage.removeItem('favoriteGames');
            }
        };

        loadFavorites();
    }, []);

    useEffect(() => {
        localStorage.setItem('favoriteGames', JSON.stringify(favorites));
    }, [favorites]);

    const addToFavorites = (game) => {
        setFavorites(prevFavorites => {
            if (!prevFavorites.some(fav => fav.id === game.id)) {
                return [...prevFavorites, game];
            }
            return prevFavorites;
        });
    };

    const removeFromFavorites = (gameId) => {
        setFavorites(prevFavorites =>
            prevFavorites.filter(game => game.id !== gameId)
        );
    };

    const isFavorite = (gameId) => {
        return favorites.some(game => game.id === gameId);
    };

    return {
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite
    };
};