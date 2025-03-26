import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaHeart, FaGamepad, FaHome, FaTimes } from 'react-icons/fa';
import { debounce } from 'lodash';
import { searchGames } from '../services/api';
import './Header.css';

export default function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const navigate = useNavigate();

    const debouncedSearch = debounce(async (query) => {
        if (query.trim().length > 1) {
            setIsSearching(true);
            try {
                const results = await searchGames(query);
                setSearchResults(results);
            } catch (error) {
                console.error('Search error:', error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        } else {
            setSearchResults([]);
        }
    }, 500);

    useEffect(() => {
        debouncedSearch(searchQuery);
        return () => debouncedSearch.cancel();
    }, [searchQuery]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?query=${searchQuery}`);
            setSearchQuery('');
            setShowSuggestions(false);
        }
    };

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="logo">
                    <FaGamepad className="logo-icon" />
                    <span>GameHub</span>
                </Link>

                <form onSubmit={handleSearch} className="search-container">
                    <div className="search-input-wrapper">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Поиск игр..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setShowSuggestions(true);
                            }}
                            onFocus={() => setShowSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                className="clear-search"
                                onClick={() => setSearchQuery('')}
                            >
                                <FaTimes />
                            </button>
                        )}
                    </div>

                    {showSuggestions && searchQuery && (
                        <div className="search-suggestions">
                            {isSearching ? (
                                <div className="suggestion-item">Searching...</div>
                            ) : searchResults.length > 0 ? (
                                searchResults.map(game => (
                                    <Link
                                        key={game.id}
                                        to={`/game/${game.id}`}
                                        className="suggestion-item"
                                        onClick={() => setShowSuggestions(false)}
                                    >
                                        {game.name}
                                    </Link>
                                ))
                            ) : (
                                <div className="suggestion-item">No results</div>
                            )}
                        </div>
                    )}
                </form>

                <nav className="nav-links">
                    <Link to="/" className="nav-link" title="Главная">
                        <FaHome />
                    </Link>
                    <Link to="/favorites" className="nav-link" title="Избранное">
                        <FaHeart />
                    </Link>
                </nav>
            </div>
        </header>
    );
}