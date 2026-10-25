#!/usr/bin/env python3
"""Prepare web-sized originals from a reviewed inventory. Requires Pillow."""
import argparse
import hashlib
import json
from pathlib import Path
import shutil
from urllib.parse import unquote, urlsplit

from PIL import Image, ImageOps

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("inventory", type=Path)
args = parser.parse_args()
manifest = json.loads((args.inventory / "manifest.json").read_text())
destination = Path("public/assets/images")
destination.mkdir(parents=True, exist_ok=True)
assets = {}
for source in manifest["assets"]:
    if not source["content_type"].startswith("image/") or source["content_type"] == "image/svg+xml":
        continue
    original = args.inventory / source["file"]
    relative = unquote(urlsplit(source["url"]).path).removeprefix("/assets/img/")
    with Image.open(original) as image:
        image = ImageOps.exif_transpose(image)
        if relative == "logo/logo.png":
            filename = "logo.png"
            shutil.copy2(original, destination / filename)
        elif relative == "icon/favicon.png":
            filename = "favicon.png"
            image.thumbnail((64, 64), Image.Resampling.LANCZOS)
            image.save(destination / filename, optimize=True)
        else:
            filename = hashlib.sha256(relative.encode()).hexdigest()[:14] + ".webp"
            image.thumbnail((1800, 1800), Image.Resampling.LANCZOS)
            if image.mode not in ("RGB", "RGBA"):
                image = image.convert("RGBA" if "transparency" in image.info else "RGB")
            image.save(destination / filename, "WEBP", quality=86, method=4)
        assets[relative] = {
            "path": "assets/images/" + filename,
            "width": image.width,
            "height": image.height,
            "source": source["url"],
            "originalSha256": source["sha256"],
            "sha256": hashlib.sha256((destination / filename).read_bytes()).hexdigest(),
        }
        if relative.startswith("productcatalogue/"):
            print_image = image.convert("RGB")
            print_image.thumbnail((1200, 1200), Image.Resampling.LANCZOS)
            print_name = Path(filename).stem + "-print.jpg"
            print_image.save(destination / print_name, "JPEG", quality=85, optimize=True)
            assets[relative].update(printPath="assets/images/" + print_name,
                                    printWidth=print_image.width, printHeight=print_image.height)
        print(f"Prepared {relative}", flush=True)
fonts = Path("public/assets/fonts")
fonts.mkdir(parents=True, exist_ok=True)
for font in (args.inventory / "fonts").iterdir():
    if font.suffix == ".txt":
        (fonts / font.name).write_text("\n".join(line.rstrip() for line in font.read_text().splitlines()) + "\n")
    else:
        shutil.copy2(font, fonts / font.name)
Path("content/assets.json").write_text(json.dumps(assets, indent=2) + "\n")
print(f"Prepared {len(assets)} original image assets, including the unchanged logo, and licensed fonts.")
