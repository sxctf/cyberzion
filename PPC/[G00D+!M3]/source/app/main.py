import asyncio
import os
from contextlib import asynccontextmanager
from pathlib import Path
from typing import List

import uvicorn
from fastapi import FastAPI, Form
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from starlette.requests import Request
from starlette.responses import StreamingResponse
from starlette.templating import Jinja2Templates

from app.captcha.captcha_manager import CaptchaManager
from app.config import Config
from app.logger.custom_logger import CustomizeLogger


@asynccontextmanager
async def lifespan(app: FastAPI):
    asyncio.create_task(update_captcha_job())
    asyncio.create_task(cleanup_old_captchas_job())
    yield


limiter = Limiter(key_func=get_remote_address)
app = FastAPI(lifespan=lifespan)
logger = CustomizeLogger.make_logger(
    Path("app.log"),
    "debug",
    "<level>{level: <8}</level> <green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> - <cyan>{name}</cyan>:<cyan>{function}</cyan> - <level>{message}</level>"
)
app.logger = logger

REFRESH_INTERVAL_MS = 1000

app.mount("/static", StaticFiles(directory=Config.CAPTCHA_DIR), name="static")
templates = Jinja2Templates(directory=Config.TEMPLATES_DIR)

captcha_manager = CaptchaManager(Config.CAPTCHA_DIR)

with open(Config.SECRET_FILE, "r") as f:
    SECRET_FLAG = f.read().strip()


@app.get("/", response_class=HTMLResponse)
@limiter.limit('5/second')
async def get_task(request: Request):
    captcha_file, _ = captcha_manager.get_current_captcha()
    captcha_path = f'/static/{captcha_file}'

    return templates.TemplateResponse("index.html", {
        "request": request,
        "captcha_path": captcha_path,
        "refresh_interval": REFRESH_INTERVAL_MS
    })


@app.post("/", response_class=HTMLResponse)
@limiter.limit('2/minute')
async def submit_task(request: Request, time_input: str = Form(...)):
    current_captcha, correct_time = captcha_manager.get_current_captcha()

    if time_input == correct_time:
        logger.info(f"New correct solution.")
        return templates.TemplateResponse("index.html", {
            "request": request,
            "success": f"Верно! Вот ваш флаг: {SECRET_FLAG}",
            "captcha_path": f'/static/{current_captcha}'
        })
    else:
        logger.info(f"Incorrect solution: {time_input}.")
        return templates.TemplateResponse("index.html", {
            "request": request,
            "error": "Неправильное время. Попробуйте еще раз.",
            "captcha_path": f'/static/{current_captcha}'
        })


@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    current_captcha, _ = captcha_manager.get_current_captcha()
    return templates.TemplateResponse("index.html", {
        "request": request,
        "error": "Поспешая не спеши",
        "captcha_path": f'/static/{current_captcha}'
    }, status_code=429)


clients: List[asyncio.Queue] = []


@app.get("/captchas-stream")
async def sse_endpoint(request: Request):
    logger.info(f"New stream client. Remote address: {get_remote_address(request)}")
    client_queue = asyncio.Queue()
    clients.append(client_queue)

    async def event_generator():
        try:
            while True:
                data = await client_queue.get()
                yield f"data: {data}\n\n"
        except asyncio.CancelledError:
            clients.remove(client_queue)
            logger.debug(f"Stream client disconnected. Remote address: {get_remote_address(request)}")

    return StreamingResponse(event_generator(), media_type="text/event-stream")


async def update_captcha_job():
    while True:
        captcha_manager.refresh_captcha()
        # logger.info("Captcha refreshed")
        captcha_file, _ = captcha_manager.get_current_captcha()

        for client_queue in clients:
            await client_queue.put(captcha_file)

        await asyncio.sleep(REFRESH_INTERVAL_MS / 1000)


async def cleanup_old_captchas_job():
    while True:
        await captcha_manager.cleanup_old_captchas()
        await asyncio.sleep(60)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level='debug')
