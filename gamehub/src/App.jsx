import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage.jsx';
import GameDetailPage from './pages/GameDetailPage.jsx';
import Favorites from './pages/FavoritesPage.jsx';

export default function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/game/:id" element={<GameDetailPage />} />
                <Route path="/favorites" element={<Favorites />} />
            </Routes>
        </Router>
    );
}