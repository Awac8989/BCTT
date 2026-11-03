$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
try {
    $f = "Q:\CODE_visual\filebctt\docs\DoanMinhQuan_2224801030137_BCTT2.docx"
    Write-Host "Updating TOC for: $f"
    $doc = $word.Documents.Open($f)
    $doc.Fields.Update() | Out-Null
    foreach ($toc in $doc.TablesOfContents) {
        $toc.Update()
    }
    $doc.Save()
    $doc.Close([ref]$false)
    Write-Host "TOC update complete for docs file!"

    Copy-Item $f "Q:\CODE_visual\filebctt\DoanMinhQuan_2224801030137_BCTT2.docx" -Force
    Write-Host "Synchronized to root docx!"
} catch {
    Write-Host "Error: $_"
} finally {
    $word.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
}

