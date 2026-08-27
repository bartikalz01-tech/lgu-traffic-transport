<?php
require_once 'config.php';

class Tickets extends config {

  public function getVerifiedViolations() {

    $conn = $this->conn();

    $sql = "
      SELECT

        vr.violation_id,
        vr.public_violation_id,

        r.road_name,

        vr.vehicle_id,
        vr.person_id,
        vr.subject_type,

        v.plate_number,
        v.vehicle_type,

        vr.violation_type,
        vr.violation_datetime,
        vr.location_details,
        vr.description,

        vr.verification_status,
        vr.offense_level,

        ve.cloudinary_url

      FROM violation_reports vr

      LEFT JOIN roads r
        ON vr.road_id = r.road_id

      LEFT JOIN vehicles v
        ON vr.vehicle_id = v.vehicle_id

      LEFT JOIN violation_evidence ve
        ON vr.violation_id = ve.violation_id

      WHERE vr.verification_status = 'Verified'

      ORDER BY vr.created_at DESC
    ";

    $stmt = $conn->prepare($sql);

    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

}

?>