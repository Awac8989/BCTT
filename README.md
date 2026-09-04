# Welfare Compass

Dựa trên báo cáo thực tập chuyên đề và tài liệu đặc tả dự án **"Hệ thống Quản lý Hồ sơ Người có công"** (thuộc đơn vị thực tập Phòng Văn hóa - Xã hội / Phòng VH&TT phường thủ dầu một ), dưới đây là bản **Mô tả chi tiết các Chức năng, Thiết kế Giao diện (UI/UX)**, tập trung sâu vào các module: **Trực quan hóa dữ liệu (Data Visualization)**, **Phân tích - Đánh giá nghiệp vụ (Analytics & Reporting)**, và **Thu thập phản hồi / đánh giá từ người dùng (User Feedback & Satisfaction Evaluation)**.

---

# PHẦN 1. MA TRẬN PHÂN HỆ VÀ TÁC NHÂN HỆ THỐNG (ACTORS)

Hệ thống được thiết kế hướng tới 4 nhóm người dùng chính:

1. **Cán bộ Tiếp nhận (UBND Phường/Xã - Ward Officer):** Nhập hồ sơ, đính kèm căn cước/giấy tờ chứng nhận, gửi hồ sơ lên cấp thẩm định, ghi nhận chi trả.

2. **Cán bộ Chuyên viên & Lãnh đạo Phòng (City/District Reviewer & Approver):** Thẩm định pháp lý, phê duyệt mức trợ cấp, ban hành quyết định, theo dõi tiến độ xử lý hồ sơ và chi trả ngân sách.

3. **Quản trị viên Hệ thống (System Admin):** Cấu hình danh mục (phường xã, loại đối tượng, mức chuẩn trợ cấp), quản lý tài khoản, giám sát log hệ thống và tích hợp liên thông LGSP.

4. **Công dân / Người có công / Thân nhân (Citizen/End-user):** Tra cứu tình trạng xử lý hồ sơ, tiếp nhận thông báo chi trả, thực hiện đánh giá mức độ hài lòng đối với dịch vụ công.

---

# PHẦN 2. MÔ TẢ CHI TIẾT CÁC CHỨC NĂNG NGHIỆP VỤ

```

                    ┌────────────────────────────────────────────────────────┐

                    │       HỆ THỐNG QUẢN LÝ HỒ SƠ NGƯỜI CÓ CÔNG             │

                    └────────────────────────────────────────────────────────┘

                                                 │

     ┌──────────────────────┬────────────────────┼───────────────────┬─────────────────────┐

     ▼                      ▼                    ▼                   ▼                     ▼

[Phân hệ 1]            [Phân hệ 2]          [Phân hệ 3]         [Phân hệ 4]           [Phân hệ 5]

Hồ sơ NCC &           Tính toán &           Trực quan hóa       Thu thập dữ liệu      Quản trị &

Quy trình Xét duyệt   Lịch sử Chi trả       Dữ liệu & Báo cáo   & Đánh giá Người dùng Tích hợp LGSP

```

---

### PHÂN HỆ 1: QUẢN LÝ HỒ SƠ VÀ THẨM ĐỊNH XÉT DUYỆT

* **1.1. Tiếp nhận và Khởi tạo Hồ sơ:**

* Nhập liệu thông tin cá nhân: Họ tên, số CCCD (12 số có kiểm tra trùng lặp và cấu trúc regex), ngày sinh, giới tính, địa chỉ thường trú (phường/xã, khu phố/ấp).

* Phân loại đối tượng chính sách: Mẹ VNAH, Thương binh, Bệnh binh, Cán bộ tiền khởi nghĩa, Thân nhân liệt sĩ, Nhiễm chất độc hóa học,...

* Đính kèm tài liệu số hóa: Giấy ra viện, Biên bản giám định tỷ lệ tổn thương cơ thể (từ 21% - 100%), Huân huy chương, Quyết định phục viên.

* **1.2. Thẩm định và Xét duyệt Hồ sơ:**

* Luồng trạng thái: `MỚI_TIẾP_NHẬN` ➔ `ĐANG_THẨM_ĐỊNH` ➔ `CHỜ_PHÊ_DUYỆT` ➔ `ĐÃ_DUYỆT` (hoặc `YÊU_CẦU_BỔ_SUNG`, `TỪ_CHỐI`).

* Ghi chú thẩm định: Cán bộ thẩm định ghi lý do nếu trả lại hoặc từ chối hồ sơ.

---

### PHÂN HỆ 2: ĐỘNG CƠ TÍNH TOÁN TRỢ CẤP & QUẢN LÝ CHI TRẢ

* **2.1. Động cơ tính trợ cấp tự động (Java Spring Boot Engine):**

* Tự động áp giá mức trợ cấp ưu đãi theo Nghị định hiện hành (Nghị định 75/2021/NĐ-CP hoặc các quy định sửa đổi).

* Công thức tính linh hoạt dựa trên:

* Mức chuẩn trợ cấp ưu đãi $\times$ Hệ số đối tượng.

* Tỷ lệ tổn thương cơ thể (%) đối với Thương binh/Bệnh binh.

* Phụ cấp đặc thù (người phục vụ đối với thương binh nặng >81%, phụ cấp thâm niên,...).

* **2.2. Quản lý Quyết định và Lịch sử Chi trả:**

* Khởi tạo Quyết định hưởng trợ cấp (`quyet_dinh_huong`) kèm mã số quyết định, ngày hiệu lực.

* Lập danh sách chi trả hàng tháng (`lich_su_chi_tra`), hỗ trợ xuất bảng kê thanh toán qua tài khoản ngân hàng hoặc bưu điện.

---

### PHÂN HỆ 3: TRỰC QUAN HÓA DỮ LIỆU & PHÂN TÍCH THỐNG KÊ (DATA VISUALIZATION & ANALYTICS)

Phân hệ này đóng vai trò trung tâm chỉ đạo điều hành, giúp lãnh đạo có cái nhìn tức thời, đa chiều về công tác chính sách trên toàn địa bàn.

#### 3.1. Các chỉ số hiệu năng (KPI Cards / Summary Metrics)

* **Tổng số đối tượng NCC đang quản lý:** Thống kê theo thời gian thực, hiển thị độ tăng/giảm so với cùng kỳ năm trước.

* **Tổng kinh phí chi trả tháng hiện tại:** Tổng số tiền giải ngân qua tài khoản ngân hàng và tiền mặt.

* **Tỷ lệ giải quyết hồ sơ đúng hạn:** (Số hồ sơ duyệt đúng hẹn / Tổng hồ sơ tiếp nhận) $\times 100\%$.

* **Chỉ số hài lòng trung bình (CSAT Score):** Đánh giá từ công dân theo thang điểm 5 sao.

#### 3.2. Hệ thống biểu đồ trực quan hóa dữ liệu (Visualization Widgets)

* **Biểu đồ tròn/Donut (Cơ cấu loại đối tượng):** Tỷ lệ phân bổ Thương binh, Thân nhân liệt sĩ, Người có công cách mạng,...

* **Bản đồ nhiệt địa lý (Choropleth Heatmap 14 Phường/Xã):** Thể hiện mật độ đối tượng NCC và khối lượng chi trả theo từng đơn vị hành chính; các phường có lượng hồ sơ lớn (Phú Cường, Phú Hòa, Hiệp Thành,...) hiển thị sắc thái màu đậm hơn.

* **Biểu đồ cột chồng (Stacked Bar Chart - Xu hướng ngân sách theo quý/năm):** Phân rã dòng tiền: Trợ cấp thường xuyên hàng tháng, Trợ cấp một lần, Chế độ điều dưỡng phục hồi sức khỏe, Bảo hiểm y tế.

* **Biểu đồ hình phễu (Funnel Chart - Tiến độ xử lý thủ tục hành chính):** Đo lường tỷ lệ hồ sơ ở từng công đoạn tiếp nhận ➔ thẩm định ➔ lãnh đạo phê duyệt ➔ đã trả kết quả.

#### 3.3. Phân tích dự báo và Báo cáo điều hành

* **Phân tích đối soát chi trả:** Tự động phát hiện bất thường (ví dụ: hồ sơ đã báo tử nhưng vẫn phát sinh chi trả, hồ sơ trùng lặp số CCCD, trùng hưởng nhiều nhóm trợ cấp sai quy định).

* **Báo cáo động (Dynamic Export):** Trích xuất mẫu biểu chuẩn C70a-HD, báo cáo quyết toán kinh phí theo Thông tư của Bộ Tài chính và Bộ LĐ-TB&XH.

---

### PHÂN HỆ 4: THU THẬP DỮ LIỆU NGƯỜI DÙNG & ĐÁNH GIÁ CHẤT LƯỢNG DỊCH VỤ (FEEDBACK & EVALUATION SYSTEM)

Phân hệ giải quyết bài toán đo lường mức độ phục vụ công vụ của cơ quan nhà nước theo định hướng lấy người dân làm trung tâm.

#### 4.1. Đa kênh thu thập dữ liệu (Multi-channel Data Collection)

* **Kênh 1: Quét mã QR trên Giấy hẹn trả kết quả:**

* Mỗi biên nhận hồ sơ được in kèm một mã QR động mã hóa `ho_so_id` và `token_danh_gia`.

* Người dân quét mã bằng smartphone để mở trực tiếp trang khảo sát mà không cần đăng nhập.

* **Kênh 2: Thiết bị Kiosk / Tablet tại Bộ phận Tiếp nhận và Trả kết quả (Một cửa):**

* Đặt tại bàn làm việc của cán bộ; sau khi cán bộ hoàn tất thao tác tiếp nhận trên hệ thống, màn hình cảm ứng phụ hướng về phía người dân sẽ kích hoạt giao diện đánh giá nhanh 1 chạm.

* **Kênh 3: Tin nhắn Zalo ZNS / SMS tự động:**

* Khi hồ sơ chuyển trạng thái `ĐÃ_PHÊ_DUYỆT` hoặc `ĐÃ_CHI_TRẢ`, hệ thống tự động gửi tin nhắn cảm ơn kèm đường dẫn liên kết khảo sát trực tuyến.

#### 4.2. Bộ tiêu chí thu thập đánh giá

Khảo sát được thiết kế dựa trên tiêu chuẩn đo lường sự hài lòng của người dân đối với dịch vụ hành chính công (chỉ số SIPAS) bao gồm:

1. **Tiêu chí 1: Thái độ ứng xử của cán bộ** (Nhiệt tình, lịch sự, tôn trọng người có công).

2. **Tiêu chí 2: Thời gian xử lý thủ tục** (Nhanh chóng, đúng hẹn theo phiếu tiếp nhận).

3. **Tiêu chí 3: Sự rõ ràng, minh bạch về thành phần hồ sơ** (Không yêu cầu bổ sung giấy tờ ngoài quy định).

4. **Tiêu chí 4: Tiện ích không gian làm việc và tiếp cận** (Cơ sở vật chất, bảng biểu hướng dẫn).

5. **Ý kiến góp ý tự do (Text Input):** Hòm thư điện tử tiếp nhận phản ánh, khiếu nại, kiến nghị giải pháp.

#### 4.3. Phân tích và Xử lý dữ liệu phản hồi

* **Tính toán chỉ số hài lòng:**

$$\text{CSAT} = \frac{\text{Số lượt đánh giá Hài lòng / Rất hài lòng}}{\text{Tổng số lượt khảo sát}} \times 100\%$$

* **Phân loại cảm xúc văn bản tự động (Sentiment Tagging):** Tự động lọc từ khóa tiêu cực ("chậm trễ", "hách dịch", "khó khăn", "phiền hà") để gắn cờ `CẢNH_BÁO` cho Lãnh đạo phòng xử lý.

* **Xếp hạng đơn vị:** Bảng xếp hạng mức độ hài lòng của công dân giữa các phường/xã và từng cán bộ tiếp nhận.

---

# PHẦN 3. THIẾT KẾ CHI TIẾT CẤU TRÚC GIAO DIỆN NGƯỜI DÙNG (UI/UX SPECIFICATION)

### Giao diện 1: Bảng Điều khiển Tổng quan (Executive Data Dashboard)

* **Bố cục (Layout):** Header cố định (thanh tìm kiếm toàn cục, thông báo, thông tin tài khoản) + Sidebar điều hướng bên trái + Vùng làm việc chính gồm lưới thẻ dữ liệu responsive.

* **Mô phỏng bố cục (Wireframe):**

```

+---------------------------------------------------------------------------------------------------------+

| [LOGO] HỆ THỐNG QUẢN LÝ HỒ SƠ NGƯỜI CÓ CÔNG       [🔍 Tìm CCCD/Mã HS...]  [🔔 3] [👤 Hứa Trọng Duy]     |

+-------------------+-------------------------------------------------------------------------------------+

| 📊 Tổng quan      | [ KPI 1: 12,480 ]   [ KPI 2: 24.6 Tỷ VNĐ ]   [ KPI 3: 98.4% ]   [ KPI 4: 4.85 / 5 ★ ]   |

| 📁 Quản lý Hồ sơ  |   Tổng Hồ sơ NCC        Kinh phí tháng          Duyệt đúng hạn      Mức độ hài lòng     |

| ⚖️ Thẩm định      +--------------------------------------------------+----------------------------------+

| 💵 Chi trả trợ cấp| BIỂU ĐỒ DIỄN BIẾN GIẢI NGÂN THEO THÁNG (LINE/BAR)| CƠ CẤU ĐỐI TƯỢNG NCC (DONUT)    |

| 📈 Phân tích số liệu| [ 2026 v ] [ Tất cả loại đối tượng v ]          |  ■ Thương binh: 42%              |

| ⭐ Đánh giá dịch vụ|  25B|        ___                                 |  ■ Thân nhân Liệt sĩ: 30%        |

| ⚙️ Hệ thống       |  20B|  _/\__/   \                                |  ■ Bệnh binh: 15%                |

|                   |  15B| /      \   \                               |  ■ CĐHH & Khác: 13%              |

|                   |   0B+--T1-T2-T3-T4-T5-T6-T7-T8-------------------+----------------------------------+

|                   | BẢN ĐỒ NHIỆT MẬT ĐỘ HỒ SƠ THEO 14 PHƯỜNG         | CẢNH BÁO HỒ SƠ QUÁ HẠN XỬ LÝ    |

|                   |  [ Bản đồ trực quan: Phường Phú Cường (Đậm)      |  ⚠️ HS-2026-0089: Quá hạn 2 ngày |

|                   |    Phường Định Hòa (Vừa), Tân An (Nhạt)... ]     |  ⚠️ HS-2026-0112: Quá hạn 1 ngày |

|                   |  * Click chọn từng phường để lọc số liệu         |  [ Xem tất cả (5 hồ sơ) ]        |

+-------------------+--------------------------------------------------+----------------------------------+

```

---

### Giao diện 2: Màn hình Nhập liệu và Thẩm định Hồ sơ Chi tiết

* **Khu vực 1 (Cột trái - 60%): Thông tin hành chính & chính sách:**

* Khối thông tin định danh: Họ tên (chữ hoa), Số CCCD (12 số, tự động kiểm tra xem đã tồn tại trong bảng `ho_so_ncc` chưa), Giới tính, Ngày sinh.

* Khối địa chỉ: Dropdown phân cấp (Phường/Xã ➔ Khu phố/Ấp ➔ Số nhà/Tên đường).

* Khối nghiệp vụ: Nhóm đối tượng ưu đãi, tỷ lệ tổn thương (%), hồ sơ đính kèm dạng kéo thả (Drag & Drop: PDF, JPG scan).

* **Khu vực 2 (Cột phải - 40%): Xem trước kết quả tính trợ cấp tự động & Phê duyệt:**

* Box màu nổi bật: Bảng tính mức trợ cấp dự kiến được Engine tính toán tức thời (Hiển thị chi tiết: Tiền trợ cấp theo thương tật + Tiền phụ cấp người chăm sóc + Trợ cấp điều dưỡng = Tổng thực nhận).

* Nút tác vụ: `[Lưu nháp]`, `[Trình Lãnh đạo duyệt]`, `[Yêu cầu bổ sung]`, `[Từ chối kèm lý do]`.

---

### Giao diện 3: Giao diện Khảo sát Đánh giá của Người dùng (Mobile/Kiosk View)

* **Giao diện thân thiện, cỡ chữ to, độ tương phản cao** phù hợp cho người cao tuổi hoặc thân nhân thương binh:

```

+--------------------------------------------------------------+

|                UBND THÀNH PHỐ THỦ DẦU MỘT                     |

|           KHẢO SÁT CHẤT LƯỢNG PHỤC VỤ DỊCH VỤ CÔNG            |

+--------------------------------------------------------------+

| Mã hồ sơ: TDM-NCC-2026-00412                                 |

| Thủ tục: Hồ sơ đề nghị hưởng trợ cấp Thương binh             |

| Cán bộ tiếp nhận: Nguyễn Văn An - Bộ phận Một cửa            |

+--------------------------------------------------------------+

| 1. Bác/Cô/Chú đánh giá thế nào về sự tiếp đón và hướng dẫn   |

|    của cán bộ công chức?                                     |

|    [ 😡 Rất tệ ]  [ 🙁 Chưa tốt ]  [ 😐 Bình thường ]         |

|    [ 😊 Hài lòng ]                 [ ⭐ RẤT HÀI LÒNG ]         |

+--------------------------------------------------------------+

| 2. Thời gian tiếp nhận và xử lý hồ sơ:                       |

|    ( ) Quá chậm trễ     ( ) Đúng hẹn     ( ) Nhanh chóng    |

+--------------------------------------------------------------+

| 3. Ý kiến đóng góp thêm (nếu có):                            |

|    +----------------------------------------------------+    |

|    | Cán bộ hướng dẫn rất tận tình, giải thích rõ ràng. |    |

|    +----------------------------------------------------+    |

+--------------------------------------------------------------+

|                     [ GỬI ĐÁNH GIÁ ]                         |

+--------------------------------------------------------------+

```

---

### Giao diện 4: Dashboard Phân tích Đánh giá Sự hài lòng (Citizen Voice Analytics)

* **Thanh lọc dữ liệu:** Theo mốc thời gian (Từ ngày... Đến ngày...), Theo từng Cán bộ tiếp nhận, Theo từng Phường/Xã.

* **Thành phần giao diện:**

* **Biểu đồ Radar (Spider Chart):** Đánh giá cân bằng giữa 5 tiêu chí: Thái độ cán bộ, Tốc độ phục vụ, Minh bạch giấy tờ, Hạ tầng tiếp đón, Mức độ dễ dàng khi liên hệ.

* **Word Cloud (Đám mây từ khóa):** Trích xuất từ các bình luận: các từ tích cực ("tận tình", "nhanh", "chu đáo") hiển thị cỡ to màu xanh lam; các từ tiêu cực ("chờ lâu", "thiếu chỉ dẫn", "phiền hà") hiển thị màu đỏ để lãnh đạo lưu ý kiểm tra trực tiếp.

* **Bảng chi tiết phản hồi kém (Rating $\le$ 2 sao):** Liệt kê chi tiết mã hồ sơ, người phản ánh, nội dung bức xúc và nút chuyển tiếp `[Tạo phiếu xử lý khiếu nại]`.

---

# PHẦN 4. THIẾT KẾ CƠ SỞ DỮ LIỆU BỔ SUNG (CHO PHẦN ANALYTICS & ĐÁNH GIÁ)

Kế thừa và chuẩn hóa mở rộng từ ERD hiện hữu (`sys_users`, `ho_so_ncc`, `quyet_dinh_huong`, `lich_su_chi_tra`), hệ thống được bổ sung 2 bảng để phục vụ module thu thập và phân tích đánh giá:

### 1. Bảng `khao_sat_danh_gia` (Ghi nhận phiên khảo sát)

| Tên trường | Kiểu dữ liệu | Ràng buộc | Diễn giải |

| --- | --- | --- | --- |

| `khao_sat_id` | BIGINT | PK, AUTO_INCREMENT | Khóa chính |

| `ho_so_id` | BIGINT | FK ➔ `ho_so_ncc` | Khóa ngoại nối hồ sơ được đánh giá |

| `kenh_danh_gia` | ENUM | NOT NULL | `KIOSK`, `QR_PHIEU_HEN`, `SMS_ZALO` |

| `diem_csat_chung` | INT | NOT NULL | Điểm đánh giá chung (1 đến 5 sao) |

| `y_kien_dong_gop` | TEXT | NULL | Nội dung nhận xét, góp ý |

| `sentiment_tag` | VARCHAR(20) | DEFAULT 'NEUTRAL' | Gắn nhãn cảm xúc: `POSITIVE`, `NEGATIVE`, `NEUTRAL` |

| `ngay_danh_gia` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Thời điểm người dùng gửi đánh giá |

| `dia_chi_ip` | VARCHAR(45) | NULL | Ghi vết bảo mật, chống spam đánh giá ảo |

### 2. Bảng `chi_tiet_tieu_chi_danh_gia` (Chi tiết điểm từng tiêu chí)

| Tên trường | Kiểu dữ liệu | Ràng buộc | Diễn giải |

| --- | --- | --- | --- |

| `id` | BIGINT | PK, AUTO_INCREMENT | Khóa chính |

| `khao_sat_id` | BIGINT | FK ➔ `khao_sat_danh_gia` | Liên kết đến phiên khảo sát |

| `ma_tieu_chi` | VARCHAR(50) | NOT NULL | `THAI_DO`, `THOI_GIAN`, `MINH_BACH`, `HA_TANG` |

| `diem_so` | INT | NOT NULL | Thang điểm từ 1 - 5 |

---

# PHẦN 5. LỢI ÍCH VÀ Ý NGHĨA KHI ÁP DỤNG CÁC TÍNH NĂNG NÀY

1. **Đối với Lãnh đạo Cơ quan:**

* Thay thế việc đọc báo cáo số liệu giấy khô khan bằng các màn hình Dashboard trực quan thời gian thực, giúp đưa ra quyết định dự trù kinh phí an sinh xã hội chính xác theo từng tháng/quý.

* Kịp thời phát hiện các phường có tiến độ tồn đọng hoặc cán bộ bị phản ánh tiêu cực để chấn chỉnh nghiệp vụ.

2. **Đối với Cán bộ Nghiệp vụ:**

* Tự động hóa tính toán phụ cấp/trợ cấp qua Engine Java Spring Boot, loại bỏ triệt để tình trạng tính toán sai lệch hay nhầm lẫn định mức.

* Giảm áp lực tra cứu thủ công nhờ các bộ lọc đa chỉ mục kết hợp trên MySQL.

3. **Đối với Người có công và Xã hội:**

* Tăng tính minh bạch trong thực hiện chính sách đền ơn đáp nghĩa của Đảng và Nhà nước.

* Tiếng nói, sự đánh giá của người dân được ghi nhận trực tiếp và có dữ liệu kiểm chứng, nâng cao chất lượng nền hành chính công phục vụ nhân dân.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://ho-so-tran-an.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/359ff2b2-ad23-4f60-9210-18b4f0c63c6f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
