#!/usr/bin/env python3
"""Redact real names in Course Overview screenshots (overwrite in place)."""
from __future__ import annotations

import csv
import io
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public/tools/dadb-course-overview"
ASSET_MAP = {
    "team-1.jpg": ROOT
    / "assets/Artjom_DADB_Production_Management/ProjektManagement_CourseOverviewTool/TeamOverviewTool_1.jpg",
    "team-2.jpg": ROOT
    / "assets/Artjom_DADB_Production_Management/ProjektManagement_CourseOverviewTool/TeamOverviewTool_2.jpg",
    "course-4.jpg": ROOT
    / "assets/Artjom_DADB_Production_Management/ProjektManagement_CourseOverviewTool/CourseOverviewTool_4.jpg",
}

WORD_MAP = {
    "Lukas": "Leon",
    "Hoffman": "Hartmann",
    "Charleen": "Clara",
    "Rohlff": "Roth",
    "Prinja": "Petra",
    "Jaruchat": "Jung",
    "Bulent": "Ben",
    "Bülent": "Ben",
    "Kesen": "Keller",
    "Kirsten": "Kim",
    "Kelleher": "Lorenz",
    "Sophie": "Sara",
    "Hasselstroem": "Holst",
    "HA": "LH",
    "EZ": "CR",
    "JB": "PJ",
}

BANNED = [
    "Lukas",
    "Hoffman",
    "Charleen",
    "Rohlff",
    "Prinja",
    "Jaruchat",
    "Kesen",
    "Kirsten",
    "Kelleher",
    "Sophie",
    "Hasselstroem",
    "Bülent",
    "Bulent",
]


def tesseract_words(image_path: Path) -> list[dict]:
    raw = subprocess.check_output(
        ["tesseract", str(image_path), "stdout", "tsv"],
        stderr=subprocess.DEVNULL,
    ).decode("utf-8", errors="replace")
    rows: list[dict] = []
    reader = csv.DictReader(io.StringIO(raw), delimiter="\t")
    for row in reader:
        if row.get("level") != "5":
            continue
        text = (row.get("text") or "").strip()
        if not text:
            continue
        conf = float(row.get("conf") or 0)
        if conf < 40:
            continue
        rows.append(
            {
                "text": text,
                "left": int(row["left"]),
                "top": int(row["top"]),
                "width": int(row["width"]),
                "height": int(row["height"]),
            }
        )
    return rows


def sample_bg(img: Image.Image, left: int, top: int, w: int, h: int) -> tuple[int, int, int]:
    px = img.load()
    samples = []
    for x in (left - 6, left - 2, left + w + 2):
        if 0 <= x < img.width:
            y = min(img.height - 1, top + h // 2)
            samples.append(px[x, y][:3])
    if not samples:
        return (245, 245, 245)
    r = sum(s[0] for s in samples) // len(samples)
    g = sum(s[1] for s in samples) // len(samples)
    b = sum(s[2] for s in samples) // len(samples)
    return (r, g, b)


def load_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for path in (
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    ):
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def redact(path: Path) -> None:
    words = tesseract_words(path)
    img = Image.open(path).convert("RGB")
    draw = ImageDraw.Draw(img)

    for word in words:
        text = word["text"]
        if text == "+1":
            bg = sample_bg(img, word["left"], word["top"], word["width"], word["height"])
            pad = 4
            draw.rectangle(
                [
                    word["left"] - pad,
                    word["top"] - pad,
                    word["left"] + word["width"] + pad,
                    word["top"] + word["height"] + pad,
                ],
                fill=bg,
            )
            continue

        replacement = WORD_MAP.get(text)
        if not replacement:
            continue

        left, top, w, h = word["left"], word["top"], word["width"], word["height"]
        bg = sample_bg(img, left, top, w, h)
        pad_x, pad_y = 6, 4
        draw.rectangle(
            [left - pad_x, top - pad_y, left + w + pad_x, top + h + pad_y],
            fill=bg,
        )
        font_size = max(12, int(h * 0.88))
        font = load_font(font_size)
        draw.text((left, top + h / 2 - font_size * 0.45), replacement, fill=(28, 28, 28), font=font)

        if text == "JB" and w > 60:
            draw.rectangle(
                [left - pad_x, top - pad_y, left + w + pad_x, top + h + pad_y],
                fill=bg,
            )
            draw.text((left, top + h / 2 - font_size * 0.45), "PJ", fill=(28, 28, 28), font=font)

    for word in words:
        if word["text"] == "T" and 500 < word["top"] < 620 and word["left"] > 280:
            bg = sample_bg(img, word["left"], word["top"], word["width"], word["height"])
            pad = 5
            draw.rectangle(
                [
                    word["left"] - pad,
                    word["top"] - pad,
                    word["left"] + word["width"] + pad,
                    word["top"] + word["height"] + pad,
                ],
                fill=bg,
            )

    img.save(path, quality=92, optimize=True)


def verify(path: Path) -> None:
    text = subprocess.check_output(
        ["tesseract", str(path), "stdout"], stderr=subprocess.DEVNULL
    ).decode("utf-8", errors="replace")
    for banned in BANNED:
        if banned in text:
            raise SystemExit(f"Still found {banned!r} in {path}")
    for token in (" HA ", " EZ ", " JB ", "\nHA\n", "\nEZ\n", "\nJB\n"):
        if token.strip() in text.split():
            # allow LH CR PJ
            if token.strip() in {"HA", "EZ", "JB"}:
                raise SystemExit(f"Still found initials {token.strip()!r} in {path}")


def main() -> None:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-q", "pillow"])
    for name in ("team-1.jpg", "team-2.jpg", "course-4.jpg"):
        pub = PUBLIC / name
        redact(pub)
        verify(pub)
        asset = ASSET_MAP[name]
        asset.parent.mkdir(parents=True, exist_ok=True)
        asset.write_bytes(pub.read_bytes())
        verify(asset)
        print(f"OK {name}")


if __name__ == "__main__":
    main()
