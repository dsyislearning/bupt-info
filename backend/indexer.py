from corpus import corpus

inverted_index = {}

for i, doc in enumerate(corpus):
    for term in doc.split():
        if term not in inverted_index:
            inverted_index[term] = []
        if i not in inverted_index[term]:
            inverted_index[term].append(i)

save_path = "inverted_index.json"

# import json

# with open(save_path, "w") as writer:
#     json.dump(inverted_index, writer)
