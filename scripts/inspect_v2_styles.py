import docx
import sys

sys.stdout.reconfigure(encoding='utf-8')

doc = docx.Document("V2_DoamMinhQuan_2224801030137_BCTT (2).docx")

print(f"Total Paragraphs: {len(doc.paragraphs)}")
print(f"Total Tables: {len(doc.tables)}")

# Inspect sections
for s_idx, sec in enumerate(doc.sections):
    print(f"\n--- Section {s_idx} ---")
    print(f"Page Width: {sec.page_width.cm} cm, Height: {sec.page_height.cm} cm")
    print(f"Margins - Top: {sec.top_margin.cm} cm, Bottom: {sec.bottom_margin.cm} cm, Left: {sec.left_margin.cm} cm, Right: {sec.right_margin.cm} cm")
    print(f"Header distance: {sec.header_distance.cm} cm, Footer distance: {sec.footer_distance.cm} cm")
    if sec.header:
        h_text = "\n".join([p.text.strip() for p in sec.header.paragraphs if p.text.strip()])
        print(f"Header Text: {repr(h_text)}")
    if sec.footer:
        f_text = "\n".join([p.text.strip() for p in sec.footer.paragraphs if p.text.strip()])
        print(f"Footer Text: {repr(f_text)}")

# Sample paragraphs and their formatting
print("\n--- Sample Paragraphs & Headings ---")
for idx, p in enumerate(doc.paragraphs[:60]):
    t = p.text.strip()
    if t:
        r_info = []
        for r in p.runs[:3]:
            font_name = r.font.name or "Inherited"
            font_size = r.font.size.pt if r.font.size else "Inherited"
            bold = r.font.bold
            color = r.font.color.rgb if (r.font.color and r.font.color.rgb) else "Default/Auto"
            r_info.append(f"font={font_name}, size={font_size}, bold={bold}, color={color}")
        print(f"P{idx} [{p.style.name}] (Align={p.alignment}, Sb={p.paragraph_format.space_before}, Sa={p.paragraph_format.space_after}, Ls={p.paragraph_format.line_spacing}): {t[:70]} | Runs: {', '.join(r_info[:2])}")

# Inspect tables
print("\n--- Tables in V2 ---")
for t_idx, tbl in enumerate(doc.tables[:5]):
    print(f"\nTable {t_idx} (rows: {len(tbl.rows)}, cols: {len(tbl.columns)})")
    # inspect cell shading and borders of first row
    r0 = tbl.rows[0]
    c0 = r0.cells[0]
    # check xml of cell 0
    tcPr = c0._tc.tcPr
    shd = tcPr.find(docx.oxml.ns.qn('w:shd')) if tcPr is not None else None
    shd_val = shd.attrib if shd is not None else "None"
    print(f"  Cell 0 Shading: {shd_val}")
    print(f"  Cell 0 Text: {c0.text.strip()[:40]}")
    # inspect font of cell 0
    if c0.paragraphs and c0.paragraphs[0].runs:
        r = c0.paragraphs[0].runs[0]
        print(f"  Cell 0 Font: name={r.font.name}, size={r.font.size.pt if r.font.size else 'N/A'}, bold={r.font.bold}, color={r.font.color.rgb if r.font.color else 'Auto'}")
