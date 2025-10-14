<?php
namespace Engined\Module;

class Drone extends \OMV\Engine\Module\ServiceAbstract
        implements \OMV\Engine\Notify\IListener, \OMV\Engine\Module\IServiceStatus {
        public function getName() {
                return "drone";
        }

        public function getStatus() {
                $db = \OMV\Config\Database::getInstance();
                $object = $db->get("conf.service.drone");
                $enabled = $object->get("enable");
                $composePath = rtrim($object->get("composepath"), "/");
                $composeFile = $composePath . "/docker-compose.yml";
                $running = false;

                if (file_exists($composeFile)) {
                        try {
                                $process = new \OMV\System\Process([
                                        "docker", "compose",
                                        "-f", $composeFile,
                                        "ps", "--format", "json"
                                ]);
                                $process->setEnv(["COMPOSE_PROJECT_NAME" => "drone"]);
                                $process->execute();
                                $output = trim($process->getStdOut());
                                $running = strlen($output) > 2;
                        } catch (\Exception $exception) {
                                $running = false;
                        }
                }

                return [
                        "name" => $this->getName(),
                        "title" => gettext("Drone"),
                        "enabled" => $enabled,
                        "running" => $running
                ];
        }

        public function bindListeners(\OMV\Engine\Notify\Dispatcher $dispatcher) {
                $dispatcher->addListener(
                        OMV_NOTIFY_MODIFY,
                        "org.openmediavault.conf.service.drone",
                        [$this, "setDirty"]
                );
        }
}
