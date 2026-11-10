param(
    [int]$Port = 3000,
    [string]$RootDirectory = $PSScriptRoot
)

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
} catch {
    Write-Warning "Port $Port is in use or blocked. Trying port 8080..."
    $Port = 8080
    $prefix = "http://localhost:$Port/"
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add($prefix)
    $listener.Start()
}

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " AURA Studio Local Server is running!" -ForegroundColor Green
Write-Host " URL: $prefix" -ForegroundColor Yellow
Write-Host " Root: $RootDirectory" -ForegroundColor Gray
Write-Host " Press Ctrl+C in this terminal to stop the server." -ForegroundColor Gray
Write-Host "========================================================" -ForegroundColor Cyan

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".woff" = "font/woff"
    ".woff2"= "font/woff2"
    ".ttf"  = "font/ttf"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $localPath = [System.Uri]::UnescapeDataString($request.Url.AbsolutePath)
        if ($localPath -eq "/" -or [string]::IsNullOrWhiteSpace($localPath)) {
            $localPath = "/index.html"
        }

        # Normalize relative path to prevent directory traversal
        $relativeFilePath = $localPath.TrimStart("/\").Replace("/", [System.IO.Path]::DirectorySeparatorChar)
        $fullPath = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($RootDirectory, $relativeFilePath))

        if (-not $fullPath.StartsWith([System.IO.Path]::GetFullPath($RootDirectory))) {
            $response.StatusCode = 403
            $buffer = [System.Text.Encoding]::UTF8.GetBytes("403 Forbidden")
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            $response.OutputStream.Close()
            continue
        }

        if (Test-Path -Path $fullPath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($fullPath).ToLowerInvariant()
            $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $response.ContentType = $mime

            $bytes = [System.IO.File]::ReadAllBytes($fullPath)
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            Write-Host "[200] $($request.HttpMethod) $localPath" -ForegroundColor DarkGreen
        } else {
            $response.StatusCode = 404
            $buffer = [System.Text.Encoding]::UTF8.GetBytes("<html><body><h2>404 Not Found</h2><p>$localPath</p></body></html>")
            $response.ContentType = "text/html; charset=utf-8"
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            Write-Host "[404] $($request.HttpMethod) $localPath" -ForegroundColor Red
        }

        $response.OutputStream.Close()
    } catch {
        # Catch unexpected client aborts or shutdown
    }
}
