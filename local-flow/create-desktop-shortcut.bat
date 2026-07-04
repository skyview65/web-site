@echo off
REM local-flow.bat icin masaustune kisayol olusturur (Windows baslangicinda da kullanilabilir).
setlocal EnableExtensions
cd /d "%~dp0"

set "TARGET=%~dp0local-flow.bat"
set "SHORTCUT=%USERPROFILE%\Desktop\local-flow.lnk"

powershell -NoProfile -Command ^
  "$s = (New-Object -ComObject WScript.Shell).CreateShortcut('%SHORTCUT%');" ^
  "$s.TargetPath = '%TARGET%';" ^
  "$s.WorkingDirectory = '%~dp0';" ^
  "$s.WindowStyle = 1;" ^
  "$s.Description = 'local-flow - tamamen yerel dikte araci';" ^
  "$s.Save()"

if errorlevel 1 (
  echo [local-flow] Kisayol olusturulamadi.
) else (
  echo [local-flow] Masaustune kisayol eklendi: %SHORTCUT%
)
pause
