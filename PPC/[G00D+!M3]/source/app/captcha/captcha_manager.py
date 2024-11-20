import logging
import os
import random
import uuid
from datetime import datetime, timedelta
from typing import Tuple

from PIL import Image

from app.captcha.captcha_generator import CaptchaGenerator


# noinspection PyMethodMayBeStatic
class CaptchaManager:
    def __init__(self, captcha_dir: str, image_size: int = 200, cleanup_interval_seconds: int = 60):
        self.logger = logging.getLogger(self.__class__.__name__)
        self.image_size = image_size
        self.captcha_dir = captcha_dir
        self.current_captcha = None
        self.current_time = None
        self.cleanup_interval_seconds = cleanup_interval_seconds
        self.refresh_captcha()

    def refresh_captcha(self) -> None:
        captcha_generator = CaptchaGenerator(self.image_size)
        hours, minutes = self.generate_random_time()
        new_captcha = captcha_generator.create_clock_image(hours, minutes)
        self.current_captcha = self._save_captcha(new_captcha)
        self.current_time = f"{hours:02d}:{minutes:02d}"

    def _save_captcha(self, img: Image) -> str:
        captcha_id = str(uuid.uuid4())
        file_name = f"{captcha_id}.jpg"
        file_path = os.path.join(self.captcha_dir, file_name)
        img.save(file_path)
        return file_name

    def generate_random_time(self) -> Tuple[int, int]:
        hours = random.randint(0, 11)
        minutes = random.randint(0, 59)
        return hours, minutes

    def get_current_captcha(self) -> Tuple[str, str]:
        return self.current_captcha, self.current_time

    async def cleanup_old_captchas(self) -> None:
        expiration_time = datetime.now() - timedelta(seconds=self.cleanup_interval_seconds)

        captchas = os.listdir(self.captcha_dir)
        for file_name in captchas:
            file_path = os.path.join(self.captcha_dir, file_name)

            if os.path.isfile(file_path) and file_name.endswith(".jpg"):
                file_mtime = datetime.fromtimestamp(os.path.getmtime(file_path))

                if file_mtime < expiration_time and file_name != self.current_captcha:
                    try:
                        os.remove(file_path)
                    except Exception as e:
                        self.logger.error(f"Failed to remove captcha {file_path}: {e}")

        self.logger.debug(f"Cleanup completed. Old captchas removed.")
