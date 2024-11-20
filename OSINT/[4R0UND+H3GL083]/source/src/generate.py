import sys
import math
import random
import qrcode
import pygeohash
from PIL import Image, ImageDraw
from PIL.PngImagePlugin import PngInfo

# Max QR code size
n = 30

# Geohash settings
geohash_prefix_len = 4
geohash_precision = 8

# Read the flag
with open('flag.txt', 'rb') as f:
    flag = f.read()

print('Flag:', flag)

# Generate the QR code as a two-dimensional array
qr_raw = qrcode.QRCode(box_size=1, border=0)
qr_raw.add_data(flag)
qr = qr_raw.get_matrix()
qr_size = len(qr)

print('QR code size:', qr_size)

if (qr_size > n):
    print('QR code too large, abotring...')
    sys.exit(1)

# Open a La Plata map as a background image
map = Image.open('la-plata-map.png')
pixW, pixH = map.size

draw = ImageDraw.Draw(map)

# Calc map width and height in geo coordinate units
map_tl = (-34.895018071217436, -57.99333085657951)
map_br = (-34.94834078237525, -57.928681926528746)
geoW = abs(map_br[1] - map_tl[1])
geoH = abs(map_br[0] - map_tl[0])

# Map corners in geo coordinate units
qr_tl = (-34.8958795678607, -57.96275044208268)
qr_tr = (-34.92039317419578, -57.92975684935618)
qr_br = (-34.94745969688488, -57.95947078751492)
qr_bl = (-34.92296325265278, -57.99241641764583)

# Convert geo coordinate units into image pixel coorditates
def getPixCoords(p):
    return (
        abs(p[1] - map_tl[1]) / geoW * pixW,
        abs(p[0] - map_tl[0]) / geoH * pixH
    )

# Add a dot on the map via image pixel coorditates
def addPixPoint(cx, cy, fill, r = 4):
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=fill)

# Add a dot on the map via geo coordinate units
def addGeoPoint(p, fill, r = 4):
    cx, cy = getPixCoords(p)
    addPixPoint(cx, cy, fill, r)

# Calc QR code steps and offsets on both X-axis and Y-axis
# Offsets are needed because of La Plata is rotated
stepX = (qr_tr[1] - qr_tl[1]) / (n - 1)
offsetXY = (qr_tr[0] - qr_tl[0]) / (n - 1)
stepY = (qr_bl[0] - qr_tl[0]) / (n - 1)
offsetYX = (qr_bl[1] - qr_tl[1]) / (n - 1)

# Geohashes store
geohashes = []

# Render all the QR code points on the map
for j in range(qr_size):
    for i in range(qr_size):
        if (qr[i][j]):
            lat = qr_tl[0] + stepY * j + offsetXY * i
            lon = qr_tl[1] + stepX * i + offsetYX * j
            geohashes.append(pygeohash.encode(lat, lon, precision=geohash_precision))
            addGeoPoint((lat, lon), 'blue', 20)

# Add map corner points
for p in [qr_tl, qr_tr, qr_br, qr_bl]:
    addGeoPoint(p, 'red')

# Save the QR code as a new image for testing purposes
map.save('qr_test.png')

# Compile a result string
res = 'size=' + str(geohash_precision) + ':offset=' + str(geohash_prefix_len) + ':'

random.shuffle(geohashes)
for hash in geohashes:
    res += hash[geohash_prefix_len:geohash_precision] + ':'

with open('task_data.txt', 'w') as f:
    f.write(res)

# Add the result string to the task image metadata
img = Image.open('task_blank.png')
metadata = PngInfo()
metadata.add_text('comment', res)
img.save('task.png', pnginfo=metadata)

print('Generated successfully')
