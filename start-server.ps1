# start-server.ps1

Write-Host "--- Configurando Entorno Office Add-in Local ---" -ForegroundColor Cyan

# 1. Verificar herramientas
$hasNpx = Get-Command npx -ErrorAction SilentlyContinue
if (-not $hasNpx) {
    Write-Error "No se encontró 'npx'. Asegúrate de tener Node.js instalado."
    exit 1
}

# 2. Generar Certificados (si no existen)
Write-Host "1. Verificando certificados SSL..." -ForegroundColor Yellow
if (-not (Test-Path "localhost.crt")) {
    Write-Host "Generando certificados autofirmados con 'office-addin-dev-certs'..."
    Write-Host "NOTA: Si Windows pide confirmación para instalar el certificado, acepta." -ForegroundColor Magenta
    
    # Intenta instalar y copiar los certs a la carpeta actual
    cmd /c "npx office-addin-dev-certs install --machine"
    
    # office-addin-dev-certs guarda los certs en %USERPROFILE%\.office-addin-dev-certs
    # Vamos a copiarlos aquí para usarlos con http-server fácilmente
    $certDir = "$env:USERPROFILE\.office-addin-dev-certs"
    if (Test-Path "$certDir\localhost.crt") {
        Copy-Item "$certDir\localhost.crt" -Destination .
        Copy-Item "$certDir\localhost.key" -Destination .
        Write-Host "Certificados copiados con éxito." -ForegroundColor Green
    } else {
        Write-Warning "No se pudieron encontrar los certificados generados en $certDir. Intentando generarlos localmente..."
    }
} else {
    Write-Host "Certificados ya presentes." -ForegroundColor Green
}

# 3. Iniciar Servidor
Write-Host "2. Iniciando Servidor Web Seguro (HTTPS)..." -ForegroundColor Yellow
Write-Host "Accede a: https://localhost:3000/index.html" -ForegroundColor Cyan
Write-Host "Para detener el servidor, presiona CTRL+C" -ForegroundColor Gray

# Ejecuta http-server usando los certificados
# -S: SSL
# -C: Cert file 
# -K: Key file
# -p: Port
# --cors: Enable CORS
cmd /c "npx http-server -S -C localhost.crt -K localhost.key --cors . -p 3000"
