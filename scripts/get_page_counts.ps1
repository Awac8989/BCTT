$word = New-Object -ComObject Word.Application
$word.Visible = $false
try {
    $doc = $word.Documents.Open("Q:\CODE_visual\filebctt\V2_DoamMinhQuan_2224801030137_BCTT (2).docx")
    $p1 = $doc.ComputeStatistics(2)
    Write-Host "V2 Page Count: $p1"
    $doc.Close([ref]$false)
} catch {
    Write-Host "Error V2: $_"
}

try {
    $doc3 = $word.Documents.Open("Q:\CODE_visual\filebctt\BAO_CAO_THUC_TAP_DOAN_MINH_QUAN_BAN_IN_CHUAN.docx")
    $p3 = $doc3.ComputeStatistics(2)
    Write-Host "BAN_IN_CHUAN Page Count: $p3"
    $doc3.Close([ref]$false)
} catch {
    Write-Host "Error BAN_IN_CHUAN: $_"
}


$word.Quit()
