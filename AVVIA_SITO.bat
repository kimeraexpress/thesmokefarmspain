@echo off
title THE SMOKE FARM SPAIN - Server Locale & Pannello Admin
echo ========================================================
echo       THE SMOKE FARM SPAIN - PREVIEW & ADMIN SERVER
echo ========================================================
echo.
echo Il sito e il Pannello Admin sono pronti e ottimizzati!
echo.
echo Apertura del browser in corso...
start http://localhost:8080
echo.
echo Server attivo:
echo   - Sito Principale:  http://localhost:8080
echo   - Pannello Admin:   http://localhost:8080/admin.html
echo.
echo (Puoi aprirlo anche dal tuo smartphone connettendoti al tuo IP locale su porta 8080)
echo.
echo Premi CTRL+C per arrestare il server.
echo ========================================================
python server.py 8080
if %ERRORLEVEL% NEQ 0 (
  echo Tentativo di avvio fallback con modulo http.server...
  python -m http.server 8080
)
pause
