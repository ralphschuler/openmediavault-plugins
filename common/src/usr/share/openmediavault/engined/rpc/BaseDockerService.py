# -*- coding: utf-8 -*-
"""Base RPC service class for Docker-based OpenMediaVault plugins."""

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


class BaseDockerService(rpc.Service):
    """Base RPC service to manage Docker stacks for OMV plugins."""

    # Subclasses must define these attributes
    name = None  # Service name (e.g., "Drone", "Gitea", "Immich")
    mkconf_script = None  # Path to mkconf script (e.g., "/usr/share/openmediavault/mkconf/drone")
    compose_name = None  # Docker compose project name (e.g., "drone", "gitea", "immich")

    @rpc.export
    def getStatus(self) -> Dict[str, Any]:
        """Return the running status of the Docker stack."""
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
            if name.strip() == self.compose_name:
                status_text = status.strip() or "unknown"
                running = "running" in status_text.lower()
                break

        if result.returncode != 0 and not running:
            status_text = "error"

        return {"running": running, "status": status_text}

    @rpc.export
    def install(self) -> Dict[str, str]:
        """Install and start the Docker stack."""
        _run_command(["/bin/bash", self.mkconf_script, "install"])
        return {"status": "installed"}

    @rpc.export
    def remove(self) -> Dict[str, str]:
        """Remove the Docker stack."""
        _run_command(["/bin/bash", self.mkconf_script, "remove"])
        return {"status": "removed"}

    @rpc.export
    def restart(self) -> Dict[str, str]:
        """Restart the Docker stack."""
        _run_command(["/bin/bash", self.mkconf_script, "restart"])
        return {"status": "restarted"}

    @rpc.export
    def getLogs(self, service: str = None) -> Dict[str, str]:
        """Get logs from the Docker stack."""
        try:
            cmd = ["docker", "compose", "logs", "--tail=100"]
            if service:
                cmd.append(service)
            
            result = subprocess.run(
                cmd,
                check=False,
                capture_output=True,
                text=True,
                cwd=f"/srv/dev-disk-by-label-data/{self.compose_name}",
            )
            return {"logs": result.stdout, "error": result.stderr if result.returncode != 0 else ""}
        except Exception as exc:
            LOGGER.error("Failed to get logs: %s", exc)
            return {"logs": "", "error": str(exc)}