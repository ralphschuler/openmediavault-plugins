#!/usr/bin/env python3
"""Determine which plugin directories changed between two Git refs."""

from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path
from typing import Iterable, Set

REPO_ROOT = Path(__file__).resolve().parent.parent
PLUGIN_PREFIX = "openmediavault-"


def _git_diff_files(base: str, head: str) -> Iterable[str]:
    try:
        result = subprocess.run(
            ["git", "diff", "--name-only", f"{base}..{head}"],
            check=True,
            capture_output=True,
            text=True,
            cwd=REPO_ROOT,
        )
    except subprocess.CalledProcessError as exc:
        print(f"::warning::Unable to compute git diff: {exc}", file=sys.stderr)
        if exc.stdout:
            print(exc.stdout, file=sys.stderr)
        if exc.stderr:
            print(exc.stderr, file=sys.stderr)
        return []
    return [line.strip() for line in result.stdout.splitlines() if line.strip()]


def _get_latest_tag() -> str | None:
    try:
        result = subprocess.run(
            ["git", "describe", "--tags", "--abbrev=0", "--match", "v*"],
            check=True,
            capture_output=True,
            text=True,
            cwd=REPO_ROOT,
        )
    except subprocess.CalledProcessError:
        return None
    tag = result.stdout.strip()
    return tag or None


def _list_all_plugins() -> Set[str]:
    return {
        entry.name
        for entry in REPO_ROOT.iterdir()
        if entry.is_dir() and entry.name.startswith(PLUGIN_PREFIX)
    }


def _resolve_plugin(path: Path) -> str | None:
    parts = path.parts
    if not parts:
        return None
    candidate = parts[0]
    plugin_dir = REPO_ROOT / candidate
    if candidate.startswith(PLUGIN_PREFIX) and plugin_dir.is_dir():
        return candidate
    return None


def find_changed_plugins(base: str, head: str) -> Set[str]:
    plugins: Set[str] = set()
    for file_path in _git_diff_files(base, head):
        plugin = _resolve_plugin(Path(file_path))
        if plugin:
            plugins.add(plugin)
    return plugins


def main() -> None:
    base_ref = os.environ.get("BASE_REF")
    head_ref = os.environ.get("HEAD_REF", "HEAD")
    plugins: Set[str]

    if base_ref:
        plugins = find_changed_plugins(base_ref, head_ref)
    else:
        latest_tag = _get_latest_tag()
        if latest_tag:
            plugins = find_changed_plugins(latest_tag, head_ref)
        else:
            plugins = _list_all_plugins()

    plugins_list = sorted(plugins)
    payload = {
        "plugins": plugins_list,
        "has_changes": bool(plugins_list),
    }
    json.dump(payload, sys.stdout)


if __name__ == "__main__":
    main()
