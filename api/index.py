import pickle
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import os

# --- 1. INITIALIZATION ---

# Create the Flask web server instance
app = Flask(__name__)
# Enable CORS to allow the frontend to make requests to this API
CORS(app)


# --- 2. LOAD MODELS AND DATA ONCE AT STARTUP ---
# This code runs once during the serverless function's "cold start".
# The loaded model and data are then reused for all subsequent "warm" requests, which is very efficient.

print("Loading SentenceTransformer model...")
model = SentenceTransformer('all-MiniLM-L6-v2')
print("✅ Model loaded.")

# In Vercel's build environment, paths are relative to the project root.
# This makes finding our data file straightforward.
embeddings_path = 'backend/model_data/dog_breed_embeddings.pkl'

print(f"Loading breed embeddings from: {embeddings_path}")
with open(embeddings_path, 'rb') as f:
    breed_embedding_dict = pickle.load(f)

# Separate the breed names and their corresponding vectors for efficient searching
breed_names = list(breed_embedding_dict.keys())
breed_vectors = np.array(list(breed_embedding_dict.values()))
print(f"✅ {len(breed_names)} breed embeddings loaded.")


# --- 3. DEFINE API ENDPOINTS ---

# This is a "health check" endpoint. You can navigate to your-site.vercel.app/api
# to see if the serverless function is alive and responding.
@app.route('/')
def health_check():
    return "API is running successfully."

# This is the main search endpoint that our React app will call.
@app.route('/api/search', methods=['POST'])
def search():
    # Get the user's query from the incoming JSON request
    query_data = request.get_json()
    if not query_data or 'query' not in query_data:
        return jsonify({'error': 'Missing query in request body'}), 400

    query = query_data['query']
    if not query.strip():
        return jsonify({'error': 'Query cannot be empty'}), 400

    # --- THE CORE SEARCH LOGIC ---
    # 1. Encode the user's query into a vector
    query_vector = model.encode([query])

    # 2. Calculate the cosine similarity between the query and all dog breeds
    similarities = cosine_similarity(query_vector, breed_vectors).flatten()

    # 3. Get the indices of the top 10 results
    top_10_indices = np.argsort(similarities)[-10:][::-1]

    # 4. Format the results with breed names and scores
    results = [
        {
            'breed': breed_names[i],
            'score': float(similarities[i])
        }
        for i in top_10_indices
    ]

    # 5. Return the results as a JSON response
    return jsonify({'breeds': results})


# --- 4. LOCAL DEVELOPMENT ---
# This block is only used when you run `python api/index.py` on your local machine.
# Vercel ignores this and directly uses the 'app' object.
if __name__ == '__main__':
    app.run(debug=True, port=5001)