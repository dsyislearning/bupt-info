from indexer import inverted_index, corpus
from rank_bm25 import BM25Okapi


def search(query: str):
    # Tokenize the query string
    query = query.lower()
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
    result = bm25.get_top_n(tokenized_query, filtered_corpus, n=5)

    return result
