$ErrorActionPreference = "Stop"
$output = @()
try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $word.DisplayAlerts = 0
    $docPath = "Q:\CODE_visual\filebctt\BAO_CAO_THUC_TAP_100_TRANG_DOAN_MINH_QUAN.docx"
    $doc = $word.Documents.Open($docPath, [System.Reflection.Missing]::Value, $true)
    $pages = $doc.ComputeStatistics(2)
    $output += "TOTAL_PAGES:$pages"
    
    $pCount = $doc.Paragraphs.Count
    for ($i = 1; $i -le $pCount; $i++) {
        $p = $doc.Paragraphs.Item($i)
        $txt = $p.Range.Text.Trim().Trim([char]13).Trim([char]7).Trim()
        if ([string]::IsNullOrWhiteSpace($txt)) { continue }
        
        # Check if heading or target
        $isMatch = $false
        if ($txt.StartsWith("CHƯƠNG ") -or 
            $txt.StartsWith("MỞ ĐẦU") -or 
            $txt.StartsWith("TÀI LIỆU THAM KHẢO") -or 
            $txt.StartsWith("PHỤ LỤC") -or 
            $txt.StartsWith("NHẬT KÝ THỰC TẬP") -or 
            $txt.StartsWith("PHIẾU NHẬN XÉT") -or 
            $txt.StartsWith("PHIẾU ĐÁNH GIÁ") -or 
            $txt.StartsWith("BẢNG ĐÁNH GIÁ CHUẨN ĐẦU RA") -or 
            $txt.StartsWith("LỜI CẢM ƠN") -or 
            $txt.StartsWith("DANH MỤC ") -or 
            $txt.StartsWith("Hình ") -or 
            $txt.StartsWith("Bảng ") -or 
            $txt -match "^\d+\.\d+(\.\d+)*\.\s+") {
            $isMatch = $true
        }
        
        if ($isMatch -and $txt.Length -lt 150) {
            $pg = $p.Range.Information(3) # wdActiveEndPageNumber
            $output += "PG:$pg|$txt"
        }
    }
    
    $doc.Close([ref]$false)
} catch {
    $output += "ERROR: $($_.Exception.Message)"
} finally {
    if ($word) {
        $word.Quit()
        [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
    }
}

$output | Out-File -FilePath "Q:\CODE_visual\filebctt\scripts\exact_pages_dump.txt" -Encoding utf8
Write-Output "Extracted $($output.Count) entries to exact_pages_dump.txt"
