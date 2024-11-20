import os


class Config:
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    TEMPLATES_DIR = os.path.join(BASE_DIR, 'templates')
    STATIC_DIR = os.path.join(BASE_DIR, 'static')
    CAPTCHA_DIR = os.path.join(STATIC_DIR, 'captchas')
    SECRET_FILE = os.path.join(BASE_DIR, '..', 'scrt.txt')