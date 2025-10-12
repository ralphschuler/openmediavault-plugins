# AI Coding Agents Guide

This document provides guidelines for AI coding agents working on the OpenMediaVault Plugins monorepo.

## Repository Overview

This monorepo contains multiple OpenMediaVault 7 plugins for Docker-based services. Each plugin provides:
- Web UI integration within OpenMediaVault
- Docker Compose service management 
- Debian package creation for distribution
- Comprehensive documentation and testing

## Agent Responsibilities

### Code Quality Assurance
- **Always run linting before committing**: `npm run lint`
- **Apply consistent formatting**: `npm run format`  
- **Follow established patterns** from existing plugins
- **Validate changes** through testing and manual verification

### Plugin Development Standards

#### File Structure Compliance
Ensure new plugins follow the standard structure:
```
openmediavault-<service>/
├── debian/                    # Packaging metadata
│   ├── changelog             # Version history (Semantic Versioning)
│   ├── control              # Package dependencies and description  
│   └── install              # File installation mapping
├── src/                      # Source files for target system
│   ├── usr/share/openmediavault/engined/rpc/     # Python RPC service
│   ├── usr/share/openmediavault/mkconf/          # Shell management script
│   └── var/www/openmediavault/js/omv/module/     # JavaScript web UI
└── README.md                 # Plugin documentation
```

#### Code Architecture Requirements

**Python RPC Services** (`*.py`):
- Inherit from `BaseDockerService` when available
- Implement standard methods: `getStatus()`, `install()`, `remove()`, `restart()`, `getLogs()`
- Use shell script execution for Docker operations
- Include comprehensive error handling and logging
- Located in: `src/usr/share/openmediavault/engined/rpc/`

**JavaScript Web UI** (`*.js`):
- Extend `BaseDockerServicePanel` when available  
- Implement consistent button layouts: Install, Remove, Restart, Open Web Interface, View Logs
- Add confirmation dialogs for destructive operations
- Provide user feedback for all actions
- Located in: `src/var/www/openmediavault/js/omv/module/`

**Shell Management Scripts** (no extension):
- Include `set -euo pipefail` header for safety
- Implement actions: `install`, `remove`, `restart`, `status`
- Perform Docker requirement validation with helpful error messages
- Generate Docker Compose and environment files
- Located in: `src/usr/share/openmediavault/mkconf/`

### Development Workflow

#### Making Changes
1. **Identify the scope**: Determine which plugin(s) are affected
2. **Update version**: Modify `debian/changelog` if behavior changes
3. **Follow patterns**: Use existing plugins as reference for new implementations
4. **Test thoroughly**: Verify functionality before committing
5. **Document changes**: Update README.md files as needed

#### Quality Checks
Before finalizing any changes:
```bash
# Lint all code
npm run lint

# Format all code  
npm run format

# Verify no unintended changes
git status
git diff
```

#### Testing Protocol
- **Manual verification**: Install plugin on OpenMediaVault 7.x system
- **UI testing**: Verify all buttons and functionality work correctly
- **Docker operations**: Test install, remove, restart, and status operations
- **Log validation**: Ensure error messages are clear and helpful

### Common Patterns and Anti-Patterns

#### ✅ Follow These Patterns

**Error Handling**:
```bash
error() {
    echo "[service] $1" >&2
}

if ! command -v docker >/dev/null 2>&1; then
    error "Docker is required but not installed."
    error "Please install Docker first: apt update && apt install -y docker.io"
    exit 1
fi
```

**Python Service Structure**:
```python
from BaseDockerService import BaseDockerService

class ServiceExample(BaseDockerService):
    name = "Example"
    mkconf_script = "/usr/share/openmediavault/mkconf/example" 
    compose_name = "example"
```

**Web UI Panel Structure**:
```javascript
Ext.define("OMV.module.admin.service.example.Example", {
    extend: "OMV.workspace.panel.Panel",
    // Use BaseDockerServicePanel when available
    // Implement consistent button actions
});
```

#### ❌ Avoid These Anti-Patterns

- **Don't hardcode secrets** in configuration files
- **Don't skip error handling** for Docker operations  
- **Don't duplicate code** - use base classes from `common/`
- **Don't modify existing working plugins** unless necessary for the task
- **Don't skip linting and formatting** checks
- **Don't commit without testing** functionality

### Special Considerations

#### Monorepo Structure
- Changes are automatically detected by CI/CD
- Only modified plugins are built and released
- Shared components in `common/` benefit all plugins
- Cross-plugin dependencies should be minimized

#### Backward Compatibility  
- Base classes in `common/` are designed to be optional
- Plugins should work with or without common module installed
- Always provide fallback implementations

#### Documentation Standards
- Each plugin must have comprehensive README.md
- Installation instructions should be clear and complete
- Configuration options must be documented
- Development setup should be explained

#### Security Best Practices
- Validate all user inputs appropriately
- Generate random secrets where needed
- Follow OpenMediaVault security guidelines
- Don't expose sensitive information in logs

## Agent Communication Protocol

### Progress Reporting
When working on tasks:
1. **Create clear commit messages** describing changes made
2. **Update progress regularly** using the reporting tools
3. **Document completion status** for each checklist item
4. **Validate changes** before marking tasks complete

### Issue Resolution  
When encountering problems:
1. **Check existing implementations** for reference patterns
2. **Consult documentation** in README files and comments
3. **Follow established workflows** rather than creating new approaches
4. **Ask for clarification** if requirements are unclear

### Code Review Readiness
Ensure all changes are ready for human review:
- All linting passes without errors
- Formatting is consistent across all files  
- Functionality has been manually verified
- Documentation is updated appropriately
- No unintended side effects have been introduced

## Resources and References

- **Base Classes**: See `common/` directory for reusable components
- **Plugin Examples**: Reference `openmediavault-immich`, `openmediavault-gitea`, `openmediavault-drone`
- **OpenMediaVault Documentation**: [Official OMV docs](https://docs.openmediavault.org/)
- **Docker Compose Reference**: [Official Docker docs](https://docs.docker.com/compose/)
- **Debian Packaging**: [Debian Policy Manual](https://www.debian.org/doc/debian-policy/)

This guide ensures consistent, high-quality contributions while maintaining the project's architectural integrity and user experience standards.