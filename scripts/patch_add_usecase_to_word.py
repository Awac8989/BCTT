import os
import re
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

DOCX_PATH = r"q:\CODE_visual\filebctt\docs\DoanMinhQuan_2224801030137_BCTT2.docx"
DIAGRAM_PATH = r"q:\CODE_visual\filebctt\docs\diagrams\hinh_3_1_use_case_tong_quat.png"

def format_para(p, font_name="Times New Roman", font_size=13, bold=False, italic=False,
                color=(0,0,0), align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=2, space_after=4, line_spacing=1.3):
    pf = p.paragraph_format
    pf.alignment = align
    pf.space_before = Pt(space_before)
    pf.space_after = Pt(space_after)
    pf.line_spacing = line_spacing
    for r in p.runs:
        r.font.name = font_name
        r.font.size = Pt(font_size)
        r.font.bold = bold
        r.font.italic = italic
        r.font.color.rgb = RGBColor(*color)

def set_cell_margins(cell, top=80, bottom=80, left=100, right=100):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def set_table_borders(table, color="D3D3D3", sz="4", val="single"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(f'''
        <w:tblBorders {nsdecls("w")}>
            <w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>
            <w:insideV w:val="none"/>
            <w:left w:val="none"/>
            <w:right w:val="none"/>
        </w:tblBorders>
    ''')
    tblPr.append(borders)

def add_table_header(row, headers, col_widths=None):
    for idx, (title, width) in enumerate(zip(headers, col_widths if col_widths else [None]*len(headers))):
        cell = row.cells[idx]
        set_cell_margins(cell, top=100, bottom=100, left=100, right=100)
        p = cell.paragraphs[0]
        pf = p.paragraph_format
        pf.space_before = Pt(2)
        pf.space_after = Pt(2)
        pf.line_spacing = 1.15
        pf.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(title)
        r.font.name = "Times New Roman"
        r.font.size = Pt(10.0)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0, 0, 0)
        # Background light gray for header
        shading = parse_xml(f'<w:shd {nsdecls("w")} w:fill="F1F5F9"/>')
        cell._tc.get_or_add_tcPr().append(shading)
        if width:
            cell.width = width

def add_bookmark(p, bm_name, bm_id):
    pPr = p._p.get_or_add_pPr()
    bm_start = parse_xml(f'<w:bookmarkStart {nsdecls("w")} w:id="{bm_id}" w:name="{bm_name}"/>')
    bm_end = parse_xml(f'<w:bookmarkEnd {nsdecls("w")} w:id="{bm_id}"/>')
    p._p.insert(0, bm_start)
    p._p.append(bm_end)

def patch_document():
    if not os.path.exists(DOCX_PATH):
        raise FileNotFoundError(f"File not found: {DOCX_PATH}")
    if not os.path.exists(DIAGRAM_PATH):
        raise FileNotFoundError(f"Diagram not found: {DIAGRAM_PATH}")

    print("Opening Word document...")
    doc = docx.Document(DOCX_PATH)

    # 1. TÌM VỊ TRÍ CHÈN VÀO MỤC 3.2
    # Mục tiêu: Chèn ngay trước Heading "3.3. SƠ ĐỒ TUẦN TỰ (SEQUENCE DIAGRAMS)"
    idx_target = None
    for i, p in enumerate(doc.paragraphs):
        if p.text.strip().startswith("3.3. SƠ ĐỒ TUẦN TỰ") or p.text.strip().startswith("3.3. Sơ đồ tuần tự"):
            idx_target = i
            break

    if idx_target is None:
        raise ValueError("Không tìm thấy Heading '3.3. SƠ ĐỒ TUẦN TỰ' trong tài liệu!")

    target_p = doc.paragraphs[idx_target]
    print(f"Tìm thấy vị trí chèn trước Paragraph {idx_target}: {repr(target_p.text)}")

    # 2. XÂY DỰNG NỘI DUNG VIẾT BỔ SUNG VỀ USE CASE TỔNG QUÁT
    intro_paras = [
        ("Để hiện thực hóa toàn diện mục tiêu chuyển đổi số quy trình nghiệp vụ tiếp nhận, thẩm định, chi trả và giám sát an sinh xã hội theo đúng tinh thần Pháp lệnh số 02/2020/UBTVQH14 [2], Nghị định số 131/2021/NĐ-CP [3], Nghị định số 75/2021/NĐ-CP [4] và Nghị định số 61/2018/NĐ-CP [6], mô hình Use Case tổng quát của hệ thống được kiến trúc thành 6 phân hệ nghiệp vụ cốt lõi, bảo đảm tính khép kín và phân định rõ trách nhiệm công vụ giữa các cấp hành chính:", False, False),
        ("1. Phân hệ Tiếp nhận & Hồ sơ Một cửa (Intake & Front Desk Subsystem): Phục vụ Cán bộ Một cửa cấp xã/phường thực hiện tiếp nhận hồ sơ ban đầu từ người dân, tự động cấp mã định danh hồ sơ duy nhất và xuất Giấy hẹn tiếp nhận Mẫu số 01 tích hợp mã QR Code tra cứu. Phân hệ tích hợp công nghệ AI OCR hỗ trợ quét số hóa, trích xuất dữ liệu từ các tài liệu hồ sơ giấy cũ và tiếp nhận quy trình báo giảm khi đối tượng người có công từ trần.", False, False),
        ("2. Phân hệ Thẩm định & Chính sách Trợ cấp (Appraisal & Calculation Subsystem): Phục vụ Chuyên viên Thẩm định cấp phòng/thành phố rà soát tính pháp lý và căn cứ y khoa qua quy trình thẩm định 5 bước liên thông, kích hoạt Core Financial Engine tự động tính toán trợ cấp, phụ cấp ưu đãi theo tỷ lệ tổn thương cơ thể chuẩn xác tuyệt đối (làm tròn HALF_UP bằng BigDecimal), tự động khởi tạo dự thảo Quyết định hưởng trợ cấp. Đồng thời, phân hệ quản lý kế hoạch điều dưỡng luân phiên và cấp phát phương tiện trợ giúp, dụng cụ chỉnh hình theo niên hạn luật định.", False, False),
        ("3. Phân hệ Kế toán Chi trả & Báo giảm (Payment & Death Benefits Subsystem): Phục vụ Cán bộ Kế toán / Chi trả lập danh sách chi trả trợ cấp định kỳ hàng tháng, xuất Phiếu chi Mẫu C70a-HD tích hợp mã vạch theo Thông tư 101/2018/TT-BTC [10], đối soát tự động dữ liệu sao kê tài khoản ngân hàng (Bank Reconciliation) và thực hiện giải quyết trợ cấp Mai táng phí một lần (Mẫu số 02 - Nghị định 131/2021/NĐ-CP) khi có thông báo tử tuất.", False, False),
        ("4. Phân hệ Giám sát Lãnh đạo & Phê duyệt Công vụ (Leadership Dashboard & Approval Subsystem): Phục vụ Ban Lãnh đạo kiểm tra toàn diện hồ sơ thẩm định, thực hiện ký số điện tử công vụ PKI SmartCA để ban hành quyết định hành chính có giá trị pháp lý cao nhất; đồng thời theo dõi trung tâm điều hành Dashboard với các chỉ số KPI an sinh, hệ thống cảnh báo sớm rủi ro và giám sát chất lượng phục vụ qua Biểu đồ Radar SIPAS 4 chiều.", False, False),
        ("5. Phân hệ Cổng Dịch vụ công & Kiosk CSAT (Public Services & Citizen Feedback Subsystem): Cung cấp giao diện tra cứu công khai cho công dân và thân nhân theo dõi tiến độ giải quyết hồ sơ và lịch nhận tiền qua số CCCD (được mã hóa che bảo mật theo Nghị định 13/2023/NĐ-CP [7]), bản đồ số GIS tra cứu vị trí mộ liệt sĩ trực tuyến; đồng thời cung cấp giao diện Kiosk cảm ứng độc lập tại sảnh Một cửa để người dân trực tiếp đánh giá chất lượng phục vụ (1 đến 5 sao theo 4 tiêu chí SIPAS) và gửi ý kiến đóng góp (tự động phân tích sắc thái cảm xúc bằng AI Sentiment Analysis).", False, False),
        ("6. Phân hệ Quản trị Hệ thống & Danh mục (System Administration & Master Data Subsystem): Phục vụ Quản trị viên quản lý danh mục mức chuẩn trợ cấp và các hệ số pháp lý biến động theo thời gian, phân quyền tài khoản người dùng theo mô hình RBAC nghiêm ngặt và theo dõi toàn bộ vết nhật ký kiểm toán hệ thống (Audit Trails) phục vụ công tác an toàn thông tin theo quy định của Luật An ninh mạng [1].", False, False),
    ]

    for text, bold, italic in intro_paras:
        p_new = target_p.insert_paragraph_before()
        p_new.add_run(text)
        format_para(p_new, font_name="Times New Roman", font_size=13, bold=bold, italic=italic,
                    align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=2, space_after=4, line_spacing=1.3)

    # 3. BẢNG MA TRẬN USE CASE VÀ TÁC NHÂN PHÂN QUYỀN
    p_cap_tbl = target_p.insert_paragraph_before()
    r_cap_lbl = p_cap_tbl.add_run("Bảng 3.0: ")
    r_cap_lbl.font.name = "Times New Roman"
    r_cap_lbl.font.size = Pt(11)
    r_cap_lbl.font.bold = True
    r_cap_lbl.font.color.rgb = RGBColor(0, 0, 0)
    r_cap_t = p_cap_tbl.add_run("Bảng tổng hợp phân loại Use Case theo Phân hệ và Tác nhân phân quyền trong hệ thống")
    r_cap_t.font.name = "Times New Roman"
    r_cap_t.font.size = Pt(11)
    r_cap_t.font.bold = True
    r_cap_t.font.italic = True
    r_cap_t.font.color.rgb = RGBColor(0, 0, 0)
    p_cap_tbl.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap_tbl.paragraph_format.space_before = Pt(8)
    p_cap_tbl.paragraph_format.space_after = Pt(3)
    p_cap_tbl.paragraph_format.keep_with_next = True

    # Tạo bảng và di chuyển trước target_p
    table_data = [
        ("UC-01", "Tiếp nhận hồ sơ mới và cấp mã định danh", "Tiếp nhận Một cửa", "Cán bộ Một cửa", "Cơ bản"),
        ("UC-01a", "In Giấy hẹn tiếp nhận Mẫu 01 (có QR Code)", "Tiếp nhận Một cửa", "Cán bộ Một cửa", "<<include>> UC-01"),
        ("UC-02", "Số hóa hồ sơ tài liệu cũ bằng AI OCR", "Tiếp nhận Một cửa", "Cán bộ Một cửa", "<<extend>> UC-01"),
        ("UC-03", "Thẩm định hồ sơ y khoa 5 bước Một cửa", "Thẩm định Chính sách", "Chuyên viên Thẩm định", "Cơ bản"),
        ("UC-03a", "Tự động tính trợ cấp ưu đãi (NĐ 75/2021)", "Thẩm định Chính sách", "Financial Core Engine", "<<include>> UC-03"),
        ("UC-03b", "Lập dự thảo Quyết định hưởng trợ cấp", "Thẩm định Chính sách", "Chuyên viên Thẩm định", "<<include>> UC-03"),
        ("UC-04", "Lập danh sách chi trả và In Phiếu chi C70a-HD", "Kế toán Chi trả", "Kế toán / Chi trả", "Cơ bản"),
        ("UC-04a", "Đối soát tự động dữ liệu sao kê ngân hàng", "Kế toán Chi trả", "Kế toán / Chi trả", "<<extend>> UC-04"),
        ("UC-05", "Tiếp nhận báo giảm đối tượng từ trần", "Tiếp nhận Một cửa", "Cán bộ Một cửa", "Cơ bản"),
        ("UC-05a", "Ban hành Quyết định Mai táng phí Mẫu 02", "Kế toán Chi trả", "Kế toán / Chi trả", "<<include>> UC-05"),
        ("UC-05b", "Chi trả trợ cấp Mai táng phí và 1 lần", "Kế toán Chi trả", "Kế toán / Chi trả", "Cơ bản"),
        ("UC-06", "Quản lý kế hoạch điều dưỡng luân phiên", "Chính sách Phụ trợ", "Chuyên viên Thẩm định", "Cơ bản"),
        ("UC-07", "Quản lý cấp phương tiện & Dụng cụ chỉnh hình", "Chính sách Phụ trợ", "Chuyên viên Thẩm định", "Cơ bản"),
        ("UC-08", "Bản đồ số GIS & Tra cứu bia mộ Liệt sĩ", "Dịch vụ công & GIS", "Công dân, Quản trị viên", "Cơ bản"),
        ("UC-09", "Tra cứu tiến độ hồ sơ & Lịch phát tiền qua CCCD", "Dịch vụ công trực tuyến", "Công dân / Thân nhân", "Cơ bản"),
        ("UC-10", "Đánh giá dịch vụ công tại Kiosk (1-5 sao SIPAS)", "Kiosk CSAT", "Công dân / Thân nhân", "Cơ bản"),
        ("UC-10a", "Góp ý nhận xét tự do & Phân tích Sentiment AI", "Kiosk CSAT", "Công dân / Thân nhân", "<<extend>> UC-10"),
        ("UC-11", "Dashboard điều hành & Cảnh báo rủi ro", "Giám sát Lãnh đạo", "Lãnh đạo Phê duyệt", "Cơ bản"),
        ("UC-11a", "Phân tích Biểu đồ Radar 4 tiêu chí SIPAS", "Giám sát Lãnh đạo", "Lãnh đạo Phê duyệt", "<<include>> UC-11"),
        ("UC-12", "Ký số điện tử PKI SmartCA (Phê duyệt QĐ)", "Phê duyệt Lãnh đạo", "Lãnh đạo Phê duyệt", "Cơ bản"),
        ("UC-13", "Cấu hình định mức trợ cấp & Tham số pháp lý", "Quản trị Hệ thống", "Quản trị viên Hệ thống", "Cơ bản"),
        ("UC-14", "Phân quyền vai trò RBAC & Quản lý tài khoản", "Quản trị Hệ thống", "Quản trị viên Hệ thống", "Cơ bản"),
        ("UC-15", "Giám sát nhật ký kiểm toán hệ thống (Audit Logs)", "Quản trị Hệ thống", "Quản trị viên Hệ thống", "Cơ bản"),
    ]

    table = doc.add_table(rows=len(table_data) + 1, cols=5)
    set_table_borders(table)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    col_widths = [Inches(0.9), Inches(2.2), Inches(1.3), Inches(1.1), Inches(0.9)]
    add_table_header(table.rows[0], ["Mã UC", "Tên Use Case", "Phân hệ nghiệp vụ", "Tác nhân chính", "Quan hệ"], col_widths)

    for r_idx, row_data in enumerate(table_data):
        row = table.rows[r_idx + 1]
        for c_idx, val in enumerate(row_data):
            cell = row.cells[c_idx]
            set_cell_margins(cell, top=50, bottom=50, left=70, right=70)
            p = cell.paragraphs[0]
            pf = p.paragraph_format
            pf.space_before = Pt(1)
            pf.space_after = Pt(1)
            pf.line_spacing = 1.15
            pf.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_idx in [0, 4] else WD_ALIGN_PARAGRAPH.LEFT
            r = p.add_run(val)
            r.font.name = "Times New Roman"
            r.font.size = Pt(9.5)
            r.font.bold = (c_idx == 0)
            r.font.color.rgb = RGBColor(0, 0, 0)
            if col_widths and c_idx < len(col_widths):
                cell.width = col_widths[c_idx]

    # Di chuyển bảng lên vị trí trước target_p
    target_p._p.addprevious(table._tbl)

    # 4. ĐOẠN PHÂN TÍCH QUAN HỆ UML VÀ HÌNH ẢNH SƠ ĐỒ USE CASE
    relationship_paras = [
        ("Sơ đồ Use Case tổng quát áp dụng đầy đủ các quan hệ chuẩn hóa UML 2.5 để mô hình hóa chính xác các ràng buộc nghiệp vụ hành chính công:", False, False),
        ("- Quan hệ Kết hợp (Association): Thể hiện đường tương tác trực tiếp giữa từng Tác nhân với các ca sử dụng nằm trong phạm vi quyền hạn được cấp phép của tác nhân đó theo mô hình RBAC. Mỗi tác nhân chỉ được phép truy cập và tương tác với các Use Case phù hợp với vị trí công tác và trách nhiệm công vụ đã được xác thực qua token JWT.", False, False),
        ("- Quan hệ Bao hàm (<<include>>): Đại diện cho các hành vi bắt buộc phải thực thi kèm theo mỗi khi Use Case cơ sở được kích hoạt:", False, False),
        ("  + UC-01 include UC-01a: Mỗi khi Cán bộ Một cửa hoàn tất tiếp nhận một bộ hồ sơ hợp lệ (UC-01), hệ thống bắt buộc tự động sinh Giấy hẹn tiếp nhận và trả kết quả Mẫu số 01 theo Nghị định 61/2018/NĐ-CP tích hợp mã QR tra cứu (UC-01a).", False, False),
        ("  + UC-03 include UC-03a: Quá trình thẩm định hồ sơ y khoa (UC-03) bắt buộc phải kích hoạt engine tính toán tài chính tự động (UC-03a) để áp giá trợ cấp chuẩn xác theo Nghị định 75/2021/NĐ-CP, bảo đảm tính khách quan và triệt tiêu sai số con người.", False, False),
        ("  + UC-03 include UC-03b: Sau khi tính toán định mức kinh phí thành công, hệ thống tự động lập dự thảo Quyết định hưởng trợ cấp ưu đãi (UC-03b) với đầy đủ thông tin pháp lý để trình Lãnh đạo ký số.", False, False),
        ("  + UC-05 include UC-05a: Khi Cán bộ Một cửa tiếp nhận thông tin báo giảm từ trần của đối tượng đang hưởng trợ cấp (UC-05), hệ thống tự động tạo hồ sơ thủ tục mai táng phí và ban hành Quyết định trợ cấp mai táng Mẫu số 02 (UC-05a).", False, False),
        ("  + UC-11 include UC-11a: Màn hình Dashboard giám sát điều hành của Lãnh đạo (UC-11) bắt buộc tự động tổng hợp và trực quan hóa Biểu đồ Radar 4 tiêu chí SIPAS (UC-11a) từ dữ liệu khảo sát thời gian thực của người dân.", False, False),
        ("- Quan hệ Mở rộng (<<extend>>): Đại diện cho các hành vi tùy chọn hoặc luồng xử lý nâng cao chỉ được kích hoạt trong những điều kiện nghiệp vụ cụ thể:", False, False),
        ("  + UC-02 extend UC-01: Trong quá trình tiếp nhận hồ sơ (UC-01), nếu công dân nộp các văn bản giấy tờ lịch sử bị mờ chữ hoặc Bằng Tổ quốc ghi công cũ, cán bộ Một cửa có thể kích hoạt phân hệ AI OCR (UC-02) để tự động quét, căn chỉnh góc nghiêng và bóc tách dữ liệu vào biểu mẫu số.", False, False),
        ("  + UC-04a extend UC-04: Trong công tác quản lý chi trả an sinh xã hội hàng tháng (UC-04), kế toán viên có thể kích hoạt tính năng đối soát sao kê tự động với hệ thống ngân hàng (UC-04a) để đối chiếu sai lệch tài khoản và trạng thái chuyển khoản của từng đối tượng thụ hưởng.", False, False),
        ("  + UC-10a extend UC-10: Khi công dân thực hiện đánh giá sự phục vụ tại màn hình Kiosk Một cửa (UC-10), công dân có thể tùy chọn nhập thêm nhận xét, kiến nghị tự do (UC-10a). Khi đó hệ thống sẽ chuyển nội dung văn bản này sang module AI NLP để tự động phân loại cảm xúc (Tích cực / Tiêu cực) và gửi cảnh báo sớm đến Lãnh đạo nếu phát sinh phản ánh bức xúc.", False, False),
    ]

    for text, bold, italic in relationship_paras:
        p_new = target_p.insert_paragraph_before()
        p_new.add_run(text)
        format_para(p_new, font_name="Times New Roman", font_size=13, bold=bold, italic=italic,
                    align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=2, space_after=4, line_spacing=1.3)

    # 5. CHÈN HÌNH ẢNH SƠ ĐỒ USE CASE TỔNG QUÁT (HÌNH 3.1)
    p_img = target_p.insert_paragraph_before()
    pf_img = p_img.paragraph_format
    pf_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
    pf_img.space_before = Pt(12)
    pf_img.space_after = Pt(3)
    pf_img.keep_with_next = True
    r_img = p_img.add_run()
    r_img.add_picture(DIAGRAM_PATH, width=Inches(6.2))

    # Caption Hình 3.1
    p_cap_fig = target_p.insert_paragraph_before()
    pf_cap_fig = p_cap_fig.paragraph_format
    pf_cap_fig.alignment = WD_ALIGN_PARAGRAPH.CENTER
    pf_cap_fig.space_before = Pt(2)
    pf_cap_fig.space_after = Pt(6)
    pf_cap_fig.keep_with_next = True
    add_bookmark(p_cap_fig, "fig_3_1", 3101)

    r_cap_lbl = p_cap_fig.add_run("Hình 3.1: ")
    r_cap_lbl.font.name = "Times New Roman"
    r_cap_lbl.font.size = Pt(13)
    r_cap_lbl.font.bold = True
    r_cap_lbl.font.italic = True
    r_cap_lbl.font.color.rgb = RGBColor(0, 0, 0)

    r_cap_txt = p_cap_fig.add_run("Sơ đồ Use Case tổng quát Hệ thống Quản lý Hồ sơ Người có công và Đánh giá Dịch vụ công")
    r_cap_txt.font.name = "Times New Roman"
    r_cap_txt.font.size = Pt(13)
    r_cap_txt.font.italic = True
    r_cap_txt.font.color.rgb = RGBColor(0, 0, 0)

    # Đoạn phân tích kỹ thuật của Hình 3.1
    p_desc_fig = target_p.insert_paragraph_before()
    r_desc_b = p_desc_fig.add_run("* Phân tích chức năng và giải pháp kỹ thuật: ")
    r_desc_b.font.name = "Times New Roman"
    r_desc_b.font.size = Pt(13)
    r_desc_b.font.bold = True
    r_desc_b.font.color.rgb = RGBColor(0, 0, 0)

    r_desc_t = p_desc_fig.add_run("Sơ đồ Use Case tổng quát phản ánh kiến trúc phân rã chức năng toàn diện của hệ thống với 6 phân hệ nghiệp vụ độc lập nhưng liên kết chặt chẽ qua cơ chế trao đổi dữ liệu RESTful API và mô hình phân quyền dựa trên vai trò (Role-Based Access Control - RBAC). Hệ thống bảo đảm tính khép kín từ khâu tiếp nhận thủ tục hành chính tại cấp xã/phường, xử lý chuyên môn tại cấp phòng/thành phố, phê duyệt ký số điện tử PKI SmartCA của Lãnh đạo, giải ngân tài chính công qua ngân hàng, đến cổng công khai minh bạch cho công dân tra cứu và đánh giá sự phục vụ qua Kiosk.")
    r_desc_t.font.name = "Times New Roman"
    r_desc_t.font.size = Pt(13)
    r_desc_t.font.color.rgb = RGBColor(0, 0, 0)
    format_para(p_desc_fig, font_name="Times New Roman", font_size=13, align=WD_ALIGN_PARAGRAPH.JUSTIFY,
                space_before=2, space_after=6, line_spacing=1.3)

    # 6. CẬP NHẬT CÁC HÌNH VẼ TIẾP THEO TRONG CHƯƠNG 3
    # Hình 3.1 cũ (Sequence) -> Hình 3.2
    # Hình 3.2 cũ (ERD) -> Hình 3.3
    count_renamed = 0
    for p in doc.paragraphs:
        if p.text.strip().startswith("Hình 3.1: Sơ đồ Tuần tự"):
            p.text = p.text.replace("Hình 3.1:", "Hình 3.2:")
            format_para(p, font_name="Times New Roman", font_size=13, bold=True, italic=True, align=WD_ALIGN_PARAGRAPH.CENTER)
            count_renamed += 1
            print("Cập nhật caption: Hình 3.1 -> Hình 3.2 (Sơ đồ Tuần tự)")
        elif p.text.strip().startswith("Hình 3.2: Sơ đồ Mối quan hệ Thực thể"):
            p.text = p.text.replace("Hình 3.2:", "Hình 3.3:")
            format_para(p, font_name="Times New Roman", font_size=13, bold=True, italic=True, align=WD_ALIGN_PARAGRAPH.CENTER)
            count_renamed += 1
            print("Cập nhật caption: Hình 3.2 -> Hình 3.3 (Sơ đồ ERD)")

    # 7. CẬP NHẬT DANH MỤC HÌNH VẼ Ở PHẦN ĐẦU TÀI LIỆU
    for i, p in enumerate(doc.paragraphs[:200]):
        text = p.text
        if "Hình 3.1: Sơ đồ Tuần tự" in text:
            # Thay đổi thành Hình 3.2
            # Chèn dòng mới cho Hình 3.1 phía trước!
            p_cat_31 = p.insert_paragraph_before()
            pf_cat = p_cat_31.paragraph_format
            pf_cat.space_before = Pt(2)
            pf_cat.space_after = Pt(2)
            pPr = p_cat_31._p.get_or_add_pPr()
            tabs_elem = parse_xml(f'<w:tabs {nsdecls("w")}><w:tab w:val="right" w:leader="dot" w:pos="9072"/></w:tabs>')
            pPr.append(tabs_elem)

            r1 = p_cat_31.add_run("Hình 3.1: Sơ đồ Use Case tổng quát Hệ thống Quản lý Người có công và Đánh giá Dịch vụ công")
            r1.font.name = "Times New Roman"
            r1.font.size = Pt(11)
            r1.font.color.rgb = RGBColor(0, 0, 0)
            r_tab = p_cat_31.add_run("\t")
            r_tab.font.name = "Times New Roman"
            r_page = p_cat_31.add_run("44")
            r_page.font.name = "Times New Roman"
            r_page.font.size = Pt(11)
            r_page.font.bold = True
            r_page.font.color.rgb = RGBColor(0, 0, 0)

            # Cập nhật dòng hiện tại thành Hình 3.2
            p.text = text.replace("Hình 3.1:", "Hình 3.2:").replace("	44", "	46")
            for r in p.runs:
                r.font.name = "Times New Roman"
                r.font.size = Pt(11)
                r.font.color.rgb = RGBColor(0, 0, 0)
            print("Cập nhật Danh mục hình vẽ: Chèn Hình 3.1 và sửa Hình 3.2")
        elif "Hình 3.2: Sơ đồ Mối quan hệ Thực thể" in text:
            p.text = text.replace("Hình 3.2:", "Hình 3.3:").replace("	45", "	47")
            for r in p.runs:
                r.font.name = "Times New Roman"
                r.font.size = Pt(11)
                r.font.color.rgb = RGBColor(0, 0, 0)
            print("Cập nhật Danh mục hình vẽ: Sửa Hình 3.3")

    print("Saving modified Word document...")
    doc.save(DOCX_PATH)
    print(f"Hoàn tất cập nhật tài liệu thành công: {DOCX_PATH}")

if __name__ == "__main__":
    patch_document()
