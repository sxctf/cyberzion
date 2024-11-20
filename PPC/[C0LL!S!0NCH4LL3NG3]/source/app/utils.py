import zlib


def crc32(input_string: str) -> int:
    input_bytes = input_string.encode('utf-8')
    crc = zlib.crc32(input_bytes)
    return crc & 0xFFFFFFFF
