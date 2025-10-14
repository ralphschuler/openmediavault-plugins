# openmediavault-certbot

An OpenMediaVault 7 plugin that provisions and manages a Docker based [Certbot](https://certbot.eff.org/) stack for issuing and renewing Let's Encrypt TLS certificates.

## Features

- Adds a **Services → Certbot** entry in the OMV WebUI when paired with a matching panel.
- Creates a ready-to-use Docker Compose stack for Certbot with an nginx challenge helper.
- Automates certificate renewals every 12 hours and stores artifacts on persistent volumes.

## Stack layout

The plugin installs the stack into `/srv/dev-disk-by-label-data/certbot` with the following structure:

```
.env                     # Environment configuration (email, domains, ports)
docker-compose.yml       # Generated compose file
nginx.conf               # Challenge server configuration
www/                     # Webroot shared between nginx and Certbot
etc-letsencrypt/         # Persisted certificates
var-lib-letsencrypt/     # Certbot working directory
logs/                    # Certbot logs
```

## Installation workflow

1. Install the Debian package:
   ```bash
   sudo dpkg -i ../openmediavault-certbot_0.1.0_all.deb
   sudo omv-salt deploy run webui
   ```
2. Run the configuration script once to generate defaults:
   ```bash
   sudo /usr/share/openmediavault/mkconf/certbot install
   ```
   The first run creates the `.env` file and exits so you can supply real values.
3. Edit `/srv/dev-disk-by-label-data/certbot/.env` and update:
   - `CERTBOT_EMAIL` with a valid mailbox
   - `CERTBOT_DOMAINS` with a comma-separated list of domains
   - Optionally set `CERTBOT_STAGING=0` for production certificates
4. Re-run the install action:
   ```bash
   sudo /usr/share/openmediavault/mkconf/certbot install
   ```
   This pulls images, starts the nginx challenge helper, and performs the initial certificate request.

## Maintenance commands

```bash
sudo /usr/share/openmediavault/mkconf/certbot restart   # Restart the stack
sudo /usr/share/openmediavault/mkconf/certbot status    # View container state
sudo /usr/share/openmediavault/mkconf/certbot remove    # Tear everything down
```

Certificates and logs remain on disk under `/srv/dev-disk-by-label-data/certbot` until explicitly removed.

## License

MIT
