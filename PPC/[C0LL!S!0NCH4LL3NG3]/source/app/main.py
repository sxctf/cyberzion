from pathlib import Path

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.params import Form
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from starlette.requests import Request
from starlette.responses import HTMLResponse
from starlette.templating import Jinja2Templates

from app.config import Config
from app.logger.custom_logger import CustomizeLogger
from app.utils import crc32

limiter = Limiter(key_func=get_remote_address)

app = FastAPI()
templates = Jinja2Templates(directory=Config.TEMPLATES_DIR)
logger = CustomizeLogger.make_logger(
    Path("app.log"),
    "debug",
    "<level>{level: <8}</level> <green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> - <cyan>{name}</cyan>:<cyan>{function}</cyan> - <level>{message}</level>"
)
app.logger = logger

with open(Config.SECRET_FILE, "r") as f:
    SECRET_FLAG = f.read().strip()

CRC_TO_SEARCH = crc32("Sila ne v collisiyah")


@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.post("/")
@limiter.limit('1/second')
async def submit_task(request: Request, text: str = Form(...)):
    if len(text) > 100:
        logger.info("Input string too long.")
        return templates.TemplateResponse("index.html", {
            "request": request,
            "error": "Длина введенного текста не должна превышать 100 символов"
        })

    if not text.startswith("cyzi"):
        logger.info("Invalid string prefix")
        return templates.TemplateResponse("index.html", {
            "request": request,
            "error": "Введенный текст должен начинаться с 'cyzi'"
        })

    if crc32(text) == CRC_TO_SEARCH:
        logger.info(f"Found collision: {text}")
        return templates.TemplateResponse("index.html", {
            "request": request,
            "success": True,
            "flag": SECRET_FLAG
        })

    logger.info(f'Invalid input string: {text}')
    return templates.TemplateResponse("index.html", {
        "request": request,
        "error": "Упс. Хэш-суммы не совпали:("
    })


@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return templates.TemplateResponse("index.html", {
        "request": request,
        "error": "Поспешая не спеши!"
    }, status_code=429)


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return templates.TemplateResponse("index.html", {
        "request": request,
        "error": str(exc.detail)
    })


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level='debug')
