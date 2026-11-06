import docx
from docx.shared import Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

DOCX_FILES = [
    "DoanMinhQuan_2224801030137_BCTT2.docx",
    "docs/DoanMinhQuan_2224801030137_BCTT2.docx"
]

def create_styled_paragraph(doc, text_runs, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line=Pt(36), left_indent=Pt(0),
                            space_before=Pt(1.5), space_after=Pt(3), line_spacing=1.15):
    """
    Tạo một paragraph mới với danh sách text_runs: [(text, bold, italic, size_pt)]
    """
    new_p_elm = OxmlElement('w:p')
    p = docx.text.paragraph.Paragraph(new_p_elm, doc)
    p.alignment = align
    pf = p.paragraph_format
    pf.first_line_indent = first_line
    pf.left_indent = left_indent
    pf.space_before = space_before
    pf.space_after = space_after
    pf.line_spacing = line_spacing
    
    for text, bold, italic, size in text_runs:
        r = p.add_run(text)
        r.font.name = "Times New Roman"
        r.font.size = Pt(size)
        r.font.bold = bold
        r.font.italic = italic
        r.font.highlight_color = None
        r.font.color.rgb = RGBColor(0, 0, 0)
    return p

def update_chapter1_for_doc(filepath):
    print(f"\n================ PROCESSING: {filepath} ================")
    doc = docx.Document(filepath)
    
    # 1. Tìm các mốc paragraph chính trong Chương 1
    p_c1_title = None
    p_1_1 = None
    p_hinh_1_1_img = None
    p_hinh_1_1_cap = None
    p_hinh_1_1_ana = None
    p_1_2 = None
    p_1_3 = None
    p_hinh_1_2_img = None
    p_hinh_1_2_cap = None
    p_hinh_1_2_ana = None
    p_1_4 = None
    p_1_5 = None
    p_1_6 = None
    
    for i, p in enumerate(doc.paragraphs):
        txt = p.text.strip()
        if txt == "CHƯƠNG 1. TỔNG QUAN VỀ CƠ QUAN THỰC TẬP & BÀI TOÁN NGHIỆP VỤ" and i > 200:
            p_c1_title = i
        elif txt.startswith("1.1. LỊCH SỬ HÌNH THÀNH") and i > 200:
            p_1_1 = i
        elif len(p._p.xpath('.//w:drawing')) > 0 and i > 230 and p_hinh_1_1_img is None:
            p_hinh_1_1_img = i
        elif txt.startswith("Hình 1.1:") and i > 230 and p_hinh_1_1_cap is None:
            p_hinh_1_1_cap = i
            p_hinh_1_1_ana = i + 1
        elif txt.startswith("1.2. CHỨC NĂNG VÀ NHIỆM VỤ") and i > 230:
            p_1_2 = i
        elif txt.startswith("1.3. SƠ ĐỒ CƠ CẤU TỔ CHỨC") and i > 230:
            p_1_3 = i
        elif len(p._p.xpath('.//w:drawing')) > 0 and i > 250 and p_hinh_1_2_img is None:
            p_hinh_1_2_img = i
        elif txt.startswith("Hình 1.2:") and i > 250 and p_hinh_1_2_cap is None:
            p_hinh_1_2_cap = i
            p_hinh_1_2_ana = i + 1
        elif txt.startswith("1.4. KHẢO SÁT HIỆN TRẠNG") and i > 250:
            p_1_4 = i
        elif txt.startswith("1.5. CĂN CỨ PHÁP LÝ") and i > 250:
            p_1_5 = i
        elif txt.startswith("1.6. NHỮNG BẤT CẬP") and i > 250:
            p_1_6 = i
            
    print(f"Indices found: C1={p_c1_title}, 1.1={p_1_1}, Img1.1={p_hinh_1_1_img}, Cap1.1={p_hinh_1_1_cap}, Ana1.1={p_hinh_1_1_ana}")
    print(f"               1.2={p_1_2}, 1.3={p_1_3}, Img1.2={p_hinh_1_2_img}, Cap1.2={p_hinh_1_2_cap}, Ana1.2={p_hinh_1_2_ana}")
    print(f"               1.4={p_1_4}, 1.5={p_1_5}, 1.6={p_1_6}")
    
    # -------------------------------------------------------------
    # A. CẬP NHẬT MỤC 1.1 (giữa p_1_1 và p_hinh_1_1_img)
    # -------------------------------------------------------------
    print("\n--- Updating Section 1.1 ---")
    p11_paras = [
        [
            ("Phòng Văn hóa – Xã hội phường Thủ Dầu Một là cơ quan chuyên môn trực thuộc Ủy ban nhân dân phường Thủ Dầu Một, được thành lập và kiện toàn tổ chức bộ máy theo tinh thần đổi mới của Luật Tổ chức Chính quyền địa phương ngày 16 tháng 6 năm 2025 và Nghị quyết số 03/NQ-HĐND ngày 01 tháng 7 năm 2025 của Hội đồng nhân dân phường Thủ Dầu Một. Tổ chức bộ máy, chức năng, nhiệm vụ và quyền hạn của cơ quan được quy định chi tiết tại Quyết định số 2698/QĐ-UBND ngày 03 tháng 11 năm 2025 của Ủy ban nhân dân phường Thủ Dầu Một do Chủ tịch Ủy ban nhân dân phường – ông Trần Phong Lưu ký ban hành (thay thế Quyết định số 2370/QĐ-UBND ngày 19 tháng 9 năm 2025), trên cơ sở thẩm định và Tờ trình số 586/TTr-VHXH ngày 27 tháng 10 năm 2025 của Trưởng phòng Văn hóa – Xã hội.", False, False, 13)
        ],
        [
            ("Theo Điều 1 Quy định ban hành kèm theo Quyết định số 2698/QĐ-UBND, Phòng Văn hóa – Xã hội có tư cách pháp nhân là cơ quan chuyên môn thuộc Ủy ban nhân dân phường; chịu sự lãnh đạo, chỉ đạo, quản lý trực tiếp, toàn diện về tổ chức bộ máy, vị trí việc làm, biên chế công chức, số lượng người làm việc và hoạt động công tác của Ủy ban nhân dân phường; đồng thời chịu sự chỉ đạo, thanh tra, kiểm tra, hướng dẫn về chuyên môn nghiệp vụ của các cơ quan chuyên môn thuộc Ủy ban nhân dân Thành phố (bao gồm các Sở: Nội vụ, Y tế, Giáo dục và Đào tạo, Văn hóa Thể thao và Du lịch, Khoa học và Công nghệ, Dân tộc và Tôn giáo, Lao động – Thương binh và Xã hội). Đặc biệt, Phòng Văn hóa – Xã hội có con dấu riêng để thực hiện nhiệm vụ được giao theo quy định tại Nghị quyết số 190/NQ-CP ngày 26 tháng 6 năm 2025 của Chính phủ về con dấu của cơ quan chuyên môn thuộc Ủy ban nhân dân xã, phường, đặc khu thuộc tỉnh, thành phố trực thuộc trung ương.", False, False, 13)
        ],
        [
            ("Trong tiến trình xây dựng phường Thủ Dầu Một trở thành đô thị văn minh, hiện đại và thông minh, Phòng Văn hóa – Xã hội giữ vai trò hạt nhân tham mưu chiến lược trên cả hai trục an sinh xã hội và khoa học – công nghệ. Không chỉ thực hiện đầy đủ công tác quản lý an sinh, chăm lo gia đình có công với cách mạng, đơn vị còn là đầu mối thường trực tham mưu triển khai Đề án Chuyển đổi số quốc gia (Quyết định số 749/QĐ-TTg) và Đề án 06/CP của Chính phủ về phát triển ứng dụng dữ liệu về dân cư, định danh và xác thực điện tử. Việc ứng dụng công nghệ thông tin, quản lý vận hành Trung tâm Giám sát Điều hành thông minh (IOC) phường, triển khai số hóa hồ sơ người có công và hiện đại hóa Bộ phận Một cửa đã khẳng định vị thế tiên phong của đơn vị trong đổi mới quản trị hành chính công đô thị.", False, False, 13)
        ]
    ]
    
    # Xóa các p giữa p_1_1 và p_hinh_1_1_img
    cur_p = doc.paragraphs[p_1_1]
    # Lấy các p cần xóa
    to_remove_11 = []
    for idx in range(p_1_1 + 1, p_hinh_1_1_img):
        to_remove_11.append(doc.paragraphs[idx]._p)
        
    # Chèn các p mới sau p_1_1
    last_elm = cur_p._p
    for runs in p11_paras:
        p_obj = create_styled_paragraph(doc, runs, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line=Pt(36), left_indent=Pt(0))
        last_elm.addnext(p_obj._p)
        last_elm = p_obj._p
        
    for p_elm in to_remove_11:
        p_elm.getparent().remove(p_elm)

    # -------------------------------------------------------------
    # B. CẬP NHẬT PHÂN TÍCH HÌNH 1.1 (p_hinh_1_1_ana)
    # -------------------------------------------------------------
    print("\n--- Updating Figure 1.1 Analysis ---")
    # Tìm lại p caption Hình 1.1
    for i, p in enumerate(doc.paragraphs):
        if p.text.strip().startswith("Hình 1.1:"):
            ana_p = doc.paragraphs[i + 1]
            ana_text = "* Phân tích điều kiện cơ sở vật chất và môi trường công tác: Trụ sở Ủy ban nhân dân và Phòng Văn hóa – Xã hội phường Thủ Dầu Một được trang bị khang trang, hiện đại với đầy đủ phân khu làm việc chuyên môn, phòng máy chủ hạ tầng mạng, Bộ phận Tiếp nhận và Trả kết quả (Một cửa) chuẩn quốc gia cùng hệ thống Kiosk cảm ứng tra cứu thủ tục và khảo sát chỉ số hài lòng (CSAT) phục vụ công dân. Đây là môi trường công vụ tiên tiến, tạo tiền đề vững chắc cho việc ứng dụng CNTT, thử nghiệm các giải pháp phần mềm quản trị chuyên ngành và triển khai liên thông dữ liệu phục vụ chuyển đổi số toàn diện tại địa phương."
            ana_p.text = ana_text
            ana_p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
            ana_p.paragraph_format.first_line_indent = Pt(36)
            ana_p.paragraph_format.left_indent = Pt(0)
            ana_p.paragraph_format.space_before = Pt(1.5)
            ana_p.paragraph_format.space_after = Pt(3)
            ana_p.paragraph_format.line_spacing = 1.15
            for r in ana_p.runs:
                r.font.name = "Times New Roman"
                r.font.size = Pt(12)
                r.font.bold = False
                r.font.italic = False
                r.font.highlight_color = None
                r.font.color.rgb = RGBColor(0, 0, 0)
            break

    # -------------------------------------------------------------
    # C. CẬP NHẬT MỤC 1.2 (giữa p_1_2 và p_1_3)
    # -------------------------------------------------------------
    print("\n--- Updating Section 1.2 ---")
    p12_data = [
        # (type, runs)
        ("head_sub", [("1.2.1. Chức năng tham mưu quản lý nhà nước đa ngành (Điều 2)", True, False, 13)]),
        ("body", [("Theo Điều 2 Quy định ban hành kèm Quyết định số 2698/QĐ-UBND của UBND phường Thủ Dầu Một, Phòng Văn hóa – Xã hội có chức năng tham mưu, giúp Ủy ban nhân dân phường thực hiện quản lý nhà nước toàn diện trên 04 khối lĩnh vực trọng yếu:", False, False, 13)]),
        ("bullet1", [
            ("-	Lĩnh vực Nội vụ và Lao động – Xã hội: ", True, False, 13),
            ("Tham mưu quản lý tổ chức hành chính, sự nghiệp nhà nước; chính quyền địa phương, địa giới đơn vị hành chính; cán bộ, công chức, viên chức và chế độ công vụ; cải cách hành chính; hội, tổ chức phi chính phủ; thi đua, khen thưởng; văn thư, lưu trữ nhà nước; thanh niên; lao động, tiền lương; việc làm; bảo hiểm xã hội; an toàn, vệ sinh lao động; ", False, False, 13),
            ("quản lý nhà nước về chính sách ưu đãi người có công với cách mạng", True, False, 13),
            ("; bình đẳng giới; công tác dân tộc và tín ngưỡng, tôn giáo.", False, False, 13)
        ]),
        ("bullet1", [
            ("-	Lĩnh vực Giáo dục và Đào tạo: ", True, False, 13),
            ("Tham mưu quản lý giáo dục mầm non, giáo dục phổ thông (tiểu học, trung học cơ sở, trường phổ thông có nhiều cấp học với cấp cao nhất là THCS) và trung tâm học tập cộng đồng; phổ cập giáo dục và xây dựng xã hội học tập.", False, False, 13)
        ]),
        ("bullet1", [
            ("-	Lĩnh vực Văn hóa, Khoa học và Thông tin: ", True, False, 13),
            ("Tham mưu quản lý văn hóa, gia đình, thể dục thể thao, du lịch, quảng cáo, phát thanh truyền hình, báo chí, thông tin cơ sở, thông tin đối ngoại; hoạt động nghiên cứu khoa học, ứng dụng, phát triển công nghệ, đổi mới sáng tạo; sở hữu trí tuệ, tiêu chuẩn đo lường chất lượng; bưu chính, viễn thông, ứng dụng công nghệ thông tin, giao dịch điện tử; ", False, False, 13),
            ("phát triển chính quyền số, kinh tế số, xã hội số và chuyển đổi số; quản lý hạ tầng thông tin.", True, False, 13)
        ]),
        ("bullet1", [
            ("-	Lĩnh vực Y tế và Bảo trợ xã hội: ", True, False, 13),
            ("Tham mưu quản lý y tế dự phòng, khám chữa bệnh cơ sở, phục hồi chức năng, chăm sóc bà mẹ – trẻ em, dân số, phòng chống tệ nạn xã hội; ", False, False, 13),
            ("quản lý chính sách bảo trợ xã hội", True, False, 13),
            (", y dược cổ truyền, dược, mỹ phẩm, an toàn thực phẩm, thiết bị y tế và bảo hiểm y tế.", False, False, 13)
        ]),
        ("head_sub", [("1.2.2. Nhiệm vụ quản lý nhà nước về lĩnh vực Người có công và An sinh xã hội (Điểm t Khoản 4 Điều 3)", True, False, 13)]),
        ("bullet1", [
            ("-	", False, False, 13),
            ("Quản lý công trình ghi công liệt sĩ: ", True, False, 13),
            ("Quản lý, bảo vệ, chăm sóc và tôn tạo các công trình ghi công liệt sĩ, nhà bia tưởng niệm, phần mộ liệt sĩ trên địa bàn phường theo đúng phân cấp quản lý nhà nước.", False, False, 13)
        ]),
        ("bullet1", [
            ("-	", False, False, 13),
            ("Phát động phong trào Đền ơn đáp nghĩa: ", True, False, 13),
            ("Chủ trì phối hợp chặt chẽ với Ủy ban Mặt trận Tổ quốc và các đoàn thể chính trị – xã hội phát động phong trào toàn dân chăm sóc thương binh, bệnh binh, gia đình liệt sĩ và người có công với cách mạng; vận động và quản lý Quỹ Đền ơn đáp nghĩa của địa phương.", False, False, 13)
        ]),
        ("bullet1", [
            ("-	", False, False, 13),
            ("Thực thi chính sách pháp luật ưu đãi NCC: ", True, False, 13),
            ("Hướng dẫn, tiếp nhận, thẩm định hồ sơ và tổ chức thực hiện các chính sách, chế độ ưu đãi của Nhà nước đối với người có công với cách mạng và thân nhân người có công theo phân cấp thẩm quyền.", False, False, 13)
        ]),
        ("bullet1", [
            ("-	", False, False, 13),
            ("Quản lý hồ sơ, đối tượng và kinh phí chi trả: ", True, False, 13),
            ("Quản lý chặt chẽ đối tượng, hồ sơ người có công và kinh phí thực hiện các chính sách ưu đãi (trợ cấp hàng tháng, phụ cấp người phục vụ, chế độ điều dưỡng phục hồi sức khỏe, trợ cấp mai táng phí, thờ cúng liệt sĩ) đảm bảo chi trả đúng kỳ, đủ số tiền, chính xác và minh bạch tuyệt đối.", False, False, 13)
        ]),
        ("bullet1", [
            ("-	", False, False, 13),
            ("Quản lý đối tượng Bảo trợ xã hội: ", True, False, 13),
            ("Lập danh sách, thẩm định và quản lý đối tượng bảo trợ xã hội; thực hiện chi trả trợ cấp xã hội thường xuyên và đột xuất theo quy định mới tại Nghị định số 76/2024/NĐ-CP (mức chuẩn trợ giúp xã hội nâng lên 500.000 đồng/tháng).", False, False, 13)
        ]),
        ("head_sub", [("1.2.3. Nhiệm vụ về Chuyển đổi số, Công nghệ thông tin và Cải cách hành chính (Khoản 8, 10, 11, 14 Điều 3)", True, False, 13)]),
        ("bullet1", [
            ("-	", False, False, 13),
            ("Quản lý, vận hành Trung tâm IOC phường: ", True, False, 13),
            ("Quản lý và vận hành hệ thống Giám sát Điều hành thông minh (IOC) phường Thủ Dầu Một, kết nối dữ liệu trực tiếp với Trung tâm IOC Thành phố phục vụ công tác lãnh đạo, chỉ đạo, chỉ huy và giải quyết công việc công vụ theo thời gian thực.", False, False, 13)
        ]),
        ("bullet1", [
            ("-	", False, False, 13),
            ("Ứng dụng CNTT và phát triển Chính quyền số: ", True, False, 13),
            ("Tham mưu, tổ chức triển khai kế hoạch Chuyển đổi số hàng năm của phường theo Quyết định số 749/QĐ-TTg của Thủ tướng Chính phủ; đẩy mạnh số hóa hồ sơ hành chính, tài liệu lưu trữ và chuyển đổi quy trình làm việc thủ công sang môi trường mạng.", False, False, 13)
        ]),
        ("bullet1", [
            ("-	", False, False, 13),
            ("An toàn thông tin và Bảo vệ dữ liệu cá nhân: ", True, False, 13),
            ("Triển khai các biện pháp bảo đảm an toàn thông tin mạng Cấp độ 3, an ninh mạng và bảo vệ dữ liệu cá nhân công dân theo Nghị định số 13/2023/NĐ-CP và Luật An ninh mạng đối với các hệ thống CNTT và CSDL do phòng quản trị.", False, False, 13)
        ]),
        ("bullet1", [
            ("-	", False, False, 13),
            ("Cung ứng Dịch vụ công và Bộ phận Một cửa: ", True, False, 13),
            ("Tổ chức thực hiện các dịch vụ công trực tuyến thuộc phạm vi quản lý; tối ưu hóa quy trình tiếp nhận và trả kết quả tại Bộ phận Một cửa theo Nghị định số 61/2018/NĐ-CP; tích hợp chữ ký số SmartCA và trả kết quả bản điện tử cho nhân dân.", False, False, 13)
        ]),
        ("bullet1", [
            ("-	", False, False, 13),
            ("Chỉ đạo hoạt động Tổ công nghệ số cộng đồng: ", True, False, 13),
            ("Hướng dẫn, quản lý và theo dõi chặt chẽ hoạt động của Tổ công nghệ số cộng đồng tại các khu phố, trực tiếp hướng dẫn công dân cài đặt định danh VNeID, nộp hồ sơ trực tuyến và đánh giá dịch vụ công.", False, False, 13)
        ]),
        ("head_sub", [("1.2.4. Nhiệm vụ quản lý Nội vụ, Lao động, Tiền lương, Việc làm và Bảo hiểm xã hội (Khoản 4 Điều 3)", True, False, 13)]),
        ("bullet1", [
            ("-	", False, False, 13),
            ("Thị trường lao động và việc làm: ", True, False, 13),
            ("Tổ chức thu thập, lưu trữ, dự báo và quản lý thông tin thị trường lao động địa phương; hướng dẫn thực hiện chính sách hỗ trợ tạo việc làm, bảo hiểm thất nghiệp và dịch vụ việc làm.", False, False, 13)
        ]),
        ("bullet1", [
            ("-	", False, False, 13),
            ("Lao động ngoài nước và an toàn lao động: ", True, False, 13),
            ("Xác nhận đăng ký hợp đồng cho người lao động đi làm việc ở nước ngoài; tiếp nhận đăng ký nội quy lao động; quản lý an toàn, vệ sinh lao động và phối hợp điều tra tai nạn lao động trên địa bàn.", False, False, 13)
        ]),
        ("bullet1", [
            ("-	", False, False, 13),
            ("Chế độ bảo hiểm xã hội: ", True, False, 13),
            ("Hướng dẫn, kiểm tra việc thực hiện pháp luật về BHXH; tiếp nhận hồ sơ đề nghị tạm dừng đóng quỹ hưu trí, tử tuất đối với các đơn vị, doanh nghiệp theo quy định.", False, False, 13)
        ]),
        ("head_sub", [("1.2.5. Nhiệm vụ quản lý Văn hóa, Thể thao, Giáo dục và Y tế cơ sở (Khoản 6, 7, 9 Điều 3)", True, False, 13)]),
        ("bullet1", [
            ("-	", False, False, 13),
            ("Văn hóa, lễ hội và thể thao: ", True, False, 13),
            ("Quản lý lễ hội, di tích lịch sử – văn hóa, thư viện, quảng cáo; đẩy mạnh phong trào “Toàn dân đoàn kết xây dựng đời sống văn hóa”, xét tặng danh hiệu gia đình văn hóa, khu phố văn hóa tiêu biểu.", False, False, 13)
        ]),
        ("bullet1", [
            ("-	", False, False, 13),
            ("Giáo dục và đào tạo: ", True, False, 13),
            ("Quản lý các cơ sở giáo dục mầm non, tiểu học, trung học cơ sở và trung tâm học tập cộng đồng; theo dõi phổ cập giáo dục và hoạt động dạy thêm, học thêm trên địa bàn.", False, False, 13)
        ]),
        ("bullet1", [
            ("-	", False, False, 13),
            ("Y tế cơ sở và an toàn thực phẩm: ", True, False, 13),
            ("Quản lý y tế dự phòng, khám chữa bệnh cơ sở, an toàn thực phẩm, y dược tư nhân và chăm sóc sức khỏe ban đầu cho nhân dân phường.", False, False, 13)
        ]),
        ("head_sub", [("1.2.6. Nhiệm vụ thanh tra, tiếp công dân, giải quyết khiếu nại tố cáo và phòng chống tham nhũng (Khoản 15 Điều 3)", True, False, 13)]),
        ("bullet1", [
            ("-	", False, False, 13),
            ("Tiếp công dân và giải quyết khiếu nại tố cáo: ", True, False, 13),
            ("Tổ chức tiếp công dân theo Thông tư số 04/2021/TT-TTCP; kịp thời tiếp nhận, xác minh, xử lý các phản ánh, khiếu nại, tố cáo của người dân liên quan đến chế độ chính sách an sinh xã hội và dịch vụ công.", False, False, 13)
        ]),
        ("bullet1", [
            ("-	", False, False, 13),
            ("Phòng, chống tham nhũng, lãng phí: ", True, False, 13),
            ("Thực hiện nghiêm các biện pháp phòng chống tham nhũng, thực hành tiết kiệm, chống lãng phí và bảo đảm thực hiện dân chủ ở cơ sở.", False, False, 13)
        ])
    ]
    
    # Tìm lại p_1_2 và p_1_3
    idx_12 = None
    idx_13 = None
    for i, p in enumerate(doc.paragraphs):
        txt = p.text.strip()
        if txt.startswith("1.2. CHỨC NĂNG VÀ NHIỆM VỤ") and i > 230:
            idx_12 = i
        elif txt.startswith("1.3. SƠ ĐỒ CƠ CẤU TỔ CHỨC") and i > 230:
            idx_13 = i
            break
            
    to_remove_12 = []
    for idx in range(idx_12 + 1, idx_13):
        to_remove_12.append(doc.paragraphs[idx]._p)
        
    last_elm = doc.paragraphs[idx_12]._p
    for p_type, runs in p12_data:
        if p_type == "head_sub":
            p_obj = create_styled_paragraph(doc, runs, align=WD_ALIGN_PARAGRAPH.LEFT, first_line=Pt(0), left_indent=Pt(0),
                                            space_before=Pt(3), space_after=Pt(1.5))
        elif p_type == "bullet1":
            p_obj = create_styled_paragraph(doc, runs, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line=Pt(-11.35), left_indent=Pt(22.7),
                                            space_before=Pt(1.5), space_after=Pt(2))
        else:
            p_obj = create_styled_paragraph(doc, runs, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line=Pt(36), left_indent=Pt(0),
                                            space_before=Pt(1.5), space_after=Pt(3))
        last_elm.addnext(p_obj._p)
        last_elm = p_obj._p
        
    for p_elm in to_remove_12:
        p_elm.getparent().remove(p_elm)

    # -------------------------------------------------------------
    # D. CẬP NHẬT MỤC 1.3 (giữa p_1_3 và p_hinh_1_2_img)
    # -------------------------------------------------------------
    print("\n--- Updating Section 1.3 ---")
    p13_data = [
        ("head_sub", [("1.3.1. Cơ cấu tổ chức bộ máy và định biên nhân sự (Điều 4 & Điều 5)", True, False, 13)]),
        ("body", [("Cơ cấu tổ chức bộ máy của Phòng Văn hóa – Xã hội phường Thủ Dầu Một được kiện toàn tinh gọn, hoạt động hiệu lực, hiệu quả theo quy định tại Chương III Quyết định số 2698/QĐ-UBND:", False, False, 13)]),
        ("bullet1", [
            ("-	Ban Lãnh đạo Phòng (Điều 4):", True, False, 13)
        ]),
        ("bullet2", [
            ("+	Trưởng phòng: ", True, False, 13),
            ("Do Chủ tịch Ủy ban nhân dân phường bổ nhiệm, là người đứng đầu cơ quan, chịu trách nhiệm trước Ủy ban nhân dân phường, Chủ tịch Ủy ban nhân dân phường và trước pháp luật về toàn bộ hoạt động của Phòng theo Quy chế làm việc.", False, False, 13)
        ]),
        ("bullet2", [
            ("+	Các Phó Trưởng phòng: ", True, False, 13),
            ("Do Chủ tịch Ủy ban nhân dân phường bổ nhiệm, là người giúp việc cho Trưởng phòng, phụ trách các lĩnh vực công tác chuyên môn được phân công (trong đó có Phó Trưởng phòng phụ trách trực tiếp lĩnh vực Công nghệ thông tin, Chuyển đổi số và An sinh xã hội); thay mặt Trưởng phòng điều hành cơ quan khi được ủy quyền.", False, False, 13)
        ]),
        ("bullet1", [
            ("-	Các Bộ phận Chuyên môn nghiệp vụ:", True, False, 13)
        ]),
        ("bullet2", [
            ("+	Bộ phận Nội vụ – Lao động, Thương binh và Xã hội: ", True, False, 13),
            ("Trực tiếp quản lý chính sách người có công với cách mạng, bảo trợ xã hội, lao động – việc làm, tiền lương, bảo hiểm xã hội, thi đua khen thưởng và tôn giáo – dân tộc.", False, False, 13)
        ]),
        ("bullet2", [
            ("+	Bộ phận Văn hóa, Khoa học, Thông tin và Chuyển đổi số (Đơn vị tiếp nhận sinh viên thực tập): ", True, False, 13),
            ("Phụ trách quản trị hạ tầng CNTT, bảo đảm an toàn dữ liệu máy chủ, vận hành hệ thống IOC phường, nghiên cứu phát triển các phần mềm ứng dụng chuyên ngành, thẩm định số hóa hồ sơ công vụ và hướng dẫn hoạt động của Tổ công nghệ số cộng đồng.", False, False, 13)
        ]),
        ("bullet2", [
            ("+	Bộ phận Giáo dục và Y tế: ", True, False, 13),
            ("Phụ trách quản lý cơ sở giáo dục mầm non, phổ thông, trung tâm học tập cộng đồng, y tế cơ sở và an toàn thực phẩm trên địa bàn.", False, False, 13)
        ]),
        ("bullet1", [
            ("-	Biên chế công chức (Điều 5): ", True, False, 13),
            ("Biên chế công chức của Phòng do Chủ tịch Ủy ban nhân dân phường quyết định trong tổng biên chế công chức của phường trên cơ sở khối lượng công việc thực tế và định mức được cấp có thẩm quyền giao hàng năm.", False, False, 13)
        ]),
        ("head_sub", [("1.3.2. Chế độ làm việc và các mối quan hệ công tác (Điều 6 & Điều 7)", True, False, 13)]),
        ("bullet1", [
            ("-	Chế độ làm việc (Điều 6): ", True, False, 13),
            ("Phòng hoạt động theo chương trình, kế hoạch công tác hàng năm do UBND phường giao; làm việc theo ", False, False, 13),
            ("chế độ thủ trưởng kết hợp nguyên tắc tập trung dân chủ", True, False, 13),
            (", đề cao trách nhiệm cá nhân của cán bộ, công chức trong thực thi nhiệm vụ.", False, False, 13)
        ]),
        ("bullet1", [
            ("-	Mối quan hệ công tác đa chiều (Điều 7):", True, False, 13)
        ]),
        ("bullet2", [
            ("+	Đối với UBND phường: ", True, False, 13),
            ("Chấp hành sự lãnh đạo, quản lý trực tiếp, toàn diện của UBND phường và Chủ tịch UBND phường; thực hiện chế độ báo cáo định kỳ và đột xuất.", False, False, 13)
        ]),
        ("bullet2", [
            ("+	Đối với các Sở chuyên ngành (Nội vụ, Y tế, VH-TT&DL, KH&CN, Dân tộc & Tôn giáo, GD&ĐT): ", True, False, 13),
            ("Chấp hành sự chỉ đạo, kiểm tra, hướng dẫn về chuyên môn nghiệp vụ của các Sở chuyên ngành cấp trên.", False, False, 13)
        ]),
        ("bullet2", [
            ("+	Đối với Văn phòng HĐND-UBND, Phòng Kinh tế – Hạ tầng – Đô thị, Trung tâm Phục vụ HCC: ", True, False, 13),
            ("Quan hệ phối hợp bình đẳng, liên thông giải quyết TTHC phục vụ công dân nhanh chóng, minh bạch.", False, False, 13)
        ]),
        ("bullet2", [
            ("+	Đối với Công an phường và Ban Chỉ huy Quân sự phường: ", True, False, 13),
            ("Phối hợp bảo đảm an ninh chính trị, trật tự xã hội gắn với quốc phòng toàn dân và công tác quản lý cư trú, nhân khẩu.", False, False, 13)
        ]),
        ("bullet2", [
            ("+	Đối với Ban Xây dựng Đảng ủy, MTTQ và các đoàn thể: ", True, False, 13),
            ("Phối hợp phát động các phong trào thi đua yêu nước, phong trào Đền ơn đáp nghĩa và an sinh xã hội.", False, False, 13)
        ]),
        ("bullet2", [
            ("+	Đối với Ban Điều hành các Khu phố: ", True, False, 13),
            ("Phối hợp triển khai phong trào đời sống văn hóa, nắm bắt thực địa, rà soát đối tượng chính sách và phát huy hiệu quả hoạt động của Tổ công nghệ số cộng đồng.", False, False, 13)
        ])
    ]
    
    # Tìm lại idx_13 và idx img 1.2
    idx_13 = None
    idx_img12 = None
    for i, p in enumerate(doc.paragraphs):
        txt = p.text.strip()
        if txt.startswith("1.3. SƠ ĐỒ CƠ CẤU TỔ CHỨC") and i > 230:
            idx_13 = i
        elif len(p._p.xpath('.//w:drawing')) > 0 and idx_13 is not None and i > idx_13 and idx_img12 is None:
            idx_img12 = i
            break
            
    to_remove_13 = []
    for idx in range(idx_13 + 1, idx_img12):
        to_remove_13.append(doc.paragraphs[idx]._p)
        
    last_elm = doc.paragraphs[idx_13]._p
    for p_type, runs in p13_data:
        if p_type == "head_sub":
            p_obj = create_styled_paragraph(doc, runs, align=WD_ALIGN_PARAGRAPH.LEFT, first_line=Pt(0), left_indent=Pt(0),
                                            space_before=Pt(3), space_after=Pt(1.5))
        elif p_type == "bullet1":
            p_obj = create_styled_paragraph(doc, runs, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line=Pt(-11.35), left_indent=Pt(22.7),
                                            space_before=Pt(1.5), space_after=Pt(2))
        elif p_type == "bullet2":
            p_obj = create_styled_paragraph(doc, runs, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line=Pt(-11.35), left_indent=Pt(39.7),
                                            space_before=Pt(1), space_after=Pt(1.5))
        else:
            p_obj = create_styled_paragraph(doc, runs, align=WD_ALIGN_PARAGRAPH.JUSTIFY, first_line=Pt(36), left_indent=Pt(0),
                                            space_before=Pt(1.5), space_after=Pt(3))
        last_elm.addnext(p_obj._p)
        last_elm = p_obj._p
        
    for p_elm in to_remove_13:
        p_elm.getparent().remove(p_elm)

    # -------------------------------------------------------------
    # E. CẬP NHẬT PHÂN TÍCH HÌNH 1.2 (p_hinh_1_2_ana)
    # -------------------------------------------------------------
    print("\n--- Updating Figure 1.2 Analysis ---")
    for i, p in enumerate(doc.paragraphs):
        if p.text.strip().startswith("Hình 1.2:"):
            ana_p = doc.paragraphs[i + 1]
            ana_text = "* Phân tích chức năng và giải pháp kỹ thuật: Cơ cấu tổ chức của Phòng Văn hóa – Xã hội phường Thủ Dầu Một được xây dựng theo mô hình quản trị công hiện đại, tinh gọn, đảm bảo hiệu lực và hiệu quả. Đứng đầu là Trưởng phòng phụ trách chung, các Phó Trưởng phòng giúp việc; các bộ phận chuyên môn được tổ chức chặt chẽ bao gồm: Bộ phận Nội vụ – Lao động, Thương binh và Xã hội (chuyên trách quản lý người có công và an sinh); Bộ phận Văn hóa, Khoa học, Thông tin và Chuyển đổi số (chuyên trách hạ tầng CNTT, Trung tâm IOC, Chuyển đổi số – nơi sinh viên trực tiếp tham gia nghiên cứu, phát triển ứng dụng và thực tập tốt nghiệp); và Bộ phận Giáo dục – Y tế, bảo đảm vận hành thông suốt mọi chức năng quản lý nhà nước trên địa bàn phường."
            ana_p.text = ana_text
            ana_p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
            ana_p.paragraph_format.first_line_indent = Pt(36)
            ana_p.paragraph_format.left_indent = Pt(0)
            ana_p.paragraph_format.space_before = Pt(1.5)
            ana_p.paragraph_format.space_after = Pt(3)
            ana_p.paragraph_format.line_spacing = 1.15
            for r in ana_p.runs:
                r.font.name = "Times New Roman"
                r.font.size = Pt(12)
                r.font.bold = False
                r.font.italic = False
                r.font.highlight_color = None
                r.font.color.rgb = RGBColor(0, 0, 0)
            break

    # -------------------------------------------------------------
    # F. CẬP NHẬT MỤC 1.5 (CĂN CỨ PHÁP LÝ TỪ 2 FILE PDF)
    # -------------------------------------------------------------
    print("\n--- Updating Section 1.5 ---")
    legal_docs = [
        "1. Luật Tổ chức Chính quyền địa phương ngày 16 tháng 6 năm 2025.",
        "2. Nghị quyết số 03/NQ-HĐND ngày 01 tháng 7 năm 2025 của Hội đồng nhân dân phường Thủ Dầu Một về việc thành lập Phòng Văn hóa – Xã hội phường Thủ Dầu Một.",
        "3. Quyết định số 2698/QĐ-UBND ngày 03 tháng 11 năm 2025 của Ủy ban nhân dân phường Thủ Dầu Một về việc ban hành Quy định chức năng, nhiệm vụ, quyền hạn và tổ chức bộ máy của Phòng Văn hóa – Xã hội phường Thủ Dầu Một (kèm Tờ trình số 586/TTr-VHXH ngày 27/10/2025 của Trưởng phòng).",
        "4. Nghị quyết số 190/NQ-CP ngày 26 tháng 6 năm 2025 của Chính phủ về con dấu của cơ quan chuyên môn thuộc Ủy ban nhân dân xã, phường, đặc khu thuộc tỉnh, thành phố trực thuộc trung ương.",
        "5. Nghị định số 150/2025/NĐ-CP ngày 12 tháng 6 năm 2025 của Chính phủ quy định tổ chức các cơ quan chuyên môn thuộc UBND tỉnh, thành phố trực thuộc Trung ương và UBND cấp xã, phường.",
        "6. Nghị định số 128/2025/NĐ-CP ngày 11 tháng 6 năm 2025 của Chính phủ quy định về phân quyền, phân cấp trong quản lý nhà nước lĩnh vực nội vụ.",
        "7. Nghị định số 138/2025/NĐ-CP ngày 12 tháng 6 năm 2025 của Chính phủ quy định về phân quyền, phân cấp trong lĩnh vực văn hóa, thể thao và du lịch.",
        "8. Nghị định số 133/2025/NĐ-CP ngày 12 tháng 6 năm 2025 của Chính phủ quy định về phân quyền, phân cấp trong lĩnh vực quản lý nhà nước của Bộ Khoa học và Công nghệ.",
        "9. Nghị định số 148/2025/NĐ-CP ngày 12 tháng 6 năm 2025 của Chính phủ quy định về phân quyền, phân cấp trong lĩnh vực y tế.",
        "10. Hệ thống Thông tư liên bộ hướng dẫn năm 2025: Thông tư số 10/2025/TT-BNV, Thông tư số 10/2025/TT-BVHTT&DL, Thông tư số 10/2025/TT-BKH&CN, Thông tư số 20/2025/TT-BYT, Thông tư số 15/2025/TT-BGDĐT.",
        "11. Pháp lệnh Ưu đãi người có công với cách mạng số 02/2020/UBTVQH14 ngày 09 tháng 12 năm 2020 của Ủy ban Thường vụ Quốc hội [2].",
        "12. Nghị định số 131/2021/NĐ-CP ngày 30 tháng 12 năm 2021 của Chính phủ quy định chi tiết và biện pháp thi hành Pháp lệnh Ưu đãi người có công với cách mạng [3].",
        "13. Nghị định số 75/2021/NĐ-CP [4], Nghị định số 55/2023/NĐ-CP [5] và Nghị định số 77/2024/NĐ-CP ngày 01 tháng 7 năm 2024 của Chính phủ sửa đổi, bổ sung mức chuẩn trợ cấp, phụ cấp ưu đãi người có công.",
        "14. Nghị định số 76/2024/NĐ-CP ngày 01 tháng 7 năm 2024 của Chính phủ sửa đổi, bổ sung một số điều của Nghị định số 20/2021/NĐ-CP quy định chính sách trợ giúp xã hội (mức chuẩn 500.000 đồng/tháng).",
        "15. Quyết định số 06/QĐ-TTg ngày 06 tháng 01 năm 2022 của Thủ tướng Chính phủ phê duyệt Đề án 06/CP về phát triển ứng dụng dữ liệu dân cư, định danh và xác thực điện tử [9].",
        "16. Quyết định số 749/QĐ-TTg ngày 03 tháng 6 năm 2020 của Thủ tướng Chính phủ phê duyệt Chương trình Chuyển đổi số quốc gia đến năm 2025, định hướng đến năm 2030 [8].",
        "17. Nghị định số 61/2018/NĐ-CP của Chính phủ về thực hiện cơ chế một cửa, một cửa liên thông trong giải quyết thủ tục hành chính [6].",
        "18. Nghị định số 13/2023/NĐ-CP ngày 17 tháng 4 năm 2023 của Chính phủ về bảo vệ dữ liệu cá nhân trong môi trường số [7].",
        "19. Luật An ninh mạng số 24/2018/QH14 của Quốc hội nước Cộng hòa Xã hội Chủ nghĩa Việt Nam [1].",
        "20. Thông tư số 04/2021/TT-TTCP ngày 01 tháng 10 năm 2021 của Thanh tra Chính phủ quy định quy trình tiếp công dân và xử lý đơn khiếu nại, tố cáo.",
        "21. Tài liệu Đặc tả Yêu cầu Phần mềm (SRS) - Hệ thống Quản lý Hồ sơ Người có công và Đánh giá Dịch vụ công do Phòng Văn hóa – Xã hội phường Thủ Dầu Một ban hành [11]."
    ]
    
    idx_15 = None
    idx_16 = None
    for i, p in enumerate(doc.paragraphs):
        txt = p.text.strip()
        if txt.startswith("1.5. CĂN CỨ PHÁP LÝ") and i > 230:
            idx_15 = i
        elif txt.startswith("1.6. NHỮNG BẤT CẬP") and i > 230:
            idx_16 = i
            break
            
    to_remove_15 = []
    # Giữ lại p ngay sau idx_15 làm lời dẫn: "Hệ thống phần mềm được thiết kế và xây dựng tuân thủ đầy đủ các văn bản quy phạm pháp luật..."
    lead_p = doc.paragraphs[idx_15 + 1]
    lead_p.text = "Hệ thống phần mềm được thiết kế, xây dựng và vận hành tuân thủ nghiêm ngặt hệ sinh thái văn bản quy phạm pháp luật của Nhà nước, quy định phân cấp thẩm quyền của thành phố và quyết định chuyên môn của đơn vị:"
    lead_p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    lead_p.paragraph_format.first_line_indent = Pt(36)
    lead_p.paragraph_format.left_indent = Pt(0)
    for r in lead_p.runs:
        r.font.name = "Times New Roman"
        r.font.size = Pt(13)
        r.font.bold = False
        r.font.italic = False
        
    for idx in range(idx_15 + 2, idx_16):
        to_remove_15.append(doc.paragraphs[idx]._p)
        
    last_elm = lead_p._p
    for item in legal_docs:
        p_obj = create_styled_paragraph(doc, [(item, False, False, 13)], align=WD_ALIGN_PARAGRAPH.JUSTIFY,
                                        first_line=Pt(-11.35), left_indent=Pt(22.7), space_before=Pt(1.5), space_after=Pt(2))
        last_elm.addnext(p_obj._p)
        last_elm = p_obj._p
        
    for p_elm in to_remove_15:
        p_elm.getparent().remove(p_elm)

    # -------------------------------------------------------------
    # G. RÀ SOÁT VÀ THAY THẾ TÊN CƠ QUAN CŨ TRONG TOÀN BỘ TÀI LIỆU
    # -------------------------------------------------------------
    print("\n--- Replacing Old Names across document ---")
    old_names = [
        "Phòng Văn hóa và Thông tin thành phố Thủ Dầu Một",
        "Phòng Văn hóa và Thông tin TP. Thủ Dầu Một",
        "Phòng Văn hóa - Thông tin thành phố Thủ Dầu Một",
        "Phòng Văn hoá và Thông tin thành phố Thủ Dầu Một"
    ]
    replaced_count = 0
    for p in doc.paragraphs:
        for old in old_names:
            if old in p.text:
                p.text = p.text.replace(old, "Phòng Văn hóa – Xã hội phường Thủ Dầu Một")
                replaced_count += 1
                for r in p.runs:
                    r.font.name = "Times New Roman"
    print(f"Replaced {replaced_count} occurrences of old agency names.")
    
    doc.save(filepath)
    print(f"✓ Saved updated document to {filepath} successfully!")

if __name__ == "__main__":
    for f in DOCX_FILES:
        update_chapter1_for_doc(f)
    print("\n=== HOÀN TẤT CẬP NHẬT CHƯƠNG 1 TỪ 2 FILE PDF! ===")
