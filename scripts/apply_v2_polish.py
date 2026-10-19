import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

script_path = r"Q:\CODE_visual\filebctt\scripts\build_full_report.py"

with open(script_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Thêm hàm add_toc_entry và add_table_caption
helper_additions = '''
def add_toc_entry(doc, title, page_num, level=0):
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
    format_paragraph(p, space_before=8, space_after=3, align=WD_ALIGN_PARAGRAPH.CENTER, first_line_indent=0)
    p.paragraph_format.keep_with_next = True
    r = p.add_run(f"{label}: {title}")
    r.font.name = "Times New Roman"
    r.font.size = Pt(11)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0, 0, 0)
    return p
'''

if 'def add_toc_entry' not in content:
    content = content.replace('def add_catalog_entry', helper_additions + '\ndef add_catalog_entry')

# 2. Cập nhật set_table_borders để thêm cantSplit và tblHeader tự động
old_borders_fn = '''def set_table_borders(table, color="000000", sz="4", val="single"):
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

new_borders_fn = '''def set_table_borders(table, color="000000", sz="4", val="single"):
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
            trPr.append(parse_xml(f'<w:tblHeader {nsdecls("w")}/>'))'''

if old_borders_fn in content:
    content = content.replace(old_borders_fn, new_borders_fn)

# 3. Cập nhật Heading 1 căn giữa trang trọng như V2
old_add_h1 = '''def add_h1(doc, text, in_toc=True):
    p = doc.add_paragraph()
    if in_toc:
        try:
            p.style = doc.styles['Heading 1']
        except Exception:
            pass
        set_paragraph_outline(p, 0)
    format_paragraph(p, space_before=16, space_after=8, align=WD_ALIGN_PARAGRAPH.LEFT, first_line_indent=0)
    p.paragraph_format.keep_with_next = True
    r = p.add_run(text)
    r.font.name = "Times New Roman"
    r.font.size = Pt(15)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0, 0, 0)'''

new_add_h1 = '''def add_h1(doc, text, in_toc=True, align=WD_ALIGN_PARAGRAPH.CENTER):
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
    r.font.color.rgb = RGBColor(0, 0, 0)'''

if old_add_h1 in content:
    content = content.replace(old_add_h1, new_add_h1)

# 4. Cập nhật phần Mục Lục trong hàm build_document để in chi tiết bảng Mục Lục đẹp mắt
old_toc_sec = '''    # ==========================================
    # 11. MỤC LỤC TỰ ĐỘNG (WORD NATIVE TOC FIELD)
    # ==========================================
    print("11. Tạo Mục Lục Tự Động...")
    add_h1(doc, "MỤC LỤC", in_toc=False)

    p_toc = doc.add_paragraph()
    format_paragraph(p_toc, space_before=6, space_after=6, align=WD_ALIGN_PARAGRAPH.LEFT, first_line_indent=0)
    r_toc = p_toc.add_run()
    r_toc._r.append(parse_xml(r'<w:fldChar %s w:fldCharType="begin"/>' % nsdecls('w')))
    r_toc._r.append(parse_xml(r'<w:instrText %s xml:space="preserve"> TOC \\o "1-3" \\h \\z \\u </w:instrText>' % nsdecls('w')))
    r_toc._r.append(parse_xml(r'<w:fldChar %s w:fldCharType="separate"/>' % nsdecls('w')))
    r_toc._r.append(parse_xml(r'<w:fldChar %s w:fldCharType="end"/>' % nsdecls('w')))

    doc.add_page_break()'''

new_toc_sec = '''    # ==========================================
    # 11. MỤC LỤC TỔNG THỂ (CHI TIẾT VÀ CHUẨN ĐẸP NHƯ V2)
    # ==========================================
    print("11. Tạo Mục Lục Chi Tiết Chuẩn Học Thuật...")
    add_h1(doc, "MỤC LỤC", in_toc=False, align=WD_ALIGN_PARAGRAPH.CENTER)

    # Trường cập nhật tự động của Word
    p_toc = doc.add_paragraph()
    format_paragraph(p_toc, space_before=2, space_after=4, align=WD_ALIGN_PARAGRAPH.LEFT, first_line_indent=0)
    r_toc = p_toc.add_run()
    r_toc._r.append(parse_xml(r'<w:fldChar %s w:fldCharType="begin"/>' % nsdecls('w')))
    r_toc._r.append(parse_xml(r'<w:instrText %s xml:space="preserve"> TOC \\o "1-3" \\h \\z \\u </w:instrText>' % nsdecls('w')))
    r_toc._r.append(parse_xml(r'<w:fldChar %s w:fldCharType="separate"/>' % nsdecls('w')))
    r_toc._r.append(parse_xml(r'<w:fldChar %s w:fldCharType="end"/>' % nsdecls('w')))

    detailed_toc_items = [
        ("NHẬT KÝ THỰC TẬP DOANH NGHIỆP (10 TUẦN)", 4, 0),
        ("PHIẾU NHẬN XÉT CỦA ĐƠN VỊ THỰC TẬP", 10, 0),
        ("PHIẾU ĐÁNH GIÁ KẾT QUẢ CỦA CƠ QUAN TIẾP NHẬN", 11, 0),
        ("NHẬN XÉT CỦA GIẢNG VIÊN HƯỚNG DẪN", 14, 0),
        ("PHIẾU ĐÁNH GIÁ CỦA HỘI ĐỒNG THỰC TẬP", 16, 0),
        ("BẢNG ĐÁNH GIÁ CHUẨN ĐẦU RA THỰC TẬP (CELO 1 - 5)", 18, 0),
        ("LỜI CẢM ƠN", 20, 0),
        ("DANH MỤC CÁC KÝ TỰ, CHỮ VIẾT TẮT", 24, 0),
        ("DANH MỤC BẢNG BIỂU", 25, 0),
        ("DANH MỤC HÌNH VẼ", 27, 0),
        ("MỞ ĐẦU", 29, 0),
        ("1. Tính cấp thiết của đề tài", 29, 1),
        ("2. Mục đích và nhiệm vụ nghiên cứu", 30, 1),
        ("3. Đối tượng và phạm vi nghiên cứu", 30, 1),
        ("4. Phương pháp nghiên cứu", 31, 1),
        ("5. Ý nghĩa khoa học và thực tiễn", 31, 1),
        ("CHƯƠNG 1. TỔNG QUAN VỀ CƠ QUAN THỰC TẬP & BÀI TOÁN NGHIỆP VỤ", 32, 0),
        ("1.1. Lịch sử hình thành và phát triển của đơn vị thực tập", 32, 1),
        ("1.2. Chức năng và nhiệm vụ hoạt động của cơ quan", 33, 1),
        ("1.3. Sơ đồ cơ cấu tổ chức và bố trí nhân sự", 34, 1),
        ("1.4. Khảo sát hiện trạng công tác quản lý chính sách người có công", 35, 1),
        ("1.5. Căn cứ pháp lý và các quy định nhà nước nền tảng", 36, 1),
        ("1.6. Những bất cập, khó khăn của quy trình thủ công cũ", 36, 1),
        ("1.7. Mục tiêu và phạm vi xây dựng dự án", 37, 1),
        ("CHƯƠNG 2. CƠ SỞ LÝ THUYẾT VÀ CÔNG NGHỆ ÁP DỤNG", 38, 0),
        ("2.1. Tổng quan kiến trúc phần mềm Hybrid Modular Monolith", 38, 1),
        ("2.2. Công nghệ Frontend và thiết kế giao diện", 39, 1),
        ("2.3. Công nghệ Backend và dịch vụ xử lý trung tâm", 40, 1),
        ("2.4. Hệ quản trị cơ sở dữ liệu MySQL 8.0 và chuẩn hóa CSDL", 42, 1),
        ("2.5. Giải pháp tích hợp liên thông LGSP và an toàn thông tin", 43, 1),
        ("2.6. Lý thuyết và quy trình kiểm thử phần mềm (QA/QC)", 44, 1),
        ("CHƯƠNG 3. PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG", 46, 0),
        ("3.1. Phân tích các tác nhân (Actors) và mô hình phân quyền RBAC", 46, 1),
        ("3.2. Sơ đồ Use Case tổng quát và đặc tả chi tiết các Use Case trọng tâm", 47, 1),
        ("3.3. Thiết kế sơ đồ tuần tự (Sequence Diagrams)", 48, 1),
        ("3.4. Thiết kế cơ sở dữ liệu và sơ đồ thực thể quan hệ (ERD)", 49, 1),
        ("3.5. Từ điển dữ liệu cơ sở dữ liệu MySQL (16 bảng chuẩn 3NF)", 50, 1),
        ("3.6. Đặc tả chi tiết RESTful API Contracts", 60, 1),
        ("CHƯƠNG 4. HIỆN THỰC HÓA HỆ THỐNG VÀ KẾT QUẢ TRIỂN KHAI", 64, 0),
        ("4.1. Hiện thực hóa các thuật toán và logic nghiệp vụ cốt lõi", 64, 1),
        ("4.1.8. Giải thuật và cơ chế tính toán trợ cấp chuẩn y khoa (BigDecimal)", 65, 2),
        ("4.1.9. Giải thuật chuyển đổi số tiền thành chữ tiếng Việt (Mẫu C70a-HD)", 66, 2),
        ("4.1.10. Quy trình và cơ chế xử lý báo giảm khai tử và ngắt chi trả", 67, 2),
        ("4.2. Chi tiết kết quả giao diện hệ thống kèm 21 ảnh chụp thực tế", 68, 1),
        ("CHƯƠNG 5. QUY TRÌNH KIỂM THỬ VÀ BẢO ĐẢM CHẤT LƯỢNG (QA/QC)", 79, 0),
        ("5.1. Kế hoạch kiểm thử và môi trường thực hiện", 79, 1),
        ("5.2. Danh mục Checklist kiểm thử chức năng và giao diện (30 mục)", 80, 1),
        ("5.3. Kịch bản kiểm thử chi tiết Test Cases Specification (50 Test Cases)", 82, 1),
        ("5.4. Bảng ghi nhận và theo dõi lỗi phần mềm Bug Report Sheet (15 lỗi)", 87, 1),
        ("5.5. Báo cáo tổng kết chất lượng kiểm thử Test Summary Report", 91, 1),
        ("CHƯƠNG 6. SO SÁNH THỰC TẾ VỚI LÝ THUYẾT VÀ BÀI HỌC KINH NGHIỆM", 92, 0),
        ("6.1. So sánh thực tế với lý thuyết trên giảng đường", 92, 1),
        ("6.2. Những kinh nghiệm thực tiễn rút ra sau quá trình thực tập", 94, 1),
        ("6.3. Đề xuất các giải pháp cải tiến", 95, 1),
        ("CHƯƠNG 7. KẾT LUẬN VÀ KIẾN NGHỊ", 97, 0),
        ("7.1. Đánh giá kết quả đạt được đối với mục tiêu đề ra", 97, 1),
        ("7.2. Những hạn chế còn tồn tại của hệ thống", 98, 1),
        ("7.3. Hướng phát triển trong tương lai", 98, 1),
        ("TÀI LIỆU THAM KHẢO", 100, 0),
        ("PHỤ LỤC", 101, 0),
        ("Phụ lục 1: Biểu mẫu hành chính áp dụng trong hệ thống", 101, 1),
        ("Phụ lục 2: Đặc tả lược đồ và ràng buộc toàn vẹn CSDL MySQL", 101, 1),
        ("Phụ lục 3: Bảng quy đổi định mức trợ cấp pháp lý (Bảng PL.1)", 102, 1),
        ("Phụ lục 4: Thuật ngữ và khái niệm nghiệp vụ an sinh xã hội (Bảng PL.2)", 102, 1)
    ]
    for item_t, item_pg, item_lvl in detailed_toc_items:
        add_toc_entry(doc, item_t, item_pg, level=item_lvl)

    doc.add_page_break()'''

if old_toc_sec in content:
    content = content.replace(old_toc_sec, new_toc_sec)

# 5. Cập nhật số trang chính xác cho DANH MỤC BẢNG BIỂU
old_tbl_list = '''    list_tables = [
        ("Bảng 1.1", "Nhật ký công việc thực tập doanh nghiệp (17/08/2026 – 20/10/2026)", 5),
        ("Bảng 1.2", "Đánh giá kết quả thực tập dành cho Cán bộ hướng dẫn tại đơn vị", 11),
        ("Bảng 1.3", "Đánh giá thực tập doanh nghiệp dành cho Hội đồng chấm điểm", 15),
        ("Bảng 1.4", "Đánh giá kết quả thực tập theo Chuẩn đầu ra (CELO 1 - 5)", 17),
        ("Bảng 3.1", "Từ điển dữ liệu bảng dm_phuong (Danh mục 14 phường)", 48),
        ("Bảng 3.2", "Từ điển dữ liệu bảng dm_loai_doi_tuong (Danh mục loại đối tượng NCC)", 48),
        ("Bảng 3.3", "Từ điển dữ liệu bảng sys_roles (Danh mục vai trò quản trị RBAC)", 48),
        ("Bảng 3.4", "Từ điển dữ liệu bảng sys_users (Tài khoản cán bộ công chức)", 49),
        ("Bảng 3.5", "Từ điển dữ liệu bảng ho_so_ncc (Bảng trung tâm quản lý hồ sơ NCC)", 50),
        ("Bảng 3.6", "Từ điển dữ liệu bảng quyet_dinh_huong (Quyết định hưởng trợ cấp ưu đãi)", 51),
        ("Bảng 3.7", "Từ điển dữ liệu bảng lich_su_chi_tra (Lịch sử chi trả trợ cấp hàng tháng)", 51),
        ("Bảng 3.8", "Từ điển dữ liệu bảng khao_sat_danh_gia (Khảo sát đánh giá CSAT công dân)", 52),
        ("Bảng 3.9", "Từ điển dữ liệu bảng chi_tiet_tieu_chi_danh_gia (Điểm số 4 tiêu chí SIPAS)", 52),
        ("Bảng 3.10", "Từ điển dữ liệu bảng ho_so_liet_sy (Chi tiết hồ sơ liệt sĩ theo NĐ 131)", 53),
        ("Bảng 3.11", "Từ điển dữ liệu bảng than_nhan_liet_si (Quản lý thân nhân và người thờ cúng)", 54),
        ("Bảng 3.12", "Từ điển dữ liệu bảng ke_hoach_dieu_duong (Kế hoạch điều dưỡng hàng năm)", 54),
        ("Bảng 3.13", "Từ điển dữ liệu bảng danh_sach_dieu_duong (Chi tiết các đợt điều dưỡng)", 55),
        ("Bảng 3.14", "Từ điển dữ liệu bảng ho_so_bao_giam_mai_tang (Báo giảm & QĐ Mai táng Mẫu 02)", 56),
        ("Bảng 3.15", "Từ điển dữ liệu bảng danh_sach_phuong_tien_chinh_hinh (Dụng cụ chỉnh hình)", 56),
        ("Bảng 3.16", "Từ điển dữ liệu bảng nghia_trang_mo_liet_si (Số hóa bản đồ mộ liệt sĩ GIS)", 57),
        ("Bảng 3.17", "Từ điển dữ liệu bảng doi_soat_chi_tra_ngan_hang (Đối soát ngân hàng Đề án 06)", 58),
        ("Bảng 3.18", "Danh mục 12 RESTful API Contracts của hệ thống", 59),
        ("Bảng 5.1", "Danh mục Checklist kiểm thử chức năng và giao diện hệ thống (30 hạng mục)", 77),
        ("Bảng 5.2", "Bảng kịch bản kiểm thử chi tiết Test Cases Specification (50 Test Cases)", 79),
        ("Bảng 5.3", "Bảng ghi nhận và theo dõi lỗi phần mềm Bug Report Sheet (15 lỗi thực tế)", 84),
        ("Bảng 5.4", "Báo cáo tổng kết chất lượng kiểm thử Test Summary Report", 89),
        ("Bảng PL.1", "Bảng quy đổi định mức phụ cấp, trợ cấp ưu đãi người có công theo Nghị định 75/2021/NĐ-CP", 99),
        ("Bảng PL.2", "Thuật ngữ và Khái niệm Nghiệp vụ Hành chính An sinh Xã hội (Theo NĐ 55/2023)", 100)
    ]'''

new_tbl_list = '''    list_tables = [
        ("Bảng 1.1", "Nhật ký công việc thực tập doanh nghiệp (17/08/2026 – 20/10/2026)", 4),
        ("Bảng 1.2", "Đánh giá kết quả thực tập dành cho Cán bộ hướng dẫn tại đơn vị", 11),
        ("Bảng 1.3", "Đánh giá thực tập doanh nghiệp dành cho Hội đồng chấm điểm", 16),
        ("Bảng 1.4", "Đánh giá kết quả thực tập theo Chuẩn đầu ra (CELO 1 - 5)", 18),
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
        ("Bảng 3.16", "Từ điển dữ liệu bảng nghia_trang_mo_liet_si (Số hóa bản đồ mộ liệt sĩ GIS)", 58),
        ("Bảng 3.17", "Từ điển dữ liệu bảng doi_soat_chi_tra_ngan_hang (Đối soát ngân hàng Đề án 06)", 59),
        ("Bảng 3.18", "Danh mục 12 RESTful API Contracts của hệ thống", 60),
        ("Bảng 4.1", "Ma trận quy tắc nghiệp vụ và công thức tính toán trợ cấp ưu đãi người có công", 65),
        ("Bảng 4.2", "Bảng ma trận quy tắc ngữ pháp chuyển đổi số tiền thành chữ tiếng Việt", 66),
        ("Bảng 4.3", "Ma trận chuyển đổi trạng thái và tác động nghiệp vụ khi thực hiện báo giảm khai tử", 67),
        ("Bảng 5.1", "Danh mục Checklist kiểm thử chức năng và giao diện hệ thống (30 hạng mục)", 80),
        ("Bảng 5.2", "Bảng kịch bản kiểm thử chi tiết Test Cases Specification (50 Test Cases)", 82),
        ("Bảng 5.3", "Bảng ghi nhận và theo dõi lỗi phần mềm Bug Report Sheet (15 lỗi thực tế)", 87),
        ("Bảng 5.4", "Báo cáo tổng kết chất lượng kiểm thử Test Summary Report", 91),
        ("Bảng PL.1", "Bảng quy đổi định mức phụ cấp, trợ cấp ưu đãi người có công theo Nghị định 75/2021/NĐ-CP", 102),
        ("Bảng PL.2", "Thuật ngữ và Khái niệm Nghiệp vụ Hành chính An sinh Xã hội (Theo NĐ 55/2023)", 102)
    ]'''

if old_tbl_list in content:
    content = content.replace(old_tbl_list, new_tbl_list)

# 6. Cập nhật số trang chính xác cho DANH MỤC HÌNH VẼ
old_fig_list = '''    list_figs = [
        ("Hình 1.1", "Trụ sở Phòng Văn hóa và Thông tin thành phố Thủ Dầu Một", 34),
        ("Hình 1.2", "Sơ đồ cơ cấu tổ chức Phòng Văn hóa và Thông tin TP. Thủ Dầu Một", 35),
        ("Hình 2.1", "Sơ đồ Kiến trúc tổng thể phần mềm Hybrid Modular Monolith", 38),
        ("Hình 2.2", "Sơ đồ các nhiệm vụ chính của thực tập sinh chuyển đổi số", 39),
        ("Hình 2.3", "Sơ đồ cơ sở quản lý dữ liệu hồ sơ người có công và phân hệ Backend API", 41),
        ("Hình 2.4", "Sơ đồ Tích hợp hệ thống liên thông dữ liệu qua Trục LGSP", 42),
        ("Hình 2.5", "Sơ đồ Quy trình kiểm thử phần mềm QA/QC 7 bước tiêu chuẩn", 43),
        ("Hình 3.1", "Sơ đồ Tuần tự (Sequence Diagram) thẩm định hồ sơ và tự động tính trợ cấp", 47),
        ("Hình 3.2", "Sơ đồ Mối quan hệ Thực thể CSDL MySQL (ERD Diagram)", 48),
        ("Hình 4.1", "Cổng đăng nhập công vụ - Phân quyền Quản trị Cấp Sở", 64),
        ("Hình 4.2", "Cổng đăng nhập công vụ - Phân quyền Cán bộ Cấp Phòng / Phường", 65),
        ("Hình 4.3", "Bảng điều khiển điều hành trung tâm (Dashboard) và Trung tâm Cảnh báo Rủi ro", 65),
        ("Hình 4.4", "Biểu đồ kinh phí chi trả trợ cấp ưu đãi phân tầng theo 14 phường", 66),
        ("Hình 4.5", "Menu chuyển đổi vai trò quản trị linh hoạt trên thanh tiêu đề", 66),
        ("Hình 4.6", "Giao diện quản lý hồ sơ Một cửa và In Giấy hẹn tiếp nhận Mẫu số 01 có mã QR", 67),
        ("Hình 4.7", "Giao diện Kiosk đánh giá mức độ hài lòng độc lập dành cho công dân", 67),
        ("Hình 4.8", "Màn hình giám sát chỉ số CSAT & Biểu đồ Radar 4 tiêu chí SIPAS", 68),
        ("Hình 4.9", "Biểu mẫu Phiếu chi trợ cấp Mẫu C70a-HD theo quy định Bộ Tài chính", 68),
        ("Hình 4.10", "Chi tiết hồ sơ Liệt sĩ, trích lục hy sinh và Ký số SmartCA PKI", 69),
        ("Hình 4.11", "Phân hệ Quản lý điều dưỡng phục hồi sức khỏe theo chu kỳ 1 năm / 2 năm", 69),
        ("Hình 4.12", "Bản đồ nhiệt (Heatmap) mật độ hồ sơ người có công trên địa bàn 14 phường", 70),
        ("Hình 4.13", "Quản lý cấp phương tiện trợ giúp và dụng cụ chỉnh hình theo niên hạn", 70),
        ("Hình 4.14", "Bản đồ số Nghĩa trang Liệt sĩ GIS và chức năng thắp hương trực tuyến", 71),
        ("Hình 4.15", "Cổng tra cứu trực tuyến dành cho Công dân và Thân nhân", 71),
        ("Hình 4.16", "Danh sách hồ sơ báo giảm từ trần & Ban hành Quyết định Mai táng phí Mẫu số 02", 72),
        ("Hình 4.17", "Quản lý chi trả và Đối soát tự động ngân hàng theo Đề án 06/CP", 72),
        ("Hình 4.18", "Quy trình thẩm định hồ sơ 5 bước chuẩn y khoa và áp giá tự động", 73),
        ("Hình 4.19", "Cấu hình tham số hệ thống, mức chuẩn trợ cấp và quản trị người dùng", 73),
        ("Hình 4.20", "Hộp thoại tiếp nhận hồ sơ người có công mới tại Bộ phận Một cửa", 74),
        ("Hình 4.21", "Hộp thoại ứng dụng AI OCR số hóa trích xuất tài liệu cũ tự động", 74)
    ]'''

new_fig_list = '''    list_figs = [
        ("Hình 1.1", "Trụ sở Phòng Văn hóa và Thông tin thành phố Thủ Dầu Một", 32),
        ("Hình 1.2", "Sơ đồ cơ cấu tổ chức Phòng Văn hóa và Thông tin TP. Thủ Dầu Một", 34),
        ("Hình 2.1", "Sơ đồ Kiến trúc tổng thể phần mềm Hybrid Modular Monolith", 38),
        ("Hình 2.2", "Sơ đồ các nhiệm vụ chính của thực tập sinh chuyển đổi số", 39),
        ("Hình 2.3", "Sơ đồ cơ sở quản lý dữ liệu hồ sơ người có công và phân hệ Backend API", 41),
        ("Hình 2.4", "Sơ đồ Tích hợp hệ thống liên thông dữ liệu qua Trục LGSP", 43),
        ("Hình 2.5", "Sơ đồ Quy trình kiểm thử phần mềm QA/QC 7 bước tiêu chuẩn", 45),
        ("Hình 3.1", "Sơ đồ Tuần tự (Sequence Diagram) thẩm định hồ sơ và tự động tính trợ cấp", 48),
        ("Hình 3.2", "Sơ đồ Mối quan hệ Thực thể CSDL MySQL (ERD Diagram)", 49),
        ("Hình 4.1", "Giao diện Cổng Đăng nhập Phân quyền Quản trị Cấp Sở", 68),
        ("Hình 4.2", "Giao diện Cổng Đăng nhập Cán bộ Chuyên viên Cấp Phòng", 68),
        ("Hình 4.3", "Bảng điều khiển trung tâm Giám sát và Thống kê Toàn diện", 69),
        ("Hình 4.4", "Biểu đồ Phân bổ Kinh phí Trợ cấp Phân tầng theo 14 Phường", 69),
        ("Hình 4.5", "Trình đơn Chuyển đổi Nhanh Vai trò Quản trị và Kiểm toán", 70),
        ("Hình 4.6", "Mẫu Giấy hẹn Tiếp nhận Một cửa Tích hợp Mã QR Code Tra cứu", 70),
        ("Hình 4.7", "Cổng Kiosk Khảo sát và Đánh giá Sự hài lòng Công dân (CSAT)", 71),
        ("Hình 4.8", "Trung tâm Giám sát Chỉ số CSAT và Biểu đồ Radar SIPAS Cán bộ", 71),
        ("Hình 4.9", "Phiếu Chi trả Trợ cấp Người có công Mẫu C70a-HD Tích hợp Mã vạch", 72),
        ("Hình 4.10", "Màn hình Chi tiết Hồ sơ Liệt sĩ và Danh sách Thân nhân Hưởng quyền lợi", 72),
        ("Hình 4.11", "Phân hệ Quản lý Chỉ tiêu và Lập danh sách Điều dưỡng Hàng năm", 73),
        ("Hình 4.12", "Bản đồ Nhiệt (Heatmap) Mật độ Hồ sơ và Phân tích Dữ liệu Phường", 73),
        ("Hình 4.13", "Quản lý Cấp phát Phương tiện Trợ giúp và Dụng cụ Chỉnh hình", 74),
        ("Hình 4.14", "Bản đồ Số Không gian GIS Nghĩa trang Liệt sĩ Tỉnh Bình Dương", 74),
        ("Hình 4.15", "Cổng Dịch vụ Tra cứu Tiến độ Xử lý Hồ sơ Công dân theo Số CCCD", 75),
        ("Hình 4.16", "Quy trình Nghiệp vụ Báo giảm Từ trần và Quyết định Mai táng phí Mẫu 02", 75),
        ("Hình 4.17", "Module Đối soát Tự động Chi trả Ngân hàng (Bank Reconciliation)", 76),
        ("Hình 4.18", "Quy trình Thẩm định Hồ sơ 5 Bước Một cửa và Ký số SmartCA", 76),
        ("Hình 4.19", "Giao diện Cấu hình Định mức Trợ cấp Pháp lý và Tham số Hệ thống", 77),
        ("Hình 4.20", "Modal Tiếp nhận Hồ sơ Người có công Mới có Cơ chế Kiểm tra Dữ liệu Zod", 77),
        ("Hình 4.21", "Modal Số hóa Tài liệu bằng Trí tuệ Nhân tạo (AI OCR) và Trích xuất Dữ liệu", 78)
    ]'''

if old_fig_list in content:
    content = content.replace(old_fig_list, new_fig_list)

# Ghi lại file
with open(script_path, "w", encoding="utf-8") as f:
    f.write(content)

print("build_full_report.py polished successfully!")
