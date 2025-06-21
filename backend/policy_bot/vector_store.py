import faiss
import numpy as np
from typing import List

class VectorStore:
    def __init__(self, dim: int):
        self.dim = dim
        self.index = faiss.IndexFlatIP(dim)
        self.texts: List[str] = []

    def add(self, embeddings: np.ndarray, texts: List[str]):
        faiss.normalize_L2(embeddings)
        self.index.add(embeddings)
        self.texts.extend(texts)

    def search(self, query_embedding: np.ndarray, top_k=3):
        if self.index.ntotal == 0:
            return []
        faiss.normalize_L2(query_embedding)
        D, I = self.index.search(query_embedding, top_k)
        return [self.texts[i] for i in I[0] if 0 <= i < len(self.texts)]
