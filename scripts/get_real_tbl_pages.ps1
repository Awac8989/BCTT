$word = New-Object -ComObject Word.Application
$word.Visible = $false
$docPath = Join-Path (Get-Location) "DoanMinhQuan_2224801030137_BCTT2.docx"
$doc = $word.Documents.Open($docPath, [Type]::Missing, $true)

$tblPages = [ordered]@{}
$pCount = 0

foreach ($p in $doc.Paragraphs) {
    $pCount++
    $txt = $p.Range.Text.Trim()
    if ($txt -match '^B[ảa]ng\s+(\S+)\s*:\s*(.+)$') {
        $pg = $p.Range.Information([Microsoft.Office.Interop.Word.WdInformation]::wdActiveEndAdjustedPageNumber)
        if ($pg -ge 14) {
            $code = "Bảng " + $Matches[1]
            if (-not $tblPages.Contains($code)) {
                $tblPages[$code] = @{
                    Page = $pg
                    Title = $txt
                }
                Write-Host "$code => Page $pg"
            }
        }
    }
}

$json = ConvertTo-Json $tblPages -Depth 3
$json | Out-File -FilePath "scripts/real_tbl_pages.json" -Encoding UTF8

$doc.Close([Microsoft.Office.Interop.Word.WdSaveOptions]::wdDoNotSaveChanges)
$word.Quit()
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($doc) | Out-Null
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
Write-Host "Done! Found $($tblPages.Count) tables in body."
