import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaArrowLeft, FaGamepad } from 'react-icons/fa';
import './FavoritesPage.css';

const FavoritesPage = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFavorites = () => {
            try {
                const savedFavorites = localStorage.getItem('favoriteGames');
                if (savedFavorites) {
                    setFavorites(JSON.parse(savedFavorites));
                }
            } catch (error) {
                console.error('Failed to load favorites:', error);
            } finally {
                setLoading(false);
            }
        };

        loadFavorites();
    }, []);

    const handleRemoveFavorite = (gameId) => {
        setFavorites(prev => {
            const updatedFavorites = prev.filter(game => game.id !== gameId);
            localStorage.setItem('favoriteGames', JSON.stringify(updatedFavorites));
            return updatedFavorites;
        });
    };

    if (loading) {
        return (
            <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading your favorites...</p>
            </div>
        );
    }

    return (
        <div className="favorites-page">
            <div className="favorites-header">
                <h1>
                    <FaHeart className="heart-icon" /> Your Favorite Games
                </h1>
            </div>

            {favorites.length > 0 ? (
                <div className="favorites-grid">
                    {favorites.map(game => (
                        <div key={game.id} className="favorite-card">
                            <Link to={`/game/${game.id}`} className="game-link">
                                <div className="image-wrapper">
                                    <img
                                        src={game.background_image || '/placeholder-game.jpg'}
                                        alt={game.name}
                                        loading="lazy"
                                        onError={(e) => {
                                            e.target.src = '/placeholder-game.jpg';
                                        }}
                                    />
                                </div>
                                <div className="game-info">
                                    <h3>{game.name}</h3>
                                    <div className="game-meta">
                                        <span>⭐ {game.rating?.toFixed(1) || 'N/A'}</span>
                                        <span>📅 {game.released || 'TBA'}</span>
                                    </div>
                                </div>
                            </Link>
                            <button
                                className="remove-button"
                                onClick={() => handleRemoveFavorite(game.id)}
                                aria-label="Remove from favorites"
                            >
                                <FaHeart /> Remove
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <FaGamepad className="empty-icon" />
                    <h2>No Favorites Yet</h2>
                    <p>You haven't added any games to your favorites.</p>
                    <Link to="/" className="browse-button">
                        Browse Games
                    </Link>
                </div>
            )}
        </div>
    );
};

export default FavoritesPage;