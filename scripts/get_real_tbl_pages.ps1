$word = New-Object -ComObject Word.Application
$word.Visible = $false
$docPath = Join-Path (Get-Location) "DoanMinhQuan_2224801030137_BCTT2.docx"
$doc = $word.Documents.Open($docPath, [Type]::Missing, $true)

$tblPages = [ordered]@{}
$pCount = 0

foreach ($p in $doc.Paragraphs) {
    $pCount++
    $txt = $p.Range.Text.Trim()
    if ($txt.Length -gt 8 -and $txt.StartsWith("Bảng") -and $txt.Contains(":")) {
        $pg = $p.Range.Information([Microsoft.Office.Interop.Word.WdInformation]::wdActiveEndAdjustedPageNumber)
        # MUST BE IN BODY (PAGE >= 15 or in front matter if Bảng 1.1)
        if ($pg -ge 12) {
            $parts = $txt.Split(":")
            $first = $parts[0].Trim()
            if ($first -match "^Bảng\s+[\w\.]+$") {
                if (-not $tblPages.Contains($first)) {
                    $tblPages[$first] = @{
                        Page = $pg
                        Title = $txt
                    }
                    Write-Host "$first => Page $pg"
                }
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
Write-Host "Done! Found " $tblPages.Count " tables in body."
