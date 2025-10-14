<?php
namespace Engined\Module;

class Gitea extends \OMV\Engine\Module\ServiceAbstract
        implements \OMV\Engine\Notify\IListener, \OMV\Engine\Module\IServiceStatus {
        public function getName() {
                return "gitea";
        }

        public function getStatus() {
                $db = \OMV\Config\Database::getInstance();
                $object = $db->get("conf.service.gitea");
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
                                $process->setEnv(["COMPOSE_PROJECT_NAME" => "gitea"]);
                                $process->execute();
                                $output = trim($process->getStdOut());
                                $running = strlen($output) > 2;
                        } catch (\Exception $exception) {
                                $running = false;
                        }
                }

                return [
                        "name" => $this->getName(),
                        "title" => gettext("Gitea"),
                        "enabled" => $enabled,
                        "running" => $running
                ];
        }

        public function bindListeners(\OMV\Engine\Notify\Dispatcher $dispatcher) {
                $dispatcher->addListener(
                        OMV_NOTIFY_MODIFY,
                        "org.openmediavault.conf.service.gitea",
                        [$this, "setDirty"]
                );
        }
}
