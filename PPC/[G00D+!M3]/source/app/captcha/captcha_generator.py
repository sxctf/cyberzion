import math
import random
from typing import Tuple, List

from PIL import Image, ImageDraw
from PIL.Image import Image as PilImage


# noinspection PyMethodMayBeStatic
class CaptchaGenerator:
    def __init__(self, size: int):
        self.size = size
        self.cxy = size // 2
        self.black = (random.randint(0, 10), random.randint(0, 10), random.randint(0, 10))
        self.gray = (random.randint(100, 150), random.randint(100, 150), random.randint(100, 150))
        self.hrhand = (random.randint(0, 255), random.randint(0, 150), random.randint(0, 148))
        self.minhand = (random.randint(0, 255), random.randint(0, 150), random.randint(0, 148))

    def create_clock_face(self, draw: ImageDraw.Draw) -> None:
        """Рисует циферблат часов."""
        draw.ellipse([0, 0, self.size, self.size], outline=self.black, width=2)
        for ang in range(0, 360, 6):
            self.draw_clock_mark(draw, ang)

    def draw_clock_mark(self, draw: ImageDraw.Draw, ang: int) -> None:
        """Рисует метку на циферблате."""
        rang = math.radians(ang)
        if ang % 90 == 0:
            gsize = 0.75
        elif ang % 30 == 0:
            gsize = 0.85
        else:
            gsize = 0.90
        draw.line([
            (self.cxy + gsize * self.cxy * math.sin(rang), self.cxy - gsize * self.cxy * math.cos(rang)),
            (self.cxy + self.cxy * 0.9 * math.sin(rang), self.cxy - self.cxy * 0.9 * math.cos(rang))
        ], fill=self.gray, width=2)

    def draw_hour_hand(self, draw: ImageDraw.Draw, hours: int, minutes: int) -> None:
        """Рисует стрелку часов."""
        hour_angle = 30 * hours + minutes / 2
        hour_end = (
            self.cxy + 0.25 * self.size * math.sin(math.radians(hour_angle)),
            self.cxy - 0.25 * self.size * math.cos(math.radians(hour_angle))
        )
        draw.line([self.cxy, self.cxy, *hour_end], fill=self.hrhand, width=max(1, self.size // 20))

    def draw_minute_hand(self, draw: ImageDraw.Draw, minutes: int) -> None:
        """Рисует стрелку минут."""
        minute_angle = 6 * minutes
        minute_end = (
            self.cxy + 0.45 * self.size * math.sin(math.radians(minute_angle)),
            self.cxy - 0.45 * self.size * math.cos(math.radians(minute_angle))
        )
        draw.line([self.cxy, self.cxy, *minute_end], fill=self.minhand, width=max(1, self.size // 25))

    def draw_center_circle(self, draw: ImageDraw.Draw) -> None:
        """Рисует центральный круг на циферблате."""
        sp = max(1, self.size // 20)
        draw.ellipse([self.cxy - sp // 2, self.cxy - sp // 2, self.cxy + sp // 2, self.cxy + sp // 2], fill=self.black)

    def draw_random_shapes(self, draw: ImageDraw.Draw) -> None:
        """Рисует случайные фигуры на изображении."""
        for _ in range(3):  # Рисуем 3 случайные фигуры
            fillcolor = (random.randint(5, 255), random.randint(5, 255), random.randint(5, 255))
            shape_type = random.choice(['circle', 'rectangle', 'polygon'])
            if shape_type == 'circle':
                self.draw_random_circle(draw, fillcolor)
            elif shape_type == 'rectangle':
                self.draw_random_rectangle(draw, fillcolor)
            elif shape_type == 'polygon':
                self.draw_random_polygon(draw, fillcolor)

    def draw_random_circle(self, draw: ImageDraw.Draw, fillcolor: Tuple[int, int, int]) -> None:
        """Рисует случайный круг."""
        x, y = random.randint(40, 120), random.randint(40, 120)
        radius = random.randint(30, 90)
        draw.ellipse([x, y, x + radius, y + radius], outline=fillcolor, width=random.randint(2, 3))

    def draw_random_rectangle(self, draw: ImageDraw.Draw, fillcolor: Tuple[int, int, int]) -> None:
        """Рисует случайный прямоугольник."""
        x1, y1 = random.randint(40, 120), random.randint(40, 120)
        x2, y2 = x1 + random.randint(30, 90), y1 + random.randint(30, 90)
        draw.rectangle([x1, y1, x2, y2], outline=fillcolor, width=random.randint(2, 3))

    def draw_random_polygon(self, draw: ImageDraw.Draw, fillcolor: Tuple[int, int, int]) -> None:
        """Рисует случайный многоугольник."""
        points: List[Tuple[int, int]] = [(random.randint(10, 150), random.randint(10, 150)) for _ in range(3)]
        draw.polygon(points, outline=fillcolor)

    def create_clock_image(self, hours: int, minutes: int) -> PilImage:
        """Создает изображение часов с текущим временем и случайными фигурами."""
        im = Image.new('RGB', (self.size, self.size), (255, 255, 255))
        draw = ImageDraw.Draw(im)

        self.create_clock_face(draw)
        self.draw_minute_hand(draw, minutes)
        self.draw_hour_hand(draw, hours, minutes)
        self.draw_center_circle(draw)
        self.draw_random_shapes(draw)

        return im
