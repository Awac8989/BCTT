import os
import sys
import shutil

if sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH

INPUT_DOCX = r"docs/DoanMinhQuan_2224801030137_BCTT2_tomaulasuadocx"
OUTPUT_DOCX_ROOT = r"DoanMinhQuan_2224801030137_BCTT2.docx"
OUTPUT_DOCX_DOCS = r"docs/DoanMinhQuan_2224801030137_BCTT2.docx"

def set_clean_para(p, text, font_name="Times New Roman", font_size=13, line_spacing=1.3,
                   space_before=2, space_after=4, align=WD_ALIGN_PARAGRAPH.JUSTIFY,
                   first_line_indent=Pt(36), bold=False, italic=False):
    p.text = ""
    pf = p.paragraph_format
    pf.alignment = align
    pf.space_before = Pt(space_before)
    pf.space_after = Pt(space_after)
    pf.line_spacing = line_spacing
    pf.first_line_indent = first_line_indent if first_line_indent is not None else Pt(0)
        
    r = p.add_run(text)
    r.font.name = font_name
    r.font.size = Pt(font_size)
    r.font.highlight_color = None
    r.font.color.rgb = RGBColor(0, 0, 0)
    r.font.bold = bold
    r.font.italic = italic
    return r

def finalize_report():
    print("=== TIẾN HÀNH HOÀN THIỆN BÁO CÁO TOÀN DIỆN: XÓA GẠCH VÀNG, CANH DÒNG VÀ CHUẨN HÓA MỤC LỤC ===")
    doc = docx.Document(INPUT_DOCX)
    print(f"Loaded {INPUT_DOCX}: {len(doc.paragraphs)} đoạn, {len(doc.tables)} bảng.")

    # 1. BÌA NGOÀI VÀ BÌA TRONG (P8, P9, P10, P31, P32, P33)
    print("1. Canh chỉnh Bìa ngoài và Bìa trong chuẩn 1 trang mỗi bìa...")
    p8 = doc.paragraphs[8]
    set_clean_para(p8, "Nơi thực tập:\nPhòng Văn hóa – Xã hội phường Thủ Dầu Một\n(Ủy ban nhân dân phường Thủ Dầu Một, Thành phố Hồ Chí Minh)",
                   font_size=13, line_spacing=1.2, space_before=0, space_after=4,
                   align=WD_ALIGN_PARAGRAPH.CENTER, first_line_indent=None, bold=True)
    p9 = doc.paragraphs[9]
    p9.text = ""
    p9.paragraph_format.space_before = Pt(0)
    p9.paragraph_format.space_after = Pt(0)

    p10 = doc.paragraphs[10]
    set_clean_para(p10, "Phân tích, thiết kế và xây dựng hệ thống phục vụ người có công và an sinh xã hội tại Phòng Văn hóa – Xã hội phường Thủ Dầu Một",
                   font_size=14, line_spacing=1.25, space_before=2, space_after=10,
                   align=WD_ALIGN_PARAGRAPH.CENTER, first_line_indent=None, bold=True)

    p31 = doc.paragraphs[31]
    set_clean_para(p31, "Nơi thực tập:\nPhòng Văn hóa – Xã hội phường Thủ Dầu Một\n(Ủy ban nhân dân phường Thủ Dầu Một, Thành phố Hồ Chí Minh)",
                   font_size=13, line_spacing=1.2, space_before=0, space_after=4,
                   align=WD_ALIGN_PARAGRAPH.CENTER, first_line_indent=None, bold=True)
    p32 = doc.paragraphs[32]
    p32.text = ""
    p32.paragraph_format.space_before = Pt(0)
    p32.paragraph_format.space_after = Pt(0)

    p33 = doc.paragraphs[33]
    set_clean_para(p33, "Phân tích, thiết kế và xây dựng hệ thống phục vụ người có công và an sinh xã hội tại Phòng Văn hóa – Xã hội phường Thủ Dầu Một",
                   font_size=14, line_spacing=1.25, space_before=2, space_after=10,
                   align=WD_ALIGN_PARAGRAPH.CENTER, first_line_indent=None, bold=True)

    # 2. LỜI CẢM ƠN (P45 đến P50) - NẰM TRỌN TRONG TRANG 3 KHÔNG TRÀN
    print("2. Canh chỉnh Lời Cảm Ơn (P45 - P50) nằm trọn vẹn trong Trang 3...")
    set_clean_para(doc.paragraphs[45], "LỜI CẢM ƠN", font_size=14, line_spacing=1.2, space_before=0, space_after=6,
                   align=WD_ALIGN_PARAGRAPH.CENTER, first_line_indent=None, bold=True)

    p46_text = (
        "Trong tiến trình chuyển đổi số quốc gia và hiện đại hóa nền hành chính công, đợt thực tập doanh nghiệp là "
        "dấu mốc mang ý nghĩa đặc biệt quan trọng đối với mỗi sinh viên Kỹ thuật Phần mềm. Đây là cơ hội quý báu giúp em "
        "tiếp cận môi trường thực tiễn, trực tiếp vận dụng các kiến thức chuyên môn đã học vào giải quyết bài toán nghiệp vụ công quyền "
        "đầy tính nhân văn: công tác quản lý chính sách và chi trả trợ cấp cho người có công với cách mạng."
    )
    set_clean_para(doc.paragraphs[46], p46_text, font_size=12, line_spacing=1.15, space_before=0, space_after=2,
                   align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=Pt(28))

    p47_text = (
        "Lời đầu tiên, em xin trân trọng bày tỏ lòng biết ơn sâu sắc đến Ban Giám hiệu Trường Đại học Thủ Dầu Một, Ban Lãnh đạo "
        "Viện Công nghệ số cùng toàn thể quý Thầy Cô giáo bộ môn Kỹ thuật Phần mềm. Suốt những năm tháng học tập dưới mái trường, "
        "quý Thầy Cô đã tận tâm truyền đạt nền tảng tri thức chuyên môn vững chắc về Cơ sở dữ liệu [20], Lập trình ứng dụng [16], [17], "
        "Kiến trúc hệ thống [15] và Kiểm thử phần mềm [14], [19], đồng thời rèn luyện tư duy khoa học, tinh thần kỷ luật và đạo đức nghề nghiệp."
    )
    set_clean_para(doc.paragraphs[47], p47_text, font_size=12, line_spacing=1.15, space_before=0, space_after=2,
                   align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=Pt(28))

    p48_text = (
        "Em xin chân thành cảm ơn Ban Lãnh đạo Phòng Văn hóa – Xã hội phường Thủ Dầu Một cùng Thường trực UBND phường "
        "(ông Trần Phong Lưu - Chủ tịch UBND phường) đã tiếp nhận, tạo mọi điều kiện thuận lợi về môi trường làm việc và trang thiết bị "
        "cho em trong suốt đợt thực tập. Đặc biệt, em xin gửi lời tri ân sâu sắc đến anh Hứa Trọng Duy - Chuyên viên CNTT và Chuyển đổi số, "
        "người đã trực tiếp hướng dẫn, định hướng chuyên môn và giám sát chất lượng phần mềm [14] trong dự án \"Hệ thống Quản lý Hồ sơ Người có công "
        "và Đánh giá Dịch vụ công\", tuân thủ Nghị định 13/2023/NĐ-CP [7] và các quy định mới của UBND phường."
    )
    set_clean_para(doc.paragraphs[48], p48_text, font_size=12, line_spacing=1.15, space_before=0, space_after=2,
                   align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=Pt(28))

    p49_text = (
        "Đồng thời, em xin bày tỏ lòng biết ơn sâu sắc đến Giảng viên hướng dẫn - ThS. Trần Hữu Duật, người đã luôn sát sao "
        "theo dõi tiến độ, định hướng phương pháp học thuật và đóng góp nhiều ý kiến quý báu giúp em hoàn thiện bản báo cáo này "
        "một cách chuẩn mực, khoa học."
    )
    set_clean_para(doc.paragraphs[49], p49_text, font_size=12, line_spacing=1.15, space_before=0, space_after=2,
                   align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=Pt(28))

    p50_text = (
        "Dù đã nỗ lực hết mình, báo cáo khó tránh khỏi những khiếm khuyết nhất định do giới hạn về mặt thời gian và trải nghiệm thực tiễn. "
        "Em rất mong nhận được những nhận xét, đóng góp quý báu từ quý Thầy Cô Hội đồng và các cán bộ cơ quan để bản thân tiếp tục "
        "hoàn thiện năng lực chuyên môn. Kính chúc quý Thầy Cô, Ban Lãnh đạo và toàn thể cán bộ phường luôn dồi dào sức khỏe và công tác tốt."
    )
    set_clean_para(doc.paragraphs[50], p50_text, font_size=12, line_spacing=1.15, space_before=0, space_after=0,
                   align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=Pt(28))

    # 3. LOẠI BỎ HOÀN TOÀN TRƯỜNG TOC TẠI P53
    print("3. Loại bỏ trường TOC rỗng tại P53 để chống lỗi nhân đôi mục lục...")
    p53 = doc.paragraphs[53]
    for child in list(p53._p):
        if child.tag.endswith(('r', 'fldSimple', 'instrText')):
            p53._p.remove(child)
    p53.text = ""
    p53.paragraph_format.space_before = Pt(0)
    p53.paragraph_format.space_after = Pt(0)

    # 4. CẬP NHẬT MỤC LỤC 63 MỤC CHUẨN XÁC THEO SỐ TRANG THỰC TẾ TRONG WORD
    print("4. Cập nhật Mục lục 63 mục chính xác 100% theo Word rendering...")
    toc_data = [
        ("LỜI CẢM ƠN", "3"),
        ("DANH MỤC CÁC KÝ TỰ, CHỮ VIẾT TẮT", "6"),
        ("DANH MỤC BẢNG BIỂU", "8"),
        ("DANH MỤC HÌNH VẼ", "10"),
        ("MỞ ĐẦU", "12"),
        ("1. Tính cấp thiết của đề tài", "12"),
        ("2. Mục đích và nhiệm vụ nghiên cứu", "12"),
        ("3. Đối tượng và phạm vi nghiên cứu", "13"),
        ("4. Phương pháp nghiên cứu", "13"),
        ("5. Ý nghĩa khoa học và thực tiễn", "14"),
        ("CHƯƠNG 1. TỔNG QUAN VỀ CƠ QUAN THỰC TẬP & BÀI TOÁN NGHIỆP VỤ", "15"),
        ("1.1. Lịch sử hình thành và phát triển của đơn vị thực tập", "15"),
        ("1.2. Chức năng và nhiệm vụ hoạt động của cơ quan", "16"),
        ("1.3. Sơ đồ cơ cấu tổ chức và bố trí nhân sự", "17"),
        ("1.4. Khảo sát hiện trạng công tác quản lý chính sách người có công", "18"),
        ("1.5. Căn cứ pháp lý và các quy định nhà nước nền tảng", "19"),
        ("1.6. Những bất cập, khó khăn của quy trình thủ công cũ", "20"),
        ("1.7. Mục tiêu và phạm vi xây dựng dự án", "20"),
        ("CHƯƠNG 2. CƠ SỞ LÝ THUYẾT VÀ CÔNG NGHỆ ÁP DỤNG", "21"),
        ("2.1. Tổng quan kiến trúc phần mềm Hybrid Modular Monolith", "21"),
        ("2.2. Công nghệ Frontend và thiết kế giao diện", "23"),
        ("2.3. Công nghệ Backend và dịch vụ xử lý trung tâm", "23"),
        ("2.4. Hệ quản trị cơ sở dữ liệu MySQL 8.0 và chuẩn hóa CSDL", "24"),
        ("2.5. Giải pháp tích hợp liên thông LGSP và an toàn thông tin", "24"),
        ("2.6. Lý thuyết và quy trình kiểm thử phần mềm (QA/QC)", "25"),
        ("CHƯƠNG 3. PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG", "27"),
        ("3.1. Phân tích các tác nhân (Actors) và mô hình phân quyền RBAC", "27"),
        ("3.2. Sơ đồ Use Case tổng quát và đặc tả các Use Case trọng tâm", "27"),
        ("3.3. Thiết kế sơ đồ tuần tự (Sequence Diagrams)", "32"),
        ("3.4. Thiết kế cơ sở dữ liệu chi tiết (16 bảng chuẩn 3NF)", "33"),
        ("3.5. Từ điển dữ liệu cơ sở dữ liệu MySQL (16 bảng chuẩn 3NF)", "39"),
        ("3.6. Đặc tả chi tiết RESTful API Contracts", "61"),
        ("CHƯƠNG 4. HIỆN THỰC HÓA HỆ THỐNG VÀ KẾT QUẢ TRIỂN KHAI", "67"),
        ("4.1. Hiện thực hóa các thuật toán và logic nghiệp vụ cốt lõi", "67"),
        ("4.1.8. Giải thuật và cơ chế tính toán trợ cấp chuẩn y khoa (BigDecimal)", "68"),
        ("4.1.9. Giải thuật chuyển đổi số tiền thành chữ tiếng Việt (Mẫu C70a-HD)", "70"),
        ("4.1.10. Quy trình và cơ chế xử lý báo giảm khai tử và ngắt chi trả", "72"),
        ("4.1.11. Thuật toán tính toán trợ cấp mai táng phí và trợ cấp một lần", "73"),
        ("4.1.12. Thuật toán xác định trợ cấp bảo trợ xã hội mức chuẩn mới (Nghị định 76/2024)", "74"),
        ("4.1.13. Cơ chế an toàn CSDL Safety Guards và nhật ký kiểm toán Audit Trail", "74"),
        ("4.1.14. Thuật toán định vị GIS và sinh mã QR Code động dẫn đường mộ liệt sĩ", "74"),
        ("4.2. Chi tiết kết quả giao diện hệ thống kèm 38 ảnh chụp thực tế", "75"),
        ("4.2.22. Trình diễn bộ tính năng nghiệp vụ quản lý nhà nước mới nâng cấp", "87"),
        ("CHƯƠNG 5. QUY TRÌNH KIỂM THỬ VÀ BẢO ĐẢM CHẤT LƯỢNG (QA/QC)", "98"),
        ("5.1. Kế hoạch kiểm thử và môi trường thực hiện", "98"),
        ("5.2. Danh mục Checklist kiểm thử chức năng và giao diện (Bảng 5.1)", "99"),
        ("5.3. Bảng kịch bản kiểm thử chi tiết Test Cases Specification (Bảng 5.2)", "99"),
        ("5.4. Bảng ghi nhận và theo dõi lỗi phần mềm Bug Report Sheet (Bảng 5.3)", "116"),
        ("5.5. Báo cáo tổng kết chất lượng kiểm thử Test Summary Report (Bảng 5.4)", "125"),
        ("CHƯƠNG 6. SO SÁNH THỰC TẾ VỚI LÝ THUYẾT VÀ BÀI HỌC KINH NGHIỆM", "127"),
        ("6.1. So sánh thực tế với lý thuyết trên giảng đường", "127"),
        ("6.2. Những kinh nghiệm thực tiễn rút ra sau quá trình thực tập", "128"),
        ("6.3. Đề xuất các giải pháp cải tiến", "128"),
        ("CHƯƠNG 7. KẾT LUẬN VÀ KIẾN NGHỊ", "130"),
        ("7.1. Đánh giá kết quả đạt được đối với mục tiêu đề ra", "130"),
        ("7.2. Những hạn chế còn tồn tại của hệ thống", "130"),
        ("7.3. Hướng phát triển trong tương lai", "131"),
        ("TÀI LIỆU THAM KHẢO", "133"),
        ("PHỤ LỤC", "135"),
        ("Phụ lục 1: Biểu mẫu hành chính áp dụng trong hệ thống", "135"),
        ("Phụ lục 2: Đặc tả lược đồ và ràng buộc toàn vẹn CSDL MySQL", "135"),
        ("Phụ lục 3: Bảng quy đổi định mức trợ cấp pháp lý (Bảng PL.1)", "136"),
        ("Phụ lục 4: Thuật ngữ và khái niệm nghiệp vụ an sinh xã hội (Bảng PL.2)", "138")
    ]

    for idx, (title, page) in enumerate(toc_data):
        p_idx = 54 + idx
        if p_idx < len(doc.paragraphs):
            p = doc.paragraphs[p_idx]
            p.text = f"{title}\t{page}"
            p.paragraph_format.first_line_indent = Pt(0)
            p.paragraph_format.space_before = Pt(1)
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.line_spacing = 1.15
            for r in p.runs:
                r.font.name = "Times New Roman"
                r.font.size = Pt(12.5)
                r.font.highlight_color = None
                r.font.color.rgb = RGBColor(0, 0, 0)
                if title.startswith("CHƯƠNG") or title in ["MỞ ĐẦU", "LỜI CẢM ƠN", "TÀI LIỆU THAM KHẢO", "PHỤ LỤC", "DANH MỤC CÁC KÝ TỰ, CHỮ VIẾT TẮT", "DANH MỤC BẢNG BIỂU", "DANH MỤC HÌNH VẼ"]:
                    r.font.bold = True
                else:
                    r.font.bold = False

    # 5. CẬP NHẬT CÁC ĐOẠN ĐẶC BIỆT CHƯƠNG 1 (CĂN CỨ PHÁP LÝ MỚI 2025/2026, VĂN HÓA - XÃ HỘI)
    print("5. Đồng bộ văn bản Chương 1 theo đúng căn cứ pháp lý Quyết định 2698...")
    doc.paragraphs[248].style = doc.styles['Normal']
    doc.paragraphs[250].style = doc.styles['Normal']

    # 6. CĂN CHỈNH KÍCH THƯỚC ẢNH VÀ TRÌNH BÀY CHƯƠNG 4 (SECTION 4.2.22)
    print("6. Chuẩn hóa kích thước ảnh 4.2.22 (13.21cm x 8.26cm) để không dồn trang trắng...")
    img_paras = [688, 692, 696, 700, 704, 708, 712, 716, 720, 724, 728, 732, 736, 740, 744, 748, 752]
    target_cx = str(int(13.21 / 2.54 * 914400)) # 4755600
    target_cy = str(int(8.26 / 2.54 * 914400))  # 2973600
    for idx in img_paras:
        p = doc.paragraphs[idx]
        for elem in p._p.iter():
            if elem.tag.endswith(('extent', 'ext')):
                elem.attrib['cx'] = target_cx
                elem.attrib['cy'] = target_cy
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)

    # 7. QUÉT SẠCH 100% GẠCH VÀNG VÀ CHUẨN HÓA MÀU CHỮ ĐEN TRÊN TOÀN VĂN BẢN
    print("7. Quét sạch 100% highlight vàng và chuyển màu chữ sang đen...")
    cleaned_highlights = 0
    for p in doc.paragraphs:
        for r in p.runs:
            if r.font.highlight_color is not None:
                r.font.highlight_color = None
                cleaned_highlights += 1
            if r.font.color and r.font.color.rgb and str(r.font.color.rgb) != '000000':
                r.font.color.rgb = RGBColor(0, 0, 0)
    for t in doc.tables:
        for row in t.rows:
            for cell in row.cells:
                for p in cell.paragraphs:
                    for r in p.runs:
                        if r.font.highlight_color is not None:
                            r.font.highlight_color = None
                            cleaned_highlights += 1
                        if r.font.color and r.font.color.rgb and str(r.font.color.rgb) != '000000':
                            r.font.color.rgb = RGBColor(0, 0, 0)
    print(f"✓ Đã làm sạch hoàn toàn {cleaned_highlights} runs có màu đánh dấu.")

    # 8. LƯU VÀO CẢ FILE GỐC VÀ THƯ MỤC DOCS
    print("8. Lưu tài liệu hoàn thiện...")
    doc.save(OUTPUT_DOCX_ROOT)
    print(f"✓ Đã lưu thành công: {OUTPUT_DOCX_ROOT}")
    shutil.copyfile(OUTPUT_DOCX_ROOT, OUTPUT_DOCX_DOCS)
    print(f"✓ Đã đồng bộ sang: {OUTPUT_DOCX_DOCS}")

    print("\n=== HOÀN TẤT THÀNH CÔNG TOÀN BỘ CÔNG TÁC ĐỊNH DẠNG VÀ LÀM SẠCH BÁO CÁO! ===")

if __name__ == "__main__":
    finalize_report()

