import pandas as pd
import json
import chardet

def detect_encoding(file_path):
    with open(file_path, 'rb') as f:
        result = chardet.detect(f.read())
    return result['encoding']

cities_df = pd.read_csv("./Sleep_health_and_lifestyle_dataset/data.csv", encoding=detect_encoding("./Sleep_health_and_lifestyle_dataset/data.csv"))

cities_df["Sleep Disorder"].fillna("None", inplace=True)

fhir_resources = []

# Add Person resources
person_resources = {}
for _, entry in cities_df.iterrows():
    person_id = entry["Person ID"]
    if person_id not in person_resources:
        person_resources[person_id] = {
            "resourceType": "Person",
            "id": str(person_id),
            "gender": entry["Gender"],
            "birthDate": "1900-01-01",
            "telecom": [
                {
                    "system": "phone",
                    "value": "555-555-5555"
                }
            ]
        }

# Add Observation resources
observation_resources = []
for _, entry in cities_df.iterrows():
    person_id = entry["Person ID"]
    if person_id in person_resources:
        subject = {"reference": "Person/" + str(person_id), "display": str(person_id)}

        observation_resources.append({
            "resourceType": "Observation",
            "status": "final",
            "code": {
                "coding": [
                    {
                        "system": "http://loinc.org",
                        "code": "8867-4",
                        "display": "Age"
                    }
                ]
            },
            "subject": subject,
            "valueQuantity": {
                "value": int(entry["Age"]),
                "unit": "a"
            }
        })

        observation_resources.append({
            "resourceType": "Observation",
            "status": "final",
            "code": {
                "coding": [
                    {
                        "system": "http://loinc.org",
                        "code": "42452-4",
                        "display": "Sleep duration"
                    }
                ]
            },
            "subject": subject,
            "valueQuantity": {
                "value": float(entry["Sleep Duration"]),
                "unit": "h"
            }
        })

        # Add more Observation resources for other fields

        fhir_resources.append({"resource": observation_resources})

# Add Person resources to the output
for person_id, person_resource in person_resources.items():
    fhir_resources.append(person_resource)

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
