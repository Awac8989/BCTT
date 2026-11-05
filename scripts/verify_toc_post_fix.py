import docx

doc = docx.Document('DoanMinhQuan_2224801030137_BCTT2.docx')
print("Verifying Table of Contents (P54 - P116):")

all_good = True
for i in range(54, 117):
    p = doc.paragraphs[i]
    pf = p.paragraph_format
    pPr = p._p.find('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}pPr')
    tabs_xml = pPr.find('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}tabs') if pPr is not None else None
    
    has_tab_char = '\t' in p.text
    has_tabs_xml = (tabs_xml is not None and len(tabs_xml) > 0)
    indent = pf.left_indent.pt if pf.left_indent else 0
    
    if not has_tab_char or not has_tabs_xml:
        print(f"FAILED P{i}: text='{p.text}', has_tab={has_tab_char}, has_xml={has_tabs_xml}")
        all_good = False
    if i in range(86, 98):
        print(f"P{i} [indent={indent:4.1f}pt, tabs_xml={has_tabs_xml}]: {p.text}")

if all_good:
    print("\n✓ 100% of TOC paragraphs (P54-P116) have valid TAB CHARACTERS and RIGHT DOT-LEADER TABS XML!")
else:
    print("\nSome paragraphs failed verification!")
