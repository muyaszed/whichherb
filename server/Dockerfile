FROM python:3.6-slim-stretch

RUN apt-get update
RUN apt-get install -y python3-dev gcc

RUN pip install torch_nightly -f https://download.pytorch.org/whl/nightly/cpu/torch_nightly.html
RUN pip install fastai

RUN pip install starlette uvicorn python-multipart 

ADD app.py app.py

ADD export.pkl export.pkl

RUN python app.py

EXPOSE 8000

CMD ["python", "app.py", "serve"]