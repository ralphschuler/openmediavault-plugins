# openmediavault-drone

An OpenMediaVault 7 plugin that deploys the [Drone](https://www.drone.io/) continuous integration platform with Docker Compose.

## Features

- Adds a **Services → Drone** page in the OMV WebUI.
- Installs, restarts, and removes the Drone server and runner containers.
- Stores build configuration under `/srv/dev-disk-by-label-data/drone` by default.

## Development

```bash
git clone https://github.com/your-org/openmediavault-plugins.git
cd openmediavault-plugins/openmediavault-drone
dpkg-buildpackage -b -us -uc
```

Install the resulting Debian package on an OpenMediaVault 7.x system:

```bash
sudo dpkg -i ../openmediavault-drone_0.1.0_all.deb
sudo omv-salt deploy run webui
```

After installation navigate to **Services → Drone** in the OMV WebUI and click **Install** to deploy the stack. The default web interface listens on port `8080`.

## License

MIT
