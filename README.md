# openmediavault-immich

An OpenMediaVault 7 plugin that installs and manages the [Immich](https://github.com/immich-app/immich) self-hosted photo platform using Docker Compose.

## Features

- Adds an Immich panel under **Services → Immich** in the OMV WebUI.
- Installs, restarts, and removes the Immich Docker stack with a single click.
- Deploys the official Immich containers via Docker Compose.
- Builds into a distributable `.deb` package and releases via GitHub Actions.

## Development

```bash
git clone https://github.com/your-org/openmediavault-immich.git
cd openmediavault-immich
dpkg-buildpackage -b -us -uc
```

Install the resulting Debian package on an OpenMediaVault 7.x system:

```bash
sudo dpkg -i ../openmediavault-immich_0.1.0_all.deb
sudo omv-salt deploy run webui
```

After installation navigate to **Services → Immich** in the OMV WebUI and click **Install** to deploy Immich. The web interface is exposed on port `2285` and the API/server on port `2283` by default.

## License

MIT
