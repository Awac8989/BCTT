$word = New-Object -ComObject Word.Application
$word.Visible = $false
$docPath = Join-Path (Get-Location) "DoanMinhQuan_2224801030137_BCTT2.docx"
$doc = $word.Documents.Open($docPath, [Type]::Missing, $true)

$figPages = [ordered]@{}
$pCount = 0

foreach ($p in $doc.Paragraphs) {
    $pCount++
    $txt = $p.Range.Text.Trim()
    if ($txt -match '^H[ìi]nh\s+(\d+\.\d+)\s*:\s*(.+)$') {
        $pg = $p.Range.Information([Microsoft.Office.Interop.Word.WdInformation]::wdActiveEndAdjustedPageNumber)
        if ($pg -ge 14) {
            $code = "Hình " + $Matches[1]
            if (-not $figPages.Contains($code)) {
                $figPages[$code] = @{
                    Page = $pg
                    Title = $txt
                }
                Write-Host "$code => Page $pg"
            }
        }
    }
}

$json = ConvertTo-Json $figPages -Depth 3
$json | Out-File -FilePath "scripts/real_fig_pages.json" -Encoding UTF8

$doc.Close([Microsoft.Office.Interop.Word.WdSaveOptions]::wdDoNotSaveChanges)
$word.Quit()
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($doc) | Out-Null
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
Write-Host "Done! Found $($figPages.Count) figures in body."
