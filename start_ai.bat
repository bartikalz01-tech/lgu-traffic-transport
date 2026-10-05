@echo off

cd /d C:\xampp\htdocs\lgu-traffic-transport

start "CCTV Susano" python -m cctv_ai.cctv_ai_susano
start "CCTV Susano" python -m cctv_ai.cctv_ai_sto_nino

pause