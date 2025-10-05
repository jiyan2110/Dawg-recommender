import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchPage = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    // This is a simplified search logic for demonstration.
    // In a real-world app, this would involve more sophisticated natural language processing.
    const handleSearch = () => {
        const lowerQuery = query.toLowerCase();
        const presets = {};

        if (lowerQuery.includes('small') || lowerQuery.includes('little')) presets.size = 'Small';
        if (lowerQuery.includes('big') || lowerQuery.includes('large')) presets.size = 'Large';
        if (lowerQuery.includes('no shed') || lowerQuery.includes("doesn't shed")) presets.shedding = 0.0;
        if (lowerQuery.includes('calm') || lowerQuery.includes('low energy')) presets.energy = 0.25;
        if (lowerQuery.includes('loyal')) presets.temperament = ['Loyal'];
        
        // Navigate to the recommendation page with the extracted presets
        navigate('/recommend', { state: { presets } });
    };

    return (
        <div className="container">
            <header className="page-header fade-in">
                <h1 className="page-title">Search by Description 🗣️</h1>
                <p className="page-subtitle">
                    Describe your ideal dog, and we'll find the best breeds for you.
                </p>
            </header>

            <main style={{ maxWidth: '700px', margin: '0 auto' }}>
                <div className="card fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="form-group">
                        <label htmlFor="search-query" className="form-label">Your ideal dog is...</label>
                        <textarea
                            id="search-query"
                            className="form-input"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="e.g., a small, friendly dog that doesn't shed much and is good with kids."
                            rows="4"
                            style={{ resize: 'vertical', minHeight: '100px' }}
                        />
                    </div>
                    <button 
                        className="btn btn-primary" 
                        onClick={handleSearch}
                        style={{ width: '100%' }}
                    >
                        Find My Dog
                    </button>
                </div>

                <div className="fade-in" style={{ marginTop: '32px', animationDelay: '0.2s', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '18px', marginBottom: '16px', color: '#52525b' }}>
                        💡 Try examples like:
                    </h3>
                    <ul style={{ listStyle: 'none', padding: 0, color: '#71717a' }}>
                        <li style={{ marginBottom: '8px' }}>"A calm and loyal companion for a small apartment"</li>
                        <li>"A big, energetic dog that's great with children"</li>
                    </ul>
                </div>
            </main>
        </div>
    );
};

export default SearchPage;

