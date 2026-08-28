import math
import re
import json
import os
from typing import List, Dict, Any

class SimpleVectorStore:
    def __init__(self, db_path: str = "vector_store.json"):
        # Resolve absolute path relative to current app directory
        self.db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), db_path)
        self.documents = []  # List[Dict[str, Any]] with keys: id, text, doc_name, metadata
        self.load()

    def load(self):
        if os.path.exists(self.db_path):
            try:
                with open(self.db_path, "r", encoding="utf-8") as f:
                    self.documents = json.load(f)
            except Exception:
                self.documents = []

    def save(self):
        try:
            with open(self.db_path, "w", encoding="utf-8") as f:
                json.dump(self.documents, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"Error saving vector store: {e}")

    def clean_text(self, text: str) -> List[str]:
        # Lowercase and extract alphanumeric words
        words = re.findall(r'\w+', text.lower())
        return words

    def add_document(self, text: str, doc_name: str, metadata: Dict[str, Any] = None):
        # Chunk text into blocks of ~80 words (~500 chars)
        chunks = []
        words = text.split()
        chunk_size = 80
        for i in range(0, len(words), chunk_size):
            chunk = " ".join(words[i:i+chunk_size])
            if chunk.strip():
                chunks.append(chunk)

        # Remove previous chunks of the same document to avoid duplicate indexing
        self.documents = [doc for doc in self.documents if doc.get("doc_name") != doc_name]

        for idx, chunk in enumerate(chunks):
            self.documents.append({
                "id": f"{doc_name}_chunk_{idx}",
                "text": chunk,
                "doc_name": doc_name,
                "metadata": metadata or {}
            })
        self.save()

    def retrieve(self, query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        if not self.documents:
            return []

        # 1. Compute TF-IDF vectors for all documents + query
        query_words = self.clean_text(query)
        if not query_words:
            return []

        # Get vocabulary
        vocab = set()
        doc_words_list = []
        for doc in self.documents:
            w = self.clean_text(doc["text"])
            doc_words_list.append(w)
            vocab.update(w)
        vocab.update(query_words)
        vocab = list(vocab)
        vocab_index = {word: i for i, word in enumerate(vocab)}

        # Document frequencies for IDF
        df = {}
        for word in vocab:
            df[word] = 0
            for doc_words in doc_words_list:
                if word in doc_words:
                    df[word] += 1
            # Add pseudocount
            if word in query_words:
                df[word] += 1

        num_docs = len(self.documents) + 1
        idf = {}
        for word in vocab:
            idf[word] = math.log(num_docs / (df[word] or 1)) + 1

        # Represent query as TF-IDF vector
        query_tf = {}
        for word in query_words:
            query_tf[word] = query_tf.get(word, 0) + 1
        
        query_vector = [0.0] * len(vocab)
        for word, tf in query_tf.items():
            if word in vocab_index:
                query_vector[vocab_index[word]] = tf * idf[word]

        # Represent docs as TF-IDF vectors and compute cosine similarity
        results = []
        for idx, doc in enumerate(self.documents):
            doc_words = doc_words_list[idx]
            doc_tf = {}
            for word in doc_words:
                doc_tf[word] = doc_tf.get(word, 0) + 1
            
            doc_vector = [0.0] * len(vocab)
            for word, tf in doc_tf.items():
                if word in vocab_index:
                    doc_vector[vocab_index[word]] = tf * idf[word]

            # Compute Cosine Similarity
            dot_product = sum(a * b for a, b in zip(query_vector, doc_vector))
            norm_q = math.sqrt(sum(a * a for a in query_vector))
            norm_d = math.sqrt(sum(a * a for a in doc_vector))
            
            similarity = 0.0
            if norm_q > 0 and norm_d > 0:
                similarity = dot_product / (norm_q * norm_d)

            results.append((similarity, doc))

        # Sort by similarity desc
        results.sort(key=lambda x: x[0], reverse=True)
        
        # Return top K matching documents (with similarity > 0.05)
        return [item[1] for item in results[:top_k] if item[0] > 0.05]
