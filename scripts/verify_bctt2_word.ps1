$word = New-Object -ComObject Word.Application
$word.Visible = $false
try {
    $doc = $word.Documents.Open('Q:\CODE_visual\filebctt\docs\DoanMinhQuan_2224801030137_BCTT2.docx')
    $pages = $doc.ComputeStatistics(2)
    Write-Host ("Word opened DoanMinhQuan_2224801030137_BCTT2.docx successfully! Sections: " + $doc.Sections.Count + " Pages: " + $pages + " InlineShapes: " + $doc.InlineShapes.Count)
    $doc.Close([ref]$false)
} catch {
    Write-Host ("Word error: " + $_)
} finally {
    $word.Quit()
}
