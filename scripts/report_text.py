"""
Nội dung văn bản chi tiết học thuật chất lượng cao cho Báo cáo Thực tập Doanh nghiệp
Sinh viên: Đoàn Minh Quân - MSSV: 2224801030137 - Lớp: D22KTPM03
Ngành: Kỹ thuật Phần mềm - Viện Công nghệ số - Trường Đại học Thủ Dầu Một
Đơn vị thực tập: Phòng Văn hóa và Thông tin thành phố Thủ Dầu Một, tỉnh Bình Dương
Đề tài: Phân tích, thiết kế và xây dựng hệ thống phục vụ người có công sở lao động thương binh và xã hội
(Hệ thống Quản lý Hồ sơ Người có công và Đánh giá Dịch vụ công)

Toàn bộ câu từ được trau chuốt kỹ lưỡng, văn phong hành chính - học thuật trong sáng, mạch lạc,
được đánh số trích dẫn tài liệu tham khảo [1] đến [20] chuẩn mực học thuật quốc tế.
"""

LOI_CAM_ON = """Trong tiến trình chuyển đổi số quốc gia và hiện đại hóa nền hành chính công, đợt thực tập doanh nghiệp là dấu mốc mang ý nghĩa đặc biệt quan trọng đối với mỗi sinh viên chuyên ngành Kỹ thuật Phần mềm. Đây là cơ hội quý báu giúp bản thân em được bước ra khỏi không gian học thuật của giảng đường để tiếp cận với môi trường làm việc thực tiễn, trực tiếp vận dụng các kiến thức đã học vào việc giải quyết những bài toán nghiệp vụ công quyền đầy tính nhân văn, cụ thể là công tác quản lý chính sách và chi trả trợ cấp cho người có công với cách mạng.

Lời đầu tiên, em xin trân trọng bày tỏ lòng biết ơn sâu sắc đến Ban Giám hiệu Trường Đại học Thủ Dầu Một, Ban Lãnh đạo Viện Công nghệ số cùng toàn thể quý Thầy, Cô giáo trong bộ môn Kỹ thuật Phần mềm. Suốt những năm tháng học tập dưới mái trường, quý Thầy Cô đã không chỉ tận tâm truyền đạt nền tảng tri thức chuyên môn vững chắc về Cơ sở dữ liệu [20], Lập trình ứng dụng [16], [17], Kiến trúc hệ thống [15] và Kiểm thử phần mềm [14], [19], mà còn luôn định hướng cho chúng em phương pháp tư duy khoa học, tinh thần kỷ luật và đạo đức nghề nghiệp. Những bài học quý báu từ giảng đường chính là hành trang vững chãi giúp em tự tin hòa nhập và hoàn thành tốt nhiệm vụ được giao tại cơ quan tiếp nhận thực tập.

Em xin chân thành cảm ơn Ban Lãnh đạo Phòng Văn hóa và Thông tin thành phố Thủ Dầu Một đã tin tưởng tiếp nhận và tạo mọi điều kiện thuận lợi nhất về môi trường làm việc, trang thiết bị kỹ thuật cho em trong suốt thời gian 03 tháng thực tập. Đặc biệt, em xin gửi lời tri ân chân thành đến anh Hứa Trọng Duy - Chuyên viên phụ trách Công nghệ thông tin và Chuyển đổi số tại cơ quan, người đã trực tiếp hướng dẫn, tận tình chia sẻ những bài học kinh nghiệm quý giá về phân tích quy trình công vụ, giám sát chất lượng phần mềm [14] và định hướng chuyên môn để em hoàn thành tốt các hạng mục công việc trong dự án "Hệ thống Quản lý Hồ sơ Người có công và Đánh giá Dịch vụ công", tuân thủ nghiêm ngặt quy định bảo mật an toàn thông tin dữ liệu công dân theo Nghị định 13/2023/NĐ-CP [7].

Đồng thời, em xin bày tỏ lòng biết ơn sâu sắc đến Giảng viên hướng dẫn - ThS. Nguyễn Thành Trung, người đã luôn dành thời gian quý báu để theo sát tiến độ, định hướng phương pháp nghiên cứu học thuật, tận tình chỉ dẫn và đóng góp những ý kiến sâu sắc giúp em hoàn thiện bản báo cáo này một cách chỉnh chu, khoa học và đúng quy chuẩn.

Mặc dù bản thân đã dành nhiều tâm huyết và nỗ lực để hoàn thành báo cáo với tinh thần nghiêm túc và cầu thị cao nhất, song do giới hạn về mặt thời gian và trải nghiệm thực tiễn, báo cáo khó tránh khỏi những thiếu sót nhất định. Em rất mong nhận được những lời chỉ bảo, nhận xét và đóng góp quý báu từ quý Thầy Cô trong Hội đồng đánh giá cũng như các cô chú, anh chị cán bộ tại cơ quan để bản thân tiếp tục trau dồi tri thức, hoàn thiện năng lực chuyên môn và vững bước trên con đường nghề nghiệp tương lai."""

MO_DAU = """1. TÍNH CẤP THIẾT CỦA ĐỀ TÀI
Chăm lo đời sống vật chất và tinh thần cho người có công với cách mạng là chủ trương nhất quán, thể hiện truyền thống đạo lý "Uống nước nhớ nguồn" tốt đẹp của dân tộc ta. Trên địa bàn thành phố Thủ Dầu Một nói riêng và tỉnh Bình Dương nói chung, số lượng đối tượng thụ hưởng chính sách an sinh xã hội hiện nay lên tới hàng chục nghìn trường hợp, gồm Mẹ Việt Nam Anh hùng, Thương binh, Bệnh binh, Thân nhân Liệt sĩ và Người hoạt động kháng chiến bị nhiễm chất độc hóa học.

Trước yêu cầu đẩy mạnh Chuyển đổi số quốc gia theo Quyết định số 749/QĐ-TTg của Thủ tướng Chính phủ [8] và triển khai Đề án 06/CP về phát triển ứng dụng dữ liệu dân cư [9], công tác quản lý chính sách người có công tại địa phương đang đối mặt với nhiều đòi hỏi cấp bách:
- Phương thức lưu trữ hồ sơ giấy tờ qua nhiều thời kỳ lịch sử tiềm ẩn nguy cơ hư hại vật lý, thất lạc chứng từ gốc và gây khó khăn cho việc tra cứu trích lục.
- Việc tính toán mức trợ cấp theo tỷ lệ tổn thương cơ thể cùng các khoản phụ cấp chăm sóc, trợ cấp thờ cúng đòi hỏi độ chính xác tuyệt đối; việc quản lý thủ công trên các bảng tính phân tán tiềm ẩn rủi ro phát sinh sai sót trong số liệu tài chính.
- Quy trình ghi nhận thông tin biến động đối tượng (đặc biệt khi đối tượng từ trần) cần được đồng bộ tự động để kịp thời điều chỉnh danh sách chi trả thường xuyên, bảo đảm tính minh bạch và tránh thất thoát ngân sách nhà nước.
- Nhu cầu công khai, minh bạch thông tin giúp thân nhân và công dân dễ dàng theo dõi tiến độ giải quyết hồ sơ tại nhà, đồng thời thiết lập công cụ đo lường mức độ hài lòng của nhân dân đối với sự phục vụ của cơ quan hành chính nhà nước.

Xuất phát từ yêu cầu thực tiễn nêu trên, đề tài "Phân tích, thiết kế và xây dựng hệ thống phục vụ người có công sở lao động thương binh và xã hội" (Hệ thống Quản lý Hồ sơ Người có công và Đánh giá Dịch vụ công) được lựa chọn nghiên cứu và triển khai nhằm cung cấp một giải pháp phần mềm toàn diện, số hóa trọn vẹn quy trình quản trị, tự động hóa tính toán tài chính và phục vụ nhân dân ngày một tốt hơn.

2. MỤC ĐÍCH VÀ NHIỆM VỤ NGHIÊN CỨU
* Mục đích nghiên cứu: Thiết kế và xây dựng giải pháp phần mềm đồng bộ phục vụ công tác tiếp nhận, thẩm định hồ sơ, tự động hóa tính toán kinh phí chi trả trợ cấp, hỗ trợ quy trình chi trả không dùng tiền mặt theo Đề án 06/CP [9] và cung cấp phân hệ khảo sát chất lượng dịch vụ công độc lập tại địa phương.
* Nhiệm vụ nghiên cứu:
- Khảo sát thực tế cơ cấu tổ chức, quy trình tiếp nhận và thẩm định hồ sơ người có công tại Phòng Văn hóa và Thông tin thành phố Thủ Dầu Một.
- Phân tích và thiết kế Cơ sở dữ liệu quan hệ MySQL 8.0 chuẩn hóa dạng chuẩn 3 (3NF) [20] gồm 16 bảng cốt lõi, bảo đảm tính toàn vẹn tham chiếu và tối ưu hóa tốc độ truy vấn bằng B-Tree Indexing theo [18].
- Xây dựng hệ thống Backend phân tầng: Sử dụng Node.js Express cho các dịch vụ tiếp nhận, tra cứu và phân quyền; sử dụng Java Spring Boot [16] kết hợp lớp `BigDecimal` cho Engine tính toán định mức kinh phí tài chính với độ chính xác tuyệt đối.
- Thiết kế kiến trúc liên thông dữ liệu qua Trục tích hợp chia sẻ dữ liệu cấp địa phương (LGSP) với các tiêu chuẩn an toàn thông tin mTLS 1.3 và OAuth 2.0 theo Luật An ninh mạng [1].
- Nghiên cứu ứng dụng nhận dạng ký tự quang học AI OCR trong việc hỗ trợ trích xuất dữ liệu hồ sơ kháng chiến cũ và tích hợp ký số điện tử công vụ PKI.
- Xây dựng trọn bộ tài liệu kiểm thử chất lượng phần mềm (QA/QC) chuẩn hóa [14], [19] gồm: Checklist 30 hạng mục, kịch bản 50 Test Cases [13], bảng theo dõi 15 Bug Reports và Test Summary Report.

3. ĐỐI TƯỢNG VÀ PHẠM VI NGHIÊN CỨU
* Đối tượng nghiên cứu: Quy trình nghiệp vụ hành chính công về quản lý chính sách người có công; các quy định pháp luật hiện hành về mức chuẩn trợ cấp [2], [4]; kiến trúc phần mềm phân tầng Hybrid Modular Monolith [15]; kỹ thuật chuẩn hóa CSDL quan hệ [20] và phương pháp luận kiểm thử phần mềm chuyên nghiệp [12], [14].
* Phạm vi nghiên cứu và ứng dụng: Thử nghiệm thực tế tại Bộ phận Một cửa và Bộ phận Công nghệ thông tin thuộc Phòng Văn hóa và Thông tin thành phố Thủ Dầu Một, phục vụ công tác quản lý trên địa bàn 14 phường trực thuộc.

4. PHƯƠNG PHÁP NGHIÊN CỨU
* Phương pháp nghiên cứu tài liệu quy phạm pháp luật: Nghiên cứu kỹ lưỡng Pháp lệnh 02/2020/UBTVQH14 [2], Nghị định 131/2021/NĐ-CP [3], Nghị định 75/2021/NĐ-CP [4], Nghị định 55/2023/NĐ-CP [5], Nghị định 61/2018/NĐ-CP [6], Thông tư 101/2018/TT-BTC [10], Đề án 06/CP [9] và Nghị định 13/2023/NĐ-CP [7] để chuyển hóa chuẩn xác thành các quy tắc xử lý trong phần mềm.
* Phương pháp đối chiếu yêu cầu phần mềm: Bám sát Tài liệu Đặc tả Yêu cầu Phần mềm (SRS) [11] của đơn vị thực tập để thiết kế hệ thống tính năng hoàn chỉnh.
* Phương pháp phân tích và mô hình hóa hệ thống: Áp dụng các sơ đồ chuẩn UML (Use Case, Sequence Diagram), mô hình thực thể ERD và ma trận phân quyền dựa trên vai trò (RBAC).
* Phương pháp thực nghiệm: Cài đặt hệ thống trên môi trường máy chủ thử nghiệm, kiểm thử API tự động qua Postman, kiểm thử giao diện chức năng và kiểm tra khả năng chịu tải bằng Apache JMeter.

5. Ý NGHĨA KHOA HỌC VÀ THỰC TIỄN
* Về mặt khoa học: Đề tài vận dụng tổng hợp các nguyên lý kỹ thuật phần mềm tiên tiến từ kiến trúc lai [15], chuẩn hóa dữ liệu quan hệ [20] đến quy trình bảo đảm chất lượng QA/QC bài bản [14], [19] vào một bài toán quy mô công vụ thực tế.
* Về mặt thực tiễn: Hệ thống cung cấp công cụ số hóa trực quan giúp cơ quan quản lý tiết kiệm đáng kể thời gian đối soát số liệu ngân hàng theo Đề án 06/CP [9], xóa bỏ nguy cơ sai sót tính toán định mức kinh phí và nâng cao chất lượng phục vụ nhân dân tại địa phương."""

CHUONG_1_TEXT = """1.1. LỊCH SỬ HÌNH THÀNH VÀ PHÁT TRIỂN CỦA ĐƠN VỊ THỰC TẬP
Phòng Văn hóa và Thông tin thành phố Thủ Dầu Một là cơ quan chuyên môn thuộc Ủy ban nhân dân thành phố Thủ Dầu Một, tỉnh Bình Dương. Cơ quan thực hiện chức năng tham mưu, giúp UBND thành phố quản lý nhà nước về văn hóa, gia đình, thể dục thể thao, du lịch, thông tin truyền thông, bưu chính viễn thông và công nghệ thông tin trên địa bàn đô thị trung tâm của tỉnh.

Trong tiến trình xây dựng và phát triển đô thị Thủ Dầu Một trở thành đô thị loại I văn minh, thông minh, Phòng Văn hóa và Thông tin đã luôn khẳng định vai trò nòng cốt trong công tác quản lý nhà nước và tham mưu chiến lược. Đặc biệt, trong bối cảnh cuộc Cách mạng công nghiệp lần thứ tư, đơn vị giữ vai trò là cơ quan thường trực Ban Chỉ đạo Chuyển đổi số thành phố theo Quyết định số 749/QĐ-TTg của Thủ tướng Chính phủ [8]. Phòng đã tích cực tham mưu triển khai hạ tầng số đồng bộ, kết nối vận hành Trung tâm Giám sát Điều hành thông minh (IOC), thúc đẩy số hóa dữ liệu công vụ và phối hợp chặt chẽ với các ban ngành liên quan trong việc hiện đại hóa công tác an sinh xã hội, thực hiện Đề án 06/CP của Chính phủ [9].

1.2. CHỨC NĂNG VÀ NHIỆM VỤ HOẠT ĐỘNG CỦA CƠ QUAN
1.2.1. Quản lý nhà nước về Bưu chính, Viễn thông & Công nghệ thông tin
- Tham mưu xây dựng quy hoạch, kế hoạch phát triển hạ tầng số, mạng viễn thông và bảo đảm an toàn thông tin mạng trên địa bàn thành phố theo Luật An ninh mạng [1].
- Quản lý, hướng dẫn việc ứng dụng công nghệ thông tin trong hoạt động của các cơ quan nhà nước và UBND 14 phường, thúc đẩy chuyển đổi phương thức làm việc lên môi trường số.

1.2.2. Tham mưu và Triển khai Chuyển đổi số (CĐS)
- Xây dựng và đôn đốc thực hiện kế hoạch Chuyển đổi số hàng năm, bảo đảm phù hợp với Kiến trúc Chính quyền số của tỉnh và định hướng quốc gia [8].
- Đẩy mạnh số hóa hồ sơ, tài liệu công vụ; phát triển các ứng dụng phần mềm quản lý chuyên ngành phục vụ cán bộ tiếp nhận và xử lý thủ tục hành chính.
- Tham mưu giải pháp kết nối, chia sẻ dữ liệu liên thông giữa thành phố với các cơ sở dữ liệu chuyên ngành cấp tỉnh thông qua Trục LGSP.

1.2.3. Quản lý Văn hóa, Thể thao, Du lịch & Thông tin Tuyên truyền
- Quản lý nhà nước đối với các hoạt động văn hóa, lễ hội, di tích lịch sử và phong trào thể dục thể thao quần chúng trên địa bàn.
- Tổ chức công tác thông tin, tuyên truyền các chủ trương, đường lối của Đảng và chính sách pháp luật của Nhà nước đến các tầng lớp nhân dân.

1.2.4. Phối hợp Quản lý Chính sách Người có công và An sinh xã hội
- Phối hợp với Phòng Lao động - Thương binh và Xã hội trong công tác chuẩn hóa cơ sở dữ liệu hồ sơ đối tượng chính sách [2], [3].
- Tham mưu hạ tầng kỹ thuật và giải pháp công nghệ phục vụ chi trả trợ cấp an sinh xã hội không dùng tiền mặt theo chỉ đạo của Chính phủ và Đề án 06/CP [9].

1.3. SƠ ĐỒ CƠ CẤU TỔ CHỨC VÀ BỐ TRÍ NHÂN SỰ
Cơ cấu tổ chức của cơ quan được bố trí tinh gọn, khoa học, bảo đảm tính hiệu lực và hiệu quả trong thực thi công vụ:
- Ban Lãnh đạo Phòng:
  + Trưởng phòng: Phụ trách chung toàn bộ hoạt động của cơ quan, chịu trách nhiệm trước Thành ủy, UBND thành phố và pháp luật.
  + Phó Trưởng phòng: Trực tiếp phụ trách lĩnh vực Công nghệ thông tin, Bưu chính viễn thông và Chuyển đổi số; chỉ đạo việc thử nghiệm, ứng dụng các hệ thống phần mềm chuyên ngành.
- Các Bộ phận Chuyên môn:
  + Bộ phận Văn hóa - Gia đình và Du lịch: Quản lý nếp sống văn hóa, gia đình và hoạt động du lịch địa phương.
  + Bộ phận Bưu chính, Viễn thông và Tuyên truyền: Phụ trách hạ tầng viễn thông và thông tin tuyên truyền cơ sở.
  + Bộ phận CNTT và Chuyển đổi số (nơi sinh viên trực tiếp tham gia thực tập):
    * Quản trị vận hành hệ thống hạ tầng CNTT, bảo đảm an toàn dữ liệu máy chủ công vụ theo quy định [1], [7].
    * Phân tích yêu cầu bài toán nghiệp vụ, phối hợp thiết kế CSDL [20] và trực tiếp kiểm thử chất lượng phần mềm (QA/QC) [14], [19].
    * Hỗ trợ kỹ thuật, hướng dẫn quy trình vận hành hệ thống phần mềm cho cán bộ Bộ phận Một cửa tại 14 phường.

1.4. KHẢO SÁT HIỆN TRẠNG CÔNG TÁC QUẢN LÝ CHÍNH SÁCH NGƯỜI CÓ CÔNG TẠI ĐỊA PHƯƠNG
Thành phố Thủ Dầu Một hiện quản lý hơn 12.000 hồ sơ đối tượng chính sách người có công, phân bố trên địa bàn 14 phường (gồm Phú Cường, Phú Hòa, Hiệp Thành, Định Hòa, Chánh Nghĩa, Phú Lợi, Phú Thọ, Phú Mỹ, Hiệp An, Tương Bình Hiệp, Chánh Mỹ, Tân An, Thới Hòa, Hòa Phú). Công tác quản lý có những đặc trưng chuyên sâu:
- Danh mục đối tượng đa dạng: Mẹ Việt Nam Anh hùng, Thương binh, Bệnh binh, Thân nhân Liệt sĩ, Người hoạt động kháng chiến nhiễm chất độc hóa học theo Pháp lệnh 02/2020/UBTVQH14 [2].
- Chế độ chính sách phong phú: Trợ cấp hàng tháng, phụ cấp người chăm sóc, trợ cấp thờ cúng liệt sĩ, chế độ điều dưỡng luân phiên, cấp phương tiện chỉnh hình theo niên hạn [4] và mai táng phí khi từ trần [3].
- Yêu cầu chính xác tuyệt đối: Mỗi quyết định chi trả đều gắn liền với ngân sách nhà nước và quyền lợi hợp pháp của công dân, đòi hỏi quy trình thực hiện phải chặt chẽ, minh bạch.

1.5. CĂN CỨ PHÁP LÝ VÀ CÁC QUY ĐỊNH NHÀ NƯỚC NỀN TẢNG
Hệ thống phần mềm được thiết kế và xây dựng tuân thủ đầy đủ các văn bản quy phạm pháp luật và tiêu chuẩn kỹ thuật hiện hành:
1. Luật An ninh mạng số 24/2018/QH14 của Quốc hội nước Cộng hòa Xã hội Chủ nghĩa Việt Nam [1].
2. Pháp lệnh Ưu đãi người có công với cách mạng số 02/2020/UBTVQH14 của Ủy ban Thường vụ Quốc hội [2].
3. Nghị định số 131/2021/NĐ-CP của Chính phủ quy định chi tiết và biện pháp thi hành Pháp lệnh Ưu đãi người có công với cách mạng [3].
4. Nghị định số 75/2021/NĐ-CP [4] và Nghị định số 55/2023/NĐ-CP [5] của Chính phủ quy định mức chuẩn trợ cấp, phụ cấp ưu đãi người có công (Mức chuẩn áp dụng: 2.055.000 đồng/tháng).
5. Nghị định số 61/2018/NĐ-CP của Chính phủ về thực hiện cơ chế một cửa, một cửa liên thông trong giải quyết thủ tục hành chính (Mẫu số 01 - Giấy hẹn tiếp nhận có mã QR Code) [6].
6. Thông tư số 101/2018/TT-BTC của Bộ Tài chính hướng dẫn quản lý và sử dụng kinh phí chính sách ưu đãi người có công (Mẫu C70a-HD - Phiếu chi trợ cấp) [10].
7. Quyết định số 749/QĐ-TTg của Thủ tướng Chính phủ phê duyệt Chương trình Chuyển đổi số quốc gia đến năm 2025, định hướng đến năm 2030 [8].
8. Quyết định số 06/QĐ-TTg của Thủ tướng Chính phủ phê duyệt Đề án 06/CP về phát triển ứng dụng dữ liệu dân cư, định danh và xác thực điện tử [9].
9. Nghị định số 13/2023/NĐ-CP của Chính phủ về bảo vệ dữ liệu cá nhân trong môi trường số [7].
10. Tài liệu Đặc tả Yêu cầu Phần mềm (SRS) - Hệ thống Quản lý Hồ sơ Người có công do Phòng Văn hóa và Thông tin ban hành [11].

1.6. NHỮNG BẤT CẬP, KHÓ KHĂN CỦA QUY TRÌNH THỦ CÔNG CŨ
Trước khi xây dựng hệ thống phần mềm, công tác quản lý tại địa phương gặp phải một số tồn tại:
- Hồ sơ giấy tờ lưu trữ qua nhiều thời kỳ kháng chiến có dấu hiệu xuống cấp, mờ nét chữ, làm tăng thời gian tra cứu hồ sơ gốc.
- Việc tính toán mức trợ cấp theo tỷ lệ tổn thương cơ thể nếu thực hiện trên các bảng tính Excel phân tán có thể dẫn đến sai số làm tròn số học.
- Thông tin khai tử khi đối tượng từ trần nếu không được cập nhật kịp thời vào danh sách phát tiền định kỳ sẽ gây phức tạp cho công tác thu hồi kinh phí.
- Việc đối soát danh sách chi trả với sao kê ngân hàng hàng tháng bằng phương pháp thủ công đòi hỏi nhiều ngày công làm việc của cán bộ.
- Thân nhân và công dân còn gặp bất tiện khi muốn tra cứu tiến độ xử lý hồ sơ hoặc lịch chi trả, thường phải đến trực tiếp cơ quan hành chính.

1.7. MỤC TIÊU VÀ PHẠM VI XÂY DỰNG DỰ ÁN
Dự án hướng đến hoàn thiện các mục tiêu cụ thể theo Tài liệu SRS [11]:
- Số hóa toàn bộ hồ sơ quản lý, xây dựng CSDL tập trung và ứng dụng công nghệ AI OCR hỗ trợ trích xuất dữ liệu tài liệu lưu trữ cũ.
- Tự động hóa công thức tính toán mức hưởng trợ cấp theo mức chuẩn 2.055.000 đồng [4], [5] với độ chính xác tuyệt đối bằng Java `BigDecimal` trên nền tảng Spring Boot [16].
- Đồng bộ quy trình báo giảm từ trần, tự động khóa lệnh chi trả thường xuyên và tạo dự thảo Quyết định Mai táng phí Mẫu 02 theo Nghị định 131/2021/NĐ-CP [3].
- Hỗ trợ đối soát tự động dữ liệu chi trả với sao kê ngân hàng theo tinh thần Đề án 06/CP [9].
- Cung cấp cổng tra cứu trực tuyến thuận tiện cho công dân và màn hình Kiosk đánh giá dịch vụ công độc lập tại Bộ phận Một cửa."""

CHUONG_2_TEXT = """2.1. TỔNG QUAN KIẾN TRÚC PHẦN MỀM HYBRID MODULAR MONOLITH
Hệ thống được thiết kế theo kiến trúc lai kết hợp (Hybrid Modular Monolith kết hợp Layered Architecture theo Martin Fowler [15]). Đây là giải pháp phù hợp với bài toán quản lý hành chính công cấp đô thị, bảo đảm tính toàn vẹn của dữ liệu giao dịch đồng thời cho phép phân tách rõ ràng các tầng trách nhiệm:
- Tầng Trình diễn (Presentation Layer - Frontend): Xây dựng trên nền tảng React 19 và TypeScript [17], chịu trách nhiệm tương tác người dùng, hiển thị các biểu mẫu công vụ trang trọng, biểu đồ thống kê thời gian thực và giao diện Kiosk Một cửa.
- Tầng Cổng dịch vụ và Điều phối (API Gateway - NGINX): Cung cấp cơ chế mã hóa SSL/TLS 1.3, kiểm soát tần suất truy cập (Rate Limiting), bảo đảm an toàn CORS và phân luồng yêu cầu đến các dịch vụ Backend phù hợp theo quy chuẩn an ninh mạng [1].
- Tầng Dịch vụ Xử lý Trung tâm (Backend Services Layer):
  + Dịch vụ Node.js (Express.js): Đảm nhiệm các tác vụ tiếp nhận hồ sơ, tìm kiếm phân trang đa tiêu chí, xác thực phân quyền JWT/RBAC, tiếp nhận khảo sát đánh giá và xử lý ngôn ngữ tự nhiên.
  + Dịch vụ Java (Spring Boot) [16]: Đóng vai trò là Financial Calculation Engine chuyên trách, xử lý các phép tính tài chính công với lớp `BigDecimal` và quản lý giao dịch ACID an toàn.
- Tầng Dữ liệu và Tích hợp (Persistence & Integration Layer): Hệ quản trị CSDL quan hệ MySQL 8.0 lưu trữ 16 bảng dữ liệu chuẩn hóa 3NF [20], sẵn sàng kết nối liên thông qua Trục LGSP.

2.2. CÔNG NGHỆ FRONTEND VÀ GIAO DIỆN
- React 19 và TypeScript: Nâng cao hiệu năng hiển thị và bảo đảm Type Safety chặt chẽ theo các mẫu phát triển ứng dụng hiện đại [17], ngăn ngừa triệt để các lỗi runtime liên quan đến dữ liệu kiểu dữ liệu hồ sơ công dân.
- TanStack Router: Cung cấp cơ chế định tuyến Type-safe và tiền tải dữ liệu (pre-fetching), giúp tối ưu hóa tốc độ phản hồi trang dưới 50ms.
- Tailwind CSS: Xây dựng hệ thống giao diện chuẩn mực công vụ, bảo đảm tính trang trọng và thống nhất trên toàn bộ các biểu mẫu hành chính.
- Thư viện Recharts [17]: Hiển thị các dạng biểu đồ chuyên biệt như Biểu đồ cột phân tầng kinh phí 14 phường, Biểu đồ Radar 4 tiêu chí SIPAS và biểu đồ tiến độ thực hiện chi trả.

2.3. CÔNG NGHỆ BACKEND VÀ DỊCH VỤ XỬ LÝ TRUNG TÂM
2.3.1. Node.js (Express.js) trong Xử lý Tác vụ I/O và CRUD
Node.js vận hành trên cơ chế hướng sự kiện (Event-driven) và Non-blocking I/O. Khi tiếp nhận nhiều yêu cầu tìm kiếm, tra cứu hồ sơ đồng thời từ các phường, luồng xử lý chính duy trì khả năng đáp ứng nhanh chóng mà không bị nghẽn tài nguyên. Định dạng JSON nguyên bản giúp quá trình trao đổi dữ liệu giữa Frontend và CSDL diễn ra liền mạch, hiệu quả.

2.3.2. Java (Spring Boot) trong Xử lý Tài chính và Giao dịch ACID
Trong nghiệp vụ quản lý tài chính công, số liệu chi trả phải bảo đảm chính xác tuyệt đối. Java Spring Boot [16] được tin cậy lựa chọn cho module tài chính nhờ các ưu thế vượt trội:
- Sử dụng lớp `BigDecimal`: Khắc phục hoàn toàn hiện tượng sai số làm tròn số thực của các kiểu dữ liệu nguyên thủy (float, double), hỗ trợ chế độ làm tròn `RoundingMode.HALF_UP` chuẩn xác theo quy định tài chính nhà nước [10].
- Quản lý giao dịch `@Transactional`: Đảm bảo trọn vẹn 4 đặc tính ACID (Nguyên tử, Nhất quán, Cô lập, Bền vững). Trong trường hợp một bước thao tác gặp lỗi, toàn bộ tiến trình sẽ được Rollback về trạng thái an toàn, bảo vệ dữ liệu không bị sai lệch.

2.4. HỆ QUẢN TRỊ CƠ SỞ DỮ LIỆU MYSQL 8.0 VÀ CHUẨN HÓA CSDL
- Cơ sở dữ liệu được tổ chức trên hệ quản trị MySQL 8.0 với Storage Engine InnoDB, hỗ trợ ràng buộc khóa ngoại (Foreign Keys) và giao dịch toàn vẹn.
- Chuẩn hóa CSDL đạt Dạng chuẩn 3 (3NF) theo giáo trình [20]: Loại bỏ hoàn toàn sự dư thừa dữ liệu và các phụ thuộc bắc cầu; dữ liệu danh mục phường, danh mục đối tượng và vai trò quản trị được tách thành các bảng riêng biệt.
- Tối ưu hóa chỉ mục B-Tree: Thiết lập chỉ mục trên các cột tra cứu chính (`so_cccd`, `ward_id`, `trang_thai_hs`), giúp rút ngắn thời gian xử lý truy vấn xuống mức tối ưu theo cẩm nang High Performance MySQL của Baron Schwartz [18].

2.5. GIẢI PHÁP TÍCH HỢP LIÊN THÔNG LGSP VÀ AN TOÀN THÔNG TIN
- Trục chia sẻ dữ liệu LGSP: Cho phép hệ thống sẵn sàng đồng bộ hai chiều với cơ sở dữ liệu tập trung cấp tỉnh và CSDL Dân cư theo Đề án 06/CP [9].
- Bảo mật đường truyền Mutual TLS (mTLS 1.3): Đảm bảo thông tin truyền tải trên mạng được mã hóa toàn vẹn với chứng thư số X.509 hợp lệ ở cả hai đầu kết nối theo Luật An ninh mạng [1].
- Cơ chế xác thực OAuth 2.0: Cấp mã token truy cập có thời hạn, phân quyền nghiêm ngặt theo từng phạm vi nghiệp vụ.
- Tuân thủ Nghị định 13/2023/NĐ-CP [7]: Thực hiện kỹ thuật che mặt nạ dữ liệu (Data Masking) đối với số CCCD khi hiển thị trên các kênh tra cứu công khai.

2.6. LÝ THUYẾT VÀ QUY TRÌNH KIỂM THỬ PHẦN MỀM (QA/QC)
Nhằm bảo đảm chất lượng phần mềm công vụ trước khi đưa vào ứng dụng, quy trình QA/QC được triển khai nghiêm túc theo chuẩn mực quốc tế ISTQB [14], nguyên lý kiểm thử hộp đen của Glenford Myers [12], kỹ thuật kiểm thử biên của Paul Ammann và Jeff Offutt [13], cùng Giáo trình Kiểm thử Phần mềm của Nhà trường [19]:
- Kiểm thử hộp đen (Black-box Testing) [12]: Kiểm tra chức năng dựa trên tài liệu yêu cầu nghiệp vụ SRS [11] và các căn cứ pháp lý mà không can thiệp vào mã nguồn nội bộ.
- Phân vùng tương đương và Phân tích giá trị biên [13]: Thiết kế dữ liệu thử nghiệm tại các điểm biên quan trọng (như tỷ lệ thương tật 20%, 21%, 80%, 81%, 100%) để triệt tiêu lỗi so sánh logic.
- Kiểm thử chuyển trạng thái [14]: Đảm bảo vòng đời hồ sơ chuyển đổi chính xác qua các nấc thẩm định: Tiếp nhận -> Chờ duyệt -> Đã duyệt -> Báo giảm khi từ trần."""

CHUONG_3_TEXT = """3.1. PHÂN TÍCH CÁC TÁC NHÂN (ACTORS) VÀ MÔ HÌNH PHÂN QUYỀN RBAC
Hệ thống thiết lập 5 nhóm tác nhân người dùng với quyền hạn phân định rõ ràng:
1. Cán bộ Tiếp nhận Một cửa (cấp Phường): Tiếp nhận hồ sơ từ người dân, kiểm tra thành phần giấy tờ, xuất Giấy hẹn tiếp nhận Mẫu số 01 có mã QR Code theo Nghị định 61/2018/NĐ-CP [6] và thực hiện tiếp nhận báo giảm khi có đối tượng từ trần.
2. Chuyên viên Thẩm định (cấp Phòng): Rà soát tính pháp lý và căn cứ y khoa của hồ sơ, kích hoạt thuật toán tính toán trợ cấp tự động theo Nghị định 75/2021/NĐ-CP [4] và Nghị định 55/2023/NĐ-CP [5], lập dự thảo quyết định hưởng.
3. Lãnh đạo Phê duyệt: Kiểm tra nội dung thẩm định, thực hiện ký số điện tử công vụ PKI SmartCA để ban hành quyết định và theo dõi bảng điều hành tổng thể.
4. Quản trị viên Hệ thống: Quản lý danh mục tham số mức chuẩn trợ cấp, phân quyền tài khoản cán bộ và giám sát nhật ký kiểm toán hệ thống theo quy định [1], [7].
5. Công dân và Thân nhân: Sử dụng cổng tra cứu trực tuyến để theo dõi tiến độ hồ sơ qua số CCCD (được che bảo mật theo [7]) và đánh giá sự phục vụ tại màn hình Kiosk Một cửa.

3.2. SƠ ĐỒ USE CASE TỔNG QUÁT VÀ ĐẶC TẢ CÁC USE CASE TRỌNG TÂM
Hệ thống xây dựng 11 nhóm chức năng trọng tâm theo Tài liệu SRS [11]:
- UC-01: Tiếp nhận hồ sơ và In Giấy hẹn Một cửa chuẩn Nghị định số 61/2018/NĐ-CP [6] có mã QR Code tra cứu.
- UC-02: Số hóa tài liệu hồ sơ bằng công nghệ nhận dạng ký tự quang học AI OCR.
- UC-03: Thẩm định hồ sơ y khoa và Tự động áp giá trợ cấp theo Nghị định số 75/2021/NĐ-CP [4] và Nghị định 55/2023/NĐ-CP [5].
- UC-04: Lập danh sách chi trả định kỳ và Xuất Phiếu chi trợ cấp Mẫu C70a-HD theo Thông tư số 101/2018/TT-BTC [10].
- UC-05: Tiếp nhận báo giảm từ trần và Ban hành Quyết định Mai táng phí Mẫu số 02 (Nghị định số 131/2021/NĐ-CP [3]).
- UC-06: Quản lý kế hoạch điều dưỡng phục hồi sức khỏe luân phiên theo quy định [4].
- UC-07: Quản lý cấp phát phương tiện trợ giúp và dụng cụ chỉnh hình theo niên hạn [4].
- UC-08: Số hóa bản đồ Nghĩa trang Liệt sĩ GIS và hỗ trợ tra cứu thông tin bia mộ trực tuyến.
- UC-09: Cổng dịch vụ công tra cứu tiến độ xử lý hồ sơ và lịch nhận trợ cấp cho công dân.
- UC-10: Thu thập ý kiến khảo sát đánh giá chất lượng dịch vụ công tại Kiosk cảm ứng Một cửa.
- UC-11: Giám sát chỉ số hài lòng CSAT, Biểu đồ Radar 4 tiêu chí SIPAS và phân tích phản hồi công dân.

3.3. SƠ ĐỒ TUẦN TỰ (SEQUENCE DIAGRAMS)
3.3.1. Sơ đồ Tuần tự Thẩm định Hồ sơ và Tự động Tính trợ cấp
Tiến trình diễn ra qua các bước:
1. Cán bộ thẩm định gửi thông tin thẩm tra hồ sơ từ giao diện Web đến API Gateway.
2. Gateway kiểm tra token xác thực, điều hướng yêu cầu đến Core Calculation Engine bằng Java Spring Boot [16].
3. Spring Boot truy xuất mức chuẩn trợ cấp (2.055.000 đồng) [4], [5] và hệ số tương ứng với tỷ lệ tổn thương cơ thể.
4. Áp dụng thuật toán `BigDecimal` tính toán chính xác số tiền trợ cấp và phụ cấp chăm sóc.
5. Kết quả tính toán được trả về dịch vụ Node.js để ghi nhận vào giao dịch CSDL MySQL [20].
6. Hệ thống cập nhật bảng quyết định hưởng và chuyển trạng thái hồ sơ thành Đã duyệt, thông báo kết quả tức thì đến cán bộ.

3.3.2. Sơ đồ Tuần tự Thu thập và Phân tích Đánh giá CSAT Công dân
1. Công dân thao tác tại Kiosk cảm ứng hoặc quét mã QR trên Giấy hẹn tiếp nhận [6].
2. Màn hình hiển thị thang điểm đánh giá 4 tiêu chí SIPAS và ô nhập ý kiến đóng góp.
3. Công dân chọn mức độ hài lòng và gửi đánh giá.
4. Hệ thống phân tích nội dung góp ý, tự động phân loại sắc thái phản hồi để cập nhật vào cơ sở dữ liệu.
5. Biểu đồ Radar trên màn hình giám sát của Lãnh đạo cập nhật tức thì dữ liệu điểm số mới nhất.

3.4. THIẾT KẾ CƠ SỞ DỮ LIỆU CHI TIẾT (16 BẢNG CHUẨN 3NF)
Cơ sở dữ liệu được tổ chức khoa học với 16 bảng dữ liệu chuẩn 3NF theo giáo trình [20], mô tả đầy đủ các trường thông tin, kiểu dữ liệu và mối quan hệ ràng buộc khóa ngoại (Trình bày chi tiết tại Bảng 3.1 đến Bảng 3.16).

3.5. THIẾT KẾ RESTFUL API CONTRACTS
Hệ thống thiết kế bộ quy chuẩn 12 RESTful API giao tiếp an toàn qua giao thức HTTPS theo Tài liệu SRS [11], trả về định dạng chuẩn JSON và các mã trạng thái HTTP chuẩn mực (`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`)."""

CHUONG_4_TEXT = """4.1. CHI TIẾT CÀI ĐẶT CÁC THUẬT TOÁN VÀ LOGIC NGHIỆP VỤ CỐT LÕI
4.1.1. Module Tính toán Trợ cấp Ưu đãi bằng Java Spring Boot (BigDecimal)
Thuật toán tính toán định mức kinh phí được cài đặt chuẩn xác trên nền tảng Spring Boot [16] theo Nghị định số 75/2021/NĐ-CP [4], Nghị định số 55/2023/NĐ-CP [5] và Pháp lệnh số 02/2020/UBTVQH14 [2]:
- Mức chuẩn trợ cấp áp dụng: 2.055.000 VNĐ.
- Đối với Thương binh:
  + Tỷ lệ thương tật 21% - 40%: Hệ số 1.15 -> Mức trợ cấp: 2.363.000 VNĐ/tháng.
  + Tỷ lệ thương tật 41% - 60%: Hệ số 1.82 -> Mức trợ cấp: 3.740.000 VNĐ/tháng.
  + Tỷ lệ thương tật 61% - 80%: Hệ số 2.63 -> Mức trợ cấp: 5.405.000 VNĐ/tháng.
  + Tỷ lệ thương tật 81% - 100%: Hệ số 3.85 -> Mức trợ cấp: 7.912.000 VNĐ/tháng; trường hợp có người chăm sóc được cộng thêm 1.0 lần mức chuẩn (2.055.000 VNĐ).
- Đối với Bà mẹ Việt Nam Anh hùng: Trợ cấp bằng 3.0 lần mức chuẩn (6.165.000 VNĐ) và phụ cấp chăm sóc bằng 1.0 lần mức chuẩn (2.055.000 VNĐ), tổng thực nhận 8.220.000 VNĐ/tháng.

4.1.2. Module Đọc Số tiền thành Chữ Tiếng Việt Chuẩn Biểu mẫu Tài chính C70a-HD
Chứng từ tài chính bắt buộc phải thể hiện số tiền bằng chữ tiếng Việt rõ ràng theo Thông tư số 101/2018/TT-BTC [10]. Hàm chuyển đổi số tiền phân tách giá trị thành các lớp hàng tỷ, triệu, nghìn và đơn vị, xử lý chuẩn xác các quy tắc phát âm tiếng Việt (như 'mười một', 'hai mươi mốt', 'lẻ năm', 'mười lăm'). Ví dụ: Số tiền 5.405.000 VNĐ được thể hiện chuẩn mực là "Năm triệu bốn trăm lẻ năm nghìn đồng chẵn."

4.1.3. Module Phân tích Cảm xúc Phản hồi Công dân (Sentiment Analysis AI)
Module xử lý ngôn ngữ tự nhiên tiếp nhận các dòng ý kiến đánh giá tự do của công dân. Thuật toán chuẩn hóa chuỗi và nhận diện các từ khóa chuyên môn để phân loại phản hồi thành hai nhóm: Tích cực (hài lòng, nhiệt tình, nhanh chóng) và Cần lưu ý (chậm, chờ lâu, chưa rõ ràng), tự động gửi thông báo đến bộ phận quản lý khi phát hiện trường hợp cần cải thiện chất lượng phục vụ.

4.1.4. Module AI OCR Số hóa Tài liệu Lưu trữ Kháng chiến
Nhằm hỗ trợ công tác bảo tồn hồ sơ kháng chiến cũ, module ứng dụng mô hình OCR nhận diện văn bản quang học. Thuật toán hỗ trợ lọc nhiễu, tăng độ tương phản và trích xuất tự động các trường dữ liệu quan trọng như Họ tên, Ngày hy sinh, Nguyên quán, Số Bằng Tổ quốc ghi công, giúp cán bộ rút ngắn đáng kể thời gian nhập liệu thủ công.

4.1.5. Chữ ký số Điện tử PKI SmartCA Bảo đảm Tính Pháp lý
Quyết định phê duyệt được ký số bằng chứng thư số công vụ PKI với mã băm SHA-256. Con dấu điện tử hiển thị kèm dấu thời gian thực và chữ ký số hợp lệ của Lãnh đạo, bảo đảm tính xác thực và chống chối bỏ trách nhiệm theo quy định của Luật Giao dịch điện tử và Luật An ninh mạng [1].

4.1.6. Module Báo giảm Từ trần và Ban hành Quyết định Mai táng phí Mẫu 02
Khi tiếp nhận trích lục khai tử của người có công, hệ thống kích hoạt chuỗi xử lý tự động: Cập nhật trạng thái hồ sơ thành Đã từ trần, tạm dừng danh sách phát tiền định kỳ ở các kỳ tiếp theo và tạo dự thảo Quyết định trợ cấp Mai táng phí bằng 10 tháng mức chuẩn (20.550.000 VNĐ) theo Mẫu số 02 - Nghị định số 131/2021/NĐ-CP [3].

4.1.7. Module Đối soát Chi trả Ngân hàng Tự động theo Đề án 06/CP
Hệ thống cho phép nạp file sao kê chi trả từ ngân hàng thương mại, tự động so khớp số CCCD 12 số và số tiền giao dịch theo Đề án 06/CP [9]. Các trường hợp khớp đúng được xác nhận thành công tức thì, những trường hợp sai lệch số tài khoản hoặc đối tượng đã từ trần được cảnh báo kịp thời để cán bộ xử lý.

4.2. TRÌNH DIỄN KẾT QUẢ GIAO DIỆN HỆ THỐNG KÈM 21 HÌNH ẢNH CHỤP MÀN HÌNH THỰC TẾ
Hệ thống gồm 21 màn hình giao diện công vụ hoàn chỉnh được xây dựng trên nền tảng React 19 và TypeScript [17], được trình bày và thuyết minh chi tiết từ mục 4.2.1 đến 4.2.21."""

CHUONG_5_TEXT = """5.1. KẾ HOẠCH KIỂM THỬ VÀ MÔI TRƯỜNG THỰC HIỆN
Để đảm bảo chất lượng, tính chính xác và độ an toàn của hệ thống trước khi triển khai, kế hoạch kiểm thử QA/QC được xây dựng toàn diện dựa trên nguyên lý kiểm thử của Glenford Myers [12], tiêu chuẩn quốc tế ISTQB [14], phương pháp thiết kế ca kiểm thử của Ammann & Offutt [13], bám sát Giáo trình Kiểm thử Phần mềm ĐH Thủ Dầu Một [19] và đối chiếu với Tài liệu Đặc tả Yêu cầu SRS [11]:
- Phạm vi kiểm thử: Toàn bộ 14 phân hệ giao diện người dùng, 45 RESTful API endpoints, các ràng buộc dữ liệu CSDL MySQL [20] và hiệu năng chịu tải.
- Môi trường kiểm thử:
  + Máy chủ ứng dụng: Node.js v22.x, Java OpenJDK 21, Spring Boot 3.3 [16].
  + Hệ quản trị CSDL: MySQL Server 8.0.36 Community Edition [18], [20].
  + Trình duyệt kiểm thử: Google Chrome (phiên bản 126 trở lên).
  + Công cụ hỗ trợ: Postman (Kiểm thử API), Apache JMeter (Kiểm thử tải).

5.2. DANH MỤC CHECKLIST KIỂM THỬ CHỨC NĂNG VÀ GIAO DIỆN
Bộ Checklist kiểm thử gồm 30 hạng mục được xây dựng theo chuẩn mực ISTQB [14] nhằm bao quát các tiêu chuẩn về giao diện, tính hợp lệ của dữ liệu đầu vào, quy tắc nghiệp vụ và bảo mật (Trình bày chi tiết tại Bảng 5.1).

5.3. BẢNG KỊCH BẢN KIỂM THỬ CHI TIẾT (TEST CASES SPECIFICATION)
Bộ kịch bản kiểm thử gồm 50 Test Cases đại diện cho tất cả các phân hệ theo kỹ thuật phân vùng tương đương và giá trị biên [13], bao gồm đầy đủ thông tin: Mã kịch bản, Phân hệ, Mục tiêu, Các bước thực hiện, Dữ liệu thử nghiệm, Kết quả mong đợi, Kết quả thực tế và Trạng thái kiểm thử (Trình bày chi tiết tại Bảng 5.2).

5.4. BẢNG GHI NHẬN VÀ QUẢN LÝ LỖI (BUG REPORT SHEET)
Trong quá trình kiểm thử, sinh viên đã phát hiện và lập biên bản theo dõi 15 lỗi phần mềm (Bugs) theo vòng đời quản lý lỗi chuẩn ISTQB [14], phân loại cụ thể theo mức độ nghiêm trọng và mức độ ưu tiên xử lý (Trình bày chi tiết tại Bảng 5.3). Toàn bộ 15 lỗi đều đã được đội ngũ phối hợp khắc phục và kiểm thử lại đạt yêu cầu.

5.5. BÁO CÁO TỔNG KẾT CHẤT LƯỢNG KIỂM THỬ (TEST SUMMARY REPORT)
- Tổng số kịch bản kiểm thử thực thi: 50 / 50 kịch bản (Đạt 100%).
- Tỷ lệ kịch bản Đạt sau kiểm thử lại: 100%.
- Tổng số lỗi phát hiện và xử lý: 15 / 15 lỗi đã đóng hoàn toàn (Closed).
- Kết luận: Phiên bản phần mềm đáp ứng đầy đủ các yêu cầu kỹ thuật theo SRS [11], vận hành ổn định và sẵn sàng cho giai đoạn triển khai thử nghiệm."""

CHUONG_6_TEXT = """6.1. SO SÁNH THỰC TẾ VỚI LÝ THUYẾT TRÊN GIẢNG ĐƯỜNG
6.1.1. So sánh Quy trình Kiểm thử Phần mềm
- Lý thuyết trên giảng đường: Sinh viên được học các nguyên lý cơ bản của kiểm thử (V-Model, Agile), các kỹ thuật thiết kế ca kiểm thử như Phân vùng tương đương, Giá trị biên theo giáo trình [19]. Tuy nhiên, các bài thực hành chủ yếu áp dụng trên những ứng dụng nhỏ, dữ liệu đơn giản và tập trung vào các luồng kiểm thử giao diện thông thường.
- Thực tế tại cơ quan tiếp nhận: Kiểm thử phần mềm hành chính công đòi hỏi tính chuẩn xác tuyệt đối, bởi mỗi số liệu đều liên quan trực tiếp đến quyền lợi người dân và ngân sách nhà nước. Quy trình QA/QC thực tế đòi hỏi việc thiết lập bộ tài liệu đồng bộ từ Checklist, Test Case, Bug Report đến Báo cáo tổng hợp theo chuẩn quốc tế ISTQB [14], đặc biệt chú trọng kiểm thử API và bảo đảm tính toàn vẹn nghiệp vụ.

6.1.2. So sánh Phân tích, Thiết kế và Quản trị Cơ sở Dữ liệu MySQL
- Lý thuyết trên giảng đường: Giảng dạy các dạng chuẩn 1NF đến 3NF, mô hình ERD và câu lệnh truy vấn SQL theo Giáo trình Cơ sở Dữ liệu [20] với mục tiêu trọng tâm là loại bỏ dư thừa dữ liệu.
- Thực tế tại cơ quan tiếp nhận: Bên cạnh chuẩn hóa CSDL, thực tiễn đòi hỏi phải giải quyết bài toán tối ưu hóa hiệu năng truy vấn thông qua B-Tree Indexing theo cẩm nang High Performance MySQL [18], lưu vết lịch sử cập nhật để phục vụ công tác thanh tra công vụ và áp dụng kỹ thuật che giấu dữ liệu cá nhân theo quy định của pháp luật [7].

6.1.3. So sánh Lập trình Backend và Tích hợp Hệ thống
- Lý thuyết trên giảng đường: Cung cấp kiến thức xây dựng các dịch vụ RESTful API cơ bản với một công nghệ đơn lẻ và luồng dữ liệu giả định.
- Thực tế tại cơ quan tiếp nhận: Áp dụng kiến trúc lai kết hợp Modular Monolith của Martin Fowler [15], phát huy sức mạnh của Node.js cho các tác vụ I/O nhanh và Java Spring Boot [16] cho tác vụ tài chính bằng `BigDecimal` cùng giao dịch ACID. Đồng thời, việc tích hợp đòi hỏi sự am hiểu về các tiêu chuẩn liên thông LGSP và bảo mật đường truyền mTLS.

6.1.4. So sánh Phương thức Làm việc và Môi trường Công vụ
- Môi trường học tập: Sinh viên làm việc độc lập hoặc theo nhóm học tập, thời gian linh hoạt và ít bị ràng buộc bởi các quy chế kỷ luật công quyền.
- Môi trường công vụ thực tế: Vận hành theo kỷ luật hành chính nghiêm túc, tuân thủ giờ giấc và quy định bảo mật cơ quan nhà nước. Mọi thay đổi kỹ thuật đều phải thông qua quy trình kiểm thử và báo cáo xin ý kiến cán bộ hướng dẫn.

6.1.5. So sánh Về Yêu cầu Tuân thủ Pháp luật và An toàn Dữ liệu Công dân
- Môi trường học tập: Dữ liệu đồ án môn học thường là dữ liệu mô phỏng, ít phát sinh các vấn đề pháp lý.
- Môi trường công vụ thực tế: Bắt buộc phải tuân thủ nghiêm ngặt Luật An ninh mạng [1] và Nghị định 13/2023/NĐ-CP [7]. Thông tin căn cước công dân và thân nhân là dữ liệu cá nhân nhạy cảm, phải được bảo vệ và mã hóa đúng quy chuẩn.

6.2. NHỮNG KINH NGHIỆM THỰC TIỄN RÚT RA SAU QUÁ TRÌNH THỰC TẬP
Qua 03 tháng thực tập tại Phòng Văn hóa và Thông tin thành phố Thủ Dầu Một, sinh viên đã tích lũy được nhiều kinh nghiệm quý báu:
- Nâng cao năng lực phân tích văn bản quy phạm pháp luật [2], [3], [4] để chuyển hóa thành thuật toán phần mềm chính xác.
- Hình thành tư duy kiểm thử chuyên nghiệp (QA/QC Mindset), rèn luyện tính cẩn trọng, tỉ mỉ và phương pháp tư duy phản biện theo chuẩn ISTQB [14].
- Nâng cao kỹ năng thiết kế CSDL quan hệ chuẩn 3NF [20], tối ưu hóa chỉ mục theo [18] và xây dựng RESTful API an toàn.
- Học hỏi tác phong làm việc công vụ chuẩn mực, kỹ năng giao tiếp và tinh thần trách nhiệm trong công việc.

6.3. ĐỀ XUẤT CÁC GIẢI PHÁP CẢI TIẾN
6.3.1. Đối với Cơ quan Tiếp nhận Thực tập
- Chuẩn hóa tài liệu hướng dẫn kỹ thuật và quy trình nghiệp vụ dành cho các đợt thực tập sinh tiếp theo.
- Từng bước áp dụng các công cụ kiểm thử tự động (Automation Testing) vào quy trình kiểm thử hồi quy khi cập nhật phần mềm.
- Duy trì cơ chế sao lưu dữ liệu tự động định kỳ để bảo đảm tính an toàn tuyệt đối cho cơ sở dữ liệu.

6.3.2. Đối với Nhà trường và Viện Công nghệ số
- Lồng ghép thêm các đồ án mô phỏng bài toán hành chính công và chính quyền số vào chương trình đào tạo để sinh viên sớm tiếp cận thực tiễn.
- Tăng cường thời lượng thực hành về kiểm thử API (Postman), quản trị lỗi dự án và an toàn thông tin trong các học phần chuyên ngành [19].
- Tiếp tục mở rộng quan hệ hợp tác với các cơ quan, đơn vị trên địa bàn để tạo thêm môi trường thực tập chất lượng cho sinh viên.

6.3.3. Đối với Bản thân Sinh viên
- Tiếp tục trau dồi kỹ năng kiểm thử tự động và nghiên cứu chuyên sâu về tối ưu hóa cơ sở dữ liệu lớn [18].
- Đặt mục tiêu học tập và thi lấy các chứng chỉ kiểm thử quốc tế như ISTQB Foundation [14] trong thời gian tới.
- Nâng cao trình độ tiếng Anh chuyên ngành và rèn luyện kỹ năng mềm để phát triển vững chắc trên con đường nghề nghiệp."""

CHUONG_7_TEXT = """7.1. KẾT LUẬN TỔNG QUAN
Trong thời gian thực tập tốt nghiệp tại Phòng Văn hóa và Thông tin thành phố Thủ Dầu Một, sinh viên đã hoàn thành đầy đủ các nhiệm vụ và mục tiêu đề ra:
1. Về nghiệp vụ: Nghiên cứu kỹ lưỡng các văn bản pháp luật nền tảng [2], [3], [4], [5], [9] và khảo sát toàn diện quy trình quản lý chính sách người có công tại địa phương.
2. Về cơ sở dữ liệu: Thiết kế và cài đặt thành công CSDL MySQL 8.0 chuẩn hóa 3NF [20] gồm 16 bảng dữ liệu, tối ưu hóa tốc độ truy vấn bằng B-Tree Indexing theo [18].
3. Về phát triển hệ thống: Xây dựng các dịch vụ RESTful API bằng Node.js và Java Spring Boot [16], hoàn thiện công thức tính toán trợ cấp chuẩn xác bằng `BigDecimal` và quản lý giao dịch ACID an toàn.
4. Về kiểm thử phần mềm: Hoàn thành bộ tài liệu QA/QC chuyên nghiệp gồm Checklist 30 mục [14], 50 Test Cases [13], 15 Bug Reports và Test Summary Report theo chuẩn ISTQB [14], theo dõi xử lý dứt điểm các lỗi phát sinh.

* Điểm mạnh của đề tài:
- Bám sát yêu cầu chuyển đổi số thực tế [8] và nhiệm vụ an sinh xã hội tại địa phương theo Đề án 06/CP [9].
- Kiến trúc phần mềm phân tầng rõ ràng [15], kết hợp hiệu quả giữa Node.js, Java Spring Boot [16], React 19 [17] và MySQL [18], [20].
- Giải quyết tốt các bài toán then chốt: Tính toán định mức tài chính chuẩn xác [4], hỗ trợ đối soát ngân hàng theo Đề án 06/CP [9], tự động ngắt chi trả khi báo giảm [3] và Kiosk đánh giá dịch vụ công độc lập.

* Hạn chế còn tồn tại:
- Do thời gian thực tập có hạn nên chưa triển khai được quy trình tích hợp và phân phối liên tục (CI/CD) tự động hoàn chỉnh.
- Việc kiểm thử tải mới thực hiện trên môi trường mạng nội bộ thử nghiệm, cần tiếp tục kiểm tra khi triển khai diện rộng trên toàn thành phố.

7.2. ĐÁNH GIÁ HIỆU QUẢ KINH TẾ - XÃ HỘI
- Hiệu quả kinh tế: Giảm thiểu chi phí in ấn biểu mẫu giấy tờ hành chính; tiết kiệm đáng kể thời gian đối soát dữ liệu ngân hàng và hạn chế rủi ro chi trả chậm trễ.
- Hiệu quả xã hội: Tạo thuận lợi cho thân nhân và công dân khi tra cứu thông tin; nâng cao tính công khai, minh bạch của công tác an sinh xã hội và góp phần cải thiện các chỉ số phục vụ nhân dân tại địa phương.

7.3. KIẾN NGHỊ
7.3.1. Kiến nghị với Cơ quan Thực tập
- Đề nghị Lãnh đạo đơn vị xem xét nghiệm thu và đưa hệ thống vào ứng dụng thử nghiệm chính thức tại Bộ phận Một cửa thành phố và các phường.
- Xem xét kế hoạch trang bị thêm màn hình cảm ứng Kiosk tại các phường để nhân dân thuận tiện tham gia đánh giá chất lượng phục vụ.
- Thiết lập quy trình sao lưu dữ liệu tự động hàng ngày sang máy chủ dự phòng để đảm bảo an toàn thông tin theo quy định [1].

7.3.2. Kiến nghị với Khoa / Bộ môn Kỹ thuật Phần mềm
- Tiếp tục duy trì và mở rộng chương trình gửi sinh viên thực tập tại các cơ quan quản lý nhà nước trên địa bàn tỉnh.
- Tăng cường nội dung thực hành về kiểm thử API chuyên sâu và an toàn thông tin trong chương trình giảng dạy.

7.4. HƯỚNG PHÁT TRIỂN TRONG TƯƠNG LAI
- Tích hợp xác thực định danh điện tử VNeID qua cổng kết nối của Bộ Công an khi công dân thực hiện thủ tục trực tuyến theo Đề án 06/CP [9].
- Ứng dụng công nghệ ảnh không gian 3D/VR 360 độ phục vụ công tác số hóa bản đồ nghĩa trang liệt sĩ, giúp thân nhân thuận tiện viếng thăm từ xa."""

TAI_LIEU_THAM_KHAO = [
    "[1] Quốc hội nước Cộng hòa Xã hội Chủ nghĩa Việt Nam. Luật An ninh mạng số 24/2018/QH14. Hà Nội, 2018.",
    "[2] Ủy ban Thường vụ Quốc hội. Pháp lệnh Ưu đãi người có công với cách mạng số 02/2020/UBTVQH14. Hà Nội, 2020.",
    "[3] Chính phủ nước Cộng hòa Xã hội Chủ nghĩa Việt Nam. Nghị định số 131/2021/NĐ-CP Quy định chi tiết và biện pháp thi hành Pháp lệnh Ưu đãi người có công với cách mạng. Hà Nội, 2021.",
    "[4] Chính phủ nước Cộng hòa Xã hội Chủ nghĩa Việt Nam. Nghị định số 75/2021/NĐ-CP Quy định mức hưởng trợ cấp, phụ cấp và các chế độ ưu đãi người có công với cách mạng. Hà Nội, 2021.",
    "[5] Chính phủ nước Cộng hòa Xã hội Chủ nghĩa Việt Nam. Nghị định số 55/2023/NĐ-CP Sửa đổi, bổ sung một số điều của Nghị định số 75/2021/NĐ-CP quy định mức hưởng trợ cấp ưu đãi người có công. Hà Nội, 2023.",
    "[6] Chính phủ nước Cộng hòa Xã hội Chủ nghĩa Việt Nam. Nghị định số 61/2018/NĐ-CP về thực hiện cơ chế một cửa, một cửa liên thông trong giải quyết thủ tục hành chính. Hà Nội, 2018.",
    "[7] Chính phủ nước Cộng hòa Xã hội Chủ nghĩa Việt Nam. Nghị định số 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân. Hà Nội, 2023.",
    "[8] Thủ tướng Chính phủ. Quyết định số 749/QĐ-TTg phê duyệt Chương trình Chuyển đổi số quốc gia đến năm 2025, định hướng đến năm 2030. Hà Nội, 2020.",
    "[9] Thủ tướng Chính phủ. Quyết định số 06/QĐ-TTg phê duyệt Đề án phát triển ứng dụng dữ liệu về dân cư, định danh và xác thực điện tử phục vụ chuyển đổi số quốc gia giai đoạn 2022 - 2025 (Đề án 06/CP). Hà Nội, 2022.",
    "[10] Bộ Tài chính. Thông tư số 101/2018/TT-BTC quy định quản lý và sử dụng kinh phí thực hiện chính sách ưu đãi người có công với cách mạng. Hà Nội, 2018.",
    "[11] UBND TP. Thủ Dầu Một. Tài liệu Đặc tả Yêu cầu Phần mềm (SRS) - Hệ thống Quản lý Hồ sơ Người có công. Bình Dương, 2026.",
    "[12] Glenford J. Myers, Corey Sandler, Tom Badgett. The Art of Software Testing, 3rd Edition. John Wiley & Sons, 2011.",
    "[13] Paul Ammann, Jeff Offutt. Introduction to Software Testing, 2nd Edition. Cambridge University Press, 2016.",
    "[14] Rex Black, Dorothy Graham. Foundations of Software Testing: ISTQB Certification, 4th Edition. Cengage Learning, 2019.",
    "[15] Martin Fowler. Patterns of Enterprise Application Architecture. Addison-Wesley Professional, 2002.",
    "[16] Craig Walls. Spring in Action, 6th Edition. Manning Publications, 2022.",
    "[17] Alex Banks, Eve Porcello. Learning React: Modern Patterns for Developing React Apps, 2nd Edition. O'Reilly Media, 2020.",
    "[18] Baron Schwartz, Peter Zaitsev, Vadim Tkachenko. High Performance MySQL, 4th Edition. O'Reilly Media, 2021.",
    "[19] Trường Đại học Thủ Dầu Một. Giáo trình Kiểm thử Phần mềm và Đảm bảo Chất lượng. Bình Dương: Đại học Thủ Dầu Một, 2024.",
    "[20] Trường Đại học Thủ Dầu Một. Giáo trình Cơ sở Dữ liệu và Hệ Quản trị CSDL. Bình Dương: Đại học Thủ Dầu Một, 2023."
]

print("report_text.py updated successfully with citations [1] to [20]!")
