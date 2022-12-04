# syntax=docker/dockerfile:1
FROM python:3.9
WORKDIR /server
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
EXPOSE 5000
COPY . .
# CMD ["flask", "--debug", "run", "--host=0.0.0.0"]
CMD ["python", "app.py"]