@echo off
REM local-flow: cift tiklamayla kur + calistir (Windows)
REM Ilk calistirmada sanal ortami kurar ve paketleri yukler;
REM sonraki calistirmalarda dogrudan baslar.
setlocal EnableExtensions
chcp 65001 >nul
cd /d "%~dp0"

set "PY=py -3"
%PY% --version >nul 2>&1 || set "PY=python"
%PY% --version >nul 2>&1
if errorlevel 1 (
  echo [local-flow] Python bulunamadi. winget ile kurmayi deniyorum...
  winget install -e --id Python.Python.3.12 --accept-package-agreements --accept-source-agreements
  if errorlevel 1 (
    echo.
    echo [local-flow] Otomatik kurulum olmadi. https://www.python.org/downloads/ adresinden
    echo [local-flow] Python kurun ^("Add python.exe to PATH" isaretli^) ve tekrar cift tiklayin.
    pause
    exit /b 1
  )
  echo.
  echo [local-flow] Python kuruldu. PATH'in guncellenmesi icin bu pencereyi kapatip
  echo [local-flow] local-flow.bat dosyasina TEKRAR cift tiklayin.
  pause
  exit /b 0
)

if not exist ".venv\Scripts\local-flow-tray.exe" (
  echo [local-flow] Ilk kurulum: sanal ortam olusturuluyor...
  %PY% -m venv .venv
  if errorlevel 1 goto :fail
  echo [local-flow] Paketler yukleniyor, birkac dakika surebilir...
  ".venv\Scripts\python.exe" -m pip install --upgrade pip
  ".venv\Scripts\pip.exe" install -e ".[tray]"
  if errorlevel 1 goto :fail
  if not exist "config.json" copy /y config.example.json config.json >nul
  echo [local-flow] Kurulum tamamlandi.
  echo.
)

REM Arguman verilmisse (ör. --list-devices) konsollu/hata ayiklama modu.
if not "%~1"=="" (
  echo [local-flow] Konsol modunda calistiriliyor...
  ".venv\Scripts\local-flow.exe" %*
  pause
  exit /b 0
)

if not exist "%USERPROFILE%\Desktop\local-flow.lnk" (
  echo [local-flow] Masaustune kisayol ekleniyor...
  powershell -NoProfile -Command ^
    "$s = (New-Object -ComObject WScript.Shell).CreateShortcut('%USERPROFILE%\Desktop\local-flow.lnk');" ^
    "$s.TargetPath = '%~dp0local-flow-app.vbs';" ^
    "$s.WorkingDirectory = '%~dp0';" ^
    "$s.IconLocation = 'shell32.dll,220';" ^
    "$s.Description = 'local-flow - sistem tepsisinde calisan yerel dikte araci';" ^
    "$s.Save()" >nul 2>&1
)

echo [local-flow] Sistem tepsisinde baslatiliyor (gorev cubugu, saat yanindaki ok simgesine bakin)...
echo [local-flow] Ilk seferde Whisper modeli ~460 MB indirilir, biraz surebilir.
start "" wscript.exe "%~dp0local-flow-app.vbs"
timeout /t 3 >nul
echo.
echo [local-flow] Tamam. Bu pencereyi kapatabilirsiniz.
echo [local-flow] Bundan sonra masaustundeki "local-flow" kisayoluna cift tiklamaniz yeterli.
pause
exit /b 0

:fail
echo.
echo [local-flow] Kurulum basarisiz oldu. Yukaridaki hata mesajini kontrol edin.
pause
exit /b 1
