# Branch Protection Rules Setup

This document provides instructions for repository administrators to configure strict branch protection rules that enforce code quality requirements.

## Required Branch Protection Settings

To enforce the strict CI workflows and prevent merging of code with linting issues, configure the following branch protection rules for the `main` branch:

### 1. Navigate to Branch Protection Settings

1. Go to your GitHub repository
2. Click **Settings** → **Branches**
3. Click **Add rule** or edit existing rule for `main` branch

### 2. Basic Protection Settings

- ✅ **Restrict pushes that create files larger than 100 MB**
- ✅ **Require a pull request before merging**
  - ✅ **Require approvals**: 1 (minimum)
  - ✅ **Dismiss stale PR approvals when new commits are pushed**
  - ✅ **Require review from code owners** (if CODEOWNERS file exists)

### 3. Status Checks (CRITICAL)

✅ **Require status checks to pass before merging**

**Required status checks** (all must pass):
```
Pre-commit Hooks
Strict Linting Enforcement
Build Process Validation
Documentation Validation
Python Linting
JavaScript Linting
Shell Script Linting
YAML Linting
```

✅ **Require branches to be up to date before merging**

### 4. Additional Restrictions

- ✅ **Restrict pushes that create files larger than 100 MB**
- ✅ **Do not allow bypassing the above settings**
- ✅ **Include administrators** (recommended - administrators should also follow quality standards)

## GitHub Actions Required for Enforcement

The following workflows must be present and functioning:

### `.github/workflows/pr-checks.yml`
- Validates pre-commit compliance
- Enforces strict linting (zero warnings/errors)
- Tests build process
- Validates documentation completeness

### `.github/workflows/lint.yml`
- Individual linting jobs for each language
- All jobs must pass for PR to be mergeable

## Enforcement Rules Summary

When properly configured, the branch protection will:

1. **Block PRs** with any linting warnings or errors
2. **Require** all status checks to pass (green checkmarks)
3. **Prevent** direct pushes to main branch
4. **Ensure** code review approval before merge
5. **Validate** that branches are up-to-date before merging

## Testing Branch Protection

After setup, test the protection by:

1. Creating a test PR with intentional linting issues
2. Verifying that the PR cannot be merged
3. Fixing the issues and confirming PR becomes mergeable
4. Testing that direct pushes to main are blocked

## Troubleshooting

### Status Check Not Found
If a status check isn't appearing:
- Ensure the GitHub Action workflow file exists
- Check that the job name matches exactly
- Verify the workflow runs on `pull_request` events
- Wait for the workflow to run at least once

### False Positive Status Checks
If a check passes when it should fail:
- Review the workflow YAML for proper exit codes
- Ensure linting commands use strict flags (e.g., `--max-warnings 0`)
- Check that the workflow actually runs the intended commands

## Emergency Override

For urgent fixes when CI is broken:
1. Temporarily disable branch protection
2. Merge the fix
3. **Immediately re-enable** branch protection
4. Document the override in commit message

**WARNING**: Only use emergency override for CI system fixes, never for bypassing code quality standards.
