from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse, RedirectResponse
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from pathlib import Path
import pandas as pd
import numpy as np

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this to the specific domain if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    # Redirect to Index.html
    return RedirectResponse("/Index.html")

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

@app.get("/Index.html")
def read_index():
    # Serve the Index.html file from the same directory as main.py
    return FileResponse("Index.html")

@app.get("/styles.css")
def read_style():
    return FileResponse("styles.css")

@app.get("/SingleEntities.html")
def single_entities():
    # Serve the Index.html file from the same directory as SingleEntities.py
    return FileResponse("SingleEntities.html")

@app.get("/RelationshipEntities.html")
def relationship_entities():
    # Serve the Index.html file from the same directory as RelationshipEntities.py
    return FileResponse("RelationshipEntities.html")


@app.get("/Single_Visualization/age_visualization.js")
def read_other_script():
    # Serve age_visualization.js from the Single_Visualization subdirectory
    return FileResponse("Single_Visualization/age_visualization.js")

@app.get("/Single_Visualization/gender_visualization.js")
def read_gender_visualization():
    # Serve gender_visualization.js with the correct MIME type
    return FileResponse("Single_Visualization/gender_visualization.js", media_type="application/javascript")

@app.get("/Single_Visualization/bmi_visualization.js")
def read_bmi_visualization():
    # Serve bmi_visualization.js with the correct MIME type
    return FileResponse("Single_Visualization/bmi_visualization.js", media_type="application/javascript")

@app.get("/Single_Visualization/occupation_visualization.js")
def read_occupation_visualization():
    # Serve occupation_visualization.js with the correct MIME type
    return FileResponse("Single_Visualization/occupation_visualization.js", media_type="application/javascript")

@app.get("/Single_Visualization/physicalActivityLevel_visualization.js")
def read_physicalActivityLevel_visualization():
    # Serve physicalActivityLevel_visualization.js with the correct MIME type
    return FileResponse("Single_Visualization/physicalActivityLevel_visualization.js", media_type="application/javascript")

@app.get("/Single_Visualization/qualityOfSleep_visualization.js")
def read_qualityOfSleep_visualization():
    # Serve qualityOfSleep_visualization.js with the correct MIME type
    return FileResponse("Single_Visualization/qualityOfSleep_visualization.js", media_type="application/javascript")

@app.get("/Single_Visualization/sleepDisorder_visualization.js")
def read_sleepDisorder_visualization():
    # Serve sleepDisorder_visualization.js with the correct MIME type
    return FileResponse("Single_Visualization/sleepDisorder_visualization.js", media_type="application/javascript")

@app.get("/Single_Visualization/sleepDuration_visualization.js")
def read_sleepDuration_visualization():
    # Serve sleepDuration_visualization.js with the correct MIME type
    return FileResponse("Single_Visualization/sleepDuration_visualization.js", media_type="application/javascript")

@app.get("/Single_Visualization/stressLevel_visualization.js")
def read_stressLevel_visualization():
    # Serve stressLevel_visualization.js with the correct MIME type
    return FileResponse("Single_Visualization/stressLevel_visualization.js", media_type="application/javascript")

@app.get("/HeartDailyStepsRelationshipVisualization.js", response_class=HTMLResponse)
def read_HeartDailyStepsRelationshipVisualization():
    # Serve HeartDailyStepsRelationshipVisualization.js with the correct MIME type
    return FileResponse("HeartDailyStepsRelationshipVisualization.js", media_type="application/javascript")

@app.get("/SleepActivityRelationshipVisualization.js", response_class=HTMLResponse)
def read_SleepActivityRelationshipVisualization():
    # Serve SleepActivityRelationshipVisualization.js with the correct MIME type
    return FileResponse("SleepActivityRelationshipVisualization.js", media_type="application/javascript")

@app.get("/StressSleepRelationshipVisualization.js", response_class=HTMLResponse)
def read_StressSleepRelationshipVisualization():
    # Serve StressSleepRelationshipVisualization.js with the correct MIME type
    return FileResponse("StressSleepRelationshipVisualization.js", media_type="application/javascript")
