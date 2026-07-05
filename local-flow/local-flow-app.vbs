' local-flow'u sistem tepsisinde, hicbir konsol/pencere acmadan baslatir.
' Gunluk kullanim icin: bu dosyaya (ya da ondan olusturulan masaustu kisayoluna)
' cift tikla. Ilk kurulum icin local-flow.bat kullanilir.
Set fso = CreateObject("Scripting.FileSystemObject")
scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)

trayExe = scriptDir & "\.venv\Scripts\local-flow-tray.exe"
If Not fso.FileExists(trayExe) Then
  MsgBox "local-flow henuz kurulmamis." & vbCrLf & vbCrLf & _
    "Once '" & scriptDir & "\local-flow.bat' dosyasina cift tiklayarak kurulumu tamamlayin.", _
    vbExclamation, "local-flow"
  WScript.Quit 1
End If

Set shell = CreateObject("WScript.Shell")
shell.CurrentDirectory = scriptDir
shell.Run """" & trayExe & """", 0, False
