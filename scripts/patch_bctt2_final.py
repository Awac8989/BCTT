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
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_COLOR_INDEX

# Lấy nguồn chuẩn từ file gốc do người dùng tải lên có đánh dấu tô màu
INPUT_DOCX = r"docs/DoanMinhQuan_2224801030137_BCTT2_tomaulasuadocx"
OUTPUT_DOCX_ROOT = r"DoanMinhQuan_2224801030137_BCTT2.docx"
OUTPUT_DOCX_DOCS = r"docs/DoanMinhQuan_2224801030137_BCTT2.docx"

def set_para_runs(p, runs_data, font_name="Times New Roman", font_size=13, line_spacing=1.3,
                  space_before=2, space_after=4, align=WD_ALIGN_PARAGRAPH.JUSTIFY,
                  first_line_indent=Pt(36), bold_all=False):
    """
    runs_data: list of tuples (text, is_highlighted)
    is_highlighted: True -> tô nền vàng (WD_COLOR_INDEX.YELLOW) + chữ xanh navy đậm (RGB: 0, 32, 96) + bold
    is_highlighted: False -> chữ đen chuẩn (RGB: 0, 0, 0)
    """
    p.text = ""  # Xóa các runs cũ
    pf = p.paragraph_format
    pf.alignment = align
    pf.space_before = Pt(space_before)
    pf.space_after = Pt(space_after)
    pf.line_spacing = line_spacing
    if first_line_indent is not None:
        pf.first_line_indent = first_line_indent
    else:
        pf.first_line_indent = Pt(0)
        
    for text, is_hl in runs_data:
        r = p.add_run(text)
        r.font.name = font_name
        r.font.size = Pt(font_size)
        if is_hl:
            r.font.highlight_color = WD_COLOR_INDEX.YELLOW
            r.font.color.rgb = RGBColor(0, 32, 96)  # Dark Blue
            r.font.bold = True
        else:
            r.font.color.rgb = RGBColor(0, 0, 0)
            r.font.bold = bold_all

def main():
    print("=== TIẾN HÀNH CẬP NHẬT TOÀN DIỆN BCTT2 THEO 2 FILE PDF DỰ THẢO VÀ TÔ MÀU CHỈNH SỬA ===")
    
    if not os.path.exists(INPUT_DOCX):
        print(f"LỖI: Không tìm thấy file {INPUT_DOCX}")
        sys.exit(1)
        
    doc = docx.Document(INPUT_DOCX)
    print(f"Loaded {INPUT_DOCX} thành công ({len(doc.paragraphs)} đoạn, {len(doc.tables)} bảng).")

    # -------------------------------------------------------------------------
    # 1. BÌA NGOÀI VÀ BÌA TRONG (P8, P9, P10, P31, P32, P33)
    # -------------------------------------------------------------------------
    print("1. Cập nhật Trang bìa ngoài & Bìa trong...")
    p8 = doc.paragraphs[8]
    set_para_runs(p8, [
        ("Nơi thực tập:\n", False),
        ("Phòng Văn hóa – Xã hội phường Thủ Dầu Một", True),
        ("\n(Ủy ban nhân dân phường Thủ Dầu Một, Thành phố Hồ Chí Minh)", True)
    ], font_size=13, line_spacing=1.3, space_before=0, space_after=6, align=WD_ALIGN_PARAGRAPH.CENTER, first_line_indent=None, bold_all=True)

    p9 = doc.paragraphs[9]
    p9.text = "" # Xóa trắng đoạn 9 cũ nếu bị thừa
    p9.paragraph_format.space_before = Pt(0)
    p9.paragraph_format.space_after = Pt(0)

    p10 = doc.paragraphs[10]
    set_para_runs(p10, [
        ("Phân tích, thiết kế và xây dựng hệ thống phục vụ người có công và an sinh xã hội tại ", False),
        ("Phòng Văn hóa – Xã hội phường Thủ Dầu Một", True)
    ], font_size=14, line_spacing=1.3, space_before=4, space_after=12, align=WD_ALIGN_PARAGRAPH.CENTER, first_line_indent=None, bold_all=True)

    p31 = doc.paragraphs[31]
    set_para_runs(p31, [
        ("Nơi thực tập:\n", False),
        ("Phòng Văn hóa – Xã hội phường Thủ Dầu Một", True),
        ("\n(Ủy ban nhân dân phường Thủ Dầu Một, Thành phố Hồ Chí Minh)", True)
    ], font_size=13, line_spacing=1.3, space_before=0, space_after=6, align=WD_ALIGN_PARAGRAPH.CENTER, first_line_indent=None, bold_all=True)

    p32 = doc.paragraphs[32]
    p32.text = ""
    p32.paragraph_format.space_before = Pt(0)
    p32.paragraph_format.space_after = Pt(0)

    p33 = doc.paragraphs[33]
    set_para_runs(p33, [
        ("Phân tích, thiết kế và xây dựng hệ thống phục vụ người có công và an sinh xã hội tại ", False),
        ("Phòng Văn hóa – Xã hội phường Thủ Dầu Một", True)
    ], font_size=14, line_spacing=1.3, space_before=4, space_after=12, align=WD_ALIGN_PARAGRAPH.CENTER, first_line_indent=None, bold_all=True)

    # -------------------------------------------------------------------------
    # 2. LỜI CẢM ƠN (P48) - BẢO ĐẢM VẪN NẰM TRỌN TRONG TRANG 3
    # -------------------------------------------------------------------------
    print("2. Cập nhật Lời Cảm Ơn (P48)...")
    p48 = doc.paragraphs[48]
    set_para_runs(p48, [
        ("Em xin chân thành cảm ơn Ban Lãnh đạo ", False),
        ("Phòng Văn hóa – Xã hội phường Thủ Dầu Một", True),
        (" cùng Chủ tịch UBND phường (ông ", False),
        ("Trần Phong Lưu", True),
        (") đã tin tưởng tiếp nhận và tạo mọi điều kiện thuận lợi nhất về môi trường làm việc, trang thiết bị kỹ thuật cho em trong suốt thời gian 03 tháng thực tập. Đặc biệt, em xin gửi lời tri ân chân thành đến anh ", False),
        ("Hứa Trọng Duy", True),
        (" - Chuyên viên phụ trách Công nghệ thông tin và Chuyển đổi số tại cơ quan, người đã trực tiếp hướng dẫn, tận tình chia sẻ những bài học kinh nghiệm quý giá về phân tích quy trình công vụ, giám sát chất lượng phần mềm [14] và định hướng chuyên môn để em hoàn thành tốt các hạng mục công việc trong dự án \"Hệ thống Quản lý Hồ sơ Người có công và Đánh giá Dịch vụ công\", tuân thủ nghiêm ngặt quy định bảo mật an toàn thông tin dữ liệu công dân theo Nghị định 13/2023/NĐ-CP [7] và các quy định mới của UBND phường.", False)
    ], font_size=12.5, line_spacing=1.18, space_before=0, space_after=2.5, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=Pt(36))

    # -------------------------------------------------------------------------
    # 3. DANH MỤC HÌNH VẼ (P154)
    # -------------------------------------------------------------------------
    print("3. Cập nhật Danh mục Hình vẽ...")
    doc.paragraphs[154].text = "Hình 1.1: Trụ sở Ủy ban nhân dân và Phòng Văn hóa – Xã hội phường Thủ Dầu Một (Số 1 Quang Trung)\t32"
    doc.paragraphs[155].text = "Hình 1.2: Sơ đồ cơ cấu tổ chức Phòng Văn hóa – Xã hội phường Thủ Dầu Một\t34"

    # -------------------------------------------------------------------------
    # 4. PHẦN MỞ ĐẦU (P205, P211, P215, P223)
    # -------------------------------------------------------------------------
    print("4. Cập nhật Phần Mở đầu...")
    p205 = doc.paragraphs[205]
    set_para_runs(p205, [
        ("Chăm lo đời sống vật chất và tinh thần cho người có công với cách mạng là chủ trương nhất quán, thể hiện truyền thống đạo lý \"Uống nước nhớ nguồn\" tốt đẹp của dân tộc ta. Trên địa bàn ", False),
        ("phường Thủ Dầu Một nói riêng và Thành phố Hồ Chí Minh nói chung", True),
        (", số lượng đối tượng thụ hưởng chính sách an sinh xã hội hiện nay lên tới hàng nghìn trường hợp, gồm Mẹ Việt Nam Anh hùng, Thương binh, Bệnh binh, Thân nhân Liệt sĩ, Người hoạt động kháng chiến bị nhiễm chất độc hóa học và các đối tượng bảo trợ xã hội.", False)
    ], font_size=13, line_spacing=1.3, space_before=2, space_after=4, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=Pt(36))

    p211 = doc.paragraphs[211]
    set_para_runs(p211, [
        ("Xuất phát từ yêu cầu thực tiễn nêu trên, đề tài \"Phân tích, thiết kế và xây dựng hệ thống phục vụ người có công và an sinh xã hội tại ", False),
        ("Phòng Văn hóa – Xã hội phường Thủ Dầu Một", True),
        ("\" (Hệ thống Quản lý Hồ sơ Người có công và Đánh giá Dịch vụ công) được lựa chọn nghiên cứu và triển khai nhằm cung cấp một giải pháp phần mềm toàn diện, số hóa trọn vẹn quy trình quản trị, tự động hóa tính toán tài chính và phục vụ nhân dân ngày một tốt hơn.", False)
    ], font_size=13, line_spacing=1.3, space_before=2, space_after=4, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=Pt(36))

    p215 = doc.paragraphs[215]
    set_para_runs(p215, [
        ("-\tKhảo sát thực tế cơ cấu tổ chức, chức năng nhiệm vụ, quy trình tiếp nhận và thẩm định hồ sơ người có công tại ", False),
        ("Phòng Văn hóa – Xã hội phường Thủ Dầu Một, TP. Hồ Chí Minh", True),
        (".", False)
    ], font_size=13, line_spacing=1.3, space_before=2, space_after=3, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=Pt(36))

    p223 = doc.paragraphs[223]
    set_para_runs(p223, [
        ("-\tPhạm vi nghiên cứu và ứng dụng: Thử nghiệm thực tế tại Bộ phận Một cửa và Bộ phận Chuyển đổi số thuộc ", False),
        ("Phòng Văn hóa – Xã hội phường Thủ Dầu Một (địa chỉ: Số 1 đường Quang Trung, phường Thủ Dầu Một, Thành phố Hồ Chí Minh)", True),
        (", phục vụ công tác quản lý an sinh xã hội trên địa bàn phường.", False)
    ], font_size=13, line_spacing=1.3, space_before=2, space_after=3, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=Pt(36))

    # -------------------------------------------------------------------------
    # 5. CHƯƠNG 1: TỔNG QUAN VỀ CƠ QUAN THỰC TẬP & BÀI TOÁN NGHIỆP VỤ
    # -------------------------------------------------------------------------
    print("5. Viết lại Chương 1 bám sát 2 file PDF dự thảo và tô màu chỉnh sửa...")
    
    # 5.1. Mục 1.1: Lịch sử hình thành và phát triển của đơn vị thực tập (P235, P236, P238)
    p235 = doc.paragraphs[235]
    set_para_runs(p235, [
        ("Phòng Văn hóa – Xã hội phường Thủ Dầu Một", True),
        (" là cơ quan chuyên môn thuộc ", False),
        ("Ủy ban nhân dân phường Thủ Dầu Một, Thành phố Hồ Chí Minh", True),
        (" (trụ sở đặt tại: ", False),
        ("Số 1 đường Quang Trung, phường Thủ Dầu Một, Thành phố Hồ Chí Minh", True),
        ("). Cơ quan được thành lập và kiện toàn tổ chức bộ máy trên cơ sở triển khai mô hình chính quyền địa phương 02 cấp theo quy định của ", False),
        ("Luật Tổ chức Chính quyền địa phương ngày 16 tháng 6 năm 2025", True),
        (" và ", False),
        ("Nghị định số 150/2025/NĐ-CP ngày 12 tháng 6 năm 2025 của Chính phủ", True),
        (" quy định tổ chức các cơ quan chuyên môn thuộc UBND cấp tỉnh và UBND cấp xã, phường, đặc khu thuộc thành phố trực thuộc trung ương; thực hiện theo hướng dẫn tại ", False),
        ("Công văn số 2892/UBND-VX ngày 14 tháng 10 năm 2025 của UBND thành phố Hồ Chí Minh", True),
        (" và ", False),
        ("Nghị quyết số 03/NQ-HĐND ngày 01 tháng 7 năm 2025 của Hội đồng nhân dân phường Thủ Dầu Một", True),
        (" về việc thành lập Phòng Văn hóa – Xã hội phường Thủ Dầu Một.", False)
    ], font_size=13, line_spacing=1.3, space_before=2, space_after=4, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=Pt(36))

    p236 = doc.paragraphs[236]
    set_para_runs(p236, [
        ("Về vị trí pháp lý, căn cứ ", False),
        ("Quyết định số 2698/QĐ-UBND ngày 03 tháng 11 năm 2025 của Ủy ban nhân dân phường Thủ Dầu Một", True),
        (" do Chủ tịch UBND phường ", False),
        ("Trần Phong Lưu", True),
        (" ký ban hành (thay thế Quyết định số 2370/QĐ-UBND ngày 19/9/2025), Phòng Văn hóa – Xã hội là cơ quan chuyên môn thuộc UBND phường, chịu sự chỉ đạo, quản lý trực tiếp và toàn diện về tổ chức bộ máy, vị trí việc làm, biên chế công chức và công tác của ", False),
        ("Ủy ban nhân dân phường Thủ Dầu Một", True),
        ("; đồng thời chịu sự chỉ đạo, kiểm tra, hướng dẫn về chuyên môn nghiệp vụ của các Sở chuyên ngành thuộc UBND Thành phố (Sở Nội vụ, Sở Lao động - Thương binh và Xã hội, Sở Y tế, Sở Văn hóa - Thể thao, Sở Giáo dục và Đào tạo, Sở Khoa học và Công nghệ). Phòng có con dấu riêng để thực hiện nhiệm vụ được giao theo ", False),
        ("Nghị quyết số 190/NQ-CP ngày 26 tháng 6 năm 2025 của Chính phủ", True),
        (" về con dấu của cơ quan chuyên môn thuộc UBND cấp xã, phường. Trong xu thế xây dựng đô thị thông minh và chuyển đổi số, Phòng Văn hóa – Xã hội giữ vai trò nòng cốt tham mưu vận hành hạ tầng chính quyền số cấp cơ sở, tích hợp dữ liệu dân cư theo Đề án 06/CP và chuẩn hóa quy trình giải quyết thủ tục hành chính công trực tuyến.", False)
    ], font_size=13, line_spacing=1.3, space_before=2, space_after=4, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=Pt(36))

    # Caption Hình 1.1
    p238 = doc.paragraphs[238]
    p238.text = "Hình 1.1: Trụ sở Ủy ban nhân dân và Phòng Văn hóa – Xã hội phường Thủ Dầu Một (Số 1 Quang Trung)"

    # 5.2. Mục 1.2: Chức năng và nhiệm vụ hoạt động của cơ quan (P240 - P253)
    p240 = doc.paragraphs[240]
    p240.text = "1.2. CHỨC NĂNG VÀ NHIỆM VỤ HOẠT ĐỘNG CỦA CƠ QUAN"

    p241 = doc.paragraphs[241]
    p241.text = "1.2.1. Lĩnh vực Nội vụ và Quản lý Chính sách Người có công với cách mạng"

    p242 = doc.paragraphs[242]
    set_para_runs(p242, [
        ("Theo quy định tại Điều 2 và khoản 4 Điều 3 của Quy định ban hành kèm Quyết định số 2698/QĐ-UBND, Phòng Văn hóa – Xã hội tham mưu giúp UBND phường quản lý nhà nước về lĩnh vực Nội vụ, đặc biệt là ", False),
        ("nhiệm vụ trực tiếp quản lý và thực hiện chính sách đối với Người có công với cách mạng", True),
        (": hướng dẫn và tổ chức thực hiện các chính sách ưu đãi theo Pháp lệnh số 02/2020/UBTVQH14; ", False),
        ("quản lý đối tượng, hồ sơ đối tượng và kinh phí thực hiện chính sách, chế độ ưu đãi đối với người có công và thân nhân người có công trên địa bàn theo phân cấp", True),
        ("; trực tiếp quản lý các công trình ghi công liệt sĩ, mộ liệt sĩ và chủ trì phát động phong trào \"Đền ơn đáp nghĩa\".", False)
    ], font_size=13, line_spacing=1.3, space_before=2, space_after=3, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=Pt(36))

    p243 = doc.paragraphs[243]
    set_para_runs(p243, [
        ("Đồng thời, Phòng phụ trách công tác cải cách hành chính cơ sở, chế độ công vụ, công chức, lao động tiền lương, an toàn vệ sinh lao động, bảo hiểm xã hội, thanh niên, bình đẳng giới, thi đua khen thưởng và công tác dân tộc, tín ngưỡng, tôn giáo trên địa bàn phường theo đúng quy định pháp luật.", False)
    ], font_size=13, line_spacing=1.3, space_before=2, space_after=4, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=Pt(36))

    p244 = doc.paragraphs[244]
    p244.text = "1.2.2. Lĩnh vực Giáo dục và Đào tạo"

    p245 = doc.paragraphs[245]
    set_para_runs(p245, [
        ("Căn cứ khoản 6 Điều 3 Quy định, Phòng tham mưu UBND phường quản lý nhà nước về giáo dục mầm non, giáo dục phổ thông (tiểu học, trung học cơ sở) và trung tâm học tập cộng đồng; quản lý quy hoạch trường lớp, phổ cập giáo dục và bảo đảm các điều kiện chất lượng giáo dục đạt chuẩn quốc gia.", False)
    ], font_size=13, line_spacing=1.3, space_before=2, space_after=4, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=Pt(36))

    # P246 giữ hoặc điều chỉnh
    p247 = doc.paragraphs[247]
    p247.text = "1.2.3. Lĩnh vực Văn hóa, Khoa học và Thông tin (Chuyển đổi số & Chính quyền số)"

    p248 = doc.paragraphs[248]
    set_para_runs(p248, [
        ("Căn cứ khoản 7 và khoản 8 Điều 3 Quy định, Phòng thực hiện quản lý văn hóa, gia đình, thể dục thể thao, du lịch, quảng cáo, bưu chính viễn thông. Đặc biệt, đây là ", False),
        ("cơ quan thường trực tham mưu và tổ chức triển khai nhiệm vụ chuyển đổi số, xây dựng chính quyền số, kinh tế số và xã hội số trên địa bàn phường", True),
        ("; quản lý, vận hành các hệ thống thông tin, CSDL quốc gia và hệ thống Điều hành thông minh phường (IOC phường) kết nối với Trung tâm IOC Thành phố; chỉ đạo, quản lý hoạt động của Tổ công nghệ số cộng đồng tại các khu phố.", False)
    ], font_size=13, line_spacing=1.3, space_before=2, space_after=4, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=Pt(36))

    # P249
    p249 = doc.paragraphs[249]
    p249.text = "1.2.4. Lĩnh vực Y tế và Bảo trợ xã hội"

    # P250
    p250 = doc.paragraphs[250]
    set_para_runs(p250, [
        ("Căn cứ khoản 9 Điều 3 Quy định, Phòng tham mưu quản lý y tế dự phòng, khám chữa bệnh cơ sở, an toàn thực phẩm, y tế học đường, bảo hiểm y tế. Trọng tâm an sinh xã hội là ", False),
        ("công tác quản lý và thực hiện chính sách Bảo trợ xã hội", True),
        (": rà soát, thẩm định, chi trả trợ cấp bảo trợ xã hội hàng tháng cho đối tượng bảo trợ xã hội (người cao tuổi, người khuyết tật) theo Nghị định 20/2021/NĐ-CP và Nghị định 76/2024/NĐ-CP, kết hợp cấp thẻ BHYT diện bảo trợ xã hội miễn phí 100%.", False)
    ], font_size=13, line_spacing=1.3, space_before=2, space_after=4, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=Pt(36))

    # P251 & P252: Cập nhật trách nhiệm chuyên môn trực tiếp
    p251 = doc.paragraphs[251]
    p251.text = "1.2.5. Trực tiếp Quản lý và Thực thi Chính sách An sinh Xã hội trên địa bàn"

    p252 = doc.paragraphs[252]
    set_para_runs(p252, [
        ("-\tTrực tiếp quản lý và thực hiện chính sách an sinh xã hội liên ngành trên địa bàn: ", False),
        ("Phòng Văn hóa – Xã hội chủ trì, thống nhất quản lý toàn bộ cơ sở dữ liệu người có công và bảo trợ xã hội", True),
        (", không còn phân mảnh hay phụ thuộc trung gian, bảo đảm quy trình xử lý hồ sơ thông suốt từ tiếp nhận tại Bộ phận Một cửa đến thẩm định và ban hành quyết định chi trả trợ cấp theo quy định.", False)
    ], font_size=13, line_spacing=1.3, space_before=2, space_after=3, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=Pt(36))

    p253 = doc.paragraphs[253]
    set_para_runs(p253, [
        ("-\tTham mưu hạ tầng kỹ thuật và giải pháp công nghệ phục vụ chi trả trợ cấp an sinh xã hội không dùng tiền mặt qua tài khoản cá nhân và VNeID theo đúng mục tiêu Đề án 06/CP [9].", False)
    ], font_size=13, line_spacing=1.3, space_before=2, space_after=4, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=Pt(36))

    # 5.3. Mục 1.3: Sơ đồ cơ cấu tổ chức và bố trí nhân sự (P254 - P268)
    p254 = doc.paragraphs[254]
    p254.text = "1.3. SƠ ĐỒ CƠ CẤU TỔ CHỨC VÀ BỐ TRÍ NHÂN SỰ"

    p255 = doc.paragraphs[255]
    set_para_runs(p255, [
        ("Căn cứ Chương III (Điều 4 và Điều 5) của Quy định ban hành kèm Quyết định số 2698/QĐ-UBND, cơ cấu tổ chức và bố trí nhân sự của ", False),
        ("Phòng Văn hóa – Xã hội phường Thủ Dầu Một", True),
        (" được thiết lập chuẩn mực theo chế độ thủ trưởng và quy chế làm việc của UBND phường:", False)
    ], font_size=13, line_spacing=1.3, space_before=2, space_after=4, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=Pt(36))

    p256 = doc.paragraphs[256]
    p256.text = "-\tBan Lãnh đạo Phòng:"

    p257 = doc.paragraphs[257]
    set_para_runs(p257, [
        ("+\t", False),
        ("Trưởng phòng", True),
        (": Do Chủ tịch UBND phường (ông ", False),
        ("Trần Phong Lưu", True),
        (") bổ nhiệm, là người đứng đầu, chịu trách nhiệm chính trước UBND phường, Chủ tịch UBND phường và trước pháp luật về việc thực hiện toàn bộ chức năng, nhiệm vụ, quyền hạn của Phòng.", False)
    ], font_size=13, line_spacing=1.3, space_before=2, space_after=3, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=Pt(36))

    p258 = doc.paragraphs[258]
    set_para_runs(p258, [
        ("+\t", False),
        ("Các Phó Trưởng phòng", True),
        (": Giúp Trưởng phòng chỉ đạo một số mặt công tác chuyên môn (Nội vụ - Chính sách Người có công, Văn hóa - Chuyển đổi số, Giáo dục - Y tế và Bảo trợ xã hội) và chịu trách nhiệm trước Trưởng phòng về nhiệm vụ được phân công.", False)
    ], font_size=13, line_spacing=1.3, space_before=2, space_after=3, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=Pt(36))

    p259 = doc.paragraphs[259]
    p259.text = "-\tCác Bộ phận Chuyên môn:"

    p260 = doc.paragraphs[260]
    set_para_runs(p260, [
        ("+\t", False),
        ("Bộ phận Nội vụ, Lao động và Người có công", True),
        (": Trực tiếp tiếp nhận, thẩm định hồ sơ, quản lý danh sách và tham mưu thực hiện chi trả trợ cấp ưu đãi người có công và an sinh xã hội.", False)
    ], font_size=13, line_spacing=1.3, space_before=2, space_after=3, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=Pt(36))

    p261 = doc.paragraphs[261]
    set_para_runs(p261, [
        ("+\t", False),
        ("Bộ phận Giáo dục, Y tế và Bảo trợ xã hội", True),
        (": Theo dõi quản lý giáo dục mầm non - phổ thông, công tác y tế cơ sở và chế độ bảo trợ xã hội theo Nghị định 20/2021/NĐ-CP và Nghị định 76/2024/NĐ-CP.", False)
    ], font_size=13, line_spacing=1.3, space_before=2, space_after=3, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=Pt(36))

    p262 = doc.paragraphs[262]
    set_para_runs(p262, [
        ("+\t", False),
        ("Bộ phận Văn hóa, Thông tin và Chuyển đổi số (nơi sinh viên trực tiếp tham gia thực tập)", True),
        (":", False)
    ], font_size=13, line_spacing=1.3, space_before=2, space_after=3, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=Pt(36))

    p263 = doc.paragraphs[263]
    set_para_runs(p263, [
        ("-\tQuản trị vận hành hệ thống hạ tầng CNTT, máy chủ CSDL và ứng dụng phần mềm của cơ quan dưới sự hướng dẫn của Cán bộ hướng dẫn ", False),
        ("Hứa Trọng Duy", True),
        (", bảo đảm an toàn dữ liệu công vụ theo Nghị định 13/2023/NĐ-CP [7].", False)
    ], font_size=13, line_spacing=1.3, space_before=2, space_after=2, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=Pt(36))

    p264 = doc.paragraphs[264]
    set_para_runs(p264, [
        ("-\tPhân tích yêu cầu bài toán nghiệp vụ, phối hợp thiết kế CSDL an sinh xã hội [20] và trực tiếp kiểm thử chất lượng phần mềm (QA/QC) [14], [19].", False)
    ], font_size=13, line_spacing=1.3, space_before=2, space_after=2, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=Pt(36))

    p265 = doc.paragraphs[265]
    set_para_runs(p265, [
        ("-\tHỗ trợ kỹ thuật, hướng dẫn quy trình vận hành hệ thống phần mềm và số hóa hồ sơ cho cán bộ Bộ phận Một cửa và Tổ công nghệ số cộng đồng tại các khu phố thuộc phường Thủ Dầu Một.", False)
    ], font_size=13, line_spacing=1.3, space_before=2, space_after=4, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=Pt(36))

    # Caption Hình 1.2
    p267 = doc.paragraphs[267]
    p267.text = "Hình 1.2: Sơ đồ cơ cấu tổ chức Phòng Văn hóa – Xã hội phường Thủ Dầu Một"

    p268 = doc.paragraphs[268]
    set_para_runs(p268, [
        ("* Phân tích chức năng và giải pháp kỹ thuật: Cơ cấu tổ chức của cơ quan được xây dựng theo mô hình phân cấp tinh gọn, đảm bảo hiệu lực hiệu quả. Đứng đầu là Trưởng phòng phụ trách chung, các Phó Trưởng phòng phụ trách các khối nghiệp vụ. Bốn bộ phận chuyên môn bao gồm: Bộ phận Nội vụ, Lao động & Người có công; Bộ phận Giáo dục, Y tế & Bảo trợ xã hội; Bộ phận Văn hóa - Du lịch; và ", False),
        ("Bộ phận Văn hóa, Thông tin & Chuyển đổi số (nơi sinh viên trực tiếp tham gia thực tập dưới sự hướng dẫn của cán bộ Hứa Trọng Duy)", True),
        (".", False)
    ], font_size=13, line_spacing=1.3, space_before=2, space_after=4, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=Pt(36))

    # 5.4. Mục 1.4: Khảo sát hiện trạng (P270 - P273)
    p270 = doc.paragraphs[270]
    set_para_runs(p270, [
        ("Phường Thủ Dầu Một (TP. Hồ Chí Minh)", True),
        (" hiện quản lý số lượng lớn hồ sơ đối tượng chính sách người có công và bảo trợ xã hội trên địa bàn các khu phố. Công tác quản lý mang tính chất liên ngành, đòi hỏi vừa bảo đảm tính pháp lý chặt chẽ theo Pháp lệnh số 02/2020/UBTVQH14 và các Nghị định hướng dẫn của Chính phủ, vừa đáp ứng yêu cầu số hóa quy trình công vụ và chi trả an sinh xã hội không dùng tiền mặt theo chỉ đạo của UBND Thành phố Hồ Chí Minh. Các đặc trưng chuyên sâu trong quản lý bao gồm:", False)
    ], font_size=13, line_spacing=1.3, space_before=2, space_after=4, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=Pt(36))

    p271 = doc.paragraphs[271]
    set_para_runs(p271, [
        ("-\t", False),
        ("Danh mục đối tượng đa dạng và liên tục mở rộng", True),
        (": Bao gồm Người có công với cách mạng (Mẹ Việt Nam Anh hùng, Thương binh, Bệnh binh, Thân nhân Liệt sĩ, Người hoạt động kháng chiến nhiễm chất độc hóa học theo Pháp lệnh 02/2020/UBTVQH14 [2]) và Đối tượng Bảo trợ xã hội (Người cao tuổi neo đơn, người khuyết tật đặc biệt nặng theo Nghị định 20/2021/NĐ-CP và Nghị định 76/2024/NĐ-CP).", False)
    ], font_size=13, line_spacing=1.3, space_before=2, space_after=3, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=Pt(36))

    p272 = doc.paragraphs[272]
    set_para_runs(p272, [
        ("-\t", False),
        ("Chế độ chính sách phong phú, nhiều định mức", True),
        (": Trợ cấp hàng tháng, phụ cấp người chăm sóc, trợ cấp thờ cúng liệt sĩ, chế độ điều dưỡng luân phiên, cấp phương tiện chỉnh hình theo niên hạn [4], mai táng phí khi từ trần [3], và cấp thẻ BHYT diện chính sách miễn phí 100%.", False)
    ], font_size=13, line_spacing=1.3, space_before=2, space_after=3, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=Pt(36))

    p273 = doc.paragraphs[273]
    set_para_runs(p273, [
        ("-\t", False),
        ("Yêu cầu chính xác tuyệt đối và chuyển đổi số đồng bộ", True),
        (": Mỗi quyết định chi trả đều gắn liền với dự toán ngân sách nhà nước và quyền lợi hợp pháp của công dân, đòi hỏi quy trình từ tiếp nhận hồ sơ tại Bộ phận Một cửa, thẩm định chuyên môn đến chi trả qua tài khoản phải chặt chẽ, minh bạch và kết nối liên thông dữ liệu dân cư theo Đề án 06/CP [9].", False)
    ], font_size=13, line_spacing=1.3, space_before=2, space_after=4, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=Pt(36))

    # 5.5. Mục 1.5: Căn cứ pháp lý (P285 & chèn 15-20 trước P290)
    p285 = doc.paragraphs[285]
    set_para_runs(p285, [
        ("10. Tài liệu Đặc tả Yêu cầu Phần mềm (SRS) - Hệ thống Quản lý Hồ sơ Người có công và An sinh Xã hội do ", False),
        ("Phòng Văn hóa – Xã hội phường Thủ Dầu Một", True),
        (" ban hành [11].", False)
    ], font_size=13, line_spacing=1.3, space_before=2, space_after=3, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=Pt(36))

    p290 = doc.paragraphs[290]
    new_legal_docs = [
        ("15. Quyết định số 2698/QĐ-UBND ngày 03 tháng 11 năm 2025 của Ủy ban nhân dân phường Thủ Dầu Một ban hành Quy định chức năng, nhiệm vụ, quyền hạn và tổ chức bộ máy của Phòng Văn hóa – Xã hội phường Thủ Dầu Một (do Chủ tịch UBND phường Trần Phong Lưu ký ban hành, thay thế Quyết định số 2370/QĐ-UBND).", True),
        ("16. Nghị quyết số 03/NQ-HĐND ngày 01 tháng 7 năm 2025 của Hội đồng nhân dân phường Thủ Dầu Một về việc thành lập Phòng Văn hóa – Xã hội phường Thủ Dầu Một.", True),
        ("17. Luật Tổ chức Chính quyền địa phương ngày 16 tháng 6 năm 2025.", True),
        ("18. Nghị định số 150/2025/NĐ-CP ngày 12 tháng 6 năm 2025 của Chính phủ quy định tổ chức các cơ quan chuyên môn thuộc UBND cấp tỉnh và UBND cấp xã, phường, đặc khu thuộc thành phố trực thuộc trung ương.", True),
        ("19. Công văn số 2892/UBND-VX ngày 14 tháng 10 năm 2025 của Ủy ban nhân dân thành phố Hồ Chí Minh về hướng dẫn chức năng, nhiệm vụ, quyền hạn và tổ chức bộ máy các cơ quan chuyên môn thuộc UBND cấp xã.", True),
        ("20. Nghị quyết số 190/NQ-CP ngày 26 tháng 6 năm 2025 của Chính phủ về con dấu của cơ quan chuyên môn thuộc Ủy ban nhân dân cấp xã, phường.", True),
    ]
    for text, is_hl in new_legal_docs:
        p_new = p290.insert_paragraph_before()
        set_para_runs(p_new, [(text, is_hl)], font_size=13, line_spacing=1.3, space_before=2, space_after=3, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=Pt(36))

    # -------------------------------------------------------------------------
    # 6. CẬP NHẬT CÁC ĐOẠN LIÊN QUAN TẠI CHƯƠNG 4, 6, 7 & TÀI LIỆU THAM KHẢO
    # -------------------------------------------------------------------------
    print("6. Cập nhật các đoạn văn bản Chương 4, 6, 7 & Tài liệu tham khảo...")
    for idx, p in enumerate(doc.paragraphs):
        if "Chuyên viên thụ lý hồ sơ Phòng Văn hóa" in p.text:
            set_para_runs(p, [
                ("* Phân tích chức năng và giải pháp kỹ thuật: Màn hình đăng nhập nghiệp vụ chuyên trách dành cho Chuyên viên thụ lý hồ sơ ", False),
                ("Phòng Văn hóa – Xã hội phường Thủ Dầu Một", True),
                (".", False)
            ], font_size=13, line_spacing=1.3, space_before=2, space_after=4, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=Pt(36))

        elif "Qua 03 tháng thực tập tại Phòng Văn hóa" in p.text:
            set_para_runs(p, [
                ("Qua 03 tháng thực tập tại ", False),
                ("Phòng Văn hóa – Xã hội phường Thủ Dầu Một (TP. Hồ Chí Minh)", True),
                (", sinh viên đã tích lũy được nhiều kinh nghiệm thực tế quý báu về phân tích quy trình công vụ, triển khai giải pháp công nghệ đáp ứng yêu cầu quản lý thực tiễn và tuân thủ các quy định nhà nước mới nhất.", False)
            ], font_size=13, line_spacing=1.3, space_before=2, space_after=4, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=Pt(36))

        elif "Trong thời gian thực tập tốt nghiệp tại Phòng Văn hóa" in p.text:
            set_para_runs(p, [
                ("Trong thời gian thực tập tốt nghiệp tại ", False),
                ("Phòng Văn hóa – Xã hội phường Thủ Dầu Một", True),
                (", em đã được tiếp cận trực tiếp với bài toán nghiệp vụ quản lý chính sách người có công và an sinh xã hội theo đúng chức năng nhiệm vụ mới của cơ quan chuyên môn cấp phường.", False)
            ], font_size=13, line_spacing=1.3, space_before=2, space_after=4, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=Pt(36))

        elif "Sau quá trình thử nghiệm và đối soát dữ liệu thực tế tại UBND Phường Phú Cường" in p.text:
            set_para_runs(p, [
                ("Sau quá trình thử nghiệm và đối soát dữ liệu thực tế tại ", False),
                ("Phòng Văn hóa – Xã hội phường Thủ Dầu Một", True),
                (", hệ thống đã chứng minh hiệu quả vượt trội về mặt hành chính công, an sinh xã hội và kinh tế:", False)
            ], font_size=13, line_spacing=1.3, space_before=2, space_after=3, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=Pt(36))

        elif idx > 900 and p.text.startswith("[11]") and "Tài liệu Đặc tả Yêu cầu" in p.text:
            set_para_runs(p, [
                ("[11]\t", False),
                ("UBND phường Thủ Dầu Một. Tài liệu Đặc tả Yêu cầu Phần mềm (SRS) - Hệ thống Quản lý Hồ sơ Người có công và An sinh Xã hội. TP. Hồ Chí Minh, 2026.", True)
            ], font_size=13, line_spacing=1.3, space_before=2, space_after=2, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line_indent=Pt(0))

    # -------------------------------------------------------------------------
    # 7. LƯU TÀI LIỆU VÀ ĐỒNG BỘ
    # -------------------------------------------------------------------------
    print("7. Đang lưu tài liệu hoàn chỉnh...")
    doc.save(OUTPUT_DOCX_ROOT)
    print(f"✓ Đã lưu thành công: {OUTPUT_DOCX_ROOT}")
    shutil.copyfile(OUTPUT_DOCX_ROOT, OUTPUT_DOCX_DOCS)
    print(f"✓ Đã đồng bộ sang: {OUTPUT_DOCX_DOCS}")

    print("\n=== HOÀN TẤT CẬP NHẬT TÀI LIỆU WORD BCTT2 THÀNH CÔNG RỰC RỠ! ===")

if __name__ == "__main__":
    main()

