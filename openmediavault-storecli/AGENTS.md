# StoreCLI Plugin Guidelines

- Mirror any changes to RPC parameters in both `engined/rpc/storecli.inc` and the
  Workbench component so the UI reflects available commands.
- Keep the binary detection logic in `mkconf/storecli` consistent with the RPC
  implementation to avoid drift.
- Restrict all commands to read-only `show` operations for safety.
- Update README and the Debian changelog when altering exposed commands or
  validation logic.
