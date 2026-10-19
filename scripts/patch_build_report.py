"""
Script to apply comprehensive formatting and hyperlink cross-referencing patches to build_full_report.py
"""

import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'scripts/build_full_report.py', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace format_paragraph and add helper functions
old_format_p_block = '''def format_paragraph(p, space_before=2, space_after=4, line_spacing=1.3, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=1.27):
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = line_spacing
    p.alignment = align
    if first_line_indent > 0:
        p.paragraph_format.first_line_indent = Cm(first_line_indent)

def add_body_p(doc, text, bold_prefix="", italic=False):
    p = doc.add_paragraph()
    format_paragraph(p)
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.font.name = "Times New Roman"
        r_pre.font.size = Pt(13)
        r_pre.font.bold = True
        r_pre.font.color.rgb = RGBColor(0, 0, 0)
    
    r = p.add_run(text)
    r.font.name = "Times New Roman"
    r.font.size = Pt(13)
    r.font.italic = italic
    r.font.color.rgb = RGBColor(0, 0, 0)
    return p'''

new_format_p_block = '''GLOBAL_BM_ID = 1000

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
    hl_xml = f\'\'\'
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
    \'\'\'
    paragraph._p.append(parse_xml(hl_xml))

def add_runs_with_citations(p, text, font_size=Pt(13), default_bold=False, default_italic=False):
    tokens = re.split(r'(\[\d+\])', text)
    for tok in tokens:
        if not tok:
            continue
        m = re.match(r'^\\[(\\d+)\\]$', tok)
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
                    color_rgb="004080",
                    underline=True
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

def add_body_p(doc, text, bold_prefix="", italic=False):
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

def add_list_item(doc, text, bullet_char="-", level=1):
    p = doc.add_paragraph()
    left_cm = 0.8 if level == 1 else 1.4
    hang_cm = -0.4
    format_paragraph(p, space_before=2, space_after=2, line_spacing=1.3, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=hang_cm, left_indent=left_cm)
    
    if bullet_char:
        r_b = p.add_run(f"{bullet_char}\\t")
        r_b.font.name = "Times New Roman"
        r_b.font.size = Pt(13)
        r_b.font.bold = True
        r_b.font.color.rgb = RGBColor(0, 0, 0)
        
        pPr = p._p.get_or_add_pPr()
        tabs_elem = parse_xml(f'<w:tabs {nsdecls("w")}><w:tab w:val="left" w:pos="{int(left_cm * 567)}"/></w:tabs>')
        pPr.append(tabs_elem)
        
    add_runs_with_citations(p, text, font_size=Pt(13))
    return p'''

assert old_format_p_block in content, "Error: old_format_p_block not found!"
content = content.replace(old_format_p_block, new_format_p_block)
print("1. Replaced format_paragraph block successfully!")

# 2. Update add_h1, add_h2, add_h3, add_subhead, add_chapter_body_blocks
old_headings_block = '''def add_h1(doc, text, in_toc=True, align=WD_ALIGN_PARAGRAPH.CENTER):
    p = doc.add_paragraph()
    if in_toc:
        try:
            p.style = doc.styles['Heading 1']
        except Exception:
            pass
        set_paragraph_outline(p, 0)
    format_paragraph(p, space_before=18, space_after=10, align=align, first_line_indent=0)
    p.paragraph_format.keep_with_next = True
    r = p.add_run(text)
    r.font.name = "Times New Roman"
    r.font.size = Pt(15)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0, 0, 0)
    return p

def add_h2(doc, text, in_toc=True):
    p = doc.add_paragraph()
    try:
        p.style = doc.styles['Heading 2']
    except Exception:
        pass
    if in_toc:
        set_paragraph_outline(p, 1)
    format_paragraph(p, space_before=12, space_after=6, align=WD_ALIGN_PARAGRAPH.LEFT, first_line_indent=0)
    p.paragraph_format.keep_with_next = True
    r = p.add_run(text)
    r.font.name = "Times New Roman"
    r.font.size = Pt(13.5)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0, 0, 0)
    return p

def add_h3(doc, text, in_toc=True):
    p = doc.add_paragraph()
    try:
        p.style = doc.styles['Heading 3']
    except Exception:
        pass
    if in_toc:
        set_paragraph_outline(p, 2)
    format_paragraph(p, space_before=8, space_after=4, align=WD_ALIGN_PARAGRAPH.LEFT, first_line_indent=0)
    p.paragraph_format.keep_with_next = True
    r = p.add_run(text)
    r.font.name = "Times New Roman"
    r.font.size = Pt(13)
    r.font.bold = True
    r.font.italic = True
    r.font.color.rgb = RGBColor(0, 0, 0)
    return p

def add_subhead(doc, text):
    """Tiêu đề phụ in đậm trong nội dung (không đưa vào TOC để tránh làm loãng mục lục)"""
    p = doc.add_paragraph()
    format_paragraph(p, space_before=8, space_after=4, align=WD_ALIGN_PARAGRAPH.LEFT, first_line_indent=0)
    p.paragraph_format.keep_with_next = True
    r = p.add_run(text)
    r.font.name = "Times New Roman"
    r.font.size = Pt(12)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0, 0, 0)
    return p

def add_chapter_body_blocks(doc, chapter_text):
    for block in chapter_text.split("\\n\\n"):
        lines = block.split("\\n")
        for line in lines:
            line_str = line.strip()
            if not line_str:
                continue
            if re.match(r'^\\d+\\.\\d+(\\.\\d+)*\\.?\\s+', line_str):
                add_numbered_section_header(doc, line_str)
            else:
                add_body_p(doc, line_str)'''

new_headings_block = '''def add_h1(doc, text, in_toc=True, align=WD_ALIGN_PARAGRAPH.CENTER, anchor=None):
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
    for block in chapter_text.split("\\n\\n"):
        lines = block.split("\\n")
        for line in lines:
            line_str = line.strip()
            if not line_str:
                continue
            if re.match(r'^\\d+\\.\\d+(\\.\\d+)*\\.?\\s+', line_str):
                add_numbered_section_header(doc, line_str)
            elif line_str.startswith("- "):
                add_list_item(doc, line_str[2:], bullet_char="-", level=1)
            elif line_str.startswith("+ "):
                add_list_item(doc, line_str[2:], bullet_char="+", level=2)
            elif line_str.startswith("* "):
                add_list_item(doc, line_str[2:], bullet_char="•", level=2)
            elif re.match(r'^\\d+\\.\\s+[A-ZÀ-Ỹ]', line_str) and len(line_str) < 100:
                add_list_item(doc, line_str, bullet_char="", level=1)
            else:
                add_body_p(doc, line_str)'''

assert old_headings_block in content, "Error: old_headings_block not found!"
content = content.replace(old_headings_block, new_headings_block)
print("2. Replaced headings block successfully!")

# 3. Update add_figure to create bookmarks
old_add_figure_block = '''def add_figure(doc, img_path, fig_title, fig_desc="", width=Inches(5.2)):
    if not os.path.exists(img_path):
        print(f"Warning: Image not found {img_path}")
        return

    # Image paragraph (căn giữa, keep_with_next để không bị tách rời chú thích)
    p_img = doc.add_paragraph()
    format_paragraph(p_img, space_before=12, space_after=3, align=WD_ALIGN_PARAGRAPH.CENTER, first_line_indent=0)
    p_img.paragraph_format.keep_with_next = True
    run_img = p_img.add_run()
    run_img.add_picture(img_path, width=width)

    # Caption paragraph (chú thích nằm PHÍA DƯỚI hình ảnh, chuẩn học thuật V2)
    p_cap = doc.add_paragraph()
    format_paragraph(p_cap, space_before=2, space_after=6, align=WD_ALIGN_PARAGRAPH.CENTER, first_line_indent=0)
    p_cap.paragraph_format.keep_with_next = False
    
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
        add_body_p(doc, fig_desc, bold_prefix="* Phân tích chức năng và giải pháp kỹ thuật: ")'''

new_add_figure_block = '''def add_figure(doc, img_path, fig_title, fig_desc="", width=Inches(5.2)):
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
    m_fig = re.search(r'Hình\\s+(\\d+)\\.(\\d+)', fig_title)
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
        add_body_p(doc, fig_desc, bold_prefix="* Phân tích chức năng và giải pháp kỹ thuật: ")'''

assert old_add_figure_block in content, "Error: old_add_figure_block not found!"
content = content.replace(old_add_figure_block, new_add_figure_block)
print("3. Replaced add_figure block successfully!")

# 4. Update add_toc_entry, add_table_caption, add_catalog_entry
old_catalog_block = '''def add_toc_entry(doc, title, page_num, level=0):
    p = doc.add_paragraph()
    left_indent_cm = 0 if level == 0 else (0.6 if level == 1 else 1.2)
    format_paragraph(p, space_before=3 if level == 0 else 1, space_after=1, align=WD_ALIGN_PARAGRAPH.LEFT, first_line_indent=0)
    if left_indent_cm > 0:
        p.paragraph_format.left_indent = Cm(left_indent_cm)
    
    pPr = p._p.get_or_add_pPr()
    tabs_elem = parse_xml(f'<w:tabs {nsdecls("w")}><w:tab w:val="right" w:leader="dot" w:pos="9072"/></w:tabs>')
    pPr.append(tabs_elem)
    
    r_title = p.add_run(title)
    r_title.font.name = "Times New Roman"
    r_title.font.size = Pt(11.5 if level == 0 else (11.0 if level == 1 else 10.5))
    r_title.font.bold = (level == 0)
    r_title.font.italic = (level == 2)
    r_title.font.color.rgb = RGBColor(0, 0, 0)
    
    r_tab = p.add_run("\\t")
    r_tab.font.name = "Times New Roman"
    
    r_page = p.add_run(str(page_num))
    r_page.font.name = "Times New Roman"
    r_page.font.size = Pt(11.5 if level == 0 else 11.0)
    r_page.font.bold = (level == 0)
    r_page.font.color.rgb = RGBColor(0, 0, 0)

def add_table_caption(doc, label, title):
    p = doc.add_paragraph()
    format_paragraph(p, space_before=10, space_after=3, align=WD_ALIGN_PARAGRAPH.CENTER, first_line_indent=0)
    p.paragraph_format.keep_with_next = True
    
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

def add_catalog_entry(doc, label, title, page_num):
    p = doc.add_paragraph()
    format_paragraph(p, space_before=2, space_after=2, first_line_indent=0)
    
    # Cài đặt Tab Stop căn phải tại 9072 dxa (6.3 inch = sát mép lề phải) với dấu chấm lửng leader="dot"
    pPr = p._p.get_or_add_pPr()
    tabs_elem = parse_xml(f'<w:tabs {nsdecls("w")}><w:tab w:val="right" w:leader="dot" w:pos="9072"/></w:tabs>')
    pPr.append(tabs_elem)
    
    # Nhãn danh mục (in đậm)
    r_lbl = p.add_run(f"{label}: ")
    r_lbl.font.name = "Times New Roman"
    r_lbl.font.size = Pt(11)
    r_lbl.font.bold = True
    r_lbl.font.color.rgb = RGBColor(0, 0, 0)
    
    # Tên tiêu đề (in thường)
    r_title = p.add_run(title)
    r_title.font.name = "Times New Roman"
    r_title.font.size = Pt(11)
    r_title.font.color.rgb = RGBColor(0, 0, 0)
    
    # Ký tự Tab để kích hoạt leader chấm lửng
    r_tab = p.add_run("\\t")
    r_tab.font.name = "Times New Roman"
    r_tab.font.size = Pt(11)
    r_tab.font.color.rgb = RGBColor(0, 0, 0)
    
    # Số trang trích dẫn (in đậm căn phải)
    r_page = p.add_run(str(page_num))
    r_page.font.name = "Times New Roman"
    r_page.font.size = Pt(11)
    r_page.font.bold = True
    r_page.font.color.rgb = RGBColor(0, 0, 0)'''

new_catalog_block = '''def add_toc_entry(doc, title, page_num, level=0, anchor=None):
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
        hl_xml = f\'\'\'
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
        \'\'\'
        p._p.append(parse_xml(hl_xml))
    else:
        r_title = p.add_run(title)
        r_title.font.name = "Times New Roman"
        r_title.font.size = Pt(11.5 if level == 0 else (11.0 if level == 1 else 10.5))
        r_title.font.bold = (level == 0)
        r_title.font.italic = (level == 2)
        r_title.font.color.rgb = RGBColor(0, 0, 0)
        
        r_tab = p.add_run("\\t")
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
    m_tbl = re.search(r'Bảng\\s+(\\d+|PL)\\.(\\d+)', label)
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
        hl_xml = f\'\'\'
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
        \'\'\'
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
        
        r_tab = p.add_run("\\t")
        r_tab.font.name = "Times New Roman"
        r_tab.font.size = Pt(11)
        r_tab.font.color.rgb = RGBColor(0, 0, 0)
        
        r_page = p.add_run(str(page_num))
        r_page.font.name = "Times New Roman"
        r_page.font.size = Pt(11)
        r_page.font.bold = True
        r_page.font.color.rgb = RGBColor(0, 0, 0)'''

assert old_catalog_block in content, "Error: old_catalog_block not found!"
content = content.replace(old_catalog_block, new_catalog_block)
print("4. Replaced catalog functions block successfully!")

# 5. Update TOC items loop to include anchors
old_toc_loop = '''    for item_t, item_pg, item_lvl in detailed_toc_items:
        add_toc_entry(doc, item_t, item_pg, level=item_lvl)'''

new_toc_loop = '''    toc_anchors_map = {
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
        add_toc_entry(doc, item_t, item_pg, level=item_lvl, anchor=anchor_val)'''

assert old_toc_loop in content, "Error: old_toc_loop not found!"
content = content.replace(old_toc_loop, new_toc_loop)
print("5. Replaced TOC items loop successfully!")

# 6. Update list_tables loop to include anchor
old_tbl_loop = '''    for b_id, b_title, b_page in list_tables:
        add_catalog_entry(doc, b_id, b_title, b_page)'''

new_tbl_loop = '''    for b_id, b_title, b_page in list_tables:
        m_tbl = re.search(r'Bảng\\s+(\\d+|PL)\\.(\\d+)', b_id)
        tbl_anchor = f"tbl_{m_tbl.group(1).lower()}_{m_tbl.group(2)}" if m_tbl else None
        add_catalog_entry(doc, b_id, b_title, b_page, anchor=tbl_anchor)'''

assert old_tbl_loop in content, "Error: old_tbl_loop not found!"
content = content.replace(old_tbl_loop, new_tbl_loop)
print("6. Replaced list_tables loop successfully!")

# 7. Update list_figs loop to include anchor
old_fig_loop = '''    for f_id, f_title, f_page in list_figs:
        add_catalog_entry(doc, f_id, f_title, f_page)'''

new_fig_loop = '''    for f_id, f_title, f_page in list_figs:
        m_fig = re.search(r'Hình\\s+(\\d+)\\.(\\d+)', f_id)
        fig_anchor = f"fig_{m_fig.group(1)}_{m_fig.group(2)}" if m_fig else None
        add_catalog_entry(doc, f_id, f_title, f_page, anchor=fig_anchor)'''

assert old_fig_loop in content, "Error: old_fig_loop not found!"
content = content.replace(old_fig_loop, new_fig_loop)
print("7. Replaced list_figs loop successfully!")

# 8. Update section headers with anchors
content = content.replace('add_h1(doc, "GIẤY TIẾP NHẬN SINH VIÊN THỰC TẬP")', 'add_h1(doc, "GIẤY TIẾP NHẬN SINH VIÊN THỰC TẬP", anchor="sec_tiep_nhan")')
content = content.replace('add_h1(doc, "NHẬT KÝ THỰC TẬP DOANH NGHIỆP (TỪ 17/08/2026 ĐẾN 20/10/2026)")', 'add_h1(doc, "NHẬT KÝ THỰC TẬP DOANH NGHIỆP (TỪ 17/08/2026 ĐẾN 20/10/2026)", anchor="sec_diary")')
content = content.replace('add_h1(doc, "PHIẾU NHẬN XÉT SINH VIÊN CỦA ĐƠN VỊ THỰC TẬP")', 'add_h1(doc, "PHIẾU NHẬN XÉT SINH VIÊN CỦA ĐƠN VỊ THỰC TẬP", anchor="sec_nx_dn")')
content = content.replace('add_h1(doc, "PHIẾU ĐÁNH GIÁ KẾT QUẢ THỰC TẬP DOANH NGHIỆP")', 'add_h1(doc, "PHIẾU ĐÁNH GIÁ KẾT QUẢ THỰC TẬP DOANH NGHIỆP", anchor="sec_dg_dn")')
content = content.replace('add_h1(doc, "NHẬN XÉT CỦA GIẢNG VIÊN HƯỚNG DẪN")', 'add_h1(doc, "NHẬN XÉT CỦA GIẢNG VIÊN HƯỚNG DẪN", anchor="sec_nx_gv")')
content = content.replace('add_h1(doc, "PHIẾU ĐÁNH GIÁ THỰC TẬP DOANH NGHIỆP")', 'add_h1(doc, "PHIẾU ĐÁNH GIÁ THỰC TẬP DOANH NGHIỆP", anchor="sec_dg_hd")')
content = content.replace('add_h1(doc, "BẢNG ĐÁNH GIÁ CHUẨN ĐẦU RA THỰC TẬP (CELO)")', 'add_h1(doc, "BẢNG ĐÁNH GIÁ CHUẨN ĐẦU RA THỰC TẬP (CELO)", anchor="sec_celo")')
content = content.replace('add_h1(doc, "LỜI CẢM ƠN")', 'add_h1(doc, "LỜI CẢM ƠN", anchor="sec_thanks")')
content = content.replace('add_h1(doc, "DANH MỤC CÁC KÝ TỰ, CHỮ VIẾT TẮT")', 'add_h1(doc, "DANH MỤC CÁC KÝ TỰ, CHỮ VIẾT TẮT", anchor="sec_abbr")')
content = content.replace('add_h1(doc, "DANH MỤC BẢNG BIỂU")', 'add_h1(doc, "DANH MỤC BẢNG BIỂU", anchor="sec_tbl_cat")')
content = content.replace('add_h1(doc, "DANH MỤC HÌNH VẼ")', 'add_h1(doc, "DANH MỤC HÌNH VẼ", anchor="sec_fig_cat")')
content = content.replace('add_h1(doc, "MỞ ĐẦU")', 'add_h1(doc, "MỞ ĐẦU", anchor="sec_intro")')
content = content.replace('add_h1(doc, "CHƯƠNG 1. TỔNG QUAN VỀ CƠ QUAN THỰC TẬP & BÀI TOÁN NGHIỆP VỤ")', 'add_h1(doc, "CHƯƠNG 1. TỔNG QUAN VỀ CƠ QUAN THỰC TẬP & BÀI TOÁN NGHIỆP VỤ", anchor="sec_c1")')
content = content.replace('add_h1(doc, "CHƯƠNG 2. CƠ SỞ LÝ THUYẾT VÀ CÔNG NGHỆ ÁP DỤNG")', 'add_h1(doc, "CHƯƠNG 2. CƠ SỞ LÝ THUYẾT VÀ CÔNG NGHỆ ÁP DỤNG", anchor="sec_c2")')
content = content.replace('add_h1(doc, "CHƯƠNG 3. PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG")', 'add_h1(doc, "CHƯƠNG 3. PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG", anchor="sec_c3")')
content = content.replace('add_h1(doc, "CHƯƠNG 4. HIỆN THỰC HÓA HỆ THỐNG VÀ KẾT QUẢ TRIỂN KHAI")', 'add_h1(doc, "CHƯƠNG 4. HIỆN THỰC HÓA HỆ THỐNG VÀ KẾT QUẢ TRIỂN KHAI", anchor="sec_c4")')
content = content.replace('add_h1(doc, "CHƯƠNG 5. QUY TRÌNH KIỂM THỬ VÀ BẢO ĐẢM CHẤT LƯỢNG PHẦN MỀM (QA/QC)")', 'add_h1(doc, "CHƯƠNG 5. QUY TRÌNH KIỂM THỬ VÀ BẢO ĐẢM CHẤT LƯỢNG PHẦN MỀM (QA/QC)", anchor="sec_c5")')
content = content.replace('add_h1(doc, "CHƯƠNG 6. SO SÁNH THỰC TẾ VỚI LÝ THUYẾT VÀ BÀI HỌC KINH NGHIỆM")', 'add_h1(doc, "CHƯƠNG 6. SO SÁNH THỰC TẾ VỚI LÝ THUYẾT VÀ BÀI HỌC KINH NGHIỆM", anchor="sec_c6")')
content = content.replace('add_h1(doc, "CHƯƠNG 7. KẾT LUẬN VÀ KIẾN NGHỊ")', 'add_h1(doc, "CHƯƠNG 7. KẾT LUẬN VÀ KIẾN NGHỊ", anchor="sec_c7")')
content = content.replace('add_h1(doc, "PHỤ LỤC")', 'add_h1(doc, "PHỤ LỤC", anchor="sec_appendix")')
print("8. Updated section headers with anchor bookmarks successfully!")

# 9. Update References Section with bookmarks and hanging indent
old_ref_section = '''    # ==========================================
    # 20. TÀI LIỆU THAM KHẢO
    # ==========================================
    print("20. Tạo Danh mục Tài liệu tham khảo...")
    add_h1(doc, "TÀI LIỆU THAM KHẢO")
    for ref in TAI_LIEU_THAM_KHAO:
        p = doc.add_paragraph()
        format_paragraph(p, space_before=3, space_after=3, first_line_indent=0)
        r = p.add_run(ref)
        r.font.name = "Times New Roman"
        r.font.size = Pt(11)'''

new_ref_section = '''    # ==========================================
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
        
        m_ref = re.match(r'^(\\[\\d+\\])\\s*(.*)', ref)
        if m_ref:
            num_tag = m_ref.group(1)
            ref_content = m_ref.group(2)
            
            r_num = p.add_run(f"{num_tag}\\t")
            r_num.font.name = "Times New Roman"
            r_num.font.size = Pt(11)
            r_num.font.bold = True
            r_num.font.color.rgb = RGBColor(0, 0x40, 0x80)
            
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
            r.font.size = Pt(11)'''

assert old_ref_section in content, "Error: old_ref_section not found!"
content = content.replace(old_ref_section, new_ref_section)
print("9. Replaced References section successfully!")

# Write updated content
with open(r'scripts/build_full_report.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("ALL PATCHES APPLIED SUCCESSFULLY TO build_full_report.py!")
