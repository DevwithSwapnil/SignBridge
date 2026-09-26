# ==========================================
# SIGN BRIDGE
# SEQUENCE MODEL TRAINING
# ==========================================

import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)

import joblib


# ==========================================
# 1. LOAD SEQUENCE DATASET
# ==========================================

print("Loading sequence dataset...")

data = pd.read_csv("sign_sequence_dataset.csv")


print("\nDataset loaded successfully!")

print("Total sequences:", len(data))


# ==========================================
# 2. SHOW SIGN COUNTS
# ==========================================

print("\nSequences per sign:")

print(data["label"].value_counts())


# ==========================================
# 3. SEPARATE LABEL AND FEATURES
# ==========================================

y = data["label"]

X = data.drop("label", axis=1)


# Convert to NumPy

X = X.values

y = y.values


print("\nTotal features per sequence:", X.shape[1])


# ==========================================
# 4. TRAIN / TEST SPLIT
# ==========================================

X_train, X_test, y_train, y_test = train_test_split(

    X,

    y,

    test_size=0.20,

    random_state=42,

    stratify=y

)


print("\nTraining sequences:", len(X_train))

print("Testing sequences:", len(X_test))


# ==========================================
# 5. CREATE RANDOM FOREST MODEL
# ==========================================

print("\nCreating Random Forest model...")


model = RandomForestClassifier(

    n_estimators=200,

    random_state=42,

    class_weight="balanced"

)


# ==========================================
# 6. TRAIN MODEL
# ==========================================

print("\nTraining sequence model...")

model.fit(

    X_train,

    y_train

)


print("Training completed!")


# ==========================================
# 7. PREDICT TEST DATA
# ==========================================

predictions = model.predict(X_test)


# ==========================================
# 8. ACCURACY
# ==========================================

accuracy = accuracy_score(

    y_test,

    predictions

)


print("\n================================")

print("SEQUENCE MODEL ACCURACY")

print("================================")

print(

    f"{accuracy * 100:.2f}%"

)


# ==========================================
# 9. CLASSIFICATION REPORT
# ==========================================

print("\nClassification Report:")

print(

    classification_report(

        y_test,

        predictions

    )

)


# ==========================================
# 10. CONFUSION MATRIX
# ==========================================

print("\nConfusion Matrix:")

print(

    confusion_matrix(

        y_test,

        predictions

    )

)


# ==========================================
# 11. SAVE MODEL
# ==========================================

joblib.dump(

    model,

    "signbridge_sequence_model.pkl"

)


print("\n================================")

print("MODEL SAVED SUCCESSFULLY!")

print("================================")

print(

    "File: signbridge_sequence_model.pkl"

)