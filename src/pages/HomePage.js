import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="container">
            <header className="page-header fade-in">
                <h1 className="page-title">Dog Breed Finder 🐾</h1>
                <p className="page-subtitle">
                    Find your perfect canine companion. Let's get started.
                </p>
            </header>

            <main className="grid grid-2">
                {/* AI Recommendation Card */}
                <div 
                    className="card card-clickable fade-in" 
                    onClick={() => navigate('/recommend')}
                    style={{ animationDelay: '0.1s' }}
                >
                    <h2 className="card-title">
                        <span role="img" aria-label="sparkles" style={{ marginRight: '12px' }}>✨</span>
                        AI Recommendation
                    </h2>
                    <p className="card-subtitle">
                        Use our interactive filters to find the perfect breed for your lifestyle. Adjust energy levels, size, grooming needs, and more for a personalized match.
                    </p>
                </div>

                {/* Natural Language Search Card */}
                <div 
                    className="card card-clickable fade-in" 
                    onClick={() => navigate('/search')}
                    style={{ animationDelay: '0.2s' }}
                >
                    <h2 className="card-title">
                        <span role="img" aria-label="speech bubble" style={{ marginRight: '12px' }}>🗣️</span>
                        Natural Language Search
                    </h2>
                    <p className="card-subtitle">
                        Simply describe your ideal dog in your own words. For example, "a small, friendly dog that doesn't shed much," and let our AI find the best matches for you.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default HomePage;
