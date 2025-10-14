# openmediavault-storecli

The **openmediavault-storecli** plugin integrates LSI/Broadcom hardware RAID
management into OpenMediaVault. It provides a web-based interface powered by
the `storecli`/`storcli` utilities so administrators can review controller
status, inspect logical and physical drives, and read recent event logs without
needing to access the CLI manually.

## Features

- Detects available `storecli`/`storcli` binaries and surfaces version
  information.
- Displays controller summaries directly within the OpenMediaVault web UI.
- Supports ad-hoc read-only `show` commands (e.g. event logs or specific
  controller detail pages) with server-side validation.
- Provides a reusable RPC API that can be leveraged by other OMV extensions.

## Requirements

- OpenMediaVault 7.x.
- The LSI/Broadcom `storecli` (or `storcli`) utility installed on the host.
  Broadcom distributes native Debian packages through their support portal. The
  plugin will gracefully notify administrators if no compatible binary is found.

## Usage

1. Install the plugin package on your OpenMediaVault system.
2. Ensure the `storecli` or `storcli` binary is present in your system PATH.
3. Navigate to **Services → StoreCLI RAID** in the OMV web interface.
4. Use the **Refresh Summary** button to retrieve current controller
   information.
5. Open detailed controller views or event logs using the dedicated buttons.

All commands issued through the plugin are limited to read-only `show`
operations to protect existing arrays.

## Development

The plugin follows the same structure as the other OpenMediaVault Docker-based
plugins in this repository, with an RPC service, accompanying ExtJS panel, and a
POSIX shell helper. When modifying the code:

- Run `npm run format` to apply consistent formatting.
- Run `npm run lint` to ensure JavaScript/TypeScript quality.
- Update `debian/changelog` and documentation when behavior changes.

