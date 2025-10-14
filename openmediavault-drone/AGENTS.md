# Drone Plugin Guidelines

- Synchronise new configuration options between
  `datamodels/conf.service.drone.json` and the Workbench form page.
- Keep the Docker Compose stack in `mkconf/drone` current with stable Drone
  server/runner images.
- Update RPC methods and Workbench buttons together whenever new stack actions
  are introduced.
- Note feature updates in the changelog and README before releasing a package.
