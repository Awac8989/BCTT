import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

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

def set_cell_margins(cell, top=60, bottom=60, left=80, right=80):
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
        shading = parse_xml(f'<w:shd {nsdecls("w")} w:fill="F1F5F9"/>')
        cell._tc.get_or_add_tcPr().append(shading)
        if width:
            cell.width = width

def update_docx_content():
    print("Loading document...")
    doc = docx.Document(DOCX_PATH)

    # 1. CẬP NHẬT TRỰC TIẾP DỮ LIỆU ẢNH TRONG DOCX CHO HÌNH 3.1
    # Tìm paragraph chứa ảnh Hình 3.1
    img_updated = False
    for i, p in enumerate(doc.paragraphs):
        if i + 1 < len(doc.paragraphs) and doc.paragraphs[i + 1].text.strip().startswith("Hình 3.1: Sơ đồ Use Case"):
            # p chính là paragraph chứa ảnh
            for r in p.runs:
                blip = r._r.xpath('.//a:blip/@r:embed')
                if blip:
                    rId = blip[0]
                    rel = doc.part.rels[rId]
                    print(f"Cập nhật binary của ảnh {rel.target_ref} (rId: {rId})...")
                    with open(DIAGRAM_PATH, "rb") as f_img:
                        rel.target_part._blob = f_img.read()
                    img_updated = True
                    break
        if img_updated:
            break

    if not img_updated:
        print("Warning: Không tìm thấy image part của Hình 3.1 bằng rId, sẽ tiến hành kiểm tra lại!")

    # 2. TÌM VỊ TRÍ CÁC ĐOẠN VĂN MỤC 3.2 ĐỂ VIẾT LẠI NỘI DUNG NGHIỆP VỤ LIÊN HOÀN
    # Tìm đoạn P350 bắt đầu bằng "Để hiện thực hóa toàn diện" đến trước "3.3. SƠ ĐỒ TUẦN TỰ"
    p_start_idx = None
    p_end_idx = None
    for i, p in enumerate(doc.paragraphs):
        if p.text.strip().startswith("Để hiện thực hóa toàn diện"):
            p_start_idx = i
        elif p.text.strip().startswith("3.3. SƠ ĐỒ TUẦN TỰ"):
            p_end_idx = i
            break

    print(f"Khoảng văn bản Mục 3.2 cần cập nhật nghiệp vụ: từ Paragraph {p_start_idx} đến {p_end_idx}")

    # Xóa các đoạn văn cũ trong khoảng (từ p_start_idx đến trước p_end_idx, ngoại trừ bảng và ảnh)
    # Thay vì xóa phức tạp gây lệch XML, ta viết lại text trực tiếp vào các paragraphs hiện hữu và bổ sung
    
    # 3. NỘI DUNG VIẾT NGHIỆP VỤ "CHÉM GIÓ" CHUẨN XÁC, SÂU SẮC, LIÊN KẾT CHẶT CHẼ
    business_text_1 = (
        "Khác với các hệ thống phân tán rời rạc, mô hình Use Case tổng thể của Hệ thống Quản lý Người có công "
        "được thiết kế nguyên khối thống nhất trong một ranh giới hệ thống duy nhất (System Boundary). "
        "Mô hình phản ánh chu trình liên thông 5 mắt xích nghiệp vụ hành chính công khép kín giữa các cấp chính quyền "
        "(từ UBND phường/xã, Phòng LĐ-TB&XH thành phố đến Ban Giám đốc Sở) theo đúng tinh thần Pháp lệnh Ưu đãi người có công số 02/2020/UBTVQH14, "
        "Nghị định số 131/2021/NĐ-CP, Nghị định số 75/2021/NĐ-CP, Nghị định số 61/2018/NĐ-CP và Đề án 06/CP của Thủ tướng Chính phủ:"
    )

    lifecycle_steps = [
        "1. Mắt xích 1 - Tiếp nhận và Số hóa đầu vào Một cửa (Cán bộ Một cửa & Công dân): Người dân đến giao dịch nộp hồ sơ tại bộ phận Một cửa cấp phường/xã. Cán bộ tiếp nhận kiểm tra thành phần giấy tờ, sử dụng công nghệ AI OCR bóc tách dữ liệu số hóa các văn bản kháng chiến cũ bị ố mờ, cấp mã định danh hồ sơ duy nhất và in Giấy hẹn Mẫu số 01 tích hợp mã QR Code tra cứu. Mọi thông tin sau đó được liên thông trực tuyến lên cấp trên mà không cần chuyển giao hồ sơ giấy vật lý.",
        "2. Mắt xích 2 - Thẩm định y khoa và Tự động hóa tính toán tài chính (Chuyên viên Thẩm định): Chuyên viên Phòng LĐ-TB&XH thực hiện quy trình thẩm định hồ sơ y khoa 5 bước nghiêm ngặt. Khi hồ sơ thỏa mãn các điều kiện pháp lý, hệ thống bắt buộc kích hoạt Financial Core Engine tự động tính toán định mức trợ cấp ưu đãi theo mức chuẩn 2.055.000 đồng (Nghị định 75/2021/NĐ-CP và Nghị định 55/2023/NĐ-CP). Thuật toán áp dụng lớp toán học BigDecimal và chế độ làm tròn nửa lên (HALF_UP), triệt tiêu hoàn toàn sai số làm tròn số học và ngăn chặn sự can thiệp chủ quan của con người.",
        "3. Mắt xích 3 - Ký số điện tử công vụ và Phê duyệt liên thông (Lãnh đạo Phòng / Sở): Sau khi hoàn tất thẩm định và tính toán tự động, hệ thống tự động lập dự thảo Quyết định hưởng trợ cấp và khởi tạo luồng trình duyệt (<<include>> Trình phê duyệt). Lãnh đạo thẩm tra toàn bộ hồ sơ điện tử và thực hiện ký số PKI SmartCA có gắn dấu thời gian Timestamp. Quyết định hành chính sau khi ký số mang giá trị pháp lý tối cao và lập tức chuyển trạng thái hồ sơ sang 'Đã duyệt' trên toàn hệ thống.",
        "4. Mắt xích 4 - Quản lý chi trả định kỳ và Đối soát tự động ngân hàng (Cán bộ Kế toán / Chi trả): Quyết định đã ký số tự động đổ về phân hệ Tài chính - Kế toán để lập danh sách phát tiền hàng tháng và xuất Phiếu chi Mẫu C70a-HD tích hợp mã vạch (Thông tư số 101/2018/TT-BTC). Phân hệ được mở rộng (<<extend>>) với tính năng Đối soát tự động sao kê ngân hàng (Bank Reconciliation) thông qua mã số an sinh xã hội, bảo đảm tiền đến tận tay người thụ hưởng, khớp đúng 100% dòng tiền ngân sách và loại trừ nguy cơ chi nhầm.",
        "5. Mắt xích 5 - Giám sát CSAT thời gian thực và Minh bạch hóa dịch vụ công (Công dân & Lãnh đạo): Công dân chủ động dùng số CCCD tra cứu tiến độ hồ sơ và lịch phát tiền tại nhà (thông tin được che 3 số bảo mật theo Nghị định 13/2023/NĐ-CP). Tại sảnh Một cửa, công dân trực tiếp đánh giá chất lượng phục vụ trên màn hình cảm ứng Kiosk (1-5 sao theo 4 tiêu chí SIPAS của Bộ Nội vụ). Dữ liệu đánh giá được truyền trực tiếp thời gian thực (<<include>> Realtime CSAT) lên Biểu đồ Radar SIPAS trên Dashboard Lãnh đạo, kích hoạt cảnh báo sớm nếu phát sinh phản hồi bức xúc để kịp thời chấn chỉnh tác phong cán bộ.",
        "6. Cơ chế Báo giảm và Giải quyết chế độ Mai táng phí (Chế độ tử tuất - Nghị định 131/2021/NĐ-CP): Khi có đối tượng từ trần, thân nhân đến báo giảm tại Một cửa -> Hệ thống tự động khóa sổ chi trả hàng tháng để ngăn chặn thất thoát ngân sách -> Tự động kích hoạt (<<include>>) thủ tục ban hành Quyết định trợ cấp Mai táng phí Mẫu số 02 với định mức luật định bằng 10 tháng mức chuẩn (tương đương 20.550.000 VNĐ) để kế toán thực hiện giải ngân một lần cho thân nhân.",
    ]

    # Cập nhật P350
    doc.paragraphs[p_start_idx].text = business_text_1
    format_para(doc.paragraphs[p_start_idx], font_name="Times New Roman", font_size=13, align=WD_ALIGN_PARAGRAPH.JUSTIFY)

    # Cập nhật P351 đến P356
    for idx, step_txt in enumerate(lifecycle_steps):
        p_curr = doc.paragraphs[p_start_idx + 1 + idx]
        p_curr.text = step_txt
        format_para(p_curr, font_name="Times New Roman", font_size=13, align=WD_ALIGN_PARAGRAPH.JUSTIFY)

    # Cập nhật Bảng ma trận Use Case (Table 28)
    for t in doc.tables:
        if len(t.rows) > 10 and t.rows[0].cells[0].text.strip() == "Mã UC":
            print(f"Cập nhật nội dung bảng Use Case ({len(t.rows)} dòng)...")
            table_new_data = [
                ("UC-01", "Tiếp nhận hồ sơ mới & Cấp mã định danh", "Một cửa cấp Phường", "Cán bộ Một cửa", "Cơ bản"),
                ("UC-01a", "In Giấy hẹn tiếp nhận Mẫu 01 (có QR Code)", "Một cửa cấp Phường", "Cán bộ Một cửa", "<<include>> UC-01"),
                ("UC-02", "Số hóa tài liệu hồ sơ cũ (AI OCR Scan)", "Một cửa cấp Phường", "Cán bộ Một cửa", "<<extend>> UC-01"),
                ("UC-03", "Thẩm định hồ sơ y khoa 5 bước Một cửa", "Thẩm định TP. TDM", "Chuyên viên Thẩm định", "Cơ bản"),
                ("UC-03a", "Tự động tính trợ cấp ưu đãi (NĐ 75/2021)", "Core Financial Engine", "Financial Engine", "<<include>> UC-03"),
                ("UC-04", "Ký số điện tử PKI SmartCA phê duyệt QĐ", "Lãnh đạo Phòng / Sở", "Lãnh đạo Phê duyệt", "Cơ bản (từ UC-03)"),
                ("UC-05", "Lập danh sách chi trả & In Phiếu chi C70a-HD", "Tài chính - Kế toán", "Kế toán / Chi trả", "Cơ bản (từ UC-04)"),
                ("UC-05a", "Đối soát tự động sao kê tài khoản ngân hàng", "Tài chính - Kế toán", "Kế toán / Chi trả", "<<extend>> UC-05"),
                ("UC-06", "Tiếp nhận báo giảm từ trần (Cắt chế độ)", "Một cửa cấp Phường", "Cán bộ Một cửa", "Cơ bản"),
                ("UC-06a", "Ban hành Quyết định Mai táng phí Mẫu 02", "Tài chính - Kế toán", "Kế toán / Thẩm định", "<<include>> UC-06"),
                ("UC-07", "Quản lý điều dưỡng & Cấp dụng cụ chỉnh hình", "Quản lý chính sách", "Chuyên viên Thẩm định", "Cơ bản"),
                ("UC-08", "Tra cứu tiến độ hồ sơ & Lịch phát tiền CCCD", "Cổng Dịch vụ công", "Công dân / Thân nhân", "Cơ bản"),
                ("UC-09", "Đánh giá dịch vụ công tại Kiosk (1-5 sao)", "Kiosk sảnh Một cửa", "Công dân / Thân nhân", "Cơ bản"),
                ("UC-09a", "Góp ý nhận xét tự do (AI phân tích cảm xúc)", "Kiosk sảnh Một cửa", "Công dân / Thân nhân", "<<extend>> UC-09"),
                ("UC-10", "Dashboard điều hành & Giám sát Radar SIPAS", "Trung tâm điều hành", "Lãnh đạo Phê duyệt", "<<include>> (từ UC-09)"),
                ("UC-11", "Bản đồ số không gian GIS định vị mộ Liệt sĩ", "Bản đồ số GIS", "Công dân, Quản trị viên", "Cơ bản"),
                ("UC-12", "Cấu hình định mức chuẩn & Phân quyền RBAC", "Quản trị Hệ thống", "Quản trị viên Hệ thống", "Cơ bản"),
            ]
            
            # Nếu số dòng bảng hiện tại nhiều hơn, ta cập nhật lại bảng cho gọn gàng, chuẩn xác
            # Cập nhật các hàng đầu
            for r_i, r_data in enumerate(table_new_data):
                if r_i + 1 < len(t.rows):
                    row = t.rows[r_i + 1]
                    for c_i, val in enumerate(r_data):
                        cell = row.cells[c_i]
                        p_c = cell.paragraphs[0]
                        p_c.text = val
                        p_c.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_i in [0, 4] else WD_ALIGN_PARAGRAPH.LEFT
                        for r in p_c.runs:
                            r.font.name = "Times New Roman"
                            r.font.size = Pt(9.5)
                            r.font.bold = (c_i == 0)
                            r.font.color.rgb = RGBColor(0, 0, 0)
            
            # Xóa các dòng thừa nếu có
            if len(t.rows) > len(table_new_data) + 1:
                for r_del in range(len(t.rows) - 1, len(table_new_data), -1):
                    row_elem = t.rows[r_del]._tr
                    row_elem.getparent().remove(row_elem)
            print(f"Đã tinh chỉnh bảng Use Case chuẩn 17 dòng cốt lõi (Table rows: {len(t.rows)}).")
            break

    # Cập nhật đoạn phân tích kỹ thuật sau Hình 3.1
    for i, p in enumerate(doc.paragraphs):
        if p.text.strip().startswith("* Phân tích chức năng và giải pháp kỹ thuật:"):
            tech_desc = (
                "* Phân tích chức năng và giải pháp kỹ thuật: Sơ đồ Use Case tổng thể mô hình hóa trọn vẹn "
                "mối quan hệ tương hỗ giữa 6 nhóm tác nhân trong toàn bộ vòng đời hồ sơ an sinh xã hội. "
                "Thay vì phân mảnh thành các khối biệt lập, ranh giới hệ thống (System Boundary) bao quát quy trình nghiệp vụ "
                "theo dòng chảy thông tin tuyến tính kết hợp đa luồng: từ Tiếp nhận số hóa (Một cửa) -> "
                "Thẩm định y khoa & Tự động áp giá trợ cấp (Chuyên viên) -> Phê duyệt ký số PKI SmartCA (Lãnh đạo) -> "
                "Giải ngân chi trả & Đối soát ngân hàng (Kế toán). Mọi tương tác của người dân tại cổng dịch vụ công trực tuyến "
                "và màn hình cảm ứng Kiosk được kết nối trực tiếp theo thời gian thực (Real-time Integration) với Dashboard giám sát của Lãnh đạo, "
                "bảo đảm tính minh bạch, sự chính xác của số liệu kế toán và nâng cao chỉ số phục vụ hành chính công đô thị."
            )
            p.text = tech_desc
            format_para(p, font_name="Times New Roman", font_size=13, align=WD_ALIGN_PARAGRAPH.JUSTIFY)
            print("Đã cập nhật đoạn Phân tích chức năng và giải pháp kỹ thuật của Hình 3.1.")
            break

    print("Saving updated Word document...")
    doc.save(DOCX_PATH)
    print(f"Lưu thành công tài liệu: {DOCX_PATH}")

    # Đồng bộ sang thư mục gốc
    root_copy = r"q:\CODE_visual\filebctt\DoanMinhQuan_2224801030137_BCTT2.docx"
    import shutil
    shutil.copy2(DOCX_PATH, root_copy)
    print(f"Đã đồng bộ sang file gốc: {root_copy}")

if __name__ == "__main__":
    update_docx_content()
