import pickle
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# --- 1. INITIALIZATION ---

# Create the Flask web server
app = Flask(__name__)
print("Flask imported and app created")
# Enable Cross-Origin Resource Sharing (CORS) so our React frontend can talk to this server
CORS(app)

# --- 2. LOAD MODELS ONCE AT STARTUP ---

# Load the pre-trained Sentence Transformer model
print("Loading SentenceTransformer model...")
model = SentenceTransformer('all-MiniLM-L6-v2')
print("✅ Model loaded.")

# Load the pre-computed breed embeddings from the file we created in Phase 1
print("Loading breed embeddings...")
with open('../backend/model_data/dog_breed_embeddings.pkl', 'rb') as f:
    breed_embedding_dict = pickle.load(f)

# Separate breed names and their embeddings into two lists for easier processing
breed_names = list(breed_embedding_dict.keys())
breed_vectors = np.array(list(breed_embedding_dict.values()))
print(f"✅ {len(breed_names)} breed embeddings loaded.")


# --- 3. DEFINE THE API ENDPOINT ---

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

    # 1. Encode the user's query into a vector using the same model
    query_vector = model.encode([query])

    # 2. Calculate cosine similarity between the query vector and all dog breed vectors
    similarities = cosine_similarity(query_vector, breed_vectors).flatten()

    # 3. Get the indices of the top 10 most similar breeds
    top_10_indices = np.argsort(similarities)[-10:][::-1]

    # 4. Map these indices back to breed names and their scores
    results = [
        {
            'breed': breed_names[i],
            'score': float(similarities[i])
        }
        for i in top_10_indices
    ]

    # Return the results as a JSON response
    return jsonify({'breeds': results})


# --- 4. RUN THE APP ---

if __name__ == '__main__':
    # Run the server on port 5001 to avoid conflicts with React's default port 3000
    app.run(debug=True, port=5001)