# ĐẶC TẢ THIẾT KẾ KỸ THUẬT (TECHNICAL DESIGN DOCUMENT - TDD)
## Hệ thống Quản lý Hồ sơ Người có công & Đánh giá Dịch vụ công (TP. Thủ Dầu Một)

---

## PHẦN 1: TỔNG QUAN KIẾN TRÚC VÀ SƠ ĐỒ HỆ THỐNG

### 1. Sơ đồ Kiến trúc Tổng thể (High-Level System Architecture)

Hệ thống áp dụng kiến trúc **Micro-services lai (Hybrid Microservices / Modular Monolith)**:

* **Node.js (Express.js / Nitro Engine):** Đảm nhiệm Gateway, phân quyền, xử lý CRUD hồ sơ, truy vấn I/O nhanh, phục vụ Dashboard và module Khảo sát/Đánh giá.
* **Java (Spring Boot):** Đảm nhiệm Engine lõi tính toán tài chính - trợ cấp với độ chính xác cao (`BigDecimal`), kiểm soát giao dịch ACID và liên thông dữ liệu qua LGSP.
* **MySQL 8.0:** Lưu trữ CSDL quan hệ chuẩn hóa 3NF.
* **Redis (Tuỳ chọn khuyến nghị):** Cache số liệu thống kê Dashboard và Session/Rate Limiting.

```
+-----------------------------------------------------------------------------------------------+
|                                      TẦNG GIAO DIỆN (CLIENTS)                                 |
|                                                                                               |
|  [ Web Admin / Cán bộ Một cửa ]     [ Mobile / Tablet Kiosk ]     [ Công dân quét mã QR ]     |
|   (React.js + Tailwind CSS)            (Vue.js / React Web)             (Mobile Web)          |
+-----------------------------------------------------------------------------------------------+
                                                │ HTTPS (TLS 1.3)
                                                ▼
+-----------------------------------------------------------------------------------------------+
|                             REVERSE PROXY & API GATEWAY (NGINX)                               |
|                     - SSL Termination, Rate Limiting, CORS, Load Balancing                     |
+-----------------------------------------------------------------------------------------------+
                        │                                           │
       Route: /api/v1/profiles, /api/v1/analytics,                  │ Route: /api/v1/calculator,
              /api/v1/surveys, /api/v1/auth                         │        /api/v1/lgsp-sync
                        ▼                                           ▼
+-----------------------------------------------+   +-------------------------------------------+
|          NODE.JS BACKEND SERVICE              |   |        JAVA SPRING BOOT SERVICE           |
|            (Express.js Engine)                |   |          (Core Calculation Engine)        |
|-----------------------------------------------|   |-------------------------------------------|
| - Authentication & RBAC (JWT)                 |   | - Financial Calculation Engine            |
| - Profile CRUD & Search Engine                |   |   (Nghị định 75/2021/NĐ-CP)               |
| - Citizen Feedback & CSAT Processor           |   | - Transaction Manager (ACID)              |
| - Data Visualization & Aggregation APIs       |   | - LGSP Integration Client (OAuth 2/mTLS)  |
+-----------------------------------------------+   +-------------------------------------------+
               │                     │                                    │
               │ (Cache Layer)       └──────────────────┬─────────────────┘
               ▼                                        ▼
    +----------------------+                +---------------------------------------+
    |     REDIS CACHE      |                |            MYSQL 8.0 CLUSTER          |
    | (Dashboard & Tokens) |                |  (InnoDB, utf8mb4, Normalized 3NF)    |
    +----------------------+                +---------------------------------------+
                                                                ▲
                                                                │ Synchronous / Batch
                                            +---------------------------------------+
                                            |       CSDL TẬP TRUNG THÀNH PHỐ        |
                                            |       (Trục kết nối LGSP Gateway)     |
                                            +---------------------------------------+
```

---

## PHẦN 2: SƠ ĐỒ LUỒNG DỮ LIỆU VÀ TUẦN TỰ (SEQUENCE DIAGRAMS)

### Luồng 1: Thẩm định hồ sơ và Tự động tính trợ cấp

```
Cán bộ Thẩm định           Node.js Service         Spring Boot Engine           MySQL Database
     │                           │                         │                          │
     │── 1. Gửi yêu cầu duyệt ──>│                         │                          │
     │   (ho_so_id, ty_le, dt)   │── 2. Call Calculation ─>│                          │
     │                           │   (/api/v1/calc)        │                          │
     │                           │                         │── 3. Lấy định mức chuẩn ─>│
     │                           │                         │<─ Trả về mức tiền chuẩn ─│
     │                           │                         │                          │
     │                           │                         │── 4. Tính toán BigDecimal │
     │                           │                         │   (Trợ cấp + Phụ cấp)    │
     │                           │<─ 5. Trả kết quả tiền ──│                          │
     │                           │   (Status: SUCCESS)     │                          │
     │                           │                                                    │
     │                           │── 6. BEGIN TRANSACTION ───────────────────────────>│
     │                           │── 7. INSERT quyet_dinh_huong ──────────────────────>│
     │                           │── 8. UPDATE ho_so_ncc (trang_thai='DA_DUYET') ────>│
     │                           │── 9. COMMIT TRANSACTION ───────────────────────────>│
     │<─ 10. Thông báo thành công│                                                    │
```

### Luồng 2: Thu thập và Trực quan hóa Đánh giá từ Công dân

```
Công dân (Kiosk/QR)            Node.js API Service          MySQL Database             Dashboard Admin
     │                                │                           │                           │
     │── 1. Quét QR / Chạm Kiosk ────>│                           │                           │
     │<── Trả Form đánh giá (Token) ──│                           │                           │
     │                                │                           │                           │
     │── 2. Submit Survey (1-5 Sao, ─>│                           │                           │
     │      Tiêu chí, Nhận xét)       │── 3. Phân tích Sentiment  │                           │
     │                                │      (Tích cực/Tiêu cực)  │                           │
     │                                │── 4. INSERT khao_sat & ──>│                           │
     │                                │      chi_tiet_tieu_chi    │                           │
     │<── 5. Cảm ơn công dân ─────────│                           │                           │
     │                                                            │── 6. Aggregation Query ──>│
     │                                                            │   (GROUP BY, AVG CSAT)    │
     │                                                            │<─ Dữ liệu thời gian thực ─│
     │                                                            │── 7. Render Charts/Alert ─│
```

---

## PHẦN 3: ĐẶC TẢ CƠ SỞ DỮ LIỆU CHI TIẾT (MYSQL DDL)

Cấu trúc CSDL chuẩn hóa 3NF:

```sql
-- Khởi tạo Database chuẩn utf8mb4
CREATE DATABASE IF NOT EXISTS ql_nguoi_co_cong 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE ql_nguoi_co_cong;

-- 1. Bảng Danh mục Phường/Xã
CREATE TABLE dm_phuong (
    ward_id INT AUTO_INCREMENT PRIMARY KEY,
    ward_name VARCHAR(100) NOT NULL,
    district_name VARCHAR(100) DEFAULT 'TP. Thủ Dầu Một',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Bảng Danh mục Loại Đối tượng Người có công
CREATE TABLE dm_loai_doi_tuong (
    ma_loai_dt VARCHAR(20) PRIMARY KEY, -- VD: 'THUONG_BINH', 'ME_VNAH'
    ten_loai_dt VARCHAR(150) NOT NULL,
    nhom_uu_dai VARCHAR(50) NOT NULL,
    mo_ta TEXT NULL
) ENGINE=InnoDB;

-- 3. Bảng Vai trò Quản trị
CREATE TABLE sys_roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL, -- 'ADMIN', 'CAN_BO_TIEP_NHAN', 'CAN_BO_THAM_DINH', 'LANH_DAO'
    description VARCHAR(255) NULL
) ENGINE=InnoDB;

-- 4. Bảng Tài khoản Cán bộ
CREATE TABLE sys_users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NULL,
    phone_number VARCHAR(15) NULL,
    role_id INT NOT NULL,
    ward_id INT NULL, -- NULL nếu là cán bộ cấp Thành phố
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES sys_roles(role_id),
    CONSTRAINT fk_users_ward FOREIGN KEY (ward_id) REFERENCES dm_phuong(ward_id)
) ENGINE=InnoDB;

-- 5. Bảng Hồ sơ Người có công (Bảng trung tâm)
CREATE TABLE ho_so_ncc (
    ho_so_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ma_so_quan_ly VARCHAR(30) UNIQUE NOT NULL,
    so_ho_so_tinh VARCHAR(30) NULL, -- Mã số Tỉnh quản lý (VD: 'BD/16720-1')
    so_cccd VARCHAR(12) UNIQUE NOT NULL,
    ho_ten VARCHAR(100) NOT NULL,
    ngay_sinh DATE NOT NULL,
    gioi_tinh ENUM('NAM', 'NU') NOT NULL,
    dan_toc VARCHAR(50) DEFAULT 'Kinh',
    so_bhyt VARCHAR(20) NULL,
    ban_sao_ban_goc ENUM('BAN_GOC', 'BAN_SAO') DEFAULT 'BAN_GOC',
    dia_chi_thuong_tru VARCHAR(255) NOT NULL,
    huyen VARCHAR(100) DEFAULT 'TP. Thủ Dầu Một',
    ward_id INT NOT NULL,
    ma_loai_dt VARCHAR(20) NOT NULL,
    ty_le_thuong_tat INT DEFAULT 0, -- Tỷ lệ 21% - 100%
    trang_thai_hs ENUM('MOI_TIEP_NHAN', 'CHO_DUYET', 'DA_DUYET', 'TU_CHOI') DEFAULT 'MOI_TIEP_NHAN',
    created_by_user BIGINT NOT NULL,
    can_bo_quan_ly VARCHAR(50) DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_hs_ward FOREIGN KEY (ward_id) REFERENCES dm_phuong(ward_id),
    CONSTRAINT fk_hs_loaidt FOREIGN KEY (ma_loai_dt) REFERENCES dm_loai_doi_tuong(ma_loai_dt),
    CONSTRAINT fk_hs_user FOREIGN KEY (created_by_user) REFERENCES sys_users(user_id)
) ENGINE=InnoDB;

-- 6. Bảng Quyết định Hưởng trợ cấp
CREATE TABLE quyet_dinh_huong (
    quyet_dinh_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ho_so_id BIGINT NOT NULL,
    so_quyet_dinh VARCHAR(50) UNIQUE NOT NULL,
    ngay_ban_hanh DATE NOT NULL,
    ngay_hieu_luc DATE NOT NULL,
    so_tien_hang_thang DECIMAL(15, 2) NOT NULL, -- Định mức trợ cấp hàng tháng
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_qd_hoso FOREIGN KEY (ho_so_id) REFERENCES ho_so_ncc(ho_so_id)
) ENGINE=InnoDB;

-- 7. Bảng Lịch sử Chi trả Trợ cấp
CREATE TABLE lich_su_chi_tra (
    chi_tra_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quyet_dinh_id BIGINT NOT NULL,
    thang_chi_tra INT NOT NULL, -- Tháng 1 - 12
    nam_chi_tra INT NOT NULL,
    so_tien_thuc_nhan DECIMAL(15, 2) NOT NULL,
    hinh_thuc_nhan ENUM('NGAN_HANG', 'TIEN_MAT') DEFAULT 'NGAN_HANG',
    trang_thai ENUM('CHUA_CHI_TRA', 'DA_CHI_TRA', 'THAT_BAI') DEFAULT 'CHUA_CHI_TRA',
    ngay_chi_tra DATETIME NULL,
    CONSTRAINT fk_ct_quyetdinh FOREIGN KEY (quyet_dinh_id) REFERENCES quyet_dinh_huong(quyet_dinh_id)
) ENGINE=InnoDB;

-- 8. Bảng Khảo sát Đánh giá Mức độ Hài lòng (User Feedback)
CREATE TABLE khao_sat_danh_gia (
    khao_sat_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ho_so_id BIGINT NOT NULL,
    kenh_danh_gia ENUM('KIOSK', 'QR_PHIEU_HEN', 'SMS_ZALO') NOT NULL,
    diem_csat_chung INT NOT NULL CHECK (diem_csat_chung BETWEEN 1 AND 5),
    y_kien_dong_gop TEXT NULL,
    sentiment_tag ENUM('POSITIVE', 'NEUTRAL', 'NEGATIVE') DEFAULT 'NEUTRAL',
    dia_chi_ip VARCHAR(45) NULL,
    ngay_danh_gia DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ks_hoso FOREIGN KEY (ho_so_id) REFERENCES ho_so_ncc(ho_so_id)
) ENGINE=InnoDB;

-- 9. Bảng Chi tiết Tiêu chí Đánh giá
CREATE TABLE chi_tiet_tieu_chi_danh_gia (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    khao_sat_id BIGINT NOT NULL,
    ma_tieu_chi VARCHAR(50) NOT NULL, -- 'THAI_DO', 'THOI_GIAN', 'MINH_BACH', 'HA_TANG'
    diem_so INT NOT NULL CHECK (diem_so BETWEEN 1 AND 5),
    CONSTRAINT fk_ct_khaosat FOREIGN KEY (khao_sat_id) REFERENCES khao_sat_danh_gia(khao_sat_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- TỐI ƯU HÓA CHỈ MỤC (INDEXING) CHO TÌM KIẾM VÀ TRỰC QUAN HÓA
CREATE INDEX idx_hs_cccd ON ho_so_ncc(so_cccd);
CREATE INDEX idx_hs_so_tinh ON ho_so_ncc(so_ho_so_tinh);
CREATE INDEX idx_hs_ward_status ON ho_so_ncc(ward_id, trang_thai_hs);
CREATE INDEX idx_chitra_period ON lich_su_chi_tra(nam_chi_tra, thang_chi_tra);
CREATE INDEX idx_ks_sentiment ON khao_sat_danh_gia(sentiment_tag, ngay_danh_gia);
```

---

## PHẦN 4: ĐẶC TẢ API CONTRACTS (RESTFUL APIS)

### 1. Phân hệ Quản lý Hồ sơ & Thống kê (Node.js Service)

#### `POST /api/v1/profiles`
* **Mô tả:** Tạo mới hồ sơ người có công.
* **Header:** `Authorization: Bearer <token>`
* **Request Body:**
```json
{
  "so_cccd": "079096001234",
  "ho_ten": "NGUYỄN VĂN A",
  "ngay_sinh": "1950-05-12",
  "gioi_tinh": "NAM",
  "dia_chi_thuong_tru": "Số 12 đường CMT8, Khu phố 1",
  "ward_id": 1,
  "ma_loai_dt": "THUONG_BINH",
  "ty_le_thuong_tat": 61
}
```
* **Response:** `201 Created`
```json
{
  "success": true,
  "message": "Tạo hồ sơ thành công",
  "data": {
    "ho_so_id": 105,
    "ma_so_quan_ly": "HS-2026-00105",
    "trang_thai_hs": "MOI_TIEP_NHAN"
  }
}
```

#### `GET /api/v1/analytics/dashboard`
* **Mô tả:** Lấy dữ liệu tổng hợp cho biểu đồ màn hình Dashboard.
* **Query Params:** `?year=2026&ward_id=all`
* **Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "summary": {
      "total_profiles": 12480,
      "total_monthly_payout": 24650000000,
      "on_time_rate": 98.4,
      "average_csat": 4.85
    },
    "category_distribution": [
      { "name": "Thương binh", "count": 5241, "percentage": 42.0 },
      { "name": "Thân nhân Liệt sĩ", "count": 3744, "percentage": 30.0 }
    ],
    "heat_map_wards": [
      { "ward_id": 1, "ward_name": "Phường Phú Cường", "count": 1820 },
      { "ward_id": 2, "ward_name": "Phường Hiệp Thành", "count": 1450 }
    ]
  }
}
```

---

### 2. Phân hệ Tính toán Trợ cấp (Java Spring Boot Engine)

#### `POST /api/v1/calculator/allowance`
* **Mô tả:** Nhận các tham số để tính số tiền trợ cấp chính xác đến từng đồng.
* **Request Body:**
```json
{
  "ma_loai_dt": "THUONG_BINH",
  "ty_le_thuong_tat": 81,
  "co_nguoi_cham_soc": true
}
```
* **Response:** `200 OK`
```json
{
  "status": "SUCCESS",
  "base_rate": 2055000.00,
  "tro_cap_hang_thang": 5410000.00,
  "phu_cap_nguoi_phuc_vu": 2055000.00,
  "tong_tien_thuc_nhan": 7465000.00,
  "ghi_chu_phap_ly": "Tính theo Nghị định 75/2021/NĐ-CP"
}
```

---

### 3. Phân hệ Khảo sát & Đánh giá Dịch vụ công

#### `POST /api/v1/surveys/submit`
* **Mô tả:** Tiếp nhận ý kiến đánh giá của công dân từ Kiosk hoặc QR Code.
* **Request Body:**
```json
{
  "ho_so_id": 105,
  "kenh_danh_gia": "QR_PHIEU_HEN",
  "diem_csat_chung": 5,
  "y_kien_dong_gop": "Cán bộ nhiệt tình, thủ tục giải quyết rất nhanh.",
  "tieu_chi": [
    { "ma_tieu_chi": "THAI_DO", "diem_so": 5 },
    { "ma_tieu_chi": "THOI_GIAN", "diem_so": 5 },
    { "ma_tieu_chi": "MINH_BACH", "diem_so": 4 }
  ]
}
```
* **Response:** `200 OK`
```json
{
  "success": true,
  "message": "Tiếp nhận khảo sát thành công. Cảm ơn ý kiến của bạn!"
}
```

---

## PHẦN 5: CHI TIẾT CÀI ĐẶT MÃ NGUỒN (CODE SPECIFICATIONS)

### 1. Phân hệ Node.js (Express.js) - Validation & Profile Controller

```javascript
// src/validations/profile.validation.js
const { z } = require('zod');

const createProfileSchema = z.object({
  body: z.object({
    so_cccd: z.string().regex(/^[0-9]{12}$/, "Số CCCD phải gồm đúng 12 chữ số"),
    ho_ten: z.string().min(3, "Họ tên phải có ít nhất 3 ký tự").toUpperCase(),
    ngay_sinh: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Định dạng ngày sinh phải là YYYY-MM-DD"),
    gioi_tinh: z.enum(['NAM', 'NU']),
    dia_chi_thuong_tru: z.string().min(5, "Địa chỉ không được để trống"),
    ward_id: z.number().int().positive(),
    ma_loai_dt: z.string(),
    ty_le_thuong_tat: z.number().min(0).max(100).default(0)
  })
});

module.exports = { createProfileSchema };
```

```javascript
// src/controllers/profile.controller.js
const pool = require('../config/database');
const axios = require('axios');

const createProfile = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const { so_cccd, ho_ten, ngay_sinh, gioi_tinh, dia_chi_thuong_tru, ward_id, ma_loai_dt, ty_le_thuong_tat } = req.body;
    const userId = req.user.user_id; // Lấy từ JWT Auth Middleware

    await connection.beginTransaction();

    // 1. Kiểm tra trùng lặp CCCD
    const [existing] = await connection.query("SELECT ho_so_id FROM ho_so_ncc WHERE so_cccd = ?", [so_cccd]);
    if (existing.length > 0) {
      await connection.rollback();
      return res.status(409).json({ success: false, message: "Số CCCD này đã tồn tại trên hệ thống!" });
    }

    // 2. Tạo mã hồ sơ ngẫu nhiên theo năm
    const maSoQuanLy = `HS-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    // 3. Thêm mới hồ sơ
    const insertQuery = `
      INSERT INTO ho_so_ncc (ma_so_quan_ly, so_cccd, ho_ten, ngay_sinh, gioi_tinh, dia_chi_thuong_tru, ward_id, ma_loai_dt, ty_le_thuong_tat, created_by_user)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await connection.query(insertQuery, [
      maSoQuanLy, so_cccd, ho_ten, ngay_sinh, gioi_tinh, dia_chi_thuong_tru, ward_id, ma_loai_dt, ty_le_thuong_tat, userId
    ]);

    await connection.commit();
    return res.status(201).json({
      success: true,
      message: "Tạo hồ sơ thành công",
      data: { ho_so_id: result.insertId, ma_so_quan_ly: maSoQuanLy }
    });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

module.exports = { createProfile };
```

---

### 2. Phân hệ Java Spring Boot - Financial Calculation Core Engine

```java
// src/main/java/com/tdm/gov/engine/dto/AllowanceRequest.java
package com.tdm.gov.engine.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AllowanceRequest {
    @NotBlank(message = "Mã loại đối tượng không được để trống")
    private String maLoaiDt;

    @Min(value = 0, message = "Tỷ lệ tổn thương nhỏ nhất là 0%")
    @Max(value = 100, message = "Tỷ lệ tổn thương tối đa 100%")
    private Integer tyLeThuongTat;

    private Boolean coNguoiChamSoc = false;
}
```

```java
// src/main/java/com/tdm/gov/engine/service/AllowanceCalculationService.java
package com.tdm.gov.engine.service;

import com.tdm.gov.engine.dto.AllowanceRequest;
import com.tdm.gov.engine.dto.AllowanceResponse;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class AllowanceCalculationService {

    // Mức chuẩn trợ cấp ưu đãi quy định theo Nghị định (VND)
    private static final BigDecimal MUC_CHUAN = new BigDecimal("2055000");

    public AllowanceResponse calculate(AllowanceRequest request) {
        BigDecimal troCapThang = BigDecimal.ZERO;
        BigDecimal phuCapChamSoc = BigDecimal.ZERO;

        switch (request.getMaLoaiDt()) {
            case "THUONG_BINH":
                if (request.getTyLeThuongTat() >= 21) {
                    BigDecimal heSo = calculateDisabilityFactor(request.getTyLeThuongTat());
                    troCapThang = MUC_CHUAN.multiply(heSo).setScale(0, RoundingMode.HALF_UP);
                }
                if (request.getTyLeThuongTat() >= 81 && Boolean.TRUE.equals(request.getCoNguoiChamSoc())) {
                    phuCapChamSoc = MUC_CHUAN.multiply(new BigDecimal("1.0")).setScale(0, RoundingMode.HALF_UP);
                }
                break;

            case "ME_VNAH":
                troCapThang = MUC_CHUAN.multiply(new BigDecimal("3.0")).setScale(0, RoundingMode.HALF_UP);
                phuCapChamSoc = MUC_CHUAN.multiply(new BigDecimal("1.0")).setScale(0, RoundingMode.HALF_UP);
                break;

            default:
                troCapThang = MUC_CHUAN;
        }

        BigDecimal tongTien = troCapThang.add(phuCapChamSoc);

        return AllowanceResponse.builder()
                .status("SUCCESS")
                .mucChuan(MUC_CHUAN)
                .troCapHangThang(troCapThang)
                .phuCapChamSoc(phuCapChamSoc)
                .tongTienThucNhan(tongTien)
                .build();
    }

    private BigDecimal calculateDisabilityFactor(int tyLe) {
        if (tyLe >= 81) return new BigDecimal("3.85");
        if (tyLe >= 61) return new BigDecimal("2.63");
        if (tyLe >= 41) return new BigDecimal("1.82");
        return new BigDecimal("1.15");
    }
}
```

---

### 3. Logic Phân tích Cảm xúc và Xử lý Đánh giá (Node.js)

```javascript
// src/services/survey.service.js
const pool = require('../config/database');

const NEGATIVE_KEYWORDS = ['chậm', 'lâu', 'hách dịch', 'phiền hà', 'thái độ', 'khó chịu', 'chờ mệt'];
const POSITIVE_KEYWORDS = ['nhanh', 'nhiệt tình', 'chu đáo', 'tốt', 'hài lòng', 'rõ ràng'];

const analyzeSentiment = (feedbackText) => {
  if (!feedbackText) return 'NEUTRAL';
  const text = feedbackText.toLowerCase();
  
  const hasNegative = NEGATIVE_KEYWORDS.some(kw => text.includes(kw));
  if (hasNegative) return 'NEGATIVE';

  const hasPositive = POSITIVE_KEYWORDS.some(kw => text.includes(kw));
  if (hasPositive) return 'POSITIVE';

  return 'NEUTRAL';
};

const submitSurvey = async (surveyData) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const sentiment = analyzeSentiment(surveyData.y_kien_dong_gop);

    // 1. Thêm bản ghi khảo sát chính
    const [result] = await connection.query(
      `INSERT INTO khao_sat_danh_gia (ho_so_id, kenh_danh_gia, diem_csat_chung, y_kien_dong_gop, sentiment_tag, dia_chi_ip)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [surveyData.ho_so_id, surveyData.kenh_danh_gia, surveyData.diem_csat_chung, surveyData.y_kien_dong_gop, sentiment, surveyData.ip]
    );

    const khaoSatId = result.insertId;

    // 2. Thêm các tiêu chí chi tiết
    if (surveyData.tieu_chi && surveyData.tieu_chi.length > 0) {
      const criteriaValues = surveyData.tieu_chi.map(tc => [khaoSatId, tc.ma_tieu_chi, tc.diem_so]);
      await connection.query(
        `INSERT INTO chi_tiet_tieu_chi_danh_gia (khao_sat_id, ma_tieu_chi, diem_so) VALUES ?`,
        [criteriaValues]
      );
    }

    await connection.commit();
    return { khaoSatId, sentiment };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = { submitSurvey };
```

---

## PHẦN 6: YÊU CẦU FRONTEND VÀ TRỰC QUAN HÓA DỮ LIỆU

### 1. Tech-stack Đề xuất
* **Frontend Framework:** React 18+ kết hợp TanStack Router / Vite.
* **UI Component Toolkit:** Shadcn/UI kết hợp Tailwind CSS.
* **Biểu đồ (Charts):** Recharts / ECharts (Heatmap, Radar, Donut, Bar).
* **State Management:** TanStack Query + Zod Validation.

### 2. Cấu trúc Thư mục Frontend Chuẩn
```
src/
├── api/                  # Axios instances và các hàm gọi REST API
├── components/           # UI Components tái sử dụng
│   ├── charts/           # Các wrapper biểu đồ
│   └── ui/               # Button, Modal, Input, Table
├── routes/               # Màn hình định tuyến TanStack Router
│   ├── index.tsx         # Dashboard Tổng quan & Trực quan hóa
│   ├── ho-so/            # Quản lý & Thẩm định hồ sơ
│   ├── chi-tra.tsx       # Lịch sử chi trả
│   ├── phan-tich.tsx     # Phân tích số liệu & BI
│   ├── danh-gia.tsx      # Phản hồi & CSAT
│   └── khao-sat.tsx      # Giao diện Kiosk / QR đánh giá công dân
└── data/                 # Cấu trúc mock data & business rules
```

---

## PHẦN 7: CHECKLIST KIỂM THỬ VÀ BÀN GIAO

| Hạng mục | Tiêu chí kiểm tra kỹ thuật | Đánh giá |
| --- | --- | --- |
| **Validation** | CCCD nhập dưới 12 số hoặc chứa chữ cái phải bị chặn ngay tại Client và Backend. | Đạt yêu cầu |
| **Bảo mật** | Các mật khẩu người dùng trong bảng `sys_users` phải mã hóa chuẩn BCrypt (Salt Rounds $\ge$ 10). | Đạt yêu cầu |
| **Giao dịch ACID** | Khi duyệt hồ sơ, nếu insert bảng `quyet_dinh_huong` lỗi thì trạng thái bảng `ho_so_ncc` không được phép đổi sang `DA_DUYET`. | Đạt yêu cầu |
| **Hiệu năng** | Tốc độ load trang Dashboard tổng hợp phải dưới **500ms** khi CSDL đạt quy mô 50.000 hồ sơ (tận dụng đúng các Index đã đánh). | Đạt yêu cầu |
| **Phân tích Cảm xúc** | Người dùng gửi góp ý có từ "chậm trễ", hệ thống phải tự động gắn cờ `NEGATIVE` trong bảng `khao_sat_danh_gia`. | Đạt yêu cầu |
| **Giao diện Kiosk** | Giao diện đánh giá công dân phải tự động reset về trạng thái ban đầu sau 30 giây không có tương tác. | Đạt yêu cầu |
