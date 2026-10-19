"""
Script xây dựng toàn bộ Báo cáo Thực tập Doanh nghiệp ĐẠT CHUẨN 100 TRANG A4 ra Microsoft Word (.docx)
Sinh viên: Đoàn Minh Quân - MSSV: 2224801030137 - Lớp: D22KTPM03
Đơn vị thực tập: Phòng Văn hóa và Thông tin thành phố Thủ Dầu Một
Đề tài: Phân tích, thiết kế và xây dựng hệ thống phục vụ người có công sở lao động thương binh và xã hội
(Hệ thống Quản lý Hồ sơ Người có công & Đánh giá Dịch vụ công)
"""

import os
import sys
import re
import subprocess

# Đảm bảo in tiếng Việt không bị lỗi font trên Windows console
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

import docx
from docx.shared import Inches, Pt, RGBColor, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

from report_data import (
    ABBREVIATIONS, INTERNSHIP_WEEKS, CELO_EVALUATION,
    DOANH_NGHIEP_EVAL_CRITERIA, HOI_DONG_EVAL_CRITERIA,
    DATA_DICTIONARY, CHECKLIST_ITEMS, TEST_CASES,
    BUG_REPORTS, SCREENSHOT_DATA, USE_CASE_SPECS,
    API_CONTRACTS, DINH_MUC_PHAP_LY
)
from report_text import (
    LOI_CAM_ON, MO_DAU, CHUONG_1_TEXT, CHUONG_2_TEXT,
    CHUONG_3_TEXT, CHUONG_4_TEXT, CHUONG_5_TEXT,
    CHUONG_6_TEXT, CHUONG_7_TEXT, TAI_LIEU_THAM_KHAO
)

ROOT_DIR = r"Q:\CODE_visual\filebctt"
OUTPUT_FILE = r"Q:\CODE_visual\filebctt\docs\BAO_CAO_THUC_TAP_DOANH_NGHIEP_DOAN_MINH_QUAN.docx"
ROOT_COPY_FILE = r"Q:\CODE_visual\filebctt\BAO_CAO_THUC_TAP_100_TRANG_DOAN_MINH_QUAN.docx"
ROOT_PRINT_FILE = r"Q:\CODE_visual\filebctt\BAO_CAO_THUC_TAP_DOAN_MINH_QUAN_BAN_IN_CHUAN.docx"
SCREENSHOTS_DIR = r"Q:\CODE_visual\filebctt\docs\screenshots"
DIAGRAMS_DIR = r"Q:\CODE_visual\filebctt\docs\diagrams"
V2_IMAGES_DIR = r"Q:\CODE_visual\filebctt\docs\v2_images"

def set_cell_background(cell, color_hex):
    # Trình bày như văn bản V2: Tuyệt đối không tô màu nền bảng
    pass

def set_cell_margins(cell, top=100, bottom=100, left=140, right=140):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def set_table_borders(table, color="000000", sz="4", val="single"):
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
    tblPr.append(borders)
    # Tự động chống ngắt đôi hàng (cantSplit) và lặp lại tiêu đề hàng 0 (tblHeader)
    for r_idx, row in enumerate(table.rows):
        trPr = row._tr.get_or_add_trPr()
        trPr.append(parse_xml(f'<w:cantSplit {nsdecls("w")}/>'))
        if r_idx == 0:
            trPr.append(parse_xml(f'<w:tblHeader {nsdecls("w")}/>'))
def set_page_borders(section, color="002060", val="double", sz="18", space="20"):
    sectPr = section._sectPr
    existing = sectPr.find(qn('w:pgBorders'))
    if existing is not None:
        sectPr.remove(existing)
        
    if val == "none":
        return
        
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

def add_cover_page(doc, is_outer=True):
    # 1. Header
    p_header = doc.add_paragraph()
    p_header.alignment = WD_ALIGN_PARAGRAPH.CENTER
    format_paragraph(p_header, space_before=10, space_after=4, line_spacing=1.15, first_line_indent=0)
    
    r1 = p_header.add_run("UBND TP HỒ CHÍ MINH\n")
    r1.font.name = "Times New Roman"
    r1.font.size = Pt(13)
    r1.font.bold = True
    r1.font.color.rgb = RGBColor(0, 0, 0)
    
    r2 = p_header.add_run("TRƯỜNG ĐẠI HỌC THỦ DẦU MỘT")
    r2.font.name = "Times New Roman"
    r2.font.size = Pt(14)
    r2.font.bold = True
    r2.font.color.rgb = RGBColor(0, 0, 0)
    
    # 2. Logo
    logo_path = os.path.join(ROOT_DIR, 'docs', 'v2_images', 'image1.png')
    p_logo = doc.add_paragraph()
    p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
    format_paragraph(p_logo, space_before=14, space_after=20, line_spacing=1.0, first_line_indent=0)
    if os.path.exists(logo_path):
        p_logo.add_run().add_picture(logo_path, width=Cm(4.8))
        
    # 3. Report Title
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    format_paragraph(p_title, space_before=10, space_after=22, line_spacing=1.2, first_line_indent=0)
    
    r_t1 = p_title.add_run("BÁO CÁO CHUYÊN ĐỀ\n")
    r_t1.font.name = "Times New Roman"
    r_t1.font.size = Pt(17)
    r_t1.font.bold = True
    r_t1.font.color.rgb = RGBColor(0, 0, 0)
    
    r_t2 = p_title.add_run("THỰC TẬP DOANH NGHIỆP")
    r_t2.font.name = "Times New Roman"
    r_t2.font.size = Pt(17)
    r_t2.font.bold = True
    r_t2.font.color.rgb = RGBColor(0, 0, 0)
    
    # 4. Location & Subject
    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    format_paragraph(p_sub, space_before=10, space_after=34, line_spacing=1.25, first_line_indent=0)
    
    r_s1 = p_sub.add_run("Nơi thực tập\n")
    r_s1.font.name = "Times New Roman"
    r_s1.font.size = Pt(13)
    r_s1.font.bold = True
    r_s1.font.color.rgb = RGBColor(0, 0, 0)
    
    r_s2 = p_sub.add_run("Phòng Văn hóa- Xã hội phường Thủ Dầu Một\n")
    r_s2.font.name = "Times New Roman"
    r_s2.font.size = Pt(14)
    r_s2.font.bold = True
    r_s2.font.color.rgb = RGBColor(0, 0, 0)
    
    r_s3 = p_sub.add_run("Phân tích, thiết kế và xây dựng hệ thống phục vụ người có công sở lao động thương binh và xã hội")
    r_s3.font.name = "Times New Roman"
    r_s3.font.size = Pt(14)
    r_s3.font.bold = True
    r_s3.font.color.rgb = RGBColor(0, 0, 0)
    
    # 5. Student & Advisor Info block
    p_info = doc.add_paragraph()
    p_info.alignment = WD_ALIGN_PARAGRAPH.LEFT
    format_paragraph(p_info, space_before=16, space_after=38, line_spacing=1.3, first_line_indent=0, left_indent=0.5)
    
    info_lines = [
        "NGƯỜI HƯỚNG DẪN TẠI ĐƠN VỊ: HỨA TRỌNG DUY",
        "GIẢNG VIÊN HƯỚNG DẪN: THS. NGUYỄN THANH TRUNG",
        "SINH VIÊN THỰC HIỆN: ĐOÀN MINH QUÂN       MÃ SỐ SV: 2224801030137",
        "CHUYÊN NGÀNH: KỸ THUẬT PHẦN MỀM LỚP: D22KTPM03",
        "NIÊN KHÓA: 2022 - 2027"
    ]
    for idx, line in enumerate(info_lines):
        r = p_info.add_run(line + ("\n" if idx < len(info_lines) - 1 else ""))
        r.font.name = "Times New Roman"
        r.font.size = Pt(12)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0, 0, 0)
        
    # 6. Footer (City & Year)
    p_footer = doc.add_paragraph()
    p_footer.alignment = WD_ALIGN_PARAGRAPH.CENTER
    format_paragraph(p_footer, space_before=20, space_after=10, first_line_indent=0)
    
    r_f = p_footer.add_run("TP. Hồ Chí Minh, năm 2026")
    r_f.font.name = "Times New Roman"
    r_f.font.size = Pt(13)
    r_f.font.bold = True
    r_f.font.italic = True
    r_f.font.color.rgb = RGBColor(0, 0, 0)

GLOBAL_BM_ID = 1000

def get_next_bm_id():
    global GLOBAL_BM_ID
    GLOBAL_BM_ID += 1
    return GLOBAL_BM_ID

def add_bookmark_to_paragraph(p, bookmark_name, bookmark_id):
    pPr = p._p.find(qn('w:pPr'))
    bm_start = parse_xml(f'<w:bookmarkStart {nsdecls("w")} w:id="{bookmark_id}" w:name="{bookmark_name}"/>')
    bm_end = parse_xml(f'<w:bookmarkEnd {nsdecls("w")} w:id="{bookmark_id}"/>')
    if pPr is not None:
        pPr.addnext(bm_start)
    else:
        p._p.insert(0, bm_start)
    p._p.append(bm_end)

def add_hyperlink_run(paragraph, text, anchor, font_name="Times New Roman", font_size=Pt(11), bold=False, italic=False, color_rgb="000000", underline=False):
    u_tag = '<w:u w:val="single"/>' if underline else ''
    b_tag = '<w:b/>' if bold else ''
    i_tag = '<w:i/>' if italic else ''
    sz_val = int(font_size.pt * 2) if font_size else 22
    clean_text = text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
    hl_xml = f'''
    <w:hyperlink {nsdecls("w")} w:anchor="{anchor}" w:history="1">
        <w:r>
            <w:rPr>
                <w:rFonts w:ascii="{font_name}" w:hAnsi="{font_name}" w:cs="{font_name}"/>
                <w:sz w:val="{sz_val}"/>
                <w:color w:val="{color_rgb}"/>
                {b_tag}
                {i_tag}
                {u_tag}
            </w:rPr>
            <w:t xml:space="preserve">{clean_text}</w:t>
        </w:r>
    </w:hyperlink>
    '''
    paragraph._p.append(parse_xml(hl_xml))

def add_runs_with_citations(p, text, font_size=Pt(13), default_bold=False, default_italic=False):
    tokens = re.split(r'(\[\d+\])', text)
    for tok in tokens:
        if not tok:
            continue
        m = re.match(r'^\[(\d+)\]$', tok)
        if m:
            ref_num = int(m.group(1))
            if 1 <= ref_num <= 20:
                add_hyperlink_run(
                    p,
                    tok,
                    anchor=f"ref_{ref_num}",
                    font_size=font_size,
                    bold=True,
                    italic=False,
                    color_rgb="000000",
                    underline=False
                )
            else:
                r = p.add_run(tok)
                r.font.name = "Times New Roman"
                r.font.size = font_size
                r.font.bold = default_bold
                r.font.italic = default_italic
                r.font.color.rgb = RGBColor(0, 0, 0)
        else:
            r = p.add_run(tok)
            r.font.name = "Times New Roman"
            r.font.size = font_size
            r.font.bold = default_bold
            r.font.italic = default_italic
            r.font.color.rgb = RGBColor(0, 0, 0)

def format_paragraph(p, space_before=2, space_after=4, line_spacing=1.3, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=1.27, left_indent=0):
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = line_spacing
    p.alignment = align
    if first_line_indent is not None:
        p.paragraph_format.first_line_indent = Cm(first_line_indent)
    if left_indent is not None:
        p.paragraph_format.left_indent = Cm(left_indent)

def add_list_item(doc, text, bullet_char="-", level=1):
    # Chuẩn học thuật: Loại bỏ tuyệt đối mọi ký tự chấm tròn (•, ●, ○, ■, *)
    if bullet_char in ["•", "●", "○", "■", "*", "•\t", "●\t"]:
        bullet_char = "-"
    p = doc.add_paragraph()
    left_cm = 0.8 if level == 1 else 1.4
    hang_cm = -0.4
    format_paragraph(p, space_before=2, space_after=2, line_spacing=1.3, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=hang_cm, left_indent=left_cm)
    
    if bullet_char:
        r_b = p.add_run(f"{bullet_char}\t")
        r_b.font.name = "Times New Roman"
        r_b.font.size = Pt(13)
        r_b.font.bold = True
        r_b.font.color.rgb = RGBColor(0, 0, 0)
        
        pPr = p._p.get_or_add_pPr()
        tabs_elem = parse_xml(f'<w:tabs {nsdecls("w")}><w:tab w:val="left" w:pos="{int(left_cm * 567)}"/></w:tabs>')
        pPr.append(tabs_elem)
        
    add_runs_with_citations(p, text, font_size=Pt(13))
    return p

def add_body_p(doc, text, bold_prefix="", italic=False):
    if not bold_prefix and (text.startswith("- ") or text.startswith("• ")):
        return add_list_item(doc, text[2:], bullet_char="-", level=1)
    if not bold_prefix and text.startswith("+ "):
        return add_list_item(doc, text[2:], bullet_char="+", level=2)
    if not bold_prefix and (text.startswith("* ") or text.startswith("● ") or text.startswith("○ ")):
        return add_list_item(doc, text[2:], bullet_char="-", level=2)
    
    p = doc.add_paragraph()
    format_paragraph(p, space_before=2, space_after=4, line_spacing=1.3, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=1.27, left_indent=0)
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.font.name = "Times New Roman"
        r_pre.font.size = Pt(13)
        r_pre.font.bold = True
        r_pre.font.color.rgb = RGBColor(0, 0, 0)
    add_runs_with_citations(p, text, font_size=Pt(13), default_bold=False, default_italic=italic)
    return p


def set_paragraph_outline(p, level):
    pPr = p._p.get_or_add_pPr()
    outlineLvl = OxmlElement('w:outlineLvl')
    outlineLvl.set(qn('w:val'), str(level))
    pPr.append(outlineLvl)

def add_h1(doc, text, in_toc=True, align=WD_ALIGN_PARAGRAPH.CENTER, anchor=None):
    p = doc.add_paragraph()
    if in_toc:
        try:
            p.style = doc.styles['Heading 1']
        except Exception:
            pass
        set_paragraph_outline(p, 0)
    format_paragraph(p, space_before=18, space_after=10, align=align, first_line_indent=0, left_indent=0)
    p.paragraph_format.keep_with_next = True
    
    if anchor:
        add_bookmark_to_paragraph(p, anchor, get_next_bm_id())
    
    r = p.add_run(text)
    r.font.name = "Times New Roman"
    r.font.size = Pt(15)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0, 0, 0)
    return p

def add_h2(doc, text, in_toc=True, anchor=None):
    p = doc.add_paragraph()
    try:
        p.style = doc.styles['Heading 2']
    except Exception:
        pass
    if in_toc:
        set_paragraph_outline(p, 1)
    format_paragraph(p, space_before=12, space_after=6, align=WD_ALIGN_PARAGRAPH.LEFT, first_line_indent=0, left_indent=0)
    p.paragraph_format.keep_with_next = True
    
    if anchor:
        add_bookmark_to_paragraph(p, anchor, get_next_bm_id())
    
    r = p.add_run(text)
    r.font.name = "Times New Roman"
    r.font.size = Pt(13.5)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0, 0, 0)
    return p

def add_h3(doc, text, in_toc=True, anchor=None):
    p = doc.add_paragraph()
    try:
        p.style = doc.styles['Heading 3']
    except Exception:
        pass
    if in_toc:
        set_paragraph_outline(p, 2)
    format_paragraph(p, space_before=8, space_after=4, align=WD_ALIGN_PARAGRAPH.LEFT, first_line_indent=0, left_indent=0)
    p.paragraph_format.keep_with_next = True
    
    if anchor:
        add_bookmark_to_paragraph(p, anchor, get_next_bm_id())
    
    r = p.add_run(text)
    r.font.name = "Times New Roman"
    r.font.size = Pt(13)
    r.font.bold = True
    r.font.italic = True
    r.font.color.rgb = RGBColor(0, 0, 0)
    return p

def add_subhead(doc, text, anchor=None):
    """Tiêu đề phụ in đậm trong nội dung (không đưa vào TOC để tránh làm loãng mục lục)"""
    p = doc.add_paragraph()
    format_paragraph(p, space_before=8, space_after=4, align=WD_ALIGN_PARAGRAPH.LEFT, first_line_indent=0, left_indent=0)
    p.paragraph_format.keep_with_next = True
    
    if anchor:
        add_bookmark_to_paragraph(p, anchor, get_next_bm_id())
        
    r = p.add_run(text)
    r.font.name = "Times New Roman"
    r.font.size = Pt(12)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0, 0, 0)
    return p

def add_chapter_body_blocks(doc, chapter_text):
    for block in chapter_text.split("\n\n"):
        lines = block.split("\n")
        for line in lines:
            line_str = line.strip()
            if not line_str:
                continue
            if re.match(r'^\d+\.\d+(\.\d+)*\.?\s+', line_str):
                add_numbered_section_header(doc, line_str)
            elif line_str.startswith("- ") or line_str.startswith("• "):
                add_list_item(doc, line_str[2:], bullet_char="-", level=1)
            elif line_str.startswith("+ "):
                add_list_item(doc, line_str[2:], bullet_char="+", level=2)
            elif line_str.startswith("* ") or line_str.startswith("● ") or line_str.startswith("○ "):
                add_list_item(doc, line_str[2:], bullet_char="-", level=2)
            elif re.match(r'^\d+\.\s+[A-ZÀ-Ỹ]', line_str) and len(line_str) < 100:
                add_list_item(doc, line_str, bullet_char="", level=1)
            else:
                add_body_p(doc, line_str)

def add_numbered_section_header(doc, h_text):
    h_text = h_text.strip()
    m = re.match(r'^(\d+(\.\d+)*)\.?\s*(.*)', h_text)
    if m:
        num_str = m.group(1)
        parts = num_str.split('.')
        if len(parts) <= 2:
            return add_h2(doc, h_text)
        else:
            return add_h3(doc, h_text)
    elif h_text.startswith("PHỤ LỤC "):
        return add_h2(doc, h_text)
    else:
        return add_body_p(doc, h_text)

def add_code_block(doc, code_str, title=""):
    # Báo cáo học thuật chuẩn mực: Tuyệt đối không mang mã nguồn trực tiếp vào tài liệu Word
    pass

def add_figure(doc, img_path, fig_title, fig_desc="", width=Inches(5.2)):
    if not os.path.exists(img_path):
        print(f"Warning: Image not found {img_path}")
        return

    # Image paragraph (căn giữa, không thụt đầu dòng, keep_with_next để không bị tách rời chú thích)
    p_img = doc.add_paragraph()
    format_paragraph(p_img, space_before=12, space_after=3, align=WD_ALIGN_PARAGRAPH.CENTER, first_line_indent=0, left_indent=0)
    p_img.paragraph_format.keep_with_next = True
    run_img = p_img.add_run()
    run_img.add_picture(img_path, width=width)

    # Caption paragraph (chú thích nằm PHÍA DƯỚI hình ảnh, căn giữa, không thụt đầu dòng)
    p_cap = doc.add_paragraph()
    format_paragraph(p_cap, space_before=2, space_after=6, align=WD_ALIGN_PARAGRAPH.CENTER, first_line_indent=0, left_indent=0)
    p_cap.paragraph_format.keep_with_next = False
    
    # Tạo bookmark cho hình: e.g. "Hình 1.1: Trụ sở..." -> "fig_1_1"
    m_fig = re.search(r'Hình\s+(\d+)\.(\d+)', fig_title)
    if m_fig:
        bm_name = f"fig_{m_fig.group(1)}_{m_fig.group(2)}"
        add_bookmark_to_paragraph(p_cap, bm_name, get_next_bm_id())
    
    if ":" in fig_title:
        lbl, t_rest = fig_title.split(":", 1)
        r_lbl = p_cap.add_run(lbl.strip() + ": ")
        r_lbl.font.name = "Times New Roman"
        r_lbl.font.size = Pt(11)
        r_lbl.font.bold = True
        r_lbl.font.italic = True
        r_lbl.font.color.rgb = RGBColor(0, 0, 0)
        
        r_t = p_cap.add_run(t_rest.strip())
        r_t.font.name = "Times New Roman"
        r_t.font.size = Pt(11)
        r_t.font.italic = True
        r_t.font.color.rgb = RGBColor(0, 0, 0)
    else:
        run_cap = p_cap.add_run(fig_title)
        run_cap.font.name = "Times New Roman"
        run_cap.font.size = Pt(11)
        run_cap.font.bold = True
        run_cap.font.italic = True
        run_cap.font.color.rgb = RGBColor(0, 0, 0)

    # Phân tích kỹ thuật chi tiết phía dưới hình
    if fig_desc:
        add_body_p(doc, fig_desc, bold_prefix="* Phân tích chức năng và giải pháp kỹ thuật: ")

def add_table_header(row, headers, col_widths=None):
    for idx, (title, width) in enumerate(zip(headers, col_widths if col_widths else [None]*len(headers))):
        cell = row.cells[idx]
        set_cell_margins(cell, top=100, bottom=100, left=120, right=120)
        p = cell.paragraphs[0]
        format_paragraph(p, space_before=2, space_after=2, align=WD_ALIGN_PARAGRAPH.CENTER, first_line_indent=0)
        r = p.add_run(title)
        r.font.name = "Times New Roman"
        r.font.size = Pt(10.5)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0, 0, 0)
        if width:
            cell.width = width


def add_toc_entry(doc, title, page_num, level=0, anchor=None):
    p = doc.add_paragraph()
    left_indent_cm = 0 if level == 0 else (0.6 if level == 1 else 1.2)
    format_paragraph(p, space_before=3 if level == 0 else 1, space_after=1, align=WD_ALIGN_PARAGRAPH.LEFT, first_line_indent=0, left_indent=left_indent_cm)
    
    pPr = p._p.get_or_add_pPr()
    tabs_elem = parse_xml(f'<w:tabs {nsdecls("w")}><w:tab w:val="right" w:leader="dot" w:pos="9072"/></w:tabs>')
    pPr.append(tabs_elem)
    
    clean_title = title.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
    sz_val = 23 if level == 0 else (22 if level == 1 else 21)
    b_tag = '<w:b/>' if (level == 0) else ''
    i_tag = '<w:i/>' if (level == 2) else ''
    
    if anchor:
        hl_xml = f'''
        <w:hyperlink {nsdecls("w")} w:anchor="{anchor}" w:history="1">
            <w:r>
                <w:rPr>
                    <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
                    <w:sz w:val="{sz_val}"/>
                    {b_tag}
                    {i_tag}
                    <w:color w:val="000000"/>
                </w:rPr>
                <w:t xml:space="preserve">{clean_title}</w:t>
            </w:r>
            <w:r>
                <w:rPr>
                    <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
                    <w:sz w:val="{sz_val}"/>
                    <w:color w:val="000000"/>
                </w:rPr>
                <w:tab/>
            </w:r>
            <w:r>
                <w:rPr>
                    <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
                    <w:sz w:val="{sz_val}"/>
                    {b_tag}
                    <w:color w:val="000000"/>
                </w:rPr>
                <w:t>{page_num}</w:t>
            </w:r>
        </w:hyperlink>
        '''
        p._p.append(parse_xml(hl_xml))
    else:
        r_title = p.add_run(title)
        r_title.font.name = "Times New Roman"
        r_title.font.size = Pt(11.5 if level == 0 else (11.0 if level == 1 else 10.5))
        r_title.font.bold = (level == 0)
        r_title.font.italic = (level == 2)
        r_title.font.color.rgb = RGBColor(0, 0, 0)
        
        r_tab = p.add_run("\t")
        r_tab.font.name = "Times New Roman"
        
        r_page = p.add_run(str(page_num))
        r_page.font.name = "Times New Roman"
        r_page.font.size = Pt(11.5 if level == 0 else 11.0)
        r_page.font.bold = (level == 0)
        r_page.font.color.rgb = RGBColor(0, 0, 0)

def add_table_caption(doc, label, title):
    p = doc.add_paragraph()
    format_paragraph(p, space_before=10, space_after=3, align=WD_ALIGN_PARAGRAPH.CENTER, first_line_indent=0, left_indent=0)
    p.paragraph_format.keep_with_next = True
    
    # Generate Bookmark cho bảng: e.g. "Bảng 1.1" -> "tbl_1_1", "Bảng PL.1" -> "tbl_pl_1"
    m_tbl = re.search(r'Bảng\s+(\d+|PL)\.(\d+)', label)
    if m_tbl:
        c_part = m_tbl.group(1).lower()
        bm_name = f"tbl_{c_part}_{m_tbl.group(2)}"
        add_bookmark_to_paragraph(p, bm_name, get_next_bm_id())
    
    r_lbl = p.add_run(f"{label}: ")
    r_lbl.font.name = "Times New Roman"
    r_lbl.font.size = Pt(11)
    r_lbl.font.bold = True
    r_lbl.font.color.rgb = RGBColor(0, 0, 0)
    
    r_title = p.add_run(title)
    r_title.font.name = "Times New Roman"
    r_title.font.size = Pt(11)
    r_title.font.bold = True
    r_title.font.italic = True
    r_title.font.color.rgb = RGBColor(0, 0, 0)
    return p

def add_catalog_entry(doc, label, title, page_num, anchor=None):
    p = doc.add_paragraph()
    format_paragraph(p, space_before=2, space_after=2, first_line_indent=0, left_indent=0)
    
    pPr = p._p.get_or_add_pPr()
    tabs_elem = parse_xml(f'<w:tabs {nsdecls("w")}><w:tab w:val="right" w:leader="dot" w:pos="9072"/></w:tabs>')
    pPr.append(tabs_elem)
    
    clean_label = label.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
    clean_title = title.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
    
    if anchor:
        hl_xml = f'''
        <w:hyperlink {nsdecls("w")} w:anchor="{anchor}" w:history="1">
            <w:r>
                <w:rPr>
                    <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
                    <w:sz w:val="22"/>
                    <w:b/>
                    <w:color w:val="000000"/>
                </w:rPr>
                <w:t xml:space="preserve">{clean_label}: </w:t>
            </w:r>
            <w:r>
                <w:rPr>
                    <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
                    <w:sz w:val="22"/>
                    <w:color w:val="000000"/>
                </w:rPr>
                <w:t xml:space="preserve">{clean_title}</w:t>
            </w:r>
            <w:r>
                <w:rPr>
                    <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
                    <w:sz w:val="22"/>
                    <w:color w:val="000000"/>
                </w:rPr>
                <w:tab/>
            </w:r>
            <w:r>
                <w:rPr>
                    <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
                    <w:sz w:val="22"/>
                    <w:b/>
                    <w:color w:val="000000"/>
                </w:rPr>
                <w:t>{page_num}</w:t>
            </w:r>
        </w:hyperlink>
        '''
        p._p.append(parse_xml(hl_xml))
    else:
        r_lbl = p.add_run(f"{label}: ")
        r_lbl.font.name = "Times New Roman"
        r_lbl.font.size = Pt(11)
        r_lbl.font.bold = True
        r_lbl.font.color.rgb = RGBColor(0, 0, 0)
        
        r_title = p.add_run(title)
        r_title.font.name = "Times New Roman"
        r_title.font.size = Pt(11)
        r_title.font.color.rgb = RGBColor(0, 0, 0)
        
        r_tab = p.add_run("\t")
        r_tab.font.name = "Times New Roman"
        r_tab.font.size = Pt(11)
        r_tab.font.color.rgb = RGBColor(0, 0, 0)
        
        r_page = p.add_run(str(page_num))
        r_page.font.name = "Times New Roman"
        r_page.font.size = Pt(11)
        r_page.font.bold = True
        r_page.font.color.rgb = RGBColor(0, 0, 0)


def add_financial_engine_analysis(doc):
    add_h3(doc, "4.1.8. Giải thuật và Cơ chế Tính toán Trợ cấp An sinh Xã hội Chuẩn Y khoa (Core Financial Engine)")
    add_body_p(doc, "Trong các hệ thống quản lý an sinh xã hội cấp chính quyền đô thị, dữ liệu tài chính chi trả trợ cấp ưu đãi cho người có công gắn liền trực tiếp với quyền lợi pháp lý của công dân và dự toán ngân sách nhà nước được Hội đồng nhân dân giao phó. Do đó, việc xây dựng Core Financial Engine đòi hỏi độ chính xác tuyệt đối, triệt tiêu hoàn toàn các rủi ro sai số số học tích lũy.")
    add_body_p(doc, "Các kiểu dữ liệu số thực dấu chấm động thông thường trong khoa học máy tính (như float hoặc double theo tiêu chuẩn IEEE 754) biểu diễn số dưới dạng nhị phân, dẫn đến hiện tượng sai số làm tròn khi thực hiện các phép nhân chia hệ số phần trăm phức tạp. Để tuân thủ nghiêm ngặt quy định của Luật Kế toán và Chuẩn mực Kế toán công Việt Nam, hệ thống bắt buộc sử dụng lớp toán học độ chính xác tùy ý BigDecimal trong nền tảng Java Spring Boot [16]. Toàn bộ các phép nhân chia tỷ lệ suy giảm khả năng lao động và các khoản phụ cấp đều được tính toán với độ chính xác vô hạn và áp dụng chế độ làm tròn RoundingMode.HALF_UP (làm tròn lên khi phần thập phân từ 0.5 trở lên) về hàng đơn vị đồng chẵn.", bold_prefix="1. Nguyên lý số học tài chính chính xác cao với lớp BigDecimal: ")
    add_body_p(doc, "Quy trình giải thuật tính toán được tổ chức thành 4 bước nghiêm ngặt:", bold_prefix="2. Quy trình giải thuật tính toán 4 bước chuẩn mực: ")
    add_body_p(doc, "- Bước 1 (Tiếp nhận và Xác thực): Trích xuất mã loại đối tượng chính sách (Thương binh, Bệnh binh, Mẹ VNAH, Thân nhân Liệt sĩ), tỷ lệ tổn thương cơ thể (từ 21% đến 100%) và điều kiện người chăm sóc phục vụ từ hồ sơ đã được thẩm định y khoa.")
    add_body_p(doc, "- Bước 2 (Nạp mức chuẩn định mức): Nạp động giá trị Mức chuẩn trợ cấp ưu đãi người có công là 2.055.000 đồng/tháng (theo Nghị định 75/2021/NĐ-CP [4] và Nghị định 55/2023/NĐ-CP [5] của Chính phủ).")
    add_body_p(doc, "- Bước 3 (Xác định hệ số và Tính trợ cấp cơ bản): Áp dụng công thức nội suy hệ số định mức trợ cấp: Đối với Thương binh có tỷ lệ suy giảm từ 21% trở lên, trợ cấp tháng = Mức chuẩn x Hệ số tổn thương; đối với Mẹ Việt Nam Anh hùng, mức trợ cấp tiền tuất được ấn định cố định bằng 3.0 lần mức chuẩn (tương đương 6.165.000 VNĐ).")
    add_body_p(doc, "- Bước 4 (Cộng dồn phụ cấp và Đóng gói phản hồi): Tự động kiểm tra điều kiện hưởng phụ cấp người chăm sóc (bằng 1.0 lần mức chuẩn, tương đương 2.055.000 VNĐ) đối với trường hợp tỷ lệ tổn thương cơ thể từ 81% trở lên hoặc Mẹ Việt Nam Anh hùng. Tổng số tiền thực nhận = Trợ cấp hàng tháng + Phụ cấp chăm sóc + Các khoản phụ cấp đặc thù. Kết quả được đóng gói cùng mã kiểm tra tính toàn vẹn Checksum trước khi ghi vào sổ cái tài chính.")

    add_table_caption(doc, "Bảng 4.1", "Ma trận quy tắc nghiệp vụ và công thức tính toán trợ cấp ưu đãi người có công")
    rules_data = [
        ("Thương binh (21% - 80%)", "Mức chuẩn x Hệ số thương tật (nội suy NĐ 75/2021)", "Không áp dụng", "Trợ cấp tháng theo tỷ lệ thương tật"),
        ("Thương binh nặng (>= 81%)", "Mức chuẩn x Hệ số thương tật (tối đa hệ số 3.986)", "1.0 x Mức chuẩn (2.055.000 VNĐ)", "Trợ cấp tháng + Phụ cấp người phục vụ"),
        ("Bà mẹ Việt Nam Anh hùng", "3.0 x Mức chuẩn (6.165.000 VNĐ)", "1.0 x Mức chuẩn (2.055.000 VNĐ)", "8.220.000 VNĐ / tháng cố định"),
        ("Thân nhân Liệt sĩ (Tuất hàng tháng)", "1.0 x Mức chuẩn (2.055.000 VNĐ / định suất)", "Không áp dụng", "Theo số lượng định suất thân nhân hợp lệ"),
        ("Mai táng phí (khi từ trần)", "10.0 x Mức chuẩn (20.550.000 VNĐ một lần)", "Không áp dụng", "Chi trả một lần duy nhất cho thân nhân mai táng")
    ]
    t_rules = doc.add_table(rows=len(rules_data) + 1, cols=4)
    set_table_borders(t_rules)
    t_rules.alignment = WD_TABLE_ALIGNMENT.CENTER
    col_w_r = [Inches(1.8), Inches(2.2), Inches(1.8), Inches(1.4)]
    add_table_header(t_rules.rows[0], ["Nhóm đối tượng chính sách", "Công thức trợ cấp cơ bản", "Định mức phụ cấp kèm theo", "Tổng mức chi trả thực tế"], col_w_r)
    for idx, (dt, ct, pc, tt) in enumerate(rules_data):
        row = t_rules.rows[idx + 1]
        for c_i, val in enumerate([dt, ct, pc, tt]):
            cell = row.cells[c_i]
            set_cell_margins(cell, top=60, bottom=60, left=80, right=80)
            p = cell.paragraphs[0]
            format_paragraph(p, space_before=1, space_after=1, align=WD_ALIGN_PARAGRAPH.CENTER if c_i in [2] else WD_ALIGN_PARAGRAPH.LEFT, first_line_indent=0)
            r = p.add_run(val)
            r.font.name = "Times New Roman"
            r.font.size = Pt(9.5)
            if c_i == 0:
                r.font.bold = True

def add_currency_spelling_section(doc):
    add_h3(doc, "4.1.9. Giải thuật Chuyển đổi Số tiền thành Chữ Tiếng Việt Chuẩn Kế toán Biểu mẫu C70a-HD")
    add_body_p(doc, "Theo quy định tại Thông tư số 101/2018/TT-BTC của Bộ Tài chính [10] hướng dẫn quản lý kinh phí an sinh xã hội, trên tất cả các chứng từ kế toán chi tiền (tiêu biểu là Phiếu chi trợ cấp người có công Mẫu C70a-HD), dòng 'Số tiền bằng chữ' có giá trị pháp lý quyết định cao nhất nhằm loại trừ hoàn toàn nguy cơ sửa chữa, thêm bớt chữ số trên chứng từ in.")
    add_body_p(doc, "Giải thuật tiếp nhận số tiền nguyên dương (ví dụ: 20.550.000 VNĐ) và thực hiện phân tách từ phải sang trái thành từng nhóm 3 chữ số (Block 3). Mỗi nhóm gồm 3 hàng: hàng trăm (c2), hàng chục (c1) và hàng đơn vị (c0). Các nhóm được gắn nhãn tương ứng với các lớp bậc lũy thừa của 1.000: Lớp đơn vị, Lớp nghìn, Lớp triệu, Lớp tỷ.", bold_prefix="1. Nguyên lý phân rã khối tam phân (Three-digit Chunking): ")
    add_body_p(doc, "Tiếng Việt có các quy tắc biến âm phức tạp tùy thuộc vào chữ số đứng liền kề, đòi hỏi giải thuật phải kiểm soát chính xác:", bold_prefix="2. Xử lý các quy tắc ngữ pháp biến âm đặc thù trong tiếng Việt: ")
    add_body_p(doc, "- Quy tắc chữ số 0 ở hàng chục: Khi chữ số hàng trăm c2 > 0 và chữ số hàng chục c1 = 0 nhưng hàng đơn vị c0 > 0, đọc là 'lẻ' (hoặc 'linh'), ví dụ: 105 đọc là 'một trăm lẻ năm'.")
    add_body_p(doc, "- Quy tắc chữ số 1 ở hàng đơn vị: Nếu hàng chục c1 >= 2, đọc biến âm thành 'mốt' (ví dụ: 21 đọc là 'hai mươi mốt'); nếu hàng chục c1 = 0 hoặc c1 = 1, giữ nguyên cách đọc là 'một' (ví dụ: 01 đọc là 'lẻ một', 11 đọc là 'mười một').")
    add_body_p(doc, "- Quy tắc chữ số 5 ở hàng đơn vị: Nếu hàng chục c1 >= 1, đọc biến âm thành 'lăm' (ví dụ: 15 đọc là 'mười lăm', 25 đọc là 'hai mươi lăm'); nếu hàng chục c1 = 0, giữ nguyên cách đọc là 'năm' (ví dụ: 05 đọc là 'lẻ năm').")
    add_body_p(doc, "- Quy tắc chữ số 1 ở hàng chục: Khi c1 = 1, đọc là 'mười' (thay vì 'một mươi').")
    add_body_p(doc, "Sau khi xử lý tuần tự từng nhóm 3 chữ số và ghép nối với tên lớp đơn vị ('tỷ', 'triệu', 'nghìn'), chuỗi ký tự kết quả được chuẩn hóa loại bỏ khoảng trắng kép, tự động viết hoa chữ cái đầu câu và thêm hậu tố 'đồng chẵn.' theo đúng quy chuẩn biểu mẫu tài chính nhà nước (ví dụ: 'Hai mươi triệu năm trăm năm mươi nghìn đồng chẵn.').", bold_prefix="3. Chuẩn hóa kết quả văn bản hành chính công: ")

    add_table_caption(doc, "Bảng 4.2", "Bảng ma trận quy tắc ngữ pháp chuyển đổi số tiền thành chữ tiếng Việt")
    spelling_rules = [
        ("Hàng trăm (c2)", "c2 in [0..9]", "c2 > 0: đọc 'c2 trăm'; c2 = 0 nhưng nhóm có đơn vị: đọc 'không trăm'"),
        ("Hàng chục (c1 = 0)", "c1 = 0, c0 > 0", "Đọc là 'lẻ' kèm tên chữ số đơn vị (ví dụ: 05 -> 'lẻ năm')"),
        ("Hàng chục (c1 = 1)", "c1 = 1", "Đọc là 'mười' (ví dụ: 12 -> 'mười hai', 15 -> 'mười lăm')"),
        ("Hàng chục (c1 >= 2)", "c1 in [2..9]", "Đọc là 'c1 mươi' (ví dụ: 20 -> 'hai mươi', 50 -> 'năm mươi')"),
        ("Hàng đơn vị (c0 = 1)", "c1 >= 2", "Biến âm đọc là 'mốt' (ví dụ: 21 -> 'hai mươi mốt')"),
        ("Hàng đơn vị (c0 = 5)", "c1 >= 1", "Biến âm đọc là 'lăm' (ví dụ: 35 -> 'ba mươi lăm')"),
        ("Hậu tố chứng từ", "Cuối chuỗi", "Viết hoa chữ đầu, thêm hậu tố 'đồng chẵn.' chuẩn kế toán C70a-HD")
    ]
    t_spell = doc.add_table(rows=len(spelling_rules) + 1, cols=3)
    set_table_borders(t_spell)
    t_spell.alignment = WD_TABLE_ALIGNMENT.CENTER
    col_w_s = [Inches(1.8), Inches(1.8), Inches(3.6)]
    add_table_header(t_spell.rows[0], ["Vị trí chữ số", "Điều kiện logic", "Quy tắc ngữ pháp tiếng Việt áp dụng"], col_w_s)
    for idx, (pos, cond, rule) in enumerate(spelling_rules):
        row = t_spell.rows[idx + 1]
        for c_i, val in enumerate([pos, cond, rule]):
            cell = row.cells[c_i]
            set_cell_margins(cell, top=60, bottom=60, left=80, right=80)
            p = cell.paragraphs[0]
            format_paragraph(p, space_before=1, space_after=1, align=WD_ALIGN_PARAGRAPH.CENTER if c_i == 1 else WD_ALIGN_PARAGRAPH.LEFT, first_line_indent=0)
            r = p.add_run(val)
            r.font.name = "Times New Roman"
            r.font.size = Pt(9.5)
            if c_i == 0:
                r.font.bold = True

def add_bao_giam_workflow_section(doc):
    add_h3(doc, "4.1.10. Quy trình và Cơ chế Xử lý Nghiệp vụ Báo giảm Khai tử và Ngắt Chi trả Trợ cấp")
    add_body_p(doc, "Trong công tác quản lý chính sách ưu đãi an sinh xã hội, việc kiểm soát biến động giảm (khi đối tượng thụ hưởng từ trần) là một quy trình pháp lý đặc biệt quan trọng. Nếu thông tin khai tử không được cập nhật kịp thời, danh sách chi trả trợ cấp hàng tháng sẽ tiếp tục phát sinh dự toán, dẫn đến rủi ro chi thừa ngân sách nhà nước và gây nhiều khó khăn cho công tác thu hồi sau này.")
    add_body_p(doc, "Quy trình xử lý nghiệp vụ được tự động hóa đồng bộ qua 4 giai đoạn liên hoàn:", bold_prefix="1. Luồng xử lý liên hoàn 4 giai đoạn tự động hóa: ")
    add_body_p(doc, "- Giai đoạn 1 (Xác thực pháp lý và Kiểm tra hồ sơ): Cán bộ Bộ phận Một cửa tiếp nhận hồ sơ báo giảm gồm: Giấy trích lục khai tử chính thức do UBND phường cấp, bản gốc sổ ưu đãi người có công, căn cước công dân và giấy tờ chứng minh quan hệ nhân thân của người khai báo. Cán bộ đối chiếu mã hồ sơ trên hệ thống để xác thực tính hợp lệ.")
    add_body_p(doc, "- Giai đoạn 2 (Chuyển trạng thái và Khóa dữ liệu): Hệ thống ghi nhận sự kiện từ trần, tự động chuyển đổi trạng thái hồ sơ của đối tượng từ 'DA_DUYET' (Đang thụ hưởng) sang 'DA_TU_TRAN'. Ngay lập tức, cơ chế khóa dữ liệu (Data Freezing) được kích hoạt để ngăn chặn mọi thao tác chỉnh sửa thông tin cá nhân của đối tượng.")
    add_body_p(doc, "- Giai đoạn 3 (Tự động ngắt chi trả định kỳ): Hệ thống kích hoạt cơ chế ngắt chi trả đồng bộ, loại trừ vĩnh viễn mã hồ sơ này ra khỏi toàn bộ danh sách phát tiền hàng tháng ở tất cả các kỳ tiếp theo. Hệ thống tự động ghi nhật ký kiểm toán (Audit Trail) ghi nhận ngày giờ ngắt chi trả, danh tính cán bộ tiếp nhận và số hiệu trích lục khai tử.")
    add_body_p(doc, "- Giai đoạn 4 (Khởi tạo Quyết định Mai táng phí Mẫu số 02): Song song với việc khóa chi trả thường xuyên, hệ thống tự động sinh hồ sơ trợ cấp Mai táng phí một lần theo quy định tại Nghị định 131/2021/NĐ-CP [3]. Định mức trợ cấp mai táng được tự động áp giá bằng 10 tháng mức chuẩn (10 x 2.055.000 = 20.550.000 VNĐ). Dự thảo Quyết định Mẫu số 02 được đẩy sang luồng phê duyệt của Lãnh đạo Phòng và chuyển tiếp sang phân hệ Kế toán để xuất Phiếu chi Mẫu C70a-HD theo Thông tư 101/2018/TT-BTC [10] chi trả cho thân nhân.")
    add_body_p(doc, "Toàn bộ chuỗi 4 giai đoạn trên được bao bọc trong một Giao dịch cơ sở dữ liệu duy nhất (Atomic Transaction). Nếu có bất kỳ bước nào gặp sự cố (như lỗi kết nối máy chủ hoặc xung đột dữ liệu), toàn bộ trạng thái sẽ được Rollback về ban đầu, bảo đảm không xảy ra tình trạng trạng thái hồ sơ đã chuyển sang từ trần nhưng lệnh chi trả vẫn chưa được ngắt.", bold_prefix="2. Cơ chế bảo đảm tính toàn vẹn giao dịch (Database Transaction ACID): ")

    add_table_caption(doc, "Bảng 4.3", "Ma trận chuyển đổi trạng thái và tác động nghiệp vụ khi thực hiện báo giảm khai tử")
    status_matrix = [
        ("Trạng thái Hồ sơ NCC", "DA_DUYET -> DA_TU_TRAN", "Khóa toàn bộ quyền chỉnh sửa nhân thân; kích hoạt cờ đối tượng đã qua đời"),
        ("Danh sách Chi trả Hàng tháng", "ACTIVE -> DISABLED", "Tự động ngắt phát tiền ở toàn bộ các kỳ tiếp theo; loại khỏi danh sách chuyển khoản"),
        ("Chế độ Mai táng phí", "Tạo mới Quyết định Mẫu 02", "Tự động áp định mức 10 x Mức chuẩn = 20.550.000 VNĐ gán cho thân nhân nộp hồ sơ"),
        ("Phân hệ Kế toán - Tài chính", "Chờ xuất Phiếu chi C70a-HD", "Nạp dữ liệu người nhận tiền mai táng, chuyển kế toán trưởng ký duyệt và chi trả"),
        ("Nhật ký Kiểm toán (Audit)", "Ghi vết hệ thống", "Lưu vết thời gian, cán bộ thụ lý, số quyết định trích lục khai tử phục vụ thanh tra")
    ]
    t_status = doc.add_table(rows=len(status_matrix) + 1, cols=3)
    set_table_borders(t_status)
    t_status.alignment = WD_TABLE_ALIGNMENT.CENTER
    col_w_st = [Inches(1.8), Inches(2.2), Inches(3.2)]
    add_table_header(t_status.rows[0], ["Phân hệ / Đối tượng tác động", "Sự kiện chuyển đổi trạng thái", "Tác động nghiệp vụ và an toàn dữ liệu"], col_w_st)
    for idx, (obj, evt, eff) in enumerate(status_matrix):
        row = t_status.rows[idx + 1]
        for c_i, val in enumerate([obj, evt, eff]):
            cell = row.cells[c_i]
            set_cell_margins(cell, top=60, bottom=60, left=80, right=80)
            p = cell.paragraphs[0]
            format_paragraph(p, space_before=1, space_after=1, align=WD_ALIGN_PARAGRAPH.CENTER if c_i == 1 else WD_ALIGN_PARAGRAPH.LEFT, first_line_indent=0)
            r = p.add_run(val)
            r.font.name = "Times New Roman"
            r.font.size = Pt(9.5)
            if c_i == 0:
                r.font.bold = True

def add_appendix_2_schema_specification(doc):
    add_h2(doc, "PHỤ LỤC 2: ĐẶC TẢ LƯỢC ĐỒ VÀ RÀNG BUỘC TOÀN VẸN CƠ SỞ DỮ LIỆU MYSQL")
    add_body_p(doc, "Cơ sở dữ liệu quản lý an sinh xã hội ql_nguoi_co_cong được thiết kế trên hệ quản trị CSDL MySQL 8.0 [20] với Storage Engine InnoDB theo nguyên lý [18]. Toàn bộ lược đồ dữ liệu tuân thủ chuẩn hóa 3NF [20], áp dụng chặt chẽ các ràng buộc toàn vẹn thực thể, toàn vẹn tham chiếu và chiến lược đánh chỉ mục B-Tree tối ưu hóa hiệu năng truy vấn cho toàn bộ 14 phường trực thuộc.")
    add_body_p(doc, "Lưu trữ định danh các phường thuộc thành phố Thủ Dầu Một. Cấu trúc gồm: ward_id (Khóa chính tự tăng AUTO_INCREMENT, kiểu INT), ward_name (Tên phường, VARCHAR(100), NOT NULL), district_name (Tên quận/thành phố, VARCHAR(100), DEFAULT 'TP. Thủ Dầu Một'), created_at (Thời gian khởi tạo bản ghi, DATETIME).", bold_prefix="1. Lược đồ Bảng dm_phuong (Danh mục 14 đơn vị hành chính cấp phường): ")
    add_body_p(doc, "Lưu trữ hồ sơ quản lý gốc của người có công. Cấu trúc gồm: ho_so_id (Khóa chính BIGINT AUTO_INCREMENT), ma_so_quan_ly (Mã hồ sơ định danh duy nhất UNIQUE, VARCHAR(30)), so_cccd (Số căn cước công dân 12 chữ số UNIQUE, VARCHAR(12)), ho_ten (Họ và tên đối tượng, VARCHAR(100)), ngay_sinh (Ngày tháng năm sinh, DATE), gioi_tinh (Giới tính, ENUM('NAM', 'NU')), dia_chi_thuong_tru (Địa chỉ thường trú chi tiết, VARCHAR(255)), ward_id (Khóa ngoại tham chiếu dm_phuong, INT), ma_loai_dt (Mã loại đối tượng, VARCHAR(20)), ty_le_thuong_tat (Tỷ lệ tổn thương y khoa %, INT), trang_thai_hs (Trạng thái quản lý, ENUM('MOI_TIEP_NHAN', 'CHO_DUYET', 'DA_DUYET', 'TU_CHOI', 'DA_TU_TRAN')), created_at (Thời gian tiếp nhận, DATETIME).", bold_prefix="2. Lược đồ Bảng ho_so_ncc (Bảng trung tâm Quản lý Hồ sơ Người có công): ")
    add_body_p(doc, "Khóa ngoại fk_hs_ward liên kết trường ward_id của bảng ho_so_ncc với bảng dm_phuong(ward_id). Cơ chế toàn vẹn áp dụng quy tắc ON DELETE RESTRICT và ON UPDATE CASCADE nhằm bảo vệ tuyệt đối dữ liệu lịch sử đối tượng chính sách, ngăn chặn việc vô tình xóa địa bàn hành chính khi vẫn còn hồ sơ liên kết.", bold_prefix="3. Ràng buộc toàn vẹn tham chiếu (Referential Integrity): ")
    add_body_p(doc, "Hệ thống thiết lập 2 tầng chỉ mục chuyên biệt:", bold_prefix="4. Chiến lược Đánh chỉ mục B-Tree Index tối ưu hiệu năng: ")
    add_body_p(doc, "+ Chỉ mục đơn trường idx_hs_cccd: Đánh trên trường so_cccd nhằm tối ưu hóa các thao tác tìm kiếm, tra cứu hồ sơ của công dân theo số Căn cước công dân, đưa tốc độ tìm kiếm đạt độ phức tạp thuật toán O(log N) với thời gian phản hồi dưới 50ms.")
    add_body_p(doc, "+ Chỉ mục kết hợp idx_hs_ward_status: Đánh trên cặp trường (ward_id, trang_thai_hs) nhằm phục vụ các truy vấn lọc danh sách hồ sơ đa điều kiện cho các màn hình thẩm định và kết xuất báo cáo thống kê phân tầng theo từng phường.")
    add_body_p(doc, "Toàn bộ cơ sở dữ liệu được khởi tạo với bộ ký tự chuẩn CHARACTER SET utf8mb4 và Collation utf8mb4_unicode_ci. Tiêu chuẩn này bảo đảm lưu trữ chính xác 100% các ký tự tiếng Việt có dấu, họ tên ghép và các ký tự hành chính đặc thù mà không phát sinh lỗi mã hóa phông chữ trên mọi môi trường máy chủ.", bold_prefix="5. Tiêu chuẩn Bảng mã và Định dạng Lưu trữ Tiếng Việt: ")

def build_document():
    print("Bắt đầu khởi tạo tài liệu Word hoàn chỉnh 100 trang...")
    doc = docx.Document()
    
    # ==========================================
    # 1. TRANG BÌA CHÍNH (BÌA CỨNG NGOÀI MÀU XANH DƯƠNG THEO KHOA QUY ĐỊNH)
    # ==========================================
    print("1. Tạo Trang Bìa chính (Bìa cứng viền xanh dương do Khoa quy định)...")
    s1 = doc.sections[0]
    s1.page_width = Cm(21.0)
    s1.page_height = Cm(29.7)
    s1.top_margin = Cm(2.0)
    s1.bottom_margin = Cm(2.0)
    s1.left_margin = Cm(3.0)
    s1.right_margin = Cm(2.0)
    s1.different_first_page_header_footer = True
    set_page_borders(s1, color="002060", val="double", sz="18", space="20")
    add_cover_page(doc, is_outer=True)

    # ==========================================
    # 2. TRANG BÌA PHỤ (BÌA LÓT TRONG VIỀN ĐEN)
    # ==========================================
    print("2. Tạo Trang Bìa phụ (Bìa lót trong viền đen)...")
    s2 = doc.add_section(docx.enum.section.WD_SECTION.NEW_PAGE)
    s2.page_width = Cm(21.0)
    s2.page_height = Cm(29.7)
    s2.top_margin = Cm(2.0)
    s2.bottom_margin = Cm(2.0)
    s2.left_margin = Cm(3.0)
    s2.right_margin = Cm(2.0)
    s2.header.is_linked_to_previous = False
    s2.footer.is_linked_to_previous = False
    set_page_borders(s2, color="000000", val="double", sz="18", space="20")
    add_cover_page(doc, is_outer=False)

    # ==========================================
    # 3. SECTION NỘI DUNG CHÍNH (TỪ LỜI CẢM ƠN TRỞ ĐI, KHÔNG VIỀN)
    # ==========================================
    print("3. Tạo Section nội dung chính (Lời cảm ơn, Mục lục, Các chương)...")
    s3 = doc.add_section(docx.enum.section.WD_SECTION.NEW_PAGE)
    s3.page_width = Cm(21.0)
    s3.page_height = Cm(29.7)
    s3.top_margin = Cm(2.0)
    s3.bottom_margin = Cm(2.0)
    s3.left_margin = Cm(3.0)
    s3.right_margin = Cm(2.0)
    s3.header.is_linked_to_previous = False
    s3.footer.is_linked_to_previous = False
    set_page_borders(s3, val="none")

    # Header & Footer cho Section 3
    hp = s3.header.paragraphs[0]
    hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    hrun = hp.add_run("Báo cáo Thực tập Doanh nghiệp | Đoàn Minh Quân - MSSV: 2224801030137")
    hrun.font.name = "Times New Roman"
    hrun.font.size = Pt(8.5)
    hrun.font.italic = True
    hrun.font.color.rgb = RGBColor(0, 0, 0)

    fp = s3.footer.paragraphs[0]
    fp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    frun = fp.add_run("Trang ")
    frun.font.name = "Times New Roman"
    frun.font.size = Pt(9.5)
    frun.font.color.rgb = RGBColor(0, 0, 0)
    fldSimple = OxmlElement('w:fldSimple')
    fldSimple.set(qn('w:instr'), 'PAGE')
    fp._p.append(fldSimple)

    # ==========================================
    # 10. LỜI CẢM ƠN
    # ==========================================
    print("10. Tạo Lời cảm ơn...")
    add_h1(doc, "LỜI CẢM ƠN", anchor="sec_thanks")
    for para in LOI_CAM_ON.split("\n\n"):
        add_body_p(doc, para)

    doc.add_page_break()

    # ==========================================
    # 11. MỤC LỤC TỔNG THỂ (CHI TIẾT VÀ CHUẨN ĐẸP NHƯ V2)
    # ==========================================
    print("11. Tạo Mục Lục Chi Tiết Chuẩn Học Thuật...")
    add_h1(doc, "MỤC LỤC", in_toc=False, align=WD_ALIGN_PARAGRAPH.CENTER)

    # Trường cập nhật tự động của Word
    p_toc = doc.add_paragraph()
    format_paragraph(p_toc, space_before=2, space_after=4, align=WD_ALIGN_PARAGRAPH.LEFT, first_line_indent=0)
    r_toc = p_toc.add_run()
    r_toc._r.append(parse_xml(r'<w:fldChar %s w:fldCharType="begin"/>' % nsdecls('w')))
    r_toc._r.append(parse_xml(r'<w:instrText %s xml:space="preserve"> TOC \o "1-3" \h \z \u </w:instrText>' % nsdecls('w')))
    r_toc._r.append(parse_xml(r'<w:fldChar %s w:fldCharType="separate"/>' % nsdecls('w')))
    r_toc._r.append(parse_xml(r'<w:fldChar %s w:fldCharType="end"/>' % nsdecls('w')))

    detailed_toc_items = [
        ("LỜI CẢM ƠN", 3, 0),
        ("DANH MỤC CÁC KÝ TỰ, CHỮ VIẾT TẮT", 25, 0),
        ("DANH MỤC BẢNG BIỂU", 27, 0),
        ("DANH MỤC HÌNH VẼ", 28, 0),
        ("MỞ ĐẦU", 29, 0),
        ("1. Tính cấp thiết của đề tài", 29, 1),
        ("2. Mục đích và nhiệm vụ nghiên cứu", 29, 1),
        ("3. Đối tượng và phạm vi nghiên cứu", 30, 1),
        ("4. Phương pháp nghiên cứu", 30, 1),
        ("5. Ý nghĩa khoa học và thực tiễn", 31, 1),
        ("CHƯƠNG 1. TỔNG QUAN VỀ CƠ QUAN THỰC TẬP & BÀI TOÁN NGHIỆP VỤ", 32, 0),
        ("1.1. Lịch sử hình thành và phát triển của đơn vị thực tập", 32, 1),
        ("1.2. Chức năng và nhiệm vụ hoạt động của cơ quan", 33, 1),
        ("1.3. Sơ đồ cơ cấu tổ chức và bố trí nhân sự", 33, 1),
        ("1.4. Khảo sát hiện trạng công tác quản lý chính sách người có công", 35, 1),
        ("1.5. Căn cứ pháp lý và các quy định nhà nước nền tảng", 35, 1),
        ("1.6. Những bất cập, khó khăn của quy trình thủ công cũ", 36, 1),
        ("1.7. Mục tiêu và phạm vi xây dựng dự án", 36, 1),
        ("CHƯƠNG 2. CƠ SỞ LÝ THUYẾT VÀ CÔNG NGHỆ ÁP DỤNG", 37, 0),
        ("2.1. Tổng quan kiến trúc phần mềm Hybrid Modular Monolith", 37, 1),
        ("2.2. Công nghệ Frontend và thiết kế giao diện", 39, 1),
        ("2.3. Công nghệ Backend và dịch vụ xử lý trung tâm", 39, 1),
        ("2.4. Hệ quản trị cơ sở dữ liệu MySQL 8.0 và chuẩn hóa CSDL", 40, 1),
        ("2.5. Giải pháp tích hợp liên thông LGSP và an toàn thông tin", 40, 1),
        ("2.6. Lý thuyết và quy trình kiểm thử phần mềm (QA/QC)", 41, 1),
        ("CHƯƠNG 3. PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG", 43, 0),
        ("3.1. Phân tích các tác nhân (Actors) và mô hình phân quyền RBAC", 43, 1),
        ("3.2. Sơ đồ Use Case tổng quát và đặc tả các Use Case trọng tâm", 43, 1),
        ("3.3. Thiết kế sơ đồ tuần tự (Sequence Diagrams)", 44, 1),
        ("3.4. Thiết kế cơ sở dữ liệu chi tiết (16 bảng chuẩn 3NF)", 45, 1),
        ("3.5. Từ điển dữ liệu cơ sở dữ liệu MySQL (16 bảng chuẩn 3NF)", 50, 1),
        ("3.6. Đặc tả chi tiết RESTful API Contracts", 61, 1),
        ("CHƯƠNG 4. HIỆN THỰC HÓA HỆ THỐNG VÀ KẾT QUẢ TRIỂN KHAI", 64, 0),
        ("4.1. Hiện thực hóa các thuật toán và logic nghiệp vụ cốt lõi", 64, 1),
        ("4.1.8. Giải thuật và cơ chế tính toán trợ cấp chuẩn y khoa (BigDecimal)", 65, 2),
        ("4.1.9. Giải thuật chuyển đổi số tiền thành chữ tiếng Việt (Mẫu C70a-HD)", 67, 2),
        ("4.1.10. Quy trình và cơ chế xử lý báo giảm khai tử và ngắt chi trả", 68, 2),
        ("4.2. Chi tiết kết quả giao diện hệ thống kèm 21 ảnh chụp thực tế", 70, 1),
        ("CHƯƠNG 5. QUY TRÌNH KIỂM THỬ VÀ BẢO ĐẢM CHẤT LƯỢNG (QA/QC)", 82, 0),
        ("5.1. Kế hoạch kiểm thử và môi trường thực hiện", 82, 1),
        ("5.2. Danh mục Checklist kiểm thử chức năng và giao diện (Bảng 5.1)", 83, 1),
        ("5.3. Bảng kịch bản kiểm thử chi tiết Test Cases Specification (Bảng 5.2)", 85, 1),
        ("5.4. Bảng ghi nhận và theo dõi lỗi phần mềm Bug Report Sheet (Bảng 5.3)", 90, 1),
        ("5.5. Báo cáo tổng kết chất lượng kiểm thử Test Summary Report (Bảng 5.4)", 96, 1),
        ("CHƯƠNG 6. SO SÁNH THỰC TẾ VỚI LÝ THUYẾT VÀ BÀI HỌC KINH NGHIỆM", 97, 0),
        ("6.1. So sánh thực tế với lý thuyết trên giảng đường", 97, 1),
        ("6.2. Những kinh nghiệm thực tiễn rút ra sau quá trình thực tập", 98, 1),
        ("6.3. Đề xuất các giải pháp cải tiến", 98, 1),
        ("CHƯƠNG 7. KẾT LUẬN VÀ KIẾN NGHỊ", 100, 0),
        ("7.1. Đánh giá kết quả đạt được đối với mục tiêu đề ra", 100, 1),
        ("7.2. Những hạn chế còn tồn tại của hệ thống", 101, 1),
        ("7.3. Hướng phát triển trong tương lai", 101, 1),
        ("TÀI LIỆU THAM KHẢO", 102, 0),
        ("PHỤ LỤC", 104, 0),
        ("Phụ lục 1: Biểu mẫu hành chính áp dụng trong hệ thống", 104, 1),
        ("Phụ lục 2: Đặc tả lược đồ và ràng buộc toàn vẹn CSDL MySQL", 104, 1),
        ("Phụ lục 3: Bảng quy đổi định mức trợ cấp pháp lý (Bảng PL.1)", 105, 1),
        ("Phụ lục 4: Thuật ngữ và khái niệm nghiệp vụ an sinh xã hội (Bảng PL.2)", 106, 1)
    ]
    toc_anchors_map = {
        "NHẬT KÝ THỰC TẬP DOANH NGHIỆP (10 TUẦN)": "sec_diary",
        "PHIẾU NHẬN XÉT CỦA ĐƠN VỊ THỰC TẬP": "sec_nx_dn",
        "PHIẾU ĐÁNH GIÁ KẾT QUẢ CỦA CƠ QUAN TIẾP NHẬN": "sec_dg_dn",
        "NHẬN XÉT CỦA GIẢNG VIÊN HƯỚNG DẪN": "sec_nx_gv",
        "PHIẾU ĐÁNH GIÁ CỦA HỘI ĐỒNG THỰC TẬP": "sec_dg_hd",
        "BẢNG ĐÁNH GIÁ CHUẨN ĐẦU RA THỰC TẬP (CELO 1 - 5)": "sec_celo",
        "LỜI CẢM ƠN": "sec_thanks",
        "DANH MỤC CÁC KÝ TỰ, CHỮ VIẾT TẮT": "sec_abbr",
        "DANH MỤC BẢNG BIỂU": "sec_tbl_cat",
        "DANH MỤC HÌNH VẼ": "sec_fig_cat",
        "MỞ ĐẦU": "sec_intro",
        "CHƯƠNG 1. TỔNG QUAN VỀ CƠ QUAN THỰC TẬP & BÀI TOÁN NGHIỆP VỤ": "sec_c1",
        "CHƯƠNG 2. CƠ SỞ LÝ THUYẾT VÀ CÔNG NGHỆ ÁP DỤNG": "sec_c2",
        "CHƯƠNG 3. PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG": "sec_c3",
        "CHƯƠNG 4. HIỆN THỰC HÓA HỆ THỐNG VÀ KẾT QUẢ TRIỂN KHAI": "sec_c4",
        "CHƯƠNG 5. QUY TRÌNH KIỂM THỬ VÀ BẢO ĐẢM CHẤT LƯỢNG (QA/QC)": "sec_c5",
        "CHƯƠNG 6. SO SÁNH THỰC TẾ VỚI LÝ THUYẾT VÀ BÀI HỌC KINH NGHIỆM": "sec_c6",
        "CHƯƠNG 7. KẾT LUẬN VÀ KIẾN NGHỊ": "sec_c7",
        "TÀI LIỆU THAM KHẢO": "sec_ref",
        "PHỤ LỤC": "sec_appendix"
    }
    for item_t, item_pg, item_lvl in detailed_toc_items:
        anchor_val = toc_anchors_map.get(item_t)
        add_toc_entry(doc, item_t, item_pg, level=item_lvl, anchor=anchor_val)

    doc.add_page_break()

    # Danh mục từ viết tắt
    add_h1(doc, "DANH MỤC CÁC KÝ TỰ, CHỮ VIẾT TẮT", anchor="sec_abbr")
    table_abbr = doc.add_table(rows=len(ABBREVIATIONS) + 1, cols=3)
    set_table_borders(table_abbr)
    table_abbr.alignment = WD_TABLE_ALIGNMENT.CENTER
    col_w_a = [Inches(1.2), Inches(2.2), Inches(3.6)]
    add_table_header(table_abbr.rows[0], ["Chữ viết tắt", "Thuật ngữ Tiếng Anh", "Diễn giải Tiếng Việt"], col_w_a)

    for idx, (vi, en, vn) in enumerate(ABBREVIATIONS):
        row = table_abbr.rows[idx + 1]
        bg = "FFFFFF" if idx % 2 == 0 else "F8FAFC"
        for c_idx, val in enumerate([vi, en, vn]):
            cell = row.cells[c_idx]
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=70, bottom=70, left=100, right=100)
            p = cell.paragraphs[0]
            format_paragraph(p, space_before=1, space_after=1, align=WD_ALIGN_PARAGRAPH.CENTER if c_idx == 0 else WD_ALIGN_PARAGRAPH.LEFT, first_line_indent=0)
            run = p.add_run(val)
            run.font.name = "Times New Roman"
            run.font.size = Pt(10)
            if c_idx == 0:
                run.font.bold = True

    doc.add_page_break()

    # Danh mục Bảng biểu
    add_h1(doc, "DANH MỤC BẢNG BIỂU", anchor="sec_tbl_cat")
    list_tables = [
        ("Bảng 1.1", "Nhật ký công việc thực tập doanh nghiệp (17/08/2026 – 20/10/2026)", 4),
        ("Bảng 1.2", "Đánh giá kết quả thực tập dành cho Cán bộ hướng dẫn tại đơn vị", 11),
        ("Bảng 1.3", "Đánh giá thực tập doanh nghiệp dành cho Hội đồng chấm điểm", 15),
        ("Bảng 1.4", "Đánh giá kết quả thực tập theo Chuẩn đầu ra (CELO 1 - 5)", 17),
        ("Bảng 3.1", "Từ điển dữ liệu bảng dm_phuong (Danh mục 14 phường)", 50),
        ("Bảng 3.2", "Từ điển dữ liệu bảng dm_loai_doi_tuong (Danh mục loại đối tượng NCC)", 50),
        ("Bảng 3.3", "Từ điển dữ liệu bảng sys_roles (Danh mục vai trò quản trị RBAC)", 51),
        ("Bảng 3.4", "Từ điển dữ liệu bảng sys_users (Tài khoản cán bộ công chức)", 51),
        ("Bảng 3.5", "Từ điển dữ liệu bảng ho_so_ncc (Bảng trung tâm quản lý hồ sơ NCC)", 52),
        ("Bảng 3.6", "Từ điển dữ liệu bảng quyet_dinh_huong (Quyết định hưởng trợ cấp ưu đãi)", 53),
        ("Bảng 3.7", "Từ điển dữ liệu bảng lich_su_chi_tra (Lịch sử chi trả trợ cấp hàng tháng)", 53),
        ("Bảng 3.8", "Từ điển dữ liệu bảng khao_sat_danh_gia (Khảo sát đánh giá CSAT công dân)", 54),
        ("Bảng 3.9", "Từ điển dữ liệu bảng chi_tiet_tieu_chi_danh_gia (Điểm số 4 tiêu chí SIPAS)", 54),
        ("Bảng 3.10", "Từ điển dữ liệu bảng ho_so_liet_sy (Chi tiết hồ sơ liệt sĩ theo NĐ 131)", 55),
        ("Bảng 3.11", "Từ điển dữ liệu bảng than_nhan_liet_si (Quản lý thân nhân và người thờ cúng)", 56),
        ("Bảng 3.12", "Từ điển dữ liệu bảng ke_hoach_dieu_duong (Kế hoạch điều dưỡng hàng năm)", 56),
        ("Bảng 3.13", "Từ điển dữ liệu bảng danh_sach_dieu_duong (Chi tiết các đợt điều dưỡng)", 57),
        ("Bảng 3.14", "Từ điển dữ liệu bảng ho_so_bao_giam_mai_tang (Báo giảm & QĐ Mai táng Mẫu 02)", 57),
        ("Bảng 3.15", "Từ điển dữ liệu bảng danh_sach_phuong_tien_chinh_hinh (Dụng cụ chỉnh hình)", 58),
        ("Bảng 3.16", "Từ điển dữ liệu bảng nghia_trang_mo_liet_si (Số hóa bản đồ mộ liệt sĩ GIS)", 59),
        ("Bảng 3.17", "Từ điển dữ liệu bảng doi_soat_chi_tra_ngan_hang (Đối soát ngân hàng Đề án 06)", 60),
        ("Bảng 3.18", "Danh mục 12 RESTful API Contracts của hệ thống", 61),
        ("Bảng 4.1", "Ma trận quy tắc nghiệp vụ và công thức tính toán trợ cấp ưu đãi người có công", 66),
        ("Bảng 4.2", "Bảng ma trận quy tắc ngữ pháp chuyển đổi số tiền thành chữ tiếng Việt", 67),
        ("Bảng 4.3", "Ma trận chuyển đổi trạng thái và tác động nghiệp vụ khi thực hiện báo giảm khai tử", 69),
        ("Bảng 5.1", "Danh mục Checklist kiểm thử chức năng và giao diện hệ thống (30 hạng mục)", 83),
        ("Bảng 5.2", "Bảng kịch bản kiểm thử chi tiết Test Cases Specification (50 Test Cases)", 85),
        ("Bảng 5.3", "Bảng ghi nhận và theo dõi lỗi phần mềm Bug Report Sheet (15 lỗi thực tế)", 90),
        ("Bảng 5.4", "Báo cáo tổng kết chất lượng kiểm thử Test Summary Report", 96),
        ("Bảng PL.1", "Bảng quy đổi định mức phụ cấp, trợ cấp ưu đãi người có công theo Nghị định 75/2021/NĐ-CP", 105),
        ("Bảng PL.2", "Thuật ngữ và Khái niệm Nghiệp vụ Hành chính An sinh Xã hội (Theo NĐ 55/2023)", 106)
    ]
    for b_id, b_title, b_page in list_tables:
        m_tbl = re.search(r'Bảng\s+(\d+|PL)\.(\d+)', b_id)
        tbl_anchor = f"tbl_{m_tbl.group(1).lower()}_{m_tbl.group(2)}" if m_tbl else None
        add_catalog_entry(doc, b_id, b_title, b_page, anchor=tbl_anchor)

    doc.add_page_break()

    # Danh mục Hình vẽ
    add_h1(doc, "DANH MỤC HÌNH VẼ", anchor="sec_fig_cat")
    list_figs = [
        ("Hình 1.1", "Trụ sở Phòng Văn hóa và Thông tin thành phố Thủ Dầu Một", 32),
        ("Hình 1.2", "Sơ đồ cơ cấu tổ chức Phòng Văn hóa và Thông tin TP. Thủ Dầu Một", 34),
        ("Hình 2.1", "Sơ đồ Kiến trúc tổng thể phần mềm Hybrid Modular Monolith", 38),
        ("Hình 2.2", "Sơ đồ các nhiệm vụ chính của thực tập sinh chuyển đổi số", 39),
        ("Hình 2.3", "Sơ đồ cơ sở quản lý dữ liệu hồ sơ người có công và phân hệ Backend API", 40),
        ("Hình 2.4", "Sơ đồ Tích hợp hệ thống liên thông dữ liệu qua Trục LGSP", 41),
        ("Hình 2.5", "Sơ đồ Quy trình kiểm thử phần mềm QA/QC 7 bước tiêu chuẩn", 42),
        ("Hình 3.1", "Sơ đồ Tuần tự (Sequence Diagram) thẩm định hồ sơ và tự động tính trợ cấp", 44),
        ("Hình 3.2", "Sơ đồ Mối quan hệ Thực thể CSDL MySQL (ERD Diagram)", 45),
        ("Hình 4.1", "Giao diện Cổng Đăng nhập Phân quyền Quản trị Cấp Sở", 70),
        ("Hình 4.2", "Giao diện Cổng Đăng nhập Cán bộ Chuyên viên Cấp Phòng", 70),
        ("Hình 4.3", "Bảng điều khiển trung tâm Giám sát và Thống kê Toàn diện", 71),
        ("Hình 4.4", "Biểu đồ Phân bổ Kinh phí Trợ cấp Phân tầng theo 14 Phường", 72),
        ("Hình 4.5", "Trình đơn Chuyển đổi Nhanh Vai trò Quản trị và Kiểm toán", 72),
        ("Hình 4.6", "Mẫu Giấy hẹn Tiếp nhận Một cửa Tích hợp Mã QR Code Tra cứu", 73),
        ("Hình 4.7", "Cổng Kiosk Khảo sát và Đánh giá Sự hài lòng Công dân (CSAT)", 73),
        ("Hình 4.8", "Trung tâm Giám sát Chỉ số CSAT và Biểu đồ Radar SIPAS Cán bộ", 74),
        ("Hình 4.9", "Phiếu Chi trả Trợ cấp Người có công Mẫu C70a-HD Tích hợp Mã vạch", 75),
        ("Hình 4.10", "Màn hình Chi tiết Hồ sơ Liệt sĩ và Danh sách Thân nhân Hưởng quyền lợi", 75),
        ("Hình 4.11", "Phân hệ Quản lý Chỉ tiêu và Lập danh sách Điều dưỡng Hàng năm", 76),
        ("Hình 4.12", "Bản đồ Nhiệt (Heatmap) Mật độ Hồ sơ và Phân tích Dữ liệu Phường", 76),
        ("Hình 4.13", "Quản lý Cấp phát Phương tiện Trợ giúp và Dụng cụ Chỉnh hình", 77),
        ("Hình 4.14", "Bản đồ Số Không gian GIS Nghĩa trang Liệt sĩ Tỉnh Bình Dương", 78),
        ("Hình 4.15", "Cổng Dịch vụ Tra cứu Tiến độ Xử lý Hồ sơ Công dân theo Số CCCD", 78),
        ("Hình 4.16", "Quy trình Nghiệp vụ Báo giảm Từ trần và Quyết định Mai táng phí Mẫu 02", 79),
        ("Hình 4.17", "Module Đối soát Tự động Chi trả Ngân hàng (Bank Reconciliation)", 79),
        ("Hình 4.18", "Quy trình Thẩm định Hồ sơ 5 Bước Một cửa và Ký số SmartCA", 80),
        ("Hình 4.19", "Giao diện Cấu hình Định mức Trợ cấp Pháp lý và Tham số Hệ thống", 80),
        ("Hình 4.20", "Modal Tiếp nhận Hồ sơ Người có công Mới có Cơ chế Kiểm tra Dữ liệu Zod", 81),
        ("Hình 4.21", "Modal Số hóa Tài liệu bằng Trí tuệ Nhân tạo (AI OCR) và Trích xuất Dữ liệu", 81)
    ]
    for f_id, f_title, f_page in list_figs:
        m_fig = re.search(r'Hình\s+(\d+)\.(\d+)', f_id)
        fig_anchor = f"fig_{m_fig.group(1)}_{m_fig.group(2)}" if m_fig else None
        add_catalog_entry(doc, f_id, f_title, f_page, anchor=fig_anchor)

    doc.add_page_break()

    # ==========================================
    # 12. MỞ ĐẦU
    # ==========================================
    print("12. Tạo Lời Mở Đầu...")
    add_h1(doc, "MỞ ĐẦU", anchor="sec_intro")
    for section_block in MO_DAU.split("\n\n"):
        lines = section_block.split("\n")
        header_line = lines[0]
        body_lines = lines[1:] if len(lines) > 1 else []
        add_numbered_section_header(doc, header_line)
        for b_line in body_lines:
            add_body_p(doc, b_line)

    doc.add_page_break()

    # ==========================================
    # 13. CHƯƠNG 1: TỔNG QUAN VỀ CƠ SỞ THỰC TẬP
    # ==========================================
    print("13. Tạo Chương 1 (tái sử dụng hình ảnh từ Word V2 gốc)...")
    add_h1(doc, "CHƯƠNG 1. TỔNG QUAN VỀ CƠ QUAN THỰC TẬP & BÀI TOÁN NGHIỆP VỤ", anchor="sec_c1")
    
    parts_c1 = re.split(r'\n(?=1\.\d+\.\s+)', CHUONG_1_TEXT.strip())
    # 1.1. Lịch sử hình thành
    add_chapter_body_blocks(doc, parts_c1[0])
    add_figure(
        doc,
        os.path.join(V2_IMAGES_DIR, "image2.jpg"),
        "Hình 1.1: Trụ sở Phòng Văn hóa và Thông tin thành phố Thủ Dầu Một",
        "Trụ sở làm việc của cơ quan tại đường 30/4, phường Phú Hòa, thành phố Thủ Dầu Một, tỉnh Bình Dương. Nơi tiếp nhận và trực tiếp quản trị các hệ thống CNTT và chuyển đổi số phục vụ nhân dân trên địa bàn thành phố.",
        width=Inches(4.2)
    )

    # 1.2. Chức năng và nhiệm vụ
    if len(parts_c1) > 1:
        add_chapter_body_blocks(doc, parts_c1[1])

    # 1.3. Sơ đồ cơ cấu tổ chức
    if len(parts_c1) > 2:
        add_chapter_body_blocks(doc, parts_c1[2])
        add_figure(
            doc,
            os.path.join(V2_IMAGES_DIR, "image8.png"),
            "Hình 1.2: Sơ đồ cơ cấu tổ chức Phòng Văn hóa và Thông tin TP. Thủ Dầu Một",
            "Cơ cấu tổ chức của cơ quan được xây dựng theo mô hình phân cấp tinh gọn, đảm bảo hiệu lực hiệu quả. Đứng đầu là Trưởng phòng phụ trách chung, Phó Trưởng phòng phụ trách CNTT & Chuyển đổi số. Các bộ phận chuyên môn bao gồm: Bộ phận Văn hóa - Gia đình & Du lịch; Bộ phận Bưu chính, Viễn thông & Tuyên truyền; và Bộ phận CNTT & Chuyển đổi số (nơi sinh viên trực tiếp tham gia thực tập).",
            width=Inches(6.0)
        )

    # 1.4, 1.5, 1.6, 1.7
    for p_blk in parts_c1[3:]:
        add_chapter_body_blocks(doc, p_blk)

    doc.add_page_break()

    # ==========================================
    # 14. CHƯƠNG 2: CƠ SỞ LÝ THUYẾT & CÔNG NGHỆ
    # ==========================================
    print("14. Tạo Chương 2 (tái sử dụng hình ảnh từ Word V2 gốc)...")
    add_h1(doc, "CHƯƠNG 2. CƠ SỞ LÝ THUYẾT VÀ CÔNG NGHỆ ÁP DỤNG", anchor="sec_c2")
    
    parts_c2 = re.split(r'\n(?=2\.\d+\.\s+)', CHUONG_2_TEXT.strip())
    # 2.1. TỔNG QUAN KIẾN TRÚC PHẦN MỀM HYBRID MODULAR MONOLITH
    add_chapter_body_blocks(doc, parts_c2[0])
    
    # Chèn Sơ đồ kiến trúc Hình 2.1
    add_figure(
        doc,
        os.path.join(DIAGRAMS_DIR, "hinh_2_1_kien_truc_he_thong.png"),
        "Hình 2.1: Sơ đồ Kiến trúc tổng thể phần mềm Hybrid Modular Monolith",
        "Kiến trúc tổng thể gồm 4 tầng rõ rệt: Tầng Trình diễn (React 19, TypeScript, Tailwind CSS, TanStack Router); Cổng API Gateway NGINX (SSL Termination, Rate Limiting, CORS); Tầng Dịch vụ Backend kết hợp Node.js Express cho CRUD I/O nhanh và Java Spring Boot cho Engine tính toán tài chính; Tầng CSDL MySQL 8.0 Cluster và Trục liên thông LGSP.",
        width=Inches(5.8)
    )

    # Chèn Sơ đồ nhiệm vụ thực tập sinh chuyển đổi số Hình 2.2 (image11.png từ V2)
    add_figure(
        doc,
        os.path.join(V2_IMAGES_DIR, "image11.png"),
        "Hình 2.2: Sơ đồ các nhiệm vụ chính của thực tập sinh chuyển đổi số",
        "Mô hình phân công nhiệm vụ chuyên môn của thực tập sinh chuyển đổi số tại cơ quan: Vừa nghiên cứu quy trình nghiệp vụ hành chính công, chuẩn hóa thiết kế CSDL quan hệ 3NF, phát triển dịch vụ Backend RESTful API, vừa trực tiếp thiết lập hồ sơ kiểm thử chất lượng phần mềm (QA/QC) chuẩn hóa.",
        width=Inches(6.0)
    )

    # 2.2. CÔNG NGHỆ FRONTEND VÀ GIAO DIỆN
    if len(parts_c2) > 1:
        add_chapter_body_blocks(doc, parts_c2[1])

    # 2.3. CÔNG NGHỆ BACKEND VÀ DỊCH VỤ XỬ LÝ TRUNG TÂM
    if len(parts_c2) > 2:
        add_chapter_body_blocks(doc, parts_c2[2])
        # Chèn Sơ đồ quản lý dữ liệu và backend API Hình 2.3 (image4.png từ V2)
        add_figure(
            doc,
            os.path.join(V2_IMAGES_DIR, "image4.png"),
            "Hình 2.3: Sơ đồ cơ sở quản lý dữ liệu hồ sơ người có công và phân hệ Backend API",
            "Mô hình phân tầng cơ sở dữ liệu và phân hệ Backend RESTful API: Phục vụ quản lý dữ liệu an sinh xã hội tập trung, tối ưu hóa truy vấn I/O bằng Node.js và xử lý số học chính xác bằng Java Spring Boot.",
            width=Inches(5.8)
        )

    # 2.4. HỆ QUẢN TRỊ CƠ SỞ DỮ LIỆU MYSQL 8.0
    if len(parts_c2) > 3:
        add_chapter_body_blocks(doc, parts_c2[3])

    # 2.5. GIẢI PHÁP TÍCH HỢP LIÊN THÔNG LGSP VÀ AN TOÀN THÔNG TIN
    if len(parts_c2) > 4:
        add_chapter_body_blocks(doc, parts_c2[4])
        # Chèn Sơ đồ LGSP Hình 2.4 (image3.png từ V2)
        add_figure(
            doc,
            os.path.join(V2_IMAGES_DIR, "image3.png"),
            "Hình 2.4: Sơ đồ Tích hợp hệ thống liên thông dữ liệu qua Trục LGSP",
            "Mô hình tích hợp liên thông qua Trục LGSP giữa hệ thống nội bộ cấp phường/thành phố với CSDL Tập trung cấp Sở/Tỉnh và Đề án 06/CP: Ứng dụng bảo mật kênh truyền Mutual TLS (mTLS 1.3), xác thực OAuth 2.0 Client Credentials Grant, hàng đợi Message Queue và cơ chế tự động thử lại khi có sự cố đường truyền.",
            width=Inches(6.0)
        )

    # 2.6. LÝ THUYẾT VÀ QUY TRÌNH KIỂM THỬ PHẦN MỀM (QA/QC)
    if len(parts_c2) > 5:
        add_chapter_body_blocks(doc, parts_c2[5])
        # Chèn Sơ đồ quy trình kiểm thử Hình 2.5 (image10.png từ V2)
        add_figure(
            doc,
            os.path.join(V2_IMAGES_DIR, "image10.png"),
            "Hình 2.5: Sơ đồ Quy trình kiểm thử phần mềm QA/QC 7 bước tiêu chuẩn",
            "Quy trình QA/QC chuẩn hóa 7 bước tại cơ quan tiếp nhận: Tiếp nhận yêu cầu -> Phân tích chức năng và biên dữ liệu -> Xây dựng Checklist kiểm thử -> Thiết kế Kịch bản Test Case chi tiết -> Thực thi kiểm thử và lập Bug Report -> Kiểm thử lại (Retest) sau khi Dev sửa lỗi -> Tổng kết và lập báo cáo Test Summary Report.",
            width=Inches(5.8)
        )

    doc.add_page_break()

    # ==========================================
    # 15. CHƯƠNG 3: PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG
    # ==========================================
    print("15. Tạo Chương 3...")
    add_h1(doc, "CHƯƠNG 3. PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG", anchor="sec_c3")
    add_chapter_body_blocks(doc, CHUONG_3_TEXT)

    # Bảng Đặc tả Use Case Chi tiết cho 6 Use Cases trọng tâm
    add_h3(doc, "3.2.1. ĐẶC TẢ CHI TIẾT CÁC USE CASE TRỌNG TÂM")
    for uc in USE_CASE_SPECS:
        add_subhead(doc, f"{uc['id']}: {uc['name']}")
        add_body_p(doc, f"- Tác nhân chính: {uc['actor']}")
        add_body_p(doc, f"- Điều kiện tiên quyết: {uc['pre']}")
        add_body_p(doc, f"- Điều kiện sau khi hoàn thành: {uc['post']}")
        add_body_p(doc, "- Luồng sự kiện chính (Main Success Flow):")
        for step in uc['main_flow']:
            add_body_p(doc, f"  {step}")
        add_body_p(doc, f"- Luồng rẽ nhánh (Alternative Flow): {uc['alt_flow']}")
        add_body_p(doc, f"- Luồng ngoại lệ (Exception Flow): {uc['exception_flow']}")

    # Chèn Sơ đồ tuần tự Sequence Hình 3.1
    add_figure(
        doc,
        os.path.join(DIAGRAMS_DIR, "hinh_3_1_sequence_tham_dinh.png"),
        "Hình 3.1: Sơ đồ Tuần tự thẩm định hồ sơ và tự động tính trợ cấp",
        "Sơ đồ tương tác tuần tự 9 bước giữa Cán bộ Thẩm định (Client), Node.js API Gateway, Spring Boot Financial Core Engine và CSDL MySQL 8.0: Bảo đảm tính độc lập, độ chính xác làm tròn HALF_UP và giao dịch ACID an toàn."
    )

    # Chèn Sơ đồ ERD Hình 3.2 (image12.png từ V2 gốc)
    add_figure(
        doc,
        os.path.join(V2_IMAGES_DIR, "image12.png"),
        "Hình 3.2: Sơ đồ Mối quan hệ Thực thể CSDL MySQL (ERD Diagram)",
        "Sơ đồ ERD thể hiện mối quan hệ giữa bảng trung tâm ho_so_ncc với các bảng danh mục và bảng vệ tinh: dm_phuong (1-N), dm_loai_doi_tuong (1-N), sys_users (1-N), quyet_dinh_huong (1-N), lich_su_chi_tra (1-N), khao_sat_danh_gia (1-N), ho_so_liet_sy (1-1), than_nhan_liet_si (1-N), ke_hoach_dieu_duong (1-N), ho_so_bao_giam_mai_tang (1-1), danh_sach_phuong_tien_chinh_hinh (1-N) và nghia_trang_mo_liet_si.",
        width=Inches(6.0)
    )

    # Từ điển Dữ liệu (Data Dictionary - 16 Bảng CSDL Chuẩn 3NF)
    add_h2(doc, "3.5. TỪ ĐIỂN DỮ LIỆU CƠ SỞ DỮ LIỆU MYSQL (DATA DICTIONARY - 16 BẢNG CHUẨN 3NF)")
    add_body_p(doc, "Cơ sở dữ liệu của hệ thống được thiết kế và chuẩn hóa nghiêm ngặt từ 1NF đến 3NF, loại bỏ hoàn toàn các phụ thuộc hàm từng phần và phụ thuộc bắc cầu. Dưới đây là đặc tả chi tiết cấu trúc trường, kiểu dữ liệu, ràng buộc và ý nghĩa nghiệp vụ của toàn bộ 16 bảng CSDL cốt lõi:")

    for b_idx, tbl in enumerate(DATA_DICTIONARY):
        t_num = f"Bảng 3.{b_idx + 1}"
        add_table_caption(doc, t_num, f"Từ điển dữ liệu bảng `{tbl['table_name']}` ({tbl['description']})")
        
        t_cols = tbl["columns"]
        table_d = doc.add_table(rows=len(t_cols) + 1, cols=4)
        set_table_borders(table_d)
        table_d.alignment = WD_TABLE_ALIGNMENT.CENTER
        col_w_td = [Inches(1.5), Inches(1.2), Inches(1.8), Inches(2.5)]
        add_table_header(table_d.rows[0], ["Tên cột (Field Name)", "Kiểu dữ liệu", "Ràng buộc (Constraints)", "Ý nghĩa nghiệp vụ"], col_w_td)

        for r_i, (col, dtype, cons, desc) in enumerate(t_cols):
            row = table_d.rows[r_i + 1]
            bg = "FFFFFF" if r_i % 2 == 0 else "F8FAFC"
            for c_i, val in enumerate([col, dtype, cons, desc]):
                cell = row.cells[c_i]
                set_cell_background(cell, bg)
                set_cell_margins(cell, top=70, bottom=70, left=90, right=90)
                p = cell.paragraphs[0]
                format_paragraph(p, space_before=1, space_after=1, align=WD_ALIGN_PARAGRAPH.CENTER if c_i in [1] else WD_ALIGN_PARAGRAPH.LEFT, first_line_indent=0)
                run = p.add_run(val)
                run.font.name = "Times New Roman"
                run.font.size = Pt(9.5)
                if c_i == 0:
                    run.font.bold = True
                    run.font.name = "Times New Roman"

    # Bảng Đặc tả RESTful API Contracts
    add_h2(doc, "3.6. ĐẶC TẢ CHI TIẾT RESTFUL API CONTRACTS")
    add_body_p(doc, "Bảng 3.18 tổng hợp danh mục 12 RESTful API endpoints cốt lõi phục vụ trao đổi dữ liệu an toàn giữa Frontend, Backend và Trục tích hợp LGSP:")

    add_table_caption(doc, "Bảng 3.18", "Danh mục 12 RESTful API Contracts của hệ thống")
    table_api = doc.add_table(rows=len(API_CONTRACTS) + 1, cols=5)
    set_table_borders(table_api)
    table_api.alignment = WD_TABLE_ALIGNMENT.CENTER
    col_w_api = [Inches(0.8), Inches(1.8), Inches(2.0), Inches(1.6), Inches(1.0)]
    add_table_header(table_api.rows[0], ["Method", "Endpoint URL", "Chức năng nghiệp vụ", "Dữ liệu Request / Response", "Mã HTTP"], col_w_api)

    for idx, api in enumerate(API_CONTRACTS):
        row = table_api.rows[idx + 1]
        bg = "FFFFFF" if idx % 2 == 0 else "F8FAFC"
        req_res_summary = f"Req: {api['req'][:40]}...\nRes: {api['res'][:40]}..."
        for c_i, val in enumerate([api["method"], api["endpoint"], api["desc"], req_res_summary, api["status"]]):
            cell = row.cells[c_i]
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=60, bottom=60, left=80, right=80)
            p = cell.paragraphs[0]
            format_paragraph(p, space_before=1, space_after=1, align=WD_ALIGN_PARAGRAPH.CENTER if c_i in [0, 4] else WD_ALIGN_PARAGRAPH.LEFT, first_line_indent=0)
            run = p.add_run(val)
            run.font.name = "Times New Roman"
            run.font.size = Pt(9.0)
            if c_i == 0:
                run.font.bold = True
                run.font.name = "Times New Roman"

    doc.add_page_break()

    # ==========================================
    # 16. CHƯƠNG 4: HIỆN THỰC HÓA HỆ THỐNG & KẾT QUẢ GIAO DIỆN
    # ==========================================
    print("16. Tạo Chương 4 (kèm mã nguồn và 21 ảnh chụp màn hình)...")
    add_h1(doc, "CHƯƠNG 4. HIỆN THỰC HÓA HỆ THỐNG VÀ KẾT QUẢ TRIỂN KHAI", anchor="sec_c4")
    add_chapter_body_blocks(doc, CHUONG_4_TEXT)

    # Phân tích các giải thuật nghiệp vụ trọng tâm (Không mang code trực tiếp vào báo cáo Word)
    add_financial_engine_analysis(doc)
    add_currency_spelling_section(doc)
    add_bao_giam_workflow_section(doc)

    add_h2(doc, "4.2. CHI TIẾT KẾT QUẢ GIAO DIỆN HỆ THỐNG KÈM MINH CHỨNG HÌNH ẢNH CHỤP THỰC TẾ")
    add_body_p(doc, "Dưới đây là toàn bộ 21 màn hình giao diện thực tế của hệ thống được chụp lại trực tiếp từ máy chủ thử nghiệm tại đơn vị thực tập, phản ánh toàn diện các quy trình từ đăng nhập, quản lý hồ sơ, thẩm định, chi trả, điều dưỡng, chỉnh hình, nghĩa trang GIS đến Kiosk đánh giá CSAT công dân:")

    # Lần lượt chèn 21 ảnh chụp màn hình với tiêu đề và mô tả chuyên sâu
    for item in SCREENSHOT_DATA:
        img_p = os.path.join(SCREENSHOTS_DIR, item["filename"])
        fig_title = f"Hình {item['fig_num']}: {item['title']}"
        add_subhead(doc, f"4.2.{item['fig_num'].split('.')[1]}. {item['title']}")
        add_figure(doc, img_p, fig_title, item["desc"])

    doc.add_page_break()

    # ==========================================
    # 17. CHƯƠNG 5: QUY TRÌNH KIỂM THỬ QA/QC
    # ==========================================
    print("17. Tạo Chương 5 (Checklist 30 mục, 50 Test Cases, 15 Bug Reports)...")
    add_h1(doc, "CHƯƠNG 5. QUY TRÌNH KIỂM THỬ VÀ BẢO ĐẢM CHẤT LƯỢNG PHẦN MỀM (QA/QC)", anchor="sec_c5")
    add_chapter_body_blocks(doc, CHUONG_5_TEXT)

    # Bảng 5.1: Checklist Kiểm thử (30 Hạng mục)
    add_h2(doc, "5.2. DANH MỤC CHECKLIST KIỂM THỬ CHỨC NĂNG VÀ GIAO DIỆN (BẢNG 5.1)")
    add_table_caption(doc, "Bảng 5.1", "Danh mục Checklist kiểm thử chức năng và giao diện hệ thống (30 hạng mục)")
    table_ck = doc.add_table(rows=len(CHECKLIST_ITEMS) + 1, cols=5)
    set_table_borders(table_ck)
    table_ck.alignment = WD_TABLE_ALIGNMENT.CENTER
    col_w_ck = [Inches(0.8), Inches(1.0), Inches(1.6), Inches(2.8), Inches(0.8)]
    add_table_header(table_ck.rows[0], ["Mã CK", "Phân loại", "Màn hình / Module", "Tiêu chuẩn kiểm tra kỹ thuật & nghiệp vụ", "Kết quả"], col_w_ck)

    for idx, (m_ck, pl, mh, tc, kq) in enumerate(CHECKLIST_ITEMS):
        row = table_ck.rows[idx + 1]
        bg = "FFFFFF" if idx % 2 == 0 else "F8FAFC"
        for c_i, val in enumerate([m_ck, pl, mh, tc, kq]):
            cell = row.cells[c_i]
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=60, bottom=60, left=80, right=80)
            p = cell.paragraphs[0]
            format_paragraph(p, space_before=1, space_after=1, align=WD_ALIGN_PARAGRAPH.CENTER if c_i in [0, 1, 4] else WD_ALIGN_PARAGRAPH.LEFT, first_line_indent=0)
            run = p.add_run(val)
            run.font.name = "Times New Roman"
            run.font.size = Pt(9.5)
            if c_i == 0:
                run.font.bold = True
            if c_i == 4:
                run.font.bold = True
                run.font.color.rgb = RGBColor(0, 0, 0)

    # Bảng 5.2: 50 Test Cases Chi tiết
    add_h2(doc, "5.3. BẢNG KỊCH BẢN KIỂM THỬ CHI TIẾT (TEST CASES SPECIFICATION - BẢNG 5.2 - 50 TEST CASES)")
    add_body_p(doc, "Bộ kịch bản kiểm thử chi tiết bao gồm 50 Test Cases bao phủ toàn diện 100% các phân hệ nghiệp vụ, giao diện, API và an toàn thông tin:")

    add_table_caption(doc, "Bảng 5.2", "Bảng kịch bản kiểm thử chi tiết Test Cases Specification (50 Test Cases)")
    table_tc = doc.add_table(rows=len(TEST_CASES) + 1, cols=7)
    set_table_borders(table_tc)
    table_tc.alignment = WD_TABLE_ALIGNMENT.CENTER
    add_table_header(table_tc.rows[0], ["Mã TC", "Phân hệ", "Tên kịch bản / Mục tiêu", "Các bước thao tác", "Kết quả mong đợi", "Kết quả thực tế", "Trạng thái"], [Inches(0.9), Inches(0.9), Inches(1.3), Inches(1.3), Inches(1.3), Inches(0.8), Inches(0.7)])

    for idx, (tc_id, mh, ten, dk, steps, inp, exp, act, st) in enumerate(TEST_CASES):
        row = table_tc.rows[idx + 1]
        bg = "FFFFFF" if idx % 2 == 0 else "F8FAFC"
        vals = [tc_id, mh, ten, steps, exp, act, st]
        for c_i, val in enumerate(vals):
            cell = row.cells[c_i]
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=60, bottom=60, left=70, right=70)
            p = cell.paragraphs[0]
            format_paragraph(p, space_before=1, space_after=1, align=WD_ALIGN_PARAGRAPH.CENTER if c_i in [0, 1, 6] else WD_ALIGN_PARAGRAPH.LEFT, first_line_indent=0)
            run = p.add_run(val)
            run.font.name = "Times New Roman"
            run.font.size = Pt(8.5)
            if c_i == 0:
                run.font.bold = True
            if c_i == 6:
                run.font.bold = True
                run.font.color.rgb = RGBColor(0, 0, 0)

    # Bảng 5.3: 15 Bug Reports Chi tiết
    add_h2(doc, "5.4. BẢNG GHI NHẬN VÀ QUẢN LÝ LỖI PHẦN MỀM (BUG REPORT SHEET - BẢNG 5.3 - 15 LỖI THỰC TẾ)")
    add_body_p(doc, "Trong quá trình kiểm thử phần mềm, sinh viên đã phát hiện và ghi nhận 15 lỗi kỹ thuật cụ thể. Toàn bộ 15 lỗi đã được phối hợp khắc phục và kiểm thử lại đạt 100%:")

    add_table_caption(doc, "Bảng 5.3", "Bảng ghi nhận và theo dõi lỗi phần mềm Bug Report Sheet (15 lỗi thực tế)")
    table_bugs = doc.add_table(rows=len(BUG_REPORTS) + 1, cols=6)
    set_table_borders(table_bugs)
    table_bugs.alignment = WD_TABLE_ALIGNMENT.CENTER
    col_w_bugs = [Inches(0.9), Inches(1.3), Inches(2.2), Inches(0.8), Inches(0.8), Inches(0.8)]
    add_table_header(table_bugs.rows[0], ["Mã Bug", "Phân hệ / Module", "Tiêu đề mô tả lỗi", "Mức độ", "Ưu tiên", "Trạng thái"], col_w_bugs)
    for b_i, bug in enumerate(BUG_REPORTS):
        row = table_bugs.rows[b_i + 1]
        for c_i, val in enumerate([bug["bug_id"], bug["component"], bug["title"], bug["severity"], bug["priority"], bug["status"]]):
            cell = row.cells[c_i]
            set_cell_margins(cell, top=50, bottom=50, left=60, right=60)
            p = cell.paragraphs[0]
            format_paragraph(p, space_before=1, space_after=1, align=WD_ALIGN_PARAGRAPH.CENTER if c_i in [0, 3, 4, 5] else WD_ALIGN_PARAGRAPH.LEFT, first_line_indent=0)
            run = p.add_run(val)
            run.font.name = "Times New Roman"
            run.font.size = Pt(8.5)
            if c_i in [0, 5]:
                run.font.bold = True

    add_subhead(doc, "ĐẶC TẢ CHI TIẾT TỪNG LỖI VÀ QUY TRÌNH KHẮC PHỤC HỒI QUY:")
    for b_idx, bug in enumerate(BUG_REPORTS):
        add_subhead(doc, f"{bug['bug_id']}: {bug['title']}")
        add_body_p(doc, f"- Thành phần phát sinh lỗi: {bug['component']}")
        add_body_p(doc, f"- Mức độ nghiêm trọng: {bug['severity']} | Mức độ ưu tiên xử lý: {bug['priority']}")
        add_body_p(doc, f"- Các bước tái hiện lỗi:\n{bug['steps']}")
        add_body_p(doc, f"- Kết quả thực tế phát hiện: {bug['actual']}")
        add_body_p(doc, f"- Kết quả mong đợi chuẩn mực: {bug['expected']}")
        add_body_p(doc, f"- Trạng thái khắc phục: {bug['status']}", bold_prefix="* ")

    # Bảng 5.4: Test Summary Report
    add_h2(doc, "5.5. BÁO CÁO TỔNG KẾT CHẤT LƯỢNG KIỂM THỬ (TEST SUMMARY REPORT - BẢNG 5.4)")
    add_table_caption(doc, "Bảng 5.4", "Báo cáo tổng kết chất lượng kiểm thử Test Summary Report")
    table_sum = doc.add_table(rows=7, cols=3)
    set_table_borders(table_sum)
    table_sum.alignment = WD_TABLE_ALIGNMENT.CENTER
    add_table_header(table_sum.rows[0], ["Chỉ số đo lường chất lượng (Quality Metrics)", "Giá trị đo lường", "Đánh giá tiêu chuẩn"], [Inches(3.2), Inches(1.8), Inches(2.0)])

    metrics_data = [
        ("Tổng số kịch bản kiểm thử đã thực thi (Total Test Cases)", "50 / 50 kịch bản", "Đạt 100% độ bao phủ chức năng"),
        ("Tỷ lệ kịch bản Đạt sau khi khắc phục lỗi (Pass Rate)", "100.0%", "Đạt tiêu chuẩn xuất xưởng"),
        ("Tổng số lỗi phát hiện trong các đợt test (Total Defects)", "15 lỗi (2 Critical, 4 High, 5 Med, 4 Low)", "Đã xử lý dứt điểm 15/15 lỗi"),
        ("Tỷ lệ lỗi đã đóng thành công (Defect Closure Rate)", "100.0%", "Không còn lỗi tồn đọng"),
        ("Tỷ lệ lỗi mở lại sau kiểm thử lại (Defect Reopen Rate)", "0.0%", "Sửa lỗi chính xác, không gây lỗi lan"),
        ("Thời gian phản hồi API trung bình (Average API Latency)", "180 ms (với 100 concurrent users)", "Hiệu năng mượt mà, đạt chuẩn SLA")
    ]
    for idx, (m, v, dg) in enumerate(metrics_data):
        row = table_sum.rows[idx + 1]
        bg = "FFFFFF" if idx % 2 == 0 else "F8FAFC"
        for c_i, val in enumerate([m, v, dg]):
            cell = row.cells[c_i]
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=70, bottom=70, left=90, right=90)
            p = cell.paragraphs[0]
            format_paragraph(p, space_before=1, space_after=1, align=WD_ALIGN_PARAGRAPH.CENTER if c_i == 1 else WD_ALIGN_PARAGRAPH.LEFT, first_line_indent=0)
            run = p.add_run(val)
            run.font.name = "Times New Roman"
            run.font.size = Pt(9.5)
            if c_i == 1:
                run.font.bold = True

    doc.add_page_break()

    # ==========================================
    # 18. CHƯƠNG 6: SO SÁNH THỰC TẾ VỚI LÝ THUYẾT & BÀI HỌC
    # ==========================================
    print("18. Tạo Chương 6...")
    add_h1(doc, "CHƯƠNG 6. SO SÁNH THỰC TẾ VỚI LÝ THUYẾT VÀ BÀI HỌC KINH NGHIỆM", anchor="sec_c6")
    add_chapter_body_blocks(doc, CHUONG_6_TEXT)

    doc.add_page_break()

    # ==========================================
    # 19. CHƯƠNG 7: KẾT LUẬN & KIẾN NGHỊ
    # ==========================================
    print("19. Tạo Chương 7...")
    add_h1(doc, "CHƯƠNG 7. KẾT LUẬN VÀ KIẾN NGHỊ", anchor="sec_c7")
    add_chapter_body_blocks(doc, CHUONG_7_TEXT)

    doc.add_page_break()

    # ==========================================
    # 20. TÀI LIỆU THAM KHẢO
    # ==========================================
    print("20. Tạo Danh mục Tài liệu tham khảo...")
    add_h1(doc, "TÀI LIỆU THAM KHẢO", anchor="sec_ref")
    for idx, ref in enumerate(TAI_LIEU_THAM_KHAO):
        p = doc.add_paragraph()
        format_paragraph(p, space_before=3, space_after=3, line_spacing=1.3, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=-0.8, left_indent=0.8)
        
        ref_id = idx + 1
        bm_name = f"ref_{ref_id}"
        add_bookmark_to_paragraph(p, bm_name, get_next_bm_id())
        
        m_ref = re.match(r'^(\[\d+\])\s*(.*)', ref)
        if m_ref:
            num_tag = m_ref.group(1)
            ref_content = m_ref.group(2)
            
            r_num = p.add_run(f"{num_tag}\t")
            r_num.font.name = "Times New Roman"
            r_num.font.size = Pt(11)
            r_num.font.bold = True
            r_num.font.color.rgb = RGBColor(0, 0, 0)
            
            pPr = p._p.get_or_add_pPr()
            tabs_elem = parse_xml(f'<w:tabs {nsdecls("w")}><w:tab w:val="left" w:pos="{int(0.8 * 567)}"/></w:tabs>')
            pPr.append(tabs_elem)
            
            r_txt = p.add_run(ref_content)
            r_txt.font.name = "Times New Roman"
            r_txt.font.size = Pt(11)
            r_txt.font.color.rgb = RGBColor(0, 0, 0)
        else:
            r = p.add_run(ref)
            r.font.name = "Times New Roman"
            r.font.size = Pt(11)

    doc.add_page_break()

    # ==========================================
    # 21. PHỤ LỤC
    # ==========================================
    print("21. Tạo Các Phụ lục...")
    add_h1(doc, "PHỤ LỤC", anchor="sec_appendix")

    add_h2(doc, "PHỤ LỤC 1: BIỂU MẪU HÀNH CHÍNH ÁP DỤNG TRONG HỆ THỐNG")
    add_body_p(doc, "1. Mẫu số 01 - Giấy tiếp nhận hồ sơ và hẹn trả kết quả (Ban hành kèm theo Nghị định số 61/2018/NĐ-CP của Chính phủ [6]):")
    add_body_p(doc, "Bao gồm: Mã số hồ sơ, tên thủ tục tiếp nhận, người nộp hồ sơ, địa chỉ, số điện thoại, danh mục thành phần hồ sơ tiếp nhận, thời hạn giải quyết, ngày và giờ trả kết quả, kèm theo mã QR Code tra cứu trực tuyến.")
    add_body_p(doc, "2. Mẫu số 02 - Quyết định về việc trợ cấp mai táng (Ban hành kèm theo Nghị định số 131/2021/NĐ-CP của Chính phủ [3]):")
    add_body_p(doc, "Quy định mức chi trợ cấp mai táng phí bằng 10 tháng mức chuẩn trợ cấp ưu đãi (20.550.000 VNĐ) chi trả cho thân nhân khi người có công từ trần.")
    add_body_p(doc, "3. Mẫu số C70a-HD - Phiếu chi trợ cấp người có công (Ban hành kèm theo Thông tư số 101/2018/TT-BTC của Bộ Tài chính [10]):")
    add_body_p(doc, "Bao gồm: Đơn vị chi trả, mã số đơn vị ngân sách, họ tên người nhận, số tài khoản/địa chỉ, số tiền bằng số và bằng chữ tiếng Việt chính xác, chữ ký của Thủ trưởng đơn vị, Kế toán trưởng và Người nhận tiền.")

    add_appendix_2_schema_specification(doc)

    add_h2(doc, "PHỤ LỤC 3: BẢNG QUY ĐỔI ĐỊNH MỨC TRỢ CẤP PHÁP LÝ (BẢNG PL.1)")
    add_body_p(doc, "Bảng tổng hợp mức chuẩn và định mức trợ cấp ưu đãi người có công theo Nghị định 75/2021/NĐ-CP [4] và Nghị định 55/2023/NĐ-CP [5] của Chính phủ:")

    add_table_caption(doc, "Bảng PL.1", "Bảng quy đổi định mức phụ cấp, trợ cấp ưu đãi người có công theo Nghị định 75/2021/NĐ-CP")
    table_pl = doc.add_table(rows=len(DINH_MUC_PHAP_LY) + 1, cols=4)
    set_table_borders(table_pl)
    table_pl.alignment = WD_TABLE_ALIGNMENT.CENTER
    col_w_pl = [Inches(2.2), Inches(1.8), Inches(1.8), Inches(1.4)]
    add_table_header(table_pl.rows[0], ["Khoản mục chế độ ưu đãi", "Định mức số tiền (VNĐ)", "Căn cứ pháp lý", "Đối tượng thụ hưởng"], col_w_pl)

    for idx, (km, dm, cc, dt) in enumerate(DINH_MUC_PHAP_LY):
        row = table_pl.rows[idx + 1]
        bg = "FFFFFF" if idx % 2 == 0 else "F8FAFC"
        for c_i, val in enumerate([km, dm, cc, dt]):
            cell = row.cells[c_i]
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=60, bottom=60, left=80, right=80)
            p = cell.paragraphs[0]
            format_paragraph(p, space_before=1, space_after=1, align=WD_ALIGN_PARAGRAPH.CENTER if c_i == 1 else WD_ALIGN_PARAGRAPH.LEFT, first_line_indent=0)
            run = p.add_run(val)
            run.font.name = "Times New Roman"
            run.font.size = Pt(9.5)
            if c_i in [0, 1]:
                run.font.bold = True

    add_h2(doc, "PHỤ LỤC 4: THUẬT NGỮ VÀ KHÁI NIỆM NGHIỆP VỤ AN SINH XÃ HỘI (BẢNG PL.2)")
    add_body_p(doc, "Bảng giải nghĩa chi tiết các thuật ngữ pháp lý và khái niệm nghiệp vụ cốt lõi áp dụng trong công tác quản lý chính sách ưu đãi người có công tại địa phương:")

    terms_data = [
        ("Mức chuẩn trợ cấp ưu đãi", "2.055.000 VNĐ", "Nghị định 55/2023/NĐ-CP [5]", "Căn cứ làm mốc xác định mọi mức chi trợ cấp, phụ cấp hàng tháng và trợ cấp một lần."),
        ("Trợ cấp hàng tháng", "Theo hệ số x Mức chuẩn", "Pháp lệnh số 02/2020 [2]", "Khoản tiền ngân sách nhà nước chi trả định kỳ hàng tháng cho người có công và thân nhân."),
        ("Trợ cấp một lần", "Khoán định mức", "Nghị định 131/2021/NĐ-CP [3]", "Khoản hỗ trợ chi trả duy nhất một lần khi đối tượng được công nhận hoặc giải quyết chế độ."),
        ("Phụ cấp ưu đãi", "Theo đối tượng đặc thù", "Pháp lệnh số 02/2020 [2]", "Khoản tiền chi thêm cho thương bệnh binh nặng (≥81%), người có công nuôi dưỡng, chăm sóc."),
        ("Bảo hiểm y tế toàn phần", "100% kinh phí NSNN", "Luật Bảo hiểm y tế", "Nhà nước đóng 100% BHYT, được chi trả 100% chi phí khám chữa bệnh đúng tuyến."),
        ("Điều dưỡng phục hồi sức khỏe", "Định kỳ 1 - 2 năm/lần", "Nghị định 75/2021/NĐ-CP [4]", "Chế độ bồi dưỡng thể chất, tinh thần theo hai hình thức: tập trung tại trung tâm hoặc tại nhà."),
        ("Dụng cụ chỉnh hình & trợ giúp", "Niên hạn 3 - 5 năm/lần", "Nghị định 75/2021/NĐ-CP [4]", "Trang cấp xe lăn tay, chân giả, mắt giả, máy trợ thính cho thương bệnh binh phục hồi sinh hoạt."),
        ("Trợ cấp mai táng phí", "20.550.000 VNĐ (10 tháng chuẩn)", "Nghị định 131/2021/NĐ-CP [3]", "Chi trả cho thân nhân hoặc tổ chức đứng ra lo tang lễ khi người có công từ trần."),
        ("Định danh số Đề án 06/CP", "CCCD gắn chip 12 số", "Quyết định 06/QĐ-TTg [9]", "Đồng bộ mã số định danh cá nhân với Cơ sở dữ liệu quốc gia về dân cư để quản lý đối tượng."),
        ("Chi trả không dùng tiền mặt", "Chuyển khoản ATM / NAPAS", "Chỉ thị số 21/CT-TTg", "Liên thông chi trả an sinh xã hội trực tiếp vào tài khoản ngân hàng chính chủ của người có công.")
    ]

    add_table_caption(doc, "Bảng PL.2", "Thuật ngữ và Khái niệm Nghiệp vụ Hành chính An sinh Xã hội (Theo NĐ 55/2023)")
    table_pl4 = doc.add_table(rows=len(terms_data) + 1, cols=4)
    set_table_borders(table_pl4)
    table_pl4.alignment = WD_TABLE_ALIGNMENT.CENTER
    col_w_pl4 = [Inches(1.8), Inches(1.5), Inches(1.7), Inches(2.2)]
    add_table_header(table_pl4.rows[0], ["Thuật ngữ nghiệp vụ", "Định mức / Giá trị", "Cơ sở pháp lý", "Nội dung áp dụng thực tế"], col_w_pl4)

    for idx, (tn, dm, cs, nd) in enumerate(terms_data):
        row = table_pl4.rows[idx + 1]
        bg = "FFFFFF" if idx % 2 == 0 else "F8FAFC"
        for c_i, val in enumerate([tn, dm, cs, nd]):
            cell = row.cells[c_i]
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=60, bottom=60, left=80, right=80)
            p = cell.paragraphs[0]
            format_paragraph(p, space_before=1, space_after=1, align=WD_ALIGN_PARAGRAPH.CENTER if c_i in [1, 2] else WD_ALIGN_PARAGRAPH.LEFT, first_line_indent=0)
            run = p.add_run(val)
            run.font.name = "Times New Roman"
            run.font.size = Pt(9.5)
            if c_i == 0:
                run.font.bold = True

    add_body_p(doc, "Việc chuẩn hóa các thuật ngữ nghiệp vụ trên vào hệ thống cơ sở dữ liệu và mã nguồn phần mềm đã giúp loại bỏ hoàn toàn các lỗi diễn giải sai quy định pháp luật, bảo đảm tính thống nhất cao trong toàn bộ chu trình xử lý hồ sơ từ cấp phường lên thành phố.")

    print(f"Lưu file Word ra: {OUTPUT_FILE}")
    doc.save(OUTPUT_FILE)

    ROOT_PRINT_FILE = "Q:/CODE_visual/filebctt/BAO_CAO_THUC_TAP_DOAN_MINH_QUAN_BAN_IN_CHUAN.docx"
    doc.save(ROOT_PRINT_FILE)
    print(f"Đã lưu bản in chuẩn ra: {ROOT_PRINT_FILE}")

    import shutil
    try:
        shutil.copyfile(OUTPUT_FILE, ROOT_COPY_FILE)
        print(f"Đã cập nhật ra thư mục gốc: {ROOT_COPY_FILE}")
    except PermissionError:
        print(f"Lưu ý: Tệp {ROOT_COPY_FILE} đang mở trong Word. Bản in chuẩn mới nhất đã được lưu tại {OUTPUT_FILE} và {ROOT_PRINT_FILE}.")
    except Exception as e:
        print(f"Lỗi sao chép: {e}")

    # ==========================================
    # CẬP NHẬT TỰ ĐỘNG MỤC LỤC & SỐ TRANG QUA WORD COM
    # ==========================================
    print("Đang cập nhật Mục Lục tự động chuẩn Microsoft Word qua scripts/update_toc.ps1...")
    try:
        ps_script = r"Q:\CODE_visual\filebctt\scripts\update_toc.ps1"
        res = subprocess.run(["powershell", "-ExecutionPolicy", "Bypass", "-File", ps_script], capture_output=True, text=True, encoding="utf-8", timeout=30)
        print(res.stdout)
        if res.stderr:
            print("Cảnh báo:", res.stderr)
    except subprocess.TimeoutExpired:
        print("PowerShell COM cập nhật Mục Lục đã hết thời gian chờ 30s.")
        try:
            subprocess.run(["powershell", "-Command", "Get-Process -Name WINWORD -ErrorAction SilentlyContinue | Stop-Process -Force"], capture_output=True)
        except Exception:
            pass
    except Exception as e:
        print(f"Không thể chạy PowerShell COM: {e}")

    print("Xuất file Word thành công!")

if __name__ == "__main__":
    build_document()
