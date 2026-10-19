$ErrorActionPreference = "Stop"
$word = $null
try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $word.DisplayAlerts = 0

    $files = @(
        "Q:\CODE_visual\filebctt\docs\BAO_CAO_THUC_TAP_DOANH_NGHIEP_DOAN_MINH_QUAN.docx",
        "Q:\CODE_visual\filebctt\BAO_CAO_THUC_TAP_DOAN_MINH_QUAN_BAN_IN_CHUAN.docx",
        "Q:\CODE_visual\filebctt\BAO_CAO_THUC_TAP_100_TRANG_DOAN_MINH_QUAN.docx"
    )

    foreach ($f in $files) {
        if (Test-Path $f) {
            try {
                Write-Host "Updating TOC for: $f"
                $doc = $word.Documents.Open($f)
                $doc.Fields.Update() | Out-Null
                foreach ($toc in $doc.TablesOfContents) {
                    $toc.Update()
                }
                $doc.Save()
                $doc.Close([ref]$false)
                Write-Host "Done: $f"
            } catch {
                Write-Host "Warning updating $f (may be open in Word): $($_.Exception.Message)"
                try { $doc.Close([ref]$false) } catch {}
            }
        }
    }
    Write-Host "ALL_DOCS_UPDATED_SUCCESSFULLY"
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
} finally {
    if ($word) {
        $word.Quit()
        [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
    }
}
