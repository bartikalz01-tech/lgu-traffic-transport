<?php
require_once 'config.php';

class Notifications extends config {

  public function createPossibleAccidentNotifications() {

    $conn = $this->conn();

    $conn->beginTransaction();

    try {

      /*
      * Get all accident detections.
      */
      $possibleAccidentSql = "
        SELECT
          ad.accident_detection_id,
          ad.road_id,
          r.road_name,
          ad.detected_at

        FROM accident_detections ad

        LEFT JOIN roads r
          ON ad.road_id = r.road_id

        ORDER BY ad.created_at DESC
      ";

      $possibleAccidentStmt =
        $conn->prepare($possibleAccidentSql);

      $possibleAccidentStmt->execute();

      $possibleAccidents =
        $possibleAccidentStmt->fetchAll(
          PDO::FETCH_ASSOC
        );


      /*
      * Nothing to notify.
      */
      if (!$possibleAccidents) {

        $conn->commit();

        return [
          'success' => true,
          'inserted' => 0
        ];
      }


      /*
      * Check whether a possible_accident
      * notification already exists for
      * this accident detection.
      */
      $existingNotificationSql = "
        SELECT
          notification_id

        FROM notifications

        WHERE module = 'accident'

          AND notification_type =
              'possible_accident'

          AND source_id = :source_id

        LIMIT 1
      ";

      $existingNotificationStmt =
        $conn->prepare(
          $existingNotificationSql
        );


      /*
      * Insert a new possible accident
      * notification.
      */
      $insertNotificationSql = "
        INSERT INTO notifications (
          module,
          notification_type,
          title,
          message,
          source_id
        ) VALUES (
          :module,
          :notification_type,
          :title,
          :message,
          :source_id
        )
      ";

      $insertNotificationStmt =
        $conn->prepare(
          $insertNotificationSql
        );


      $insertedCount = 0;


      /*
      * Process each accident detection.
      */
      foreach ($possibleAccidents as $accident) {

        $accidentDetectionId =
          $accident['accident_detection_id'];

        $roadName =
          $accident['road_name']
          ?? 'Unknown Road';


        /*
        * Check whether this detection
        * already has a notification.
        */
        $existingNotificationStmt->execute([
          ':source_id' =>
            $accidentDetectionId
        ]);

        $existingNotification =
          $existingNotificationStmt->fetch(
            PDO::FETCH_ASSOC
          );


        /*
        * If a notification already exists,
        * do not create another one.
        */
        if ($existingNotification) {
          continue;
        }


        /*
        * Create the notification.
        */
        $message =
          "Possible accident detected on " .
          $roadName;


        $insertNotificationStmt->execute([

          ':module' =>
            'accident',

          ':notification_type' =>
            'possible_accident',

          ':title' =>
            'Possible Accident Detected',

          ':message' =>
            $message,

          ':source_id' =>
            $accidentDetectionId
        ]);


        $insertedCount++;

      }


      $conn->commit();


      return [
        'success' => true,
        'inserted' => $insertedCount
      ];


    } catch (PDOException $e) {

      if ($conn->inTransaction()) {
        $conn->rollBack();
      }

      error_log(
        "[NOTIFICATION] Database error: " .
        $e->getMessage()
      );

      throw new Exception(
        "Notification insertion failed"
      );

    }

  }

  public function createUndispatchedNotifications() {

    $conn = $this->conn();

    $conn->beginTransaction();

    try {

      /*
      * Get all accident cases that are still
      * waiting for dispatch.
      */
      $accidentCaseSql = "
        SELECT
          ac.accident_id,
          ac.public_accident_id,
          ad.road_id,
          r.road_name,
          ac.reported_at

        FROM accident_cases ac

        INNER JOIN accident_detections ad
          ON ac.accident_detection_id =
            ad.accident_detection_id

        INNER JOIN roads r
          ON ad.road_id = r.road_id

        WHERE ac.status = 'Reported'

        ORDER BY ac.reported_at ASC
      ";

      $accidentCasesStmt =
        $conn->prepare($accidentCaseSql);

      $accidentCasesStmt->execute();

      $accidentCases =
        $accidentCasesStmt->fetchAll(
          PDO::FETCH_ASSOC
        );


      /*
      * Nothing to process.
      */
      if (!$accidentCases) {

        $conn->commit();

        return [
          'success' => true,
          'inserted' => 0
        ];
      }


      /*
      * Check whether this accident already
      * has an undispatched notification.
      */
      $existingNotificationSql = "
        SELECT
          notification_id

        FROM notifications

        WHERE module = 'accident'

          AND notification_type =
              'undispatched_accident'

          AND source_id = :source_id

        LIMIT 1
      ";

      $existingNotificationStmt =
        $conn->prepare(
          $existingNotificationSql
        );


      /*
      * Insert notification.
      */
      $insertNotificationSql = "
        INSERT INTO notifications (
          module,
          notification_type,
          title,
          message,
          source_id,
          source_public_id
        ) VALUES (
          :module,
          :notification_type,
          :title,
          :message,
          :source_id,
          :source_public_id
        )
      ";

      $insertNotificationStmt =
        $conn->prepare(
          $insertNotificationSql
        );


      $insertedCount = 0;


      /*
      * Process each accident case.
      */
      foreach ($accidentCases as $accident) {

        $accidentId =
          $accident['accident_id'];

        $roadName =
          $accident['road_name']
          ?? 'Unknown Road';

        $publicAccidentId =
          $accident['public_accident_id'];


        /*
        * Check if an undispatched notification
        * already exists for this accident.
        */
        $existingNotificationStmt->execute([
          ':source_id' =>
            $accidentId
        ]);

        $existingNotification =
          $existingNotificationStmt->fetch(
            PDO::FETCH_ASSOC
          );


        /*
        * If notification already exists,
        * DO NOT create another one.
        */
        if ($existingNotification) {
          continue;
        }


        /*
        * Calculate how many seconds have
        * passed since the accident was reported.
        */
        $elapsedSql = "
          SELECT
            TIMESTAMPDIFF(
              SECOND,
              :reported_at,
              CURRENT_TIMESTAMP
            ) AS elapsed_seconds
        ";

        $elapsedStmt =
          $conn->prepare($elapsedSql);

        $elapsedStmt->execute([
          ':reported_at' =>
            $accident['reported_at']
        ]);

        $elapsed =
          $elapsedStmt->fetch(
            PDO::FETCH_ASSOC
          );


        /*
        * Only create the notification
        * after 30 seconds.
        */
        if (
          (int)$elapsed['elapsed_seconds'] < 30
        ) {
          continue;
        }


        /*
        * Create the single undispatched
        * notification.
        */
        $message =
          "Accident " .
          $publicAccidentId .
          " on " .
          $roadName .
          " has not been dispatched yet.";


        $insertNotificationStmt->execute([

          ':module' =>
            'accident',

          ':notification_type' =>
            'undispatched_accident',

          ':title' =>
            'Accident Awaiting Dispatch',

          ':message' =>
            $message,

          ':source_id' =>
            $accidentId,

          ':source_public_id' =>
            $publicAccidentId

        ]);


        $insertedCount++;

      }


      $conn->commit();


      return [
        'success' => true,
        'inserted' => $insertedCount
      ];


    } catch (PDOException $e) {

      if ($conn->inTransaction()) {
        $conn->rollBack();
      }

      error_log(
        "[NOTIFICATION] Database error: " .
        $e->getMessage()
      );

      throw new Exception(
        "Undispatched notification insertion failed."
      );

    } catch (Exception $e) {

      if ($conn->inTransaction()) {
        $conn->rollBack();
      }

      throw $e;

    }

  }

  public function getNotifications() {

    $conn = $this->conn();

    try {

      $sql = "
        SELECT
          notification_id,
          module,
          notification_type,
          title,
          message,
          source_id,
          source_public_id,
          created_at,
          is_read,
          read_at

        FROM notifications

        WHERE NOT (
          notification_type = 'possible_accident'

          AND EXISTS (
            SELECT 1
            FROM accident_cases ac
            WHERE ac.accident_detection_id = notifications.source_id
          )
        )

        AND (
          notification_type <> 'undispatched_accident'

          OR EXISTS (
            SELECT 1
            FROM accident_cases ac
            WHERE ac.accident_id = notifications.source_id
              AND ac.status = 'Reported'
          )
        )

        ORDER BY created_at DESC
      ";

      $stmt = $conn->prepare($sql);

      $stmt->execute();

      $notifications = $stmt->fetchAll(
        PDO::FETCH_ASSOC
      );

      return [
        'success' => true,
        'notifications' => $notifications
      ];

    } catch(PDOException $e) {

      error_log(
        "[NOTIFICATION] Database error: " .
        $e->getMessage()
      );

      throw new Exception(
        "Failed to retrieve notifications."
      );

    }

  }

  public function markNotificationAsRead($notificationId) {
    $conn = $this->conn();

    try {
      $sql = "
        UPDATE notifications

        SET
          is_read = 1,
          read_at = CURRENT_TIMESTAMP

        WHERE notification_id = :notification_id

          AND is_read = 0
      ";

      $stmt = $conn->prepare($sql);

      $stmt->execute([
        ':notification_id' => $notificationId
      ]);

      return [
        'success' => true,
        'notification_id' => $notificationId,
        'updated' => $stmt->rowCount()
      ];

    } catch(PDOException $e) {

      error_log(
        "[NOTIFICATION] Database error: " .
        $e->getMessage()
      );

      throw new Exception("Failed to mark notification as read.");

    }
  }

}

?>