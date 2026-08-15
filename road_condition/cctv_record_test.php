<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    body {
      margin: 0;
      padding: 40px;
      background: #111;
      color: white;
      font-family: Arial, sans-serif;
    }

    h1 {
      margin-bottom: 10px;
    }

    .video-container { max-width: 1000px; }

    video { width: 100%; max-width: 1000px; background: black; border-radius: 8px; }

    .status { margin-top: 15px; padding: 12px; background: #222; border-radius: 6px; }
  </style>
</head>
<body>
  <div class="video-container">
    <h1>CCTV Recording Test</h1>

    <video id="recordedVideo" controls preload="metadata">
      <source 
        src="http://localhost/lgu-traffic-transport/cctv_ai/cctv_recording/temp_cctv_test_susano_20260815_152800_to_20260815_153000.mp4"
        type="video/mp4"
      >
    </video>

    <div class="status" id="status">
      Loading recording...
    </div>
  </div>

  <script>
    const video = document.getElementById("recordedVideo");
    const status = document.getElementById("status");

    video.addEventListener("loadedmetadata", () => {
      status.textContent = `Video loaded successfully. Duration: ${video.duration.toFixed(2)} seconds`;
      console.log("Video loaded.");
      console.log("Duration:", video.duration);
      console.log("Metadata loaded.");
    });

    video.addEventListener("canplay", () => {
      status.textContent = "Video is ready to play.";
    });

    video.addEventListener("error", () => {
      console.error( "Video error:", video.error );
      status.textContent = "Unable to play the video. Check the browser console.";
    });
  </script>

</body>
</html>