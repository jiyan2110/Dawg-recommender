import React, { useState } from 'react';
import dogData from '../data/dog_breeds_FINAL_CORRECTED.json'; // We need this to get full dog details for the cards
import BreedCard from '../components/BreedCard';

const SearchPage = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searched, setSearched] = useState(false); // To know if a search has been performed

    const handleSearch = async () => {
        if (!query.trim()) {    
            setError('Please enter a description.');
            return;
        }
        
        setIsLoading(true);
        setError(null);
        setSearched(true); // Mark that a search has been attempted

        try {
            // Call our new backend API
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: query }),
            });

            if (!response.ok) {
                throw new Error('Something went wrong with the search. Please try again.');
            }

            const data = await response.json();
            
            // The API returns breed names. We find the full dog object from our JSON.
            const fullResults = data.breeds.map(result => {
                const dogInfo = dogData.find(dog => dog.breed === result.breed);
                return { ...dogInfo, matchScore: result.score }; // Add the new semantic score
            });

            setResults(fullResults);

        } catch (err) {
            setError(err.message);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <header className="page-header fade-in">
                <h1 className="page-title">Deep Learning Search 🧠</h1>
                <p className="page-subtitle">
                    Describe your ideal dog, and our AI will understand its meaning to find the perfect breeds for you.
                </p>
            </header>

            <main style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div className="card fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="form-group">
                        <textarea
                            id="search-query"
                            className="form-input"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="e.g., a calm and loyal companion for a small apartment"
                            rows="3"
                            style={{ resize: 'vertical', minHeight: '80px' }}
                        />
                    </div>
                    <button 
                        className="btn btn-primary" 
                        onClick={handleSearch}
                        disabled={isLoading}
                        style={{ width: '100%' }}
                    >
                        {isLoading ? 'Searching...' : 'Find My Dog'}
                    </button>
                </div>

                <div className="search-results" style={{ marginTop: '40px' }}>
                    {isLoading && <div className="loading-indicator">🐾 Finding matches...</div>}
                    {error && <div className="error-message">{error}</div>}
                    
                    {!isLoading && searched && results.length === 0 && !error && (
                        <div className="no-results">No matches found. Try a different description.</div>
                    )}
                    
                    <div className="grid grid-3">
                        {results.map(dog => (
                            <BreedCard key={dog.breed} dog={dog} />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SearchPage;