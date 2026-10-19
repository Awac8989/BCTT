$ErrorActionPreference = "Stop"
$word = $null
$output = @()
try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $word.DisplayAlerts = 0
    $docPath = "Q:\CODE_visual\filebctt\BAO_CAO_THUC_TAP_100_TRANG_DOAN_MINH_QUAN.docx"
    $doc = $word.Documents.Open($docPath)
    
    # Extract figures
    $output += "=== FIGURES ==="
    foreach ($p in $doc.Paragraphs) {
        $txt = $p.Range.Text.Trim().Trim([char]13).Trim([char]7).Trim()
        if ($txt -match "^Hình \d+\.\d+:") {
            $pg = $p.Range.Information(3)
            $output += "FIG|$pg|$txt"
        }
    }
    
    # Extract tables
    $output += "=== TABLES ==="
    foreach ($p in $doc.Paragraphs) {
        $txt = $p.Range.Text.Trim().Trim([char]13).Trim([char]7).Trim()
        if ($txt -match "^Bảng (\d+\.\d+|PL\.\d+)") {
            $pg = $p.Range.Information(3)
            $output += "TBL|$pg|$txt"
        }
    }
    
    $output | Out-File -FilePath "Q:\CODE_visual\filebctt\scripts\figs_tables_pages.txt" -Encoding utf8
    Write-Host "Extracted figures and tables pages successfully!"
    $doc.Close([ref]$false)
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
} finally {
    if ($word) {
        $word.Quit()
        [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
    }
}
