# Script para reiniciar func start
Write-Host "🛑 Deteniendo procesos de func start..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -like "*func*" -or $_.CommandLine -like "*func*"} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

Write-Host "🧹 Limpiando caché..." -ForegroundColor Yellow
Remove-Item -Path "admin_login\__pycache__" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "🚀 Iniciando func start..." -ForegroundColor Green
.\.venv\Scripts\Activate.ps1
func start

