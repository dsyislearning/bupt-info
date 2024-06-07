from indexer import inverted_index, corpus
from bm25 import BM25Okapi
from typing import List, Dict


def search(query: str, cached_search_result: Dict[str, List[str]]) -> List[Dict[str, str]]:
    # Check if the query is the same as the cached query
    # If it is, return the cached result
    query = query.lower()
    if query == cached_search_result["query"]:
        # Only when next search, the result will be sorted by score
        cached_search_result["result"] = sorted(cached_search_result["result"], key=lambda x: x["score"], reverse=True)
        return cached_search_result["result"]

    # Tokenize the query string
    tokenized_query = query.split(" ")

    # Get the document ids that contain all the terms in the query
    docids = set()
    for term in tokenized_query:
        if term in inverted_index:
            docids.update(set(inverted_index[term]))

    filtered_corpus = [corpus[i] for i in docids]

    if not filtered_corpus:
        return []

    # Rank the documents based on the BM25 score
    bm25 = BM25Okapi([doc.split(" ") for doc in filtered_corpus])
    # scores = bm25.get_scores(tokenized_query)

    # Return the top 5 documents
    docs, scores = bm25.get_top_n(tokenized_query, filtered_corpus, n=-1)

    result = []
    for doc, score in zip(docs, scores):
        paragraphs = doc.split("\n\n")
        
        title = paragraphs[0]

        summary = paragraphs[1]
        if len(summary) > 200:
            summary = summary[:200] + "..."

        context = paragraphs[1:]

        result.append({
            "title": title,
            "summary": summary,
            "context": context,
            "score": score
        }) 

    # Return the result
    return result


def update_scores(index: int, rating: int, cached_search_result: Dict[str, List[str]]) -> None:
    # Update the score of the document
    # 0 means no rating, 3 means neutral, 1, 2, 4, 5 means negative or positive
    if rating in [1, 2, 4, 5]:
        original_score = cached_search_result["result"][index]["score"]
        cached_search_result["result"][index]["score"] = original_score * (1 + (rating - 3) * 0.05) 
