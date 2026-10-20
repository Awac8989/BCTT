$files = @(
    '01_Bien_Ban_Lam_Viec_21_10_2026',
    '02_Bien_Ban_Kiem_Tra_Hien_Truong',
    '03_Cong_Van_PKTHTDT_Thao_Do_Cap_Vien_Thong',
    '04_Cong_Van_UBND_Tra_Loi_Don_2346'
)

$w = New-Object -ComObject Word.Application
$w.Visible = $false
try {
    foreach ($f in $files) {
        $inPath = "q:\CODE_visual\filebctt\$f.docx"
        $outPath = "q:\CODE_visual\filebctt\$f.pdf"
        $d = $w.Documents.Open($inPath)
        $d.ExportAsFixedFormat($outPath, 17)
        $d.Close([ref]$false)
        Write-Host "Exported: $f.pdf"
    }
} finally {
    $w.Quit()
}
