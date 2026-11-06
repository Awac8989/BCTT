import docx
from docx.shared import Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

DOCX_FILES = [
    "DoanMinhQuan_2224801030137_BCTT2.docx",
    "docs/DoanMinhQuan_2224801030137_BCTT2.docx"
]

# 1. TABLE OF CONTENTS (63 items) - Real-time Word COM Page Numbers (145 Pages Layout)
TOC_ITEMS = [
    # (Title, Page, Level)
    ("LỜI CẢM ƠN", "2", 1),
    ("DANH MỤC CÁC KÝ TỰ, CHỮ VIẾT TẮT", "5", 1),
    ("DANH MỤC BẢNG BIỂU", "8", 1),
    ("DANH MỤC HÌNH VẼ", "9", 1),
    ("MỞ ĐẦU", "11", 1),
    ("1. Tính cấp thiết của đề tài", "11", 2),
    ("2. Mục đích và nhiệm vụ nghiên cứu", "11", 2),
    ("3. Đối tượng và phạm vi nghiên cứu", "12", 2),
    ("4. Phương pháp nghiên cứu", "12", 2),
    ("5. Ý nghĩa khoa học và thực tiễn", "13", 2),
    ("CHƯƠNG 1. TỔNG QUAN VỀ CƠ QUAN THỰC TẬP & BÀI TOÁN NGHIỆP VỤ", "14", 1),
    ("1.1. Lịch sử hình thành và phát triển của đơn vị thực tập", "14", 2),
    ("1.2. Chức năng và nhiệm vụ hoạt động của cơ quan", "15", 2),
    ("1.3. Sơ đồ cơ cấu tổ chức và bố trí nhân sự", "18", 2),
    ("1.4. Khảo sát hiện trạng công tác quản lý chính sách người có công", "20", 2),
    ("1.5. Căn cứ pháp lý và các quy định nhà nước nền tảng", "20", 2),
    ("1.6. Những bất cập, khó khăn của quy trình thủ công cũ", "22", 2),
    ("1.7. Mục tiêu và phạm vi xây dựng dự án", "22", 2),
    ("CHƯƠNG 2. CƠ SỞ LÝ THUYẾT VÀ CÔNG NGHỆ ÁP DỤNG", "23", 1),
    ("2.1. Tổng quan kiến trúc phần mềm Hybrid Modular Monolith", "23", 2),
    ("2.2. Công nghệ Frontend và thiết kế giao diện", "25", 2),
    ("2.3. Công nghệ Backend và dịch vụ xử lý trung tâm", "25", 2),
    ("2.4. Hệ quản trị cơ sở dữ liệu MySQL 8.0 và chuẩn hóa CSDL", "26", 2),
    ("2.5. Giải pháp tích hợp liên thông LGSP và an toàn thông tin", "26", 2),
    ("2.6. Lý thuyết và quy trình kiểm thử phần mềm (QA/QC)", "27", 2),
    ("CHƯƠNG 3. PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG", "29", 1),
    ("3.1. Phân tích các tác nhân (Actors) và mô hình phân quyền RBAC", "29", 2),
    ("3.2. Sơ đồ Use Case tổng quát và đặc tả các Use Case trọng tâm", "29", 2),
    ("3.3. Thiết kế sơ đồ tuần tự (Sequence Diagrams)", "34", 2),
    ("3.4. Thiết kế cơ sở dữ liệu chi tiết (16 bảng chuẩn 3NF)", "35", 2),
    ("3.5. Từ điển dữ liệu cơ sở dữ liệu MySQL (16 bảng chuẩn 3NF)", "41", 2),
    ("3.6. Đặc tả chi tiết RESTful API Contracts", "63", 2),
    ("CHƯƠNG 4. HIỆN THỰC HÓA HỆ THỐNG VÀ KẾT QUẢ TRIỂN KHAI", "69", 1),
    ("4.1. Hiện thực hóa các thuật toán và logic nghiệp vụ cốt lõi", "69", 2),
    ("4.1.8. Giải thuật và cơ chế tính toán trợ cấp chuẩn y khoa (BigDecimal)", "70", 3),
    ("4.1.9. Giải thuật chuyển đổi số tiền thành chữ (Mẫu C70a-HD)", "72", 3),
    ("4.1.10. Quy trình xử lý báo giảm khai tử và dừng chi trả", "74", 3),
    ("4.1.11. Thuật toán tính trợ cấp mai táng phí và một lần", "75", 3),
    ("4.1.12. Thuật toán tính trợ cấp bảo trợ xã hội (Nghị định 76/2024)", "76", 3),
    ("4.1.13. Cơ chế an toàn Safety Guards và nhật ký Audit Trail", "76", 3),
    ("4.1.14. Thuật toán định vị GIS và mã QR dẫn đường mộ liệt sĩ", "76", 3),
    ("4.2. Chi tiết kết quả giao diện hệ thống kèm 38 ảnh chụp thực tế", "77", 2),
    ("4.2.22. Trình diễn bộ tính năng nghiệp vụ quản lý nhà nước mới", "89", 3),
    ("CHƯƠNG 5. QUY TRÌNH KIỂM THỬ VÀ BẢO ĐẢM CHẤT LƯỢNG (QA/QC)", "103", 1),
    ("5.1. Kế hoạch kiểm thử và môi trường thực hiện", "103", 2),
    ("5.2. Danh mục Checklist kiểm thử chức năng và giao diện (Bảng 5.1)", "105", 2),
    ("5.3. Bảng kịch bản kiểm thử chi tiết Test Cases Specification (Bảng 5.2)", "109", 2),
    ("5.4. Bảng ghi nhận và theo dõi lỗi phần mềm Bug Report Sheet (Bảng 5.3)", "122", 2),
    ("5.5. Báo cáo tổng kết chất lượng kiểm thử Test Summary Report (Bảng 5.4)", "130", 2),
    ("CHƯƠNG 6. SO SÁNH THỰC TẾ VỚI LÝ THUYẾT VÀ BÀI HỌC KINH NGHIỆM", "132", 1),
    ("6.1. So sánh thực tế với lý thuyết trên giảng đường", "132", 2),
    ("6.2. Những kinh nghiệm thực tiễn rút ra sau quá trình thực tập", "133", 2),
    ("6.3. Đề xuất các giải pháp cải tiến", "133", 2),
    ("CHƯƠNG 7. KẾT LUẬN VÀ KIẾN NGHỊ", "135", 1),
    ("7.1. Đánh giá kết quả đạt được đối với mục tiêu đề ra", "135", 2),
    ("7.2. Những hạn chế còn tồn tại của hệ thống", "135", 2),
    ("7.3. Hướng phát triển trong tương lai", "136", 2),
    ("TÀI LIỆU THAM KHẢO", "138", 1),
    ("PHỤ LỤC", "140", 1),
    ("Phụ lục 1: Biểu mẫu hành chính áp dụng trong hệ thống", "140", 2),
    ("Phụ lục 2: Đặc tả lược đồ và ràng buộc toàn vẹn CSDL MySQL", "140", 2),
    ("Phụ lục 3: Bảng quy đổi định mức trợ cấp pháp lý (Bảng PL.1)", "141", 2),
    ("Phụ lục 4: Thuật ngữ và khái niệm nghiệp vụ an sinh xã hội (Bảng PL.2)", "143", 2)
]

# 2. LIST OF FIGURES (48 items) - Real-time Word COM Page Numbers (145 Pages Layout)
FIGURES_DATA = [
    ("Hình 1.1", "Hình 1.1: Trụ sở Ủy ban nhân dân và Phòng Văn hóa – Xã hội phường Thủ Dầu Một", "15"),
    ("Hình 1.2", "Hình 1.2: Sơ đồ cơ cấu tổ chức Phòng Văn hóa – Xã hội phường Thủ Dầu Một", "19"),
    ("Hình 2.1", "Hình 2.1: Sơ đồ Kiến trúc tổng thể phần mềm Hybrid Modular Monolith", "24"),
    ("Hình 2.2", "Hình 2.2: Sơ đồ các nhiệm vụ chính của thực tập sinh chuyển đổi số", "24"),
    ("Hình 2.3", "Hình 2.3: Sơ đồ cơ sở quản lý dữ liệu hồ sơ người có công và phân hệ Backend API", "26"),
    ("Hình 2.4", "Hình 2.4: Sơ đồ Tích hợp hệ thống liên thông dữ liệu qua Trục LGSP", "27"),
    ("Hình 2.5", "Hình 2.5: Sơ đồ Quy trình kiểm thử phần mềm QA/QC 7 bước tiêu chuẩn", "28"),
    ("Hình 3.1", "Hình 3.1: Sơ đồ Use Case tổng quát Hệ thống Quản lý Hồ sơ Người có công và Đánh giá Dịch vụ công", "34"),
    ("Hình 3.2", "Hình 3.2: Sơ đồ Tuần tự thẩm định hồ sơ và tự động tính trợ cấp", "40"),
    ("Hình 3.3", "Hình 3.3: Sơ đồ Mối quan hệ Thực thể CSDL MySQL (ERD Diagram)", "40"),
    ("Hình 4.1", "Hình 4.1: Giao diện Cổng Đăng nhập Phân quyền Quản trị Cấp Sở", "77"),
    ("Hình 4.2", "Hình 4.2: Giao diện Cổng Đăng nhập Cán bộ Chuyên viên Cấp Phòng", "78"),
    ("Hình 4.3", "Hình 4.3: Bảng điều khiển trung tâm Giám sát và Thống kê Toàn diện", "78"),
    ("Hình 4.4", "Hình 4.4: Biểu đồ Phân bổ Kinh phí Trợ cấp Phân tầng theo 14 Phường", "79"),
    ("Hình 4.5", "Hình 4.5: Trình đơn Chuyển đổi Nhanh Vai trò Quản trị và Kiểm toán", "79"),
    ("Hình 4.6", "Hình 4.6: Mẫu Giấy hẹn Tiếp nhận Một cửa Tích hợp Mã QR Code Tra cứu", "80"),
    ("Hình 4.7", "Hình 4.7: Cổng Kiosk Khảo sát và Đánh giá Sự hài lòng Công dân (CSAT)", "80"),
    ("Hình 4.8", "Hình 4.8: Trung tâm Giám sát Chỉ số CSAT và Biểu đồ Radar SIPAS Cán bộ", "81"),
    ("Hình 4.9", "Hình 4.9: Phiếu Chi trả Trợ cấp Người có công Mẫu C70a-HD Tích hợp Mã vạch", "81"),
    ("Hình 4.10", "Hình 4.10: Màn hình Chi tiết Hồ sơ Liệt sĩ và Danh sách Thân nhân Hưởng quyền lợi", "82"),
    ("Hình 4.11", "Hình 4.11: Phân hệ Quản lý Chỉ tiêu và Lập danh sách Điều dưỡng Hàng năm", "82"),
    ("Hình 4.12", "Hình 4.12: Bản đồ Nhiệt (Heatmap) Mật độ Hồ sơ và Phân tích Dữ liệu Phường", "83"),
    ("Hình 4.13", "Hình 4.13: Quản lý Cấp phát Phương tiện Trợ giúp và Dụng cụ Chỉnh hình", "83"),
    ("Hình 4.14", "Hình 4.14: Bản đồ Số Không gian GIS Nghĩa trang Liệt sĩ Tỉnh Bình Dương", "84"),
    ("Hình 4.15", "Hình 4.15: Cổng Dịch vụ Tra cứu Tiến độ Xử lý Hồ sơ Công dân theo Số CCCD", "84"),
    ("Hình 4.16", "Hình 4.16: Quy trình Nghiệp vụ Báo giảm Từ trần và Quyết định Mai táng phí Mẫu 02", "85"),
    ("Hình 4.17", "Hình 4.17: Module Đối soát Tự động Chi trả Ngân hàng (Bank Reconciliation)", "85"),
    ("Hình 4.18", "Hình 4.18: Quy trình Thẩm định Hồ sơ 5 Bước Một cửa và Ký số SmartCA", "86"),
    ("Hình 4.19", "Hình 4.19: Giao diện Cấu hình Định mức Trợ cấp Pháp lý và Tham số Hệ thống", "86"),
    ("Hình 4.20", "Hình 4.20: Modal Tiếp nhận Hồ sơ Người có công Mới có Cơ chế Kiểm tra Dữ liệu Zod", "87"),
    ("Hình 4.21", "Hình 4.21: Modal Số hóa Tài liệu bằng Trí tuệ Nhân tạo (AI OCR) và Trích xuất Dữ liệu", "88"),
    ("Hình 4.22", "Hình 4.22: Giao diện Cổng Đăng Nhập Bảo Mật Chuyên Dụng và Tải Danh Sách Tài Khoản Công Vụ", "89"),
    ("Hình 4.23", "Hình 4.23: Bảng Tra Cứu Danh Bạ Tài Khoản và Phân Quyền Công Chức 3 Cấp Chính Quyền", "90"),
    ("Hình 4.24", "Hình 4.24: Phân Hệ Kỹ Thuật - Tiếp Nhận và Xử Lý Báo Lỗi Website Chuyên Trách", "90"),
    ("Hình 4.25", "Hình 4.25: Phân Hệ Kỹ Thuật - Database Fix Studio, SQL Console và Safety Guards", "91"),
    ("Hình 4.26", "Hình 4.26: Kiến Trúc An Toàn Thông Tin Cấp Độ 3 và Tích Hợp Định Danh VNeID (C06)", "92"),
    ("Hình 4.27", "Hình 4.27: Biên Bản Kiểm Tra Hiện Trường và Xác Minh Thực Địa (Mẫu số 02/XMTD)", "93"),
    ("Hình 4.28", "Hình 4.28: Thông Báo Niêm Yết Công Khai 15 Ngày tại UBND Phường (Mẫu số 15/NĐ131 - Tab 1)", "94"),
    ("Hình 4.29", "Hình 4.29: Biên Bản Kết Thúc Niêm Yết Công Khai Sau 15 Ngày (Mẫu số 15/NĐ131 - Tab 2)", "95"),
    ("Hình 4.30", "Hình 4.30: Quyết Định Hưởng Trợ Cấp Mai Táng Phí (23.4 Triệu đ) và Trợ Cấp Một Lần", "96"),
    ("Hình 4.31", "Hình 4.31: Sổ Theo Dõi Chi Trả Trợ Cấp Ưu Đãi Mẫu C70b-HD Khổ A4 Ngang (Nghị định 77/2024)", "96"),
    ("Hình 4.32", "Hình 4.32: Bảng Kê Chi Trả Tiền Mặt Qua Bưu Điện VNPost (Mẫu C70a-VNPost)", "97"),
    ("Hình 4.33", "Hình 4.33: Phiếu Phát Tiền Trợ Cấp Tận Nhà Cho Bà Mẹ VNAH và Thương Binh Nặng", "98"),
    ("Hình 4.34", "Hình 4.34: Giấy Trích Lục Thông Tin Mộ Liệt Sĩ Khổ A4 và Mã QR Code Tọa Độ GPS", "99"),
    ("Hình 4.35", "Hình 4.35: Quyết Định Trợ Cấp Bảo Trợ Xã Hội Hàng Tháng (Nghị định 76/2024 Mức Chuẩn 500k)", "100"),
    ("Hình 4.36", "Hình 4.36: Phiếu Hướng Dẫn và Thông Báo Thụ Lý Tiếp Công Dân (Thông tư 04/2021/TT-TTCP)", "101"),
    ("Hình 4.37", "Hình 4.37: Cổng Tra Cứu Công Dân - Tải Trực Tiếp Giấy Hẹn, Quyết Định Ký Số và Thẻ BHYT", "102"),
    ("Hình 4.38", "Hình 4.38: Phân Hệ Đánh Giá Hiệu Quả Đề Tài & Cải Cách TTHC (SLA 99.2%, SIPAS 98.6%, ROI 1,2 Tỷ)", "103")
]

# 3. LIST OF TABLES (31 items) - Real-time Word COM Page Numbers (145 Pages Layout)
TABLES_DATA = [
    ("Bảng 1.1", "Bảng 1.1: Nhật ký công việc thực tập doanh nghiệp (17/08/2026 – 20/10/2026)", "15"),
    ("Bảng 1.2", "Bảng 1.2: Đánh giá kết quả thực tập dành cho Cán bộ hướng dẫn tại đơn vị", "18"),
    ("Bảng 1.3", "Bảng 1.3: Đánh giá thực tập doanh nghiệp dành cho Hội đồng chấm điểm", "19"),
    ("Bảng 1.4", "Bảng 1.4: Đánh giá kết quả thực tập theo Chuẩn đầu ra (CELO 1 - 5)", "20"),
    ("Bảng 3.1", "Bảng 3.1: Từ điển dữ liệu bảng dm_phuong (Danh mục 14 phường)", "41"),
    ("Bảng 3.2", "Bảng 3.2: Từ điển dữ liệu bảng dm_loai_doi_tuong (Danh mục loại đối tượng NCC)", "41"),
    ("Bảng 3.3", "Bảng 3.3: Từ điển dữ liệu bảng sys_roles (Danh mục vai trò quản trị RBAC)", "42"),
    ("Bảng 3.4", "Bảng 3.4: Từ điển dữ liệu bảng sys_users (Tài khoản cán bộ công chức)", "43"),
    ("Bảng 3.5", "Bảng 3.5: Từ điển dữ liệu bảng ho_so_ncc (Bảng trung tâm quản lý hồ sơ NCC)", "44"),
    ("Bảng 3.6", "Bảng 3.6: Từ điển dữ liệu bảng quyet_dinh_huong (Quyết định hưởng trợ cấp ưu đãi)", "46"),
    ("Bảng 3.7", "Bảng 3.7: Từ điển dữ liệu bảng lich_su_chi_tra (Lịch sử chi trả trợ cấp hàng tháng)", "47"),
    ("Bảng 3.8", "Bảng 3.8: Từ điển dữ liệu bảng khao_sat_danh_gia (Khảo sát đánh giá CSAT công dân)", "48"),
    ("Bảng 3.9", "Bảng 3.9: Từ điển dữ liệu bảng chi_tiet_tieu_chi_danh_gia (Điểm số 4 tiêu chí SIPAS)", "49"),
    ("Bảng 3.10", "Bảng 3.10: Từ điển dữ liệu bảng ho_so_liet_sy (Chi tiết hồ sơ liệt sĩ theo NĐ 131)", "50"),
    ("Bảng 3.11", "Bảng 3.11: Từ điển dữ liệu bảng than_nhan_liet_si (Quản lý thân nhân và người thờ cúng)", "53"),
    ("Bảng 3.12", "Bảng 3.12: Từ điển dữ liệu bảng ke_hoach_dieu_duong (Kế hoạch điều dưỡng hàng năm)", "54"),
    ("Bảng 3.13", "Bảng 3.13: Từ điển dữ liệu bảng danh_sach_dieu_duong (Chi tiết các đợt điều dưỡng)", "55"),
    ("Bảng 3.14", "Bảng 3.14: Từ điển dữ liệu bảng ho_so_bao_giam_mai_tang (Báo giảm & QĐ Mai táng Mẫu 02)", "56"),
    ("Bảng 3.15", "Bảng 3.15: Từ điển dữ liệu bảng danh_sach_phuong_tien_chinh_hinh (Dụng cụ chỉnh hình)", "59"),
    ("Bảng 3.16", "Bảng 3.16: Từ điển dữ liệu bảng nghia_trang_mo_liet_si (Số hóa bản đồ mộ liệt sĩ GIS)", "60"),
    ("Bảng 3.17", "Bảng 3.17: Từ điển dữ liệu bảng doi_soat_chi_tra_ngan_hang (Đối soát ngân hàng Đề án 06)", "61"),
    ("Bảng 3.18", "Bảng 3.18: Danh mục 12 RESTful API Contracts của hệ thống", "63"),
    ("Bảng 4.1", "Bảng 4.1: Ma trận quy tắc nghiệp vụ và công thức tính toán trợ cấp ưu đãi người có công", "72"),
    ("Bảng 4.2", "Bảng 4.2: Bảng ma trận quy tắc ngữ pháp chuyển đổi số tiền thành chữ tiếng Việt", "73"),
    ("Bảng 4.3", "Bảng 4.3: Ma trận chuyển đổi trạng thái và tác động nghiệp vụ khi thực hiện báo giảm khai tử", "75"),
    ("Bảng 5.1", "Bảng 5.1: Danh mục Checklist kiểm thử chức năng và giao diện hệ thống (30 hạng mục)", "105"),
    ("Bảng 5.2", "Bảng 5.2: Bảng kịch bản kiểm thử chi tiết Test Cases Specification (50 Test Cases)", "109"),
    ("Bảng 5.3", "Bảng 5.3: Bảng ghi nhận và theo dõi lỗi phần mềm Bug Report Sheet (15 lỗi thực tế)", "122"),
    ("Bảng 5.4", "Bảng 5.4: Báo cáo tổng kết chất lượng kiểm thử Test Summary Report", "130"),
    ("Bảng PL.1", "Bảng PL.1: Bảng quy đổi định mức phụ cấp, trợ cấp ưu đãi người có công theo Nghị định 75/2021/NĐ-CP", "142"),
    ("Bảng PL.2", "Bảng PL.2: Thuật ngữ và Khái niệm Nghiệp vụ Hành chính An sinh Xã hội (Theo NĐ 55/2023)", "144")
]

def apply_right_dot_tab(p, text, page_str, left_indent=Pt(0), bold=False, font_size=12):
    p.text = f"{text}\t{page_str}"
    pf = p.paragraph_format
    pf.left_indent = left_indent
    pf.first_line_indent = Pt(0)
    pf.space_before = Pt(1.5)
    pf.space_after = Pt(1.5)
    pf.line_spacing = 1.15
    
    # XML Right Dot-Leader Tab Stop at 16.0 cm (453.6 pt / 9072 dxa)
    pPr = p._p.get_or_add_pPr()
    tabs_elem = pPr.find(qn('w:tabs'))
    if tabs_elem is not None:
        pPr.remove(tabs_elem)
    tabs_elem = OxmlElement('w:tabs')
    tab_elem = OxmlElement('w:tab')
    tab_elem.set(qn('w:val'), 'right')
    tab_elem.set(qn('w:leader'), 'dot')
    tab_elem.set(qn('w:pos'), '9072')
    tabs_elem.append(tab_elem)
    pPr.append(tabs_elem)
    
    for r in p.runs:
        r.font.name = "Times New Roman"
        r.font.size = Pt(font_size)
        r.font.bold = bold
        r.font.italic = False
        r.font.highlight_color = None
        r.font.color.rgb = RGBColor(0, 0, 0)

def synchronize_all(filepath):
    print(f"\n================ PROCESSING: {filepath} ================")
    doc = docx.Document(filepath)
    
    # 1. Update Table of Contents (P54 to P116)
    print("1. Synchronizing Main Table of Contents (63 items)...")
    for idx, (title, page_str, level) in enumerate(TOC_ITEMS):
        p_idx = 54 + idx
        if p_idx < len(doc.paragraphs):
            p = doc.paragraphs[p_idx]
            indent = Pt(0) if level == 1 else (Pt(17.0) if level == 2 else Pt(34.0))
            bold = (level == 1)
            apply_right_dot_tab(p, title, page_str, left_indent=indent, bold=bold, font_size=12)
            
    # 2. Update DANH MỤC BẢNG BIỂU (P121 to P151)
    print("2. Synchronizing DANH MỤC BẢNG BIỂU (31 tables)...")
    for idx, (code, title, page_str) in enumerate(TABLES_DATA):
        p_idx = 121 + idx
        if p_idx < len(doc.paragraphs):
            p = doc.paragraphs[p_idx]
            apply_right_dot_tab(p, title, page_str, left_indent=Pt(0), bold=False, font_size=12)
            
    # 3. Update DANH MỤC HÌNH VẼ (P154 to P201)
    print("3. Synchronizing DANH MỤC HÌNH VẼ (48 figures)...")
    for idx, (code, title, page_str) in enumerate(FIGURES_DATA):
        p_idx = 154 + idx
        if p_idx < len(doc.paragraphs):
            p = doc.paragraphs[p_idx]
            apply_right_dot_tab(p, title, page_str, left_indent=Pt(0), bold=False, font_size=12)
            
    # 4. Synchronize Body Figure Captions (P > 202)
    print("4. Synchronizing Body Figure Captions (48 figures)...")
    fig_map = {item[0]: item[1] for item in FIGURES_DATA}
    for i, p in enumerate(doc.paragraphs):
        if i > 202:
            txt = p.text.strip()
            if txt.startswith("Hình "):
                parts = txt.split(":")
                code = parts[0].strip()
                if code in fig_map:
                    p.text = fig_map[code]
                    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                    pf = p.paragraph_format
                    pf.left_indent = Pt(0)
                    pf.first_line_indent = Pt(0)
                    pf.space_before = Pt(3)
                    pf.space_after = Pt(6)
                    for r in p.runs:
                        r.font.name = "Times New Roman"
                        r.font.size = Pt(12)
                        r.font.bold = True
                        r.font.italic = True
                        r.font.highlight_color = None
                        r.font.color.rgb = RGBColor(0, 0, 0)
                        
    doc.save(filepath)
    print(f"✓ Saved {filepath} successfully!")

if __name__ == "__main__":
    for f in DOCX_FILES:
        synchronize_all(f)
    print("\n=== HOÀN TẤT ĐỒNG BỘ 100% MỤC LỤC, HÌNH VẼ VÀ BẢNG BIỂU! ===")
