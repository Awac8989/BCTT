try {
    $word = [Runtime.InteropServices.Marshal]::GetActiveObject('Word.Application')
    if ($word) {
        Write-Host "Active Word documents:"
        foreach ($d in $word.Documents) {
            Write-Host ("  Doc: " + $d.FullName + " (Saved: " + $d.Saved + ")")
        }
    }
} catch {
    Write-Host "No active Word COM instance found or error: $_"
}
