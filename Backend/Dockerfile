FROM python:3.11

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install fastapi uvicorn pandas==1.5.3 tensorflow==2.14.0 scikit-learn==1.3.0 keras==2.14.0

COPY . /code

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]