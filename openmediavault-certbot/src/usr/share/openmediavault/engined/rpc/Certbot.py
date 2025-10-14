# -*- coding: utf-8 -*-
"""Certbot RPC service for OpenMediaVault."""

import os
import sys

# Add the common module path to sys.path if it exists
common_path = "/usr/share/openmediavault/engined/rpc"
if os.path.exists(common_path) and common_path not in sys.path:
    sys.path.insert(0, common_path)

try:
    from BaseDockerService import BaseDockerService
except ImportError:
    # Fallback to legacy implementation if common module not available
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
        """Fallback base service for compatibility."""

        @rpc.export
        def getStatus(self) -> Dict[str, Any]:
            """Return the running status of the Certbot stack."""
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
                if name.strip() == "certbot":
                    status_text = status.strip() or "unknown"
                    running = "running" in status_text.lower()
                    break

            if result.returncode != 0 and not running:
                status_text = "error"

            return {"running": running, "status": status_text}

        @rpc.export
        def install(self) -> Dict[str, str]:
            """Install and start the Certbot stack."""
            _run_command(
                ["/bin/bash", "/usr/share/openmediavault/mkconf/certbot", "install"]
            )
            return {"status": "installed"}

        @rpc.export
        def remove(self) -> Dict[str, str]:
            """Remove the Certbot stack."""
            _run_command(
                ["/bin/bash", "/usr/share/openmediavault/mkconf/certbot", "remove"]
            )
            return {"status": "removed"}

        @rpc.export
        def restart(self) -> Dict[str, str]:
            """Restart the Certbot stack."""
            _run_command(
                ["/bin/bash", "/usr/share/openmediavault/mkconf/certbot", "restart"]
            )
            return {"status": "restarted"}

        @rpc.export
        def getLogs(self) -> Dict[str, str]:
            """Get logs from the Certbot stack."""
            try:
                result = subprocess.run(
                    [
                        "docker",
                        "compose",
                        "logs",
                        "--tail=100",
                    ],
                    check=False,
                    capture_output=True,
                    text=True,
                    cwd="/srv/dev-disk-by-label-data/certbot",
                )
                return {
                    "logs": result.stdout,
                    "error": result.stderr if result.returncode != 0 else "",
                }
            except Exception as exc:  # pylint: disable=broad-except
                LOGGER.error("Failed to get logs: %s", exc)
                return {"logs": "", "error": str(exc)}


from openmediavault import rpc  # noqa: E402


class ServiceCertbot(BaseDockerService):
    """RPC service to manage the Certbot Docker stack."""

    name = "Certbot"
    mkconf_script = "/usr/share/openmediavault/mkconf/certbot"
    compose_name = "certbot"


rpc.register(ServiceCertbot)
