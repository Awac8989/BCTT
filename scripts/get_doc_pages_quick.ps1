$word = New-Object -ComObject Word.Application
$word.Visible = $false
$docPath = Join-Path (Get-Location) "DoanMinhQuan_2224801030137_BCTT2.docx"
$doc = $word.Documents.Open($docPath, [Type]::Missing, $true)

$jsonText = Get-Content -Path "scripts/toc_targets.json" -Raw -Encoding UTF8
$targets = ConvertFrom-Json $jsonText

$results = [ordered]@{}
$pCount = 0

foreach ($p in $doc.Paragraphs) {
    $pCount++
    $txt = $p.Range.Text.Trim()
    if ($txt.Length -gt 0) {
        foreach ($target in $targets) {
            if (-not $results.Contains($target)) {
                $matched = $false
                if ($target -eq "LỜI CẢM ƠN" -and $pCount -ge 40 -and $pCount -le 55) { $matched = $true }
                elseif ($target -eq "MỤC LỤC" -and $pCount -ge 50 -and $pCount -le 60) { $matched = $true }
                elseif ($pCount -gt 150) {
                    $subTarget = if ($target.Length -gt 25) { $target.Substring(0, 25) } else { $target }
                    if ($txt.StartsWith($subTarget, [System.StringComparison]::InvariantCultureIgnoreCase)) {
                        $matched = $true
                    }
                }
                
                if ($matched) {
                    $page = $p.Range.Information([Microsoft.Office.Interop.Word.WdInformation]::wdActiveEndAdjustedPageNumber)
                    $results[$target] = $page
                    Write-Host "$target => Page $page"
                }
            }
        }
    }
}

$resultsJson = ConvertTo-Json $results -Depth 2
$resultsJson | Out-File -FilePath "scripts/verified_pages_142.json" -Encoding UTF8

$doc.Close([Microsoft.Office.Interop.Word.WdSaveOptions]::wdDoNotSaveChanges)
$word.Quit()
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($doc) | Out-Null
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
Write-Host "Done!"
