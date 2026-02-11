<?php
  /**
   * Production Database Configuration
   * Update these values with your Hostinger database credentials
   */
  class config {
    // Update these with your Hostinger database credentials
    private $host = 'localhost'; // Usually 'localhost' on Hostinger, or check your hosting panel
    private $user = 'your_database_user'; // Your database username from Hostinger
    private $password = 'your_database_password'; // Your database password from Hostinger
    private $dbname = 'lgu4_traffic_transport'; // Your database name
    public $pdo = null;

    public function conn() {
      try {
        $this->pdo = new PDO(
          "mysql:host={$this->host};dbname={$this->dbname};charset=utf8mb4", 
          $this->user, 
          $this->password,
          [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
          ]
        );
      }
      catch(PDOException $e) {
        // Log error instead of displaying it in production
        error_log("Database connection error: " . $e->getMessage());
        die("Database connection failed. Please contact the administrator.");
      }

      return $this->pdo;
    }
  }
?>
