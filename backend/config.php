<?php
  class config {
    private $user = 'root';
    private $password = '';
    public $pdo = null;

    public function conn() {
      try {
        $this->pdo = new PDO('mysql:host=127.0.0.1;dbname=lgu4_traffic_transport', $this->user, $this->password);
      }
      catch(PDOException $e) {
        die($e->getMessage());
      }

      return $this->pdo;
    }
  }
?>