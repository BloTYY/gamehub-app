import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchGames } from '../services/api';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import './HomePage.css';

export default function HomePage() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('favoriteGames');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('favoriteGames', JSON.stringify(favorites));
    }, [favorites]);

    const loadGames = async (pageNum) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetchGames({
                page_size: 15,
                page: pageNum
            });
            const newGames = response.results || [];

            setGames(prev => pageNum === 1 ? newGames : [...prev, ...newGames]);
            setHasMore(newGames.length > 0);
        } catch (err) {
            console.error('Error loading games:', err);
            setError('Failed to load games. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = (game) => {
        setFavorites(prev => {
            const isFavorite = prev.some(fav => fav.id === game.id);
            if (isFavorite) {
                return prev.filter(fav => fav.id !== game.id);
            } else {
                return [...prev, game];
            }
        });
    };

    useEffect(() => {
        loadGames(page);
    }, [page]);

    const loadMore = () => {
        if (!loading) {
            setPage(prev => prev + 1);
        }
    };

    if (loading && page === 1) return <LoadingState />;
    if (error) return <ErrorState error={error} onRetry={() => {
        setPage(1);
        loadGames(1);
    }} />;
    if (games.length === 0 && !loading) return <EmptyState />;

    return (
        <div className="home-page">
            <HeroSection />

            <div className="games-grid">
                {games.map(game => {
                    const isFavorite = favorites.some(fav => fav.id === game.id);
                    return (
                        <GameCard
                            key={game.id}
                            game={game}
                            isFavorite={isFavorite}
                            onToggleFavorite={() => toggleFavorite(game)}
                        />
                    );
                })}
            </div>

            {hasMore && (
                <LoadMoreButton
                    loading={loading}
                    onClick={loadMore}
                />
            )}
        </div>
    );
}

function HeroSection() {
    return (
        <section className="hero-section">
            <h1>Discover Your Next Favorite Game</h1>
            <p>Explore thousands of games across all platforms</p>
        </section>
    );
}

function GameCard({ game, isFavorite, onToggleFavorite }) {
    return (
        <article className="game-card">
            <Link to={`/game/${game.id}`} className="card-link">
                <div className="image-container">
                    <img
                        src={game.background_image || '/placeholder-game.jpg'}
                        alt={game.name}
                        loading="lazy"
                        onError={(e) => {
                            e.target.src = '/placeholder-game.jpg';
                        }}
                    />
                    <div className="rating-badge">
                        <span>⭐ {game.rating?.toFixed(1) || 'N/A'}</span>
                    </div>
                </div>
            </Link>

            <div className="game-info">
                <h3>{game.name}</h3>
                <div className="meta-data">
                    <span className="release-date">
                        📅 {game.released || 'Coming soon'}
                    </span>
                    <span className="platforms">
                        🎮 {game.platforms?.slice(0, 3).map(p => p.platform.name).join(', ') || 'Multiplatform'}
                    </span>
                </div>

                <div className="card-actions">
                    <Link to={`/game/${game.id}`} className="view-button">
                        View Details
                    </Link>
                    <button
                        className={`favorite-button ${isFavorite ? 'active' : ''}`}
                        onClick={(e) => {
                            e.preventDefault();
                            onToggleFavorite();
                        }}
                        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                        {isFavorite ? <FaHeart /> : <FaRegHeart />}
                    </button>
                </div>
            </div>
        </article>
    );
}

function LoadMoreButton({ loading, onClick }) {
    return (
        <div className="pagination">
            <button
                onClick={onClick}
                disabled={loading}
                className={`load-more-btn ${loading ? 'loading' : ''}`}
            >
                {loading ? (
                    <>
                        <span className="spinner-small"></span>
                        Loading...
                    </>
                ) : (
                    'Load More Games'
                )}
            </button>
        </div>
    );
}

function LoadingState() {
    return (
        <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading games...</p>
        </div>
    );
}

function ErrorState({ error, onRetry }) {
    return (
        <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h3>Oops! Something went wrong</h3>
            <p>{error}</p>
            <button
                className="retry-button"
                onClick={onRetry}
            >
                Retry
            </button>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="empty-state">
            <div className="empty-icon">🎮</div>
            <h3>No Games Found</h3>
            <p>Try adjusting your search or filters</p>
        </div>
    );
}