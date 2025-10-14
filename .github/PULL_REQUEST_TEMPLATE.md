# Pull Request

## Description

Briefly describe the changes in this pull request.

## Type of Change

Please mark the relevant option:

- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📚 Documentation update
- [ ] 🔧 Maintenance/refactoring (code improvements without functional changes)
- [ ] 🔌 New plugin

## Affected Plugin(s)

Check all that apply:

- [ ] openmediavault-immich
- [ ] openmediavault-gitea
- [ ] openmediavault-drone
- [ ] Common components (`common/` directory)
- [ ] Build/CI system
- [ ] Documentation only
- [ ] New plugin: ________________

## Changes Made

### Added
-

### Changed
-

### Removed
-

### Fixed
-

## Testing

### Testing Performed

- [ ] All linting passes (`npm run lint`)
- [ ] Code is properly formatted (`npm run format`)
- [ ] Plugin builds successfully (`dpkg-buildpackage`)
- [ ] Plugin installs without errors
- [ ] Plugin removes cleanly
- [ ] Web UI functions correctly
- [ ] Docker operations work (install/remove/restart)
- [ ] Tested on OpenMediaVault 7.x system

### Test Environment

- **OpenMediaVault version**:
- **System**: (e.g., Debian 12, x86_64)
- **Docker version**:
- **Browser** (if UI changes):

### Test Cases

Describe specific test scenarios you performed:

1.
2.
3.

## Screenshots (if applicable)

If this PR includes UI changes, please add screenshots showing before/after or the new functionality.

## Version Updates

If this change affects plugin behavior:

- [ ] Updated `debian/changelog` with new version number
- [ ] Version follows semantic versioning (patch/minor/major)
- [ ] Changelog entry describes the changes

## Documentation

- [ ] Updated plugin README.md (if applicable)
- [ ] Updated main README.md (if needed)
- [ ] Added/updated code comments where necessary
- [ ] Updated CHANGELOG.md (for significant changes)

## Dependencies

- [ ] No new dependencies added
- [ ] New dependencies are documented and justified
- [ ] Dependencies are pinned to specific versions where appropriate

## Security Considerations

- [ ] No security implications
- [ ] Changes follow security best practices
- [ ] No hardcoded secrets or credentials
- [ ] Input validation implemented where needed

## Backward Compatibility

- [ ] Fully backward compatible
- [ ] May require configuration migration (documented)
- [ ] Breaking change (documented and justified)

## Review Checklist

Please ensure you have:

- [ ] Followed the [contribution guidelines](CONTRIBUTING.md)
- [ ] Tested the changes thoroughly
- [ ] Updated relevant documentation
- [ ] Added appropriate commit messages
- [ ] Verified no unintended files are included

## Additional Notes

Add any additional context, considerations, or notes for reviewers:

---

## For Maintainers

- [ ] Labels applied appropriately
- [ ] Milestone set (if applicable)
- [ ] Breaking changes noted in description
- [ ] Security implications reviewed
- [ ] Documentation changes reviewed
