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
      * Nothing to notify.
      */
      if (!$accidentCases) {

        $conn->commit();

        return [
          'success' => true,
          'inserted' => 0
        ];
      }


      /*
      * Find the latest notification generated
      * for each accident case.
      */
      $latestNotificationSql = "
        SELECT
          created_at

        FROM notifications

        WHERE module = 'accident'

          AND notification_type =
              'undispatched_accident'

          AND source_id = :source_id

        ORDER BY created_at DESC

        LIMIT 1
      ";

      $latestNotificationStmt =
        $conn->prepare(
          $latestNotificationSql
        );


      /*
      * Insert a new notification.
      *
      * created_at is intentionally NOT supplied.
      *
      * MySQL will use CURRENT_TIMESTAMP.
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


      foreach ($accidentCases as $accident) {

        $accidentId =
          $accident['accident_id'];

        $roadName =
          $accident['road_name']
          ?? 'Unknown Road';

        $publicAccidentId =
          $accident['public_accident_id'];

        $reportedAt =
          new DateTime(
            $accident['reported_at']
          );

        $now =
          new DateTime();


        /*
        * Check the latest notification
        * for this accident.
        */
        $latestNotificationStmt->execute([
          ':source_id' => $accidentId
        ]);

        $latestNotification =
          $latestNotificationStmt->fetch(
            PDO::FETCH_ASSOC
          );


        /*
        * Determine whether a notification
        * is due.
        */
        $shouldNotify = false;


        if (!$latestNotification) {

          /*
          * No notification exists yet.
          *
          * Start the notification cycle from
          * the accident's reported_at.
          */
          $secondsSinceReported =
            $now->getTimestamp()
            - $reportedAt->getTimestamp();


          if ($secondsSinceReported >= 30) {
            $shouldNotify = true;
          }

        } else {

          /*
          * A notification already exists.
          *
          * Check whether 30 seconds have
          * passed since the last notification.
          */
          $lastNotificationAt =
            new DateTime(
              $latestNotification['created_at']
            );

          $secondsSinceLastNotification =
            $now->getTimestamp()
            - $lastNotificationAt->getTimestamp();


          if ($secondsSinceLastNotification >= 30) {
            $shouldNotify = true;
          }

        }


        /*
        * Insert the reminder only when
        * the 30-second interval has passed.
        */
        if ($shouldNotify) {

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