# GitHub Copilot Instructions for OpenMediaVault Plugins

This repository contains multiple OpenMediaVault 7 plugins maintained as a monorepo. When working with GitHub Copilot, please follow these guidelines to ensure consistent, high-quality contributions.

## Repository Structure

This is a monorepo with the following structure:
```
openmediavault-plugins/
├── openmediavault-immich/     # Immich photo server plugin
├── openmediavault-gitea/      # Gitea self-hosted Git service plugin
├── openmediavault-drone/      # Drone CI service plugin
├── common/                    # Shared base classes and utilities
└── scripts/                   # Build and utility scripts
```

Each plugin directory contains:
- `debian/` - Debian packaging metadata for `.deb` artifacts
- `src/` - Plugin source files installed on target system
- `README.md` - Plugin-specific documentation

## Code Style and Quality

### Linting and Formatting
Always run linting and formatting before committing:
```bash
npm run lint      # Run all linters
npm run format    # Apply all formatters
```

### Language-Specific Guidelines

#### Python Files
- Located in: `scripts/` and `openmediavault-*/src/usr/share/openmediavault/engined/rpc/`
- Use Black for formatting (line length: 88 characters)
- Use isort for import sorting
- Follow flake8 linting rules
- Prefer using the `BaseDockerService` class from `common/` for new RPC services

#### JavaScript Files
- Located in: `openmediavault-*/src/**/*.js`
- Use ESLint for linting
- Use Prettier for formatting
- Prefer using the `BaseDockerServicePanel` class from `common/` for new web UI panels

#### Shell Scripts
- Located in: `openmediavault-*/src/usr/share/openmediavault/mkconf/`
- Use ShellCheck for static analysis
- Always include `set -euo pipefail` at the top
- Provide clear error messages with installation instructions
- Follow the pattern established in existing mkconf scripts

#### YAML Files
- Use yamllint for linting
- Use Prettier for formatting
- Maintain consistency with existing workflow files

## Plugin Development Guidelines

### Creating New Plugins
1. Copy an existing plugin directory structure
2. Update `debian/` packaging files with new plugin name and details
3. Implement RPC service inheriting from `BaseDockerService`
4. Create web UI panel extending `BaseDockerServicePanel`
5. Write shell script for Docker Compose management
6. Add comprehensive README.md with installation and usage instructions

### Docker Compose Integration
- Store Docker stacks under `/srv/dev-disk-by-label-data/<service>/`
- Use environment files (`.env`) for configuration
- Implement proper Docker and Docker Compose requirement checks
- Provide clear error messages for missing dependencies
- Support install, remove, restart, and status operations

### Version Management
- Use Semantic Versioning in `debian/changelog`
- Only bump versions when behavior changes
- The CI/CD automatically builds changed plugins

## Testing and Validation

### Before Submitting Changes
1. Run all linting: `npm run lint`
2. Apply formatting: `npm run format`
3. Test plugin installation on OpenMediaVault 7.x
4. Verify web UI functionality
5. Test Docker Compose operations (install/remove/restart)
6. Update plugin README.md if needed

### Automated Workflows
GitHub Actions automatically:
- Runs linting and formatting checks
- Builds Debian packages for changed plugins
- Creates releases with semantic versioning
- Publishes artifacts on successful builds

## Best Practices

### Error Handling
- Provide informative error messages
- Include installation instructions for missing dependencies
- Use consistent error message formatting: `echo "[service] message" >&2`

### User Experience
- Add "Open Web Interface" buttons for services with web UIs
- Provide log viewing functionality for troubleshooting
- Use confirmation dialogs for destructive operations
- Maintain consistent button layouts and styling

### Documentation
- Keep README.md files up to date
- Document configuration options and defaults
- Include development and testing instructions
- Provide clear installation steps

### Security
- Don't hardcode secrets in configuration files
- Use random secret generation where appropriate
- Follow OpenMediaVault security best practices
- Validate user inputs appropriately

## Common Patterns

When implementing new plugins, follow these established patterns:

1. **RPC Service Structure**: Inherit from `BaseDockerService` for consistent API
2. **Web UI Components**: Extend `BaseDockerServicePanel` for uniform interface
3. **Shell Script Operations**: Follow existing mkconf script patterns
4. **Docker Compose Setup**: Use standard environment and compose file structure
5. **Error Handling**: Implement comprehensive requirement checks and clear messaging

## Questions or Issues?

- Check existing plugin implementations for reference patterns
- Review the `common/` directory for reusable base classes
- Consult individual plugin README files for specific requirements
- Follow the contribution guidelines in CONTRIBUTING.md
