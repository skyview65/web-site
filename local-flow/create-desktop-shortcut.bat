@echo off
REM Sessiz (sistem tepsisi) baslatici icin masaustune kisayol olusturur.
REM Not: local-flow.bat kurulumdan sonra bunu zaten otomatik yapar; bu dosya
REM yalnizca kisayolu sildiyseniz yeniden olusturmak icindir.
setlocal EnableExtensions
cd /d "%~dp0"

REM Masaustu OneDrive'a tasinmis olabilir; gercek konumu PowerShell bulur.
powershell -NoProfile -Command ^
  "$d = [Environment]::GetFolderPath('Desktop');" ^
  "$p = Join-Path $d 'local-flow.lnk';" ^
  "$s = (New-Object -ComObject WScript.Shell).CreateShortcut($p);" ^
  "$s.TargetPath = '%~dp0local-flow-app.vbs';" ^
  "$s.WorkingDirectory = '%~dp0';" ^
  "$s.IconLocation = 'shell32.dll,220';" ^
  "$s.Description = 'local-flow - sistem tepsisinde calisan yerel dikte araci';" ^
  "$s.Save();" ^
  "Write-Host ('[local-flow] Masaustune kisayol eklendi: ' + $p)"

if errorlevel 1 echo [local-flow] Kisayol olusturulamadi.
pause
