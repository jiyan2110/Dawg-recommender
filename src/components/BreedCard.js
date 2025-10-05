// src/components/BreedCard.js
import React from 'react';

const BreedCard = ({ dog }) => {
    const wikiLink = `https://en.wikipedia.org/wiki/${encodeURIComponent(dog.breed)}`;

    return (
        <div className="breed-card fade-in">
            <h2 className="breed-card-title">🐕 {dog.breed}</h2>
            
            <div className="breed-info">
                <div className="breed-info-item">
                    <span className="breed-info-label">Temperament:</span>
                    <span className="breed-info-value">{dog.temperament.join(', ')}</span>
                </div>

                <div className="breed-info-item">
                    <span className="breed-info-label">Size:</span>
                    <span className="breed-info-value">{dog.size || 'N/A'}</span>
                </div>

                <div className="breed-info-item">
                    <span className="breed-info-label">Group:</span>
                    <span className="breed-info-value">{dog.group || 'N/A'}</span>
                </div>

                <div className="breed-info-item">
                    <span className="breed-info-label">Intelligence:</span>
                    <span className="breed-info-value">{dog.intelligence || 'N/A'}</span>
                </div>

                <div className="breed-info-item">
                    <span className="breed-info-label">Origin:</span>
                    <span className="breed-info-value">{dog.country_of_origin || 'N/A'}</span>
                </div>

                {dog.description && (
                    <div className="breed-info-item" style={{ borderLeftColor: '#764ba2' }}>
                        <span className="breed-info-label">Description:</span>
                        <span className="breed-info-value">{dog.description}</span>
                    </div>
                )}
            </div>

            {dog.matchScore !== undefined && (
                <div style={{ marginBottom: '20px' }}>
                    <span className="match-score">
                        ⭐ Match Score: {(dog.matchScore * 100).toFixed(0)}%
                    </span>
                </div>
            )}

            <a 
                href={wikiLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ display: 'inline-block' }}
            >
                📚 Learn More on Wikipedia
            </a>
        </div>
    );
};

export default BreedCard;