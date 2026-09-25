@echo off

cd /d C:\xampp\htdocs\lgu-traffic-transport

start "CCTV Susano" python -m cctv_ai.cctv_ai_susano
start "CCTV Del Rey" python -m cctv_ai.cctv_ai_delrey
start "CCTV Don Alejandro" python -m cctv_ai.cctv_ai_dalejandro
start "CCTV Santo Niño" python -m cctv_ai.cctv_ai_sto_nino

pause