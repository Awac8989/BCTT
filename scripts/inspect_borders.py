import sys
sys.stdout.reconfigure(encoding='utf-8')
import docx
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

for path in ['Mau Bao Cao_Thực Tập.docx', 'V2_DoamMinhQuan_2224801030137_BCTT (2).docx', 'BAO_CAO_THUC_TAP_100_TRANG_DOAN_MINH_QUAN.docx']:
    try:
        doc = docx.Document(path)
        print("="*40)
        print("FILE:", path)
        print("Sections:", len(doc.sections))
        for i, s in enumerate(doc.sections):
            print(f"  Section {i}: Top={s.top_margin.cm:.2f}cm, Bottom={s.bottom_margin.cm:.2f}cm, Left={s.left_margin.cm:.2f}cm, Right={s.right_margin.cm:.2f}cm")
            sectPr = s._sectPr
            pgBorders = sectPr.find(qn('w:pgBorders'))
            if pgBorders is not None:
                print("    pgBorders attributes:", pgBorders.attrib)
                for border in pgBorders:
                    print(f"      {border.tag}: val={border.get(qn('w:val'))}, sz={border.get(qn('w:sz'))}, color={border.get(qn('w:color'))}, space={border.get(qn('w:space'))}")
            else:
                print("    pgBorders: None")
    except Exception as e:
        print("Error reading", path, e)
