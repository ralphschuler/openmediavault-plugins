# Immich Plugin Guidelines

- Update `src/usr/share/openmediavault/datamodels/conf.service.immich.json` when
  adding new configuration keys and mirror them in the Workbench form page.
- Keep the Docker Compose template in `mkconf/immich` aligned with the upstream
  Immich release and ensure generated secrets remain randomised.
- When modifying RPC behaviour, update the buttons in
  `workbench/component.d/omv-services-immich-form-page.yaml` so the UI exposes
  the new actions.
- Document user-facing behaviour changes in `README.md` and bump the Debian
  changelog.
