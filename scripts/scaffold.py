#!/usr/bin/env python3
"""Run the canonical React scaffold generator bundled with this repository."""

from __future__ import annotations

import runpy
from pathlib import Path


SKILL_SCRIPT = (
    Path(__file__).resolve().parents[1]
    / ".agents"
    / "skills"
    / "react-scaffold-app"
    / "scripts"
    / "scaffold.py"
)


def main() -> None:
    if not SKILL_SCRIPT.is_file():
        raise SystemExit(f"scaffold generator not found: {SKILL_SCRIPT}")
    runpy.run_path(str(SKILL_SCRIPT), run_name="__main__")


if __name__ == "__main__":
    main()
