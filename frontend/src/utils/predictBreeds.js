// utils/predictBreeds.js

export const getTopBreeds = (dogData, userPrefs, topN = 10) => {
    const weights = { numeric: 0.5, temperament: 0.3, categorical: 0.2 };
    
    const scoredBreeds = dogData.map(dog => {
        // 1. Numeric differences
        const numericAttrs = ['grooming', 'shedding', 'energy', 'trainability', 'lifetime_cost'];
        const numericScore = numericAttrs.reduce((acc, attr) => {
            return acc + (1 - Math.abs(userPrefs[attr] - dog[attr]));
        }, 0) / numericAttrs.length;

        // 2. Temperament score
        let temperamentScore = 1;
        if (userPrefs.temperament.length > 0) {
            const matches = userPrefs.temperament.filter(t => dog.temperament.includes(t)).length;
            temperamentScore = matches / userPrefs.temperament.length;
        }

        // 3. Categorical score (size & group as optional filters)
        let categoricalScore = 1;
        if (userPrefs.size !== 'Any' || userPrefs.group !== 'Any') {
            let total = 0, match = 0;
            if (userPrefs.size !== 'Any') {
                total++; 
                if (dog.size === userPrefs.size) match++;
            }
            if (userPrefs.group !== 'Any') {
                total++;
                if (dog.group === userPrefs.group) match++;
            }
            categoricalScore = total > 0 ? match / total : 1;
        }

        // Weighted final score
        const finalScore = (numericScore * weights.numeric) +
                           (temperamentScore * weights.temperament) +
                           (categoricalScore * weights.categorical);

        return { ...dog, matchScore: finalScore };
    });

    // Sort descending and return top N
    return scoredBreeds
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, topN);
};
