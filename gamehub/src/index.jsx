import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import GameDetail from './pages/GameDetailPage.jsx';
import Favorites from './pages/Favorites.jsx';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/game/:id" element={<GameDetail />} />
                <Route path="/favorites" element={<Favorites />} />
            </Routes>
        </Router>
    );
}