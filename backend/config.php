<?php
  class config {
    public $pdo = null;

    public function conn() {
      try {
        $env = $this->loadEnv();
        $host = $env['DB_HOST'] ?? '127.0.0.1';
        $port = $env['DB_PORT'] ?? '3306';
        $database = $env['DB_NAME'] ?? 'lgu-traffic';
        $user = $env['DB_USER'] ?? 'root';
        $password = $env['DB_PASS'] ?? '';

        $dsn = "mysql:host={$host};port={$port};dbname={$database};charset=utf8mb4";
        $this->pdo = new PDO($dsn, $user, $password, [
          PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
          PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
      }
      catch(PDOException $e) {
        die($e->getMessage());
      }

      return $this->pdo;
    }

    private function loadEnv() {
      $values = [];
      $envFile = dirname(__DIR__) . DIRECTORY_SEPARATOR . '.env';

      if (!is_readable($envFile)) {
        return $values;
      }

      foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#') {
          continue;
        }

        [$key, $value] = array_pad(explode('=', $line, 2), 2, '');
        $key = trim($key);
        $value = trim($value);
        $values[$key] = trim($value, "'\"");
      }

      return $values;
    }
  }
?>