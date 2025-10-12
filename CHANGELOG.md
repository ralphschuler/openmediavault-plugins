# Changelog

All notable changes to the OpenMediaVault Plugins monorepo will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- GitHub Copilot coding agent instructions in `.github/copilot-instructions.md`
- AI coding agents guide in `AGENTS.md`
- Contributor guidelines in `CONTRIBUTING.md`
- Community code of conduct in `CODE_OF_CONDUCT.md`
- Security policy in `SECURITY.md`
- Issue and pull request templates
- Comprehensive documentation for community-driven development

### Changed
- Enhanced README.md with references to new community files
- Improved project structure documentation

### Security
- Established security reporting procedures
- Documented security best practices for developers

## Project History

This changelog tracks changes at the monorepo level. Individual plugin changes are maintained in their respective `debian/changelog` files:

- `openmediavault-immich/debian/changelog`
- `openmediavault-gitea/debian/changelog` 
- `openmediavault-drone/debian/changelog`

### Plugin Release Process

Individual plugins follow semantic versioning and are released independently:

1. **Version Bumps**: Changes to plugin behavior require version updates in `debian/changelog`
2. **Automatic Detection**: CI/CD detects which plugins have changed
3. **Independent Releases**: Only modified plugins are built and released
4. **Git Tags**: Releases create tags in the format `<plugin-name>-v<version>`

### Common Components

The `common/` directory contains shared base classes and utilities:

#### BaseDockerService.py
- Provides consistent RPC service patterns across plugins
- Eliminates code duplication
- Ensures uniform error handling and logging

#### BaseDockerServicePanel.js
- Standardizes web UI components
- Provides consistent user experience
- Reduces development time for new plugins

### Development Infrastructure

#### Code Quality
- **Linting**: Python (Black, isort, flake8), JavaScript (ESLint), Shell (ShellCheck), YAML (yamllint)
- **Formatting**: Automated formatting with Prettier and Black
- **CI/CD**: GitHub Actions for automated testing and releases

#### Documentation Standards
- Plugin-specific README files with installation and usage instructions
- Comprehensive development setup documentation
- API documentation for shared components

## Release Notes Format

### Plugin Releases

When plugins are released, the following information is tracked:

```
## [plugin-name-vX.Y.Z] - YYYY-MM-DD

### Added
- New features and functionality

### Changed  
- Modifications to existing features
- Configuration changes
- UI improvements

### Deprecated
- Features scheduled for removal

### Removed
- Deleted features and functionality

### Fixed
- Bug fixes and corrections

### Security
- Security-related changes and fixes
```

### Monorepo Changes

Repository-level changes include:

- **Infrastructure**: CI/CD, build systems, development tools
- **Documentation**: README updates, new guides, policy changes  
- **Community**: Contributor guides, issue templates, governance
- **Shared Components**: Updates to `common/` base classes

## Migration Notes

### From Individual Repositories

This monorepo consolidates previously separate plugin repositories:

1. **Unified Development**: Single repository for all plugins
2. **Shared Infrastructure**: Common CI/CD and development tools
3. **Base Classes**: Reusable components reduce duplication
4. **Consistent Standards**: Unified code quality and documentation standards

### Backward Compatibility

- **Plugin APIs**: Existing plugin interfaces remain unchanged
- **Installation**: Debian packages maintain same installation process
- **Configuration**: Plugin configurations and data locations preserved
- **Dependencies**: Plugin dependencies and requirements unchanged

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on:

- Development setup and workflow
- Code style guidelines and linting
- Testing procedures and requirements  
- Pull request and review process
- Plugin development standards

## Security

See [SECURITY.md](SECURITY.md) for:

- Supported versions and security updates
- Vulnerability reporting procedures
- Security best practices for developers
- Incident response procedures

## Community

This project is community-driven and welcomes contributions:

- **Issues**: Bug reports and feature requests via GitHub Issues
- **Discussions**: Community discussions via GitHub Discussions  
- **Pull Requests**: Code contributions via GitHub Pull Requests
- **Documentation**: Improvements to guides and README files

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Individual plugins may have additional license considerations based on the services they integrate.