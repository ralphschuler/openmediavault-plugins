# Contributing to OpenMediaVault Plugins

Thank you for your interest in contributing to the OpenMediaVault Plugins monorepo! This document outlines how to contribute effectively to this community-driven project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)
- [Plugin Development](#plugin-development)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing](#testing)
- [Getting Help](#getting-help)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

### Prerequisites

- **OpenMediaVault 7.x** system for testing (VM recommended)
- **Docker** and **Docker Compose** installed on test system
- **Node.js** (version 18 or higher) for JavaScript tooling
- **Python** (version 3.8 or higher) for Python tooling
- **Git** for version control

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/openmediavault-plugins.git
   cd openmediavault-plugins
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/ralphschuler/openmediavault-plugins.git
   ```

## Development Setup

### Install Development Dependencies

```bash
# Clone and setup repository
git clone https://github.com/ralphschuler/openmediavault-plugins.git
cd openmediavault-plugins

# Install Python development tools
pip install -r requirements-dev.txt

# Install Node.js dependencies
npm install

# Install system dependencies (Ubuntu/Debian)
sudo apt update
sudo apt install -y shellcheck yamllint

# Install and setup pre-commit hooks (REQUIRED)
npm run precommit:install
```

### Pre-commit Hooks (MANDATORY)

Pre-commit hooks are **required** for all contributors and will:
- Automatically format your code before each commit
- Run linting checks to catch issues early
- Prevent commits with linting errors

```bash
# Install pre-commit hooks
npm run precommit:install

# Run pre-commit on all files (optional, for testing)
npm run precommit:run

# Update hooks to latest versions (as needed)
npm run precommit:update
```

### Verify Setup

```bash
# Test all linting tools (must pass with zero warnings/errors)
npm run lint

# Test formatting tools
npm run format
```

## Making Changes

### Development Workflow

1. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the guidelines below

3. **Test your changes** thoroughly:
   ```bash
   # REQUIRED: All linting must pass with zero warnings/errors
   npm run lint

   # Format code (or let pre-commit hooks do this automatically)
   npm run format

   # Test on OpenMediaVault system
   dpkg-buildpackage -b -us -uc
   sudo dpkg -i ../openmediavault-yourplugin_*.deb
   sudo omv-salt deploy run webui
   ```

4. **Commit your changes** (pre-commit hooks will run automatically):
   ```bash
   git add .
   git commit -m "feat: add support for new service"
   ```

   **Note**: If pre-commit hooks make changes, you'll need to add and commit again:
   ```bash
   git add .
   git commit -m "feat: add support for new service"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

### Commit Message Guidelines

We follow conventional commit format:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add Nextcloud plugin with docker compose integration
fix: resolve port conflict in Gitea configuration
docs: update installation instructions for Immich plugin
```

## Pull Request Process

### Before Submitting

**STRICT REQUIREMENTS** (PR will be rejected if not met):

- [ ] **Pre-commit hooks installed and working** (`npm run precommit:install`)
- [ ] **All linting passes with ZERO warnings/errors** (`npm run lint`)
- [ ] **All CI checks pass** (automated via PR validation workflows)
- [ ] **Code is properly formatted** (`npm run format` or automatic via pre-commit)
- [ ] **Changes have been tested on OpenMediaVault 7.x**
- [ ] **Documentation is updated** (README.md files for affected plugins)
- [ ] **Commit messages follow conventional format**
- [ ] **Version numbers updated** in `debian/changelog` if behavior changed

**Note**: Our CI system enforces strict code quality requirements. PRs with any linting warnings or errors will be automatically rejected until fixed.

### PR Description Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Tested on OpenMediaVault 7.x system
- [ ] All linting passes
- [ ] Plugin installs/removes successfully
- [ ] Web UI functions correctly
- [ ] Docker operations work properly

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Additional Notes
Any additional information about the changes.
```

### Review Process

1. **Automated Checks**: GitHub Actions will run linting, formatting, and build tests
2. **Manual Review**: Maintainers will review code quality, functionality, and documentation
3. **Testing**: Changes may be tested on actual OpenMediaVault systems
4. **Feedback**: Address any requested changes promptly
5. **Merge**: Approved PRs will be merged by maintainers

## Plugin Development

### Creating a New Plugin

1. **Copy an existing plugin** as a template:
   ```bash
   cp -r openmediavault-immich openmediavault-newservice
   ```

2. **Update plugin identity**:
   - Modify `debian/control` with new package name and description
   - Update `debian/changelog` with new service name and initial version
   - Rename source files to match new service name

3. **Implement service integration**:
   - Create RPC service inheriting from `BaseDockerService`
   - Develop web UI panel extending `BaseDockerServicePanel`
   - Write shell script for Docker Compose management
   - Add comprehensive documentation

4. **Follow established patterns** from existing plugins

### Plugin Structure

Each plugin must contain:

```
openmediavault-service/
├── debian/
│   ├── changelog      # Version history (required for releases)
│   ├── control        # Package metadata and dependencies
│   └── install        # File installation mapping
├── src/
│   ├── usr/share/openmediavault/engined/rpc/         # Python RPC service
│   ├── usr/share/openmediavault/mkconf/              # Shell management script
│   └── var/www/openmediavault/js/omv/module/         # JavaScript web UI
└── README.md          # Plugin documentation
```

### Using Base Classes

Leverage shared components from the `common/` directory:

```python
# Python RPC Service
from BaseDockerService import BaseDockerService

class ServiceNewService(BaseDockerService):
    name = "NewService"
    mkconf_script = "/usr/share/openmediavault/mkconf/newservice"
    compose_name = "newservice"
```

```javascript
// JavaScript Web UI (when BaseDockerServicePanel is available)
Ext.define("OMV.module.admin.service.newservice.NewService", {
    extend: "BaseDockerServicePanel",
    rpcService: "NewService",
    // Additional customization
});
```

## Code Style Guidelines

### Python
- **Formatting**: Use Black (88 character line limit)
- **Import Sorting**: Use isort
- **Linting**: Follow flake8 rules
- **Docstrings**: Use Google-style docstrings for public methods

### JavaScript
- **Formatting**: Use Prettier
- **Linting**: Follow ESLint configuration
- **Style**: Use existing OpenMediaVault patterns and conventions

### Shell Scripts
- **Header**: Always include `set -euo pipefail`
- **Linting**: Pass ShellCheck analysis
- **Error Handling**: Provide clear, actionable error messages
- **Style**: Follow existing mkconf script patterns

### YAML
- **Formatting**: Use Prettier
- **Linting**: Pass yamllint validation
- **Indentation**: Use 2 spaces consistently

## Testing

### Manual Testing

1. **Build the plugin**:
   ```bash
   cd openmediavault-yourplugin
   dpkg-buildpackage -b -us -uc
   ```

2. **Install on test system**:
   ```bash
   sudo dpkg -i ../openmediavault-yourplugin_*.deb
   sudo omv-salt deploy run webui
   ```

3. **Test functionality**:
   - Verify web UI appears in OpenMediaVault interface
   - Test install/remove/restart operations
   - Verify Docker containers start correctly
   - Test web interface access (if applicable)
   - Check log output for errors

### Automated Testing

GitHub Actions automatically:
- Runs linting for all languages
- Validates formatting compliance
- Attempts to build Debian packages
- Checks for common issues

## Getting Help

### Resources

- **Documentation**: Check individual plugin README files
- **Examples**: Reference existing plugin implementations
- **Base Classes**: See `common/` directory for reusable components
- **OpenMediaVault Docs**: [Official documentation](https://docs.openmediavault.org/)

### Communication Channels

- **Issues**: Create GitHub issues for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Pull Requests**: Submit PRs for code contributions

### Best Practices

- **Search existing issues** before creating new ones
- **Provide detailed information** when reporting problems
- **Include system information** (OMV version, plugin versions, etc.)
- **Add screenshots** for UI-related issues
- **Be respectful and patient** - this is a volunteer-driven project

## Recognition

Contributors are recognized in:
- Git commit history
- Release notes for significant contributions
- README acknowledgments for major features

Thank you for helping improve OpenMediaVault plugins for the community!
