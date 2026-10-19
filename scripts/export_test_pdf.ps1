$word = New-Object -ComObject Word.Application
$word.Visible = $false
try {
    $doc = $word.Documents.Open('Q:\CODE_visual\filebctt\test_borders.docx')
    $doc.ExportAsFixedFormat('Q:\CODE_visual\filebctt\test_borders.pdf', 17)
    $doc.Close([ref]$false)
    Write-Host "Exported test_borders.pdf successfully"
} catch {
    Write-Host ("Export error: " + $_)
} finally {
    $word.Quit()
}
