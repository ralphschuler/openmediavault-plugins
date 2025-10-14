<?php
namespace Engined\Rpc;

class OMVRpcServiceStorecli extends \OMV\Rpc\ServiceAbstract {
        public function getName() {
                return "Storecli";
        }

        public function initialize() {
                $this->registerMethod("get");
                $this->registerMethod("set");
                $this->registerMethod("summary");
                $this->registerMethod("events");
                $this->registerMethod("controller");
        }

        public function get($params, $context) {
                return \OMV\Rpc\Rpc::call("Config", "get", [
                        "id" => "conf.service.storecli"
                ], $context);
        }

        public function set($params, $context) {
                return \OMV\Rpc\Rpc::call("Config", "set", [
                        "id" => "conf.service.storecli",
                        "data" => $params
                ], $context);
        }

        public function summary($params, $context) {
                return $this->runCommand(["/call", "show"]);
        }

        public function events($params, $context) {
                return $this->runCommand(["/call", "show", "events"]);
        }

        public function controller($params, $context) {
                $controller = isset($params["controller"]) ? $params["controller"] : "0";
                $controller = preg_replace("/[^0-9]/", "", $controller);
                if ($controller === "") {
                        $controller = "0";
                }
                return $this->runCommand(["/c" . $controller, "show", "all"]);
        }

        private function resolveBinary() {
                $db = \OMV\Config\Database::getInstance();
                $object = $db->get("conf.service.storecli");
                $candidates = [$object->get("binary"), $object->get("fallback")];
                foreach ($candidates as $binary) {
                        if (empty($binary)) {
                                continue;
                        }
                        try {
                                $process = new \OMV\System\Process(["which", $binary]);
                                $process->execute();
                                if (0 === $process->getExitCode()) {
                                        return trim($process->getStdOut());
                                }
                        } catch (\Exception $exception) {
                                continue;
                        }
                }
                throw new \OMV\Exception(gettext("No storecli/storcli binary found on the system."));
        }

        private function runCommand(array $arguments) {
                $binary = $this->resolveBinary();
                $cmd = array_merge([$binary], $arguments);
                $process = new \OMV\System\Process($cmd);
                $process->setTimeout(0);
                $process->execute();
                return [
                        "exitcode" => $process->getExitCode(),
                        "stdout" => $process->getStdOut(),
                        "stderr" => $process->getStdErr()
                ];
        }
}
