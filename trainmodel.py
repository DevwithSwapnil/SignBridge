import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

import joblib


# ==========================================
# SIGN BRIDGE - IMPROVED MODEL TRAINING
# ==========================================


# ------------------------------------------
# Dataset files
# ------------------------------------------

files = [
    "HELLO_dataset.csv",
    "THANK_YOU_dataset.csv",
    "YES_dataset.csv",
    "NO_dataset.csv"
]


# ------------------------------------------
# Load datasets
# ------------------------------------------

dataframes = []

for file in files:

    print("Loading:", file)

    df = pd.read_csv(file)

    dataframes.append(df)


# ------------------------------------------
# Combine datasets
# ------------------------------------------

data = pd.concat(
    dataframes,
    ignore_index=True
)


print("\nTotal samples:", len(data))

print("\nSamples per sign:")

print(data["label"].value_counts())


# ------------------------------------------
# Separate label
# ------------------------------------------

labels = data["label"]


# ------------------------------------------
# Get feature columns
# ------------------------------------------

feature_columns = [
    column
    for column in data.columns
    if column != "label"
]


X = data[feature_columns].values


# ------------------------------------------
# Normalize landmarks
# ------------------------------------------
#
# Each sample contains:
#
# 21 landmarks × 3 values
#
# x, y, z
#
# The first landmark is the wrist.
#
# We subtract the wrist position from
# every landmark.
#
# ------------------------------------------

X_normalized = []


for sample in X:

    landmarks = sample.reshape(21, 3)

    wrist = landmarks[0]

    normalized = landmarks - wrist

    normalized = normalized.flatten()

    X_normalized.append(normalized)


X = np.array(X_normalized)


print("\nLandmarks normalized successfully.")


# ------------------------------------------
# Train / Test split
# ------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(

    X,

    labels,

    test_size=0.2,

    random_state=42,

    stratify=labels
)


print("\nTraining samples:", len(X_train))

print("Testing samples:", len(X_test))


# ------------------------------------------
# Create Random Forest model
# ------------------------------------------

model = RandomForestClassifier(

    n_estimators=200,

    random_state=42,

    class_weight="balanced"

)


# ------------------------------------------
# Train model
# ------------------------------------------

print("\nTraining improved model...")

model.fit(

    X_train,

    y_train

)


print("Training completed!")


# ------------------------------------------
# Test model
# ------------------------------------------

predictions = model.predict(X_test)


# ------------------------------------------
# Accuracy
# ------------------------------------------

accuracy = accuracy_score(

    y_test,

    predictions

)


print("\n==============================")

print("IMPROVED MODEL ACCURACY")

print("==============================")

print(

    f"{accuracy * 100:.2f}%"

)


# ------------------------------------------
# Classification report
# ------------------------------------------

print("\nClassification Report:")

print(

    classification_report(

        y_test,

        predictions

    )

)


# ------------------------------------------
# Confusion matrix
# ------------------------------------------

print("\nConfusion Matrix:")

print(

    confusion_matrix(

        y_test,

        predictions

    )

)


# ------------------------------------------
# Save model
# ------------------------------------------

joblib.dump(

    model,

    "signbridge_model.pkl"

)


print("\nModel saved successfully!")

print("File: signbridge_model.pkl")