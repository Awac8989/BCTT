-- ==============================================================================
-- CƠ SỞ DỮ LIỆU: HỆ THỐNG QUẢN LÝ HỒ SƠ NGƯỜI CÓ CÔNG & ĐÁNH GIÁ DỊCH VỤ CÔNG
-- Đơn vị: Phòng Văn hóa - Xã hội / TP. Thủ Dầu Một
-- Chuẩn hóa: 3NF, utf8mb4, InnoDB
-- TDD Reference: Phần 3 - Đặc tả CSDL chi tiết
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS ql_nguoi_co_cong 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE ql_nguoi_co_cong;

-- 1. Bảng Danh mục Phường/Xã
DROP TABLE IF EXISTS chi_tiet_tieu_chi_danh_gia;
DROP TABLE IF EXISTS khao_sat_danh_gia;
DROP TABLE IF EXISTS lich_su_chi_tra;
DROP TABLE IF EXISTS quyet_dinh_huong;
DROP TABLE IF EXISTS ho_so_ncc;
DROP TABLE IF EXISTS sys_users;
DROP TABLE IF EXISTS sys_roles;
DROP TABLE IF EXISTS dm_loai_doi_tuong;
DROP TABLE IF EXISTS dm_phuong;

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

-- ==============================================================================
-- DỮ LIỆU KHỞI TẠO BAN ĐẦU (SEED DATA)
-- ==============================================================================

-- Danh mục Phường thuộc TP. Thủ Dầu Một
INSERT INTO dm_phuong (ward_id, ward_name) VALUES
(1, 'Phường Phú Cường'),
(2, 'Phường Phú Hòa'),
(3, 'Phường Hiệp Thành'),
(4, 'Phường Định Hòa'),
(5, 'Phường Phú Lợi'),
(6, 'Phường Chánh Nghĩa'),
(7, 'Phường Phú Thọ'),
(8, 'Phường Phú Mỹ'),
(9, 'Phường Hiệp An'),
(10, 'Phường Tương Bình Hiệp'),
(11, 'Phường Chánh Mỹ'),
(12, 'Phường Tân An'),
(13, 'Phường Thới Hòa'),
(14, 'Phường Hòa Phú');

-- Danh mục Loại đối tượng
INSERT INTO dm_loai_doi_tuong (ma_loai_dt, ten_loai_dt, nhom_uu_dai, mo_ta) VALUES
('THUONG_BINH', 'Thương binh', 'TRỢ CẤP HÀNG THÁNG', 'Người bị thương trong chiến đấu hoặc làm nhiệm vụ quốc phòng an ninh'),
('BENH_BINH', 'Bệnh binh', 'TRỢ CẤP HÀNG THÁNG', 'Quân nhân, CAND bị mắc bệnh khi làm nhiệm vụ'),
('ME_VNAH', 'Bà mẹ Việt Nam Anh hùng', 'TRỢ CẤP & PHỤ CẤP', 'Bà mẹ có nhiều con hoặc con duy nhất là liệt sĩ'),
('LIET_SI', 'Thân nhân Liệt sĩ', 'TRỢ CẤP HÀNG THÁNG', 'Cha mẹ, vợ/chồng, con liệt sĩ được hưởng định mức chuẩn'),
('CHAT_DOC_HOA_HOC', 'Nhiễm chất độc hóa học', 'TRỢ CẤP HÀNG THÁNG', 'Người hoạt động kháng chiến bị nhiễm dioxin'),
('TIEN_KHOI_NGHIA', 'Cán bộ tiền khởi nghĩa', 'TRỢ CẤP ƯU ĐÃI', 'Cán bộ tham gia cách mạng trước ngày 01/01/1945');

-- Danh mục Vai trò
INSERT INTO sys_roles (role_id, role_name, description) VALUES
(1, 'ADMIN', 'Quản trị viên toàn hệ thống'),
(2, 'CAN_BO_TIEP_NHAN', 'Cán bộ Bộ phận Một cửa cấp Phường'),
(3, 'CAN_BO_THAM_DINH', 'Chuyên viên thẩm định Phòng VH-XH'),
(4, 'LANH_DAO', 'Lãnh đạo phê duyệt quyết định hưởng trợ cấp');

-- Tài khoản cán bộ mẫu (Mật khẩu mặc định băm BCrypt của 'Admin@123')
INSERT INTO sys_users (user_id, username, password_hash, full_name, email, phone_number, role_id, ward_id, is_active) VALUES
(1, 'admin', '$2b$10$Ep99kFq7K32U8Dk75hV1..VlO6W7q2V4N8YtYx.7s/i58QpQ6X0/K', 'Hứa Trọng Duy', 'lanhdao@thudaumot.gov.vn', '0903123456', 4, NULL, TRUE),
(2, 'canbo.phucuong', '$2b$10$Ep99kFq7K32U8Dk75hV1..VlO6W7q2V4N8YtYx.7s/i58QpQ6X0/K', 'Nguyễn Văn An', 'canbo.pc@thudaumot.gov.vn', '0912345678', 2, 1, TRUE),
(3, 'thamdinh.vien', '$2b$10$Ep99kFq7K32U8Dk75hV1..VlO6W7q2V4N8YtYx.7s/i58QpQ6X0/K', 'Trần Quốc Bảo', 'thamdinh@thudaumot.gov.vn', '0987654321', 3, NULL, TRUE);

-- ==============================================================================
-- 10. BẢNG CHI TIẾT HỒ SƠ LIỆT SĨ (Theo Nghị định 131/2021/NĐ-CP)
-- ==============================================================================
CREATE TABLE ho_so_liet_sy (
    liet_sy_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ho_so_id BIGINT NOT NULL,
    so_ho_so_bo VARCHAR(50) NULL, -- VD: 'BD/LS-07956'
    bi_danh VARCHAR(100) NULL,
    que_quan VARCHAR(255) NOT NULL,
    tru_quan VARCHAR(255) NULL,
    ngay_nhap_ngu VARCHAR(50) NULL,
    cap_bac VARCHAR(50) NULL,
    chuc_vu VARCHAR(100) NULL,
    co_quan_khi_hy_sinh VARCHAR(255) NULL,
    ngay_hy_sinh VARCHAR(50) NOT NULL,
    thoi_ky VARCHAR(100) NOT NULL, -- 'Chống Pháp (từ 19/08/1945 - 20/07/1954)'
    truong_hop_hy_sinh TEXT NULL,
    noi_hy_sinh VARCHAR(255) NULL,
    noi_mai_tang VARCHAR(255) NULL,
    giay_bao_tu VARCHAR(50) NULL,
    ngay_bao_tu VARCHAR(50) NULL,
    don_vi_cap_giay_bao_tu VARCHAR(255) NULL,
    so_bang_to_quoc_ghi_cong VARCHAR(50) NULL, -- 'GC887K'
    qd_cap_bang_so VARCHAR(50) NULL, -- '1312TTga'
    ngay_cap_bang VARCHAR(50) NULL,
    thuoc_doi_tuong VARCHAR(50) DEFAULT 'Dân Chính',
    vi_tri_luu_ho_so VARCHAR(100) NULL,
    liet_sy_la_anh_hung BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_ls_hoso FOREIGN KEY (ho_so_id) REFERENCES ho_so_ncc(ho_so_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ==============================================================================
-- 11. BẢNG QUẢN LÝ THÂN NHÂN LIỆT SĨ & NGƯỜI THỜ CÚNG
-- ==============================================================================
CREATE TABLE than_nhan_liet_si (
    than_nhan_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    liet_sy_id BIGINT NOT NULL,
    ho_ten VARCHAR(100) NOT NULL,
    quan_he VARCHAR(50) NOT NULL, -- 'Cha', 'Mẹ', 'Vợ', 'Con', 'Cháu thờ cúng'
    nam_sinh INT NULL,
    so_cccd VARCHAR(12) NULL,
    dia_chi VARCHAR(255) NULL,
    is_nguoi_tho_cung BOOLEAN DEFAULT FALSE,
    che_do_huong VARCHAR(100) DEFAULT 'Trợ cấp thờ cúng 1.400.000đ/năm',
    CONSTRAINT fk_tn_lietsy FOREIGN KEY (liet_sy_id) REFERENCES ho_so_liet_sy(liet_sy_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ==============================================================================
-- 12. BẢNG KẾ HOẠCH & DANH SÁCH ĐIỀU DƯỠNG NGƯỜI CÓ CÔNG
-- (Nghị định 131/2021/NĐ-CP & Nghị định 75/2021/NĐ-CP)
-- ==============================================================================
CREATE TABLE ke_hoach_dieu_duong (
    ke_hoach_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nam_ke_hoach INT NOT NULL,
    ten_ke_hoach VARCHAR(255) NOT NULL,
    chi_tieu_tong INT NOT NULL,
    chi_tieu_1_nam INT NOT NULL,
    chi_tieu_2_nam INT NOT NULL,
    dinh_muc_tap_trung DECIMAL(15,2) DEFAULT 3699000, -- 1.8 x Mức chuẩn
    dinh_muc_tai_nha DECIMAL(15,2) DEFAULT 1849500,   -- 0.9 x Mức chuẩn
    trang_thai ENUM('DANG_THUC_HIEN', 'HOAN_THANH') DEFAULT 'DANG_THUC_HIEN',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE danh_sach_dieu_duong (
    dieu_duong_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ke_hoach_id BIGINT NOT NULL,
    ho_so_id BIGINT NOT NULL,
    chu_ky ENUM('1_NAM', '2_NAM') NOT NULL,
    hinh_thuc ENUM('TAP_TRUNG', 'TAI_NHA') NOT NULL,
    dia_diem_dieu_duong VARCHAR(255) NULL,
    chi_phi_dieu_duong DECIMAL(15,2) NOT NULL,
    dot_dieu_duong VARCHAR(50) NULL,
    ngay_bat_dau DATE NULL,
    ngay_ket_thuc DATE NULL,
    trang_thai ENUM('CHO_TIEP_NHAN', 'DA_LAP_DANH_SACH', 'DANG_DIEU_DUONG', 'HOAN_THANH') DEFAULT 'DA_LAP_DANH_SACH',
    CONSTRAINT fk_dd_kehoach FOREIGN KEY (ke_hoach_id) REFERENCES ke_hoach_dieu_duong(ke_hoach_id),
    CONSTRAINT fk_dd_hoso FOREIGN KEY (ho_so_id) REFERENCES ho_so_ncc(ho_so_id)
) ENGINE=InnoDB;

-- Dữ liệu mẫu khởi tạo cho Liệt sĩ Hồ Văn Lên & Điều dưỡng 2026
INSERT INTO ho_so_ncc (ho_so_id, ma_so_quan_ly, so_ho_so_tinh, so_cccd, ho_ten, ngay_sinh, gioi_tinh, dan_toc, so_bhyt, ban_sao_ban_goc, dia_chi_thuong_tru, huyen, ward_id, ma_loai_dt, ty_le_thuong_tat, trang_thai_hs, created_by_user, can_bo_quan_ly) VALUES
(12029, 'BD/NCC-12029', '04878', '074026000123', 'Hồ Văn Lên', '1926-01-01', 'NAM', 'Kinh', 'LS4740001234', 'BAN_GOC', 'Xã Chánh Hiệp, Châu Thành, Thị xã Thủ Dầu Một, tỉnh Sông Bé', 'Thủ Dầu Một', 6, 'LIET_SI', 100, 'DA_DUYET', 1, 'Phòng LĐTBXH Thủ Dầu Một');

INSERT INTO ho_so_liet_sy (liet_sy_id, ho_so_id, so_ho_so_bo, bi_danh, que_quan, tru_quan, ngay_nhap_ngu, cap_bac, chuc_vu, co_quan_khi_hy_sinh, ngay_hy_sinh, thoi_ky, truong_hop_hy_sinh, noi_hy_sinh, noi_mai_tang, giay_bao_tu, ngay_bao_tu, don_vi_cap_giay_bao_tu, so_bang_to_quoc_ghi_cong, qd_cap_bang_so, ngay_cap_bang, thuoc_doi_tuong, vi_tri_luu_ho_so, liet_sy_la_anh_hung) VALUES
(1, 12029, 'BD/LS-07956', '', 'Xã Chánh Hiệp, Châu Thành, Thị xã Thủ Dầu Một, tỉnh Sông Bé', '', 'Tháng 08 Năm 1945', '', 'Ủy viên ban tuyên huấn tỉnh', 'Ban Tuyên giáo tỉnh Sông Bé', 'Tháng 07 Năm 1949', 'Chống Pháp (từ 19/08/1945 - 20/07/1954)', 'Trên đường đi công tác về đơn vị bị địch càn quét bắn đồng chí hy sinh', 'An Mỹ, Châu Thành', 'An Mỹ, Châu Thành', '239/07', '13 Tháng 06 Năm 1977', 'Ban Tuyên giáo tỉnh Sông Bé', 'GC887K', '1312TTga', '26 Tháng 10 Năm 1977', 'Dân Chính', 'Kho lưu trữ Sở LĐTBXH - Kệ 04 Ngăn B', FALSE);

INSERT INTO than_nhan_liet_si (than_nhan_id, liet_sy_id, ho_ten, quan_he, nam_sinh, dia_chi, is_nguoi_tho_cung, che_do_huong) VALUES
(1, 1, 'Hồ Thị Mai', 'Con gái', 1948, 'Phường Chánh Nghĩa, TP. Thủ Dầu Một, Bình Dương', TRUE, 'Trợ cấp thờ cúng liệt sĩ 1.400.000đ/năm');

INSERT INTO ke_hoach_dieu_duong (ke_hoach_id, nam_ke_hoach, ten_ke_hoach, chi_tieu_tong, chi_tieu_1_nam, chi_tieu_2_nam, dinh_muc_tap_trung, dinh_muc_tai_nha, trang_thai) VALUES
(1, 2026, 'Kế hoạch điều dưỡng phục hồi sức khỏe Người có công tỉnh Bình Dương năm 2026', 1250, 420, 830, 3699000, 1849500, 'DANG_THUC_HIEN');

-- ==============================================================================
-- 13. BẢNG BÁO GIẢM TỪ TRẦN & QUYẾT ĐỊNH MAI TÁNG PHÍ (Mẫu 02 - NĐ 131/2021/NĐ-CP)
-- ==============================================================================
CREATE TABLE ho_so_bao_giam_mai_tang (
    bao_giam_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ho_so_id BIGINT NOT NULL,
    ngay_tu_tran DATE NOT NULL,
    noi_tu_tran VARCHAR(255) NOT NULL,
    so_trich_luc_khai_tu VARCHAR(100) NOT NULL,
    ngay_cap_khai_tu DATE NOT NULL,
    noi_cap_khai_tu VARCHAR(255) NOT NULL,
    nguoi_khai_bao VARCHAR(100) NOT NULL,
    quan_he_voi_nguoi_mat VARCHAR(50) NOT NULL,
    so_cccd_nguoi_khai VARCHAR(12) NOT NULL,
    so_dien_thoai_nguoi_khai VARCHAR(20) NULL,
    dia_chi_nguoi_khai VARCHAR(255) NULL,
    so_quyet_dinh_mai_tang VARCHAR(100) UNIQUE NOT NULL,
    ngay_quyet_dinh DATE NOT NULL,
    so_tien_mai_tang_phi DECIMAL(15,2) DEFAULT 20550000, -- 10 x Mức chuẩn 2.055.000
    tro_cap_mot_lan DECIMAL(15,2) DEFAULT 0,
    da_ngung_chi_tra_hang_thang BOOLEAN DEFAULT TRUE,
    created_by_user BIGINT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bg_hoso FOREIGN KEY (ho_so_id) REFERENCES ho_so_ncc(ho_so_id),
    CONSTRAINT fk_bg_user FOREIGN KEY (created_by_user) REFERENCES sys_users(user_id)
) ENGINE=InnoDB;

-- ==============================================================================
-- 14. BẢNG QUẢN LÝ CẤP PHƯƠNG TIỆN TRỢ GIÚP & DỤNG CỤ CHỈNH HÌNH
-- (Điều 90-93 Nghị định 131/2021/NĐ-CP)
-- ==============================================================================
CREATE TABLE danh_sach_phuong_tien_chinh_hinh (
    dung_cu_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ho_so_id BIGINT NOT NULL,
    ten_dung_cu VARCHAR(255) NOT NULL,
    loai_dung_cu ENUM('CHÂN_GIẢ', 'TAY_GIẢ', 'XE_LĂN', 'XE_LẮC', 'MÁY_TRỢ_THÍNH', 'KHÁC') NOT NULL,
    nien_han_nam INT NOT NULL, -- 3 năm hoặc 5 năm
    nam_cap_gan_nhat INT NOT NULL,
    nam_den_han_cap_moi INT NOT NULL,
    dinh_muc_tien DECIMAL(15,2) NOT NULL,
    tien_boi_duong_phuc_hoi DECIMAL(15,2) DEFAULT 0,
    trang_thai ENUM('ĐÃ_CẤP', 'ĐẾN_HẠN_CẤP_MỚI', 'CHỜ_DUYỆT_CẤP') DEFAULT 'ĐÃ_CẤP',
    ngay_cap_moi DATE NULL,
    so_quyet_dinh_cap VARCHAR(100) NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_dc_hoso FOREIGN KEY (ho_so_id) REFERENCES ho_so_ncc(ho_so_id)
) ENGINE=InnoDB;

-- ==============================================================================
-- 15. BẢNG SỐ HÓA NGHĨA TRANG & VỊ TRÍ MỘ LIỆT SĨ (GIS)
-- ==============================================================================
CREATE TABLE nghia_trang_mo_liet_si (
    mo_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    so_mo VARCHAR(50) UNIQUE NOT NULL, -- 'A1-01', 'B2-14'
    khu_mo VARCHAR(50) NOT NULL,       -- 'Khu A', 'Khu B', 'Khu C', 'Khu D'
    hang_mo INT NOT NULL,
    so_thu_tu INT NOT NULL,
    ho_ten_liet_si VARCHAR(100) NOT NULL,
    bi_danh VARCHAR(100) NULL,
    nam_sinh VARCHAR(50) NULL,
    ngay_hy_sinh VARCHAR(50) NOT NULL,
    que_quan VARCHAR(255) NOT NULL,
    tru_quan VARCHAR(255) NULL,
    chuc_vu VARCHAR(100) NULL,
    co_quan_khi_hy_sinh VARCHAR(255) NULL,
    tinh_trang_mo ENUM('ĐÃ_XÁC_ĐỊNH', 'CHƯA_XÁC_ĐỊNH_DANH_TÍNH', 'ĐÃ_CẤT_BỐC') DEFAULT 'ĐÃ_XÁC_ĐỊNH',
    tinh_trang_bia ENUM('TỐT', 'CẦN_TRÙNG_TU') DEFAULT 'TỐT',
    luot_thap_huong INT DEFAULT 0,
    toa_do_x INT NULL,
    toa_do_y INT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ==============================================================================
-- 16. BẢNG ĐỐI SOÁT CHI TRẢ NGÂN HÀNG & BƯU ĐIỆN (Đề án 06)
-- ==============================================================================
CREATE TABLE doi_soat_chi_tra_ngan_hang (
    doi_soat_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ma_giao_dich VARCHAR(100) UNIQUE NOT NULL,
    chi_tra_id BIGINT NULL,
    ten_ngan_hang VARCHAR(100) NOT NULL,
    ten_file_doi_soat VARCHAR(255) NOT NULL,
    so_cccd VARCHAR(12) NOT NULL,
    so_tien DECIMAL(15,2) NOT NULL,
    trang_thai_doi_soat ENUM('THÀNH_CÔNG', 'THẤT_BẠI') NOT NULL,
    ly_do_that_bai VARCHAR(255) NULL,
    ngay_doi_soat DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by_user BIGINT NOT NULL,
    CONSTRAINT fk_ds_user FOREIGN KEY (created_by_user) REFERENCES sys_users(user_id)
) ENGINE=InnoDB;

-- ==============================================================================
-- 17. PHÂN HỆ GIÁO DỤC: HỒ SƠ TTHC GIÁO DỤC MỘT CỬA (TT 49/2021/TT-BGDĐT)
-- ==============================================================================
CREATE TABLE ho_so_tthc_giao_duc (
    ho_so_id VARCHAR(50) PRIMARY KEY,
    ma_ho_so VARCHAR(50) UNIQUE NOT NULL,
    ten_thu_tuc VARCHAR(255) NOT NULL,
    nguoi_nop VARCHAR(100) NOT NULL,
    cccd_nguoi_nop VARCHAR(12) NOT NULL,
    so_dien_thoai VARCHAR(20) NOT NULL,
    dia_chi VARCHAR(255) NOT NULL,
    loai_hinh VARCHAR(100) NOT NULL,
    trang_thai ENUM('MOI_TIEP_NHAN', 'DANG_THAM_DINH', 'CHO_LANH_DAO_KY', 'HOAN_THANH', 'TU_CHOI') DEFAULT 'MOI_TIEP_NHAN',
    ngay_tiep_nhan DATETIME DEFAULT CURRENT_TIMESTAMP,
    ngay_hen_tra DATE NOT NULL,
    can_bo_thu_ly VARCHAR(100) NOT NULL,
    ket_qua_tham_dinh TEXT NULL,
    da_ky_so_smart_ca BOOLEAN DEFAULT FALSE
) ENGINE=InnoDB;

-- 18. Bảng Quản lý Cơ sở Mầm non & Nhóm trẻ Ngoài công lập
CREATE TABLE co_so_mam_non_tu_thuc (
    co_so_id VARCHAR(50) PRIMARY KEY,
    ten_co_so VARCHAR(255) NOT NULL,
    chu_co_so VARCHAR(100) NOT NULL,
    so_dien_thoai VARCHAR(20) NOT NULL,
    dia_chi VARCHAR(255) NOT NULL,
    khu_pho VARCHAR(50) NOT NULL,
    so_tre INT DEFAULT 0,
    so_giao_vien INT DEFAULT 0,
    tinh_trang_cap_phep ENUM('DA_CAP_PHEP', 'DANG_XIN_PHEP', 'CHO_GIA_HAN', 'CHUA_CAP_PHEP') DEFAULT 'DA_CAP_PHEP',
    so_quyet_dinh_thanh_lap VARCHAR(100) NULL,
    ngay_cap_phep DATE NULL,
    diem_kiem_tra_attp INT DEFAULT 100,
    lan_kiem_tra_gan_nhat DATE NULL
) ENGINE=InnoDB;

-- 19. Bảng Mạng lưới Trường học Công lập trên địa bàn Phường
CREATE TABLE truong_hoc_cong_lap (
    truong_id VARCHAR(50) PRIMARY KEY,
    ten_truong VARCHAR(255) NOT NULL,
    cap_hoc ENUM('MAM_NON', 'TIEU_HOC', 'THCS') NOT NULL,
    hieu_truong VARCHAR(100) NOT NULL,
    dia_chi VARCHAR(255) NOT NULL,
    tong_so_lop INT NOT NULL,
    tong_so_hoc_sinh INT NOT NULL,
    tong_so_can_bo_gv INT NOT NULL,
    chuan_quoc_gia ENUM('MUC_DO_1', 'MUC_DO_2', 'CHUA_DAT') DEFAULT 'MUC_DO_1'
) ENGINE=InnoDB;

-- 20. Bảng Điều tra Phổ cập Giáo dục & Xóa mù chữ (NĐ 20/2014 & TT 07/2016)
CREATE TABLE dieu_tra_pho_cap_gd (
    id VARCHAR(50) PRIMARY KEY,
    khu_pho VARCHAR(50) NOT NULL,
    nam_hoc VARCHAR(20) NOT NULL,
    tong_tre_5_tuoi INT NOT NULL,
    tre_5_tuoi_ra_lop INT NOT NULL,
    ty_le_mam_non_5t DECIMAL(5,2) NOT NULL,
    tong_tre_6_10_tuoi INT NOT NULL,
    ty_le_tieu_hoc DECIMAL(5,2) NOT NULL,
    tong_thanh_thieu_nien_11_18 INT NOT NULL,
    ty_le_thcs DECIMAL(5,2) NOT NULL,
    ty_le_xoa_mu_chu DECIMAL(5,2) NOT NULL,
    chuan_dat_duoc VARCHAR(100) NOT NULL,
    ngay_dieu_tra DATE NOT NULL
) ENGINE=InnoDB;

-- 21. Bảng Đánh giá "Cộng đồng học tập" cấp Xã (Thông tư 44/2014/TT-BGDĐT)
CREATE TABLE danh_gia_cong_dong_hoc_tap (
    id VARCHAR(50) PRIMARY KEY,
    nam_danh_gia INT NOT NULL,
    tong_diem INT NOT NULL,
    xep_loai ENUM('TOT', 'KHA', 'TRUNG_BINH', 'CHUA_DAT') NOT NULL,
    trang_thai ENUM('DU_THAO', 'HOI_DONG_THONG_QUA', 'UBND_PHE_DUYET') DEFAULT 'HOI_DONG_THONG_QUA',
    ngay_danh_gia DATE NOT NULL,
    chu_tich_hoi_dong VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

-- 22. Bảng Chi tiết 5 Nhóm Tiêu chí Cộng đồng học tập
CREATE TABLE tieu_chi_cong_dong_hoc_tap (
    tieu_chi_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    danh_gia_id VARCHAR(50) NOT NULL,
    ma_nhom_tieu_chi VARCHAR(50) NOT NULL,
    ten_nhom_tieu_chi VARCHAR(255) NOT NULL,
    diem_toi_da INT NOT NULL,
    diem_dat_duoc INT NOT NULL,
    CONSTRAINT fk_tc_cdht FOREIGN KEY (danh_gia_id) REFERENCES danh_gia_cong_dong_hoc_tap(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 23. Bảng Kiểm thực 3 bước ATTP Bán trú học đường (Quyết định 1246/QĐ-BYT)
CREATE TABLE nhat_ky_kiem_thuc_attp (
    kiem_thuc_id VARCHAR(50) PRIMARY KEY,
    truong_hoc_id VARCHAR(50) NOT NULL,
    ngay_kiem_thuc DATE NOT NULL,
    bua_an VARCHAR(50) DEFAULT 'Bữa trưa bán trú',
    buoc_1_nhap_nguyen_lieu ENUM('DAT', 'KHONG_DAT') DEFAULT 'DAT',
    buoc_2_che_bien ENUM('DAT', 'KHONG_DAT') DEFAULT 'DAT',
    buoc_3_luu_mau ENUM('DAT', 'KHONG_DAT') DEFAULT 'DAT',
    nhiet_do_tu_luu_mau DECIMAL(4,1) DEFAULT 4.0,
    thoi_gian_luu_mau VARCHAR(50) DEFAULT '24 giờ',
    can_bo_kiem_tra VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

-- ==============================================================================
-- 24. PHÂN HỆ LAO ĐỘNG, AN SINH XÃ HỘI, BẢO TRỢ & GIẢM NGHÈO (NĐ 20/2021)
-- ==============================================================================
CREATE TABLE ho_so_bao_tro_xa_hoi (
    id VARCHAR(50) PRIMARY KEY,
    ma_doi_tuong VARCHAR(50) UNIQUE NOT NULL,
    ho_ten VARCHAR(100) NOT NULL,
    cccd VARCHAR(12) NOT NULL,
    ngay_sinh DATE NOT NULL,
    gioi_tinh ENUM('NAM', 'NU') NOT NULL,
    dia_chi VARCHAR(255) NOT NULL,
    khu_pho VARCHAR(50) NOT NULL,
    loai_doi_tuong VARCHAR(150) NOT NULL,
    he_so_huong DECIMAL(4,2) NOT NULL,
    muc_tro_cap_thang DECIMAL(15,2) NOT NULL,
    trang_thai ENUM('DANG_HUONG', 'CHO_XET_DUYET', 'THOI_HUONG') DEFAULT 'DANG_HUONG',
    so_quyet_dinh VARCHAR(100) NOT NULL,
    ngay_huong DATE NOT NULL
) ENGINE=InnoDB;

-- 25. Bảng Rà soát Hộ nghèo, Cận nghèo Đa chiều (Quyết định 24/2021/QĐ-TTg)
CREATE TABLE ho_ngheo_can_ngheo (
    id VARCHAR(50) PRIMARY KEY,
    ma_ho VARCHAR(50) UNIQUE NOT NULL,
    chu_ho VARCHAR(100) NOT NULL,
    cccd_chu_ho VARCHAR(12) NOT NULL,
    dia_chi VARCHAR(255) NOT NULL,
    khu_pho VARCHAR(50) NOT NULL,
    so_nhan_khau INT NOT NULL,
    phan_loai ENUM('HO_NGHEO', 'HO_CAN_NGHEO', 'THOAT_NGHEO') NOT NULL,
    diem_b1_tai_san INT NOT NULL,
    diem_b2_thu_nhap INT NOT NULL,
    chieu_thieu_hut TEXT NULL,
    chinh_sach_ho_tro TEXT NULL,
    nam_ra_soat INT NOT NULL
) ENGINE=InnoDB;

-- 26. Bảng Điều tra Cung - Cầu Lao động (Thông tư 01/2022/TT-BLĐTBXH)
CREATE TABLE cung_cau_lao_dong (
    id VARCHAR(50) PRIMARY KEY,
    ho_ten VARCHAR(100) NOT NULL,
    cccd VARCHAR(12) NOT NULL,
    ngay_sinh DATE NOT NULL,
    khu_pho VARCHAR(50) NOT NULL,
    tinh_trang_viec_lam ENUM('CO_VIEC_LAM', 'THAT_NGHIEP', 'KHONG_CO_NHU_CAU') NOT NULL,
    trinh_do_cmkt VARCHAR(100) NOT NULL,
    nhu_cau_dao_tao VARCHAR(255) NULL,
    nhu_cau_tim_viec VARCHAR(255) NULL,
    trang_thai_ket_noi ENUM('CHUA_KET_NOI', 'DA_GIOI_THIEU', 'DA_CO_VIEC') DEFAULT 'CHUA_KET_NOI'
) ENGINE=InnoDB;

-- 27. Bảng Trẻ em Hoàn cảnh Đặc biệt (Luật Trẻ em 2016 & Nghị định 56/2017/NĐ-CP)
CREATE TABLE tre_em_hoan_canh_dac_biet (
    id VARCHAR(50) PRIMARY KEY,
    ho_ten VARCHAR(100) NOT NULL,
    ngay_sinh DATE NOT NULL,
    gioi_tinh ENUM('NAM', 'NU') NOT NULL,
    khu_pho VARCHAR(50) NOT NULL,
    nhom_hoan_canh VARCHAR(150) NOT NULL,
    nguoi_giam_ho VARCHAR(100) NOT NULL,
    ke_hoach_can_thiep VARCHAR(255) NOT NULL,
    trang_thai ENUM('DANG_CAN_THIEP', 'AN_TOAN', 'CAN_THEO_DOI_DAC_BIET') DEFAULT 'DANG_CAN_THIEP',
    ngay_lap_ho_so DATE NOT NULL
) ENGINE=InnoDB;

-- 28. Bảng Trợ cấp Thờ cúng Liệt sĩ (Mẫu số 04 Pháp lệnh 02/2020 & NĐ 131/2021)
CREATE TABLE ho_so_tho_cung_liet_si (
    id VARCHAR(50) PRIMARY KEY,
    ho_ten_nguoi_tho_cung VARCHAR(100) NOT NULL,
    cccd VARCHAR(12) NOT NULL,
    dia_chi VARCHAR(255) NOT NULL,
    ten_liet_si VARCHAR(100) NOT NULL,
    nam_hy_sinh VARCHAR(50) NOT NULL,
    quan_he_voi_liet_si VARCHAR(50) NOT NULL,
    dinh_muc_nam DECIMAL(15,2) DEFAULT 1400000,
    nam_chi_tra INT NOT NULL,
    trang_thai_chi_tra ENUM('DA_CHI_TRA', 'CHUA_CHI_TRA') DEFAULT 'DA_CHI_TRA',
    so_quyet_dinh VARCHAR(100) NOT NULL,
    ngay_quyet_dinh DATE NOT NULL
) ENGINE=InnoDB;

-- 29. Bảng Hội đồng Xác định Mức độ Khuyết tật (Thông tư 01/2019/TT-BLĐTBXH)
CREATE TABLE hoi_dong_xac_dinh_khuyet_tat (
    id VARCHAR(50) PRIMARY KEY,
    ho_ten VARCHAR(100) NOT NULL,
    cccd VARCHAR(12) NOT NULL,
    ngay_sinh DATE NOT NULL,
    dia_chi VARCHAR(255) NOT NULL,
    dang_tat VARCHAR(100) NOT NULL,
    muc_do_khuyet_tat ENUM('DAC_BIET_NANG', 'NANG', 'NHE') NOT NULL,
    so_giay_xac_nhan VARCHAR(100) NOT NULL,
    ngay_cap DATE NOT NULL,
    trang_thai ENUM('DA_CAP_GIAY', 'CHO_XET_DUYET', 'TU_CHOI') DEFAULT 'DA_CAP_GIAY'
) ENGINE=InnoDB;

-- 30. Bảng Sổ theo dõi Quỹ Đền ơn Đáp nghĩa (Nghị định 45/2017/NĐ-CP)
CREATE TABLE so_quy_den_on_dap_nghia (
    id VARCHAR(50) PRIMARY KEY,
    loai_giao_dich ENUM('THU', 'CHI') NOT NULL,
    nguon_dong_gop VARCHAR(255) NOT NULL,
    so_tien DECIMAL(15,2) NOT NULL,
    noi_dung TEXT NOT NULL,
    ngay_ghi_nhan DATE NOT NULL,
    nguoi_lap_phieu VARCHAR(100) NOT NULL,
    so_chung_tu VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

-- 31. Bảng Xây mới & Sửa chữa Nhà Tình nghĩa Người có công
CREATE TABLE nha_tinh_nghia_nguoi_co_cong (
    id VARCHAR(50) PRIMARY KEY,
    ho_ten_doi_tuong VARCHAR(100) NOT NULL,
    cccd VARCHAR(12) NOT NULL,
    dien_chinh_sach VARCHAR(150) NOT NULL,
    dia_chi VARCHAR(255) NOT NULL,
    loai_hinh ENUM('XAY_MOI', 'SUA_CHUA') NOT NULL,
    kinh_phi_ho_tro DECIMAL(15,2) NOT NULL, -- 80.000.000đ hoặc 40.000.000đ
    kinh_phi_doi_ung DECIMAL(15,2) DEFAULT 0,
    tien_do ENUM('KHAO_SAT', 'KHOI_CONG', 'DANG_THI_CONG', 'NGHIEM_THU_BAN_GIAO') NOT NULL,
    trang_thai ENUM('DA_PHE_DUYET', 'DANG_THUC_HIEN', 'HOAN_THANH') DEFAULT 'DANG_THUC_HIEN',
    ngay_khoi_cong DATE NULL,
    ngay_ban_giao DATE NULL
) ENGINE=InnoDB;

-- ==============================================================================
-- 32. PHÂN HỆ VĂN HÓA, GIA ĐÌNH, DI SẢN & THỂ THAO
-- ==============================================================================
CREATE TABLE ho_so_gia_dinh_van_hoa (
    id VARCHAR(50) PRIMARY KEY,
    chu_ho VARCHAR(100) NOT NULL,
    so_nhan_khau INT NOT NULL,
    dia_chi VARCHAR(255) NOT NULL,
    khu_pho VARCHAR(50) NOT NULL,
    diem_tu_cham INT NOT NULL,
    diem_tham_dinh INT NOT NULL,
    danh_hieu ENUM('DAT_CHUAN', 'GIA_DINH_VAN_HOA_TIEU_BIEU', 'CHUA_DAT') NOT NULL,
    nam_xet_duyet INT NOT NULL
) ENGINE=InnoDB;

-- 33. Bảng Tiêu chí Khu phố Văn hóa Tiêu biểu (NĐ 86/2023 & NĐ 122/2018)
CREATE TABLE khu_pho_van_hoa (
    id VARCHAR(50) PRIMARY KEY,
    ten_khu_pho VARCHAR(100) NOT NULL,
    truong_khu_pho VARCHAR(100) NOT NULL,
    tong_so_ho INT NOT NULL,
    so_ho_dat_chuan INT NOT NULL,
    ty_le_dat_chuan DECIMAL(5,2) NOT NULL,
    danh_hieu VARCHAR(100) NOT NULL,
    nam_cong_nhan INT NOT NULL
) ENGINE=InnoDB;

-- 34. Bảng Nghệ nhân Di sản Văn hóa Phi vật thể (Nghị định 109/2015/NĐ-CP)
CREATE TABLE nghe_nhan_di_san_van_hoa (
    id VARCHAR(50) PRIMARY KEY,
    ho_ten VARCHAR(100) NOT NULL,
    nam_sinh INT NOT NULL,
    danh_hieu ENUM('NGHE_NHAN_NHAN_DAN', 'NGHE_NHAN_UU_TU') NOT NULL,
    loai_hinh_di_san VARCHAR(150) NOT NULL, -- 'Đờn ca tài tử Nam Bộ', 'Nghề sơn mài Tương Bình Hiệp'
    tro_cap_hang_thang DECIMAL(15,2) NOT NULL,
    trang_thai ENUM('DANG_HUONG', 'TAM_DUNG', 'THOI_HUONG') DEFAULT 'DANG_HUONG',
    so_quyet_dinh_phong_tang VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

-- 35. Bảng Cơ sở Thể thao & Bể bơi Phòng chống Đuối nước (NĐ 36/2019 & TT 04/2018)
CREATE TABLE co_so_the_thao_ho_boi (
    id VARCHAR(50) PRIMARY KEY,
    ten_co_so VARCHAR(255) NOT NULL,
    chu_co_so VARCHAR(100) NOT NULL,
    dia_chi VARCHAR(255) NOT NULL,
    loai_hinh ENUM('BE_BOI', 'PHONG_GYM', 'SAN_BONG_DA', 'YOGA') NOT NULL,
    cuu_ho_vien_co_chung_chi BOOLEAN DEFAULT TRUE,
    phao_cuu_sinh_day_du BOOLEAN DEFAULT TRUE,
    dieu_kien_an_toan VARCHAR(255) NOT NULL,
    ket_luan_kiem_tra ENUM('DU_DIEU_KIEN', 'YEU_CAU_KHAC_PHUC', 'DINH_CHI') DEFAULT 'DU_DIEU_KIEN',
    ngay_kiem_tra DATE NOT NULL
) ENGINE=InnoDB;

-- ==============================================================================
-- 36. PHÂN HỆ THÔNG TIN, TRUYỀN THÔNG & CHUYỂN ĐỔI SỐ
-- ==============================================================================
CREATE TABLE phan_anh_hien_truong_1022 (
    id VARCHAR(50) PRIMARY KEY,
    tieu_de VARCHAR(255) NOT NULL,
    nguoi_gui VARCHAR(100) NOT NULL,
    so_dien_thoai VARCHAR(20) NOT NULL,
    dia_chi_su_viec VARCHAR(255) NOT NULL,
    linh_vuc VARCHAR(100) NOT NULL,
    noi_dung TEXT NOT NULL,
    trang_thai ENUM('TIEP_NHAN', 'DANG_XU_LY', 'HOAN_THANH', 'QUA_HAN') DEFAULT 'HOAN_THANH',
    ket_qua_xu_ly TEXT NULL,
    han_xu_ly_sla DATETIME NOT NULL,
    ngay_gui DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 37. Bảng Bộ Chỉ số Chuyển đổi số Cấp Xã (DTI - Quyết định 922/QĐ-BTTTT)
CREATE TABLE bo_chi_so_dti_cap_xa (
    id VARCHAR(50) PRIMARY KEY,
    tru_cot ENUM('CHINH_QUYEN_SO', 'KINH_TE_SO', 'XA_HOI_SO') NOT NULL,
    chi_tieu VARCHAR(255) NOT NULL,
    diem_toi_da INT NOT NULL,
    diem_dat_duoc INT NOT NULL,
    ti_le_hoan_thanh DECIMAL(5,2) NOT NULL,
    nam_danh_gia INT NOT NULL
) ENGINE=InnoDB;

-- 38. Bảng Quản trị Tin bài Cổng TTĐT & Zalo OA (Nghị định 42/2022/NĐ-CP)
CREATE TABLE tin_bai_cong_thong_tin (
    id VARCHAR(50) PRIMARY KEY,
    tieu_de VARCHAR(255) NOT NULL,
    chuyen_muc VARCHAR(100) NOT NULL,
    tac_gia VARCHAR(100) NOT NULL,
    noi_dung TEXT NOT NULL,
    trang_thai ENUM('DU_THAO', 'CHO_BIEN_TAP', 'DA_XUAT_BAN') DEFAULT 'DA_XUAT_BAN',
    luot_xem INT DEFAULT 0,
    da_phat_zalo_oa BOOLEAN DEFAULT FALSE,
    ngay_xuat_ban DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 39. Bảng Giám sát Không gian mạng Lực lượng 35 (CT 14/CT-TTg & QĐ 830/QĐ-TTg)
CREATE TABLE giam_sat_khong_gian_mang (
    id VARCHAR(50) PRIMARY KEY,
    nguon_tin VARCHAR(255) NOT NULL,
    link_bai_viet VARCHAR(500) NULL,
    noi_dung_nghi_van TEXT NOT NULL,
    muc_do_anh_huong ENUM('CAO', 'TRUNG_BINH', 'THAP') NOT NULL,
    trang_thai_xu_ly ENUM('DANG_THEO_DOI', 'DA_XAC_MINH', 'DA_DINH_HUONG_PHAN_BAC') DEFAULT 'DA_DINH_HUONG_PHAN_BAC',
    bien_phap_xu_ly TEXT NULL,
    thoi_gian_phat_hien DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ==============================================================================
-- 40. PHÂN HỆ ĐÁNH GIÁ KPI, CÔNG VỤ & KIỂM TOÁN HỆ THỐNG (NĐ 90 & NĐ 48)
-- ==============================================================================
CREATE TABLE bang_danh_gia_kpi_can_bo (
    id VARCHAR(50) PRIMARY KEY,
    can_bo_id VARCHAR(50) NOT NULL,
    ho_ten VARCHAR(100) NOT NULL,
    khoi_chuyen_mon VARCHAR(100) NOT NULL,
    ky_danh_gia VARCHAR(50) NOT NULL,
    tong_diem_tu_cham INT NOT NULL,
    tong_diem_cuoi_cung INT NOT NULL,
    xep_loai ENUM('HOAN_THANH_XUAT_SAC', 'HOAN_THANH_TOT', 'HOAN_THANH', 'KHONG_HOAN_THANH') NOT NULL,
    trang_thai ENUM('DU_THAO', 'CHO_LANH_DAO_DUYET', 'DA_PHE_DUYET') DEFAULT 'DA_PHE_DUYET',
    da_ky_so_smart_ca BOOLEAN DEFAULT TRUE,
    ngay_phe_duyet DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 41. Bảng Chi tiết Điểm Thưởng / Điểm Trừ Công vụ
CREATE TABLE nhat_ky_thuong_phat_cong_vu (
    id VARCHAR(50) PRIMARY KEY,
    kpi_id VARCHAR(50) NOT NULL,
    loai ENUM('THUONG', 'PHAT') NOT NULL,
    ly_do VARCHAR(255) NOT NULL,
    so_diem INT NOT NULL,
    ngay_ghi_nhan DATE NOT NULL,
    CONSTRAINT fk_tp_kpi FOREIGN KEY (kpi_id) REFERENCES bang_danh_gia_kpi_can_bo(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 42. Bảng Nhật ký Kiểm toán An toàn Hệ thống (Security Audit Trails)
CREATE TABLE sys_audit_logs (
    id VARCHAR(50) PRIMARY KEY,
    hanh_dong VARCHAR(150) NOT NULL,
    thoi_gian DATETIME DEFAULT CURRENT_TIMESTAMP,
    can_bo VARCHAR(100) NOT NULL,
    dia_chi_ip VARCHAR(45) DEFAULT '127.0.0.1',
    chi_tiet TEXT NOT NULL
) ENGINE=InnoDB;

-- ==============================================================================
-- VIEW TỔNG HỢP & PHÂN TÍCH (ANALYTICS VIEWS)
-- ==============================================================================
CREATE OR REPLACE VIEW v_tong_hop_an_sinh_xa_hoi AS
SELECT 
    p.ward_id,
    p.ward_name,
    COUNT(h.ho_so_id) AS tong_so_ncc,
    SUM(h.ty_le_thuong_tat) AS tong_ty_le_thuong_tat
FROM dm_phuong p
LEFT JOIN ho_so_ncc h ON p.ward_id = h.ward_id
GROUP BY p.ward_id, p.ward_name;

CREATE OR REPLACE VIEW v_can_doi_quy_den_on_dap_nghia AS
SELECT 
    loai_giao_dich,
    COUNT(id) AS tong_giao_dich,
    SUM(so_tien) AS tong_kinh_phi
FROM so_quy_den_on_dap_nghia
GROUP BY loai_giao_dich;

-- ==============================================================================
-- TRIGGER TOÀN VẸN DỮ LIỆU: TỰ ĐỘNG GHI NHẬT KÝ KIỂM TOÁN KHI DUYỆT HỒ SƠ NCC
-- ==============================================================================
DELIMITER //
CREATE TRIGGER trg_audit_ho_so_ncc_update
AFTER UPDATE ON ho_so_ncc
FOR EACH ROW
BEGIN
    IF OLD.trang_thai_hs <> NEW.trang_thai_hs THEN
        INSERT INTO sys_audit_logs (id, hanh_dong, can_bo, chi_tiet)
        VALUES (
            CONCAT('AUDIT-', UNIX_TIMESTAMP()),
            'DUYET_TRANG_THAI_HO_SO',
            NEW.can_bo_quan_ly,
            CONCAT('Hồ sơ CCCD ', NEW.so_cccd, ' chuyển trạng thái từ ', OLD.trang_thai_hs, ' sang ', NEW.trang_thai_hs)
        );
    END IF;
END //
DELIMITER ;

-- ==============================================================================
-- KẾT THÚC ĐẶC TẢ DDL TOÀN DIỆN CSDL QUAN HỆ 3NF CẤP XÃ/PHƯỜNG (42 BẢNG CHUẨN)
-- ==============================================================================



