@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo  DorXmoon — локальный просмотр сайта
echo  ===================================
echo.
echo   Сайт (EN):  http://localhost:8080/
echo   Сайт (RU):  http://localhost:8080/ru/
echo   Админка:    http://localhost:8080/admin.html
echo.
echo   Закрыть это окно = выключить сервер.
echo.
REM Пересобираем ru/ и метки версий ДО запуска — чтобы локально ты никогда
REM не смотрел на устаревшую русскую страницу и на закэшированный старый CSS.
where node >nul 2>nul && node "tools/build-langs.js"
echo.
start "" http://localhost:8080/
python -m http.server 8080
if errorlevel 1 (
  echo.
  echo  Не нашёл python. Тогда просто открой index.html двойным кликом —
  echo  сайт работает и так, локальный сервер нужен только чтобы адреса
  echo  выглядели как на боевом хостинге.
  pause
)
