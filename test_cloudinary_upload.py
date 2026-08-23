from pathlib import Path

import cloudinary
import cloudinary.uploader

import cloudinary_config

TEST_FILE = Path("test_upload.txt")

# Create a small temporary file.
TEST_FILE.write_text(
  "AlerTara Cloudinary upload test.",
  encoding="utf-8"
)


try:

  result = cloudinary.uploader.upload(
      str(TEST_FILE),
      resource_type="raw",
      folder="alertara_test"
  )

  print("\nCloudinary upload successful!")
  print("Public ID:", result.get("public_id"))
  print("URL:", result.get("secure_url"))

finally:
  if TEST_FILE.exists():
      TEST_FILE.unlink()