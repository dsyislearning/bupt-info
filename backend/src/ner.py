from span_marker import SpanMarkerModel
from typing import Dict, List

model = SpanMarkerModel.from_pretrained(
    "tomaarsen/span-marker-roberta-large-ontonotes5"
)
# model = SpanMarkerModel.from_pretrained("tomaarsen/span-marker-mbert-base-multinerd")

def nlp(text: str) -> Dict[str, List[str]]:
    entities = model.predict(text)

    result = {}
    for entity in entities:
        if entity["label"] not in result:
            result[entity["label"]] = []
        result[entity["label"]].append(entity["span"])

    return result

if __name__ == "__main__":
    entities = model.predict(
        "Amelia Earhart flew her single engine Lockheed Vega 5B across the Atlantic to Paris."
    )

    # print(entities)
    for entity in entities:
        print(entity["span"], entity["label"])
