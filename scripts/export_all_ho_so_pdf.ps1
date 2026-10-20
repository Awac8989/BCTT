$word = New-Object -ComObject Word.Application
$word.Visible = $false

$docList = @(
    "01_Bao_Cao_Tham_Dinh_2346",
    "02_Don_Giai_Trinh_Doan_Minh_Quang",
    "03_Bien_Ban_Kiem_Tra_Hien_Truong",
    "04_Cong_Van_Tra_Loi_Giai_Quyet_2346"
)

foreach ($name in $docList) {
    try {
        $docxPath = "Q:\CODE_visual\filebctt\$name.docx"
        $pdfPath = "Q:\CODE_visual\filebctt\$name.pdf"
        $doc = $word.Documents.Open($docxPath)
        $doc.ExportAsFixedFormat($pdfPath, 17)
        $doc.Close([ref]$false)
        Write-Host "Exported $pdfPath successfully."
    } catch {
        Write-Host "Error exporting $name : $_"
    }
}

$word.Quit()
