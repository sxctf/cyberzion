FROM python:3.12

RUN mkdir -p /ctf
WORKDIR /ctf

COPY task/requirements.txt .
RUN pip3 install --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org -r requirements.txt

COPY task/ .

ENV FLASK_DEBUG=1
