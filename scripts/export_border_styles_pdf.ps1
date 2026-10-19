$w = New-Object -ComObject Word.Application
$w.Visible = $false
try {
    $d = $w.Documents.Open('Q:\CODE_visual\filebctt\test_border_styles.docx')
    $d.ExportAsFixedFormat('Q:\CODE_visual\filebctt\test_border_styles.pdf', 17)
    $d.Close([ref]$false)
    Write-Host "Exported test_border_styles.pdf"
} catch {
    Write-Host ("Export error: " + $_)
} finally {
    $w.Quit()
}
