$word = New-Object -ComObject Word.Application
$word.Visible = $false

$files = @(
    "Q:\CODE_visual\filebctt\HO_SO_CONG_VU_XU_LY_DON_2346_UBND.docx",
    "Q:\CODE_visual\filebctt\01_Bao_Cao_Tham_Dinh_2346.docx",
    "Q:\CODE_visual\filebctt\02_Don_Giai_Trinh_Doan_Minh_Quang.docx",
    "Q:\CODE_visual\filebctt\03_Bien_Ban_Kiem_Tra_Hien_Truong.docx",
    "Q:\CODE_visual\filebctt\04_Cong_Van_Tra_Loi_Giai_Quyet_2346.docx"
)

foreach ($f in $files) {
    try {
        $doc = $word.Documents.Open($f)
        $p = $doc.ComputeStatistics(2)
        $fname = [System.IO.Path]::GetFileName($f)
        Write-Host "$fname -> Pages: $p"
        $doc.Close([ref]$false)
    } catch {
        Write-Host "Error with $f : $_"
    }
}

$word.Quit()
