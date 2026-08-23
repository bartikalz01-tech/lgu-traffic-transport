<?php

require_once '../../backend/RoadMapStatus.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {

  echo json_encode([
    'success' => false,
    'message' => 'Invalid request method.'
  ]);

  exit;
}


$data = json_decode(
  file_get_contents('php://input'),
  true
);


if (!$data) {

  echo json_encode([
    'success' => false,
    'message' => 'Request body is required.'
  ]);

  exit;
}


$cameraName = trim(
  $data['camera_name'] ?? ''
);

$recordingFilename = trim(
  $data['recording_filename'] ?? ''
);

$recordingFrom = trim(
  $data['recording_from'] ?? ''
);

$recordingTo = trim(
  $data['recording_to'] ?? ''
);


if (
  empty($cameraName) ||
  empty($recordingFilename) ||
  empty($recordingFrom) ||
  empty($recordingTo)
) {

  echo json_encode([
    'success' => false,
    'message' =>
      'Camera name, recording filename, recording start, and recording end are required.'
  ]);

  exit;
}


try {

  $fromDate = DateTime::createFromFormat(
    'Y-m-d H:i:s',
    $recordingFrom
  );

  $toDate = DateTime::createFromFormat(
    'Y-m-d H:i:s',
    $recordingTo
  );


  if (!$fromDate || !$toDate) {

    throw new Exception(
      'Invalid recording date format.'
    );
  }


  if ($fromDate >= $toDate) {

    throw new Exception(
      'Recording end time must be later than start time.'
    );
  }


  /*
   * Calculate duration on the server.
   */
  $durationSeconds =
    $toDate->getTimestamp()
    - $fromDate->getTimestamp();


  $roadMapStatus =
    new RoadMapStatus();


  $result =
    $roadMapStatus->insertCctvHistoricalRecord([

      'camera_name' =>
        $cameraName,

      'recording_filename' =>
        $recordingFilename,

      'recording_from' =>
        $fromDate->format(
          'Y-m-d H:i:s'
        ),

      'recording_to' =>
        $toDate->format(
          'Y-m-d H:i:s'
        ),

      'duration_seconds' =>
        $durationSeconds

    ]);


  echo json_encode([

    'success' => true,

    'message' =>
      'Historical CCTV recording saved successfully.',

    'cctv_record_id' =>
      $result['cctv_record_id'],

    'duration_seconds' =>
      $durationSeconds

  ]);


} catch (Exception $error) {

  error_log(
    '[CCTV HISTORICAL] '
    . $error->getMessage()
  );

  echo json_encode([

    'success' => false,

    'message' =>
      $error->getMessage()

  ]);

}

?>