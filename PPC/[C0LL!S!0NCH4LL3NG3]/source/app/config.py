import os


class Config:
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    TEMPLATES_DIR = os.path.join(BASE_DIR, 'templates')
    SECRET_FILE = os.path.join(BASE_DIR, '..', 'scrt.txt')
