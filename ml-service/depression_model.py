import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingClassifier

# Load dataset
df = pd.read_csv("Depression.csv")

# Features & target
X = df.drop('D_severity', axis=1)
y = df['D_severity']

# Train model
model = GradientBoostingClassifier(
    learning_rate=0.01,
    max_depth=3,
    n_estimators=50
)
model.fit(X, y)

# A–E mapping (same as your UI)
option_map = {
    'A': 0,
    'B': 1,
    'C': 2,
    'D': 3,
    'E': 4
}

# Questions
def get_questionsd():
    return {
        "questions": {
            "q1": "How often do you find it difficult to enjoy activities you once liked?",
            "q2": "How often do you feel persistent sadness or emptiness?",
            "q3": "How often do you notice changes in appetite?",
            "q4": "How often do you have sleep problems?",
            "q5": "How often do you feel low energy or fatigue?",
            "q6": "How often do you feel worthless or negative about yourself?",
            "q7": "How often do you find it difficult to concentrate or decide?"
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
def predictd(user_choices):
    """
    Example:
    ['A', 'B', 'C', 'D', 'A', 'C', 'E']
    """

    # Convert A–E → numeric
    numeric = [option_map[x] for x in user_choices]

    # Derived features
    total = sum(numeric)
    features = numeric + [total, total * 2]

    # Convert to DataFrame
    input_df = pd.DataFrame([features])

    # Predict
    prediction = model.predict(input_df)

    return {
        "severity": str(prediction[0]),
        "score": total
    }