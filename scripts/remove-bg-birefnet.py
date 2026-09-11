#!/usr/bin/env python3
"""Create a product-preserving transparent PNG with BiRefNet via rembg."""

from __future__ import annotations

import argparse
import os
from pathlib import Path


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--model-dir", type=Path, required=True)
    parser.add_argument("--model", default="birefnet-general")
    args = parser.parse_args()

    args.model_dir.mkdir(parents=True, exist_ok=True)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    os.environ["U2NET_HOME"] = str(args.model_dir.resolve())

    from PIL import Image
    from rembg import new_session, remove

    source = Image.open(args.input).convert("RGB")
    session = new_session(args.model)
    result = remove(source, session=session)
    result.save(args.output, format="PNG", optimize=True)

    alpha = result.getchannel("A")
    alpha_min, alpha_max = alpha.getextrema()
    transparent = sum(1 for value in alpha.getdata() if value == 0)
    opaque = sum(1 for value in alpha.getdata() if value == 255)
    print(
        {
            "output": str(args.output.resolve()),
            "size": result.size,
            "mode": result.mode,
            "alpha_extrema": (alpha_min, alpha_max),
            "transparent_pixels": transparent,
            "opaque_pixels": opaque,
        }
    )


if __name__ == "__main__":
    main()
