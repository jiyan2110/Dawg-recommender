import pickle
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from vercel import Response
import json
import os

# --- LOAD MODEL AND EMBEDDINGS ONCE ---
MODEL_PATH = 'all-MiniLM-L6-v2'
EMBEDDINGS_PATH = os.path.join('backend', 'model_data', 'dog_breed_embeddings.pkl')

# Load Sentence Transformer model
model = SentenceTransformer(MODEL_PATH)

# Load breed embeddings
with open(EMBEDDINGS_PATH, 'rb') as f:
    breed_embedding_dict = pickle.load(f)

breed_names = list(breed_embedding_dict.keys())
breed_vectors = np.array(list(breed_embedding_dict.values()))
print(f"✅ {len(breed_names)} breed embeddings loaded.")

# --- HANDLER FUNCTION CALLED BY VERCEL ---
def handler(request):
    try:
        # Parse JSON body
        body = request.get_json()
        if not body or 'query' not in body:
            return Response(json.dumps({'error': 'Missing query in request body'}), status=400, headers={'Content-Type': 'application/json'})

        query = body['query'].strip()
        if not query:
            return Response(json.dumps({'error': 'Query cannot be empty'}), status=400, headers={'Content-Type': 'application/json'})

        # Encode query and calculate similarities
        query_vector = model.encode([query])
        similarities = cosine_similarity(query_vector, breed_vectors).flatten()
        top_10_indices = np.argsort(similarities)[-10:][::-1]

        # Prepare results
        results = [
            {
                'breed': breed_names[i],
                'score': float(similarities[i])
            }
            for i in top_10_indices
        ]

        return Response(json.dumps({'breeds': results}), headers={'Content-Type': 'application/json'})

    except Exception as e:
        return Response(json.dumps({'error': str(e)}), status=500, headers={'Content-Type': 'application/json'})
