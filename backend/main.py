from fastapi import FastAPI, File, UploadFile
from ultralytics import YOLO
import shutil

app = FastAPI(
    title="Sistem Deteksi Kepatuhan Berpakaian",
    description="Backend menggunakan YOLOv8 + Rule-Based System",
    version="1.0"
)

# Load model YOLO (pretrained dulu untuk demo)
model = YOLO("yolov8n.pt")

# Mapping label (biar mudah dijelaskan)
label_map = {
    0: "person",
    1: "bicycle",
    2: "car",
    3: "motorcycle"
}

@app.get("/")
def home():
    return {"message": "Backend + YOLO + Rule-Based jalan 🚀"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # =========================
    # 1. Simpan file sementara
    # =========================
    file_location = f"temp_{file.filename}"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # =========================
    # 2. Prediksi YOLO
    # =========================
    results = model(file_location)

    # =========================
    # 3. Ambil hasil deteksi
    # =========================
    detections = []
    classes_detected = []

    for r in results:
        for box in r.boxes:
            cls_id = int(box.cls[0])
            confidence = float(box.conf[0])

            detections.append({
                "class_id": cls_id,
                "label": label_map.get(cls_id, "unknown"),
                "confidence": confidence
            })

            classes_detected.append(cls_id)

    # =========================
    # 4. RULE-BASED SYSTEM
    # =========================
    # Default tidak patuh
    status = "Tidak Patuh"

    # Logika sederhana (demo)
    if len(classes_detected) >= 1:
        status = "Patuh"

    # =========================
    # 5. Output
    # =========================
    return {
        "filename": file.filename,
        "detections": detections,
        "total_objects": len(detections),
        "status": status
    }