# Instala el vigía de boletos como tarea de Windows: corre cada 30 minutos,
# sin abrir ventanas, y muestra una notificación cuando hay noticias de la venta 2027.
#
# Instalar:     powershell -ExecutionPolicy Bypass -File scripts\instalar-vigia-windows.ps1
# Desinstalar:  powershell -ExecutionPolicy Bypass -File scripts\instalar-vigia-windows.ps1 -Desinstalar

param([switch]$Desinstalar)

$taskName = "Danfer - Vigia boletos Machu Picchu 2027"
$dir = Join-Path $env:LOCALAPPDATA "DanferVigia"
$project = Split-Path $PSScriptRoot -Parent

if ($Desinstalar) {
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
    Write-Host "Vigia desinstalado."
    return
}

$node = (Get-Command node -ErrorAction Stop).Source
New-Item -ItemType Directory -Force $dir | Out-Null

# Lanzador oculto: wscript corre node sin mostrar la consola.
@"
Set sh = CreateObject("WScript.Shell")
sh.CurrentDirectory = "$project"
sh.Run """$node"" scripts\vigia-boletos.mjs", 0, True
"@ | Set-Content -Path (Join-Path $dir "vigia.vbs") -Encoding ASCII

$action = New-ScheduledTaskAction -Execute "wscript.exe" -Argument "`"$(Join-Path $dir 'vigia.vbs')`""
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Minutes 30)
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit (New-TimeSpan -Minutes 5)

Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings `
    -Description "Revisa noticias del Ministerio de Cultura y avisa cuando sale la venta 2027 de Machu Picchu." | Out-Null
Start-ScheduledTask -TaskName $taskName

Write-Host "Vigia instalado. En unos segundos te debe salir la notificacion 'Vigia de boletos activo'."
