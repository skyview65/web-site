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

if not exist ".venv\Scripts\local-flow.exe" (
  echo [local-flow] Ilk kurulum: sanal ortam olusturuluyor...
  %PY% -m venv .venv
  if errorlevel 1 goto :fail
  echo [local-flow] Paketler yukleniyor, birkac dakika surebilir...
  ".venv\Scripts\python.exe" -m pip install --upgrade pip
  ".venv\Scripts\pip.exe" install -e .
  if errorlevel 1 goto :fail
  if not exist "config.json" copy /y config.example.json config.json >nul
  echo [local-flow] Kurulum tamamlandi.
  echo.
)

echo [local-flow] Baslatiliyor... Ilk seferde Whisper modeli ~460 MB indirilir.
echo [local-flow] Kullanim: Ctrl+Alt+Space ile kaydi baslat/durdur.
echo [local-flow] Durdurmak icin bu pencerede Ctrl+C ya da pencereyi kapatin.
echo.
".venv\Scripts\local-flow.exe" %*
pause
exit /b 0

:fail
echo.
echo [local-flow] Kurulum basarisiz oldu. Yukaridaki hata mesajini kontrol edin.
pause
exit /b 1
