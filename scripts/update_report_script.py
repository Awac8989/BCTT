import os
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

script_path = r"Q:\CODE_visual\filebctt\scripts\build_full_report.py"

with open(script_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Thêm V2_IMAGES_DIR sau DIAGRAMS_DIR
if 'V2_IMAGES_DIR' not in content:
    content = content.replace(
        'DIAGRAMS_DIR = r"Q:\\CODE_visual\\filebctt\\docs\\diagrams"',
        'DIAGRAMS_DIR = r"Q:\\CODE_visual\\filebctt\\docs\\diagrams"\nV2_IMAGES_DIR = r"Q:\\CODE_visual\\filebctt\\docs\\v2_images"'
    )

# 2. Cập nhật add_figure để nhận width
old_add_fig = '''def add_figure(doc, img_path, fig_title, fig_desc=""):
    if not os.path.exists(img_path):
        print(f"Warning: Image not found {img_path}")
        return

    # Image paragraph
    p_img = doc.add_paragraph()
    format_paragraph(p_img, space_before=10, space_after=4, align=WD_ALIGN_PARAGRAPH.CENTER, first_line_indent=0)
    p_img.paragraph_format.keep_with_next = True
    run_img = p_img.add_run()
    run_img.add_picture(img_path, width=Inches(5.0))'''

new_add_fig = '''def add_figure(doc, img_path, fig_title, fig_desc="", width=Inches(5.2)):
    if not os.path.exists(img_path):
        print(f"Warning: Image not found {img_path}")
        return

    # Image paragraph
    p_img = doc.add_paragraph()
    format_paragraph(p_img, space_before=10, space_after=4, align=WD_ALIGN_PARAGRAPH.CENTER, first_line_indent=0)
    p_img.paragraph_format.keep_with_next = True
    run_img = p_img.add_run()
    run_img.add_picture(img_path, width=width)'''

if old_add_fig in content:
    content = content.replace(old_add_fig, new_add_fig)
else:
    print("Warning: old_add_fig not found exactly, check regex/variation")

# 3. Làm rỗng add_code_block để không còn in code
old_code_block = '''def add_code_block(doc, code_str, title=""):
    if title:
        p_title = doc.add_paragraph()
        format_paragraph(p_title, space_before=6, space_after=2, align=WD_ALIGN_PARAGRAPH.LEFT, first_line_indent=0)
        rt = p_title.add_run(f"Đoạn mã: {title}")
        rt.font.name = "Times New Roman"
        rt.font.size = Pt(11)
        rt.font.bold = True
        rt.font.color.rgb = RGBColor(0, 0, 0)

    p = doc.add_paragraph()
    format_paragraph(p, space_before=2, space_after=8, align=WD_ALIGN_PARAGRAPH.LEFT, first_line_indent=0)
    r = p.add_run(code_str)
    r.font.name = "Consolas"
    r.font.size = Pt(9.5)
    r.font.color.rgb = RGBColor(0, 0, 0)'''

new_code_block = '''def add_code_block(doc, code_str, title=""):
    # Báo cáo học thuật chuẩn mực: Tuyệt đối không mang mã nguồn trực tiếp vào tài liệu Word
    pass'''

if old_code_block in content:
    content = content.replace(old_code_block, new_code_block)
else:
    print("Warning: old_code_block not found exactly")

# 4. Thêm các hàm phân tích nghiệp vụ thay thế cho code
helper_funcs = '''
def add_financial_engine_analysis(doc):
    add_h3(doc, "4.1.8. Giải thuật và Cơ chế Tính toán Trợ cấp An sinh Xã hội Chuẩn Y khoa (Core Financial Engine)")
    add_body_p(doc, "Trong các hệ thống quản lý an sinh xã hội cấp chính quyền đô thị, dữ liệu tài chính chi trả trợ cấp ưu đãi cho người có công gắn liền trực tiếp với quyền lợi pháp lý của công dân và dự toán ngân sách nhà nước được Hội đồng nhân dân giao phó. Do đó, việc xây dựng Core Financial Engine đòi hỏi độ chính xác tuyệt đối, triệt tiêu hoàn toàn các rủi ro sai số số học tích lũy.")
    add_body_p(doc, "Các kiểu dữ liệu số thực dấu chấm động thông thường trong khoa học máy tính (như float hoặc double theo tiêu chuẩn IEEE 754) biểu diễn số dưới dạng nhị phân, dẫn đến hiện tượng sai số làm tròn khi thực hiện các phép nhân chia hệ số phần trăm phức tạp. Để tuân thủ nghiêm ngặt quy định của Luật Kế toán và Chuẩn mực Kế toán công Việt Nam, hệ thống bắt buộc sử dụng lớp toán học độ chính xác tùy ý BigDecimal trong nền tảng Java Spring Boot. Toàn bộ các phép nhân chia tỷ lệ suy giảm khả năng lao động và các khoản phụ cấp đều được tính toán với độ chính xác vô hạn và áp dụng chế độ làm tròn RoundingMode.HALF_UP (làm tròn lên khi phần thập phân từ 0.5 trở lên) về hàng đơn vị đồng chẵn.", bold_prefix="1. Nguyên lý số học tài chính chính xác cao với lớp BigDecimal: ")
    add_body_p(doc, "Quy trình giải thuật tính toán được tổ chức thành 4 bước nghiêm ngặt:", bold_prefix="2. Quy trình giải thuật tính toán 4 bước chuẩn mực: ")
    add_body_p(doc, "- Bước 1 (Tiếp nhận & Xác thực): Trích xuất mã loại đối tượng chính sách (Thương binh, Bệnh binh, Mẹ VNAH, Thân nhân Liệt sĩ), tỷ lệ tổn thương cơ thể (từ 21% đến 100%) và điều kiện người chăm sóc phục vụ từ hồ sơ đã được thẩm định y khoa.")
    add_body_p(doc, "- Bước 2 (Nạp mức chuẩn định mức): Nạp động giá trị Mức chuẩn trợ cấp ưu đãi người có công là 2.055.000 đồng/tháng (theo Nghị định 75/2021/NĐ-CP và Nghị định 55/2023/NĐ-CP của Chính phủ).")
    add_body_p(doc, "- Bước 3 (Xác định hệ số & Tính trợ cấp cơ bản): Áp dụng công thức nội suy hệ số định mức trợ cấp: Đối với Thương binh có tỷ lệ suy giảm từ 21% trở lên, trợ cấp tháng = Mức chuẩn x Hệ số tổn thương; đối với Mẹ Việt Nam Anh hùng, mức trợ cấp tiền tuất được ấn định cố định bằng 3.0 lần mức chuẩn (tương đương 6.165.000 VNĐ).")
    add_body_p(doc, "- Bước 4 (Cộng dồn phụ cấp & Đóng gói phản hồi): Tự động kiểm tra điều kiện hưởng phụ cấp người chăm sóc (bằng 1.0 lần mức chuẩn, tương đương 2.055.000 VNĐ) đối với trường hợp tỷ lệ tổn thương cơ thể từ 81% trở lên hoặc Mẹ Việt Nam Anh hùng. Tổng số tiền thực nhận = Trợ cấp hàng tháng + Phụ cấp chăm sóc + Các khoản phụ cấp đặc thù. Kết quả được đóng gói cùng mã kiểm tra tính toàn vẹn Checksum trước khi ghi vào sổ cái tài chính.")

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
    add_body_p(doc, "- Giai đoạn 1 (Xác thực pháp lý & Kiểm tra hồ sơ): Cán bộ Bộ phận Một cửa tiếp nhận hồ sơ báo giảm gồm: Giấy trích lục khai tử chính thức do UBND phường cấp, bản gốc sổ ưu đãi người có công, căn cước công dân và giấy tờ chứng minh quan hệ nhân thân của người khai báo. Cán bộ đối chiếu mã hồ sơ trên hệ thống để xác thực tính hợp lệ.")
    add_body_p(doc, "- Giai đoạn 2 (Chuyển trạng thái & Khóa dữ liệu): Hệ thống ghi nhận sự kiện từ trần, tự động chuyển đổi trạng thái hồ sơ của đối tượng từ 'DA_DUYET' (Đang thụ hưởng) sang 'DA_TU_TRAN'. Ngay lập tức, cơ chế khóa dữ liệu (Data Freezing) được kích hoạt để ngăn chặn mọi thao tác chỉnh sửa thông tin cá nhân của đối tượng.")
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

if 'def add_financial_engine_analysis' not in content:
    # Chèn helper_funcs trước hàm build_full_report
    content = content.replace('def build_full_report():', helper_funcs + '\ndef build_full_report():')

# 5. Cập nhật list_figs trong Danh mục hình vẽ
old_list_figs = '''    list_figs = [
        ("Hình 1.2", "Sơ đồ cơ cấu tổ chức Phòng Văn hóa và Thông tin TP. Thủ Dầu Một", 34),
        ("Hình 2.1", "Sơ đồ Kiến trúc tổng thể phần mềm Hybrid Modular Monolith", 38),
        ("Hình 2.2", "Sơ đồ Quy trình kiểm thử phần mềm 7 bước tiêu chuẩn", 38),
        ("Hình 2.8", "Sơ đồ Tích hợp hệ thống liên thông dữ liệu qua Trục LGSP", 39),
        ("Hình 3.1", "Sơ đồ Tuần tự (Sequence Diagram) thẩm định hồ sơ và tự động tính trợ cấp", 46),
        ("Hình 2.3", "Sơ đồ Mối quan hệ Thực thể CSDL MySQL (ERD Diagram)", 47),'''

new_list_figs = '''    list_figs = [
        ("Hình 1.1", "Trụ sở Phòng Văn hóa và Thông tin thành phố Thủ Dầu Một", 34),
        ("Hình 1.2", "Sơ đồ cơ cấu tổ chức Phòng Văn hóa và Thông tin TP. Thủ Dầu Một", 35),
        ("Hình 2.1", "Sơ đồ Kiến trúc tổng thể phần mềm Hybrid Modular Monolith", 38),
        ("Hình 2.2", "Sơ đồ các nhiệm vụ chính của thực tập sinh chuyển đổi số", 39),
        ("Hình 2.3", "Sơ đồ cơ sở quản lý dữ liệu hồ sơ người có công và phân hệ Backend API", 41),
        ("Hình 2.4", "Sơ đồ Tích hợp hệ thống liên thông dữ liệu qua Trục LGSP", 42),
        ("Hình 2.5", "Sơ đồ Quy trình kiểm thử phần mềm QA/QC 7 bước tiêu chuẩn", 43),
        ("Hình 3.1", "Sơ đồ Tuần tự (Sequence Diagram) thẩm định hồ sơ và tự động tính trợ cấp", 47),
        ("Hình 3.2", "Sơ đồ Mối quan hệ Thực thể CSDL MySQL (ERD Diagram)", 48),'''

if old_list_figs in content:
    content = content.replace(old_list_figs, new_list_figs)
else:
    print("Warning: old_list_figs not found exactly")

# 6. Cập nhật Chương 1
old_c1 = '''    # ==========================================
    # 13. CHƯƠNG 1: TỔNG QUAN VỀ CƠ SỞ THỰC TẬP
    # ==========================================
    print("13. Tạo Chương 1...")
    add_h1(doc, "CHƯƠNG 1. TỔNG QUAN VỀ CƠ QUAN THỰC TẬP & BÀI TOÁN NGHIỆP VỤ")
    add_chapter_body_blocks(doc, CHUONG_1_TEXT)

    # Chèn Hình 1.2: Sơ đồ tổ chức
    add_figure(
        doc,
        os.path.join(DIAGRAMS_DIR, "hinh_1_2_so_do_to_chuc.png"),
        "Hình 1.2: Sơ đồ cơ cấu tổ chức Phòng Văn hóa và Thông tin TP. Thủ Dầu Một",
        "Cơ cấu tổ chức của cơ quan được xây dựng theo mô hình phân cấp tinh gọn, đảm bảo hiệu lực hiệu quả. Đứng đầu là Trưởng phòng phụ trách chung, Phó Trưởng phòng phụ trách CNTT & Chuyển đổi số. Các bộ phận chuyên môn bao gồm: Bộ phận Văn hóa - Gia đình & Du lịch; Bộ phận Bưu chính, Viễn thông & Tuyên truyền; và Bộ phận CNTT & Chuyển đổi số (nơi sinh viên trực tiếp thực tập)."
    )

    doc.add_page_break()'''

new_c1 = '''    # ==========================================
    # 13. CHƯƠNG 1: TỔNG QUAN VỀ CƠ SỞ THỰC TẬP
    # ==========================================
    print("13. Tạo Chương 1 (tái sử dụng hình ảnh từ Word V2 gốc)...")
    add_h1(doc, "CHƯƠNG 1. TỔNG QUAN VỀ CƠ QUAN THỰC TẬP & BÀI TOÁN NGHIỆP VỤ")
    
    parts_c1 = re.split(r'\\n(?=1\\.\\d+\\.\\s+)', CHUONG_1_TEXT.strip())
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

    doc.add_page_break()'''

if old_c1 in content:
    content = content.replace(old_c1, new_c1)
else:
    print("Warning: old_c1 not found exactly")

# 7. Cập nhật Chương 2
old_c2 = '''    # ==========================================
    # 14. CHƯƠNG 2: CƠ SỞ LÝ THUYẾT & CÔNG NGHỆ
    # ==========================================
    print("14. Tạo Chương 2...")
    add_h1(doc, "CHƯƠNG 2. CƠ SỞ LÝ THUYẾT VÀ CÔNG NGHỆ ÁP DỤNG")
    add_chapter_body_blocks(doc, CHUONG_2_TEXT)

    # Chèn Sơ đồ kiến trúc Hình 2.1
    add_figure(
        doc,
        os.path.join(DIAGRAMS_DIR, "hinh_2_1_kien_truc_he_thong.png"),
        "Hình 2.1: Sơ đồ Kiến trúc tổng thể phần mềm Hybrid Modular Monolith",
        "Kiến trúc tổng thể gồm 4 tầng rõ rệt: Tầng Trình diễn (React 19, TypeScript, Tailwind CSS, TanStack Router); Cổng API Gateway NGINX (SSL Termination, Rate Limiting, CORS); Tầng Dịch vụ Backend kết hợp Node.js Express cho CRUD I/O nhanh và Java Spring Boot cho Engine tính toán tài chính; Tầng CSDL MySQL 8.0 Cluster và Trục liên thông LGSP."
    )

    # Chèn Sơ đồ quy trình kiểm thử Hình 2.2
    add_figure(
        doc,
        os.path.join(DIAGRAMS_DIR, "hinh_2_2_quy_trinh_kiem_thu.png"),
        "Hình 2.2: Sơ đồ Quy trình kiểm thử phần mềm QA/QC 7 bước tiêu chuẩn",
        "Quy trình QA/QC chuẩn hóa 7 bước: Tiếp nhận yêu cầu -> Phân tích chức năng và biên dữ liệu -> Xây dựng Checklist kiểm thử -> Thiết kế Kịch bản Test Case chi tiết -> Thực thi kiểm thử và lập Bug Report -> Kiểm thử lại (Retest) sau khi Dev sửa lỗi -> Tổng kết và lập báo cáo Test Summary Report."
    )

    # Chèn Sơ đồ LGSP Hình 2.8
    add_figure(
        doc,
        os.path.join(DIAGRAMS_DIR, "hinh_2_8_so_do_lgsp.png"),
        "Hình 2.8: Sơ đồ Tích hợp hệ thống liên thông dữ liệu qua Trục LGSP",
        "Mô hình tích hợp liên thông qua Trục LGSP giữa hệ thống nội bộ cấp phường/thành phố với CSDL Tập trung cấp Sở/Tỉnh và Đề án 06/CP: Ứng dụng bảo mật kênh truyền Mutual TLS (mTLS 1.3), xác thực OAuth 2.0 Client Credentials Grant, hàng đợi Message Queue và cơ chế tự động thử lại khi có sự cố đường truyền."
    )

    doc.add_page_break()'''

new_c2 = '''    # ==========================================
    # 14. CHƯƠNG 2: CƠ SỞ LÝ THUYẾT & CÔNG NGHỆ
    # ==========================================
    print("14. Tạo Chương 2 (tái sử dụng hình ảnh từ Word V2 gốc)...")
    add_h1(doc, "CHƯƠNG 2. CƠ SỞ LÝ THUYẾT VÀ CÔNG NGHỆ ÁP DỤNG")
    
    parts_c2 = re.split(r'\\n(?=2\\.\\d+\\.\\s+)', CHUONG_2_TEXT.strip())
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

    doc.add_page_break()'''

if old_c2 in content:
    content = content.replace(old_c2, new_c2)
else:
    print("Warning: old_c2 not found exactly")

# 8. Cập nhật Chương 3: Hình 3.2
old_c3_erd = '''    # Chèn Sơ đồ ERD Hình 2.3
    add_figure(
        doc,
        os.path.join(DIAGRAMS_DIR, "hinh_2_3_so_do_erd.png"),
        "Hình 2.3: Sơ đồ Mối quan hệ Thực thể CSDL MySQL (ERD Diagram)",
        "Sơ đồ ERD thể hiện mối quan hệ giữa bảng trung tâm ho_so_ncc với 15 bảng vệ tinh: dm_phuong (1-N), dm_loai_doi_tuong (1-N), sys_users (1-N), quyet_dinh_huong (1-N), lich_su_chi_tra (1-N), khao_sat_danh_gia (1-N), ho_so_liet_sy (1-1), than_nhan_liet_si (1-N), ke_hoach_dieu_duong (1-N), ho_so_bao_giam_mai_tang (1-1), danh_sach_phuong_tien_chinh_hinh (1-N) và nghia_trang_mo_liet_si."
    )'''

new_c3_erd = '''    # Chèn Sơ đồ ERD Hình 3.2 (image12.png từ V2 gốc)
    add_figure(
        doc,
        os.path.join(V2_IMAGES_DIR, "image12.png"),
        "Hình 3.2: Sơ đồ Mối quan hệ Thực thể CSDL MySQL (ERD Diagram)",
        "Sơ đồ ERD thể hiện mối quan hệ giữa bảng trung tâm ho_so_ncc với các bảng danh mục và bảng vệ tinh: dm_phuong (1-N), dm_loai_doi_tuong (1-N), sys_users (1-N), quyet_dinh_huong (1-N), lich_su_chi_tra (1-N), khao_sat_danh_gia (1-N), ho_so_liet_sy (1-1), than_nhan_liet_si (1-N), ke_hoach_dieu_duong (1-N), ho_so_bao_giam_mai_tang (1-1), danh_sach_phuong_tien_chinh_hinh (1-N) và nghia_trang_mo_liet_si.",
        width=Inches(6.0)
    )'''

if old_c3_erd in content:
    content = content.replace(old_c3_erd, new_c3_erd)
else:
    print("Warning: old_c3_erd not found exactly")

# 9. Cập nhật Chương 4: Bỏ hoàn toàn các đoạn code Java, TS, TSX, thay bằng 3 hàm phân tích
old_c4_code_blocks = '''    # Đưa các đoạn mã nguồn then chốt vào báo cáo
    add_h3(doc, "4.1.8. Cài đặt Mã nguồn Engine Tính toán Trợ cấp bằng Java Spring Boot (BigDecimal)")
    code_spring = (
        "// AllowanceCalculationService.java - Core Engine xử lý tài chính an sinh xã hội\\n"
        "@Service\\n"
        "public class AllowanceCalculationService {\\n"
        "    private static final BigDecimal MUC_CHUAN = new BigDecimal(\\"2055000\\");\\n\\n"
        "    public AllowanceResponse calculate(AllowanceRequest request) {\\n"
        "        BigDecimal troCapThang = BigDecimal.ZERO;\\n"
        "        BigDecimal phuCapChamSoc = BigDecimal.ZERO;\\n\\n"
        "        switch (request.getMaLoaiDt()) {\\n"
        "            case \\"THUONG_BINH\\":\\n"
        "                if (request.getTyLeThuongTat() >= 21) {\\n"
        "                    BigDecimal heSo = calculateDisabilityFactor(request.getTyLeThuongTat());\\n"
        "                    troCapThang = MUC_CHUAN.multiply(heSo).setScale(0, RoundingMode.HALF_UP);\\n"
        "                }\\n"
        "                if (request.getTyLeThuongTat() >= 81 && Boolean.TRUE.equals(request.getCoNguoiChamSoc())) {\\n"
        "                    phuCapChamSoc = MUC_CHUAN.multiply(new BigDecimal(\\"1.0\\")).setScale(0, RoundingMode.HALF_UP);\\n"
        "                }\\n"
        "                break;\\n"
        "            case \\"ME_VNAH\\":\\n"
        "                troCapThang = MUC_CHUAN.multiply(new BigDecimal(\\"3.0\\")).setScale(0, RoundingMode.HALF_UP);\\n"
        "                phuCapChamSoc = MUC_CHUAN.multiply(new BigDecimal(\\"1.0\\")).setScale(0, RoundingMode.HALF_UP);\\n"
        "                break;\\n"
        "            default:\\n"
        "                troCapThang = MUC_CHUAN;\\n"
        "        }\\n"
        "        BigDecimal tongTien = troCapThang.add(phuCapChamSoc);\\n"
        "        return AllowanceResponse.builder()\\n"
        "                .status(\\"SUCCESS\\")\\n"
        "                .troCapHangThang(troCapThang)\\n"
        "                .phuCapChamSoc(phuCapChamSoc)\\n"
        "                .tongTienThucNhan(tongTien)\\n"
        "                .build();\\n"
        "    }\\n"
        "}"
    )
    add_code_block(doc, code_spring, "Thuật toán tính trợ cấp chuẩn y khoa bằng BigDecimal")

    add_h3(doc, "4.1.9. Cài đặt Hàm Đọc Số tiền thành Chữ Tiếng Việt Chuẩn Biểu mẫu C70a-HD")
    code_doc_tien = (
        "// calculator.service.ts - Hàm đọc số tiền thành chữ tiếng Việt chuẩn kế toán\\n"
        "export function docSoTienBangChu(soTien: number): string {\\n"
        "  if (soTien <= 0) return \\"Không đồng\\";\\n"
        "  const chuSo = [\\"không\\", \\"một\\", \\"hai\\", \\"ba\\", \\"bốn\\", \\"năm\\", \\"sáu\\", \\"bảy\\", \\"tám\\", \\"chín\\"];\\n"
        "  const hangDonVi = [\\"\\", \\"nghìn\\", \\"triệu\\", \\"tỷ\\"];\\n\\n"
        "  function docBlock3(num: number): string {\\n"
        "    const tram = Math.floor(num / 100);\\n"
        "    const chuc = Math.floor((num % 100) / 10);\\n"
        "    const donVi = num % 10;\\n"
        "    let res = \\"\\";\\n"
        "    if (tram > 0) res += `${chuSo[tram]} trăm `;\\n"
        "    if (chuc > 1) {\\n"
        "      res += `${chuSo[chuc]} mươi `;\\n"
        "      if (donVi === 1) res += \\"mốt \\";\\n"
        "      else if (donVi === 5) res += \\"lăm \\";\\n"
        "      else if (donVi > 0) res += `${chuSo[donVi]} `;\\n"
        "    } else if (chuc === 1) {\\n"
        "      res += \\"mười \\";\\n"
        "      if (donVi === 5) res += \\"lăm \\";\\n"
        "      else if (donVi > 0) res += `${chuSo[donVi]} `;\\n"
        "    } else if (tram > 0 && donVi > 0) {\\n"
        "      res += `lẻ ${chuSo[donVi]} `;\\n"
        "    } else if (donVi > 0) res += `${chuSo[donVi]} `;\\n"
        "    return res.trim();\\n"
        "  }\\n"
        "  // Phân rã khối và ghép chuỗi...\\n"
        "  return result.trim() + \\" đồng chẵn.\\";\\n"
        "}"
    )
    add_code_block(doc, code_doc_tien, "Thuật toán chuyển đổi số tiền sang chữ tiếng Việt")

    add_h3(doc, "4.1.10. Cài đặt Logic Xử lý Báo giảm và Ngắt Chi trả Trợ cấp (BaoGiamModal.tsx)")
    code_bao_giam = (
        "// BaoGiamModal.tsx - Logic báo giảm từ trần & sinh quyết định mai táng phí\\n"
        "const handleBaoGiamSubmit = async (formData: BaoGiamRequest) => {\\n"
        "  // 1. Kiểm tra tính hợp lệ của trích lục khai tử và CCCD người nhận\\n"
        "  validateBaoGiamForm(formData);\\n\\n"
        "  // 2. Cập nhật trạng thái hồ sơ sang 'ĐÃ TỪ TRẦN'\\n"
        "  await profileApi.updateStatus(hoSo.id, 'DA_TU_TRAN');\\n\\n"
        "  // 3. Tự động ngắt toàn bộ danh sách phát tiền hàng tháng ở các kỳ tiếp theo\\n"
        "  await payrollApi.disableMonthlyPayment(hoSo.id);\\n\\n"
        "  // 4. Tự động tính trợ cấp Mai táng phí = 10 x Mức chuẩn (20.550.000 VNĐ)\\n"
        "  const soTienMaiTang = MUC_CHUAN * 10;\\n"
        "  const quyetDinhMaiTang = await funeralApi.createDecision({\\n"
        "    hoSoId: hoSo.id,\\n"
        "    soTien: soTienMaiTang,\\n"
        "    nguoiNhan: formData.nguoiKhaiBao,\\n"
        "    soCccdNguoiKhai: formData.soCccd\\n"
        "  });\\n"
        "  toast.success('Báo giảm thành công và đã sinh QĐ Mai táng phí Mẫu 02!');\\n"
        "};"
    )
    add_code_block(doc, code_bao_giam, "Logic nghiệp vụ Báo giảm khai tử và ngắt chi trả")'''

new_c4_code_blocks = '''    # Phân tích các giải thuật nghiệp vụ trọng tâm (Không mang code trực tiếp vào báo cáo Word)
    add_financial_engine_analysis(doc)
    add_currency_spelling_section(doc)
    add_bao_giam_workflow_section(doc)'''

if old_c4_code_blocks in content:
    content = content.replace(old_c4_code_blocks, new_c4_code_blocks)
else:
    print("Warning: old_c4_code_blocks not found exactly")

# 10. Cập nhật Phụ lục 2: Bỏ code SQL DDL
old_pl2 = '''    add_h2(doc, "PHỤ LỤC 2: KỊCH BẢN SQL DDL KHỞI TẠO CƠ SỞ DỮ LIỆU MYSQL (SCHEMA.SQL)")
    sql_sample = (
        "-- Kịch bản DDL tạo bảng trung tâm và các bảng liên kết chính\\n"
        "CREATE DATABASE IF NOT EXISTS ql_nguoi_co_cong \\n"
        "CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\\n\\n"
        "USE ql_nguoi_co_cong;\\n\\n"
        "CREATE TABLE dm_phuong (\\n"
        "    ward_id INT AUTO_INCREMENT PRIMARY KEY,\\n"
        "    ward_name VARCHAR(100) NOT NULL,\\n"
        "    district_name VARCHAR(100) DEFAULT 'TP. Thủ Dầu Một',\\n"
        "    created_at DATETIME DEFAULT CURRENT_TIMESTAMP\\n"
        ") ENGINE=InnoDB;\\n\\n"
        "CREATE TABLE ho_so_ncc (\\n"
        "    ho_so_id BIGINT AUTO_INCREMENT PRIMARY KEY,\\n"
        "    ma_so_quan_ly VARCHAR(30) UNIQUE NOT NULL,\\n"
        "    so_cccd VARCHAR(12) UNIQUE NOT NULL,\\n"
        "    ho_ten VARCHAR(100) NOT NULL,\\n"
        "    ngay_sinh DATE NOT NULL,\\n"
        "    gioi_tinh ENUM('NAM', 'NU') NOT NULL,\\n"
        "    dia_chi_thuong_tru VARCHAR(255) NOT NULL,\\n"
        "    ward_id INT NOT NULL,\\n"
        "    ma_loai_dt VARCHAR(20) NOT NULL,\\n"
        "    ty_le_thuong_tat INT DEFAULT 0,\\n"
        "    trang_thai_hs ENUM('MOI_TIEP_NHAN', 'CHO_DUYET', 'DA_DUYET', 'TU_CHOI') DEFAULT 'MOI_TIEP_NHAN',\\n"
        "    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\\n"
        "    CONSTRAINT fk_hs_ward FOREIGN KEY (ward_id) REFERENCES dm_phuong(ward_id)\\n"
        ") ENGINE=InnoDB;\\n\\n"
        "CREATE INDEX idx_hs_cccd ON ho_so_ncc(so_cccd);\\n"
        "CREATE INDEX idx_hs_ward_status ON ho_so_ncc(ward_id, trang_thai_hs);"
    )
    add_code_block(doc, sql_sample, "Trích đoạn mã SQL DDL khởi tạo schema")'''

new_pl2 = '''    add_appendix_2_schema_specification(doc)'''

if old_pl2 in content:
    content = content.replace(old_pl2, new_pl2)
else:
    print("Warning: old_pl2 not found exactly")

# Ghi lại file
with open(script_path, "w", encoding="utf-8") as f:
    f.write(content)

print("build_full_report.py updated successfully!")
