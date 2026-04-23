import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingClassifier

# Load dataset
df = pd.read_csv("Anxiety.csv")

# Features & target
X = df.drop('A_severity', axis=1)
y = df['A_severity']

# Train model
model = GradientBoostingClassifier(
    learning_rate=0.01,
    max_depth=3,
    n_estimators=50
)
model.fit(X, y)

# A–E mapping
option_map = {
    'A': 0,
    'B': 1,
    'C': 2,
    'D': 3,
    'E': 4
}

# Questions
def get_questionsa():
    return {
        "questions": {
            "q1": "How often do you experience a sense of restlessness or feeling on edge?",
            "q2": "Do you worry about different things even without reason?",
            "q3": "How often do you feel nervous in social situations?",
            "q4": "How often do you struggle with racing thoughts?",
            "q5": "Do you experience physical symptoms like sweating or heart racing?",
            "q6": "How often do you find it difficult to relax?",
            "q7": "How often do uncertainties make you anxious?"
        },
        "options": {
            "A": "Never",
            "B": "Almost Never",
            "C": "Sometimes",
            "D": "Fairly Often",
            "E": "Very Often"
        }
    }

# Prediction
def predicta(user_choices):
    """
    Example input:
    ['A', 'C', 'D', 'B', 'C', 'A', 'E']
    """

    # Convert A–E → numeric
    numeric = [option_map[x] for x in user_choices]

    # Derived features
    total = sum(numeric)
    features = numeric + [total, total * 2]

    # DataFrame
    input_df = pd.DataFrame([features])

    # Prediction
    prediction = model.predict(input_df)

    return {
        "severity": str(prediction[0]),
        "score": total
    }