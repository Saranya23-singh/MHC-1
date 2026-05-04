import json
import pandas as pd
from flask import Flask, request, jsonify
import re
import random
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

# Load dataset
dataset = pd.read_csv('datasets/Mental_Health_dataset/counselchat-data.csv')

# Precompute TF-IDF
vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1,2))
question_vectors = vectorizer.fit_transform(dataset['questionText'].fillna(''))

# Random responses from dataset
random_responses = dataset["answerText"].dropna().tolist()

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message', '').lower().strip()
    
    if not message:
        return jsonify({'response': "Tell me what's on your mind."})
    
    print(f"User message: {message}")
    
    # Semantic search with TF-IDF
    query = message.lower().strip()
    query_vec = vectorizer.transform([query])
    similarities = cosine_similarity(query_vec, question_vectors)[0]
    best_idx = similarities.argmax()
    best_sim = similarities[best_idx]
    
    if best_sim <= 0.1:
        response = random.choice(random_responses)
        print("Using random dataset response (low similarity)")
    else:
        response = dataset.iloc[best_idx]['answerText']
        print(f"Using dataset response (sim={best_sim:.2f})")
    
    return jsonify({'response': response})

if __name__ == '__main__':
    print("🤖 Tranquoria Therapist AI starting on port 5001...")
    app.run(host='0.0.0.0', port=5001, debug=True)

