"""Generate favicon.ico from the uploaded image/favicon.png.

This script converts the source PNG favicon into a multi-size .ico file
placed at public/favicon.ico so browsers can request the standard
/favicon.ico path.
"""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "image" / "favicon.png"
TARGET = ROOT / "public" / "favicon.ico"
ICON_SIZES = [(16, 16), (32, 32), (48, 48), (64, 64)]


def main() -> None:
    if not SOURCE.exists():
        raise SystemExit(f"Source favicon not found: {SOURCE}")

    TARGET.parent.mkdir(parents=True, exist_ok=True)

    with Image.open(SOURCE) as img:
        rgba = img.convert("RGBA")
        rgba.save(TARGET, format="ICO", sizes=ICON_SIZES)

    print(f"Created {TARGET}")


if __name__ == "__main__":
    main()
