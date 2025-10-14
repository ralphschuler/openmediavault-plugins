# AI Coding Agents Guide

This monorepo hosts multiple OpenMediaVault 7 plugins that mirror the
architecture used in the upstream project. Every contribution must align with
OpenMediaVault's official development practices and the repository-specific
conventions below.

## Repository Overview

Each plugin must provide:

- WebUI integration using **Workbench** components.
- An RPC layer implemented in **PHP** under
  `src/usr/share/openmediavault/engined/rpc`.
- Shell helpers in `src/usr/share/openmediavault/mkconf` that manage Docker
  stacks or operating system services.
- Debian packaging metadata under `debian/` that produces installable
  `openmediavault-<service>` packages.
- Up-to-date documentation describing defaults, configuration, and limitations.

Consult [`docs/DEVELOPER_GUIDELINES.md`](docs/DEVELOPER_GUIDELINES.md) for a
complete workflow derived from the upstream developer handbook at
<https://docs.openmediavault.org/en/stable/development/index.html>.

## Code Quality Checklist

- Run `npm run format` and `npm run lint` at the repository root before every
  commit.
- Keep PHP, YAML, JSON, and shell sources readable—use spaces, wrap long lines,
  and add comments for non-obvious logic.
- Update `debian/changelog` whenever a plugin's behaviour changes.
- Write descriptive commit messages that mention the affected plugin(s).

## Plugin Development Standards

### File layout

```
openmediavault-<service>/
├── debian/
│   ├── changelog
│   ├── control
│   ├── install
│   └── rules
└── src/usr/share/openmediavault/
    ├── confdb/create.d/
    ├── datamodels/
    ├── engined/module/
    ├── engined/rpc/
    ├── mkconf/
    └── workbench/
```

> Do **not** place new UI assets under `var/www`; all new pages must be Workbench
> YAML files.

### Architecture expectations

- **Configuration database (ConfDB)**: Define schemas in
  `datamodels/conf.service.<name>.json`, bootstrap defaults in
  `confdb/create.d/`, and add migrations when changing existing keys.
- **RPC services**: Implement classes extending `\OMV\Rpc\ServiceAbstract`,
  retrieve config objects via `\OMV\Config\Database`, and execute shell helpers
  with `\OMV\System\Process` inside try/catch blocks that surface helpful error
  messages.
- **Engine modules**: Extend `\OMV\Engine\Module\ServiceAbstract`, implement
  `getStatus()` to expose `enabled` and `running`, and register listeners in
  `bindListeners()` so configuration changes mark the module dirty.
- **Shell helpers (`mkconf`)**: POSIX compliant scripts with
  `set -euo pipefail` that implement `install`, `remove`, `restart`, `status`,
  and `logs`. Validate dependencies like Docker and log actions via `omv_log`.
- **Workbench UI**: Declare navigation entries, routes, and form pages under
  `workbench/` using translated strings (`_()`), standard button templates, and
  RPC-backed actions.

### Workflow

1. Review the corresponding implementation in the official repository for
   patterns: <https://github.com/openmediavault/openmediavault>.
2. Modify the ConfDB schema and defaults when introducing new settings.
3. Keep `install` idempotent—rerunning it should reconcile the stack safely.
4. Log significant actions to `/var/log/openmediavault/<service>.log`.
5. Document behavioural changes in the plugin README and changelog.

### Verification

Before opening a PR or committing:

```bash
npm run format
npm run lint
```

Build each touched plugin with `dpkg-buildpackage -b -us -uc` and test the
resulting `.deb` on an OMV 7 system. Validate that:

- The Workbench UI saves configuration changes.
- Install/Remove/Restart buttons work.
- `mkconf <service> status` provides meaningful output.
- `mkconf <service> logs` returns recent log entries.

### Patterns and anti-patterns

**Prefer**

- Using `omv_config_get` / `omv_config_add_key` helpers.
- Generating secrets programmatically.
- Storing generated artefacts under `/srv/` for easy backup.
- Emitting actionable error messages when dependencies are missing.

**Avoid**

- Hardcoding paths outside `/srv` or `/var/lib/openmediavault`.
- Mixing ExtJS artefacts with Workbench UI.
- Triggering shell commands directly from the UI without an RPC service.
- Leaving temporary files world-readable.

## Communication

- Reference the upstream developer manual when discussing design choices.
- Surface TODOs or follow-up work in commit messages or PR descriptions rather
  than leaving inline comments.
- Keep conversations focused on reproducible behaviour and testing evidence.

## Resources

- Upstream developer manual: <https://docs.openmediavault.org/en/stable/development/index.html>
- Reference implementation: <https://github.com/openmediavault/openmediavault>
- Docker Compose specification: <https://docs.docker.com/compose/compose-file/>
- Debian packaging policy: <https://www.debian.org/doc/debian-policy/>
