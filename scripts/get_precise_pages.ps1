$word = New-Object -ComObject Word.Application
$word.Visible = $false
try {
    $doc = $word.Documents.Open("Q:\CODE_visual\filebctt\BAO_CAO_THUC_TAP_100_TRANG_DOAN_MINH_QUAN.docx", $false, $true)
    $pages = $doc.ComputeStatistics(2)
    Write-Host "DOCX Total Pages: $pages"
    
    # Get headings page numbers
    $headings = @(
        "MỞ ĐẦU",
        "CHƯƠNG 1",
        "CHƯƠNG 2",
        "CHƯƠNG 3",
        "CHƯƠNG 4",
        "CHƯƠNG 5",
        "CHƯƠNG 6",
        "CHƯƠNG 7",
        "TÀI LIỆU THAM KHẢO",
        "PHỤ LỤC"
    )
    
    foreach ($p in $doc.Paragraphs) {
        $t = $p.Range.Text.Trim()
        foreach ($h in $headings) {
            if ($t.StartsWith($h)) {
                $pg = $p.Range.Information(3) # 3 = wdActiveEndPageNumber
                Write-Host "Heading [$t] -> Page $pg"
                break
            }
        }
    }
    
    $doc.Close([ref]$false)
} catch {
    Write-Host "Error: $_"
} finally {
    $word.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
}
