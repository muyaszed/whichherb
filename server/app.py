from starlette.applications import Starlette
from starlette.responses import JSONResponse
import uvicorn
from pathlib import Path
from fastai.vision import (
    open_image,
    load_learner,

)
import torch
import os
import sys
from io import BytesIO


app = Starlette()
root_dir = os.path.dirname(os.path.abspath(__file__))
path = Path(root_dir)

learn = load_learner(path)

@app.route('/upload', methods=["POST"])
async def upload(request):
    data = await request.form()
    # pu.db
    bytes = await data["file"].read()
    return predict_image_from_bytes(bytes)

def predict_image_from_bytes(bytes):
    img = open_image(BytesIO(bytes))
    pred_class,pred_idx,outputs = learn.predict(img)
    

    return JSONResponse({
        "predictions": learn.data.classes[pred_idx.item()]
    })

if __name__ == '__main__':
    if "serve" in sys.argv:
        uvicorn.run(app, host='0.0.0.0', port=8000)