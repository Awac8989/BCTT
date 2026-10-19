$word = New-Object -ComObject Word.Application
$word.Visible = $false
try {
    $doc = $word.Documents.Open('Q:\CODE_visual\filebctt\test_borders.docx')
    Write-Host ("Word opened test_borders.docx successfully! Sections: " + $doc.Sections.Count)
    $doc.Close([ref]$false)
} catch {
    Write-Host ("Word error: " + $_)
} finally {
    $word.Quit()
}
