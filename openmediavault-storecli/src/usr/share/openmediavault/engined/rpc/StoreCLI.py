# -*- coding: utf-8 -*-
"""StoreCLI RPC service for OpenMediaVault."""

from __future__ import annotations

import json
import logging
import re
import shlex
import shutil
import subprocess
from typing import Any, Dict, List, Optional

from openmediavault import rpc
from openmediavault.procenv import ProcessEnvironment

LOGGER = logging.getLogger(__name__)


class ServiceStoreCLI(rpc.Service):
    """RPC layer exposing read-only StoreCLI operations to the OMV UI."""

    script_path = "/usr/share/openmediavault/mkconf/storecli"
    binary_candidates = [
        "storecli",
        "storecli64",
        "storcli",
        "storcli64",
    ]

    def _get_env(self) -> Dict[str, str]:
        return ProcessEnvironment().get_env()

    def _detect_binary(self) -> Optional[str]:
        for candidate in self.binary_candidates:
            path = shutil.which(candidate)
            if path:
                return path
        return None

    def _run_command(self, command: List[str]) -> subprocess.CompletedProcess:
        LOGGER.debug("Executing command: %s", json.dumps(command))
        return subprocess.run(
            command,
            check=False,
            capture_output=True,
            text=True,
            env=self._get_env(),
        )

    @staticmethod
    def _safe_controller(controller: str) -> str:
        controller = (controller or "all").strip().lower()
        if controller in {"all", "*", "call"}:
            return "/call"
        if re.fullmatch(r"[0-9]+", controller):
            return f"/c{controller}"
        raise ValueError("Invalid controller identifier")

    @staticmethod
    def _sanitize_show_args(arguments: List[Any]) -> List[str]:
        if not isinstance(arguments, list) or not arguments:
            raise ValueError("Arguments must be a non-empty list")

        cleaned: List[str] = []
        pattern = re.compile(r"^[A-Za-z0-9_./:-]+$")
        for index, value in enumerate(arguments):
            if not isinstance(value, str):
                raise ValueError("Command arguments must be strings")
            value = value.strip()
            if not value:
                continue
            if not pattern.match(value):
                raise ValueError("Invalid characters in argument: %s" % value)
            cleaned.append(value)

        if not cleaned:
            raise ValueError("No valid arguments supplied")
        if cleaned[0].lower() != "show":
            raise ValueError("Only read-only 'show' commands are permitted")
        return cleaned

    @staticmethod
    def _serialize_result(
        command: List[str], result: subprocess.CompletedProcess
    ) -> Dict[str, Any]:
        return {
            "command": " ".join(shlex.quote(part) for part in command),
            "stdout": result.stdout,
            "stderr": result.stderr,
            "returncode": result.returncode,
        }

    @rpc.export
    def getStatus(self) -> Dict[str, Any]:
        """Return StoreCLI availability and a summary of controller status."""

        binary = self._detect_binary()
        installed = binary is not None
        version_info = ""
        summary_output = ""
        error: Optional[str] = None

        if installed and binary:
            version_result = self._run_command([binary, "-v"])
            if version_result.returncode == 0:
                version_info = (
                    version_result.stdout.strip() or version_result.stderr.strip()
                )
            else:
                error = version_result.stderr.strip() or version_result.stdout.strip()

            summary_result = self._run_command([binary, "show", "summary"])
            if summary_result.returncode == 0:
                summary_output = summary_result.stdout.strip()
            else:
                extra = summary_result.stderr.strip() or summary_result.stdout.strip()
                error = "\n".join(filter(None, [error, extra])) if error else extra
        else:
            error = (
                "No storecli/storcli binary found. Install Broadcom's StoreCLI package "
                "and ensure it is available in the system PATH."
            )

        controller_hints = "\n".join(
            line.strip()
            for line in summary_output.splitlines()
            if line.strip() and line.lower().startswith(("controller", "ctl"))
        )

        return {
            "installed": installed,
            "binary": binary,
            "version": version_info,
            "summary": summary_output,
            "controllerHints": controller_hints,
            "error": error or "",
        }

    @rpc.export
    def getControllerDetails(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Run a safe controller detail command."""

        binary = self._detect_binary()
        if not binary:
            raise rpc.Error("storecli binary is not available on this system")

        controller = params.get("controller", "all")
        target = self._safe_controller(str(controller))
        arguments = params.get("arguments", ["show", "all"])
        cleaned = self._sanitize_show_args(arguments)

        command = [binary, target] + cleaned
        result = self._run_command(command)
        return self._serialize_result(command, result)

    @rpc.export
    def runShowCommand(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a validated StoreCLI read-only command."""

        binary = self._detect_binary()
        if not binary:
            raise rpc.Error("storecli binary is not available on this system")

        controller = params.get("controller", "all")
        target = self._safe_controller(str(controller))
        cleaned = self._sanitize_show_args(params.get("arguments", []))

        command = [binary, target] + cleaned
        result = self._run_command(command)
        return self._serialize_result(command, result)

    @rpc.export
    def getLogs(self) -> Dict[str, Any]:
        """Return recent controller event log output."""

        try:
            response = self.getControllerDetails(
                {"controller": "all", "arguments": ["show", "events"]}
            )
        except Exception as exc:  # pragma: no cover - defensive fallback
            LOGGER.error("Failed to collect StoreCLI logs: %s", exc)
            return {"logs": "", "error": str(exc)}

        return {"logs": response.get("stdout", ""), "error": response.get("stderr")}
