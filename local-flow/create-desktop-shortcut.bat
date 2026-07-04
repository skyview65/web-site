@echo off
REM Sessiz (sistem tepsisi) baslatici icin masaustune kisayol olusturur.
REM Not: local-flow.bat kurulumdan sonra bunu zaten otomatik yapar; bu dosya
REM yalnizca kisayolu sildiyseniz yeniden olusturmak icindir.
setlocal EnableExtensions
cd /d "%~dp0"

set "TARGET=%~dp0local-flow-app.vbs"
set "SHORTCUT=%USERPROFILE%\Desktop\local-flow.lnk"

powershell -NoProfile -Command ^
  "$s = (New-Object -ComObject WScript.Shell).CreateShortcut('%SHORTCUT%');" ^
  "$s.TargetPath = '%TARGET%';" ^
  "$s.WorkingDirectory = '%~dp0';" ^
  "$s.IconLocation = 'shell32.dll,220';" ^
  "$s.Description = 'local-flow - sistem tepsisinde calisan yerel dikte araci';" ^
  "$s.Save()"

if errorlevel 1 (
  echo [local-flow] Kisayol olusturulamadi.
) else (
  echo [local-flow] Masaustune kisayol eklendi: %SHORTCUT%
)
pause
