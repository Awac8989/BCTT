# 🏛️ HỆ THỐNG QUẢN LÝ NGHIỆP VỤ CHUYÊN MÔN & ĐÁNH GIÁ DỊCH VỤ CÔNG CẤP XÃ/PHƯỜNG
### Ủy ban nhân dân Phường Phú Cường / Phòng LĐTBXH TP. Thủ Dầu Một · Sở LĐTBXH tỉnh Bình Dương

[![Phiên bản](https://img.shields.io/badge/Phiên_bản-2.5_Enterprise_Pro-red.svg)](https://github.com/Awac8989/BCTT)
[![Framework](https://img.shields.io/badge/React-19.2-blue.svg)](https://react.dev)
[![Router](https://img.shields.io/badge/TanStack_Router_Start-v1-orange.svg)](https://tanstack.com/router)
[![Styling](https://img.shields.io/badge/Tailwind_CSS-v4.2-38bdf8.svg)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6.svg)](https://www.typescriptlang.org)
[![Build](https://img.shields.io/badge/Vite-8.1-yellow.svg)](https://vitejs.dev)
[![Backend Tests](https://img.shields.io/badge/Backend_Tests-222%20PASSED-brightgreen.svg)](#-kiểm-thử-tự-động-backend-222-test-cases)
[![Database](https://img.shields.io/badge/CSDL_3NF-42%20Bảng%20InnoDB-purple.svg)](#-kiến-trúc-cơ-sở-dữ-liệu-quan-hệ-3nf-42-bảng)
[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel%20Ready-black.svg)](#-hướng-dẫn-triển-khai-lên-vercel-deployment-guide)
[![Tài liệu Kiến trúc](https://img.shields.io/badge/Tài_liệu-Kiến_trúc_Hệ_thống_Chi_tiết-emerald.svg)](docs/KIEN_TRUC_HE_THONG.md)

---

## 📑 MỤC LỤC TỔNG QUAN
1. [Giới Thiệu Tổng Quan Hệ Thống](#-giới-thiệu-tổng-quan-hệ-thống)
2. [Kiến Trúc Hệ Thống Toàn Diện (System Architecture Specification)](#-kiến-trúc-hệ-thống-toàn-diện-system-architecture-specification)
3. [Thiết Kế UX/UI Chuẩn Mực Chính Quyền Số (UI/UX Design System)](#-thiết-kế-uxui-chuẩn-mực-chính-quyền-số-uiux-design-system)
4. [Danh Mục 15 Phân Hệ Nghiệp Vụ Cốt Lõi](#-danh-mục-15-phân-hệ-nghiệp-vụ-cốt-lõi)
5. [Bộ Sưu Tập Hình Ảnh Giao Diện Thực Tế (Visual Showcase - 31 Màn Hình)](#-bộ-sưu-tập-hình-ảnh-giao-diện-thực-tế-visual-showcase---31-màn-hình)
6. [Kiến Trúc Cơ Sở Dữ Liệu Quan Hệ 3NF (42 Bảng)](#-kiến-trúc-cơ-sở-dữ-liệu-quan-hệ-3nf-42-bảng)
7. [Kiểm Thử Tự Động Backend (222 Test Cases Passed)](#-kiểm-thử-tự-động-backend-222-test-cases)
8. [Hướng Dẫn Cài Đặt & Chạy Local](#-hướng-dẫn-cài-đặt--chạy-local-local-setup)
9. [Hướng Dẫn Triển Khai Lên Vercel (Deployment Guide)](#-hướng-dẫn-triển-khai-lên-vercel-deployment-guide)
10. [Tác Giả & Thông Tin Dự Án](#-tác-giả--thông-tin-dự-án)

---

## 📖 GIỚI THIỆU TỔNG QUAN HỆ THỐNG

**Hệ thống Quản lý Nghiệp vụ Chuyên môn & Đánh giá Dịch vụ công Cấp Xã/Phường (Phiên bản 2.5 Enterprise Pro)** là nền tảng số hóa quản trị công vụ cấp cơ sở tiên phong, được thiết kế chuyên biệt cho Ủy ban nhân dân Phường Phú Cường, Phòng Lao động - Thương binh và Xã hội TP. Thủ Dầu Một và Sở Lao động - Thương binh và Xã hội tỉnh Bình Dương.

Hệ thống tích hợp liền mạch giữa **15 phân hệ chuyên môn sâu rộng**, giải quyết toàn diện bài toán liên thông công tác điều hành, giải quyết thủ tục hành chính một cửa, quản lý an sinh xã hội, giáo dục, văn hóa thể thao, truyền thông chuyển đổi số và đo lường mức độ hài lòng của nhân dân (CSAT/SIPAS), tuân thủ 100% các văn bản quy phạm pháp luật hiện hành:
- **Người có công & Đền ơn đáp nghĩa:** Pháp lệnh số 02/2020/UBTVQH14, Nghị định số 131/2021/NĐ-CP, Nghị định số 75/2021/NĐ-CP (mức chuẩn 2.055.000đ).
- **Cơ chế Một cửa Quốc gia & DVC:** Nghị định số 61/2018/NĐ-CP, Nghị định số 107/2021/NĐ-CP, Quyết định số 766/QĐ-TTg.
- **Văn phòng Điện tử & Thể thức văn bản:** Nghị định số 30/2020/NĐ-CP, Trục liên thông văn bản quốc gia VDXP và ký số SmartCA.
- **Bảo trợ Xã hội & Giảm nghèo đa chiều:** Nghị định số 20/2021/NĐ-CP, Quyết định số 24/2021/QĐ-TTg, Thông tư số 01/2022/TT-BLĐTBXH, Luật Trẻ em 2016, Thông tư số 01/2019/TT-BLĐTBXH, Nghị định số 45/2017/NĐ-CP.
- **Giáo dục & Đào tạo cơ sở:** Thông tư số 49/2021/TT-BGDĐT, Nghị định số 20/2014/NĐ-CP, Thông tư số 07/2016/TT-BGDĐT, Thông tư số 44/2014/TT-BGDĐT, Quyết định số 1246/QĐ-BYT (Kiểm thực ATTP 3 bước).
- **Văn hóa, Thể thao & Du lịch:** Nghị định số 86/2023/NĐ-CP, Quyết định số 04/2022/QĐ-TTg, Chỉ thị số 814/TTg, Nghị định số 109/2015/NĐ-CP, Nghị định số 36/2019/NĐ-CP & Thông tư số 04/2018/TT-BVHTTDL.
- **Thông tin, Truyền thông & Chuyển đổi số:** Nghị định số 42/2022/NĐ-CP, Bộ chỉ số DTI cấp xã, Chỉ thị số 14/CT-TTg & Quyết định số 830/QĐ-TTg (Lực lượng 35).
- **Đánh giá KPI & Thi đua công vụ:** Nghị định số 90/2020/NĐ-CP & Nghị định số 48/2023/NĐ-CP, Quyết định số 06/QĐ-TTg (Đề án 06).

---

## 🏗️ KIẾN TRÚC HỆ THỐNG TOÀN DIỆN (SYSTEM ARCHITECTURE SPECIFICATION)

> Chi tiết kỹ thuật chuyên sâu được đặc tả tại [docs/KIEN_TRUC_HE_THONG.md](file:///q:/CODE_visual/filebctt/docs/KIEN_TRUC_HE_THONG.md).

### 1. Sơ Đồ Kiến Trúc Đa Tầng (High-Level Architecture)
Hệ thống vận hành theo kiến trúc 4 tầng hiện đại, phân tách độc lập giữa Giao diện (Presentation), Cổng an ninh mạng (Gateway), Động cơ dịch vụ vi mô (Services Engine) và Tầng dữ liệu quan hệ 3NF (Persistence):

```mermaid
graph TD
    subgraph TIER1["1. TẦNG TRẢI NGHIỆM ĐA THIẾT BỊ (CLIENT APPLICATION LAYER)"]
        UI1["🖥️ Web Cán bộ & Lãnh đạo<br/>(React 19 + TanStack Router)"]
        UI2["📱 Kênh Công dân Mobile/Tablet<br/>(Tra cứu QR Code, CSAT Emoji)"]
        UI3["📟 Kiosk Cảm ứng Một cửa<br/>(Màn hình chuyên dụng tiếp dân)"]
    end

    subgraph TIER2["2. TẦNG ĐIỀU PHỐI BIÊN & BẢO MẬT (GATEWAY & EDGE SECURITY)"]
        EDGE["🛡️ Vercel Edge / Cloudflare Network<br/>(TLS 1.3, DDoS Mitigation, Edge Caching)"]
        GW["🌐 Nitro API Gateway & Dispatcher<br/>(JWT Interceptor, Rate Limiting, RBAC Enforcer)"]
    end

    subgraph TIER3["3. TẦNG DỊCH VỤ & ĐỘNG CƠ TÍNH TOÁN (SERVICES & LOGIC ENGINE)"]
        S1["🔐 Auth & Multi-Domain RBAC Service"]
        S2["🧮 Financial Engine (NĐ 75/2021)"]
        S3["📑 Profile & One-Stop Lifecycle Engine"]
        S4["📊 Analytics & KPI Scoring Engine"]
        S5["💬 AI NLP Sentiment Analysis"]
        S6["🗺️ GIS Cemetery & Mapping Engine"]
        S7["🗄️ Database Studio & SQL Console Engine"]
    end

    subgraph TIER4["4. TẦNG LƯU TRỮ QUAN HỆ 3NF & GIAO DỊCH (DATA STORAGE LAYER)"]
        DB[("🗄️ Relational 3NF Database<br/>(42 Tables InnoDB, PK/FK Constraints)")]
        TX[("💾 ACID Transaction Log (WAL)")]
        FILE[("📦 Persistence File Storage<br/>(database_persistence.json)")]
        EXT[("🔗 Tích hợp Trục LGSP / SmartCA / VDXP / Đề án 06")]
    end

    UI1 --> EDGE
    UI2 --> EDGE
    UI3 --> EDGE
    EDGE --> GW
    GW --> S1
    GW --> S2
    GW --> S3
    GW --> S4
    GW --> S5
    GW --> S6
    GW --> S7
    S1 --> DB
    S2 --> DB
    S3 --> DB
    S4 --> DB
    S5 --> DB
    S6 --> DB
    S7 --> DB
    DB --- TX
    DB --- FILE
    S3 -.-> EXT
```

### 2. Mô Hình Phân Quyền Đa Mảng (Multi-Domain RBAC)
Hệ thống quản lý phân quyền ma trận 2 chiều (Cấp bậc hành chính $\times$ Mảng chuyên môn phụ trách):
```
+---------------------------------------------------------------------------------------------------------+
|                                    MA TRẬN PHÂN QUYỀN ĐA MẢNG (RBAC)                                     |
+---------------------------------------------------------------------------------------------------------+
|  VAI TRÒ / NHÓM TÀI KHOẢN   | PHẠM VI DỮ LIỆU  | KÝ SỐ SMARTCA | CÁC PHÂN HỆ QUYỀN HẠN TRUY CẬP         |
+-----------------------------+------------------+---------------+----------------------------------------+
| 👑 Lãnh đạo Sở LĐTBXH       | Toàn tỉnh BD     | Phê chuẩn vĩ mô| Toàn bộ 15 phân hệ, Radar SIPAS Tỉnh  |
| 🏢 Lãnh đạo Phòng LĐTBXH    | TP. Thủ Dầu Một  | Duyệt chi C70a| Hồ sơ NCC, Chi trả, Đối soát, CSDL 3NF |
| 🏛️ Lãnh đạo UBND Phường     | Địa bàn Phường   | Ký số Thẩm định| Điều hành, e-Office, Một cửa, Đội 814  |
| 🔴 Cán bộ Khối Chính sách   | Phường Phú Cường | Thụ lý NCC    | Hồ sơ NCC, Mai táng, Chỉnh hình, GIS   |
| 🟡 Cán bộ Khối An sinh XH   | Phường Phú Cường | Thụ lý BTXH   | Hộ nghèo, Trẻ em, Quỹ Đền ơn đáp nghĩa |
| 🟢 Cán bộ Khối Giáo dục     | Phường Phú Cường | Thẩm định MN  | Mầm non ngoài CL, Phổ cập, ATTP bán trú|
| 🔵 Cán bộ Khối Thông tin CS | Phường Phú Cường | Thụ lý 1022   | Phản ánh hiện trường, DTI, Lực lượng 35|
| 👥 Công dân & Doanh nghiệp  | Theo Mã hồ sơ QR | Không áp dụng | Khảo sát CSAT, Tra cứu, Dâng hương GIS |
+---------------------------------------------------------------------------------------------------------+
```

### 3. Quy Trình Vòng Đời Thụ Lý Hồ Sơ Điện Tử 6 Bước
Mọi thủ tục hành chính Một cửa đều trải qua quy trình chuẩn hóa:
```
[1. Tiếp nhận & Quét AI OCR] ➔ [2. Kiểm tra Trùng CCCD] ➔ [3. Thẩm định Nghiệp vụ]
                             ➔ [4. Ký số SmartCA Lãnh đạo] ➔ [5. Xuất Kết quả & C70a-HD]
                             ➔ [6. Đo lường CSAT SIPAS Công dân]
```

---

## 🎨 THIẾT KẾ UX/UI CHUẨN MỰC CHÍNH QUYỀN SỐ (UI/UX DESIGN SYSTEM)

Trải nghiệm người dùng (UX) và giao diện trực quan (UI) được chế tác tỉ mỉ theo tiêu chuẩn quốc tế kết hợp cùng hồn cốt cơ quan hành chính nhà nước:

```
+-------------------------------------------------------------------------------------------------------+
|                                  KIẾN TRÚC THIẾT KẾ UX/UI CÔNG QUYỀN SỐ                               |
+-------------------------------------------------------------------------------------------------------+
|  🏛️ SẮC THÁI CÔNG QUYỀN       |  📊 TRỰC QUAN HÓA CAO CẤP        |  📄 CHUẨN HÓA IN ẤN HÀNH CHÍNH    |
|  - Sovereign Red (#dd4b39)    |  - Recharts Radar CSAT (SIPAS)   |  - Giấy hẹn Mẫu 01 (NĐ 61 QR)     |
|  - Heritage Navy (#1a202c)    |  - Heatmap 14 Phường 3 dải màu   |  - Phiếu chi C70a-HD có Barcode   |
|  - Golden Emblem Accents      |  - Bản đồ số GIS Mộ Liệt sĩ      |  - Giấy chứng nhận Mẫu 03 (TT 01) |
|  - Chuẩn WCAG 2.1 AA sắc nét  |  - Dashboard DTI & KPI Realtime  |  - In ấn A4 Pixel-Perfect CSS     |
|-------------------------------+----------------------------------+-----------------------------------|
|  📱 TRẢI NGHIỆM ĐA NỀN TẢNG   |  ⚡ TƯƠNG TÁC VI MÔ THÔNG MINH   |  🔐 PHÂN QUYỀN TRẢI NGHIỆM RBAC   |
|  - Desktop Cán bộ (1080p+)    |  - Toasts Sonner thông minh      |  - Multi-Domain Navigation Menu   |
|  - Kiosk Cảm ứng Một cửa      |  - Optimistic State Updates      |  - Breadcrumbs quy trình 6 bước   |
|  - Mobile Web Công dân QR     |  - Dialogs xác thực ký số        |  - Giới hạn quyền hiển thị data   |
+-------------------------------------------------------------------------------------------------------+
```

### 1. Hệ Màu Nhận Diện & Phân Tầng Chuyên Môn
- **Màu Đỏ Công Quyền (`#dd4b39` / `#c23321`):** Tượng trưng cho màu cờ sắc áo Tổ quốc, Quốc huy và dấu mộc đỏ công quyền.
- **Màu Xanh Cổ Điển (`#1a202c`):** Tạo nền tảng uy nghiêm, tinh tế, độ tương phản cao với chữ trắng ngọc trai.
- **Hệ Thống Màu Sắc 4 Khối Nghiệp Vụ:**
  * 🔴 **Khối Người có công (`rose-600`):** Biểu tượng hoa sen và ngọn lửa tri ân liệt sĩ.
  * 🟡 **Khối An sinh xã hội (`amber-600`):** Biểu tượng bàn tay nhân ái nâng đỡ hộ nghèo, người yếu thế.
  * 🟢 **Khối Giáo dục đào tạo (`emerald-600`):** Biểu tượng mầm non tri thức và học tập suốt đời.
  * 🔵 **Khối Thông tin truyền thông (`sky-600`):** Biểu tượng sóng truyền thanh và chuyển đổi số địa phương.

### 2. Thiết Kế Trực Quan Hóa Số Liệu Đỉnh Cao (Data Visualization)
- **Biểu Đồ Radar 4 Trụ Cột SIPAS (`Recharts Radar`):** Giám sát 4 chỉ số cốt lõi: Tiếp cận dịch vụ, Thủ tục hành chính, Công chức phục vụ và Kết quả dịch vụ.
- **Bản Đồ Nhiệt Phân Bổ Ngân Sách 14 Phường:** Phân dải màu trực quan từ Xanh Emerald ($\ge 2.5$ tỷ/tháng), Xanh Ngọc Cyan ($1.5 - 2.5$ tỷ/tháng) đến Xanh Lam ($< 1.5$ tỷ/tháng).
- **Bản Đồ Không Gian Địa Lý Nghĩa Trang Liệt Sĩ (Interactive GIS):** Hiển thị sơ đồ phân lô Khu A, B, C, D, định vị từng phần mộ và tích hợp tính năng dâng hoa, thắp hương tưởng niệm trực tuyến.

### 3. Chuẩn Hóa In Ấn Hành Chính (Print-Ready CSS Engine)
- Thiết lập chuyên biệt `@media print` đạt chuẩn **Nghị định số 30/2020/NĐ-CP**:
  * Tự động ẩn thanh Header điều hướng, Sidebar, nút thao tác và viền thừa.
  * Căn lề khổ giấy A4 chuẩn xác: Lề trên 20mm, lề dưới 20mm, lề trái 30mm, lề phải 15mm.
  * Xuất bản sắc nét: Giấy tiếp nhận hồ sơ Mẫu 01 tích hợp mã QR Code lớn, Phiếu chi trợ cấp C70a-HD tích hợp Barcode Code 128 và Giấy chứng nhận khuyết tật Mẫu 03.

---

## 🏛️ DANH MỤC 15 PHÂN HỆ NGHIỆP VỤ CỐT LÕI

| STT | Phân Hệ Nghiệp Vụ | Đường Dẫn (Route) | Căn Cứ Pháp Lý & Chức Năng Cốt Lõi |
| :---: | :--- | :--- | :--- |
| **01** | **Điều Hành Lãnh Đạo & Check-in KPI** | [`/dieu-hanh`](file:///q:/CODE_visual/filebctt/src/routes/dieu-hanh.tsx) | Giám sát KPI các khối công chức, thẩm định phê chuẩn sản phẩm check-in, giao ban công vụ. |
| **02** | **Văn Phòng Điện Tử & e-Office** | [`/van-ban`](file:///q:/CODE_visual/filebctt/src/routes/van-ban.tsx) | Quản lý Văn bản Đến/Đi theo NĐ 30/2020/NĐ-CP, tích hợp Trục VDXP và ký số SmartCA. |
| **03** | **Cơ Chế Một Cửa Quốc Gia & DVC** | [`/mot-cua`](file:///q:/CODE_visual/filebctt/src/routes/mot-cua.tsx) | Giải quyết TTHC cấp xã theo NĐ 61/2018/NĐ-CP & NĐ 107/2021/NĐ-CP, cấp Giấy hẹn Mẫu 01 có QR. |
| **04** | **Lịch Tuần & Sổ Tiếp Công Dân** | [`/lich-tuan`](file:///q:/CODE_visual/filebctt/src/routes/lich-tuan.tsx) | Lịch công tác Thường trực Đảng ủy - HĐND - UBND, Sổ tiếp công dân định kỳ, xử lý khiếu nại tố cáo. |
| **05** | **Họp Trực Tuyến & Chat Nội Bộ** | [`/hop-truc-tuyen`](file:///q:/CODE_visual/filebctt/src/routes/hop-truc-tuyen.tsx) | Phòng họp số e-Cabinet cơ sở, chia sẻ tài liệu số, trao đổi công vụ tức thời mã hóa. |
| **06** | **Văn Hóa, Gia Đình & Thể Thao** | [`/van-hoa-xa-hoi`](file:///q:/CODE_visual/filebctt/src/routes/van-hoa-xa-hoi.tsx) | Bình xét Gia đình VH (NĐ 86/2023), Đô thị văn minh (QĐ 04/2022), Kiểm tra Đội 814, Di sản (NĐ 109), Thể thao (NĐ 36). |
| **07** | **Thông Tin, TT & Chuyển Đổi Số**| [`/thong-tin-truyen-thong`](file:///q:/CODE_visual/filebctt/src/routes/thong-tin-truyen-thong.tsx) | Phản ánh hiện trường 1022 (SLA 24h), Đánh giá chỉ số DTI cấp xã, Cổng TTĐT (NĐ 42/2022), An ninh mạng Lực lượng 35. |
| **08** | **Lao Động & An Sinh Xã Hội** | [`/an-sinh-xa-hoi`](file:///q:/CODE_visual/filebctt/src/routes/an-sinh-xa-hoi.tsx) | Trợ cấp BTXH (NĐ 20/2021), Hộ nghèo đa chiều (QĐ 24/2021), Lao động xuất ngũ (TT 01/2022), Quỹ Đền ơn đáp nghĩa, Nhà Tình nghĩa. |
| **09** | **Giáo Dục & Đào Tạo Cơ Sở** | [`/giao-duc-dao-tao`](file:///q:/CODE_visual/filebctt/src/routes/giao-duc-dao-tao.tsx) | Cấp phép Mầm non tư thục (TT 49/2021), Mạng lưới trường học, Phổ cập GD-XMC (NĐ 20/2014), Cộng đồng học tập (TT 44), ATTP bán trú (QĐ 1246). |
| **10** | **Quản Lý Hồ Sơ Người Có Công** | [`/ho-so`](file:///q:/CODE_visual/filebctt/src/routes/ho-so.tsx), [`/tham-dinh`](file:///q:/CODE_visual/filebctt/src/routes/tham-dinh.tsx) | Vòng đời thụ lý hồ sơ 6 bước, tính trợ cấp tự động theo NĐ 75/2021/NĐ-CP, thẩm định số hóa. |
| **11** | **Chi Trả Trợ Cấp & Khớp Lệnh** | [`/chi-tra`](file:///q:/CODE_visual/filebctt/src/routes/chi-tra.tsx) | Lập danh sách chi trả ATM & Bưu điện, xuất phiếu chi Mẫu C70a-HD có barcode, khớp lệnh sao kê ngân hàng. |
| **12** | **Điều Dưỡng & Chỉnh Hình** | [`/dieu-duong`](file:///q:/CODE_visual/filebctt/src/routes/dieu-duong.tsx), [`/dung-cu-chinh-hinh`](file:///q:/CODE_visual/filebctt/src/routes/dung-cu-chinh-hinh.tsx) | Quản lý điều dưỡng tập trung (1.8x) & tại nhà (0.9x), theo dõi niên hạn 3-5 năm phương tiện chỉnh hình xe lăn, chân tay giả. |
| **13** | **Bản Đồ Số Nghĩa Trang GIS** | [`/nghia-trang`](file:///q:/CODE_visual/filebctt/src/routes/nghia-trang.tsx) | Số hóa sơ đồ phân lô Khu A, B, C, D; định vị phần mộ liệt sĩ; dâng hoa và thắp hương trực tuyến. |
| **14** | **Khảo Sát CSAT & Đo Lường SIPAS** | [`/danh-gia`](file:///q:/CODE_visual/filebctt/src/routes/danh-gia.tsx), [`/khao-sat`](file:///q:/CODE_visual/filebctt/src/routes/khao-sat.tsx) | Kênh đánh giá độc lập cho người dân qua QR Code/Kiosk; Radar Chart SIPAS và bảng xếp hạng 14 phường cho cán bộ. |
| **15** | **Quản Trị Hệ Thống & SQL Studio**| [`/he-thong`](file:///q:/CODE_visual/filebctt/src/routes/he-thong.tsx) | Quản trị RBAC, cấu hình mức chuẩn, Kiểm thử Engine Studio và Duyệt Cơ sở Dữ liệu 42 bảng quan hệ. |

---

## 📸 BỘ SƯU TẬP HÌNH ẢNH GIAO DIỆN THỰC TẾ (VISUAL SHOWCASE - 31 MÀN HÌNH)

Toàn bộ 31 màn hình chức năng và modal nghiệp vụ của hệ thống được chụp thực tế với độ phân giải cao (Retina 2x):

### 1. Xác Thực Bảo Mật & Chuyển Đổi Vai Trò Cán Bộ (RBAC)
<p align="center">
  <img src="docs/screenshots/01_login_cap_so.png" alt="Đăng nhập Cấp Sở" width="49%" />
  <img src="docs/screenshots/02_login_cap_phong.png" alt="Đăng nhập Cấp Phòng" width="49%" />
</p>
<p align="center">
  <img src="docs/screenshots/05_chuyen_doi_vai_tro.png" alt="Bảng Chuyển đổi Vai trò Đa Mảng" width="98%" />
</p>

*Màn hình đăng nhập phân quyền đa cấp (Cấp Sở LĐTBXH, Cấp Phòng, Lãnh đạo Phường và Chuyên viên các khối) cùng cơ chế chuyển đổi vai trò kiểm thử tức thời.*

---

### 2. Trung Tâm Điều Hành Lãnh Đạo & Báo Cáo Phân Tích Số Liệu
<p align="center">
  <img src="docs/screenshots/22_dieu_hanh_lanh_dao.png" alt="Trung tâm Điều hành Lãnh đạo Phường" width="98%" />
</p>
<p align="center">
  <img src="docs/screenshots/03_dashboard_tong_quan.png" alt="Dashboard Tổng quan Quản lý" width="49%" />
  <img src="docs/screenshots/04_bieu_do_kinh_phi.png" alt="Biểu đồ Phân bổ Kinh phí" width="49%" />
</p>
<p align="center">
  <img src="docs/screenshots/12_ban_do_nhiet_phan_tich.png" alt="Bản đồ Nhiệt 14 Phường" width="98%" />
</p>

*Bảng điều khiển tối cao dành cho Thường trực Đảng ủy và Lãnh đạo UBND Phường: giám sát trực tiếp tiến độ hoàn thành chỉ tiêu của 4 khối chuyên môn, phê duyệt kết quả check-in và bản đồ nhiệt phân bổ ngân sách 14 phường.*

---

### 3. Văn Phòng Điện Tử e-Office, Lịch Tuần & Phòng Họp Trực Tuyến
<p align="center">
  <img src="docs/screenshots/23_van_ban_eoffice.png" alt="Văn phòng Điện tử e-Office" width="98%" />
</p>
<p align="center">
  <img src="docs/screenshots/25_lich_tuan_tiep_dan.png" alt="Lịch tuần Lãnh đạo & Sổ Tiếp công dân" width="49%" />
  <img src="docs/screenshots/26_hop_truc_tuyen_chat.png" alt="Phòng họp số e-Cabinet & Chat nội bộ" width="49%" />
</p>

*Quản lý Văn bản Đến/Đi theo chuẩn Nghị định 30/2020/NĐ-CP, Lịch công tác tuần của Thường trực Đảng ủy - HĐND - UBND, Sổ tiếp công dân định kỳ và Phòng họp số e-Cabinet chia sẻ tài liệu mật.*

---

### 4. Cơ Chế Một Cửa Quốc Gia, Tiếp Nhận Hồ Sơ & AI OCR
<p align="center">
  <img src="docs/screenshots/24_mot_cua_quoc_gia.png" alt="Bộ phận Một cửa Tiếp nhận DVC Quốc gia" width="98%" />
</p>
<p align="center">
  <img src="docs/screenshots/20_tiep_nhan_ho_so_moi_modal.png" alt="Modal Tiếp nhận Hồ sơ Mới" width="49%" />
  <img src="docs/screenshots/21_ai_ocr_so_hoa_modal.png" alt="Modal AI OCR Bóc tách Giấy tờ" width="49%" />
</p>
<p align="center">
  <img src="docs/screenshots/06_giay_hen_mot_cua_qr.png" alt="Giấy Tiếp nhận & Hẹn trả kết quả Mẫu 01" width="98%" />
</p>

*Quy trình thụ lý Một cửa chuẩn Nghị định 61/2018 & 107/2021: Tiếp nhận hồ sơ, bóc tách dữ liệu thông minh bằng AI OCR, và tự động xuất Giấy hẹn Mẫu 01 tích hợp mã QR Code tra cứu.*

---

### 5. Quản Lý Hồ Sơ Người Có Công, Thẩm Định Số Hóa & Chi Trả C70a-HD
<p align="center">
  <img src="docs/screenshots/10_chi_tiet_ho_so_liet_si.png" alt="Chi tiết Hồ sơ Liệt sĩ" width="49%" />
  <img src="docs/screenshots/18_quy_trinh_tham_dinh_so_hoa.png" alt="Quy trình Thẩm định Số hóa" width="49%" />
</p>
<p align="center">
  <img src="docs/screenshots/09_phieu_chi_c70a_hd.png" alt="Phiếu chi trả Trợ cấp C70a-HD có Barcode" width="49%" />
  <img src="docs/screenshots/17_chi_tra_doi_soat_ngan_hang.png" alt="Chi trả & Khớp lệnh Ngân hàng" width="49%" />
</p>
<p align="center">
  <img src="docs/screenshots/16_danh_sach_ho_so_bao_giam.png" alt="Danh sách Báo giảm Từ trần & Mai táng phí" width="98%" />
</p>

*Vòng đời quản lý Người có công toàn diện: Thẩm định hồ sơ số hóa, tính trợ cấp chuẩn Nghị định 75/2021, xuất Phiếu chi C70a-HD có Barcode Code 128, đối soát ngân hàng theo Đề án 06 và thủ tục mai táng phí Mẫu 02.*

---

### 6. Quản Lý Điều Dưỡng, Dụng Cụ Chỉnh Hình & Bản Đồ Số Nghĩa Trang GIS
<p align="center">
  <img src="docs/screenshots/11_quan_ly_dieu_duong.png" alt="Quản lý Chế độ Điều dưỡng NCC" width="49%" />
  <img src="docs/screenshots/13_dung_cu_chinh_hinh.png" alt="Cấp phát Phương tiện Chỉnh hình" width="49%" />
</p>
<p align="center">
  <img src="docs/screenshots/14_ban_do_nghia_trang_gis.png" alt="Bản đồ số Nghĩa trang Liệt sĩ GIS & Dâng hương" width="98%" />
</p>

*Theo dõi chu kỳ điều dưỡng 2 năm/lần (Tập trung 1.8x, Tại nhà 0.9x), niên hạn cấp phát xe lăn 3-5 năm và Bản đồ số phân lô Khu A, B, C, D Nghĩa trang Liệt sĩ kết hợp Dâng hoa - Thắp hương tri ân trực tuyến.*

---

### 7. Các Khối Nghiệp Vụ Chuyên Môn Cấp Phường Mở Rộng
<p align="center">
  <img src="docs/screenshots/29_an_sinh_xa_hoi.png" alt="Lao động, An sinh Xã hội & Giảm nghèo" width="49%" />
  <img src="docs/screenshots/30_giao_duc_dao_tao.png" alt="Giáo dục & Đào tạo Cơ sở" width="49%" />
</p>
<p align="center">
  <img src="docs/screenshots/27_van_hoa_the_thao.png" alt="Văn hóa, Thể thao & Đội 814" width="49%" />
  <img src="docs/screenshots/28_thong_tin_chuyen_doi_so.png" alt="Thông tin, Truyền thông & Phản ánh 1022" width="49%" />
</p>

*Bốn khối nghiệp vụ chuyên môn sâu sắc: An sinh xã hội & Giảm nghèo đa chiều (QĐ 24); Mầm non tư thục & Phổ cập giáo dục (TT 49); Gia đình văn hóa & Đội kiểm tra 814 (NĐ 86); Phản ánh hiện trường 1022 (SLA 24h) & Giám sát an ninh mạng Lực lượng 35.*

---

### 8. Đo Lường CSAT SIPAS, Cổng Tra Cứu & Cơ Sở Dữ Liệu 3NF SQL Studio
<p align="center">
  <img src="docs/screenshots/07_cong_dan_danh_gia_csat.png" alt="Kiosk Cảm ứng Đánh giá CSAT Công dân" width="49%" />
  <img src="docs/screenshots/08_giam_sat_csat_can_bo.png" alt="Màn hình Radar Giám sát CSAT SIPAS Cán bộ" width="49%" />
</p>
<p align="center">
  <img src="docs/screenshots/15_cong_tra_cuu_cong_dan.png" alt="Cổng Tra cứu Thông tin Công dân" width="49%" />
  <img src="docs/screenshots/19_cau_hinh_he_thong.png" alt="Quản trị Tham số & Phân quyền Hệ thống" width="49%" />
</p>
<p align="center">
  <img src="docs/screenshots/31_csdl_3nf_sql_studio.png" alt="Cơ sở Dữ liệu 3NF & SQL Studio Console" width="98%" />
</p>

*Trải nghiệm Kiosk cảm ứng độc lập cho người dân đánh giá 5 sao tích hợp AI Sentiment Analysis; Radar SIPAS 4 trục; Cổng tra cứu tiến độ hồ sơ; và Bàn điều khiển CSDL 42 bảng quan hệ 3NF trực tiếp.*

---

## 🗄️ KIẾN TRÚC CƠ SỞ DỮ LIỆU QUAN HỆ 3NF (42 BẢNG)

Hệ thống được thiết kế theo chuẩn hóa dữ liệu dạng chuẩn 3 (3NF), engine InnoDB, hỗ trợ đầy đủ giao dịch ACID (`beginTransaction`, `commit`, `rollback`) và lưu trữ bền vững tại `database/database_persistence.json`:

```
+---------------------------------------------------------------------------------------------------------+
|                                42 BẢNG QUAN HỆ 3NF & CÁC PHÂN HỆ NGHIỆP VỤ                              |
+---------------------------------------------------------------------------------------------------------+
| 1. HỆ THỐNG & DANH MỤC DÙNG CHUNG                                                                      |
|    - dm_phuong (14 Phường TDM)           - dm_loai_doi_tuong (Danh mục NCC)                            |
|    - sys_roles (RBAC phân quyền)         - sys_users (Tài khoản & phân quyền mảng)                     |
|                                                                                                         |
| 2. CHÍNH SÁCH NGƯỜI CÓ CÔNG, ĐIỀU DƯỠNG & NGHĨA TRANG LIỆT SĨ (NĐ 131/2021 & NĐ 75/2021)                |
|    - ho_so_ncc (Bảng trung tâm)          - ho_so_liet_sy (Trích lục hy sinh)                           |
|    - than_nhan_liet_si (Thờ cúng)        - ke_hoach_dieu_duong (Định mức 1.8 & 0.9)                    |
|    - lich_su_chi_tra (C70a-HD)           - ho_so_bao_giam_mai_tang (Mẫu 02)                            |
|    - danh_sach_phuong_tien_chinh_hinh    - nghia_trang_mo_liet_si (Số hóa GIS)                         |
|    - khao_sat_danh_gia (CSAT & Sentiment)- doi_soat_chi_tra_ngan_hang (Đề án 06)                      |
|                                                                                                         |
| 3. GIÁO DỤC VÀ ĐÀO TẠO CƠ SỞ (TT 49/2021, NĐ 20/2014 & TT 44/2014)                                      |
|    - ho_so_tthc_giao_duc (DVC Một cửa)   - co_so_mam_non_tu_thuc (Nhóm trẻ ngoài CL)                   |
|    - truong_hoc_cong_lap                 - dieu_tra_pho_cap_gd (PCGD mức 3 & XMC)                      |
|    - danh_gia_cong_dong_hoc_tap          - tieu_chi_cong_dong_hoc_tap (100 điểm)                       |
|    - nhat_ky_kiem_thuc_attp (Kiểm thực 3 bước bán trú QĐ 1246/QĐ-BYT)                                  |
|                                                                                                         |
| 4. LAO ĐỘNG, VIỆC LÀM, BẢO TRỢ XÃ HỘI & QUỸ ĐỀN ƠN ĐÁP NGHĨA                                           |
|    - ho_so_bao_tro_xa_hoi (NĐ 20/2021)   - ho_ngheo_can_ngheo (Phiếu B1/B2 QĐ 24)                      |
|    - cung_cau_lao_dong (TT 01/2022)      - tre_em_hoan_canh_dac_biet (Luật Trẻ em)                     |
|    - ho_so_tho_cung_liet_si (Mẫu 04)     - hoi_dong_xac_dinh_khuyet_tat (TT 01/2019)                   |
|    - so_quy_den_on_dap_nghia (NĐ 45)     - nha_tinh_nghia_nguoi_co_cong (80tr / 40tr)                  |
|                                                                                                         |
| 5. VĂN HÓA, GIA ĐÌNH, DI SẢN & THỂ THAO                                                                |
|    - ho_so_gia_dinh_van_hoa (NĐ 86/2023) - khu_pho_van_hoa                                            |
|    - nghe_nhan_di_san_van_hoa (NĐ 109)   - co_so_the_thao_ho_boi (Cứu hộ phòng đuối nước)              |
|                                                                                                         |
| 6. THÔNG TIN, TRUYỀN THÔNG, CHUYỂN ĐỔI SỐ & ĐÁNH GIÁ CÁN BỘ                                            |
|    - phan_anh_hien_truong_1022 (SLA 24h) - bo_chi_so_dti_cap_xa (DTI cấp Phường)                       |
|    - tin_bai_cong_thong_tin (NĐ 42)      - giam_sat_khong_gian_mang (Lực lượng 35)                     |
|    - bang_danh_gia_kpi_can_bo (NĐ 90/48) - nhat_ky_thuong_phat_cong_vu                                |
|    - sys_audit_logs (Lịch sử truy vết)   - Các Views: v_tong_hop_an_sinh, v_can_doi_quy                 |
+---------------------------------------------------------------------------------------------------------+
```

### Các Tính Năng Độc Đáo Của Động Cơ Database:
- **ACID Transaction API:** `database.beginTransaction()`, `database.commit()`, `database.rollback()`.
- **SQL Console Trực Quan:** Chạy câu lệnh SQL `SELECT`, `UPDATE`, `INSERT` trực tiếp tại tab **Hệ Thống -> Cơ sở Dữ liệu Quan hệ 3NF**.
- **Snapshot Backup & Restore:** Tạo bản sao lưu toàn bộ dữ liệu 1-click và khôi phục ngay khi cần.
- **Export SQL Dump:** Xuất trọn gói cấu trúc DDL và dữ liệu DML thành tệp `.sql` tương thích MySQL / MariaDB.

---

## 🧪 KIỂM THỬ TỰ ĐỘNG BACKEND (222 TEST CASES)

Hệ thống được bảo đảm chất lượng với bộ kiểm thử tự động toàn diện [scripts/test_backend.mjs](file:///q:/CODE_visual/filebctt/scripts/test_backend.mjs) trải qua 18 nhóm kiểm thử:

```bash
$ npm run test:backend

================================================================================
🚀 BẮT ĐẦU KIỂM THỬ TOÀN DIỆN HỆ THỐNG BACKEND (TEST SUITES COMPREHENSIVE)
================================================================================
  📦 1. Health check & 16 Bảng dữ liệu cốt lõi
  🔐 2. Xác thực JWT & Phân quyền RBAC (Cấp Sở / Cấp Phòng)
  📑 3. CRUD Hồ sơ Người có công & Chống trùng CCCD
  🧮 4. Financial Engine tính trợ cấp chuẩn (NĐ 75/2021)
  💬 5. Khảo sát CSAT, NLP Sentiment Analysis & Radar SIPAS
  📈 6. Thống kê Dashboard & Phân bổ kinh phí 14 Phường
  🏦 7. Chi trả trợ cấp & Xuất phiếu chi C70a-HD
  ⚰️ 8. Báo giảm từ trần & Quyết định Mai táng phí (Mẫu 02)
  🦿 9. Cấp phát dụng cụ chỉnh hình & Niên hạn 3-5 năm
  🗺️ 10. Bản đồ số Nghĩa trang Liệt sĩ GIS & Dâng hương
  🚨 11. Cảnh báo sớm rủi ro (Hết tuổi 18, quá hạn SLA)
  🎓 12. TTHC Giáo dục, Cấp phép Mầm non tư thục (TT 49)
  🎭 13. Văn hóa, Thể thao, Đội 814 & Đô thị văn minh
  🛡️ 14. An sinh xã hội, Hộ nghèo đa chiều & Trẻ em
  🏆 15. Chấm điểm KPI công vụ & Thưởng phạt tự động (NĐ 90/48)
  📚 16. Nghiệp vụ chuyên môn đợt 1 (ATTP bán trú, Điều dưỡng NCC, 1022, DTI)
  🏛️ 17. Nghiệp vụ chuyên môn đợt 2 (Phổ cập GD, Liệt sĩ Mẫu 04, HĐ Khuyết tật, Quỹ Đền ơn)
  🗄️ 18. Động cơ CSDL Quan hệ 3NF, SQL Console, Snapshot Backup & Export SQL Dump

================================================================================
🏁 KẾT QUẢ KIỂM THỬ: 222 PASSED, 0 FAILED (100% SUCCESS)
================================================================================
```

---

## 🚀 HƯỚNG DẪN CÀI ĐẶT & CHẠY LOCAL (LOCAL SETUP)

### Yêu Cầu Môi Trường
- **Node.js:** Phiên bản 20.x hoặc 22.x LTS trở lên.
- **Package Manager:** `npm` (khuyến nghị) hoặc `pnpm` / `bun`.

### Các Bước Thực Hiện
```bash
# 1. Clone mã nguồn từ GitHub
git clone https://github.com/Awac8989/BCTT.git
cd BCTT

# 2. Cài đặt các gói phụ thuộc
npm install

# 3. Chạy kiểm thử tự động toàn diện backend
npm run test:backend

# 4. Chụp tự động bộ 31 màn hình hệ thống (tùy chọn)
node scripts/capture_all_screens.mjs

# 5. Khởi chạy máy chủ phát triển (Development Server)
npm run dev

# 6. Truy cập hệ thống tại trình duyệt:
# http://localhost:8081
```

---

## ☁️ HƯỚNG DẪN TRIỂN KHAI LÊN VERCEL (DEPLOYMENT GUIDE)

Dự án đã được cấu hình sẵn sàng 100% cho nền tảng **Vercel** thông qua công nghệ Nitro Serverless Engine và TanStack Start.

### Cách 1: Triển Khai Qua Giao Diện Web Vercel (1-Click Deploy)
1. Đăng nhập vào [Vercel Dashboard](https://vercel.com).
2. Nhấn **"Add New..."** ➔ **"Project"**.
3. Chọn kho lưu trữ GitHub: `Awac8989/BCTT`.
4. Cấu hình dự án (Vercel tự động nhận diện từ `vercel.json`):
   - **Framework Preset:** `Vite` (hoặc `Other`).
   - **Build Command:** `npm run build`.
   - **Output Directory:** Tự động theo Nitro output.
5. Biến môi trường (Environment Variable):
   - `DANGEROUSLY_DEPLOY_VULNERABLE_TANSTACK_START_XSS=1` (đã khai báo trong `vercel.json`).
6. Nhấn **"Deploy"** và đợi khoảng 1 - 2 phút để nhận đường link Production hoạt động 24/7!

### Cách 2: Triển Khai Qua Vercel CLI (Dòng Lệnh)
```bash
# Cài đặt Vercel CLI
npm install -g vercel

# Đăng nhập vào tài khoản Vercel
vercel login

# Triển khai trực tiếp lên môi trường Production
vercel --prod
```

---

## 👨‍💻 TÁC GIẢ & THÔNG TIN DỰ ÁN

- **Tác giả:** Đoàn Minh Quân
- **Mã số sinh viên:** 2224801030137
- **Đơn vị công tác / thực tập:** Phòng Lao động - Thương binh và Xã hội TP. Thủ Dầu Một / UBND Phường Phú Cường, tỉnh Bình Dương.
- **Trường đào tạo:** Đại học Thủ Dầu Một (TDMU).
- **Kho lưu trữ chính thức:** [https://github.com/Awac8989/BCTT](https://github.com/Awac8989/BCTT)

---
*Bản quyền © 2026 Đoàn Minh Quân · Nghiên cứu và phát triển vì nền hành chính công hiện đại, minh bạch và nhân văn.*
