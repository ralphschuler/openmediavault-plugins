# Certbot Plugin Guidelines

- Update `conf.service.certbot.json` and the Workbench form when introducing new
  Certbot parameters.
- Keep `mkconf/certbot` aligned with the supported Certbot/NGINX images and
  ensure renewals remain idempotent.
- Always regenerate `nginx.conf` templates via the mkconf script when altering
  the challenge configuration.
- Document user guidance updates in `README.md` and increment the Debian
  changelog for releases.
