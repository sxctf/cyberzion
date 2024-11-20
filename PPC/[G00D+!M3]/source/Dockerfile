FROM python:3.12

RUN mkdir -p /ctf
WORKDIR /ctf

COPY ./requirements.txt .
COPY ./scrt.txt .
RUN pip3 install --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org -r requirements.txt

COPY ./app ./app
RUN mkdir -p app/static/captchas
