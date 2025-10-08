import pickle
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import os

# Create the Flask web server instance
app = Flask(__name__)
# Enable CORS to allow the frontend to make requests
CORS(app)


# --- LOAD MODELS AND DATA ONCE AT STARTUP ---
model = SentenceTransformer('all-MiniLM-L6-v2')

# Path is relative to the project root, where Vercel runs the build
embeddings_path = 'backend/model_data/dog_breed_embeddings.pkl'
with open(embeddings_path, 'rb') as f:
    breed_embedding_dict = pickle.load(f)

breed_names = list(breed_embedding_dict.keys())
breed_vectors = np.array(list(breed_embedding_dict.values()))
print(f"✅ {len(breed_names)} breed embeddings loaded.")


# --- DEFINE API ENDPOINT ---
# Vercel's file-based routing handles the "/api/search" part.
# The Flask app inside only needs to handle the root route ('/').
@app.route('/', methods=['POST'])
def search():
    query_data = request.get_json()
    if not query_data or 'query' not in query_data:
        return jsonify({'error': 'Missing query in request body'}), 400

    query = query_data['query']
    if not query.strip():
        return jsonify({'error': 'Query cannot be empty'}), 400

    # Encode the user's query into a vector
    query_vector = model.encode([query])

    # Calculate similarity and get top 10 results
    similarities = cosine_similarity(query_vector, breed_vectors).flatten()
    top_10_indices = np.argsort(similarities)[-10:][::-1]

    # Format the results
    results = [
        {
            'breed': breed_names[i],
            'score': float(similarities[i])
        }
        for i in top_10_indices
    ]
    return jsonify({'breeds': results})


# --- LOCAL DEVELOPMENT BLOCK ---
# This block is only used when you run `python api/search.py` on your local machine.
# Vercel ignores this and imports the 'app' object directly.
if __name__ == '__main__':
    app.run(debug=True, port=5001)