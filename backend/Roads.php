<?php
  require 'config.php';

  class Roads extends config {
    
    public function viewRoadsData() {
      $conn = $this->conn();
      $sql = "SELECT * FROM `roads`";
      $data = $conn->prepare($sql);
      $data->execute();
      
      return $result = $data->fetchAll(PDO::FETCH_ASSOC);
    }
  }

?>