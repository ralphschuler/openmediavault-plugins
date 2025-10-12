# Common OpenMediaVault Plugin Components

This directory contains reusable base classes and common utilities for OpenMediaVault Docker-based plugins.

## Components

### BaseDockerService.py

A Python base class for RPC services that manage Docker Compose stacks. This eliminates code duplication across plugins and provides consistent functionality.

**Features:**
- Status checking using `docker compose ls`
- Install/remove/restart operations via shell scripts
- Logs retrieval for troubleshooting
- Consistent error handling and logging

**Usage:**
```python
from BaseDockerService import BaseDockerService

class ServiceMyApp(BaseDockerService):
    name = "MyApp"
    mkconf_script = "/usr/share/openmediavault/mkconf/myapp"
    compose_name = "myapp"
```

### BaseDockerServicePanel.js

A JavaScript base class for ExtJS service panels in the OpenMediaVault web interface. Provides enhanced UI functionality for Docker-based services.

**Features:**
- Install/restart/remove buttons with confirmation dialogs
- "Open Web Interface" button for quick access to services
- "View Logs" functionality with a modal window
- Better error handling and user feedback
- Consistent styling and behavior

**Usage:**
```javascript
Ext.define('OMV.module.admin.service.MyApp', {
    extend: 'OMV.module.admin.service.BaseDockerServicePanel',
    
    serviceName: 'MyApp',
    webPort: 8080,
    webPath: '/admin'
});
```

## Installation

The common components are designed to be backward-compatible. Each plugin includes fallback implementations so they work whether or not the common module is installed.

To use the common components across all plugins:
1. Install the common components to the system paths
2. Each plugin will automatically detect and use them

## Enhancements Made

### Shell Scripts (`mkconf/*`)
- Added `restart` action support (was missing)
- Enhanced Docker requirements validation
- Better error messages with installation instructions
- Improved error handling throughout

### RPC Services (`*.py`)
- Eliminated code duplication using base class
- Added `getLogs()` method for troubleshooting
- Consistent error handling and logging
- Uses shell scripts for all operations (more maintainable)

### Web Interface (`*.js`)
- Added "Open Web Interface" button for quick service access
- Added "View Logs" functionality with modal window
- Added confirmation dialogs for destructive operations
- Enhanced user feedback and error handling
- Consistent button layout and styling

## Benefits

1. **Reduced Code Duplication**: Common functionality is centralized
2. **Consistent User Experience**: All plugins behave the same way
3. **Better Error Handling**: More informative error messages
4. **Enhanced Functionality**: Logs viewing, web interface access, confirmations
5. **Maintainability**: Changes to common functionality benefit all plugins
6. **Backward Compatibility**: Plugins work with or without common module

## Future Enhancements

Potential future improvements include:
- Configuration panels for customizable settings (ports, paths, etc.)
- Real-time status polling and updates
- Container health monitoring
- Backup/restore functionality
- Resource usage monitoring
- Multi-service management