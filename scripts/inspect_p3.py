import sys
sys.stdout.reconfigure(encoding='utf-8')
import docx

doc = docx.Document('V2_DoamMinhQuan_2224801030137_BCTT (2).docx')
p = doc.paragraphs[3]
with open('p3_xml.xml', 'w', encoding='utf-8') as f:
    f.write(p._p.xml)
print("Saved p3_xml.xml successfully, length:", len(p._p.xml))
