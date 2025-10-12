#!/usr/bin/env python3
"""Extract Semantic Version numbers from plugin changelog files."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Dict

REPO_ROOT = Path(__file__).resolve().parent.parent
SEMVER_RE = re.compile(r"^(?P<version>\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?)$")


def read_version(plugin: str) -> str:
    changelog = REPO_ROOT / plugin / "debian" / "changelog"
    if not changelog.exists():
        raise FileNotFoundError(f"Missing changelog for {plugin}")

    first_line = changelog.read_text(encoding="utf-8").splitlines()[0]
    if "(" not in first_line or ")" not in first_line:
        raise ValueError(f"Malformed changelog header in {changelog}")

    version = first_line.split("(", 1)[1].split(")", 1)[0].strip()
    if not SEMVER_RE.match(version):
        raise ValueError(f"Version '{version}' in {changelog} is not valid SemVer")
    return version


def main() -> None:
    if len(sys.argv) < 2:
        print(json.dumps({}))
        return

    versions: Dict[str, str] = {}
    for plugin in sys.argv[1:]:
        versions[plugin] = read_version(plugin)
    json.dump(versions, sys.stdout)


if __name__ == "__main__":
    main()
