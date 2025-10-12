# openmediavault-plugins Monorepo

This repository hosts multiple OpenMediaVault 7 plugins maintained as a monorepo. Each plugin is stored in its own directory and can be built and released independently while sharing a unified automation pipeline.

## Repository layout

```
openmediavault-plugins/
├── openmediavault-immich     # Immich photo server integration
├── openmediavault-gitea      # Gitea self-hosted Git service
├── openmediavault-drone      # Drone continuous integration service
└── ...                       # Additional plugins live alongside these folders
```

Every plugin directory contains:

- `debian/` – packaging metadata used to build a `.deb` artifact.
- `src/` – plugin source files installed on the target system.
- `README.md` – plugin-specific documentation.

## Development workflow

1. Make changes in the relevant `openmediavault-<plugin>` directory.
2. Update the plugin's `debian/changelog` entry with a new [Semantic Versioning](https://semver.org/) number when behaviour changes.
3. Commit the changes and open a pull request.

The GitHub Actions workflow automatically detects which plugins changed and only builds those Debian packages for pull requests and pushes to `main`.

## Releasing

Upon merges to `main`, the workflow validates Semantic Versioning, builds the affected plugins, publishes release artifacts, and pushes Git tags in the form `<plugin-name>-v<semver>` alongside an aggregate repository tag.

To trigger a manual release bump, edit the appropriate `debian/changelog` files and merge the changes through a pull request.

## License

MIT
