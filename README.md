# AgroVision

**AgroVision** is an AI-powered Crop Disease Detection and Fertilizer Recommendation System built specifically for farmers in Nepal. It combines a clean, farmer-friendly user interface with a robust Deep Learning backend (MobileNetV2) to instantly diagnose crop diseases from images. With this application, users receive highly accurate, immediate guidance regarding fertilizer usage, pesticide treatments, and prevention tips.

## Setup Instructions

### 1. Backend Setup (Flask API)
The backend requires Python and standard machine learning libraries. Ensure you have activated an appropriately clean Python environment.
```bash
cd backend
pip install -r requirements.txt
python app.py
```
*The API will start running natively on `http://localhost:5000`.*

### 2. Frontend Setup (React/Vite)
Our fast modern client requires Node.js to be installed.
```bash
cd frontend
npm install
npm run dev
```
*The UI will boot up at `http://localhost:5173`. Open this target in your browser to interact.*

## Optional: Re-Training the AI Model
If you ever need to retrain the Convolutional Neural Network from scratch across the PlantVillage dataset using Transfer Learning:
1. Ensure you place your downloaded dataset images organized by class inside a `./data/PlantVillage/` directory.
2. Edit the root `DATASET_PATH` within `backend/train_mobilenet.py` if your structure differs.
3. Run the trainer:
```bash
cd backend
python train_mobilenet.py
```
*This will override `model.h5` inside the backend directory with new weights!*

## Supported Output Crops & Diseases

**Tomato**
- Early Blight
- Late Blight
- Leaf Mold
- Healthy

**Potato**
- Early Blight
- Late Blight
- Healthy

**Maize (Corn)**
- Common Rust
- Northern Leaf Blight
- Healthy

**Pepper (Bell)**
- Bacterial Spot
- Healthy
