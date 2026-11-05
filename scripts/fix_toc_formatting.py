import docx
from docx.shared import Pt, RGBColor
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

DOCX_FILES = [
    "DoanMinhQuan_2224801030137_BCTT2.docx",
    "docs/DoanMinhQuan_2224801030137_BCTT2.docx"
]

TOC_ITEMS = [
    # (Title, Page, Level)
    ("LỜI CẢM ƠN", "3", 1),
    ("DANH MỤC CÁC KÝ TỰ, CHỮ VIẾT TẮT", "6", 1),
    ("DANH MỤC BẢNG BIỂU", "8", 1),
    ("DANH MỤC HÌNH VẼ", "10", 1),
    ("MỞ ĐẦU", "12", 1),
    ("1. Tính cấp thiết của đề tài", "12", 2),
    ("2. Mục đích và nhiệm vụ nghiên cứu", "12", 2),
    ("3. Đối tượng và phạm vi nghiên cứu", "13", 2),
    ("4. Phương pháp nghiên cứu", "13", 2),
    ("5. Ý nghĩa khoa học và thực tiễn", "14", 2),
    ("CHƯƠNG 1. TỔNG QUAN VỀ CƠ QUAN THỰC TẬP & BÀI TOÁN NGHIỆP VỤ", "15", 1),
    ("1.1. Lịch sử hình thành và phát triển của đơn vị thực tập", "15", 2),
    ("1.2. Chức năng và nhiệm vụ hoạt động của cơ quan", "16", 2),
    ("1.3. Sơ đồ cơ cấu tổ chức và bố trí nhân sự", "17", 2),
    ("1.4. Khảo sát hiện trạng công tác quản lý chính sách người có công", "18", 2),
    ("1.5. Căn cứ pháp lý và các quy định nhà nước nền tảng", "19", 2),
    ("1.6. Những bất cập, khó khăn của quy trình thủ công cũ", "20", 2),
    ("1.7. Mục tiêu và phạm vi xây dựng dự án", "20", 2),
    ("CHƯƠNG 2. CƠ SỞ LÝ THUYẾT VÀ CÔNG NGHỆ ÁP DỤNG", "21", 1),
    ("2.1. Tổng quan kiến trúc phần mềm Hybrid Modular Monolith", "21", 2),
    ("2.2. Công nghệ Frontend và thiết kế giao diện", "23", 2),
    ("2.3. Công nghệ Backend và dịch vụ xử lý trung tâm", "23", 2),
    ("2.4. Hệ quản trị cơ sở dữ liệu MySQL 8.0 và chuẩn hóa CSDL", "24", 2),
    ("2.5. Giải pháp tích hợp liên thông LGSP và an toàn thông tin", "24", 2),
    ("2.6. Lý thuyết và quy trình kiểm thử phần mềm (QA/QC)", "25", 2),
    ("CHƯƠNG 3. PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG", "27", 1),
    ("3.1. Phân tích các tác nhân (Actors) và mô hình phân quyền RBAC", "27", 2),
    ("3.2. Sơ đồ Use Case tổng quát và đặc tả các Use Case trọng tâm", "27", 2),
    ("3.3. Thiết kế sơ đồ tuần tự (Sequence Diagrams)", "32", 2),
    ("3.4. Thiết kế cơ sở dữ liệu chi tiết (16 bảng chuẩn 3NF)", "33", 2),
    ("3.5. Từ điển dữ liệu cơ sở dữ liệu MySQL (16 bảng chuẩn 3NF)", "39", 2),
    ("3.6. Đặc tả chi tiết RESTful API Contracts", "61", 2),
    ("CHƯƠNG 4. HIỆN THỰC HÓA HỆ THỐNG VÀ KẾT QUẢ TRIỂN KHAI", "67", 1),
    ("4.1. Hiện thực hóa các thuật toán và logic nghiệp vụ cốt lõi", "67", 2),
    ("4.1.8. Giải thuật tính toán trợ cấp chuẩn y khoa (BigDecimal)", "68", 3),
    ("4.1.9. Giải thuật chuyển đổi số tiền thành chữ (Mẫu C70a-HD)", "70", 3),
    ("4.1.10. Quy trình xử lý báo giảm khai tử và dừng chi trả", "72", 3),
    ("4.1.11. Thuật toán tính trợ cấp mai táng phí và một lần", "73", 3),
    ("4.1.12. Thuật toán tính trợ cấp bảo trợ xã hội (Nghị định 76/2024)", "74", 3),
    ("4.1.13. Cơ chế an toàn Safety Guards và nhật ký Audit Trail", "74", 3),
    ("4.1.14. Thuật toán định vị GIS và mã QR dẫn đường mộ liệt sĩ", "74", 3),
    ("4.2. Chi tiết kết quả giao diện hệ thống kèm 38 ảnh chụp thực tế", "75", 2),
    ("4.2.22. Trình diễn bộ tính năng nghiệp vụ quản lý nhà nước mới", "87", 3),
    ("CHƯƠNG 5. QUY TRÌNH KIỂM THỬ VÀ ĐẢM BẢO CHẤT LƯỢNG (QA/QC)", "98", 1),
    ("5.1. Kế hoạch kiểm thử và môi trường thực hiện", "98", 2),
    ("5.2. Danh mục Checklist kiểm thử chức năng và giao diện (Bảng 5.1)", "99", 2),
    ("5.3. Bảng kịch bản kiểm thử chi tiết Test Cases Specification (Bảng 5.2)", "99", 2),
    ("5.4. Bảng ghi nhận và theo dõi lỗi phần mềm Bug Report Sheet (Bảng 5.3)", "116", 2),
    ("5.5. Báo cáo tổng kết chất lượng kiểm thử Test Summary Report (Bảng 5.4)", "125", 2),
    ("CHƯƠNG 6. SO SÁNH THỰC TẾ VỚI LÝ THUYẾT VÀ BÀI HỌC KINH NGHIỆM", "127", 1),
    ("6.1. So sánh thực tế với lý thuyết trên giảng đường", "127", 2),
    ("6.2. Những kinh nghiệm thực tiễn rút ra sau quá trình thực tập", "128", 2),
    ("6.3. Đề xuất các giải pháp cải tiến", "128", 2),
    ("CHƯƠNG 7. KẾT LUẬN VÀ KIẾN NGHỊ", "130", 1),
    ("7.1. Đánh giá kết quả đạt được đối với mục tiêu đề ra", "130", 2),
    ("7.2. Những hạn chế còn tồn tại của hệ thống", "130", 2),
    ("7.3. Hướng phát triển trong tương lai", "131", 2),
    ("TÀI LIỆU THAM KHẢO", "133", 1),
    ("PHỤ LỤC", "135", 1),
    ("Phụ lục 1: Biểu mẫu hành chính áp dụng trong hệ thống", "135", 2),
    ("Phụ lục 2: Đặc tả lược đồ và ràng buộc toàn vẹn CSDL MySQL", "135", 2),
    ("Phụ lục 3: Bảng quy đổi định mức trợ cấp pháp lý (Bảng PL.1)", "136", 2),
    ("Phụ lục 4: Thuật ngữ và khái niệm nghiệp vụ an sinh xã hội (Bảng PL.2)", "138", 2)
]

def set_toc_paragraph(p, title, page_str, level):
    p.text = f"{title}\t{page_str}"
    pf = p.paragraph_format
    
    # Indentation by Level
    if level == 1:
        pf.left_indent = Pt(0)
    elif level == 2:
        pf.left_indent = Pt(17.0) # ~0.6cm
    elif level == 3:
        pf.left_indent = Pt(34.0) # ~1.2cm
        
    pf.first_line_indent = Pt(0)
    pf.space_before = Pt(1.5)
    pf.space_after = Pt(1.5)
    pf.line_spacing = 1.15
    
    # Ensure XML has <w:tabs><w:tab w:val="right" w:leader="dot" w:pos="9072"/></w:tabs>
    pPr = p._p.get_or_add_pPr()
    tabs_elem = pPr.find(qn('w:tabs'))
    if tabs_elem is not None:
        pPr.remove(tabs_elem)
        
    tabs_elem = OxmlElement('w:tabs')
    tab_elem = OxmlElement('w:tab')
    tab_elem.set(qn('w:val'), 'right')
    tab_elem.set(qn('w:leader'), 'dot')
    tab_elem.set(qn('w:pos'), '9072') # 453.6 pt = 16.0 cm
    tabs_elem.append(tab_elem)
    pPr.append(tabs_elem)
    
    # Font styling
    for r in p.runs:
        r.font.name = "Times New Roman"
        r.font.size = Pt(12) # 12pt standard for TOC
        r.font.highlight_color = None
        r.font.color.rgb = RGBColor(0, 0, 0)
        if level == 1:
            r.font.bold = True
        else:
            r.font.bold = False

def fix_file(filepath):
    print(f"\nProcessing {filepath}...")
    doc = docx.Document(filepath)
    
    for idx, (title, page_str, level) in enumerate(TOC_ITEMS):
        p_idx = 54 + idx
        if p_idx < len(doc.paragraphs):
            p = doc.paragraphs[p_idx]
            set_toc_paragraph(p, title, page_str, level)
            
    doc.save(filepath)
    print(f"✓ Saved {filepath} successfully!")

if __name__ == "__main__":
    for f in DOCX_FILES:
        fix_file(f)
    print("\n=== HOÀN TẤT CẬP NHẬT MỤC LỤC CHUẨN ĐẸP 100%! ===")
