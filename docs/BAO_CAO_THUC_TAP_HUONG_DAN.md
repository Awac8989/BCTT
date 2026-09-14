# 🏛️ TÀI LIỆU HƯỚNG DẪN VIẾT BÁO CÁO THỰC TẬP TỐT NGHIỆP / ĐỒ ÁN
## ĐỀ TÀI: XÂY DỰNG HỆ THỐNG QUẢN LÝ HỒ SƠ NGƯỜI CÓ CÔNG & ĐÁNH GIÁ DỊCH VỤ CÔNG (PHIÊN BẢN 2.0)
### Đơn vị kiến tập/thực tập: Sở Lao động - Thương binh và Xã hội tỉnh Bình Dương / Phòng LĐ-TB&XH TP. Thủ Dầu Một

---

## 📌 PHẦN 1: THÔNG TIN CHUNG VỀ ĐỀ TÀI

* **Tên đề tài tiếng Việt:** Nghiên cứu và xây dựng Hệ thống số hóa quản lý hồ sơ Người có công, tự động hóa chi trả trợ cấp và đánh giá dịch vụ công trực tuyến tại tỉnh Bình Dương.
* **Tên đề tài tiếng Anh:** Design and Development of Merit-People Profile Management, Automated Allowance Payment, and Public Service Satisfaction Assessment System.
* **Chuyên ngành:** Công nghệ thông tin / Kỹ thuật phần mềm / Hệ thống thông tin quản lý.
* **Cơ sở pháp lý nền tảng (Bắt buộc trích dẫn trong báo cáo):**
  1. *Pháp lệnh Ưu đãi người có công với cách mạng số 02/2020/UBTVQH14* ngày 09/12/2020 của Ủy ban Thường vụ Quốc hội.
  2. *Nghị định số 131/2021/NĐ-CP* ngày 30/12/2021 của Chính phủ quy định chi tiết và biện pháp thi hành Pháp lệnh Ưu đãi người có công.
  3. *Nghị định số 75/2021/NĐ-CP* và *Nghị định số 55/2023/NĐ-CP* quy định mức chuẩn trợ cấp, phụ cấp ưu đãi người có công.
  4. *Nghị định số 61/2018/NĐ-CP* về thực hiện cơ chế một cửa, một cửa liên thông (Mẫu số 01 - Giấy tiếp nhận và Hẹn trả kết quả).
  5. *Đề án 06/CP* của Thủ tướng Chính phủ về phát triển ứng dụng dữ liệu về dân cư, định danh và xác thực điện tử (chi trả không dùng tiền mặt qua tài khoản an sinh xã hội).

---

## 📑 PHẦN 2: KHUNG ĐỀ CƯƠNG BÁO CÁO CHI TIẾT (5 CHƯƠNG CHUẨN ĐẠI HỌC)

### CHƯƠNG 1: TỔNG QUAN VỀ CƠ QUAN THỰC TẬP & BỐI CẢNH ĐỀ TÀI
* **1.1. Giới thiệu đơn vị thực tập:**
  - Lịch sử hình thành và cơ cấu tổ chức của Sở Lao động - Thương binh và Xã hội tỉnh Bình Dương (hoặc Phòng LĐ-TB&XH TP. Thủ Dầu Một).
  - Chức năng, nhiệm vụ của Phòng Người có công và Bộ phận Tiếp nhận & Trả kết quả (Một cửa).
* **1.2. Khảo sát hiện trạng công tác quản lý chính sách người có công:**
  - Quy mô đối tượng: Hơn 12.000 người có công trên địa bàn TP. Thủ Dầu Một (Thương binh, Bệnh binh, Thân nhân liệt sĩ, Mẹ VNAH...).
  - Các khó khăn tồn tại của quy trình thủ công cũ:
    + Hồ sơ giấy qua nhiều thập niên bị mủn, mờ chữ, khó khăn trong việc tra cứu trích lục kháng chiến.
    + Chi trả trợ cấp hàng tháng qua ngân hàng/bưu điện đối soát thủ công bằng mắt dễ gây sai lệch hoặc chi trả nhầm cho người đã từ trần.
    + Chưa có công cụ số để người dân và thân nhân tra cứu tiến độ thụ lý và lịch phát tiền tại nhà.
    + Khảo sát sự hài lòng (SIPAS) trước đây làm trên phiếu giấy hình thức, cán bộ có thể can thiệp, thiếu tính khách quan.
* **1.3. Mục tiêu và phạm vi nghiên cứu của đề tài:**
  - Xây dựng một hệ thống số hóa toàn diện từ cấp Sở đến cấp Phòng/Xã.
  - Tự động hóa tính toán trợ cấp theo mức chuẩn và công thức luật định.
  - Độc lập hóa phân hệ đánh giá dịch vụ công CSAT qua QR Code / Kiosk cảm ứng.

---

### CHƯƠNG 2: CƠ SỞ LÝ THUYẾT & CÔNG NGHỆ SỬ DỤNG
* **2.1. Kiến trúc tổng thể:** Hybrid Modular Monolith kết hợp kiến trúc phân tầng (Presentation, Business Logic, Persistence Layer).
* **2.2. Công nghệ Frontend:**
  - **React 19 & TypeScript:** Đảm bảo an toàn kiểu dữ liệu (Type Safety) và hiệu năng render tức thì.
  - **TanStack Router & Start:** Định tuyến dựa trên file, tối ưu tải trang và SEO dịch vụ công.
  - **Tailwind CSS v4:** Xây dựng hệ thống giao diện công quyền chuẩn mực, trang trọng (sắc đỏ nhận diện hành chính, xanh dương công vụ).
  - **Recharts:** Biểu đồ trực quan hóa dữ liệu ngân sách, Radar 4 tiêu chí SIPAS, bản đồ nhiệt mật độ đối tượng 14 phường.
* **2.3. Công nghệ Backend & Cơ sở dữ liệu:**
  - **PostgreSQL / MySQL 8.0:** Mô hình quan hệ chuẩn hóa 3NF, đảm bảo toàn vẹn giao dịch ACID.
  - **Engine tính toán trợ cấp:** Thuật toán chuẩn hóa tỷ lệ tổn thương cơ thể (21% - 100%) và hệ số phụ cấp phục vụ.
  - **Engine phân tích Sentiment AI:** Phân loại cảm xúc tích cực/tiêu cực từ góp ý của người dân.
  - **Ký số điện tử (Digital Signature - PKI):** Mã hóa băm SHA-256 xác thực lãnh đạo phê duyệt.

---

### CHƯƠNG 3: PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG
* **3.1. Các tác nhân (Actors):**
  1. *Cán bộ Một cửa:* Nhập hồ sơ, xuất Giấy hẹn Mẫu 01 có QR, báo giảm đối tượng từ trần.
  2. *Chuyên viên Thẩm định:* Thẩm tra hồ sơ, y khoa, xác định định mức trợ cấp tự động.
  3. *Lãnh đạo Phòng / Sở:* Ký số phê duyệt quyết định hưởng trợ cấp, giám sát Dashboard toàn diện.
  4. *Công dân / Thân nhân:* Tra cứu tiến độ hồ sơ qua CCCD, tự do đánh giá CSAT tại Kiosk.
* **3.2. Sơ đồ Use Case chính:**
  - Use case 1: Tiếp nhận & Sinh Giấy hẹn Một cửa chuẩn Nghị định 61/2018/NĐ-CP.
  - Use case 2: Thẩm định hồ sơ 5 bước & Tự động tính trợ cấp theo Nghị định 75/2021/NĐ-CP.
  - Use case 3: Lập bảng kê chi trả & Xuất Phiếu chi trợ cấp Mẫu C70a-HD.
  - Use case 4: Báo giảm đối tượng từ trần & Ban hành Quyết định Mai táng phí (Mẫu số 02 - NĐ 131/2021).
  - Use case 5: Cấp phương tiện trợ giúp & Dụng cụ chỉnh hình theo niên hạn.
  - Use case 6: Bản đồ số Nghĩa trang Liệt sĩ & Định vị mộ trực quan (GIS).
  - Use case 7: Tra cứu tiến độ hồ sơ và lịch nhận tiền qua CCCD dành cho công dân.
  - Use case 8: Đánh giá độc lập chất lượng dịch vụ công (Kiosk / QR Code).
* **3.3. Thiết kế Cơ sở dữ liệu (16 Bảng chuẩn 3NF):**
  *(Xem chi tiết mã nguồn trong tệp `database/schema.sql`)*:
  - `dm_phuong`, `dm_loai_doi_tuong`, `sys_roles`, `sys_users`
  - `ho_so_ncc`, `quyet_dinh_huong`, `lich_su_chi_tra`, `khao_sat_danh_gia`, `chi_tiet_tieu_chi_danh_gia`
  - `ho_so_liet_sy`, `than_nhan_liet_si`, `ke_hoach_dieu_duong`, `danh_sach_dieu_duong`
  - `ho_so_bao_giam_mai_tang`, `danh_sach_phuong_tien_chinh_hinh`, `nghia_trang_mo_liet_si`, `doi_soat_chi_tra_ngan_hang`

---

### CHƯƠNG 4: HIỆN THỰC HÓA HỆ THỐNG VÀ KẾT QUẢ ĐẠT ĐƯỢC
*(Phần này bạn chụp màn hình các trang đã hoàn thiện đưa vào)*

| STT | Phân hệ / Màn hình | Đường dẫn | Chức năng nổi bật trong báo cáo |
| :---: | :--- | :--- | :--- |
| 1 | **Cổng đăng nhập công vụ** | `/login` | Chuyển đổi 1-Click phân quyền Admin Cấp Sở vs Cấp Phòng |
| 2 | **Bảng điều khiển điều hành** | `/` | Thống kê KPI, biểu đồ kinh phí phân tầng màu sắc, **Trung tâm Cảnh báo sớm Rủi ro** |
| 3 | **Quản lý hồ sơ Một cửa** | `/ho-so` | Tra cứu đa tiêu chí, xuất Excel, in Giấy hẹn Mẫu 01 có QR, **Quét OCR AI scan tài liệu cũ** |
| 4 | **Báo giảm & Mai táng phí** | Modal trong `/ho-so` | Khai tử, tự động ngừng chi trả hàng tháng, **In QĐ Mai táng phí Mẫu 02** |
| 5 | **Chi tiết hồ sơ liệt sĩ** | `/ho-so/$id` | Trích lục liệt sĩ, thân nhân thờ cúng, **Con dấu Ký số điện tử SmartCA** |
| 6 | **Thẩm định hồ sơ 5 bước** | `/tham-dinh` | Quy trình thụ lý chuẩn y khoa, duyệt bước liên tục, tự động tính trợ cấp |
| 7 | **Quản lý chi trả & Phiếu chi**| `/chi-tra` | Bảng kê C70a-HD, phát tiền ATM/Bưu điện, **Module Đối soát tự động ngân hàng** |
| 8 | **Điều dưỡng phục hồi NCC** | `/dieu-duong` | Kế hoạch năm, quản lý chu kỳ 1 năm / 2 năm, định mức tập trung vs tại nhà |
| 9 | **Dụng cụ chỉnh hình** | `/dung-cu-chinh-hinh`| Quản lý chân tay giả, xe lăn, máy trợ thính, theo dõi niên hạn 3-5 năm, in phiếu cấp |
| 10 | **Bản đồ số Nghĩa trang GIS** | `/nghia-trang` | Sơ đồ phân lô tương tác Khu A, B, C, D, định vị mộ, **Thắp hương tưởng niệm trực tuyến** |
| 11 | **Cổng tra cứu công dân** | `/tra-cuu` | Tra cứu bằng CCCD 12 số, ẩn 3 số bảo mật, xem tiến độ Một cửa & lịch phát tiền |
| 12 | **Kiosk Đánh giá CSAT** | `/khao-sat` | Giao diện công dân độc lập, nút bấm lớn, hình mặt cười 1-5 sao, gửi phản hồi |
| 13 | **Giám sát CSAT cán bộ** | `/danh-gia` | Radar 4 tiêu chí SIPAS, xếp hạng CSAT 14 phường, cảnh báo phản hồi tiêu cực |
| 14 | **Báo cáo thống kê chuyên sâu**| `/phan-tich` | Bản đồ nhiệt phân bố đối tượng, cơ cấu chính sách, dự báo ngân sách |

---

### CHƯƠNG 5: KẾT LUẬN & HƯỚNG PHÁT TRIỂN
* **5.1. Kết quả đạt được:**
  - Đã số hóa hoàn chỉnh 100% vòng đời quản lý chính sách người có công.
  - Loại bỏ hoàn toàn tình trạng sai sót tính toán định mức trợ cấp nhờ Engine tự động.
  - Minh bạch hóa chỉ số hài lòng dịch vụ công SIPAS, không còn tình trạng "vừa đá bóng vừa thổi còi".
  - Giảm 85% thời gian đối soát số liệu ngân hàng và lập danh sách chi trả hàng tháng.
* **5.2. Đánh giá hiệu quả kinh tế - xã hội:**
  - Tiết kiệm chi phí in ấn giấy tờ, biểu mẫu hàng năm của UBND Thành phố.
  - Ngăn ngừa nguy cơ thất thoát ngân sách nhà nước nhờ quy trình Báo giảm và Trung tâm Cảnh báo sớm.
  - Nâng cao chỉ số chuyển đổi số (DTI) và chỉ số cải cách hành chính (PAR INDEX) của địa phương.
* **5.3. Hướng phát triển trong tương lai:**
  - Kết nối trực tiếp API với Cơ sở dữ liệu Quốc gia về Dân cư (Đề án 06/BCA).
  - Tích hợp VNeID xác thực sinh trắc học khuôn mặt khi nhận tiền mặt tại bưu điện.
  - Ứng dụng công nghệ Flycam/3D tái hiện không gian ảo 360 độ Nghĩa trang Liệt sĩ tỉnh Bình Dương.

---

## 🎤 PHẦN 3: BỘ CÂU HỎI VẤN ĐÁP CỦA HỘI ĐỒNG CHẤM & GỢI Ý TRẢ LỜI

### Câu 1: Tại sao em lại tách phân hệ Đánh giá CSAT (`/khao-sat`) riêng biệt với hệ thống Cán bộ?
> **Gợi ý trả lời:** *"Thưa Thầy/Cô, việc tách bạch xuất phát từ nguyên tắc đo lường chỉ số SIPAS của Bộ Nội vụ: Đánh giá phải đảm bảo tính độc lập, khách quan tuyệt đối. Người dân quét mã QR trên Giấy hẹn Một cửa bằng điện thoại cá nhân hoặc thao tác tại Kiosk công cộng bên ngoài phòng tiếp dân. Cán bộ thụ lý không thể can thiệp hay sửa đổi điểm số này. Dữ liệu sau đó tự động tổng hợp về màn hình giám sát `/danh-gia` để phục vụ công tác thanh tra công vụ."*

### Câu 2: Khi người có công từ trần, phần mềm xử lý thế nào để tránh chi trả trùng hoặc thất thoát tiền nhà nước?
> **Gợi ý trả lời:** *"Hệ thống có quy trình Báo giảm từ trần chuẩn Mẫu số 02 - Nghị định 131/2021/NĐ-CP. Khi tiếp nhận Trích lục khai tử, cán bộ bấm 'Báo giảm', hệ thống lập tức: (1) Khóa trạng thái hồ sơ thành 'Đã từ trần'; (2) Tự động ngắt toàn bộ danh sách phát tiền thường xuyên ở các kỳ tiếp theo; (3) Tự động tính trợ cấp Mai táng phí bằng 10 tháng mức chuẩn (20.550.000đ) để in quyết định hỗ trợ thân nhân; (4) Đồng thời Trung tâm cảnh báo rủi ro sẽ phát cảnh báo nếu có bất kỳ lệnh chi nào sau ngày từ trần."*

### Câu 3: Làm thế nào để giải quyết bài toán tài liệu giấy kháng chiến cũ bị ố vàng, rách mờ?
> **Gợi ý trả lời:** *"Em đã nghiên cứu giải pháp tích hợp công nghệ AI OCR nhận dạng ký tự quang học. Thay vì cán bộ phải gõ tay từng trường từ các Bằng Tổ quốc ghi công hay Giấy báo tử từ những năm 1970, cán bộ chỉ cần tải ảnh scan lên, module OCR AI sẽ tự động phân tích vùng văn bản, trích xuất cấu trúc các trường: Họ tên, Năm sinh, Quê quán, Ngày hy sinh, Đơn vị, Số bằng khen và tự động điền vào biểu mẫu tiếp nhận với độ chính xác cao."*
