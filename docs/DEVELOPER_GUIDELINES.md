# OpenMediaVault Plugin Developer Guidelines

This repository follows the upstream OpenMediaVault 7 development model. The
expectations below summarise the official developer documentation at
<https://docs.openmediavault.org/en/stable/development/index.html> and
highlight the conventions adopted for this monorepo.

## Environment

- Target platform: **Debian 12 / OpenMediaVault 7**.
- Preferred shell: POSIX `sh`/`dash` compatible scripts with `set -euo pipefail`.
- PHP version: **8.2** (match the version shipped by OMV 7).
- JavaScript UI: **Workbench YAML components** instead of legacy ExtJS panels.
- Source formatting: run `npm run format` and `npm run lint` at the repository
  root before committing.

## Repository structure

Each plugin lives in a folder named `openmediavault-<service>` and mirrors the
layout used in the upstream repository:

```
openmediavault-<service>/
├── debian/                               # Debian packaging metadata
├── src/usr/share/openmediavault/
│   ├── confdb/create.d/                  # Config database bootstrap scripts
│   ├── datamodels/                       # JSON schema definitions
│   ├── engined/module/                   # Service status integration
│   ├── engined/rpc/                      # RPC entry points (PHP)
│   ├── mkconf/                           # Shell helpers invoked via omv-mkconf
│   └── workbench/                        # Web UI declaration (YAML)
└── README.md                             # Plugin specific documentation
```

When adding new files, make sure `debian/install` installs the folder hierarchy
into `/usr/share/openmediavault/`.

## Configuration database (ConfDB)

- Define a JSON schema in `datamodels/conf.service.<name>.json`.
- Provide initial values with a script in
  `confdb/create.d/conf.service.<name>.sh` using `omv_config_*` helpers.
- Add migration scripts in `confdb/migrations.d/` when changing the schema.
- Always keep keys and XML node names lowercase.

## RPC services

- Create a class `OMVRpcService<Name>` in
  `engined/rpc/<name>.inc` extending `\OMV\Rpc\ServiceAbstract`.
- Register CRUD methods in `initialize()`.
- Retrieve configuration objects with
  `\OMV\Config\Database::getInstance()`.
- Use `\OMV\System\Process` to call shell helpers inside try/catch blocks.
- Return associative arrays encoded as JSON by the RPC subsystem.

## Engine modules

- Add a class `Engined\Module\<Name>` extending
  `\OMV\Engine\Module\ServiceAbstract` to surface status information in the OMV
  dashboard.
- Implement `getStatus()` returning `name`, `title`, `enabled`, and `running`.
- Mark the module dirty when configuration changes by registering listeners in
  `bindListeners()`.

## Workbench UI

- Define a navigation entry under
  `workbench/navigation.d/services.<name>.yaml`.
- Create a route definition (`workbench/route.d/services.<name>.yaml`) pointing
  to a component name.
- Implement the UI with a form page in
  `workbench/component.d/omv-services-<name>-form-page.yaml`.
- Use `_()` for translated strings and follow OMV button templates (`submit`,
  `cancel`, etc.).
- Add action buttons that call RPC methods through the `request` configuration.

## Shell helpers (`mkconf`)

- Scripts must accept `install`, `remove`, `restart`, `status`, and `logs`.
- Source `/usr/share/openmediavault/scripts/helper-functions` for utility
  helpers (`omv_config_get`, `omv_log`, ...).
- Validate external dependencies (e.g. `docker`, `docker compose`).
- Store generated files under `/srv/` or `/var/lib/openmediavault/` depending on
  the plugin requirements.
- Use `omv_log` to log high level actions so administrators can inspect
  `/var/log/openmediavault/<service>.log`.

## Testing checklist

1. `npm run lint` and `npm run format` (repository root).
2. `dpkg-buildpackage -b -us -uc` inside each plugin folder.
3. Install the `.deb` on a development OMV system and run `omv-salt deploy run
   webui`.
4. Verify service status toggling, start/stop buttons, and log retrieval.
5. Update `debian/changelog` when behaviour changes.

## Commit & PR expectations

- Group related changes per plugin and bump the version in `debian/changelog`.
- Document functional changes in the plugin `README.md` files.
- Reference this guideline and the upstream developer documentation in PR
  descriptions for reviewers.
