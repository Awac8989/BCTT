$ErrorActionPreference = "Stop"
$word = $null
try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $word.DisplayAlerts = 0
    $docPath = "Q:\CODE_visual\filebctt\BAO_CAO_THUC_TAP_100_TRANG_DOAN_MINH_QUAN.docx"
    $doc = $word.Documents.Open($docPath)
    if ($doc.TablesOfContents.Count -ge 1) {
        $tocText = $doc.TablesOfContents.Item(1).Range.Text
        $tocText | Out-File -FilePath "Q:\CODE_visual\filebctt\scripts\word_toc_extracted.txt" -Encoding utf8
        Write-Host "Extracted native Word TOC lines successfully!"
    } else {
        Write-Host "No native TOC found in document."
    }
    $doc.Close([ref]$false)
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
} finally {
    if ($word) {
        $word.Quit()
        [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
    }
}
