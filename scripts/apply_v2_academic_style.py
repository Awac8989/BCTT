import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scripts/build_full_report.py', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update set_cell_background to do nothing (NO SHADING)
old_shd = '''def set_cell_background(cell, color_hex):
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color_hex}"/>')
    cell._tc.get_or_add_tcPr().append(shd)'''

new_shd = '''def set_cell_background(cell, color_hex):
    # Trình bày như văn bản V2: Tuyệt đối không tô màu nền bảng
    pass'''

assert old_shd in content, "set_cell_background not found!"
content = content.replace(old_shd, new_shd)

# 2. Update set_table_borders to black borders (top, bottom, left, right, insideH, insideV)
old_borders = '''def set_table_borders(table, color="CBD5E1", sz="4", val="single"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:left w:val="none"/>'
        f'<w:right w:val="none"/>'
        f'<w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideV w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)'''

new_borders = '''def set_table_borders(table, color="000000", sz="4", val="single"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:left w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:right w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:insideV w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)'''

assert old_borders in content, "set_table_borders not found!"
content = content.replace(old_borders, new_borders)

# 3. Update format_paragraph to V2 standards (indent 1.27cm, line spacing 1.3)
old_fmt_p = '''def format_paragraph(p, space_before=2, space_after=5, line_spacing=1.35, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=1.0):'''
new_fmt_p = '''def format_paragraph(p, space_before=2, space_after=4, line_spacing=1.3, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=1.27):'''
assert old_fmt_p in content, "format_paragraph not found!"
content = content.replace(old_fmt_p, new_fmt_p)

# 4. Update heading colors in add_h1, add_h2, add_h3, add_subhead to pure black
content = content.replace('r.font.color.rgb = RGBColor(0, 45, 98) # Deep Navy', 'r.font.color.rgb = RGBColor(0, 0, 0)')
content = content.replace('r.font.color.rgb = RGBColor(30, 58, 138) # Navy Blue', 'r.font.color.rgb = RGBColor(0, 0, 0)')
content = content.replace('r.font.color.rgb = RGBColor(37, 99, 235) # Royal Blue', 'r.font.color.rgb = RGBColor(0, 0, 0)')
content = content.replace('r.font.color.rgb = RGBColor(30, 41, 59)', 'r.font.color.rgb = RGBColor(0, 0, 0)')
content = content.replace('rt.font.color.rgb = RGBColor(71, 85, 105)', 'rt.font.color.rgb = RGBColor(0, 0, 0)')
content = content.replace('run_cap.font.color.rgb = RGBColor(30, 41, 59)', 'run_cap.font.color.rgb = RGBColor(0, 0, 0)')
content = content.replace('hrun.font.color.rgb = RGBColor(100, 116, 139)', 'hrun.font.color.rgb = RGBColor(0, 0, 0)')
content = content.replace('frun.font.color.rgb = RGBColor(100, 116, 139)', 'frun.font.color.rgb = RGBColor(0, 0, 0)')

# 5. Update add_table_header: NO color, black text, centered, bold
old_tbl_hdr = '''def add_table_header(row, headers, col_widths=None):
    for idx, (title, width) in enumerate(zip(headers, col_widths if col_widths else [None]*len(headers))):
        cell = row.cells[idx]
        set_cell_background(cell, "1F4E79")
        set_cell_margins(cell, top=120, bottom=120, left=140, right=140)
        p = cell.paragraphs[0]
        format_paragraph(p, space_before=2, space_after=2, align=WD_ALIGN_PARAGRAPH.CENTER, first_line_indent=0)
        r = p.add_run(title)
        r.font.name = "Times New Roman"
        r.font.size = Pt(10.5)
        r.font.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)'''

new_tbl_hdr = '''def add_table_header(row, headers, col_widths=None):
    for idx, (title, width) in enumerate(zip(headers, col_widths if col_widths else [None]*len(headers))):
        cell = row.cells[idx]
        set_cell_margins(cell, top=100, bottom=100, left=120, right=120)
        p = cell.paragraphs[0]
        format_paragraph(p, space_before=2, space_after=2, align=WD_ALIGN_PARAGRAPH.CENTER, first_line_indent=0)
        r = p.add_run(title)
        r.font.name = "Times New Roman"
        r.font.size = Pt(10.5)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0, 0, 0)'''

assert old_tbl_hdr in content, "add_table_header not found!"
content = content.replace(old_tbl_hdr, new_tbl_hdr)

# 6. Replace cover page colors to pure black
content = content.replace('r_type.font.color.rgb = RGBColor(0, 45, 98)', 'r_type.font.color.rgb = RGBColor(0, 0, 0)')
content = content.replace('r_t.font.color.rgb = RGBColor(180, 28, 28)', 'r_t.font.color.rgb = RGBColor(0, 0, 0)')
content = content.replace('r_type2.font.color.rgb = RGBColor(0, 45, 98)', 'r_type2.font.color.rgb = RGBColor(0, 0, 0)')
content = content.replace('r_t2.font.color.rgb = RGBColor(180, 28, 28)', 'r_t2.font.color.rgb = RGBColor(0, 0, 0)')

# 7. Replace green text colors in checklist / test cases
content = content.replace('run.font.color.rgb = RGBColor(0, 128, 0)', 'run.font.color.rgb = RGBColor(0, 0, 0)')

# 8. Standardize organization name (remove awkward slashes)
content = content.replace("Phòng Văn hóa và Thông tin / Phòng Văn hóa - Xã hội TP. Thủ Dầu Một", "Phòng Văn hóa và Thông tin thành phố Thủ Dầu Một")
content = content.replace("Phòng Văn hóa - Xã hội / Phòng VH&TT TP. Thủ Dầu Một", "Phòng Văn hóa và Thông tin thành phố Thủ Dầu Một")
content = content.replace("Phòng VH&TT / VH-XH TP. Thủ Dầu Một", "Phòng Văn hóa và Thông tin thành phố Thủ Dầu Một")
content = content.replace("Phòng Văn hóa và Thông tin / Phòng VH-XH TP. Thủ Dầu Một", "Phòng Văn hóa và Thông tin thành phố Thủ Dầu Một")
content = content.replace("Phòng VH&TT TP. Thủ Dầu Một", "Phòng Văn hóa và Thông tin TP. Thủ Dầu Một")

# 9. Clean up awkward phrases in evaluation forms
content = content.replace("triệt tiêu sai số tiền tệ", "triệt tiêu sai số làm tròn số học")

with open('scripts/build_full_report.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Đã cập nhật chuẩn phong cách V2 (không tô màu bảng, không tô màu chữ, viền đen đơn) thành công!")
