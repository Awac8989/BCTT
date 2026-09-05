# 🏛️ HỆ THỐNG QUẢN LÝ HỒ SƠ NGƯỜI CÓ CÔNG & ĐÁNH GIÁ DỊCH VỤ CÔNG
### Sở Lao động - Thương binh và Xã hội tỉnh Bình Dương · Phòng LĐTBXH TP. Thủ Dầu Một

[![Phiên bản](https://img.shields.io/badge/Phiên_bản-2.0_Made_by_MINHQUAN-red.svg)](https://github.com/Awac8989/ho-so-tran-an)
[![Framework](https://img.shields.io/badge/React-19.2-blue.svg)](https://react.dev)
[![Router](https://img.shields.io/badge/TanStack_Router-v1-orange.svg)](https://tanstack.com/router)
[![Styling](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8.svg)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6.svg)](https://www.typescriptlang.org)
[![Build](https://img.shields.io/badge/Vite-8.1-yellow.svg)](https://vitejs.dev)

---

## 📖 Giới Thiệu Dự Án

Xuất phát từ thực tiễn công tác giải quyết chế độ chính sách cho Người có công với cách mạng tại địa bàn tỉnh Bình Dương (trọng tâm là TP. Thủ Dầu Một), việc quản lý hồ sơ trước đây còn gặp nhiều khó khăn: hồ sơ giấy đồ sộ, việc đối soát chi trả trợ cấp hàng tháng qua Ngân hàng / Bưu điện mất nhiều thời gian, công tác lập danh sách điều dưỡng dễ sai sót định mức và chưa có kênh số hóa để lắng nghe phản hồi của người dân sau khi làm thủ tục tại Bộ phận Một cửa.

**Hệ thống Quản lý Hồ sơ Người có công & Đánh giá Dịch vụ công (Phiên bản 2.0)** được tác giả **Minh Quân** nghiên cứu và phát triển nhằm mang đến một giải pháp công nghệ toàn diện, hiện đại, đạt chuẩn chính quyền số:
- 📑 **Số hóa toàn bộ vòng đời hồ sơ Người có công:** Tiếp nhận ➔ Thẩm định điều kiện ➔ Phê duyệt trợ cấp ➔ Lập danh sách chi trả ➔ Điều dưỡng phục hồi sức khỏe.
- 🖨️ **Chuẩn hóa mẫu biểu hành chính nhà nước:** Tự động tạo và in **Giấy tiếp nhận hồ sơ & Hẹn trả kết quả có Mã QR Code** (Mẫu số 01 - Nghị định 61/2018/NĐ-CP) và **Phiếu chi trả trợ cấp Mẫu C70a-HD**.
- 🌟 **Tách bạch kênh đánh giá CSAT / SIPAS:** Người dân quét mã QR trên điện thoại hoặc thao tác tại Kiosk công cộng để đánh giá sự hài lòng độc lập; Cán bộ theo dõi giám sát chỉ số hài lòng theo thời gian thực trên Bảng điều khiển riêng.
- 🔐 **Phân cấp điều hành rạch ròi:** Phân chia rõ quyền hạn giữa **Admin Cấp Sở** (quản trị toàn tỉnh) và **Admin Cấp Phòng** (thụ lý địa bàn cấp huyện/thành phố).

---

## 📸 Hình Ảnh Giao Diện & Tính Năng Thực Tế

### 1. Cổng Đăng Nhập Quản Trị Công Vụ (`/login`)
Được thiết kế trang trọng với Quốc huy Việt Nam, Quốc hiệu và sắc đỏ công quyền. Hệ thống tích hợp sẵn tab chuyển đổi phân quyền giữa **Admin Cấp Sở** và **Admin Cấp Phòng**, kèm nút **1-Click Đăng nhập** giúp trải nghiệm và đánh giá hệ thống tức thì.

<p align="center">
  <img src="docs/screenshots/01_login_cap_so.png" alt="Cổng Đăng Nhập Admin Cấp Sở" width="49%" />
  <img src="docs/screenshots/02_login_cap_phong.png" alt="Cổng Đăng Nhập Admin Cấp Phòng" width="49%" />
</p>

* Dưới cùng của Cổng đăng nhập ghi nhận dấu ấn phiên bản: **`PHIÊN BẢN 2.0 MADE BY MINHQUAN`**.

---

### 2. Bảng Điều Khiển Trung Tâm & Phân Tầng Màu Sắc Trực Quan (`/`)
Trang chủ điều hành cung cấp các thẻ KPI quan trọng: Tổng số đối tượng, Kinh phí chi trả hàng tháng, Tỷ lệ hồ sơ đúng hạn, Điểm hài lòng CSAT và Cảnh báo hồ sơ quá hạn xử lý.

![Bảng điều khiển trung tâm](docs/screenshots/03_dashboard_tong_quan.png)

Biểu đồ cột **"Kinh phí chi trả theo phường"** được phối màu phân tầng trực quan theo 3 cấp độ ngân sách, xóa bỏ hoàn toàn tình trạng màu đen đơn điệu:
- 🟢 **Xanh Lá Emerald (`#00a65a`)**: Kinh phí cao ($\ge 2.5$ tỷ VNĐ/tháng) như Phú Cường, Phú Hòa, Hiệp Thành.
- 🩵 **Xanh Ngọc Cyan (`#00c0ef`)**: Kinh phí trung bình ($1.5 - 2.5$ tỷ VNĐ/tháng).
- 🔵 **Xanh Lam Royal Blue (`#3c8dbc`)**: Kinh phí dưới $1.5$ tỷ VNĐ/tháng.
- Tooltip thẻ trắng đổ bóng nổi, tiêu đề đỏ đậm hiển thị rõ nét từng phường khi rê chuột.

![Biểu đồ kinh phí chi trả theo phường](docs/screenshots/04_bieu_do_kinh_phi.png)

---

### 3. Menu Tài Khoản & Chuyển Đổi Nhanh Giữa Cấp Sở và Cấp Phòng
Cán bộ có thể xem thông tin cá nhân, chức vụ, phạm vi thẩm quyền và chuyển đổi qua lại linh hoạt giữa **Admin Cấp Sở** và **Admin Cấp Phòng** chỉ với 1 cú click ngay trên thanh Header.

![Chuyển đổi vai trò quản trị](docs/screenshots/05_chuyen_doi_vai_tro.png)

---

### 4. Xuất Giấy Hẹn Một Cửa Tích Hợp Mã QR Đánh Giá (`/ho-so`)
Khi tiếp nhận hồ sơ tại Bộ phận Một cửa, cán bộ nhấn in để xuất **Giấy tiếp nhận hồ sơ và Hẹn trả kết quả** chuẩn Mẫu số 01 (Nghị định 61/2018/NĐ-CP).

![Giấy hẹn tiếp nhận Một cửa tích hợp Mã QR](docs/screenshots/06_giay_hen_mot_cua_qr.png)

* Khối **Mã QR Code lớn** in ngay trên giấy hẹn: Công dân chỉ cần mở camera điện thoại hoặc Zalo quét mã là chuyển ngay đến Cổng đánh giá với mã hồ sơ được điền sẵn.

---

### 5. Phân Hệ Đánh Giá CSAT Dành Riêng Cho Người Dân (`/khao-sat`)
Giao diện hoàn toàn tách biệt với hệ thống cán bộ: không có thanh menu quản lý, tối ưu hoàn hảo cho màn hình di động và Kiosk cảm ứng. Chữ to, nút bấm lớn, hình mặt cười 1-5 sao và các thẻ góp ý nhanh giúp người cao tuổi và thân nhân liệt sĩ thao tác dễ dàng.

![Cổng đánh giá sự hài lòng của công dân](docs/screenshots/07_cong_dan_danh_gia_csat.png)

---

### 6. Trung Tâm Giám Sát CSAT & SIPAS Của Cán Bộ (`/danh-gia`)
Dữ liệu đánh giá của người dân sau khi gửi sẽ lập tức đồng bộ về màn hình giám sát của cán bộ:
- Theo dõi 4 chỉ số KPI: Tỷ lệ CSAT, Tổng lượt đánh giá, Ý kiến chưa hài lòng ($\le 2$ sao) cần giải trình.
- Biểu đồ **Radar 4 tiêu chí cốt lõi (Chuẩn SIPAS)**: Thái độ phục vụ, Thời gian xử lý, Tính công khai minh bạch, Cơ sở vật chất.
- Bảng xếp hạng CSAT 14 phường/xã và nhật ký phản hồi công dân thời gian thực.

![Giám sát đánh giá dịch vụ công của cán bộ](docs/screenshots/08_giam_sat_csat_can_bo.png)

---

### 7. Quản Lý Chi Trả Trợ Cấp & Xuất Phiếu Chi Mẫu C70a-HD (`/chi-tra`)
Quản lý danh sách chi trả trợ cấp hàng tháng qua Tài khoản Ngân hàng (ATM) và Bưu điện văn hóa xã. Hỗ trợ xuất Phiếu chi chuẩn Mẫu C70a-HD có mã vạch xác thực.

![Phiếu chi trả trợ cấp C70a-HD](docs/screenshots/09_phieu_chi_c70a_hd.png)

---

### 8. Tra Cứu & Xem Chi Tiết Hồ Sơ Liệt Sĩ (`/ho-so/$id`)
Xem đầy đủ thông tin trích lục liệt sĩ, nguyên quán, nơi hy sinh, nghĩa trang an táng, danh sách thân nhân thờ cúng và các quyết định hưởng tiền tuất hàng tháng.

![Chi tiết hồ sơ liệt sĩ](docs/screenshots/10_chi_tiet_ho_so_liet_si.png)

---

### 9. Quản Lý Chế Độ Điều Dưỡng Người Có Công (`/dieu-duong`)
Thực hiện nghiêm túc quy định tại **Nghị định 131/2021/NĐ-CP**:
- Phân loại điều dưỡng: Hàng năm (thương binh nặng $>81\%$, Mẹ VNAH) và 2 năm một lần.
- Quản lý 2 hình thức: **Điều dưỡng tập trung** (kinh phí 4.869.000 đ/người) và **Điều dưỡng tại nhà** (kinh phí 2.434.500 đ/người).
- Theo dõi chỉ tiêu phân bổ và danh sách đoàn đi điều dưỡng tại Vũng Tàu, Đà Lạt, Nha Trang.

![Quản lý chỉ tiêu điều dưỡng NCC](docs/screenshots/11_quan_ly_dieu_duong.png)

---

### 10. Bản Đồ Nhiệt & Báo Cáo Thống Kê Phân Tích (`/phan-tich`)
Bản đồ nhiệt mật độ đối tượng trên 14 phường/xã TP. Thủ Dầu Một chuyển màu trực quan từ xanh lá sang xanh lam, kết hợp biểu đồ dự báo ngân sách và cơ cấu chính sách.

![Bản đồ nhiệt và phân tích số liệu điều hành](docs/screenshots/12_ban_do_nhiet_phan_tich.png)

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

| Lớp kiến trúc | Công nghệ & Thư viện | Vai trò |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19.2 + TypeScript 5.9** | Giao diện người dùng hiện đại, an toàn kiểu dữ liệu |
| **Routing & SSR** | **TanStack Router + TanStack Start** | Định tuyến dựa trên tệp tin (File-based routing), tải trang tức thì |
| **Styling** | **Tailwind CSS v4** | Hệ thống utility tokens, giao diện công vụ trang trọng |
| **Data Visualization** | **Recharts 2.15** | Biểu đồ cột phân tầng, Radar SIPAS, Pie chart, Line chart |
| **State Management** | **React `useSyncExternalStore`** | Quản lý state tập trung, đồng bộ LocalStorage & kiểm toán Audit Logs |
| **Icons & UI Elements**| **Lucide React + Radix UI + Sonner** | Hệ thống icon hành chính, modal, tooltip, thông báo toast |
| **Database Schema** | **PostgreSQL (schema.sql)** | Thiết kế 8 bảng quan hệ chuẩn hóa 3NF, hỗ trợ ACID |

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Thử (Quick Start)

### 1. Yêu cầu môi trường:
- Đã cài đặt **Node.js** phiên bản 18 trở lên (Khuyến nghị Node.js v20 LTS).
- Trình quản lý gói `npm` hoặc `bun`.

### 2. Cài đặt các thư viện:
```bash
git clone https://github.com/Awac8989/ho-so-tran-an.git
cd ho-so-tran-an
npm install
```

### 3. Khởi chạy máy chủ phát triển (Dev Server):
```bash
npm run dev
```
Hệ thống sẽ chạy tại địa chỉ: **`http://localhost:8081`** (hoặc port được cấp tự động).

### 4. Đóng gói cho môi trường Production:
```bash
npm run build
npm run preview
```

---

## 🔑 Tài Khoản Trải Nghiệm Mẫu

Tại trang Đăng nhập (`/login`), bạn có thể bấm trực tiếp nút **1-Click Đăng nhập** hoặc dùng tài khoản sau:

| Cấp độ quản trị | Email công vụ | Mật khẩu | Họ tên cán bộ |
| :--- | :--- | :--- | :--- |
| **Admin Cấp Sở** | `admin.so@binhduong.gov.vn` | `admin123` | **TS. Nguyễn Văn Hùng** (Phó Giám đốc Sở) |
| **Admin Cấp Phòng** | `admin.phong@thudaumot.binhduong.gov.vn` | `admin123` | **Nguyễn Thị Minh Thảo** (Chuyên viên Một cửa) |

---

## 📂 Cấu Trúc Thư Mục Dự Án

```
filebctt/
├── database/
│   └── schema.sql                  # CSDL quan hệ PostgreSQL 8 bảng chuẩn
├── docs/
│   ├── TECHNICAL_DESIGN_DOCUMENT.md# Tài liệu đặc tả thiết kế kỹ thuật (TDD)
│   └── screenshots/                # 12 ảnh chụp màn hình giao diện thực tế
├── public/
│   ├── favicon.svg                 # Quốc huy vector cờ đỏ sao vàng
│   ├── favicon.ico                 # Favicon chuẩn đa kích thước
│   └── robots.txt
├── src/
│   ├── api/                        # Mock API RESTful (profiles, calculator, surveys, analytics)
│   ├── components/                 # Các component dùng chung (AppShell, GiayHenModal, PhieuChiModal,...)
│   ├── data/                       # Mock data chuẩn địa bàn 14 phường TP. Thủ Dầu Một
│   ├── routes/                     # Hệ thống trang giao diện (File-based Routing)
│   │   ├── index.tsx               # Bảng điều khiển trung tâm
│   │   ├── login.tsx               # Cổng đăng nhập phân quyền Sở / Phòng (v2.0)
│   │   ├── ho-so/                  # Quản lý & tra cứu hồ sơ liệt sĩ
│   │   ├── tham-dinh.tsx           # Quy trình thẩm định 5 bước
│   │   ├── chi-tra.tsx             # Chi trả trợ cấp & Phiếu chi C70a-HD
│   │   ├── dieu-duong.tsx          # Quản lý chế độ điều dưỡng Nghị định 131
│   │   ├── danh-gia.tsx            # Giám sát đánh giá CSAT & Radar SIPAS của cán bộ
│   │   ├── khao-sat.tsx            # Cổng đánh giá sự hài lòng dành riêng cho công dân
│   │   ├── phan-tich.tsx           # Bản đồ nhiệt 14 phường & phân tích ngân sách
│   │   └── he-thong.tsx            # Cấu hình định mức trợ cấp & danh mục
│   ├── services/                   # Logic tính trợ cấp, phân tích sắc thái ý kiến & app-state
│   └── styles.css                  # Thiết kế bảng màu và utility classes
└── package.json
```

---

## 👤 Tác Giả & Bản Quyền

* **Tác giả phát triển:** **Minh Quân**
* **Phiên bản:** `Phiên bản 2.0 · Made by MINHQUAN`
* **Đơn vị phối hợp nghiệp vụ:** Sở Lao động - Thương binh và Xã hội tỉnh Bình Dương & Phòng LĐTBXH TP. Thủ Dầu Một.
* **Giấy phép:** Phục vụ nghiên cứu, chuyển đổi số hành chính công và quản lý chính sách người có công.
