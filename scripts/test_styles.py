import sys
sys.stdout.reconfigure(encoding='utf-8')
import docx
from docx.shared import Inches, Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

def set_page_borders(section, color="002060", val="double", sz="18", space="20"):
    sectPr = section._sectPr
    existing = sectPr.find(qn('w:pgBorders'))
    if existing is not None:
        sectPr.remove(existing)
        
    pgBorders = OxmlElement('w:pgBorders')
    pgBorders.set(qn('w:offsetFrom'), 'page')
    for side in ['top', 'left', 'bottom', 'right']:
        b = OxmlElement(f'w:{side}')
        b.set(qn('w:val'), val)
        b.set(qn('w:sz'), str(sz))
        b.set(qn('w:space'), str(space))
        b.set(qn('w:color'), color)
        pgBorders.append(b)
    sectPr.append(pgBorders)

doc = docx.Document()

styles_to_test = [
    ("double", "18", "double sz=18"),
    ("triple", "18", "triple sz=18"),
    ("thinThickMediumGap", "24", "thinThickMediumGap sz=24"),
    ("thickThinMediumGap", "24", "thickThinMediumGap sz=24"),
]

for idx, (val, sz, title) in enumerate(styles_to_test):
    if idx == 0:
        s = doc.sections[0]
    else:
        s = doc.add_section(docx.enum.section.WD_SECTION.NEW_PAGE)
    s.top_margin = Cm(2.0)
    s.bottom_margin = Cm(2.0)
    s.left_margin = Cm(3.0)
    s.right_margin = Cm(2.0)
    set_page_borders(s, color="002060", val=val, sz=sz, space="20")
    p = doc.add_paragraph(f"Test Border Style: {title}")
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER

doc.save("test_border_styles.docx")
print("Saved test_border_styles.docx")
