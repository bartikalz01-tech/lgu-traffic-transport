<?php
require_once 'config.php';

class AccidentPeoples extends config {

  public function getTotalAccidentPeoples($accident_id) {
    $conn = $this->conn();
    $sql = "
      SELECT COUNT(*) AS total_people 
      FROM accident_peoples
      WHERE accident_id = :accident_id
    ";

    $data = $conn->prepare($sql);
    $data->bindParam(':accident_id', $accident_id, PDO::PARAM_INT);
    $data->execute();

    return $data->fetch(PDO::FETCH_ASSOC);
  }

  public function getPeopleAccidentDetails($accidentId) {
    $conn = $this->conn();
    $sql = "
      SELECT
        ap.accident_ppl_id,
        p.people_id,
        a.accident_id,
        p.full_name,
        p.contact_num,
        p.address,
        ap.role,
        ap.status_level
      FROM accident_peoples ap
      LEFT JOIN accident_cases a ON ap.accident_id = a.accident_id 
      LEFT JOIN people_involved p ON ap.people_id = p.people_id
      WHERE a.accident_id = :accident_id;
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bindValue(':accident_id', $accidentId, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function deleteAccidentPeople($accidentPplId) {
    $conn = $this->conn();
    
    $conn->beginTransaction();

    try {
      $getSql = "
        SELECT people_id
        FROM accident_peoples
        WHERE accident_ppl_id = :accident_ppl_id
      ";

      $stmt = $conn->prepare($getSql);
      $stmt->execute([
        ':accident_ppl_id' => $accidentPplId
      ]);

      $row = $stmt->fetch(PDO::FETCH_ASSOC);

      if(!$row) {
        $conn->rollBack();
        return false;
      }

      $peopleId = $row['people_id'];

      $deleteAccidentSql = "
        DELETE FROM accident_peoples
        WHERE accident_ppl_id = :accident_ppl_id
      ";

      $stmt = $conn->prepare($deleteAccidentSql);
      $stmt->execute([
        ':accident_ppl_id' => $accidentPplId
      ]);

      $deletePeopleSql = "
        DELETE FROM people_involved
        WHERE people_id = :people_id
      ";

      $stmt = $conn->prepare($deletePeopleSql);
      $stmt->execute([
        ':people_id' => $peopleId
      ]);

      $conn->commit();

      return true;

    } catch(Exception $e) {
      $conn->rollBack();
      throw $e;
      return false;
    }
  }
}
?>