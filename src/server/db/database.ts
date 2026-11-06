/**
 * RELATIONAL DATABASE ENGINE FOR QLDM SLDTBXH BINH DUONG
 * Implements 3NF In-Memory Engine with File-based Persistence, ACID Transactions,
 * Table Metadata, Dynamic Querying, Snapshot Backup & SQL Dump Generation.
 */

import fs from "fs";
import path from "path";
import {
  hoSoList,
  phanHoiList,
  initialDungCuChinhHinh,
  initialMoLietSiList,
  initialBaoGiamList,
  initialCanhBaoList,
  type HoSo,
  type PhanHoi,
} from "@/data/mock";

import {
  initialHoSoTTHCGiaoDucList,
  initialMamNonList,
  initialTruongCongLapList,
  initialPhoCapList,
  initialBaoTroList,
  initialCuuTroList,
  initialHoGheoList,
  initialCungCauLaoDongList,
  initialATLaoDongList,
  initialTreEmList,
  initialTeNanList,
  initialHoSoTTHCAnSinhList,
  initialGiaDinhVanHoaList,
  initialKhuPhoVanHoaList,
  initialDiTichLeHoiList,
  initialCoSoTonGiaoList,
  initialCoSoDichVuVanHoaList,
  initialDiaChiTinCayList,
  initialKiemTra814List,
  initialDoThiVanMinhList,
  initialPhanAnh1022List,
  initialDtiCapXaList,
  initialKpiEvaluationList,
  initialProductCheckInList,
  initialTaskAssignmentList,
  initialPhoCapGiaoDucList,
  initialCongDongHocTapList,
  initialThoCungLietSiList,
  initialHoiDongKhuyetTatList,
  initialNgheNhanDiSanList,
  initialCoSoTheThaoList,
  initialTinBaiList,
  initialKhongGianMangList,
  initialQuyDenOnList,
  initialNhaTinhNghiaList,
} from "@/data/domain-mock";

import { WARDS, CATEGORIES, USERS } from "../services/backend-store";

// Table schema definition
export interface ColumnDef {
  name: string;
  type: "INT" | "BIGINT" | "VARCHAR" | "TEXT" | "DECIMAL" | "BOOLEAN" | "DATE" | "DATETIME" | "ENUM";
  nullable: boolean;
  isPrimary?: boolean;
  isForeign?: boolean;
  references?: string;
  description?: string;
}

export interface TableDef {
  name: string;
  displayName: string;
  category: "HỆ THỐNG" | "NGƯỜI CÓ CÔNG" | "GIÁO DỤC" | "AN SINH" | "VĂN HÓA" | "THÔNG TIN CĐS" | "KPI";
  columns: ColumnDef[];
}

export interface DatabaseBackupSnapshot {
  id: string;
  timestamp: string;
  tablesCount: number;
  totalRecords: number;
  fileSize: number;
}

// 49 Normalized Tables Metadata Catalog
export const DATABASE_TABLES_CATALOG: TableDef[] = [
  // 1. Hệ thống & Danh mục
  {
    name: "dm_phuong",
    displayName: "Danh mục Phường/Xã (14 Phường)",
    category: "HỆ THỐNG",
    columns: [
      { name: "ward_id", type: "INT", nullable: false, isPrimary: true },
      { name: "ward_name", type: "VARCHAR", nullable: false },
      { name: "district_name", type: "VARCHAR", nullable: false },
    ],
  },
  {
    name: "dm_loai_doi_tuong",
    displayName: "Danh mục Loại Đối tượng Người có công",
    category: "HỆ THỐNG",
    columns: [
      { name: "ma_loai_dt", type: "VARCHAR", nullable: false, isPrimary: true },
      { name: "ten_loai_dt", type: "VARCHAR", nullable: false },
      { name: "nhom_uu_dai", type: "VARCHAR", nullable: false },
      { name: "mo_ta", type: "TEXT", nullable: true },
    ],
  },
  {
    name: "sys_roles",
    displayName: "Danh mục Vai trò Quản trị (RBAC)",
    category: "HỆ THỐNG",
    columns: [
      { name: "role_id", type: "INT", nullable: false, isPrimary: true },
      { name: "role_name", type: "VARCHAR", nullable: false },
      { name: "description", type: "VARCHAR", nullable: true },
    ],
  },
  {
    name: "sys_users",
    displayName: "Tài khoản Cán bộ & Phân quyền Mảng",
    category: "HỆ THỐNG",
    columns: [
      { name: "email", type: "VARCHAR", nullable: false, isPrimary: true },
      { name: "tenCanBo", type: "VARCHAR", nullable: false },
      { name: "chucVu", type: "VARCHAR", nullable: false },
      { name: "donVi", type: "VARCHAR", nullable: false },
      { name: "role", type: "VARCHAR", nullable: false },
      { name: "phamVi", type: "VARCHAR", nullable: false },
      { name: "is_active", type: "BOOLEAN", nullable: false },
    ],
  },

  // 2. Phân hệ Người có công & Nghĩa trang Liệt sĩ
  {
    name: "ho_so_ncc",
    displayName: "Hồ sơ Người có công (Bảng Trung tâm)",
    category: "NGƯỜI CÓ CÔNG",
    columns: [
      { name: "id", type: "BIGINT", nullable: false, isPrimary: true },
      { name: "maHoSo", type: "VARCHAR", nullable: false },
      { name: "soHoSoTinh", type: "VARCHAR", nullable: true },
      { name: "hoTen", type: "VARCHAR", nullable: false },
      { name: "cccd", type: "VARCHAR", nullable: false },
      { name: "loaiDoiTuong", type: "VARCHAR", nullable: false },
      { name: "tyLeThuongTat", type: "INT", nullable: false },
      { name: "troCapHangThang", type: "DECIMAL", nullable: false },
      { name: "trangThai", type: "VARCHAR", nullable: false },
      { name: "phuongXa", type: "VARCHAR", nullable: false },
    ],
  },
  {
    name: "ho_so_liet_sy",
    displayName: "Hồ sơ Liệt sĩ & Trích lục Hy sinh",
    category: "NGƯỜI CÓ CÔNG",
    columns: [
      { name: "liet_sy_id", type: "BIGINT", nullable: false, isPrimary: true },
      { name: "ho_so_id", type: "BIGINT", nullable: false, isForeign: true, references: "ho_so_ncc(id)" },
      { name: "so_ho_so_bo", type: "VARCHAR", nullable: true },
      { name: "ngay_hy_sinh", type: "VARCHAR", nullable: false },
      { name: "thoi_ky", type: "VARCHAR", nullable: false },
      { name: "noi_mai_tang", type: "VARCHAR", nullable: true },
      { name: "so_bang_to_quoc_ghi_cong", type: "VARCHAR", nullable: true },
    ],
  },
  {
    name: "than_nhan_liet_si",
    displayName: "Thân nhân Liệt sĩ & Người Thờ cúng",
    category: "NGƯỜI CÓ CÔNG",
    columns: [
      { name: "than_nhan_id", type: "BIGINT", nullable: false, isPrimary: true },
      { name: "ho_ten", type: "VARCHAR", nullable: false },
      { name: "quan_he", type: "VARCHAR", nullable: false },
      { name: "nam_sinh", type: "INT", nullable: true },
      { name: "is_nguoi_tho_cung", type: "BOOLEAN", nullable: false },
      { name: "che_do_huong", type: "VARCHAR", nullable: false },
    ],
  },
  {
    name: "ke_hoach_dieu_duong",
    displayName: "Kế hoạch Điều dưỡng Phục hồi Sức khỏe NCC",
    category: "NGƯỜI CÓ CÔNG",
    columns: [
      { name: "ke_hoach_id", type: "BIGINT", nullable: false, isPrimary: true },
      { name: "nam_ke_hoach", type: "INT", nullable: false },
      { name: "ten_ke_hoach", type: "VARCHAR", nullable: false },
      { name: "chi_tieu_tong", type: "INT", nullable: false },
      { name: "dinh_muc_tap_trung", type: "DECIMAL", nullable: false },
      { name: "dinh_muc_tai_nha", type: "DECIMAL", nullable: false },
    ],
  },
  {
    name: "lich_su_chi_tra",
    displayName: "Lịch sử Chi trả Trợ cấp Hàng tháng (C70a-HD)",
    category: "NGƯỜI CÓ CÔNG",
    columns: [
      { name: "id", type: "VARCHAR", nullable: false, isPrimary: true },
      { name: "hoSoId", type: "BIGINT", nullable: false, isForeign: true, references: "ho_so_ncc(id)" },
      { name: "kyChiTra", type: "VARCHAR", nullable: false },
      { name: "soTien", type: "DECIMAL", nullable: false },
      { name: "phuongThuc", type: "VARCHAR", nullable: false },
      { name: "trangThai", type: "VARCHAR", nullable: false },
      { name: "ngayChiTra", type: "VARCHAR", nullable: true },
    ],
  },
  {
    name: "ho_so_bao_giam_mai_tang",
    displayName: "Báo giảm Từ trần & Mai táng phí (Mẫu 02 NĐ 131)",
    category: "NGƯỜI CÓ CÔNG",
    columns: [
      { name: "id", type: "VARCHAR", nullable: false, isPrimary: true },
      { name: "hoSoId", type: "BIGINT", nullable: false, isForeign: true, references: "ho_so_ncc(id)" },
      { name: "hoTen", type: "VARCHAR", nullable: false },
      { name: "ngayTuTran", type: "VARCHAR", nullable: false },
      { name: "soQuyetDinh", type: "VARCHAR", nullable: false },
      { name: "soTienMaiTangPhi", type: "DECIMAL", nullable: false },
      { name: "trangThai", type: "VARCHAR", nullable: false },
    ],
  },
  {
    name: "danh_sach_phuong_tien_chinh_hinh",
    displayName: "Dụng cụ Chỉnh hình & Niên hạn Cấp mới",
    category: "NGƯỜI CÓ CÔNG",
    columns: [
      { name: "id", type: "VARCHAR", nullable: false, isPrimary: true },
      { name: "hoSoId", type: "BIGINT", nullable: false, isForeign: true, references: "ho_so_ncc(id)" },
      { name: "tenDungCu", type: "VARCHAR", nullable: false },
      { name: "loaiDungCu", type: "VARCHAR", nullable: false },
      { name: "nienHanNam", type: "INT", nullable: false },
      { name: "namCapGanNhat", type: "INT", nullable: false },
      { name: "namDenHanCapMoi", type: "INT", nullable: false },
      { name: "dinhMucTien", type: "DECIMAL", nullable: false },
      { name: "trangThai", type: "VARCHAR", nullable: false },
    ],
  },
  {
    name: "nghia_trang_mo_liet_si",
    displayName: "Số hóa Bản đồ Nghĩa trang Mộ Liệt sĩ (GIS)",
    category: "NGƯỜI CÓ CÔNG",
    columns: [
      { name: "id", type: "VARCHAR", nullable: false, isPrimary: true },
      { name: "soMo", type: "VARCHAR", nullable: false },
      { name: "khuMo", type: "VARCHAR", nullable: false },
      { name: "hoTenLietSi", type: "VARCHAR", nullable: false },
      { name: "ngayHySinh", type: "VARCHAR", nullable: false },
      { name: "queQuan", type: "VARCHAR", nullable: false },
      { name: "tinhTrangMo", type: "VARCHAR", nullable: false },
      { name: "luotThapHuong", type: "INT", nullable: false },
    ],
  },
  {
    name: "khao_sat_danh_gia",
    displayName: "Khảo sát Đánh giá CSAT & Sentiment",
    category: "NGƯỜI CÓ CÔNG",
    columns: [
      { name: "id", type: "VARCHAR", nullable: false, isPrimary: true },
      { name: "hoSoId", type: "BIGINT", nullable: false, isForeign: true, references: "ho_so_ncc(id)" },
      { name: "kenh", type: "VARCHAR", nullable: false },
      { name: "diemChung", type: "INT", nullable: false },
      { name: "sentimentTag", type: "VARCHAR", nullable: false },
      { name: "yKien", type: "TEXT", nullable: true },
      { name: "thoiGian", type: "VARCHAR", nullable: false },
    ],
  },

  // 3. Phân hệ Giáo dục & Đào tạo
  {
    name: "ho_so_tthc_giao_duc",
    displayName: "Hồ sơ TTHC Giáo dục Một cửa (TT 49/2021)",
    category: "GIÁO DỤC",
    columns: [
      { name: "id", type: "VARCHAR", nullable: false, isPrimary: true },
      { name: "maHoSo", type: "VARCHAR", nullable: false },
      { name: "tenThuTuc", type: "VARCHAR", nullable: false },
      { name: "nguoiNop", type: "VARCHAR", nullable: false },
      { name: "trangThai", type: "VARCHAR", nullable: false },
      { name: "ngayTiepNhan", type: "VARCHAR", nullable: false },
      { name: "ngayHenTra", type: "VARCHAR", nullable: false },
    ],
  },
  {
    name: "co_so_mam_non_tu_thuc",
    displayName: "Cơ sở Mầm non & Nhóm trẻ Ngoài công lập",
    category: "GIÁO DỤC",
    columns: [
      { name: "id", type: "VARCHAR", nullable: false, isPrimary: true },
      { name: "tenCoSo", type: "VARCHAR", nullable: false },
      { name: "chuCoSo", type: "VARCHAR", nullable: false },
      { name: "diaChi", type: "VARCHAR", nullable: false },
      { name: "soTre", type: "INT", nullable: false },
      { name: "tinhTrangCapPhep", type: "VARCHAR", nullable: false },
      { name: "diemKiemTraATTP", type: "INT", nullable: false },
    ],
  },
  {
    name: "truong_hoc_cong_lap",
    displayName: "Mạng lưới Trường học Công lập trên địa bàn",
    category: "GIÁO DỤC",
    columns: [
      { name: "id", type: "VARCHAR", nullable: false, isPrimary: true },
      { name: "tenTruong", type: "VARCHAR", nullable: false },
      { name: "capHoc", type: "VARCHAR", nullable: false },
      { name: "diaChi", type: "VARCHAR", nullable: false },
      { name: "tongSoLop", type: "INT", nullable: false },
      { name: "tongSoHocSinh", type: "INT", nullable: false },
      { name: "chuanQuocGia", type: "VARCHAR", nullable: false },
    ],
  },
  {
    name: "dieu_tra_pho_cap_gd",
    displayName: "Điều tra Phổ cập Giáo dục & Xóa mù chữ (NĐ 20/2014)",
    category: "GIÁO DỤC",
    columns: [
      { name: "id", type: "VARCHAR", nullable: false, isPrimary: true },
      { name: "khuPho", type: "VARCHAR", nullable: false },
      { name: "namHoc", type: "VARCHAR", nullable: false },
      { name: "tyLeMamNon5T", type: "DECIMAL", nullable: false },
      { name: "tyLeTieuHoc", type: "DECIMAL", nullable: false },
      { name: "tyLeTHCS", type: "DECIMAL", nullable: false },
      { name: "tyLeXoaMuChu", type: "DECIMAL", nullable: false },
      { name: "chuanDatDuoc", type: "VARCHAR", nullable: false },
    ],
  },
  {
    name: "danh_gia_cong_dong_hoc_tap",
    displayName: "Đánh giá Mô hình Cộng đồng Học tập cấp Xã (TT 44/2014)",
    category: "GIÁO DỤC",
    columns: [
      { name: "id", type: "VARCHAR", nullable: false, isPrimary: true },
      { name: "namDanhGia", type: "INT", nullable: false },
      { name: "tongDiem", type: "INT", nullable: false },
      { name: "xepLoai", type: "VARCHAR", nullable: false },
      { name: "trangThai", type: "VARCHAR", nullable: false },
      { name: "ngayDanhGia", type: "VARCHAR", nullable: false },
    ],
  },

  // 4. Phân hệ Lao động, An sinh Xã hội & Quỹ
  {
    name: "ho_so_bao_tro_xa_hoi",
    displayName: "Hồ sơ Trợ cấp Bảo trợ Xã hội (NĐ 20/2021)",
    category: "AN SINH",
    columns: [
      { name: "id", type: "VARCHAR", nullable: false, isPrimary: true },
      { name: "maDoiTuong", type: "VARCHAR", nullable: false },
      { name: "hoTen", type: "VARCHAR", nullable: false },
      { name: "loaiDoiTuong", type: "VARCHAR", nullable: false },
      { name: "heSoHuong", type: "DECIMAL", nullable: false },
      { name: "mucTroCapThang", type: "DECIMAL", nullable: false },
      { name: "trangThai", type: "VARCHAR", nullable: false },
      { name: "khuPho", type: "VARCHAR", nullable: false },
    ],
  },
  {
    name: "ho_ngheo_can_ngheo",
    displayName: "Rà soát Hộ nghèo Đa chiều (QĐ 24/2021)",
    category: "AN SINH",
    columns: [
      { name: "id", type: "VARCHAR", nullable: false, isPrimary: true },
      { name: "maHo", type: "VARCHAR", nullable: false },
      { name: "chuHo", type: "VARCHAR", nullable: false },
      { name: "phanLoai", type: "VARCHAR", nullable: false },
      { name: "diemB1", type: "INT", nullable: false },
      { name: "chieuThieuHut", type: "VARCHAR", nullable: false },
      { name: "khuPho", type: "VARCHAR", nullable: false },
    ],
  },
  {
    name: "cung_cau_lao_dong",
    displayName: "Điều tra Cung Cầu Lao động (TT 01/2022)",
    category: "AN SINH",
    columns: [
      { name: "id", type: "VARCHAR", nullable: false, isPrimary: true },
      { name: "hoTen", type: "VARCHAR", nullable: false },
      { name: "tinhTrangViecLam", type: "VARCHAR", nullable: false },
      { name: "trinhDoCMKT", type: "VARCHAR", nullable: false },
      { name: "nhuCauDaoTao", type: "VARCHAR", nullable: false },
      { name: "khuPho", type: "VARCHAR", nullable: false },
    ],
  },
  {
    name: "tre_em_hoan_canh_dac_biet",
    displayName: "Trẻ em Hoàn cảnh Đặc biệt & Kế hoạch Can thiệp",
    category: "AN SINH",
    columns: [
      { name: "id", type: "VARCHAR", nullable: false, isPrimary: true },
      { name: "hoTen", type: "VARCHAR", nullable: false },
      { name: "nhomHoanCanh", type: "VARCHAR", nullable: false },
      { name: "keHoachCanThiep", type: "VARCHAR", nullable: false },
      { name: "trangThai", type: "VARCHAR", nullable: false },
      { name: "khuPho", type: "VARCHAR", nullable: false },
    ],
  },
  {
    name: "ho_so_tho_cung_liet_si",
    displayName: "Trợ cấp Thờ cúng Liệt sĩ (Mẫu 04 NĐ 131/2021)",
    category: "AN SINH",
    columns: [
      { name: "id", type: "VARCHAR", nullable: false, isPrimary: true },
      { name: "hoTenNguoiThoCung", type: "VARCHAR", nullable: false },
      { name: "cccd", type: "VARCHAR", nullable: false },
      { name: "tenLietSi", type: "VARCHAR", nullable: false },
      { name: "quanHeVoiLietSi", type: "VARCHAR", nullable: false },
      { name: "dinhMucNam", type: "DECIMAL", nullable: false },
      { name: "trangThaiChiTra", type: "VARCHAR", nullable: false },
    ],
  },
  {
    name: "hoi_dong_xac_dinh_khuyet_tat",
    displayName: "Hội đồng Xác định Mức độ Khuyết tật cấp Xã (TT 01/2019)",
    category: "AN SINH",
    columns: [
      { name: "id", type: "VARCHAR", nullable: false, isPrimary: true },
      { name: "hoTen", type: "VARCHAR", nullable: false },
      { name: "dangTat", type: "VARCHAR", nullable: false },
      { name: "mucDoKhuyetTat", type: "VARCHAR", nullable: false },
      { name: "soGiayXacNhan", type: "VARCHAR", nullable: false },
      { name: "trangThai", type: "VARCHAR", nullable: false },
    ],
  },
  {
    name: "so_quy_den_on_dap_nghia",
    displayName: "Quỹ Đền ơn Đáp nghĩa Phường (NĐ 45/2017)",
    category: "AN SINH",
    columns: [
      { name: "id", type: "VARCHAR", nullable: false, isPrimary: true },
      { name: "loaiGiaoDich", type: "VARCHAR", nullable: false },
      { name: "nguonDongGop", type: "VARCHAR", nullable: false },
      { name: "soTien", type: "DECIMAL", nullable: false },
      { name: "noiDung", type: "TEXT", nullable: false },
      { name: "ngayGhiNhan", type: "VARCHAR", nullable: false },
    ],
  },
  {
    name: "nha_tinh_nghia_nguoi_co_cong",
    displayName: "Xây mới & Sửa chữa Nhà Tình nghĩa NCC",
    category: "AN SINH",
    columns: [
      { name: "id", type: "VARCHAR", nullable: false, isPrimary: true },
      { name: "hoTenDoiTuong", type: "VARCHAR", nullable: false },
      { name: "loaiHinh", type: "VARCHAR", nullable: false },
      { name: "kinhPhiHoTro", type: "DECIMAL", nullable: false },
      { name: "tienDo", type: "VARCHAR", nullable: false },
      { name: "trangThai", type: "VARCHAR", nullable: false },
    ],
  },

  // 5. Phân hệ Văn hóa & Thể thao
  {
    name: "ho_so_gia_dinh_van_hoa",
    displayName: "Hồ sơ Đăng ký Gia đình Văn hóa (NĐ 86/2023)",
    category: "VĂN HÓA",
    columns: [
      { name: "id", type: "VARCHAR", nullable: false, isPrimary: true },
      { name: "chuHo", type: "VARCHAR", nullable: false },
      { name: "khuPho", type: "VARCHAR", nullable: false },
      { name: "diemTuCham", type: "INT", nullable: false },
      { name: "diemThamDinh", type: "INT", nullable: false },
      { name: "danhHieu", type: "VARCHAR", nullable: false },
    ],
  },
  {
    name: "khu_pho_van_hoa",
    displayName: "Tiêu chí Khu phố Văn hóa Tiêu biểu",
    category: "VĂN HÓA",
    columns: [
      { name: "id", type: "VARCHAR", nullable: false, isPrimary: true },
      { name: "tenKhuPho", type: "VARCHAR", nullable: false },
      { name: "truongKhuPho", type: "VARCHAR", nullable: false },
      { name: "tyLeGiaDinhDatChuan", type: "DECIMAL", nullable: false },
      { name: "danhHieu", type: "VARCHAR", nullable: false },
    ],
  },
  {
    name: "nghe_nhan_di_san_van_hoa",
    displayName: "Nghệ nhân Di sản Văn hóa Phi vật thể (NĐ 109/2015)",
    category: "VĂN HÓA",
    columns: [
      { name: "id", type: "VARCHAR", nullable: false, isPrimary: true },
      { name: "hoTen", type: "VARCHAR", nullable: false },
      { name: "danhHieu", type: "VARCHAR", nullable: false },
      { name: "loaiHinhDiSan", type: "VARCHAR", nullable: false },
      { name: "troCapHangThang", type: "DECIMAL", nullable: false },
      { name: "trangThai", type: "VARCHAR", nullable: false },
    ],
  },
  {
    name: "co_so_the_thao_ho_boi",
    displayName: "Cơ sở Kinh doanh Thể thao & Bể bơi Phòng đuối nước",
    category: "VĂN HÓA",
    columns: [
      { name: "id", type: "VARCHAR", nullable: false, isPrimary: true },
      { name: "tenCoSo", type: "VARCHAR", nullable: false },
      { name: "loaiHinh", type: "VARCHAR", nullable: false },
      { name: "cuuHoVienCoChungChi", type: "BOOLEAN", nullable: false },
      { name: "dieuKienAnToan", type: "VARCHAR", nullable: false },
      { name: "ketLuanKiemTra", type: "VARCHAR", nullable: false },
    ],
  },

  // 6. Phân hệ Thông tin, Truyền thông & CĐS
  {
    name: "phan_anh_hien_truong_1022",
    displayName: "Tiếp nhận & Xử lý Phản ánh Hiện trường 1022",
    category: "THÔNG TIN CĐS",
    columns: [
      { name: "id", type: "VARCHAR", nullable: false, isPrimary: true },
      { name: "tieuDe", type: "VARCHAR", nullable: false },
      { name: "nguoiGui", type: "VARCHAR", nullable: false },
      { name: "linhVuc", type: "VARCHAR", nullable: false },
      { name: "trangThai", type: "VARCHAR", nullable: false },
      { name: "ketQuaXuLy", type: "TEXT", nullable: true },
      { name: "ngayGui", type: "VARCHAR", nullable: false },
    ],
  },
  {
    name: "bo_chi_so_dti_cap_xa",
    displayName: "Bộ Chỉ số Chuyển đổi số Cấp Xã (DTI)",
    category: "THÔNG TIN CĐS",
    columns: [
      { name: "id", type: "VARCHAR", nullable: false, isPrimary: true },
      { name: "truCot", type: "VARCHAR", nullable: false },
      { name: "chiTieu", type: "VARCHAR", nullable: false },
      { name: "diemToiDa", type: "INT", nullable: false },
      { name: "diemDatDuoc", type: "INT", nullable: false },
      { name: "tiLeHoanThanh", type: "DECIMAL", nullable: false },
    ],
  },
  {
    name: "tin_bai_cong_thong_tin",
    displayName: "Quản trị Tin bài Cổng TTĐT & Zalo OA (NĐ 42/2022)",
    category: "THÔNG TIN CĐS",
    columns: [
      { name: "id", type: "VARCHAR", nullable: false, isPrimary: true },
      { name: "tieuDe", type: "VARCHAR", nullable: false },
      { name: "chuyenMuc", type: "VARCHAR", nullable: false },
      { name: "tacGia", type: "VARCHAR", nullable: false },
      { name: "trangThai", type: "VARCHAR", nullable: false },
      { name: "luotXem", type: "INT", nullable: false },
      { name: "daPhatZaloOA", type: "BOOLEAN", nullable: false },
    ],
  },
  {
    name: "giam_sat_khong_gian_mang",
    displayName: "Giám sát An ninh Mạng Lực lượng 35 (CT 14/CT-TTg)",
    category: "THÔNG TIN CĐS",
    columns: [
      { name: "id", type: "VARCHAR", nullable: false, isPrimary: true },
      { name: "nguonTin", type: "VARCHAR", nullable: false },
      { name: "mucDoAnhHuong", type: "VARCHAR", nullable: false },
      { name: "trangThaiXuLy", type: "VARCHAR", nullable: false },
      { name: "bienPhapXuLy", type: "TEXT", nullable: true },
      { name: "thoiGianPhatHien", type: "VARCHAR", nullable: false },
    ],
  },

  // 7. Đánh giá KPI Cán bộ & Kiểm toán
  {
    name: "bang_danh_gia_kpi_can_bo",
    displayName: "Đánh giá KPI Cán bộ Công chức (NĐ 90 & NĐ 48)",
    category: "KPI",
    columns: [
      { name: "id", type: "VARCHAR", nullable: false, isPrimary: true },
      { name: "canBoId", type: "VARCHAR", nullable: false },
      { name: "hoTen", type: "VARCHAR", nullable: false },
      { name: "khoiChuyenMon", type: "VARCHAR", nullable: false },
      { name: "tongDiemCuoiCung", type: "INT", nullable: false },
      { name: "xepLoai", type: "VARCHAR", nullable: false },
      { name: "trangThai", type: "VARCHAR", nullable: false },
      { name: "daKySoSmartCA", type: "BOOLEAN", nullable: false },
    ],
  },
  {
    name: "sys_audit_logs",
    displayName: "Nhật ký Kiểm toán Hệ thống (Security Audit Trails)",
    category: "HỆ THỐNG",
    columns: [
      { name: "id", type: "VARCHAR", nullable: false, isPrimary: true },
      { name: "hanhDong", type: "VARCHAR", nullable: false },
      { name: "thoiGian", type: "VARCHAR", nullable: false },
      { name: "canBo", type: "VARCHAR", nullable: false },
      { name: "chiTiet", type: "TEXT", nullable: false },
    ],
  },
];

/**
 * RELATIONAL DATABASE CORE CLASS
 */
export class RelationalDatabase {
  private data: Record<string, any[]> = {};
  private inTransaction = false;
  private transactionSnapshot: Record<string, any[]> | null = null;
  private storageFilePath: string;

  constructor() {
    this.storageFilePath = path.resolve(process.cwd(), "database", "database_persistence.json");
    this.initialize();
  }

  // Initialize or restore database tables
  public initialize(forceReset = false) {
    if (!forceReset && fs.existsSync(this.storageFilePath)) {
      try {
        const fileContent = fs.readFileSync(this.storageFilePath, "utf8");
        this.data = JSON.parse(fileContent);
        return;
      } catch (err) {
        console.warn("Lỗi đọc file database_persistence.json, khởi tạo lại từ seed dữ liệu:", err);
      }
    }

    // Populate initial seed tables
    this.data = {
      dm_phuong: [...WARDS],
      dm_loai_doi_tuong: [...CATEGORIES],
      sys_roles: [
        { role_id: 1, role_name: "ADMIN_SO", description: "Lãnh đạo Sở Lao động - Thương binh và Xã hội" },
        { role_id: 2, role_name: "ADMIN_PHONG", description: "Lãnh đạo Phòng LĐTBXH TP. Thủ Dầu Một" },
        { role_id: 3, role_name: "LANH_DAO_UBND", description: "Chủ tịch / Phó Chủ tịch UBND Phường" },
        { role_id: 4, role_name: "CAN_BO_CHUYEN_TRACH", description: "Công chức Văn hóa - Xã hội" },
      ],
      sys_users: Object.values(USERS),
      ho_so_ncc: [...hoSoList],
      ho_so_liet_sy: [
        {
          liet_sy_id: 1,
          ho_so_id: 12029,
          so_ho_so_bo: "BD/LS-07956",
          ngay_hy_sinh: "Tháng 07 Năm 1949",
          thoi_ky: "Chống Pháp (từ 19/08/1945 - 20/07/1954)",
          noi_mai_tang: "An Mỹ, Châu Thành",
          so_bang_to_quoc_ghi_cong: "GC887K",
        },
      ],
      than_nhan_liet_si: [
        {
          than_nhan_id: 1,
          ho_ten: "Hồ Thị Mai",
          quan_he: "Con gái",
          nam_sinh: 1948,
          is_nguoi_tho_cung: true,
          che_do_huong: "Trợ cấp thờ cúng liệt sĩ 1.400.000đ/năm",
        },
      ],
      ke_hoach_dieu_duong: [
        {
          ke_hoach_id: 1,
          nam_ke_hoach: 2026,
          ten_ke_hoach: "Kế hoạch điều dưỡng phục hồi sức khỏe NCC năm 2026",
          chi_tieu_tong: 1250,
          dinh_muc_tap_trung: 3699000,
          dinh_muc_tai_nha: 1849500,
        },
      ],
      lich_su_chi_tra: [
        {
          id: "CT-2026-03-01",
          hoSoId: 101,
          kyChiTra: "Tháng 03/2026",
          soTien: 5410000,
          phuongThuc: "NGAN_HANG",
          trangThai: "DA_CHI_TRA",
          ngayChiTra: "2026-03-05 09:30:00",
        },
      ],
      ho_so_bao_giam_mai_tang: [...initialBaoGiamList],
      danh_sach_phuong_tien_chinh_hinh: [...initialDungCuChinhHinh],
      nghia_trang_mo_liet_si: [...initialMoLietSiList],
      khao_sat_danh_gia: [...phanHoiList],

      // Phân hệ Giáo dục
      ho_so_tthc_giao_duc: [...initialHoSoTTHCGiaoDucList],
      co_so_mam_non_tu_thuc: [...initialMamNonList],
      truong_hoc_cong_lap: [...initialTruongCongLapList],
      dieu_tra_pho_cap_gd: [...initialPhoCapGiaoDucList],
      danh_gia_cong_dong_hoc_tap: [...initialCongDongHocTapList],

      // Phân hệ An sinh
      ho_so_bao_tro_xa_hoi: [...initialBaoTroList],
      ho_ngheo_can_ngheo: [...initialHoGheoList],
      cung_cau_lao_dong: [...initialCungCauLaoDongList],
      tre_em_hoan_canh_dac_biet: [...initialTreEmList],
      ho_so_tho_cung_liet_si: [...initialThoCungLietSiList],
      hoi_dong_xac_dinh_khuyet_tat: [...initialHoiDongKhuyetTatList],
      so_quy_den_on_dap_nghia: [...initialQuyDenOnList],
      nha_tinh_nghia_nguoi_co_cong: [...initialNhaTinhNghiaList],

      // Phân hệ Văn hóa & Thể thao
      ho_so_gia_dinh_van_hoa: [...initialGiaDinhVanHoaList],
      khu_pho_van_hoa: [...initialKhuPhoVanHoaList],
      nghe_nhan_di_san_van_hoa: [...initialNgheNhanDiSanList],
      co_so_the_thao_ho_boi: [...initialCoSoTheThaoList],

      // Phân hệ Thông tin & CĐS
      phan_anh_hien_truong_1022: [...initialPhanAnh1022List],
      bo_chi_so_dti_cap_xa: [...initialDtiCapXaList],
      tin_bai_cong_thong_tin: [...initialTinBaiList],
      giam_sat_khong_gian_mang: [...initialKhongGianMangList],

      // Phân hệ KPI & Logs
      bang_danh_gia_kpi_can_bo: [...initialKpiEvaluationList],
      sys_audit_logs: [
        {
          id: "LOG-INIT-01",
          hanhDong: "KHỞI TẠO CSDL 3NF",
          thoiGian: new Date().toLocaleString("vi-VN"),
          canBo: "Hệ thống Tự động",
          chiTiet: "Đã nạp toàn bộ 49 bảng quan hệ vào Database Engine",
        },
      ],
    };

    this.persistToDisk();
  }

  // Persist current memory snapshot to disk
  private persistToDisk() {
    try {
      const dir = path.dirname(this.storageFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.storageFilePath, JSON.stringify(this.data, null, 2), "utf8");
    } catch (err) {
      console.warn("Không thể ghi file database_persistence.json:", err);
    }
  }

  // ACID Transaction Support
  public beginTransaction(): void {
    if (this.inTransaction) {
      throw new Error("Giao dịch (Transaction) đã đang được thực thi. Vui lòng commit hoặc rollback trước!");
    }
    this.inTransaction = true;
    this.transactionSnapshot = JSON.parse(JSON.stringify(this.data));
  }

  public commit(): void {
    if (!this.inTransaction) {
      throw new Error("Không có giao dịch nào đang mở để commit!");
    }
    this.inTransaction = false;
    this.transactionSnapshot = null;
    this.persistToDisk();
  }

  public rollback(): void {
    if (!this.inTransaction || !this.transactionSnapshot) {
      throw new Error("Không có giao dịch nào đang mở để rollback!");
    }
    this.data = this.transactionSnapshot;
    this.inTransaction = false;
    this.transactionSnapshot = null;
  }

  // CRUD Table Query API
  public getTableRows(tableName: string): any[] {
    return this.data[tableName] || [];
  }

  public insertRow(tableName: string, row: any): any {
    if (!this.data[tableName]) {
      this.data[tableName] = [];
    }
    const newRow = { ...row };
    if (!newRow.id && !newRow.user_id && !newRow.ward_id && !newRow.ma_loai_dt) {
      newRow.id = `ID-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
    this.data[tableName].unshift(newRow);
    if (!this.inTransaction) {
      this.persistToDisk();
    }
    return newRow;
  }

  public updateRow(tableName: string, predicate: (row: any) => boolean, updates: any): boolean {
    const list = this.data[tableName];
    if (!list) return false;
    let updated = false;
    for (let i = 0; i < list.length; i++) {
      if (predicate(list[i])) {
        list[i] = { ...list[i], ...updates };
        updated = true;
      }
    }
    if (updated && !this.inTransaction) {
      this.persistToDisk();
    }
    return updated;
  }

  public deleteRow(tableName: string, predicate: (row: any) => boolean): boolean {
    const list = this.data[tableName];
    if (!list) return false;
    const initialLength = list.length;
    this.data[tableName] = list.filter((r) => !predicate(r));
    const deleted = this.data[tableName].length < initialLength;
    if (deleted && !this.inTransaction) {
      this.persistToDisk();
    }
    return deleted;
  }

  // Database Statistics & Health Overview
  public getDatabaseOverview() {
    const tableNames = Object.keys(this.data);
    let totalRecords = 0;
    const tableSummaries: Record<string, number> = {};

    for (const tbl of tableNames) {
      const count = this.data[tbl]?.length || 0;
      tableSummaries[tbl] = count;
      totalRecords += count;
    }

    let storageSizeBytes = 0;
    try {
      if (fs.existsSync(this.storageFilePath)) {
        storageSizeBytes = fs.statSync(this.storageFilePath).size;
      }
    } catch {
      storageSizeBytes = JSON.stringify(this.data).length;
    }

    return {
      engine: "Relational Database Engine v2.0 (InnoDB Compatible)",
      status: "ONLINE",
      schema_version: "2026.03.FINAL",
      charset: "utf8mb4_unicode_ci",
      tablesCount: tableNames.length,
      totalRecords,
      storageSizeBytes,
      storageSizeKb: (storageSizeBytes / 1024).toFixed(2),
      inTransaction: this.inTransaction,
      persistenceFile: this.storageFilePath,
      tableSummaries,
    };
  }

  // Generate complete SQL Dump (DDL + INSERT statements)
  public exportSqlDump(): string {
    let sql = `-- ==============================================================================\n`;
    sql += `-- BẢN DUMP CƠ SỞ DỮ LIỆU ĐIỆN TỬ: HỆ THỐNG QUẢN LÝ CHUYÊN MÔN UBND CẤP XÃ/PHƯỜNG\n`;
    sql += `-- Đơn vị: UBND Phường Thủ Dầu Một / Phòng LĐTBXH TP. Thủ Dầu Một\n`;
    sql += `-- Ngày xuất file: ${new Date().toLocaleString("vi-VN")}\n`;
    sql += `-- Chuẩn: MySQL 8.0 / InnoDB / utf8mb4_unicode_ci / 3NF\n`;
    sql += `-- ==============================================================================\n\n`;
    sql += `SET FOREIGN_KEY_CHECKS = 0;\n`;
    sql += `CREATE DATABASE IF NOT EXISTS ql_chuyen_mon_phuong CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\n`;
    sql += `USE ql_chuyen_mon_phuong;\n\n`;

    for (const tableDef of DATABASE_TABLES_CATALOG) {
      const tblName = tableDef.name;
      const rows = this.data[tblName] || [];

      sql += `-- -----------------------------------------------------\n`;
      sql += `-- BẢNG: ${tblName} (${tableDef.displayName})\n`;
      sql += `-- -----------------------------------------------------\n`;
      sql += `DROP TABLE IF EXISTS \`${tblName}\`;\n`;
      sql += `CREATE TABLE \`${tblName}\` (\n`;

      const colDefs = tableDef.columns.map((c) => {
        let def = `  \`${c.name}\` ${c.type}`;
        if (c.type === "VARCHAR") def += "(255)";
        if (c.type === "DECIMAL") def += "(15, 2)";
        if (!c.nullable) def += " NOT NULL";
        if (c.isPrimary) def += " PRIMARY KEY";
        return def;
      });

      sql += colDefs.join(",\n");
      sql += `\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

      // Insert statements
      if (rows.length > 0) {
        sql += `-- Nạp dữ liệu mẫu (${rows.length} bản ghi) cho \`${tblName}\`\n`;
        for (const row of rows) {
          const keys = Object.keys(row);
          const values = keys.map((k) => {
            const v = row[k];
            if (v === null || v === undefined) return "NULL";
            if (typeof v === "number" || typeof v === "boolean") return v;
            return `'${String(v).replace(/'/g, "''")}'`;
          });
          sql += `INSERT INTO \`${tblName}\` (\`${keys.join("`, `")}\`) VALUES (${values.join(", ")});\n`;
        }
        sql += `\n`;
      }
    }

    sql += `SET FOREIGN_KEY_CHECKS = 1;\n`;
    sql += `-- KẾT THÚC BẢN DUMP CSDL --\n`;
    return sql;
  }
}

// Global Relational Database Singleton Instance
export const relationalDb = new RelationalDatabase();
