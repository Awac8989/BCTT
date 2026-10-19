param (
    [string]$docxPath,
    [string]$pdfPath
)

$w = New-Object -ComObject Word.Application
$w.Visible = $false
try {
    $d = $w.Documents.Open($docxPath)
    $d.ExportAsFixedFormat($pdfPath, 17)
    $d.Close([ref]$false)
    Write-Host ("Exported " + $pdfPath + " successfully.")
} catch {
    Write-Host ("Export error: " + $_)
} finally {
    $w.Quit()
}
