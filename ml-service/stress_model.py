import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingClassifier

# Load dataset
df = pd.read_csv("Stress.csv")

# Features & target
X = df.drop('S_severity', axis=1)
y = df['S_severity']

# Train model
model = GradientBoostingClassifier(
    learning_rate=0.01,
    max_depth=3,
    n_estimators=50
)
model.fit(X, y)

# A–E → numeric mapping (matches your UI)
option_map = {
    'A': 0,
    'B': 1,
    'C': 2,
    'D': 3,
    'E': 4
}

# Questions
def get_questions():
    return {
        "questions": {
            "q1": "How often do you find it difficult to unwind and relax after a long day?",
            "q2": "Do you experience difficulty sleeping due to racing thoughts or worries?",
            "q3": "How frequently do you notice physical symptoms of stress?",
            "q4": "How often do you feel overwhelmed by tasks or responsibilities?",
            "q5": "Do you find it difficult to concentrate under pressure?",
            "q6": "How often do you experience irritability or mood swings?",
            "q7": "How often do you engage in relaxing activities?"
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
def predict(user_choices):
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

    # Predict
    pred = model.predict(input_df)

    return {
        "severity": str(pred[0]),
        "score": total
    }