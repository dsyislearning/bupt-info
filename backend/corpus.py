import os

bbc_path = os.path.join("..", "data", "bbc")

corpus = []

for category in os.listdir(bbc_path):
    category_path = os.path.join(bbc_path, category)
    for root, dirs, files in os.walk(category_path):
        for file in files:
            file_path = os.path.join(root, file)
            with open(file_path, "r") as reader:
                corpus.append(reader.read())

# print(corpus[:5])
