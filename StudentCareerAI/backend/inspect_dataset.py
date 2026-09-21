import pandas as pd
import json
import os


# Project dataset folder
DATASET_PATH = "../datasets"


def inspect_csv(filename):
    path = os.path.join(DATASET_PATH, filename)

    print("\n" + "=" * 70)
    print(f"FILE: {filename}")
    print("=" * 70)

    try:
        df = pd.read_csv(path)

        print("\nShape:")
        print(df.shape)

        print("\nColumns:")
        for column in df.columns:
            print("-", column)

        print("\nFirst 5 rows:")
        print(df.head().to_string())

        print("\nMissing values:")
        print(df.isnull().sum())

    except Exception as e:
        print(f"ERROR: {e}")


def inspect_json(filename):
    path = os.path.join(DATASET_PATH, filename)

    print("\n" + "=" * 70)
    print(f"FILE: {filename}")
    print("=" * 70)

    try:
        with open(path, "r", encoding="utf-8") as file:
            data = json.load(file)

        print("\nData type:")
        print(type(data))

        if isinstance(data, list):
            print("Number of records:", len(data))

            if len(data) > 0:
                print("\nFirst record:")
                print(data[0])

                if isinstance(data[0], dict):
                    print("\nKeys:")
                    for key in data[0].keys():
                        print("-", key)

        elif isinstance(data, dict):
            print("\nKeys:")
            for key in data.keys():
                print("-", key)

            print("\nSample data:")
            print(data)

    except Exception as e:
        print(f"ERROR: {e}")


# Inspect CSV files
inspect_csv("training_data.csv")
inspect_csv("job_roles.csv")
inspect_csv("skills_list.csv")

# Inspect JSON files
inspect_json("test_resumes.json")
inspect_json("skills_database.json")