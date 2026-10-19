$p = Get-Process -Id 16652 -ErrorAction SilentlyContinue
if ($p) {
    Write-Host "Closing Word PID 16652..."
    $p.CloseMainWindow()
    Start-Sleep -Seconds 2
    if ($p.HasExited) {
        Write-Host "Word closed cleanly."
    } else {
        Write-Host "Word is still open."
    }
} else {
    Write-Host "Process 16652 not found."
}
