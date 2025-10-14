<?php
namespace Engined\Rpc;

class OMVRpcServiceGitea extends \OMV\Rpc\ServiceAbstract {
        public function getName() {
                return "Gitea";
        }

        public function initialize() {
                $this->registerMethod("get");
                $this->registerMethod("set");
                $this->registerMethod("install");
                $this->registerMethod("remove");
                $this->registerMethod("restart");
                $this->registerMethod("status");
                $this->registerMethod("logs");
        }

        public function get($params, $context) {
                return \OMV\Rpc\Rpc::call("Config", "get", [
                        "id" => "conf.service.gitea"
                ], $context);
        }

        public function set($params, $context) {
                return \OMV\Rpc\Rpc::call("Config", "set", [
                        "id" => "conf.service.gitea",
                        "data" => $params
                ], $context);
        }

        public function install($params, $context) {
                return $this->executeAction("install");
        }

        public function remove($params, $context) {
                return $this->executeAction("remove");
        }

        public function restart($params, $context) {
                return $this->executeAction("restart");
        }

        public function status($params, $context) {
                return $this->executeAction("status");
        }

        public function logs($params, $context) {
                return $this->executeAction("logs");
        }

        private function executeAction($action) {
                $process = new \OMV\System\Process([
                        "/usr/sbin/omv-mkconf",
                        "gitea",
                        $action
                ]);
                $process->setTimeout(0);
                $process->execute();
                return [
                        "exitcode" => $process->getExitCode(),
                        "stdout" => $process->getStdOut(),
                        "stderr" => $process->getStdErr()
                ];
        }
}
