import pandas as pd
import json
import chardet

# Function to detect the encoding of a file
def detect_encoding(file_path):
    with open(file_path, 'rb') as f:
        result = chardet.detect(f.read())
    return result['encoding']

# Load CSV files with detected encoding
# states_df = pd.read_csv("states_data.csv", encoding=detect_encoding("states_data.csv"))
cities_df = pd.read_csv("./Sleep_health_and_lifestyle_dataset/data.csv", encoding=detect_encoding("./Sleep_health_and_lifestyle_dataset/data.csv"))

# Replace NaN values with a placeholder (e.g., "Unknown")
cities_df["Sleep Disorder"].fillna("None", inplace=True)

# Create FHIR-like resources
fhir_resources = []

# Add CityData resources
for _, entry in cities_df.iterrows():
    resource = {
        "resourceType": "PersonData",
        "PersonID": entry["Person ID"],
        "Gender": entry["Gender"],
        "Age": entry["Age"],
        "Occupation": entry["Occupation"],
        "SleepDuration": entry["Sleep Duration"],
        "QualityOfSleep": entry["Quality of Sleep"],
        "PhysicalActivityLevel": entry["Physical Activity Level"],
        "StressLevel": entry["Stress Level"],
        "BMICategory": entry["BMI Category"],
        "BloodPressure": entry["Blood Pressure"],
        "HeartRate": entry["Heart Rate"],
        "DailySteps": entry["Daily Steps"],
        "SleepDisorder": entry["Sleep Disorder"]
    }
    fhir_resources.append(resource)

# Create a FHIR Bundle
fhir_bundle = {
    "resourceType": "Bundle",
    "type": "collection",
    "entry": [{"resource": res} for res in fhir_resources]
}

# Convert to JSON
json_data = json.dumps(fhir_bundle, indent=2)

# Write JSON data to a file
with open("FHIR_Output.json", "w", encoding="utf-8") as json_file:
    json_file.write(json_data)
