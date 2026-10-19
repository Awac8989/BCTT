import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

helper_funcs = '''
def add_financial_engine_analysis(doc):
    add_h3(doc, "4.1.8. Giải thuật và Cơ chế Tính toán Trợ cấp An sinh Xã hội Chuẩn Y khoa (Core Financial Engine)")
    add_body_p(doc, "Trong các hệ thống quản lý an sinh xã hội cấp chính quyền đô thị, dữ liệu tài chính chi trả trợ cấp ưu đãi cho người có công gắn liền trực tiếp với quyền lợi pháp lý của công dân và dự toán ngân sách nhà nước được Hội đồng nhân dân giao phó. Do đó, việc xây dựng Core Financial Engine đòi hỏi độ chính xác tuyệt đối, triệt tiêu hoàn toàn các rủi ro sai số số học tích lũy.")
    add_body_p(doc, "Các kiểu dữ liệu số thực dấu chấm động thông thường trong khoa học máy tính (như float hoặc double theo tiêu chuẩn IEEE 754) biểu diễn số dưới dạng nhị phân, dẫn đến hiện tượng sai số làm tròn khi thực hiện các phép nhân chia hệ số phần trăm phức tạp. Để tuân thủ nghiêm ngặt quy định của Luật Kế toán và Chuẩn mực Kế toán công Việt Nam, hệ thống bắt buộc sử dụng lớp toán học độ chính xác tùy ý BigDecimal trong nền tảng Java Spring Boot. Toàn bộ các phép nhân chia tỷ lệ suy giảm khả năng lao động và các khoản phụ cấp đều được tính toán với độ chính xác vô hạn và áp dụng chế độ làm tròn RoundingMode.HALF_UP (làm tròn lên khi phần thập phân từ 0.5 trở lên) về hàng đơn vị đồng chẵn.", bold_prefix="1. Nguyên lý số học tài chính chính xác cao với lớp BigDecimal: ")
    add_body_p(doc, "Quy trình giải thuật tính toán được tổ chức thành 4 bước nghiêm ngặt:", bold_prefix="2. Quy trình giải thuật tính toán 4 bước chuẩn mực: ")
    add_body_p(doc, "- Bước 1 (Tiếp nhận và Xác thực): Trích xuất mã loại đối tượng chính sách (Thương binh, Bệnh binh, Mẹ VNAH, Thân nhân Liệt sĩ), tỷ lệ tổn thương cơ thể (từ 21% đến 100%) và điều kiện người chăm sóc phục vụ từ hồ sơ đã được thẩm định y khoa.")
    add_body_p(doc, "- Bước 2 (Nạp mức chuẩn định mức): Nạp động giá trị Mức chuẩn trợ cấp ưu đãi người có công là 2.055.000 đồng/tháng (theo Nghị định 75/2021/NĐ-CP và Nghị định 55/2023/NĐ-CP của Chính phủ).")
    add_body_p(doc, "- Bước 3 (Xác định hệ số và Tính trợ cấp cơ bản): Áp dụng công thức nội suy hệ số định mức trợ cấp: Đối với Thương binh có tỷ lệ suy giảm từ 21% trở lên, trợ cấp tháng = Mức chuẩn x Hệ số tổn thương; đối với Mẹ Việt Nam Anh hùng, mức trợ cấp tiền tuất được ấn định cố định bằng 3.0 lần mức chuẩn (tương đương 6.165.000 VNĐ).")
    add_body_p(doc, "- Bước 4 (Cộng dồn phụ cấp và Đóng gói phản hồi): Tự động kiểm tra điều kiện hưởng phụ cấp người chăm sóc (bằng 1.0 lần mức chuẩn, tương đương 2.055.000 VNĐ) đối với trường hợp tỷ lệ tổn thương cơ thể từ 81% trở lên hoặc Mẹ Việt Nam Anh hùng. Tổng số tiền thực nhận = Trợ cấp hàng tháng + Phụ cấp chăm sóc + Các khoản phụ cấp đặc thù. Kết quả được đóng gói cùng mã kiểm tra tính toàn vẹn Checksum trước khi ghi vào sổ cái tài chính.")

    add_subhead(doc, "Bảng 4.1: Ma trận quy tắc nghiệp vụ và công thức tính toán trợ cấp ưu đãi người có công")
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
    add_body_p(doc, "Theo quy định tại Thông tư số 101/2018/TT-BTC của Bộ Tài chính hướng dẫn quản lý kinh phí an sinh xã hội, trên tất cả các chứng từ kế toán chi tiền (tiêu biểu là Phiếu chi trợ cấp người có công Mẫu C70a-HD), dòng 'Số tiền bằng chữ' có giá trị pháp lý quyết định cao nhất nhằm loại trừ hoàn toàn nguy cơ sửa chữa, thêm bớt chữ số trên chứng từ in.")
    add_body_p(doc, "Giải thuật tiếp nhận số tiền nguyên dương (ví dụ: 20.550.000 VNĐ) và thực hiện phân tách từ phải sang trái thành từng nhóm 3 chữ số (Block 3). Mỗi nhóm gồm 3 hàng: hàng trăm (c2), hàng chục (c1) và hàng đơn vị (c0). Các nhóm được gắn nhãn tương ứng với các lớp bậc lũy thừa của 1.000: Lớp đơn vị, Lớp nghìn, Lớp triệu, Lớp tỷ.", bold_prefix="1. Nguyên lý phân rã khối tam phân (Three-digit Chunking): ")
    add_body_p(doc, "Tiếng Việt có các quy tắc biến âm phức tạp tùy thuộc vào chữ số đứng liền kề, đòi hỏi giải thuật phải kiểm soát chính xác:", bold_prefix="2. Xử lý các quy tắc ngữ pháp biến âm đặc thù trong tiếng Việt: ")
    add_body_p(doc, "- Quy tắc chữ số 0 ở hàng chục: Khi chữ số hàng trăm c2 > 0 và chữ số hàng chục c1 = 0 nhưng hàng đơn vị c0 > 0, đọc là 'lẻ' (hoặc 'linh'), ví dụ: 105 đọc là 'một trăm lẻ năm'.")
    add_body_p(doc, "- Quy tắc chữ số 1 ở hàng đơn vị: Nếu hàng chục c1 >= 2, đọc biến âm thành 'mốt' (ví dụ: 21 đọc là 'hai mươi mốt'); nếu hàng chục c1 = 0 hoặc c1 = 1, giữ nguyên cách đọc là 'một' (ví dụ: 01 đọc là 'lẻ một', 11 đọc là 'mười một').")
    add_body_p(doc, "- Quy tắc chữ số 5 ở hàng đơn vị: Nếu hàng chục c1 >= 1, đọc biến âm thành 'lăm' (ví dụ: 15 đọc là 'mười lăm', 25 đọc là 'hai mươi lăm'); nếu hàng chục c1 = 0, giữ nguyên cách đọc là 'năm' (ví dụ: 05 đọc là 'lẻ năm').")
    add_body_p(doc, "- Quy tắc chữ số 1 ở hàng chục: Khi c1 = 1, đọc là 'mười' (thay vì 'một mươi').")
    add_body_p(doc, "Sau khi xử lý tuần tự từng nhóm 3 chữ số và ghép nối với tên lớp đơn vị ('tỷ', 'triệu', 'nghìn'), chuỗi ký tự kết quả được chuẩn hóa loại bỏ khoảng trắng kép, tự động viết hoa chữ cái đầu câu và thêm hậu tố 'đồng chẵn.' theo đúng quy chuẩn biểu mẫu tài chính nhà nước (ví dụ: 'Hai mươi triệu năm trăm năm mươi nghìn đồng chẵn.').", bold_prefix="3. Chuẩn hóa kết quả văn bản hành chính công: ")

    add_subhead(doc, "Bảng 4.2: Bảng ma trận quy tắc ngữ pháp chuyển đổi số tiền thành chữ tiếng Việt")
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
    add_body_p(doc, "- Giai đoạn 4 (Khởi tạo Quyết định Mai táng phí Mẫu số 02): Song song với việc khóa chi trả thường xuyên, hệ thống tự động sinh hồ sơ trợ cấp Mai táng phí một lần theo quy định tại Nghị định 131/2021/NĐ-CP. Định mức trợ cấp mai táng được tự động áp giá bằng 10 tháng mức chuẩn (10 x 2.055.000 = 20.550.000 VNĐ). Dự thảo Quyết định Mẫu số 02 được đẩy sang luồng phê duyệt của Lãnh đạo Phòng và chuyển tiếp sang phân hệ Kế toán để xuất Phiếu chi Mẫu C70a-HD chi trả cho thân nhân.")
    add_body_p(doc, "Toàn bộ chuỗi 4 giai đoạn trên được bao bọc trong một Giao dịch cơ sở dữ liệu duy nhất (Atomic Transaction). Nếu có bất kỳ bước nào gặp sự cố (như lỗi kết nối máy chủ hoặc xung đột dữ liệu), toàn bộ trạng thái sẽ được Rollback về ban đầu, bảo đảm không xảy ra tình trạng trạng thái hồ sơ đã chuyển sang từ trần nhưng lệnh chi trả vẫn chưa được ngắt.", bold_prefix="2. Cơ chế bảo đảm tính toàn vẹn giao dịch (Database Transaction ACID): ")

    add_subhead(doc, "Bảng 4.3: Ma trận chuyển đổi trạng thái và tác động nghiệp vụ khi thực hiện báo giảm khai tử")
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
    add_body_p(doc, "Cơ sở dữ liệu quản lý an sinh xã hội ql_nguoi_co_cong được thiết kế trên hệ quản trị CSDL MySQL 8.0 với Storage Engine InnoDB. Toàn bộ lược đồ dữ liệu tuân thủ chuẩn hóa 3NF, áp dụng chặt chẽ các ràng buộc toàn vẹn thực thể, toàn vẹn tham chiếu và chiến lược đánh chỉ mục B-Tree tối ưu hóa hiệu năng truy vấn cho toàn bộ 14 phường trực thuộc.")
    add_body_p(doc, "Lưu trữ định danh các phường thuộc thành phố Thủ Dầu Một. Cấu trúc gồm: ward_id (Khóa chính tự tăng AUTO_INCREMENT, kiểu INT), ward_name (Tên phường, VARCHAR(100), NOT NULL), district_name (Tên quận/thành phố, VARCHAR(100), DEFAULT 'TP. Thủ Dầu Một'), created_at (Thời gian khởi tạo bản ghi, DATETIME).", bold_prefix="1. Lược đồ Bảng dm_phuong (Danh mục 14 đơn vị hành chính cấp phường): ")
    add_body_p(doc, "Lưu trữ hồ sơ quản lý gốc của người có công. Cấu trúc gồm: ho_so_id (Khóa chính BIGINT AUTO_INCREMENT), ma_so_quan_ly (Mã hồ sơ định danh duy nhất UNIQUE, VARCHAR(30)), so_cccd (Số căn cước công dân 12 chữ số UNIQUE, VARCHAR(12)), ho_ten (Họ và tên đối tượng, VARCHAR(100)), ngay_sinh (Ngày tháng năm sinh, DATE), gioi_tinh (Giới tính, ENUM('NAM', 'NU')), dia_chi_thuong_tru (Địa chỉ thường trú chi tiết, VARCHAR(255)), ward_id (Khóa ngoại tham chiếu dm_phuong, INT), ma_loai_dt (Mã loại đối tượng, VARCHAR(20)), ty_le_thuong_tat (Tỷ lệ tổn thương y khoa %, INT), trang_thai_hs (Trạng thái quản lý, ENUM('MOI_TIEP_NHAN', 'CHO_DUYET', 'DA_DUYET', 'TU_CHOI', 'DA_TU_TRAN')), created_at (Thời gian tiếp nhận, DATETIME).", bold_prefix="2. Lược đồ Bảng ho_so_ncc (Bảng trung tâm Quản lý Hồ sơ Người có công): ")
    add_body_p(doc, "Khóa ngoại fk_hs_ward liên kết trường ward_id của bảng ho_so_ncc với bảng dm_phuong(ward_id). Cơ chế toàn vẹn áp dụng quy tắc ON DELETE RESTRICT và ON UPDATE CASCADE nhằm bảo vệ tuyệt đối dữ liệu lịch sử đối tượng chính sách, ngăn chặn việc vô tình xóa địa bàn hành chính khi vẫn còn hồ sơ liên kết.", bold_prefix="3. Ràng buộc toàn vẹn tham chiếu (Referential Integrity): ")
    add_body_p(doc, "Hệ thống thiết lập 2 tầng chỉ mục chuyên biệt:", bold_prefix="4. Chiến lược Đánh chỉ mục B-Tree Index tối ưu hiệu năng: ")
    add_body_p(doc, "+ Chỉ mục đơn trường idx_hs_cccd: Đánh trên trường so_cccd nhằm tối ưu hóa các thao tác tìm kiếm, tra cứu hồ sơ của công dân theo số Căn cước công dân, đưa tốc độ tìm kiếm đạt độ phức tạp thuật toán O(log N) với thời gian phản hồi dưới 50ms.")
    add_body_p(doc, "+ Chỉ mục kết hợp idx_hs_ward_status: Đánh trên cặp trường (ward_id, trang_thai_hs) nhằm phục vụ các truy vấn lọc danh sách hồ sơ đa điều kiện cho các màn hình thẩm định và kết xuất báo cáo thống kê phân tầng theo từng phường.")
    add_body_p(doc, "Toàn bộ cơ sở dữ liệu được khởi tạo với bộ ký tự chuẩn CHARACTER SET utf8mb4 và Collation utf8mb4_unicode_ci. Tiêu chuẩn này bảo đảm lưu trữ chính xác 100% các ký tự tiếng Việt có dấu, họ tên ghép và các ký tự hành chính đặc thù mà không phát sinh lỗi mã hóa phông chữ trên mọi môi trường máy chủ.", bold_prefix="5. Tiêu chuẩn Bảng mã và Định dạng Lưu trữ Tiếng Việt: ")
'''

fn = r'Q:\CODE_visual\filebctt\scripts\build_full_report.py'
with open(fn, 'r', encoding='utf-8') as f:
    code = f.read()

target = 'def build_document():'
assert target in code, 'Target def build_document() not found'
code = code.replace(target, helper_funcs + '\n' + target)

with open(fn, 'w', encoding='utf-8') as f:
    f.write(code)

print('Inserted helper functions successfully!')
