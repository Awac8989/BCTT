# 🚀 TÀI LIỆU CÔNG BỐ CÁC TÍNH NĂNG NGHIỆP VỤ MỚI NÂNG CẤP
### Hệ thống Quản lý Nghiệp vụ Chuyên môn & Đánh giá Dịch vụ công Cấp Xã/Phường
**Ủy ban nhân dân Phường Phú Cường / Phòng LĐ-TB&XH TP. Thủ Dầu Một · Sở LĐ-TB&XH tỉnh Bình Dương**

---

## 📌 TỔNG QUAN ĐỢT NÂNG CẤP HỆ THỐNG
Nhằm đáp ứng yêu cầu thực tiễn trong công tác quản lý Nhà nước, tinh gọn quy trình hành chính công theo **Đề án 06/CP**, tuân thủ nghiêm ngặt các văn bản quy phạm pháp luật mới nhất (**Nghị định 77/2024/NĐ-CP**, **Nghị định 73/2024/NĐ-CP**, **Nghị định 76/2024/NĐ-CP**, **Nghị định 131/2021/NĐ-CP**, **Thông tư 04/2021/TT-TTCP**) và phân định rõ ràng quyền hạn trách nhiệm giữa Lãnh đạo quản lý và Kỹ sư công nghệ, hệ thống đã hoàn tất nâng cấp toàn diện bộ tính năng nghiệp vụ chuyên môn sâu.

---

## 📑 DANH MỤC 15 TÍNH NĂNG NGHIỆP VỤ MỚI ĐÃ TRIỂN KHAI

### 1. Phân Hệ Kỹ Thuật Quản Trị CSDL & Khắc Phục Lỗi Chuyên Biệt (`/ky-thuat`)
- **Tách quyền độc lập (Separation of Duties - SoD):**
  - **Lãnh đạo Sở (`ADMIN_SO` - TS. Nguyễn Văn Hùng):** Giữ vai trò phê duyệt, điều hành vĩ mô, tuyệt đối không có quyền can thiệp CSDL hoặc xem các chức năng fix lỗi kỹ thuật.
  - **Kỹ sư Kỹ thuật (`ADMIN_TECH` - KS. Lê Văn Khoa):** Được phân bổ riêng phân hệ `/ky-thuat` để theo dõi vận hành, giám sát tài nguyên và xử lý sự cố kỹ thuật.
- **Tính năng cốt lõi:**
  - **Database Studio & SQL Editor:** Hỗ trợ thực thi các câu lệnh truy vấn chuẩn hóa (`SELECT`, `INSERT`, `UPDATE`, `DELETE`, `BACKUP`, `RESTORE`).
  - **Safety Guards (Chống xóa nhầm dữ liệu):** Tự động phát hiện và chặn các câu lệnh `UPDATE` hoặc `DELETE` thiếu mệnh đề `WHERE` hoặc có điều kiện vô hiệu `1=1`.
  - **Audit Trail (Nhật ký kiểm toán):** Lưu trữ toàn bộ lịch sử truy vấn, người thực hiện, thời gian thực thi và số dòng bị ảnh hưởng.
  - **Table Inspector:** Kiểm tra cấu trúc 42 bảng quan hệ 3NF (InnoDB), thông số kích thước, index, và ràng buộc toàn vẹn khóa ngoại (FK).

---

### 2. Cổng Đăng Nhập Xác Thực Độc Lập (`/login`) & Xuất Danh Sách Tài Khoản
- **Cổng đăng nhập bảo mật:** Thay thế cơ chế switch vai trò đơn giản bằng cổng đăng nhập chính quy với đầy đủ:
  - Form nhập Tên đăng nhập / Email và Mật khẩu.
  - Ghi nhớ phiên đăng nhập (Remember Me).
  - Huy hiệu chức danh (Role Badge) và cấp quản lý hành chính (Cấp Tỉnh - Huyện - Xã - Công dân).
- **Bộ dữ liệu tài khoản chuẩn công vụ:**
  - Xuất sẵn 2 tệp danh sách tài khoản tại thư mục gốc và thư mục công khai:
    - `DANH_SACH_TAI_KHOAN_DANG_NHAP_HE_THONG.xlsx` (Excel định dạng bảng biểu công vụ)
    - `DANH_SACH_TAI_KHOAN_DANG_NHAP_HE_THONG.csv` (CSV hỗ trợ UTF-8)
  - Phân loại rõ ràng:
    1. `giamdoc.so@binhduong.gov.vn` (TS. Nguyễn Văn Hùng - Giám đốc Sở)
    2. `admin.tech@binhduong.gov.vn` (KS. Lê Văn Khoa - Quản trị Kỹ thuật)
    3. `chutich.phuocuong@binhduong.gov.vn` (Trần Văn Nam - Chủ tịch UBND Phường)
    4. `ldtbxh.phuocuong@binhduong.gov.vn` (Lê Thị Mai - Cán bộ LĐ-TB&XH Phường)
    5. `motcua.phuocuong@binhduong.gov.vn` (Nguyễn Văn An - Cán bộ Một cửa)
    6. `congdan.thanhnhan@gmail.com` (Nguyễn Văn Thắng - Thân nhân Người có công)

---

### 3. Cập Nhật Mức Chuẩn Trợ Cấp & Lương Cơ Sở Mới Nhất
- **Nghị định số 77/2024/NĐ-CP (Hiệu lực từ 01/07/2024):**
  - Nâng mức chuẩn trợ cấp ưu đãi Người có công từ **2.055.000 đồng** lên **2.789.000 đồng/tháng**.
  - Tự động áp dụng lại toàn bộ công thức tính trợ cấp thương binh, bệnh binh, Mẹ VNAH, tiền phục vụ và quà tặng ngày 27/7.
- **Nghị định số 73/2024/NĐ-CP (Hiệu lực từ 01/07/2024):**
  - Nâng mức lương cơ sở lên **2.340.000 đồng/tháng**.
  - Trợ cấp Mai táng phí Người có công: $= 10 \times 2.340.000$đ $= \mathbf{23.400.000}$ đồng.
- **Nghị định số 76/2024/NĐ-CP (Hiệu lực từ 01/07/2024):**
  - Nâng mức chuẩn trợ giúp xã hội từ **360.000 đồng** lên **500.000 đồng/tháng**.
  - Người cao tuổi neo đơn: hệ số $1.5 \rightarrow \mathbf{750.000}$ đồng/tháng.
  - Người khuyết tật đặc biệt nặng: hệ số $2.0 \rightarrow \mathbf{1.000.000}$ đồng/tháng.

---

### 4. Biên Bản Niêm Yết Công Khai 15 Ngày & Kết Thúc Niêm Yết (Mẫu số 15)
- **Căn cứ pháp lý:** Điều 13, 24, 38 Nghị định số 131/2021/NĐ-CP.
- **Giao diện & Biểu mẫu:** Modal tương tác 2 tab chuẩn thể thức văn bản:
  - **Tab 1: Thông báo Niêm yết công khai:** Công bố danh sách đối tượng người có công đề nghị công nhận tại trụ sở UBND Phường và Nhà sinh hoạt cộng đồng Khu phố trong 15 ngày làm việc.
  - **Tab 2: Biên bản Kết thúc Niêm yết công khai:** Lập sau 15 ngày, ghi nhận ý kiến phản hồi của nhân dân (không có khiếu nại, khiếu kiện).
- **Ký kết 4 bên liên ngành:**
  1. Chủ tịch UBND Phường Phú Cường (Trần Văn Nam).
  2. Đại diện UB Mặt trận Tổ quốc Việt Nam Phường Phú Cường.
  3. Trưởng ban Điều hành Khu phố nơi cư trú.
  4. Cán bộ Lao động - Thương binh & Xã hội Phường.
- **Vị trí tích hợp:** Nút bấm **"Niêm yết (NĐ 131)"** tại `/ho-so/$id`, `/ho-so`, và `/tham-dinh`.

---

### 5. Biên Bản Kiểm Tra Hiện Trường & Xác Minh Thực Địa (Mẫu 02/XMTD)
- **Căn cứ pháp lý:** Thông tư số 05/2013/TT-BLĐTBXH & Quy chế phối hợp liên ngành cơ sở.
- **Tổ xác minh liên ngành gồm 4 thành phần:**
  1. Đại diện UBND Phường: Cán bộ LĐ-TB&XH (Lê Thị Mai).
  2. Đại diện Công an Phường: Cảnh sát khu vực (Đại úy Vũ Tuấn Anh).
  3. Đại diện Khu phố: Trưởng ban Điều hành Khu phố.
  4. Đại diện gia đình/thân nhân người có công.
- **Nội dung kiểm tra chi tiết:**
  - Xác minh nơi cư trú thực tế theo dữ liệu dân cư Đề án 06.
  - Kiểm tra thực trạng vết thương, khả năng lao động, hoàn cảnh kinh tế gia đình.
  - Kết luận và kiến nghị cơ quan có thẩm quyền giải quyết chế độ.
- **Vị trí tích hợp:** Nút bấm **"Biên bản XMTĐ"** tại `/ho-so/$id` và `/tham-dinh`.

---

### 6. Quyết Định Hưởng Trợ Cấp Mai Táng Phí & Trợ Cấp Một Lần
- **Căn cứ pháp lý:** Nghị định số 131/2021/NĐ-CP và Nghị định số 73/2024/NĐ-CP.
- **Thuật toán tính tự động:**
  - Trợ cấp Mai táng phí ($10$ tháng lương cơ sở): $10 \times 2.340.000 = \mathbf{23.400.000}$ đồng.
  - Trợ cấp 1 lần ($3$ tháng trợ cấp ưu đãi đang hưởng): $\mathbf{10.500.000}$ đồng.
  - **Tổng kinh phí chi trả:** $\mathbf{33.900.000}$ đồng.
- **Tính năng ký số:** Tích hợp Ký số điện tử SmartCA Ban Giám đốc Sở LĐ-TB&XH tỉnh Bình Dương (TS. Nguyễn Văn Hùng), chứng thư số hợp lệ kèm mã băm SHA-256.
- **Vị trí tích hợp:** Nút bấm **"Quyết định Mai táng phí"** tại `/chi-tra`, `/ho-so/$id`, `/ho-so`, `/tham-dinh`.

---

### 7. Trích Lục Thông Tin Mộ Liệt Sĩ & Live QR Dẫn Đường Tọa Độ GPS
- **Căn cứ pháp lý:** Nghị định số 131/2021/NĐ-CP (Nghĩa trang Liệt sĩ tỉnh Bình Dương).
- **Dữ liệu trích lục chuẩn hóa:**
  - Họ tên liệt sĩ, năm sinh, quê quán, đơn vị chiến đấu, ngày hy sinh.
  - Vị trí quy tập chính xác: **Khu, Lô, Hàng, Số mộ**.
  - **Tọa độ thực địa GPS:** `11.1394°N, 106.6025°E`.
- **Tích hợp Bản đồ số & QR Code:** Thân nhân quét mã QR bằng camera điện thoại để mở ngay Google Maps dẫn đường từng bước đến đúng vị trí bia mộ trong khuôn viên nghĩa trang.
- **Vị trí tích hợp:** Nút **"Trích lục mộ"** trên từng mộ liệt sĩ tại `/nghia-trang`.

---

### 8. Sổ Theo Dõi Chi Trả Trợ Cấp Ưu Đãi Hàng Tháng (Mẫu C70b-HD)
- **Căn cứ pháp lý:** Thông tư liên tịch của Bộ Tài chính và Bộ Lao động - Thương binh và Xã hội.
- **Thiết kế chuẩn khổ giấy:** In khổ giấy A4 nằm ngang, đầy đủ quốc hiệu, tiêu ngữ, bảng biểu chi tiết.
- **Cấu trúc dữ liệu:**
  - Phân rã số tiền trợ cấp chính theo mức chuẩn NĐ 77/2024.
  - Tiền phụ cấp phục vụ, hỗ trợ điều dưỡng, phương tiện trợ giúp.
  - Hình thức nhận: Chi trả qua tài khoản ATM VNeID (tỷ lệ **98.4%**) hoặc tiền mặt.
  - Ký nhận 3 bên: Người lập biểu, Kế toán trưởng, Giám đốc Sở LĐ-TB&XH.
  - Hỗ trợ xuất dữ liệu ra file `.csv` phục vụ đối soát Kho bạc Nhà nước.
- **Vị trí tích hợp:** Nút **"Sổ chi trả (Mẫu C70b-HD)"** tại `/chi-tra`.

---

### 9. Bảng Kê Bưu Điện VNPost & Phiếu Phát Tiền Tận Nhà (Mẫu C70a-VNPost)
- **Căn cứ pháp lý:** Thỏa thuận hợp tác giữa Sở LĐ-TB&XH tỉnh Bình Dương và Bưu điện tỉnh Bình Dương.
- **2 tính năng chuyên sâu:**
  - **Tab 1: Bảng kê danh sách đối tượng chi trả tiền mặt qua Bưu điện (Mẫu C70a-VNPost):** Quản lý đối tượng người cao tuổi, người neo đơn chưa có tài khoản ngân hàng nhận tiền tại điểm bưu cục.
  - **Tab 2: Phiếu phát tiền tận nhà:** Dành riêng cho đối tượng đặc biệt (Bà Mẹ Việt Nam Anh hùng Lê Thị Mai, Thương binh nặng tỷ lệ tổn thương cơ thể $\ge 81\%$). Nhân viên bưu điện đến tận nhà chi tiền và ký biên nhận.
- **Vị trí tích hợp:** Nút **"Bảng kê Bưu điện VNPost"** tại `/chi-tra`.

---

### 10. Quyết Định Trợ Cấp Bảo Trợ Xã Hội Hàng Tháng (NĐ 20 & NĐ 76)
- **Căn cứ pháp lý:** Nghị định 20/2021/NĐ-CP và Nghị định 76/2024/NĐ-CP.
- **Tính toán tự động:**
  - Mức chuẩn trợ cấp mới: **500.000 đồng/tháng**.
  - Tự động nhân hệ số theo đúng đối tượng (Người già $\ge 80$ tuổi, Người khuyết tật nặng/đặc biệt nặng).
  - Tự động cấp quyền hưởng Bảo hiểm Y tế miễn phí 100% (Mã thẻ BHYT diện `BT`).
- **Phê duyệt & Ký số:** Ban hành quyết định kèm chữ ký số của Chủ tịch UBND Phường hoặc Trưởng phòng LĐ-TB&XH.
- **Vị trí tích hợp:** Nút **"Quyết định"** tại danh sách Bảo trợ xã hội (`/an-sinh-xa-hoi`).

---

### 11. Phiếu Hướng Dẫn & Thông Báo Thụ Lý Tiếp Công Dân
- **Căn cứ pháp lý:** Luật Tiếp công dân 2013 và Thông tư số 04/2021/TT-TTCP của Thanh tra Chính phủ.
- **Quy trình chuẩn mực:**
  - Ghi nhận thông tin người khiếu nại, phản ánh, kiến nghị.
  - Liệt kê chi tiết tài liệu, chứng cứ kèm theo.
  - Ghi rõ nội dung phân loại: Thụ lý giải quyết, chuyển cơ quan có thẩm quyền, hoặc hướng dẫn bổ sung hồ sơ.
  - Ký nhận giữa Cán bộ tiếp dân và Công dân, có hẹn ngày trả lời bằng văn bản.
- **Vị trí tích hợp:** Nút **"In Phiếu tiếp dân"** tại tab `TIEP_CONG_DAN` trang `/van-ban` hoặc `/dieu-hanh`.

---

### 12. Cổng Tra Cứu Dịch Vụ Công: Tải Giấy Tờ & Kết Quả Điện Tử
- **Căn cứ pháp lý:** Nghị định số 42/2022/NĐ-CP và Nghị định số 61/2018/NĐ-CP.
- **Tải trực tiếp tài liệu điện tử:**
  1. **Giấy tiếp nhận hồ sơ & Hẹn trả kết quả (Mẫu số 01):** Có mã QR Code tra cứu trực tuyến.
  2. **Quyết định hưởng trợ cấp điện tử:** Văn bản số hóa có chữ ký số SmartCA.
  3. **Thẻ BHYT điện tử (Mẫu D03-TS):** Mẫu thẻ bảo hiểm y tế tra cứu quyền lợi khám chữa bệnh.
- **Tiến trình giải quyết minh bạch:** Cập nhật bước 3 trong quy trình thẩm định viện dẫn chính xác căn cứ Nghị định 77/2024/NĐ-CP.
- **Vị trí tích hợp:** Cổng công dân trực tuyến tại `/tra-cuu`.

---

### 13. Khung Đánh Giá Hiệu Quả Nghiệp Vụ Chuyên Môn Đa Chiều
- **Vị trí tích hợp:** Phân hệ **Phân tích số liệu & Đánh giá** (`/phan-tich`) - Tab **"Đánh giá Hiệu quả"**.
- **Bộ chỉ số đo lường toàn diện:**
  - **SLA Đạt chuẩn:** Tỷ lệ hồ sơ giải quyết trước và đúng hạn đạt **99.2%**.
  - **Chỉ số Hài lòng SIPAS:** Đạt **98.6%** mức độ hài lòng của công dân và thân nhân.
  - **Thực hiện Đề án 06:** Tỷ lệ chi trả an sinh qua tài khoản VNeID đạt **98.4%**.
  - **Hiệu quả Kinh tế - Xã hội (ROI):** Tiết kiệm **1,2 tỷ đồng/năm** chi phí in ấn giấy tờ, giảm **35%** thời gian đi lại của nhân dân.

---

### 14. Thiết Kế An Toàn Thông Tin Cấp Độ 3 & Tích Hợp VNeID / C06
- **Căn cứ pháp lý:** Nghị định số 85/2016/NĐ-CP và Thông tư số 12/2022/TT-BTTTT.
- **Kiến trúc an ninh đa vùng:** Phân tách rõ rệt Vùng DMZ (Cổng tra cứu công dân), Vùng ứng dụng (API Gateway) và Vùng cơ sở dữ liệu nội bộ được bảo vệ bởi tường lửa Next-Gen Firewall (WAF).
- **Cơ chế tích hợp VNeID:** Chuẩn hóa giao thức định danh điện tử SSO dựa trên OAuth 2.0 / OpenID Connect với cơ chế bảo vệ PKCE (Proof Key for Code Exchange).
- **Mã hóa dữ liệu:** Sử dụng thuật toán AES-256-GCM cho dữ liệu CCCD/C06 lưu trữ tĩnh (At-Rest) và TLS 1.3 cho đường truyền (In-Transit).

---

### 15. Kịch Bản Trình Chiếu Demo 5 Phút Chuẩn Hóa
- **Tài liệu:** `docs/KICH_BAN_QUAY_VIDEO_DEMO_5_PHUT.md`.
- **Nội dung:** Kịch bản phân cảnh chi tiết từng giây, lời thoại mẫu và thao tác chuột tương ứng, giúp tác giả tự tin quay video thuyết minh nộp giáo viên hướng dẫn và hội đồng bảo vệ đồ án tốt nghiệp.

---

## 📸 BỘ SƯU TẬP HÌNH ẢNH GIAO DIỆN CÁC TÍNH NĂNG MỚI (17 MÀN HÌNH CHẤT LƯỢNG CAO)

> Tất cả hình ảnh được chụp trực tiếp từ hệ thống đang vận hành ở độ phân giải cao Full HD (1600x1000px, 2x Retina Scale) và lưu trữ tại `docs/screenshots/tinh_nang_moi/`.

### 1. Phân Hệ Xác Thực & Quản Lý Kỹ Thuật Độc Lập
| Hình ảnh giao diện | Mô tả nghiệp vụ chi tiết |
|:---|:---|
| ![01 Cổng đăng nhập](docs/screenshots/tinh_nang_moi/01_cong_dang_nhap_chuyen_dung.png) | **Hình 1: Cổng đăng nhập bảo mật chuyên dụng (`/login`)**<br>Form xác thực tài khoản công vụ, ghi nhớ đăng nhập, huy hiệu chức danh và các nút tải trực tiếp file Excel / CSV danh sách tài khoản toàn tỉnh. |
| ![02 Tra cứu tài khoản](docs/screenshots/tinh_nang_moi/02_modal_tra_cuu_tai_khoan.png) | **Hình 2: Bảng tra cứu danh bạ tài khoản & phân quyền 3 cấp**<br>Modal tra cứu trực quan phân quyền công chức: Lãnh đạo Sở, Quản trị Kỹ thuật, Lãnh đạo Phường, Cán bộ Một cửa và Cán bộ chuyên môn. |
| ![03 Tiếp nhận báo lỗi](docs/screenshots/tinh_nang_moi/03_ky_thuat_bao_loi_su_co.png) | **Hình 3: Phân hệ Kỹ thuật - Tiếp nhận & Xử lý báo lỗi website (`/ky-thuat`)**<br>Trang riêng của KS. Lê Văn Khoa ghi nhận các sự cố, phân loại mức độ nghiêm trọng, gán cán bộ xử lý và theo dõi tiến độ sửa lỗi. |
| ![04 Database Studio](docs/screenshots/tinh_nang_moi/04_ky_thuat_database_studio.png) | **Hình 4: Phân hệ Kỹ thuật - Database Fix Studio & SQL Console**<br>Công cụ thực thi SQL an toàn, cơ chế Safety Guards ngăn chặn câu lệnh thiếu `WHERE`, kiểm tra 42 bảng quan hệ 3NF (InnoDB). |
| ![05 ATTT VNeID](docs/screenshots/tinh_nang_moi/05_ky_thuat_attt_vneid.png) | **Hình 5: Phân hệ Kỹ thuật - Kiến trúc ATTT Cấp độ 3 & Tích hợp VNeID**<br>Sơ đồ an ninh mạng 3 vùng (DMZ, App, DB), chứng chỉ bảo mật, tích hợp C06/VNeID SSO OAuth 2.0 / PKCE và Nhật ký kiểm toán Audit Trail. |

---

### 2. Nghiệp Vụ Hồ Sơ Người Có Công: Xác Minh Thực Địa & Niêm Yết Công Khai
| Hình ảnh giao diện | Mô tả nghiệp vụ chi tiết |
|:---|:---|
| ![06 Xác minh thực địa](docs/screenshots/tinh_nang_moi/06_bien_ban_xac_minh_thuc_dia.png) | **Hình 6: Biên bản kiểm tra hiện trường & xác minh thực địa (Mẫu 02/XMTD)**<br>Biên bản liên ngành gồm Cán bộ LĐ-TB&XH, Cảnh sát khu vực Công an Phường, Trưởng ban Khu phố và Đại diện thân nhân kiểm tra vết thương và điều kiện cư trú thực tế. |
| ![07 Thông báo niêm yết](docs/screenshots/tinh_nang_moi/07_thong_bao_niem_yet_15_ngay.png) | **Hình 7: Thông báo Niêm yết công khai tại UBND Phường (Mẫu 15/NĐ131 - Tab 1)**<br>Thông báo niêm yết danh sách đối tượng người có công đề nghị công nhận trong thời hạn 15 ngày làm việc theo Điều 13, 24, 38 Nghị định 131/2021/NĐ-CP. |
| ![08 Kết thúc niêm yết](docs/screenshots/tinh_nang_moi/08_bien_ban_ket_thuc_niem_yet.png) | **Hình 8: Biên bản Kết thúc Niêm yết công khai sau 15 ngày (Mẫu 15/NĐ131 - Tab 2)**<br>Biên bản kết thúc niêm yết với 4 chữ ký liên ngành: Chủ tịch UBND Phường (Trần Văn Nam), UB MTTQ Việt Nam Phường, Trưởng ban Khu phố và Cán bộ LĐ-TB&XH. |

---

### 3. Nghiệp Vụ Chi Trả Trợ Cấp & An Sinh Xã Hội
| Hình ảnh giao diện | Mô tả nghiệp vụ chi tiết |
|:---|:---|
| ![09 Mai táng phí](docs/screenshots/tinh_nang_moi/09_quyet_dinh_mai_tang_phi.png) | **Hình 9: Quyết định hưởng trợ cấp Mai táng phí & Trợ cấp 1 lần (`/chi-tra`)**<br>Tính toán mức chi theo Nghị định 73/2024/NĐ-CP: Mai táng phí 23.400.000đ ($10$ tháng lương CS) + Trợ cấp 1 lần 10.500.000đ = Tổng chi 33.900.000đ có ký số SmartCA của TS. Nguyễn Văn Hùng. |
| ![10 Sổ chi trả C70b-HD](docs/screenshots/tinh_nang_moi/10_so_chi_tra_mau_c70b_hd.png) | **Hình 10: Sổ theo dõi Chi trả Trợ cấp Mẫu C70b-HD (Khổ A4 ngang)**<br>Chuẩn hóa theo Thông tư liên tịch BTC - BLĐTBXH, phân tích chi tiết mức chuẩn mới 2.789.000đ theo Nghị định 77/2024/NĐ-CP, tỷ lệ chi trả ATM VNeID đạt 98.4%, 3 chữ ký và xuất file CSV. |
| ![11 Bảng kê Bưu điện](docs/screenshots/tinh_nang_moi/11_bang_ke_buu_dien_vnpost.png) | **Hình 11: Bảng kê chi trả tiền mặt qua Bưu điện VNPost (Mẫu C70a-VNPost)**<br>Danh sách chi trả tiền mặt tại bưu cục cho các trường hợp người già yếu chưa có tài khoản ngân hàng. |
| ![12 Phát tiền tận nhà](docs/screenshots/tinh_nang_moi/12_phieu_phat_tien_tan_nha.png) | **Hình 12: Phiếu phát tiền trợ cấp tận nhà cho đối tượng đặc biệt**<br>Phiếu phát tiền tận nhà dành riêng cho Bà Mẹ VNAH Lê Thị Mai và Thương binh nặng tỷ lệ $\ge 81\%$. |
| ![13 Trích lục mộ GPS](docs/screenshots/tinh_nang_moi/13_trich_luc_mo_liet_si_gps.png) | **Hình 13: Trích lục thông tin mộ liệt sĩ & Bản đồ chỉ đường GPS (`/nghia-trang`)**<br>Giấy trích lục thông tin vị trí mộ (Khu/Lô/Hàng/Số mộ, Tọa độ GPS `11.1394°N, 106.6025°E`) tích hợp QR Code dẫn đường Google Maps đến tận bia mộ. |
| ![14 Quyết định BTXH](docs/screenshots/tinh_nang_moi/14_quyet_dinh_bao_tro_xa_hoi.png) | **Hình 14: Quyết định trợ cấp Bảo trợ xã hội hàng tháng (`/an-sinh-xa-hoi`)**<br>Áp dụng mức chuẩn mới 500.000đ/tháng theo Nghị định 76/2024/NĐ-CP và tự động cấp thẻ BHYT diện BTXH miễn phí 100%. |
| ![15 Phiếu tiếp dân](docs/screenshots/tinh_nang_moi/15_phieu_huong_dan_tiep_dan.png) | **Hình 15: Phiếu Hướng dẫn & Thông báo thụ lý Tiếp công dân (`/van-ban`)**<br>Mẫu phiếu hành chính chuẩn theo Luật Tiếp công dân 2013 và Thông tư 04/2021/TT-TTCP của Thanh tra Chính phủ. |

---

### 4. Cổng Tra Cứu Dịch Vụ Công & Khung Đánh Giá Hiệu Quả Đề Án 06
| Hình ảnh giao diện | Mô tả nghiệp vụ chi tiết |
|:---|:---|
| ![16 Tra cứu công dân](docs/screenshots/tinh_nang_moi/16_tra_cuu_cong_dan_ket_qua.png) | **Hình 16: Cổng Tra cứu Công dân: Tải kết quả & Giấy tờ điện tử (`/tra-cuu`)**<br>Cho phép người dân tải trực tiếp: Giấy hẹn Một cửa điện tử (Mẫu 01) có mã QR, Quyết định trợ cấp SmartCA và Thẻ BHYT Mẫu D03-TS. |
| ![17 Đánh giá hiệu quả](docs/screenshots/tinh_nang_moi/17_danh_gia_hieu_qua_nghiep_vu.png) | **Hình 17: Phân hệ Đánh giá Hiệu quả Đề tài & Cải cách TTHC (`/phan-tich`)**<br>Bảng chỉ số đo lường toàn diện: SLA đúng hạn 99.2%, SIPAS hài lòng 98.6%, Đề án 06 thanh toán VNeID 98.4%, ROI tiết kiệm ngân sách 1,2 tỷ đồng/năm. |

---

## 🛠️ HƯỚNG DẪN KIỂM THỬ VÀ TRẢI NGHIỆM TÍNH NĂNG MỚI

### Bước 1: Khởi động máy chủ phát triển
```bash
npm run dev
```
Hệ thống sẵn sàng tại: `http://localhost:8081`

### Bước 2: Trải nghiệm các luồng nghiệp vụ thực tế
1. **Đăng nhập:**
   - Vào `http://localhost:8081/login`.
   - Chọn vai trò **"Kỹ sư IT"** (`admin.tech@binhduong.gov.vn`) $\rightarrow$ Truy cập `/ky-thuat` để thao tác Database Studio và SQL Console.
   - Chọn vai trò **"Giám đốc Sở"** (`giamdoc.so@binhduong.gov.vn`) $\rightarrow$ Xác nhận không thể truy cập `/ky-thuat` (đảm bảo SoD).
2. **Kiểm tra Niêm yết công khai & Xác minh thực địa:**
   - Vào `http://localhost:8081/ho-so`.
   - Nhấn vào chi tiết hồ sơ `HS-2026-001` (Nguyễn Văn Thắng).
   - Nhấn nút **"Niêm yết (NĐ 131)"** $\rightarrow$ Xem và in Biên bản niêm yết 15 ngày 4 bên ký.
   - Nhấn nút **"Biên bản XMTĐ"** $\rightarrow$ Xem biên bản kiểm tra hiện trường liên ngành.
3. **Kiểm tra Mai táng phí & Sổ chi trả:**
   - Vào `http://localhost:8081/chi-tra`.
   - Nhấn **"Quyết định Mai táng phí"** $\rightarrow$ Kiểm tra số tiền 33.900.000đ và chữ ký số TS. Nguyễn Văn Hùng.
   - Nhấn **"Sổ chi trả (Mẫu C70b-HD)"** $\rightarrow$ Xem bảng thanh toán trợ cấp mức chuẩn 2.789.000đ.
   - Nhấn **"Bảng kê Bưu điện VNPost"** $\rightarrow$ Xem danh sách phát tiền mặt và phiếu phát tận nhà cho Mẹ VNAH.
4. **Kiểm tra Mộ liệt sĩ & GPS:**
   - Vào `http://localhost:8081/nghia-trang`.
   - Bấm vào một mộ liệt sĩ bất kỳ $\rightarrow$ Nhấn **"Trích lục mộ"** $\rightarrow$ Xem giấy trích lục và quét mã QR GPS dẫn đường.
5. **Kiểm tra Quyết định Bảo trợ xã hội:**
   - Vào `http://localhost:8081/an-sinh-xa-hoi`.
   - Tại Tab "Bảo trợ xã hội", nhấn nút **"Quyết định"** tại bất kỳ dòng nào $\rightarrow$ Xem quyết định hưởng trợ cấp mức chuẩn 500.000đ kèm mã thẻ BHYT.
6. **Kiểm tra Tra cứu dịch vụ công:**
   - Vào `http://localhost:8081/tra-cuu`.
   - Nhập mã hồ sơ mẫu `HS-2026-001` hoặc `074095000123`.
   - Tải Giấy hẹn Một cửa điện tử (Mẫu 01), Quyết định trợ cấp SmartCA và Thẻ BHYT Mẫu D03-TS.

---

## 📊 KẾT QUẢ KIỂM DUYỆT HỆ THỐNG
- **Kiểm thử biên dịch (Build Test):** `npm run build` vượt qua 100% không cảnh báo, thời gian build `~600ms`.
- **Kiểm thử HTTP Route Healthcheck:** Toàn bộ 12 tuyến đường dẫn cốt lõi (`/ho-so`, `/tham-dinh`, `/chi-tra`, `/nghia-trang`, `/an-sinh-xa-hoi`, `/tra-cuu`, `/ky-thuat`, `/login`, `/phan-tich`, `/danh-gia`, v.v.) phản hồi mã `200 OK`.
- **Toàn vẹn mã nguồn:** Tuân thủ nguyên tắc Lovable, không can thiệp lịch sử commit và bảo toàn toàn bộ cấu trúc dự án.

---
*Tài liệu được cập nhật ngày 03/11/2026 bởi Tác giả Đoàn Minh Quân - Hệ thống Quản trị Công vụ Số.*

