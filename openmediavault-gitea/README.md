# openmediavault-gitea

An OpenMediaVault 7 plugin that deploys the [Gitea](https://about.gitea.com/) self-hosted Git service using Docker Compose.

## Features

- Adds a **Services → Gitea** page in the OMV WebUI.
- Installs, restarts, and removes the Gitea Docker stack on demand.
- Configures a PostgreSQL-backed Gitea deployment with persistent volumes.

## Development

```bash
git clone https://github.com/your-org/openmediavault-plugins.git
cd openmediavault-plugins/openmediavault-gitea
dpkg-buildpackage -b -us -uc
```

Install the resulting Debian package on an OpenMediaVault 7.x system:

```bash
sudo dpkg -i ../openmediavault-gitea_0.1.0_all.deb
sudo omv-salt deploy run webui
```

After installation navigate to **Services → Gitea** in the OMV WebUI. Click **Install** to deploy the stack. The default web interface listens on port `3080` and SSH on port `2222`.

## License

MIT
