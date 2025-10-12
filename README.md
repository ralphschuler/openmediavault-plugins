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
3. **Run linting and formatting** (see Code Quality section below).
4. Commit the changes and open a pull request.

The GitHub Actions workflow automatically detects which plugins changed and only builds those Debian packages for pull requests and pushes to `main`.

## Code Quality

This repository uses comprehensive linting and formatting tools to maintain code quality across all plugins:

### Linting Tools

- **Python**: [Black](https://black.readthedocs.io/) (formatting), [isort](https://pycqa.github.io/isort/) (import sorting), [flake8](https://flake8.pycqa.org/) (linting)
- **JavaScript**: [ESLint](https://eslint.org/) (linting), [Prettier](https://prettier.io/) (formatting)
- **Shell Scripts**: [ShellCheck](https://www.shellcheck.net/) (static analysis)
- **YAML**: [yamllint](https://yamllint.readthedocs.io/) (linting), [Prettier](https://prettier.io/) (formatting)

### Usage

#### Local Development

Install development dependencies:
```bash
# Python tools
pip install -r requirements-dev.txt

# JavaScript tools (requires Node.js)
npm install -g eslint prettier
```

Run linting:
```bash
# All files
npm run lint

# Individual tools
npm run lint:python    # Black, isort, flake8
npm run lint:js        # ESLint
npm run lint:shell     # ShellCheck  
npm run lint:yaml      # yamllint

# Manual commands
black --check scripts/ openmediavault-*/src/usr/share/openmediavault/engined/rpc/
flake8 scripts/ openmediavault-*/src/usr/share/openmediavault/engined/rpc/
find . -name "*.js" -path "*/openmediavault-*" -exec eslint {} +
```

Apply formatting:
```bash
# All files
npm run format

# Individual tools  
npm run format:python  # Black + isort
npm run format:js      # Prettier for JS
npm run format:yaml    # Prettier for YAML

# Manual commands
black scripts/ openmediavault-*/src/usr/share/openmediavault/engined/rpc/
prettier --write **/*.{js,yml,yaml}
```

#### Automated Workflows

- **`lint.yml`**: Runs on every PR and push to `main`, validates all file types
- **`format.yml`**: Manual workflow for auto-formatting code (use "Run workflow" button)

### Configuration Files

- `pyproject.toml` - Python tools configuration
- `eslint.config.js` - JavaScript linting rules  
- `.prettierrc.json` - JavaScript/YAML formatting
- `.yamllint.yml` - YAML linting rules
- `.editorconfig` - Universal editor settings

## Releasing

Upon merges to `main`, the workflow validates Semantic Versioning, builds the affected plugins, publishes release artifacts, and pushes Git tags in the form `<plugin-name>-v<semver>` alongside an aggregate repository tag.

To trigger a manual release bump, edit the appropriate `debian/changelog` files and merge the changes through a pull request.

## Community

This project welcomes contributions! Please see our community guidelines:

- **[Contributing Guidelines](CONTRIBUTING.md)** - How to contribute to the project
- **[Code of Conduct](CODE_OF_CONDUCT.md)** - Community standards and behavior expectations  
- **[Security Policy](SECURITY.md)** - How to report security vulnerabilities
- **[Changelog](CHANGELOG.md)** - Project history and notable changes
- **[AI Agents Guide](AGENTS.md)** - Guidelines for AI coding agents

### Getting Help

- **Issues**: Report bugs or request features via [GitHub Issues](https://github.com/ralphschuler/openmediavault-plugins/issues)
- **Discussions**: Ask questions and share ideas in [GitHub Discussions](https://github.com/ralphschuler/openmediavault-plugins/discussions)
- **Documentation**: Check individual plugin README files and project documentation

## License

MIT - see [LICENSE](LICENSE) file for details.
