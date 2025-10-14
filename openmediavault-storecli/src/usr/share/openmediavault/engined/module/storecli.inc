<?php
namespace Engined\Module;

class Storecli extends \OMV\Engine\Module\ServiceAbstract
        implements \OMV\Engine\Notify\IListener, \OMV\Engine\Module\IServiceStatus {
        public function getName() {
                return "storecli";
        }

        public function getStatus() {
                $db = \OMV\Config\Database::getInstance();
                $object = $db->get("conf.service.storecli");
                $enabled = $object->get("enable");
                $binary = $object->get("binary");
                $fallback = $object->get("fallback");
                $running = false;

                if ($enabled) {
                        $running = $this->binaryExists($binary) || $this->binaryExists($fallback);
                }

                return [
                        "name" => $this->getName(),
                        "title" => gettext("StoreCLI"),
                        "enabled" => $enabled,
                        "running" => $running
                ];
        }

        private function binaryExists($binary) {
                if (empty($binary)) {
                        return false;
                }

                try {
                        $process = new \OMV\System\Process(["which", $binary]);
                        $process->execute();
                        return $process->getExitCode() === 0;
                } catch (\Exception $exception) {
                        return false;
                }
        }

        public function bindListeners(\OMV\Engine\Notify\Dispatcher $dispatcher) {
                $dispatcher->addListener(
                        OMV_NOTIFY_MODIFY,
                        "org.openmediavault.conf.service.storecli",
                        [$this, "setDirty"]
                );
        }
}
