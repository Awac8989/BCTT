import sys
sys.stdout.reconfigure(encoding='utf-8')
import re

target_file = 'scripts/build_full_report.py'

with open(target_file, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace the front matter / cover section with 3 sections
start_anchor = '    # Cấu hình lề trang và kích thước A4 chuẩn theo Mau Bao Cao'
end_anchor = '    # ==========================================\n    # 10. LỜI CẢM ƠN'

replacement_front = '''    # ==========================================
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

'''

idx_start = content.find(start_anchor)
idx_end = content.find(end_anchor)

if idx_start == -1 or idx_end == -1:
    print(f"Error: could not find front anchors: idx_start={idx_start}, idx_end={idx_end}")
    sys.exit(1)

content = content[:idx_start] + replacement_front + content[idx_end:]

# 2. Update detailed_toc_items to remove front administrative forms
toc_old = '''    detailed_toc_items = [
        ("NHẬT KÝ THỰC TẬP DOANH NGHIỆP (10 TUẦN)", 4, 0),
        ("PHIẾU NHẬN XÉT CỦA ĐƠN VỊ THỰC TẬP", 9, 0),
        ("PHIẾU ĐÁNH GIÁ KẾT QUẢ CỦA CƠ QUAN TIẾP NHẬN", 11, 0),
        ("NHẬN XÉT CỦA GIẢNG VIÊN HƯỚNG DẪN", 13, 0),
        ("PHIẾU ĐÁNH GIÁ CỦA HỘI ĐỒNG THỰC TẬP", 15, 0),
        ("BẢNG ĐÁNH GIÁ CHUẨN ĐẦU RA THỰC TẬP (CELO 1 - 5)", 17, 0),
        ("LỜI CẢM ƠN", 18, 0),'''

toc_new = '''    detailed_toc_items = [
        ("LỜI CẢM ƠN", 3, 0),'''

if toc_old in content:
    content = content.replace(toc_old, toc_new)
    print("Updated detailed_toc_items successfully")
else:
    print("Warning: toc_old not found directly, checking...")

# 3. Update saving logic at end
save_old = '''    print(f"Lưu file Word ra: {OUTPUT_FILE}")
    doc.save(OUTPUT_FILE)

    # Đồng thời sao chép ra file dễ thấy ở thư mục gốc
    import shutil
    shutil.copyfile(OUTPUT_FILE, ROOT_COPY_FILE)
    print(f"Đã sao chép ra thư mục gốc: {ROOT_COPY_FILE}")'''

save_new = '''    print(f"Lưu file Word ra: {OUTPUT_FILE}")
    doc.save(OUTPUT_FILE)

    ROOT_PRINT_FILE = r"Q:\CODE_visual\filebctt\BAO_CAO_THUC_TAP_DOAN_MINH_QUAN_BAN_IN_CHUAN.docx"
    doc.save(ROOT_PRINT_FILE)
    print(f"Đã lưu bản in chuẩn ra: {ROOT_PRINT_FILE}")

    import shutil
    try:
        shutil.copyfile(OUTPUT_FILE, ROOT_COPY_FILE)
        print(f"Đã cập nhật ra thư mục gốc: {ROOT_COPY_FILE}")
    except PermissionError:
        print(f"Lưu ý: Tệp {ROOT_COPY_FILE} đang mở trong Word. Bản in chuẩn mới nhất đã được lưu tại {OUTPUT_FILE} và {ROOT_PRINT_FILE}.")
    except Exception as e:
        print(f"Lỗi sao chép: {e}")'''

if save_old in content:
    content = content.replace(save_old, save_new)
    print("Updated save block successfully")
else:
    print("Warning: save_old not found directly")

with open(target_file, 'w', encoding='utf-8') as f:
    f.write(content)

print("Patch applied to scripts/build_full_report.py successfully!")
