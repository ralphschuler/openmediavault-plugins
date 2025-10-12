# -*- coding: utf-8 -*-
"""Immich RPC service for OpenMediaVault."""

import logging
import subprocess
from typing import Any, Dict

from openmediavault import rpc
from openmediavault.procenv import ProcessEnvironment

LOGGER = logging.getLogger(__name__)


def _run_command(command: Any) -> subprocess.CompletedProcess:
    """Execute a shell command and log its output."""
    LOGGER.debug("Executing command: %s", command)
    env = ProcessEnvironment().get_env()
    completed = subprocess.run(
        command,
        check=True,
        capture_output=True,
        text=True,
        env=env,
    )
    LOGGER.debug("Command stdout: %s", completed.stdout.strip())
    LOGGER.debug("Command stderr: %s", completed.stderr.strip())
    return completed


class ServiceImmich(rpc.Service):
    """RPC service to manage the Immich Docker stack."""

    name = "Immich"

    @rpc.export
    def getStatus(self) -> Dict[str, Any]:
        """Return the running status of the Immich stack."""
        try:
            result = subprocess.run(
                [
                    "docker",
                    "compose",
                    "ls",
                    "--all",
                    "--format",
                    "{{.Name}}\t{{.Status}}",
                ],
                check=False,
                capture_output=True,
                text=True,
            )
        except FileNotFoundError as exc:
            LOGGER.error("Docker not found: %s", exc)
            return {"running": False, "status": "docker-not-found"}

        running = False
        status_text = "not-installed"
        for line in result.stdout.splitlines():
            if not line:
                continue
            name, _, status = line.partition("\t")
            if name.strip() == "immich":
                status_text = status.strip() or "unknown"
                running = "running" in status_text.lower()
                break

        if result.returncode != 0 and not running:
            status_text = "error"

        return {"running": running, "status": status_text}

    @rpc.export
    def install(self) -> Dict[str, str]:
        """Install and start the Immich stack."""
        _run_command(
            ["/bin/bash", "/usr/share/openmediavault/mkconf/immich", "install"]
        )
        return {"status": "installed"}

    @rpc.export
    def remove(self) -> Dict[str, str]:
        """Remove the Immich stack."""
        _run_command(["/bin/bash", "/usr/share/openmediavault/mkconf/immich", "remove"])
        return {"status": "removed"}

    @rpc.export
    def restart(self) -> Dict[str, str]:
        """Restart the Immich server container."""
        _run_command(
            [
                "docker",
                "compose",
                "-f",
                "/srv/dev-disk-by-label-data/immich/docker-compose.yml",
                "--env-file",
                "/srv/dev-disk-by-label-data/immich/.env",
                "restart",
                "immich-server",
            ]
        )
        return {"status": "restarted"}


rpc.register(ServiceImmich)
