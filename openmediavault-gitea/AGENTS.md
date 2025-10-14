# Gitea Plugin Guidelines

- Reflect configuration changes in both
  `datamodels/conf.service.gitea.json` and the Workbench form component.
- Keep the Compose template in `mkconf/gitea` up-to-date with supported Gitea
  and PostgreSQL image tags.
- Ensure RPC methods continue to execute via `omv-mkconf gitea <action>` so the
  UI buttons remain functional.
- Describe significant behaviour changes in `README.md` and record them in the
  Debian changelog.
