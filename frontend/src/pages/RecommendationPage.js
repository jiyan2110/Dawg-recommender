import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import dogData from '../data/dog_breeds_FINAL_CORRECTED.json';
import BreedCard from '../components/BreedCard';

const calculateMatchScore = (dog, preferences) => {
    // This logic remains the same, as it's functional and not style-related.
    const weights = { numeric: 0.5, temperament: 0.3 };

    const numericPrefs = ['grooming', 'shedding', 'energy', 'trainability', 'lifetime_cost'];
    const numericScore = numericPrefs.reduce((acc, pref) => acc + (1 - Math.abs(preferences[pref] - dog[pref])), 0) / numericPrefs.length;

    const selectedTemps = preferences.temperament;
    let temperamentScore = 1.0;
    if (selectedTemps.length > 0) {
        const matches = selectedTemps.filter(temp => dog.temperament.includes(temp)).length;
        temperamentScore = matches / selectedTemps.length;
    }

    return numericScore * weights.numeric + temperamentScore * weights.temperament;
};

const RecommendationPage = () => {
    const location = useLocation();
    const presets = location.state?.presets || {};

    const [preferences, setPreferences] = useState({
        grooming: presets.grooming || 0.5,
        shedding: presets.shedding || 0.5,
        energy: presets.energy || 0.5,
        trainability: presets.trainability || 0.5,
        lifetime_cost: presets.lifetime_cost || 0.5,
        temperament: presets.temperament || [],
        size: presets.size || 'Any',
        group: presets.group || 'Any',
    });

    const [topBreed, setTopBreed] = useState(null);

    const handleSliderChange = (name, value) => {
        setPreferences(prev => ({ ...prev, [name]: parseFloat(value) }));
    };

    const handleTemperamentToggle = (temp) => {
        setPreferences(prev => {
            const newTemps = prev.temperament.includes(temp)
                ? prev.temperament.filter(t => t !== temp)
                : [...prev.temperament, temp];
            return { ...prev, temperament: newTemps };
        });
    };

    const handleSelectChange = (name, value) => {
        setPreferences(prev => ({ ...prev, [name]: value }));
    };

    const allTemperaments = [...new Set(dogData.flatMap(dog => dog.temperament))].sort();

    useEffect(() => {
        let filteredDogs = dogData.filter(dog => 
            (preferences.size === 'Any' || dog.size === preferences.size) &&
            (preferences.group === 'Any' || dog.group === preferences.group)
        );

        if (filteredDogs.length === 0) {
            setTopBreed(null);
            return;
        }

        filteredDogs = filteredDogs.map(dog => ({
            ...dog,
            matchScore: calculateMatchScore(dog, preferences)
        }));

        filteredDogs.sort((a, b) => b.matchScore - a.matchScore);
        setTopBreed(filteredDogs[0]);
    }, [preferences]);

    const sliderLabels = {
        grooming: 'Grooming ✨',
        shedding: 'Shedding 🌿',
        energy: 'Energy ⚡️',
        trainability: 'Trainability 🧠',
        lifetime_cost: 'Cost 💰'
    };

    return (
        <div className="container">
            <header className="page-header fade-in">
                <h1 className="page-title">AI Breed Recommendation</h1>
                <p className="page-subtitle">
                    Adjust the filters below to discover your ideal canine companion.
                </p>
            </header>

            <div className="grid-sidebar">
                <aside className="sidebar fade-in" style={{ animationDelay: '0.1s' }}>
                    <h2 className="sidebar-title">Your Preferences</h2>

                    {Object.keys(sliderLabels).map(attr => (
                        <div key={attr} className="slider-container">
                            <div className="slider-label">
                                <span className="slider-label-text">{sliderLabels[attr]}</span>
                                <span className="slider-value">{preferences[attr].toFixed(2)}</span>
                            </div>
                            <input
                                type="range"
                                value={preferences[attr]}
                                onChange={(e) => handleSliderChange(attr, e.target.value)}
                                step="0.05"
                                min="0"
                                max="1"
                            />
                        </div>
                    ))}

                    <div className="form-group">
                        <label className="form-label">Key Traits</label>
                        <div className="temperament-chips">
                            {allTemperaments.map(temp => (
                                <div
                                    key={temp}
                                    className={`temperament-chip ${preferences.temperament.includes(temp) ? 'selected' : ''}`}
                                    onClick={() => handleTemperamentToggle(temp)}
                                >
                                    {temp}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Size</label>
                        <div className="select-wrapper">
                            <select
                                className="form-input"
                                value={preferences.size}
                                onChange={(e) => handleSelectChange('size', e.target.value)}
                            >
                                <option value="Any">Any Size</option>
                                <option value="Small">Small</option>
                                <option value="Medium">Medium</option>
                                <option value="Large">Large</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Group</label>
                        <div className="select-wrapper">
                            <select
                                className="form-input"
                                value={preferences.group}
                                onChange={(e) => handleSelectChange('group', e.target.value)}
                            >
                                <option value="Any">Any Group</option>
                                {[...new Set(dogData.map(d => d.group))].sort().map(group => (
                                  <option key={group} value={group}>{group}</option>  
                                ))}
                            </select>
                        </div>
                    </div>
                </aside>

                <main className="fade-in" style={{ animationDelay: '0.2s' }}>
                    {topBreed ? (
                        <BreedCard dog={topBreed} />
                    ) : (
                        <div className="no-results">
                            <div className="no-results-icon">🐾</div>
                            <p className="no-results-text">No breed matches your filters.</p>
                            <p className="card-subtitle" style={{ fontSize: '16px' }}>
                                Try adjusting your preferences to see a recommendation.
                            </p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default RecommendationPage;
