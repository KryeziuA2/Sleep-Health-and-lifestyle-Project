from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np

app = FastAPI()

# Allow CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to the specific domain if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


print("Serving Index1.html")
@app.get("/read_dataset")
def read_dataset():
    try:
        file_path = "./Sleep_health_and_lifestyle_dataset/data.csv"

        print("Serving Index2.html")
        # Read the CSV file using pandas
        data = pd.read_csv(file_path)

        # Replace NaN and infinity values with None
        data.replace([np.nan, np.inf, -np.inf], None, inplace=True)

        # Convert to dictionary and return
        dataset_dict = data.to_dict()
        return {"success": True, "data": dataset_dict}
    except Exception as e:
        return {"success": False, "error": str(e)}
