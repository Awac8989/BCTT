# -*- coding: utf-8 -*-
"""
Script tạo file Word hoàn chỉnh:
HỒ SƠ NGHIỆP VỤ CÔNG VỤ VÀ BỘ 04 VĂN BẢN HÀNH CHÍNH XỬ LÝ ĐƠN PHẢN ÁNH SỐ 2346/UBND
(Chuẩn thể thức và kỹ thuật trình bày theo Nghị định số 30/2020/NĐ-CP của Chính phủ)
"""

import os
import sys
import docx

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

from docx.shared import Inches, Pt, RGBColor, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

def set_font(run, font_name="Times New Roman", size_pt=13, bold=False, italic=False, color_rgb=(0,0,0)):
    run.font.name = font_name
    run.font.size = Pt(size_pt)
    run.bold = bold
    run.italic = italic
    run.font.color.rgb = RGBColor(*color_rgb)
    rPr = run._r.get_or_add_rPr()
    rFonts = parse_xml(f'<w:rFonts {nsdecls("w")} w:ascii="{font_name}" w:hAnsi="{font_name}" w:cs="{font_name}"/>')
    rPr.append(rFonts)

def set_para_format(p, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=0, space_after=3, line_spacing=1.15, first_indent=0, left_indent=0):
    p.alignment = align
    pf = p.paragraph_format
    pf.space_before = Pt(space_before)
    pf.space_after = Pt(space_after)
    pf.line_spacing = line_spacing
    pf.first_line_indent = Cm(first_indent) if first_indent else Cm(0)
    pf.left_indent = Cm(left_indent) if left_indent else Cm(0)

def set_table_borders_none(table):
    tblPr = table._tbl.tblPr
    tblBorders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="none"/>'
        f'<w:left w:val="none"/>'
        f'<w:bottom w:val="none"/>'
        f'<w:right w:val="none"/>'
        f'<w:insideH w:val="none"/>'
        f'<w:insideV w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(tblBorders)

def set_cell_margins(cell, top=0, bottom=40, left=0, right=0):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tcPr.append(tcMar)

def set_page_setup(section):
    # Khổ giấy A4 chuẩn: 210 x 297 mm
    section.page_width = Cm(21.0)
    section.page_height = Cm(29.7)
    # Lề: trên 2cm, dưới 2cm, trái 3cm, phải 1.5cm chuẩn Nghị định 30/2020/NĐ-CP
    section.top_margin = Cm(2.0)
    section.bottom_margin = Cm(2.0)
    section.left_margin = Cm(3.0)
    section.right_margin = Cm(1.5)

def add_header_table(doc, org_line1, org_line2, doc_num, date_str, is_cong_van=False, trich_yeu_cv=""):
    """Tạo bảng tiêu ngữ và cơ quan ban hành chuẩn Nghị định 30/2020/NĐ-CP"""
    table = doc.add_table(rows=1, cols=2)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders_none(table)
    
    col_w_left = Cm(7.2)
    col_w_right = Cm(9.3)
    
    row = table.rows[0]
    cell_left = row.cells[0]
    cell_right = row.cells[1]
    cell_left.width = col_w_left
    cell_right.width = col_w_right
    set_cell_margins(cell_left, top=0, bottom=20, left=0, right=10)
    set_cell_margins(cell_right, top=0, bottom=20, left=10, right=0)
    
    # Left column: Cơ quan ban hành & Số ký hiệu
    p_org = cell_left.paragraphs[0]
    set_para_format(p_org, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=1, line_spacing=1.0)
    if org_line1 and org_line2:
        r1 = p_org.add_run(org_line1 + "\n")
        set_font(r1, size_pt=12, bold=False)
        r2 = p_org.add_run(org_line2)
        set_font(r2, size_pt=12, bold=True)
        
        # Đường kẻ ngang dưới tên cơ quan
        p_line_org = cell_left.add_paragraph()
        set_para_format(p_line_org, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=2, line_spacing=1.0)
        r_line1 = p_line_org.add_run("──────────")
        set_font(r_line1, size_pt=9, bold=True)
    elif org_line1 and not org_line2:
        # Chỉ có 1 cơ quan (Ví dụ: ỦY BAN NHÂN DÂN PHƯỜNG THỦ DẦU MỘT)
        r1 = p_org.add_run(org_line1)
        set_font(r1, size_pt=12, bold=True)
        p_line_org = cell_left.add_paragraph()
        set_para_format(p_line_org, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=2, line_spacing=1.0)
        r_line1 = p_line_org.add_run("──────────")
        set_font(r_line1, size_pt=9, bold=True)
        
    # Số ký hiệu
    if doc_num:
        p_num = cell_left.add_paragraph()
        set_para_format(p_num, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=2, space_after=1, line_spacing=1.0)
        r_num = p_num.add_run(doc_num)
        set_font(r_num, size_pt=12, bold=False)
        
    # Nếu là công văn có trích yếu dưới số ký hiệu
    if is_cong_van and trich_yeu_cv:
        p_ty = cell_left.add_paragraph()
        set_para_format(p_ty, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=2, space_after=0, line_spacing=1.0)
        r_ty = p_ty.add_run(trich_yeu_cv)
        set_font(r_ty, size_pt=10.5, bold=False, italic=True)

    # Right column: Quốc hiệu & Tiêu ngữ & Ngày tháng
    p_qh = cell_right.paragraphs[0]
    set_para_format(p_qh, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=1, line_spacing=1.0)
    rqh1 = p_qh.add_run("CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\n")
    set_font(rqh1, size_pt=12, bold=True)
    rqh2 = p_qh.add_run("Độc lập - Tự do - Hạnh phúc")
    set_font(rqh2, size_pt=13, bold=True)
    
    p_line_qh = cell_right.add_paragraph()
    set_para_format(p_line_qh, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=2, line_spacing=1.0)
    r_line2 = p_line_qh.add_run("─────────────────")
    set_font(r_line2, size_pt=9, bold=True)
    
    if date_str:
        p_date = cell_right.add_paragraph()
        set_para_format(p_date, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=2, space_after=0, line_spacing=1.0)
        r_date = p_date.add_run(date_str)
        set_font(r_date, size_pt=13, italic=True)

    p_spacer = doc.add_paragraph()
    set_para_format(p_spacer, space_before=0, space_after=3, line_spacing=1.0)
    return table

def add_doc_title(doc, title, subtitle=""):
    p_t = doc.add_paragraph()
    set_para_format(p_t, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=8, space_after=2, line_spacing=1.15)
    r_t = p_t.add_run(title)
    set_font(r_t, size_pt=14, bold=True)
    
    if subtitle:
        p_st = doc.add_paragraph()
        set_para_format(p_st, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=1, space_after=8, line_spacing=1.15)
        r_st = p_st.add_run(subtitle)
        set_font(r_st, size_pt=12, italic=True, bold=False)

def add_kinh_gui(doc, lines):
    p = doc.add_paragraph()
    set_para_format(p, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=6, space_after=4, line_spacing=1.15, first_indent=0)
    r_kg = p.add_run("Kính gửi: ")
    set_font(r_kg, size_pt=13, bold=True)
    
    if len(lines) == 1:
        r_txt = p.add_run(lines[0])
        set_font(r_txt, size_pt=13, bold=False)
    else:
        for idx, line in enumerate(lines):
            if idx > 0:
                p_sub = doc.add_paragraph()
                set_para_format(p_sub, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=2, space_after=2, line_spacing=1.15, first_indent=0, left_indent=1.8)
                r_dash = p_sub.add_run("- ")
                set_font(r_dash, size_pt=13, bold=True)
                r_txt = p_sub.add_run(line)
                set_font(r_txt, size_pt=13, bold=False)
            else:
                r_dash = p.add_run("- ")
                set_font(r_dash, size_pt=13, bold=True)
                r_txt = p.add_run(line)
                set_font(r_txt, size_pt=13, bold=False)

def add_heading_I(doc, text):
    p = doc.add_paragraph()
    set_para_format(p, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=7, space_after=3, line_spacing=1.15, first_indent=0)
    r = p.add_run(text)
    set_font(r, size_pt=13, bold=True)

def add_heading_1(doc, text):
    p = doc.add_paragraph()
    set_para_format(p, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=5, space_after=2, line_spacing=1.15, first_indent=0)
    r = p.add_run(text)
    set_font(r, size_pt=13, bold=True)

def add_body_p(doc, text, bold_prefix="", italic_prefix=""):
    p = doc.add_paragraph()
    set_para_format(p, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=0, space_after=3, line_spacing=1.15, first_indent=1.25)
    if bold_prefix:
        r_bp = p.add_run(bold_prefix)
        set_font(r_bp, size_pt=13, bold=True)
    if italic_prefix:
        r_ip = p.add_run(italic_prefix)
        set_font(r_ip, size_pt=13, italic=True)
    r_txt = p.add_run(text)
    set_font(r_txt, size_pt=13, bold=False)

def add_bullet_p(doc, text, bold_prefix="", italic_prefix="", bullet_char="• "):
    p = doc.add_paragraph()
    set_para_format(p, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=0, space_after=2, line_spacing=1.15, first_indent=0, left_indent=0.8)
    r_bullet = p.add_run(bullet_char)
    set_font(r_bullet, size_pt=12, bold=True)
    if bold_prefix:
        r_bp = p.add_run(bold_prefix)
        set_font(r_bp, size_pt=13, bold=True)
    if italic_prefix:
        r_ip = p.add_run(italic_prefix)
        set_font(r_ip, size_pt=13, italic=True)
    r_txt = p.add_run(text)
    set_font(r_txt, size_pt=13, bold=False)

def add_num_item_p(doc, num_str, text, bold_prefix="", italic_prefix=""):
    p = doc.add_paragraph()
    set_para_format(p, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=1, space_after=2, line_spacing=1.15, first_indent=0, left_indent=0.8)
    r_num = p.add_run(num_str + " ")
    set_font(r_num, size_pt=13, bold=True)
    if bold_prefix:
        r_bp = p.add_run(bold_prefix)
        set_font(r_bp, size_pt=13, bold=True)
    if italic_prefix:
        r_ip = p.add_run(italic_prefix)
        set_font(r_ip, size_pt=13, italic=True)
    r_txt = p.add_run(text)
    set_font(r_txt, size_pt=13, bold=False)

# ==================== TRANG BÌA HỒ SƠ ====================
def build_cover_page(doc):
    cover_table = doc.add_table(rows=1, cols=1)
    cover_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    
    tblPr = cover_table._tbl.tblPr
    tblBorders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="double" w:sz="18" w:space="0" w:color="1B365D"/>'
        f'<w:left w:val="double" w:sz="18" w:space="0" w:color="1B365D"/>'
        f'<w:bottom w:val="double" w:sz="18" w:space="0" w:color="1B365D"/>'
        f'<w:right w:val="double" w:sz="18" w:space="0" w:color="1B365D"/>'
        f'<w:insideH w:val="none"/>'
        f'<w:insideV w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(tblBorders)
    
    cell = cover_table.rows[0].cells[0]
    cell.width = Cm(16.5)
    set_cell_margins(cell, top=200, bottom=200, left=200, right=200)
    
    p0 = cell.paragraphs[0]
    set_para_format(p0, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=10, space_after=2, line_spacing=1.15)
    r0_1 = p0.add_run("ỦY BAN NHÂN DÂN PHƯỜNG THỦ DẦU MỘT\n")
    set_font(r0_1, size_pt=13, bold=False)
    r0_2 = p0.add_run("PHÒNG KINH TẾ, HẠ TẦNG VÀ ĐÔ THỊ\n")
    set_font(r0_2, size_pt=13, bold=True)
    r0_line = p0.add_run("━━━━━━━━━━━━━━━━━━━\n\n\n")
    set_font(r0_line, size_pt=11, bold=True, color_rgb=(27, 54, 93))
    
    r_title1 = p0.add_run("HỒ SƠ CÔNG VỤ\n")
    set_font(r_title1, size_pt=24, bold=True, color_rgb=(27, 54, 93))
    r_title2 = p0.add_run("QUY TRÌNH NGHIỆP VỤ & BỘ VĂN BẢN HÀNH CHÍNH\nXỬ LÝ ĐƠN PHẢN ÁNH SỐ 2346/UBND\n")
    set_font(r_title2, size_pt=15, bold=True, color_rgb=(180, 20, 20))
    r_title3 = p0.add_run("(V/v: Phản ánh của bà Nguyễn Thị Mộng Đẹp đối với hộ ông Đoàn Minh Quang tại thửa đất số 225 và 220, tờ bản đồ số 20, phường Thủ Dầu Một)\n\n\n")
    set_font(r_title3, size_pt=12, italic=True)
    
    p_info = cell.add_paragraph()
    set_para_format(p_info, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=6, space_after=6, line_spacing=1.2, left_indent=0.5)
    r_inf_t = p_info.add_run("THÔNG TIN HỒ SƠ CÔNG VỤ:\n")
    set_font(r_inf_t, size_pt=12, bold=True, color_rgb=(27, 54, 93))
    
    items = [
        ("Mã số thụ lý đơn:", " Số đến 2346, ngày 15/10/2026"),
        ("Cơ quan chủ trì giải quyết:", " Phòng Kinh tế, Hạ tầng và Đô thị phường Thủ Dầu Một"),
        ("Cơ quan phối hợp:", " Văn phòng HĐND - UBND phường, BĐH Khu phố Chánh Nghĩa 8"),
        ("Người phản ánh:", " Bà Nguyễn Thị Mộng Đẹp (Chủ sử dụng thửa đất số 225, TBĐ số 20)"),
        ("Người bị phản ánh:", " Ông Đoàn Minh Quang (Chủ sử dụng thửa đất số 220, TBĐ số 20)"),
        ("Căn cứ làm việc:", " Thư mời ngày 17/10/2026 của Văn phòng HĐND - UBND phường"),
        ("Thời gian làm việc:", " 15 giờ 00 phút, ngày 21/10/2026 tại Trụ sở tiếp công dân"),
        ("Chuẩn thể thức trình bày:", " Nghị định số 30/2020/NĐ-CP của Chính phủ")
    ]
    for lbl, val in items:
        p_item = cell.add_paragraph()
        set_para_format(p_item, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=1, space_after=1, line_spacing=1.15, left_indent=0.8)
        r_lbl = p_item.add_run("• " + lbl)
        set_font(r_lbl, size_pt=11, bold=True)
        r_val = p_item.add_run(val)
        set_font(r_val, size_pt=11, bold=False)
        
    p_ml = cell.add_paragraph()
    set_para_format(p_ml, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=10, space_after=4, line_spacing=1.2, left_indent=0.5)
    r_ml_t = p_ml.add_run("HỆ THỐNG VĂN BẢN TRONG HỒ SƠ:\n")
    set_font(r_ml_t, size_pt=12, bold=True, color_rgb=(27, 54, 93))
    
    docs_list = [
        "PHẦN I: Trình tự nghiệp vụ giải quyết hồ sơ của Chuyên viên Phòng Kinh tế, Hạ tầng và Đô thị (4 Bước)",
        "VĂN BẢN 01: Biên bản làm việc ngày 21/10/2026 tại Trụ sở tiếp công dân phường Thủ Dầu Một",
        "VĂN BẢN 02: Biên bản kiểm tra hiện trường kỹ thuật của Phòng Kinh tế, Hạ tầng và Đô thị",
        "VĂN BẢN 03: Công văn của Phòng KT, HT & ĐT đôn đốc đơn vị viễn thông thu dọn, tháo dỡ cáp",
        "VĂN BẢN 04: Công văn của UBND phường Thủ Dầu Một trả lời Đơn phản ánh số 2346"
    ]
    for idx, d in enumerate(docs_list):
        p_d = cell.add_paragraph()
        set_para_format(p_d, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=1, space_after=2, line_spacing=1.15, left_indent=0.8)
        r_d = p_d.add_run(f"[{idx+1}] ")
        set_font(r_d, size_pt=11, bold=True)
        r_dt = p_d.add_run(d)
        set_font(r_dt, size_pt=11, bold=False)
        
    p_foot = cell.add_paragraph()
    set_para_format(p_foot, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=24, space_after=10, line_spacing=1.15)
    r_foot = p_foot.add_run("HỒ SƠ LƯU TRỮ VĂN THƯ NĂM 2026 – BẢO QUẢN THEO CHẾ ĐỘ QUY ĐỊNH\nThành phố Hồ Chí Minh, tháng 10 năm 2026")
    set_font(r_foot, size_pt=11, italic=True, bold=True, color_rgb=(100, 100, 100))

# ==================== PHẦN MỞ ĐẦU & PHẦN I ====================
def build_phan_1(doc):
    # Lời dẫn mở đầu
    p_lead = doc.add_paragraph()
    set_para_format(p_lead, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=6, space_after=6, line_spacing=1.2, first_indent=1.25)
    r_lead = p_lead.add_run(
        "Dưới góc độ 100% nghiệp vụ công vụ của Chuyên viên Phòng Kinh tế, Hạ tầng và Đô thị phường Thủ Dầu Một, Thành phố Hồ Chí Minh "
        "khi được phân công thụ lý hồ sơ Đơn phản ánh của bà Nguyễn Thị Mộng Đẹp (Số đến: 2346, ngày 15/10/2026) "
        "và tham gia buổi làm việc theo Thư mời ngày 17/10/2026 của Văn phòng HĐND - UBND phường, "
        "toàn bộ trình tự giải quyết và hệ thống văn bản hành chính được thực hiện như sau:"
    )
    set_font(r_lead, size_pt=13, bold=True, italic=True)
    
    # Tiêu đề PHẦN I
    p_sec1 = doc.add_paragraph()
    set_para_format(p_sec1, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=12, space_after=6, line_spacing=1.2)
    r_sec1 = p_sec1.add_run("PHẦN I\nTRÌNH TỰ NGHIỆP VỤ GIẢI QUYẾT HỒ SƠ CỦA CHUYÊN VIÊN\nPHÒNG KINH TẾ, HẠ TẦNG VÀ ĐÔ THỊ")
    set_font(r_sec1, size_pt=14, bold=True, color_rgb=(27, 54, 93))
    
    # Kẻ phân cách ngắn
    p_line = doc.add_paragraph()
    set_para_format(p_line, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=8, line_spacing=1.0)
    r_l = p_line.add_run("━━━━━━━━━━━━━━━━━━━")
    set_font(r_l, size_pt=10, bold=True, color_rgb=(27, 54, 93))
    
    # Bước 1
    add_heading_1(doc, "1. Bước 1: Nghiên cứu, thẩm tra hồ sơ chuyên môn trước buổi tiếp công dân ngày 21/10/2026")
    add_body_p(
        doc,
        "Căn cứ Thư mời do Phó Chánh Văn phòng Nguyễn Hữu Học ký ngày 17/10/2026, buổi làm việc được ấn định vào lúc 15 giờ 00 phút, "
        "ngày 21/10/2026 (Thứ Tư) tại Trụ sở tiếp công dân phường Thủ Dầu Một (số 01, đường Quang Trung, phường Thủ Dầu Một, TP. Hồ Chí Minh) "
        "với sự tham gia của bà Nguyễn Thị Mộng Đẹp, ông Đoàn Minh Quang và ông Lê Thanh Liêm – Trưởng Ban điều hành khu phố Chánh Nghĩa 8."
    )
    add_body_p(
        doc,
        "Trước khi tham dự buổi làm việc, Chuyên viên Phòng Kinh tế, Hạ tầng và Đô thị lập báo cáo thẩm tra kỹ thuật dựa trên 11 trang hồ sơ Đơn số 2346:"
    )
    
    # Thẩm tra pháp lý quy hoạch - địa chính
    add_bullet_p(doc, "", bold_prefix="Thẩm tra pháp lý quy hoạch – địa chính và trật tự xây dựng tại thửa đất số 225:", bullet_char="• ")
    add_bullet_p(
        doc,
        "Bà Nguyễn Thị Mộng Đẹp (sinh ngày 18/03/1962, CCCD số 074162000264 cấp ngày 25/03/2021) là người sử dụng thửa đất số 225, "
        "tờ bản đồ số 20, diện tích 277,3m² (gồm 160,0m² đất ở tại đô thị và 117,3m² đất trồng cây lâu năm) theo Giấy chứng nhận số AA 08063500 "
        "(Số vào sổ: CN19343) do Chi nhánh Văn phòng Đăng ký đất đai Số 23 cấp ngày 07/6/2026.",
        bullet_char="   - "
    )
    add_bullet_p(
        doc,
        'Tại Mục 3 Giấy chứng nhận số AA 08063500 ghi nhận: "3. Thông tin tài sản gắn liền với đất: -/-" '
        '(chưa có công trình xây dựng được chứng nhận quyền sở hữu trên đất).',
        bullet_char="   - "
    )
    add_bullet_p(
        doc,
        'Tại Mục 4 (Sơ đồ thửa đất) thể hiện cạnh ranh giới phía Nam từ điểm số 2 đến điểm số 3 dài 36,34m tiếp giáp thửa đất số 220 của ông Đoàn Minh Quang; '
        'phía Đông Nam tại điểm ranh số 2 tiếp giáp "Lối đi 2.5m" nối thông ra "Đường bê tông".',
        bullet_char="   - "
    )
    add_bullet_p(
        doc,
        "Đối chiếu hình ảnh hiện trạng do bà Đẹp cung cấp, trên thửa đất số 225 hiện có công trình khung sắt, vách tôn, mái tôn xây dựng áp sát tường gạch ranh giới tiếp giáp thửa đất số 220.",
        bullet_char="   - "
    )
    
    # Thẩm tra kỹ thuật hệ thống đường dây
    add_bullet_p(doc, "", bold_prefix="Thẩm tra kỹ thuật hệ thống đường dây dẫn trong hồ sơ ảnh chụp:", bullet_char="• ")
    add_body_p(
        doc,
        "Qua phân tích 05 trang hình ảnh hiện trạng đính kèm đơn, Chuyên viên kỹ thuật bóc tách thành 02 hệ thống đường dây có bản chất pháp lý và chủ sở hữu khác nhau:"
    )
    add_num_item_p(
        doc,
        "1.",
        "Các bó dây cáp màu đen tiết diện lớn đi thành chùm trên khoảng không phía trên mái tôn và cuộn cáp dự phòng buộc cố định trên thân trụ bê tông sát hàng rào lưới B40 có khóa là cáp viễn thông của các nhà mạng phục vụ trạm BTS, không phải dây điện sinh hoạt hộ gia đình.",
        italic_prefix="Hệ thống cáp viễn thông: "
    )
    add_num_item_p(
        doc,
        "2.",
        "Đường dây dẫn đi trên trụ sắt hộp gắn sứ cách điện màu trắng đặt dọc theo đỉnh tường rào gạch ranh giới và hướng ra Lối đi 2,5m. Trong ảnh chụp, dây dẫn điện này được căng trên sứ cách điện trên cao, không nằm đè hoặc tiếp xúc trực tiếp lên bề mặt mái tôn của thửa đất số 225.",
        italic_prefix="Hệ thống dây điện sinh hoạt hạ thế sau công tơ: "
    )
    
    # Bước 2
    add_heading_1(doc, "2. Bước 2: Tác nghiệp tại buổi làm việc lúc 15 giờ 00 phút ngày 21/10/2026 (Tại số 01 Quang Trung)")
    add_body_p(
        doc,
        "Tại Trụ sở tiếp công dân phường Thủ Dầu Một, Chuyên viên Phòng Kinh tế, Hạ tầng và Đô thị phối hợp cùng Văn phòng HĐND - UBND phường "
        "và Trưởng Ban điều hành khu phố Chánh Nghĩa 8 (ông Lê Thanh Liêm) thực hiện:"
    )
    add_num_item_p(doc, "1.", "Kiểm tra tư cách chủ thể (CCCD hoặc giấy ủy quyền hợp lệ) và thu thập bản sao các hồ sơ liên quan do hai bên xuất trình theo yêu cầu tại Thư mời ngày 17/10/2026.")
    add_num_item_p(doc, "2.", "Ghi nhận ý kiến trình bày của bà Nguyễn Thị Mộng Đẹp về yêu cầu tháo gỡ, di dời các đường dây cáp đi qua không gian mái tôn thửa đất số 225.")
    add_num_item_p(doc, "3.", "Ghi nhận ý kiến giải trình và hồ sơ chứng minh của ông Đoàn Minh Quang (Giấy chứng nhận QSDĐ thửa 220; Hợp đồng cho thuê đặt trạm BTS từ năm 2009 đối với hệ thống cáp của 03 nhà mạng Viettel, VNPT, Mobifone; văn bản thông báo chấm dứt hợp đồng yêu cầu đơn vị quản lý trạm thu hồi cáp).")
    add_num_item_p(doc, "4.", "Ghi nhận ý kiến của ông Lê Thanh Liêm – Trưởng Ban điều hành khu phố Chánh Nghĩa 8 về thời điểm hình thành hệ thống cáp viễn thông trạm BTS tại địa phương và tình hình an ninh trật tự giữa hai hộ.")
    add_num_item_p(doc, "5.", "Giải thích quy định pháp luật về ranh giới không gian theo chiều thẳng đứng (Điều 175 Bộ luật Dân sự 2015), quy định về mắc đường dây tải điện, thông tin liên lạc (Điều 255 Bộ luật Dân sự 2015) và quy định về thoát nước mưa mái nhà (Điều 177 Bộ luật Dân sự 2015).")
    
    # Bước 3
    add_heading_1(doc, "3. Bước 3: Kiểm tra thực địa bổ sung (nếu cần đo đạc trực tiếp) và phát hành văn bản xử lý hạ tầng")
    add_bullet_p(
        doc,
        "Tiến hành kiểm tra thực tế tại vị trí ranh giới 36,34m giữa thửa đất số 220 và thửa đất số 225 để lập biên bản xác nhận độ võng, "
        "khoảng cách an toàn của trụ đỡ dây điện sinh hoạt và vị trí các bó cáp viễn thông."
    )
    add_bullet_p(
        doc,
        "Tham mưu Lãnh đạo Phòng Kinh tế, Hạ tầng và Đô thị hoặc UBND phường ban hành văn bản đôn đốc đơn vị quản lý hạ tầng trạm BTS "
        "và các nhà mạng viễn thông thực hiện thu gọn, thanh thải, tháo dỡ cáp viễn thông khi hết hạn hợp đồng."
    )
    
    # Bước 4
    add_heading_1(doc, "4. Bước 4: Tham mưu Báo cáo kết quả và dự thảo Công văn trả lời đơn trình Lãnh đạo UBND phường ký ban hành")
    add_bullet_p(
        doc,
        "Chuyên viên hoàn thiện hồ sơ, lập Báo cáo đề xuất kèm dự thảo Công văn của UBND phường Thủ Dầu Một trả lời chính thức "
        "Đơn phản ánh số 2346 ngày 15/10/2026 cho bà Nguyễn Thị Mộng Đẹp theo đúng thời hạn quy định của Luật Tiếp công dân và Thông tư 05/2021/TT-TTCP."
    )

# ==================== VĂN BẢN 01 ====================
def build_van_ban_01(doc):
    add_header_table(
        doc,
        org_line1="ỦY BAN NHÂN DÂN",
        org_line2="PHƯỜNG THỦ DẦU MỘT",
        doc_num="",
        date_str=""
    )
    
    add_doc_title(
        doc,
        title="BIÊN BẢN LÀM VIỆC",
        subtitle="(V/v: Giải quyết nội dung đơn phản ánh ghi ngày 15/10/2026 của bà Nguyễn Thị Mộng Đẹp)"
    )
    
    add_body_p(
        doc,
        "Hôm nay, vào lúc 15 giờ 00 phút, ngày 21 tháng 10 năm 2026 (Thứ Tư), tại Trụ sở tiếp công dân phường Thủ Dầu Một; "
        "địa chỉ: Số 01, đường Quang Trung, phường Thủ Dầu Một, Thành phố Hồ Chí Minh."
    )
    add_body_p(
        doc,
        "Căn cứ Thư mời ngày 17 tháng 10 năm 2026 của Văn phòng HĐND - UBND phường Thủ Dầu Một, chúng tôi tiến hành buổi làm việc "
        "giải quyết Đơn phản ánh của bà Nguyễn Thị Mộng Đẹp (Số đến: 2346 ngày 15/10/2026)."
    )
    
    add_heading_I(doc, "I. THÀNH PHẦN THAM DỰ:")
    
    add_heading_1(doc, "1. Đại diện các cơ quan thuộc UBND phường Thủ Dầu Một và Khu phố:")
    add_bullet_p(doc, "....................................................... – Chức vụ: Đại diện Lãnh đạo Văn phòng HĐND - UBND / Cán bộ Tiếp công dân phường;", bold_prefix="Ông/Bà: ")
    add_bullet_p(doc, "....................................................... – Chức vụ: Chuyên viên Phòng Kinh tế, Hạ tầng và Đô thị phường Thủ Dầu Một (Cơ quan chuyên môn chủ trì tham mưu);", bold_prefix="Ông/Bà: ")
    add_bullet_p(doc, "Lê Thanh Liêm – Chức vụ: Trưởng Ban điều hành khu phố Chánh Nghĩa 8.", bold_prefix="Ông: ")
    
    add_heading_1(doc, "2. Các bên công dân được mời làm việc:")
    add_bullet_p(
        doc,
        "Bà Nguyễn Thị Mộng Đẹp, sinh năm: 1962; CCCD số: 074162000264 cấp ngày 25/3/2021; "
        "Địa chỉ: Số K396/68, đường Nguyễn Tri Phương, khu phố Chánh Nghĩa 8, phường Thủ Dầu Một, Thành phố Hồ Chí Minh.",
        bold_prefix="Người phản ánh: "
    )
    add_bullet_p(
        doc,
        "Ông Đoàn Minh Quang, sinh năm: 1978; CCCD số: 074078003477 cấp ngày 10/3/2023; "
        "Địa chỉ: Số 254/9, đường Nguyễn Tri Phương, khu phố Chánh Nghĩa 8, phường Thủ Dầu Một, Thành phố Hồ Chí Minh.",
        bold_prefix="Người bị phản ánh: "
    )
    
    add_heading_I(doc, "II. NỘI DUNG LÀM VIỆC:")
    
    add_heading_1(doc, "1. Ý kiến trình bày của bà Nguyễn Thị Mộng Đẹp (Chủ sử dụng thửa đất số 225, tờ bản đồ số 20):")
    add_bullet_p(
        doc,
        "Bà Nguyễn Thị Mộng Đẹp giữ nguyên nội dung Đơn phản ánh đề ngày 15/10/2026: Bà là người sử dụng thửa đất số 225, "
        "tờ bản đồ số 20 theo Giấy chứng nhận số AA 08063500 cấp ngày 07/6/2026, liền kề với thửa đất số 220, tờ bản đồ số 20 của ông Đoàn Minh Quang."
    )
    add_bullet_p(
        doc,
        "Bà Đẹp phản ánh phía trên mái tôn nhà bà hiện có các đường dây dẫn kéo qua tiềm ẩn nguy cơ mất an toàn trong mùa mưa bão, "
        "xâm phạm không gian thửa đất số 225. Bà Đẹp đề nghị UBND phường can thiệp buộc tháo gỡ, di dời các đường dây này ra khỏi không gian thửa đất số 225 của gia đình bà."
    )
    
    add_heading_1(doc, "2. Ý kiến trình bày và cung cấp hồ sơ của ông Đoàn Minh Quang (Chủ sử dụng thửa đất số 220, tờ bản đồ số 20):")
    add_bullet_p(
        doc,
        "Ông Đoàn Minh Quang xuất trình hồ sơ và giải trình: Gia đình ông không tự ý kéo đường dây điện sinh hoạt đè lên mái tôn nhà bà Nguyễn Thị Mộng Đẹp "
        "và không có hành vi thách thức, hăm dọa như đơn bà Đẹp phản ánh."
    )
    add_bullet_p(
        doc,
        "Về các bó dây cáp đi trên cao phía trên mái tôn thửa đất số 225 và cuộn cáp treo trên trụ bê tông sát hàng rào lưới B40 (theo các ảnh chụp đính kèm đơn của bà Đẹp): "
        "Đây là hệ thống cáp viễn thông của 03 nhà mạng (Viettel, VNPT, Mobifone) kết nối vào trạm thu phát sóng viễn thông (BTS) đặt trên đất của gia đình ông "
        "theo hợp đồng thuê mặt bằng từ năm 2009 (tồn tại trước khi bà Đẹp dựng mái tôn). Hiện nay hợp đồng thuê trạm BTS sắp kết thúc, ông Quang đã gửi văn bản "
        "yêu cầu đơn vị quản lý trạm BTS và 03 nhà mạng cử kỹ thuật xuống tháo dỡ, thu hồi toàn bộ cáp viễn thông."
    )
    add_bullet_p(
        doc,
        "Về đường dây điện sinh hoạt riêng của gia đình ông Quang: Dây điện có vỏ bọc cách điện, đi theo hướng Lối đi 2,5m và được cố định trên trụ sắt "
        "gắn sứ cách điện nằm dọc theo tường rào ranh giới phía thửa đất số 220, không tiếp xúc với mái tôn nhà bà Đẹp."
    )
    
    add_heading_1(doc, "3. Ý kiến của ông Lê Thanh Liêm – Trưởng Ban điều hành khu phố Chánh Nghĩa 8:")
    add_bullet_p(
        doc,
        "Xác nhận hệ thống trạm thu phát sóng viễn thông (BTS) và các tuyến cáp viễn thông tại khu đất hộ ông Đoàn Minh Quang đã hình thành và hoạt động từ nhiều năm trước."
    )
    add_bullet_p(
        doc,
        "Đề nghị cơ quan chuyên môn của phường kiểm tra thực tế để phân định rõ cáp viễn thông của nhà mạng và dây điện sinh hoạt hộ gia đình, "
        "đồng thời vận động hai hộ gia đình giữ gìn đoàn kết, an ninh trật tự tại khu phố Chánh Nghĩa 8."
    )
    
    add_heading_1(doc, "4. Ý kiến chuyên môn của Chuyên viên Phòng Kinh tế, Hạ tầng và Đô thị phường Thủ Dầu Một:")
    add_body_p(doc, "Qua kiểm tra hồ sơ địa chính và hình ảnh hiện trạng đính kèm đơn số 2346 ngày 15/10/2026:")
    add_bullet_p(
        doc,
        "Các bó cáp màu đen đi trên khoảng không phía trên mái tôn thửa đất số 225 và cuộn cáp dự phòng trên trụ bê tông là cáp viễn thông của các doanh nghiệp viễn thông, "
        "không phải đường dây tải điện sinh hoạt trần của hộ ông Đoàn Minh Quang."
    )
    add_bullet_p(
        doc,
        "Đối với đường dây điện sinh hoạt của hộ ông Đoàn Minh Quang gắn trên trụ sắt có sứ cách điện dọc tường rào ranh giới "
        "(đoạn ranh giới dài 36,34m từ điểm số 2 đến điểm số 3 nối ra Lối đi 2,5m theo Sơ đồ thửa đất trên Giấy chứng nhận số AA 08063500 cấp ngày 07/6/2026): "
        "Yêu cầu ông Đoàn Minh Quang duy trì cố định trụ đỡ và dây dẫn nằm hoàn toàn trong phạm vi không gian thẳng đứng của thửa đất số 220 "
        "và hành lang Lối đi 2,5m theo Điều 175 và Điều 255 Bộ luật Dân sự năm 2015."
    )
    add_bullet_p(
        doc,
        "Đối với công trình khung sắt, mái tôn trên thửa đất số 225 của bà Nguyễn Thị Mộng Đẹp (trên Giấy chứng nhận số AA 08063500 cấp ngày 07/6/2026 tại Mục 3 "
        'ghi nhận tài sản gắn liền với đất: "-/-"): Đề nghị bà Nguyễn Thị Mộng Đẹp chấp hành nghiêm các quy định về xây dựng và quy định lắp đặt máng thoát nước mưa '
        "theo Điều 176, Điều 177 Bộ luật Dân sự năm 2015, không để nước mưa từ mái tôn chảy tràn sang tường rào và thửa đất số 220 liền kề."
    )
    add_bullet_p(
        doc,
        "Phòng Kinh tế, Hạ tầng và Đô thị sẽ phối hợp kiểm tra hiện trường thực tế và tham mưu UBND phường ban hành văn bản yêu cầu đơn vị quản lý trạm BTS "
        "cùng các nhà mạng viễn thông thực hiện thu gọn, tháo dỡ các đường cáp viễn thông đi qua khoảng không thửa đất số 225, đồng thời tham mưu văn bản "
        "trả lời đơn chính thức cho bà Nguyễn Thị Mộng Đẹp theo quy định."
    )
    
    add_body_p(
        doc,
        "Buổi làm việc kết thúc vào lúc 16 giờ 15 phút cùng ngày. Biên bản được lập thành 04 bản, đã đọc lại cho tất cả các thành phần tham dự cùng nghe, "
        "công nhận là đúng và ký tên dưới đây./."
    )
    
    # Bảng chữ ký 5 cột
    p_sp = doc.add_paragraph()
    set_para_format(p_sp, space_before=4, space_after=2, line_spacing=1.0)
    
    table_sig = doc.add_table(rows=1, cols=5)
    table_sig.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders_none(table_sig)
    
    col_w = Cm(3.3)
    row_sig = table_sig.rows[0]
    headers = [
        "NGƯỜI PHẢN ÁNH",
        "NGƯỜI BỊ PHẢN ÁNH",
        "TRƯỞNG BĐH KHU PHỐ",
        "CHUYÊN VIÊN PHÒNG KT, HT & ĐT",
        "ĐẠI DIỆN CHỦ TRÌ BUỔI LÀM VIỆC"
    ]
    names = [
        "Nguyễn Thị Mộng Đẹp",
        "Đoàn Minh Quang",
        "Lê Thanh Liêm",
        "",
        ""
    ]
    
    for idx, (head, name) in enumerate(zip(headers, names)):
        cell = row_sig.cells[idx]
        cell.width = col_w
        set_cell_margins(cell, top=0, bottom=20, left=2, right=2)
        p = cell.paragraphs[0]
        set_para_format(p, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=1, line_spacing=1.0)
        r_h = p.add_run(head + "\n")
        set_font(r_h, size_pt=10.5, bold=True)
        r_note = p.add_run("(Ký, ghi rõ họ tên)\n\n\n\n\n")
        set_font(r_note, size_pt=9.5, italic=True)
        if name:
            r_n = p.add_run(name)
            set_font(r_n, size_pt=10.5, bold=True)

# ==================== VĂN BẢN 02 ====================
def build_van_ban_02(doc):
    add_header_table(
        doc,
        org_line1="UBND PHƯỜNG THỦ DẦU MỘT",
        org_line2="PHÒNG KINH TẾ, HẠ TẦNG VÀ ĐÔ THỊ",
        doc_num="",
        date_str=""
    )
    
    add_doc_title(
        doc,
        title="BIÊN BẢN KIỂM TRA HIỆN TRƯỜNG",
        subtitle="(V/v: Kiểm tra hiện trạng kỹ thuật đường dây dẫn điện, cáp viễn thông và công trình tại ranh giới thửa đất số 225 và thửa đất số 220, tờ bản đồ số 20)"
    )
    
    add_body_p(
        doc,
        "Hôm nay, vào lúc ..... giờ ..... phút, ngày ..... tháng 10 năm 2026, tại khu vực ranh giới tiếp giáp giữa thửa đất số 225 và thửa đất số 220, "
        "tờ bản đồ số 20, đường Nguyễn Tri Phương, khu phố Chánh Nghĩa 8, phường Thủ Dầu Một, Thành phố Hồ Chí Minh."
    )
    
    add_heading_I(doc, "I. THÀNH PHẦN KIỂM TRA:")
    add_num_item_p(doc, "1.", "Ông/Bà: ....................................................... – Chức vụ: Chuyên viên Phòng Kinh tế, Hạ tầng và Đô thị;")
    add_num_item_p(doc, "2.", "Ông/Bà: ....................................................... – Chức vụ: Cán bộ Tổ Quản lý trật tự đô thị;")
    add_num_item_p(doc, "3.", "Lê Thanh Liêm – Chức vụ: Trưởng Ban điều hành khu phố Chánh Nghĩa 8;", bold_prefix="Ông: ")
    add_num_item_p(doc, "4.", "Sự chứng kiến của đại diện hai hộ gia đình:")
    add_bullet_p(doc, "Bà Nguyễn Thị Mộng Đẹp (Chủ sử dụng thửa đất số 225, tờ bản đồ số 20);", bullet_char="   - ")
    add_bullet_p(doc, "Ông Đoàn Minh Quang (Chủ sử dụng thửa đất số 220, tờ bản đồ số 20).", bullet_char="   - ")
    
    add_heading_I(doc, "II. KẾT QUẢ KIỂM TRA HIỆN TRẠNG KỸ THUẬT TẠI THỰC ĐỊA:")
    
    add_heading_1(doc, "1. Kiểm tra hệ thống cáp viễn thông đi qua khoảng không thửa đất số 225:")
    add_bullet_p(
        doc,
        "Các bó dây cáp màu đen treo trên cao đi ngang qua phía trên mái tôn thuộc thửa đất số 225 và cuộn cáp dự phòng cố định trên trụ bê tông "
        "sát cổng rào lưới B40 là cáp quang và cáp tín hiệu viễn thông của các nhà mạng (Viettel, VNPT, Mobifone) đấu nối vào trạm BTS "
        "trên phần đất của ông Đoàn Minh Quang."
    )
    add_bullet_p(doc, "Các bó cáp này không phải là đường dây tải điện sinh hoạt của hộ ông Đoàn Minh Quang.")
    
    add_heading_1(doc, "2. Kiểm tra đường dây điện sinh hoạt phục vụ thửa đất số 220:")
    add_bullet_p(
        doc,
        "Đường dây điện sinh hoạt của hộ ông Đoàn Minh Quang sử dụng dây bọc vỏ nhựa cách điện, đi từ hướng Lối đi 2,5m "
        "(tại điểm ranh số 2 nối ra Đường bê tông theo sơ đồ thửa đất) và được cố định trên trụ sắt hộp có gắn sứ cách điện màu trắng "
        "đặt dọc theo tường gạch ranh giới ngăn cách hai thửa đất (cạnh ranh giới dài 36,34m từ điểm số 2 đến điểm số 3)."
    )
    add_bullet_p(
        doc,
        "Tại thời điểm kiểm tra, dây dẫn điện sinh hoạt nằm trên sứ cách điện, không chạm vào mái tôn trên thửa đất số 225 và không có hiện tượng rò rỉ điện."
    )
    
    add_heading_1(doc, "3. Kiểm tra hiện trạng công trình sát ranh giới trên thửa đất số 225:")
    add_bullet_p(
        doc,
        'Trên thửa đất số 225 của bà Nguyễn Thị Mộng Đẹp hiện có công trình khung sắt, vách tôn và mái tôn dựng sát tường gạch ranh giới tiếp giáp thửa đất số 220. '
        'Trên Giấy chứng nhận quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất số AA 08063500 cấp ngày 07/6/2026 tại Mục 3 ghi nhận thông tin tài sản gắn liền với đất: "-/-".'
    )
    
    add_heading_I(doc, "III. YÊU CẦU CỦA TỔ KIỂM TRA:")
    add_num_item_p(
        doc,
        "1.",
        "Yêu cầu hộ ông Đoàn Minh Quang giữ cố định trụ sắt đỡ sứ và đường dây điện sinh hoạt nằm hoàn toàn trong mặt phẳng thẳng đứng "
        "thuộc ranh giới thửa đất số 220 và hành lang Lối đi 2,5m theo quy định tại Điều 175 Bộ luật Dân sự năm 2015; đồng thời phối hợp mở cổng rào "
        "để đơn vị quản lý trạm BTS và các nhà mạng viễn thông vào thu hồi, tháo dỡ toàn bộ hệ thống cáp viễn thông khi thanh lý hợp đồng."
    )
    add_num_item_p(
        doc,
        "2.",
        "Yêu cầu hộ bà Nguyễn Thị Mộng Đẹp bảo đảm an toàn kết cấu mái tôn và hệ thống thu thoát nước mưa tại vị trí tiếp giáp ranh giới dài 36,34m "
        "theo quy định tại Điều 176, Điều 177 Bộ luật Dân sự năm 2015."
    )
    
    add_body_p(
        doc,
        "Biên bản kết thúc vào lúc ..... giờ ..... phút cùng ngày, lập thành 03 bản, đã đọc lại cho các bên cùng nghe và ký tên xác nhận./."
    )
    
    # Bảng chữ ký 4 cột
    p_sp = doc.add_paragraph()
    set_para_format(p_sp, space_before=4, space_after=2, line_spacing=1.0)
    
    table_sig = doc.add_table(rows=1, cols=4)
    table_sig.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders_none(table_sig)
    
    col_w = Cm(4.12)
    row_sig = table_sig.rows[0]
    headers = [
        "ĐẠI DIỆN HỘ THỬA 225",
        "ĐẠI DIỆN HỘ THỬA 220",
        "TRƯỞNG BĐH KHU PHỐ",
        "CÁN BỘ KIỂM TRA"
    ]
    names = [
        "Nguyễn Thị Mộng Đẹp",
        "Đoàn Minh Quang",
        "Lê Thanh Liêm",
        ""
    ]
    for idx, (head, name) in enumerate(zip(headers, names)):
        cell = row_sig.cells[idx]
        cell.width = col_w
        set_cell_margins(cell, top=0, bottom=20, left=2, right=2)
        p = cell.paragraphs[0]
        set_para_format(p, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=1, line_spacing=1.0)
        r_h = p.add_run(head + "\n")
        set_font(r_h, size_pt=11, bold=True)
        r_note = p.add_run("(Ký, ghi rõ họ tên)\n\n\n\n\n")
        set_font(r_note, size_pt=10, italic=True)
        if name:
            r_n = p.add_run(name)
            set_font(r_n, size_pt=11, bold=True)

# ==================== VĂN BẢN 03 ====================
def build_van_ban_03(doc):
    add_header_table(
        doc,
        org_line1="UBND PHƯỜNG THỦ DẦU MỘT",
        org_line2="PHÒNG KINH TẾ, HẠ TẦNG VÀ ĐÔ THỊ",
        doc_num="Số: ....... /PKTHTĐT",
        date_str="Thủ Dầu Một, ngày ..... tháng 10 năm 2026",
        is_cong_van=True,
        trich_yeu_cv="V/v yêu cầu kiểm tra, thu gọn và tháo dỡ cáp viễn thông đi qua không gian thửa đất số 225, tờ bản đồ số 20"
    )
    
    add_kinh_gui(doc, [
        "Đơn vị quản lý hạ tầng trạm BTS tại địa chỉ 254/9 đường Nguyễn Tri Phương (Công ty Toàn Cầu);",
        "Các đơn vị viễn thông có cáp treo kết nối vào trạm (Viettel, VNPT, Mobifone)."
    ])
    
    add_body_p(
        doc,
        "Qua công tác kiểm tra hiện trường giải quyết Đơn phản ánh của bà Nguyễn Thị Mộng Đẹp (chủ sử dụng thửa đất số 225, tờ bản đồ số 20, "
        "địa chỉ: K396/68 đường Nguyễn Tri Phương, khu phố Chánh Nghĩa 8, phường Thủ Dầu Một, TP. Hồ Chí Minh) và kết quả buổi làm việc ngày 21/10/2026 "
        "tại Trụ sở tiếp công dân phường Thủ Dầu Một, Phòng Kinh tế, Hạ tầng và Đô thị phường Thủ Dầu Một ghi nhận như sau:"
    )
    add_body_p(
        doc,
        "Hiện nay, các bó dây cáp viễn thông của các nhà mạng kết nối vào trạm BTS đặt tại địa chỉ số 254/9 đường Nguyễn Tri Phương "
        "(thửa đất của ông Đoàn Minh Quang) đang đi ngang qua khoảng không phía trên mái tôn thuộc thửa đất số 225, tờ bản đồ số 20 "
        "của hộ bà Nguyễn Thị Mộng Đẹp và có cuộn cáp dự phòng treo trên trụ bê tông sát hàng rào, gây ảnh hưởng đến an toàn không gian công trình "
        "liền kề trong mùa mưa bão và mỹ quan đô thị. Đồng thời, chủ sử dụng đất (ông Đoàn Minh Quang) đã có thông báo chấm dứt hợp đồng thuê mặt bằng "
        "đặt trạm BTS và yêu cầu đơn vị quản lý trạm thu hồi hệ thống cáp để hoàn trả mặt bằng."
    )
    add_body_p(
        doc,
        "Thực hiện chức năng quản lý nhà nước về hạ tầng kỹ thuật đô thị và xây dựng trên địa bàn phường, Phòng Kinh tế, Hạ tầng và Đô thị "
        "phường Thủ Dầu Một đề nghị Quý Công ty và các đơn vị viễn thông thực hiện các nội dung sau:"
    )
    add_num_item_p(
        doc,
        "1.",
        "Cử bộ phận kỹ thuật trực tiếp xuống hiện trường tại địa chỉ số 254/9 và số K396/68 đường Nguyễn Tri Phương, khu phố Chánh Nghĩa 8, "
        "phường Thủ Dầu Một để kiểm tra, tiến hành thu gọn, thanh thải và tháo dỡ toàn bộ các đường dây cáp viễn thông đang vắt qua khoảng không "
        "phía trên mái tôn thuộc thửa đất số 225 của hộ bà Nguyễn Thị Mộng Đẹp."
    )
    add_num_item_p(
        doc,
        "2.",
        "Thời gian hoàn thành việc xử lý, tháo dỡ cáp viễn thông và thông báo kết quả về Phòng Kinh tế, Hạ tầng và Đô thị phường Thủ Dầu Một trước ngày ...../11/2026."
    )
    add_body_p(
        doc,
        "Đề nghị Quý đơn vị nghiêm túc phối hợp thực hiện để đảm bảo an toàn hạ tầng kỹ thuật và trật tự đô thị tại địa phương./."
    )
    
    # Bảng Nơi nhận & Ký tên
    p_sp = doc.add_paragraph()
    set_para_format(p_sp, space_before=4, space_after=2, line_spacing=1.0)
    
    table_sig = doc.add_table(rows=1, cols=2)
    table_sig.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders_none(table_sig)
    
    c_left = table_sig.rows[0].cells[0]
    c_right = table_sig.rows[0].cells[1]
    c_left.width = Cm(7.5)
    c_right.width = Cm(9.0)
    set_cell_margins(c_left, top=0, bottom=10, left=0, right=10)
    set_cell_margins(c_right, top=0, bottom=10, left=10, right=0)
    
    # Cột trái: Nơi nhận
    p_nn = c_left.paragraphs[0]
    set_para_format(p_nn, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=0, space_after=2, line_spacing=1.0)
    r_nn_t = p_nn.add_run("Nơi nhận:\n")
    set_font(r_nn_t, size_pt=12, bold=True, italic=True)
    
    recipients = [
        "- Như trên;",
        "- UBND phường (để b/c);",
        "- Ông Đoàn Minh Quang, bà Nguyễn Thị Mộng Đẹp (để biết);",
        "- BĐH khu phố Chánh Nghĩa 8 (để theo dõi);",
        "- Lưu: VT, PKTHTĐT."
    ]
    for rec in recipients:
        p_r = c_left.add_paragraph()
        set_para_format(p_r, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=0, space_after=1, line_spacing=1.0, left_indent=0.2)
        r_rec = p_r.add_run(rec)
        set_font(r_rec, size_pt=11, bold=False)
        
    # Cột phải: Ký tên
    p_sig = c_right.paragraphs[0]
    set_para_format(p_sig, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=2, line_spacing=1.15)
    r_s1 = p_sig.add_run("TRƯỞNG PHÒNG\n")
    set_font(r_s1, size_pt=13, bold=True)
    r_s2 = p_sig.add_run("(Ký tên, đóng dấu)\n\n\n\n\n")
    set_font(r_s2, size_pt=11, italic=True)
    r_s3 = p_sig.add_run("Nguyễn Tấn Đạt")
    set_font(r_s3, size_pt=13, bold=True)

# ==================== VĂN BẢN 04 ====================
def build_van_ban_04(doc):
    add_header_table(
        doc,
        org_line1="ỦY BAN NHÂN DÂN",
        org_line2="PHƯỜNG THỦ DẦU MỘT",
        doc_num="Số: ....... /UBND-KTHTĐT",
        date_str="Thủ Dầu Một, ngày ..... tháng 10 năm 2026",
        is_cong_van=True,
        trich_yeu_cv="V/v trả lời Đơn phản ánh đề ngày 15/10/2026 của bà Nguyễn Thị Mộng Đẹp (Số đến: 2346)"
    )
    
    add_kinh_gui(doc, ["Bà Nguyễn Thị Mộng Đẹp"])
    
    # Địa chỉ & SĐT
    p_addr = doc.add_paragraph()
    set_para_format(p_addr, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=0, space_after=2, line_spacing=1.15, first_indent=1.25)
    r_ad1 = p_addr.add_run("Địa chỉ: ")
    set_font(r_ad1, size_pt=13, bold=True)
    r_ad2 = p_addr.add_run("Số K396/68, đường Nguyễn Tri Phương, khu phố Chánh Nghĩa 8, phường Thủ Dầu Một, Thành phố Hồ Chí Minh.\n")
    set_font(r_ad2, size_pt=13, bold=False)
    r_ph1 = p_addr.add_run("Số điện thoại: ")
    set_font(r_ph1, size_pt=13, bold=True)
    r_ph2 = p_addr.add_run("0977.975.248.")
    set_font(r_ph2, size_pt=13, bold=False)
    
    add_body_p(
        doc,
        "Ủy ban nhân dân phường Thủ Dầu Một nhận được Đơn phản ánh ghi ngày 15/10/2026 của bà Nguyễn Thị Mộng Đẹp (Số đến: 2346 ngày 15/10/2026) "
        "phản ánh việc ông Đoàn Minh Quang (chủ sử dụng thửa đất số 220, tờ bản đồ số 20) tự ý kéo các đường dây điện lên mái tôn nhà bà "
        "(thuộc thửa đất số 225, tờ bản đồ số 20) gây nguy cơ mất an toàn điện và đề nghị UBND phường can thiệp buộc tháo gỡ, di dời các đường dây điện "
        "ra khỏi không gian thửa đất của gia đình bà."
    )
    add_body_p(
        doc,
        "Căn cứ kết quả buổi làm việc ngày 21/10/2026 tại Trụ sở tiếp công dân phường Thủ Dầu Một và kết quả kiểm tra, xác minh thực địa "
        "của cơ quan chuyên môn là Phòng Kinh tế, Hạ tầng và Đô thị phường, Ủy ban nhân dân phường Thủ Dầu Một trả lời kết quả giải quyết đơn của bà như sau:"
    )
    
    add_heading_1(doc, "1. Kết quả thẩm tra hồ sơ và xác minh hiện trạng kỹ thuật:")
    add_bullet_p(
        doc,
        "Qua kiểm tra thực tế tại khu vực tiếp giáp giữa thửa đất số 225 và thửa đất số 220, tờ bản đồ số 20 (cạnh ranh giới dài 36,34m "
        "theo Giấy chứng nhận số AA 08063500 do Chi nhánh Văn phòng Đăng ký đất đai Số 23 cấp ngày 07/6/2026): Các bó dây cáp màu đen "
        "đi ngang khoảng không phía trên mái tôn thuộc thửa đất số 225 và cuộn cáp treo trên trụ bê tông (theo hình ảnh bà cung cấp đính kèm đơn) "
        "là hệ thống cáp viễn thông của các nhà mạng (Viettel, VNPT, Mobifone) đấu nối vào trạm thu phát sóng viễn thông (BTS) lắp đặt theo hợp đồng "
        "thuê mặt bằng từ năm 2009, không phải là đường dây tải điện sinh hoạt do ông Đoàn Minh Quang mới tự ý kéo đè lên mái tôn nhà bà."
    )
    add_bullet_p(
        doc,
        "Đối với đường dây điện sinh hoạt phục vụ thửa đất số 220 của hộ ông Đoàn Minh Quang: Dây dẫn có vỏ bọc cách điện tiêu chuẩn, "
        "được kéo từ hướng Lối đi 2,5m và cố định trên trụ sắt hộp gắn sứ cách điện đặt dọc theo tường gạch ranh giới phía bên thửa đất số 220, "
        "không nằm đè hoặc tiếp xúc trực tiếp với mái tôn trên thửa đất số 225 của gia đình bà."
    )
    
    add_heading_1(doc, "2. Biện pháp xử lý và hướng dẫn theo quy định pháp luật:")
    add_bullet_p(
        doc,
        "Do các bó dây cáp nêu trên là tài sản hạ tầng kỹ thuật của các doanh nghiệp viễn thông và hiện nay hợp đồng thuê mặt bằng "
        "đặt trạm BTS trên đất của ông Đoàn Minh Quang sắp kết thúc, ông Đoàn Minh Quang đã có văn bản thông báo chấm dứt hợp đồng "
        "và yêu cầu đơn vị quản lý trạm BTS (Công ty Toàn Cầu) cùng 03 đơn vị viễn thông (Viettel, VNPT, Mobifone) thu hồi, tháo dỡ "
        "toàn bộ hệ thống cáp. Đồng thời, Phòng Kinh tế, Hạ tầng và Đô thị phường đã ban hành văn bản yêu cầu đơn vị quản lý trạm BTS "
        "và các nhà mạng viễn thông cử lực lượng kỹ thuật xuống hiện trường thu gọn, thanh thải và tháo dỡ toàn bộ số cáp viễn thông "
        "ra khỏi khoảng không phía trên mái tôn thửa đất số 225 nhằm đảm bảo an toàn trong mùa mưa bão và mỹ quan đô thị.",
        bold_prefix="Về việc xử lý, di dời hệ thống cáp viễn thông đi qua khoảng không thửa đất số 225: "
    )
    add_bullet_p(
        doc,
        "UBND phường đã yêu cầu hộ ông Đoàn Minh Quang duy trì cố định trụ đỡ và đường dây điện sinh hoạt nằm hoàn toàn trong phạm vi "
        "không gian thẳng đứng thuộc ranh giới thửa đất số 220 và hành lang Lối đi 2,5m theo đúng quy định tại Điều 175 và Điều 255 "
        "Bộ luật Dân sự năm 2015. Đối với phần công trình khung sắt, mái tôn dựng sát tường rào ranh giới trên thửa đất số 225 của gia đình bà "
        '(tại Mục 3 Giấy chứng nhận số AA 08063500 cấp ngày 07/6/2026 chưa ghi nhận tài sản gắn liền với đất: "-/-"), UBND phường đề nghị bà '
        "trong quá trình quản lý, sử dụng phải tuân thủ nghiêm quy định của pháp luật về xây dựng và quy định về lắp đặt máng thu thoát nước mưa "
        "tại Điều 176, Điều 177 Bộ luật Dân sự năm 2015, không để nước mưa chảy tràn qua ranh giới bất động sản liền kề.",
        bold_prefix="Về việc quản lý đường dây điện sinh hoạt và trật tự xây dựng tại ranh giới hai thửa đất: "
    )
    add_bullet_p(
        doc,
        "UBND phường đã giao Công an phường và Ban điều hành khu phố Chánh Nghĩa 8 theo dõi, nhắc nhở hai hộ gia đình giữ gìn trật tự, "
        "đoàn kết tại khu dân cư; trường hợp phát sinh hành vi vi phạm pháp luật về an ninh trật tự sẽ lập biên bản xử lý theo đúng quy định.",
        bold_prefix="Về công tác giữ gìn an ninh trật tự tại khu dân cư: "
    )
    
    add_body_p(
        doc,
        "Ủy ban nhân dân phường Thủ Dầu Một thông báo kết quả giải quyết đơn phản ánh để bà Nguyễn Thị Mộng Đẹp được biết./."
    )
    
    # Bảng Nơi nhận & Ký tên
    p_sp = doc.add_paragraph()
    set_para_format(p_sp, space_before=4, space_after=2, line_spacing=1.0)
    
    table_sig = doc.add_table(rows=1, cols=2)
    table_sig.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders_none(table_sig)
    
    c_left = table_sig.rows[0].cells[0]
    c_right = table_sig.rows[0].cells[1]
    c_left.width = Cm(7.5)
    c_right.width = Cm(9.0)
    set_cell_margins(c_left, top=0, bottom=10, left=0, right=10)
    set_cell_margins(c_right, top=0, bottom=10, left=10, right=0)
    
    # Cột trái: Nơi nhận
    p_nn = c_left.paragraphs[0]
    set_para_format(p_nn, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=0, space_after=2, line_spacing=1.0)
    r_nn_t = p_nn.add_run("Nơi nhận:\n")
    set_font(r_nn_t, size_pt=12, bold=True, italic=True)
    
    recipients = [
        "- Như trên;",
        "- Chủ tịch, các PCT UBND phường;",
        "- Văn phòng HĐND - UBND phường;",
        "- Phòng KT, HT và ĐT phường (lưu HS, theo dõi);",
        "- Công an phường (để p/h);",
        "- Ông Đoàn Minh Quang (để thực hiện);",
        "- Ông Lê Thanh Liêm – Trưởng BĐH KP Chánh Nghĩa 8;",
        "- Lưu: VT."
    ]
    for rec in recipients:
        p_r = c_left.add_paragraph()
        set_para_format(p_r, align=WD_ALIGN_PARAGRAPH.LEFT, space_before=0, space_after=1, line_spacing=1.0, left_indent=0.2)
        r_rec = p_r.add_run(rec)
        set_font(r_rec, size_pt=11, bold=False)
        
    # Cột phải: Ký tên
    p_sig = c_right.paragraphs[0]
    set_para_format(p_sig, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=2, line_spacing=1.15)
    r_s1 = p_sig.add_run("TM. ỦY BAN NHÂN DÂN\nKT. CHỦ TỊCH\nPHÓ CHỦ TỊCH\n")
    set_font(r_s1, size_pt=13, bold=True)
    r_s2 = p_sig.add_run("(Ký tên, đóng dấu)\n\n\n\n\n")
    set_font(r_s2, size_pt=11, italic=True)
    r_s3 = p_sig.add_run("....................................................")
    set_font(r_s3, size_pt=12, bold=False)

# ==================== MAIN GENERATOR ====================
def main():
    workspace_dir = r"q:\CODE_visual\filebctt"
    
    # 1. FILE MASTER TOÀN BỘ HỒ SƠ
    print("1. Đang xây dựng file Master Hồ sơ công vụ và trọn bộ 04 văn bản...")
    doc_master = docx.Document()
    set_page_setup(doc_master.sections[0])
    
    # Trang bìa
    build_cover_page(doc_master)
    
    # Phần I: Trình tự nghiệp vụ
    doc_master.add_page_break()
    build_phan_1(doc_master)
    
    # Tiêu đề chuyển tiếp Phần II
    p_sec2 = doc_master.add_paragraph()
    set_para_format(p_sec2, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=16, space_after=6, line_spacing=1.2)
    r_sec2 = p_sec2.add_run(
        "PHẦN II\nCÁCH TRÌNH BÀY BỘ 04 VĂN BẢN XỬ LÝ CỦA CHUYÊN VIÊN\n"
        "PHÒNG KINH TẾ, HẠ TẦNG VÀ ĐÔ THỊ\n(CHUẨN THỂ THỨC NGHỊ ĐỊNH 30/2020/NĐ-CP)"
    )
    set_font(r_sec2, size_pt=14, bold=True, color_rgb=(27, 54, 93))
    
    p_intro = doc_master.add_paragraph()
    set_para_format(p_intro, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=4, space_after=8, line_spacing=1.15, first_indent=1.25)
    r_int = p_intro.add_run(
        "Dưới đây là toàn văn 04 văn bản hành chính công vụ do Chuyên viên Phòng Kinh tế, Hạ tầng và Đô thị soạn thảo "
        "theo đúng tiến trình từ buổi làm việc ngày 21/10/2026 đến khi kết thúc hồ sơ (trình bày chuẩn định dạng phông chữ Times New Roman, "
        "cỡ chữ 13–14, căn lề và đường kẻ tiêu ngữ chuẩn Nghị định số 30/2020/NĐ-CP của Chính phủ):"
    )
    set_font(r_int, size_pt=13, italic=True)
    
    # Văn bản 01
    doc_master.add_page_break()
    p_vb1_lbl = doc_master.add_paragraph()
    set_para_format(p_vb1_lbl, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=6, line_spacing=1.15)
    r_vb1 = p_vb1_lbl.add_run("VĂN BẢN 01: BIÊN BẢN LÀM VIỆC NGÀY 21/10/2026\nTẠI TRỤ SỞ TIẾP CÔNG DÂN PHƯỜNG THỦ DẦU MỘT")
    set_font(r_vb1, size_pt=13, bold=True, color_rgb=(180, 20, 20))
    build_van_ban_01(doc_master)
    
    # Văn bản 02
    doc_master.add_page_break()
    p_vb2_lbl = doc_master.add_paragraph()
    set_para_format(p_vb2_lbl, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=6, line_spacing=1.15)
    r_vb2 = p_vb2_lbl.add_run("VĂN BẢN 02: BIÊN BẢN KIỂM TRA HIỆN TRƯỜNG KỸ THUẬT\nCỦA PHÒNG KINH TẾ, HẠ TẦNG VÀ ĐÔ THỊ")
    set_font(r_vb2, size_pt=13, bold=True, color_rgb=(180, 20, 20))
    build_van_ban_02(doc_master)
    
    # Văn bản 03
    doc_master.add_page_break()
    p_vb3_lbl = doc_master.add_paragraph()
    set_para_format(p_vb3_lbl, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=6, line_spacing=1.15)
    r_vb3 = p_vb3_lbl.add_run("VĂN BẢN 03: CÔNG VĂN CỦA PHÒNG KINH TẾ, HẠ TẦNG VÀ ĐÔ THỊ\nĐÔN ĐỐC ĐƠN VỊ VIỄN THÔNG THU DỌN, THÁO DỠ CÁP")
    set_font(r_vb3, size_pt=13, bold=True, color_rgb=(180, 20, 20))
    build_van_ban_03(doc_master)
    
    # Văn bản 04
    doc_master.add_page_break()
    p_vb4_lbl = doc_master.add_paragraph()
    set_para_format(p_vb4_lbl, align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=6, line_spacing=1.15)
    r_vb4 = p_vb4_lbl.add_run("VĂN BẢN 04: CÔNG VĂN CỦA UBND PHƯỜNG THỦ DẦU MỘT\nTRẢ LỜI ĐƠN PHẢN ÁNH SỐ 2346")
    set_font(r_vb4, size_pt=13, bold=True, color_rgb=(180, 20, 20))
    build_van_ban_04(doc_master)
    
    master_file = os.path.join(workspace_dir, "HO_SO_NGHIEP_VU_VA_BO_04_VAN_BAN_XU_LY_DON_2346.docx")
    doc_master.save(master_file)
    print(f"-> Xuất thành công file Master: {master_file}")
    
    # 2. XUẤT CÁC FILE RIÊNG LẺ
    print("2. Đang xuất từng văn bản riêng lẻ để thuận tiện in ấn độc lập...")
    single_docs = [
        ("01_Bien_Ban_Lam_Viec_21_10_2026.docx", build_van_ban_01),
        ("02_Bien_Ban_Kiem_Tra_Hien_Truong.docx", build_van_ban_02),
        ("03_Cong_Van_PKTHTDT_Thao_Do_Cap_Vien_Thong.docx", build_van_ban_03),
        ("04_Cong_Van_UBND_Tra_Loi_Don_2346.docx", build_van_ban_04)
    ]
    for fname, builder_fn in single_docs:
        d = docx.Document()
        set_page_setup(d.sections[0])
        builder_fn(d)
        fpath = os.path.join(workspace_dir, fname)
        d.save(fpath)
        print(f"   + {fname}")
        
    print("Hoàn tất 100% quá trình tạo văn bản Word!")

if __name__ == "__main__":
    main()
