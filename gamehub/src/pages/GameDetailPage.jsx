import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchGameDetails } from '../services/api';
import { useFavorites } from '../hooks/useFavorites';
import { FaArrowLeft, FaStar, FaRegStar, FaCalendarAlt, FaClock, FaGamepad } from 'react-icons/fa';
import './GameDetailPage.css';

const GameDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

    useEffect(() => {
        let isMounted = true;

        const loadGameData = async () => {
            try {
                setLoading(true);
                setError(null);
                const gameData = await fetchGameDetails(id);

                if (!isMounted) return;

                if (!gameData) {
                    throw new Error('Game not found');
                }
                setGame(gameData);
            } catch (err) {
                if (isMounted) {
                    console.error('Failed to load game:', err);
                    setError(err.message);
                    setGame(null);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadGameData();

        return () => {
            isMounted = false;
        };
    }, [id]);

    const handleFavoriteToggle = () => {
        if (!game) return;

        if (isFavorite(game.id)) {
            removeFromFavorites(game.id);
        } else {
            addToFavorites({
                id: game.id,
                name: game.name,
                background_image: game.background_image,
                rating: game.rating,
                released: game.released
            });
        }
    };

    if (loading) {
        return (
            <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading game details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-state">
                <h2>Error Loading Game</h2>
                <p>{error}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="back-button"
                >
                    <FaArrowLeft /> Back to games
                </button>
            </div>
        );
    }

    if (!game) {
        return (
            <div className="not-found-state">
                <h2>Game Not Found</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="back-button"
                >
                    <FaArrowLeft /> Back to games
                </button>
            </div>
        );
    }

    return (
        <div className="game-detail-container">
            {}
            <button
                onClick={() => navigate(-1)}
                className="back-button"
            >
                <FaArrowLeft /> Back to games
            </button>

            {}
            <div className="game-header">
                <h1>{game.name}</h1>
                <button
                    onClick={handleFavoriteToggle}
                    className={`favorite-btn ${isFavorite(game.id) ? 'active' : ''}`}
                    aria-label={isFavorite(game.id) ? 'Remove from favorites' : 'Add to favorites'}
                >
                    {isFavorite(game.id) ? (
                        <>
                            <FaStar /> Remove from Favorites
                        </>
                    ) : (
                        <>
                            <FaRegStar /> Add to Favorites
                        </>
                    )}
                </button>
            </div>

            {}
            <div className="game-content">
                {}
                <div className="game-media">
                    <img
                        src={game.background_image || '/placeholder-game.jpg'}
                        alt={game.name}
                        className="game-image"
                        loading="lazy"
                        onError={(e) => {
                            e.target.src = '/placeholder-game.jpg';
                        }}
                    />
                    {game.rating && (
                        <div className="rating-badge">
                            <FaStar /> {game.rating.toFixed(1)}
                        </div>
                    )}
                </div>

                {}
                <div className="game-info">
                    {}
                    <div className="game-meta">
                        <div className="meta-item">
                            <FaCalendarAlt />
                            <span>{game.released || 'Coming Soon'}</span>
                        </div>
                        <div className="meta-item">
                            <FaClock />
                            <span>{game.playtime || 'N/A'} hours</span>
                        </div>
                    </div>

                    {}
                    {game.description && (
                        <div className="game-description-section">
                            <h3>About</h3>
                            <div
                                className="game-description"
                                dangerouslySetInnerHTML={{ __html: game.description }}
                            />
                        </div>
                    )}

                    {}
                    {game.platforms?.length > 0 && (
                        <div className="platforms-section">
                            <h3><FaGamepad /> Available Platforms</h3>
                            <div className="platforms-grid">
                                {game.platforms.map(p => (
                                    <div key={p.platform.id} className="platform-tag">
                                        {p.platform.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GameDetailPage;