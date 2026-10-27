/**
 * BACKEND IN-MEMORY RELATIONAL DATABASE STORE
 * Fully implements the 16 tables defined in database/schema.sql
 * Pre-seeded with production-like data for TP. Thủ Dầu Một / Bình Dương
 */

import {
  hoSoList,
  phanHoiList,
  initialDungCuChinhHinh,
  initialMoLietSiList,
  initialCanhBaoList,
  initialBaoGiamList,
  type HoSo,
  type PhanHoi,
  type DungCuChinhHinhItem,
  type MoLietSiItem,
  type BaoGiamItem,
  type CanhBaoSomItem,
  type CurrentUser,
} from "@/data/mock";

import { appStore, type ChiTraItem } from "@/services/app-state";

import {
  initialHoSoTTHCGiaoDucList,
  initialMamNonList,
  initialTruongCongLapList,
  initialPhoCapList,
  type HoSoTTHCGiaoDuc,
  type CoSoMamNonTuThuc,
  type TruongHocCongLap,
  type SoLieuPhoCapGiaoDuc,
} from "@/data/domain-mock";

// 1. Danh mục Phường (dm_phuong)
export interface DmPhuong {
  ward_id: number;
  ward_name: string;
  district_name: string;
}

export const WARDS: DmPhuong[] = [
  { ward_id: 1, ward_name: "Phường Phú Cường", district_name: "TP. Thủ Dầu Một" },
  { ward_id: 2, ward_name: "Phường Phú Hòa", district_name: "TP. Thủ Dầu Một" },
  { ward_id: 3, ward_name: "Phường Hiệp Thành", district_name: "TP. Thủ Dầu Một" },
  { ward_id: 4, ward_name: "Phường Định Hòa", district_name: "TP. Thủ Dầu Một" },
  { ward_id: 5, ward_name: "Phường Phú Lợi", district_name: "TP. Thủ Dầu Một" },
  { ward_id: 6, ward_name: "Phường Chánh Nghĩa", district_name: "TP. Thủ Dầu Một" },
  { ward_id: 7, ward_name: "Phường Phú Thọ", district_name: "TP. Thủ Dầu Một" },
  { ward_id: 8, ward_name: "Phường Phú Mỹ", district_name: "TP. Thủ Dầu Một" },
  { ward_id: 9, ward_name: "Phường Hiệp An", district_name: "TP. Thủ Dầu Một" },
  { ward_id: 10, ward_name: "Phường Tương Bình Hiệp", district_name: "TP. Thủ Dầu Một" },
  { ward_id: 11, ward_name: "Phường Chánh Mỹ", district_name: "TP. Thủ Dầu Một" },
  { ward_id: 12, ward_name: "Phường Tân An", district_name: "TP. Thủ Dầu Một" },
  { ward_id: 13, ward_name: "Phường Thới Hòa", district_name: "TP. Thủ Dầu Một" },
  { ward_id: 14, ward_name: "Phường Hòa Phú", district_name: "TP. Thủ Dầu Một" },
];

// 2. Danh mục Loại Đối tượng (dm_loai_doi_tuong)
export interface DmLoaiDoiTuong {
  ma_loai_dt: string;
  ten_loai_dt: string;
  nhom_uu_dai: string;
  mo_ta: string;
}

export const CATEGORIES: DmLoaiDoiTuong[] = [
  { ma_loai_dt: "THUONG_BINH", ten_loai_dt: "Thương binh", nhom_uu_dai: "TRỢ CẤP HÀNG THÁNG", mo_ta: "Người bị thương trong chiến đấu hoặc làm nhiệm vụ quốc phòng an ninh" },
  { ma_loai_dt: "BENH_BINH", ten_loai_dt: "Bệnh binh", nhom_uu_dai: "TRỢ CẤP HÀNG THÁNG", mo_ta: "Quân nhân, CAND bị mắc bệnh khi làm nhiệm vụ" },
  { ma_loai_dt: "ME_VNAH", ten_loai_dt: "Bà mẹ Việt Nam Anh hùng", nhom_uu_dai: "TRỢ CẤP & PHỤ CẤP", mo_ta: "Bà mẹ có nhiều con hoặc con duy nhất là liệt sĩ" },
  { ma_loai_dt: "LIET_SI", ten_loai_dt: "Thân nhân Liệt sĩ", nhom_uu_dai: "TRỢ CẤP HÀNG THÁNG", mo_ta: "Cha mẹ, vợ/chồng, con liệt sĩ được hưởng định mức chuẩn" },
  { ma_loai_dt: "CHAT_DOC_HOA_HOC", ten_loai_dt: "Nhiễm chất độc hóa học", nhom_uu_dai: "TRỢ CẤP HÀNG THÁNG", mo_ta: "Người hoạt động kháng chiến bị nhiễm dioxin" },
  { ma_loai_dt: "TIEN_KHOI_NGHIA", ten_loai_dt: "Cán bộ tiền khởi nghĩa", nhom_uu_dai: "TRỢ CẤP ƯU ĐÃI", mo_ta: "Cán bộ tham gia cách mạng trước ngày 01/01/1945" },
];

// 3. Tài khoản hệ thống (sys_users & sys_roles)
export interface SysUser extends CurrentUser {
  password_hash: string;
  is_active: boolean;
}

export const USERS: Record<string, SysUser> = {
  "admin.so@binhduong.gov.vn": {
    email: "admin.so@binhduong.gov.vn",
    role: "ADMIN_SO",
    tenCanBo: "TS. Nguyễn Văn Hùng",
    chucVu: "Phó Giám đốc Sở LĐTBXH tỉnh Bình Dương",
    donVi: "Sở Lao động - Thương binh và Xã hội tỉnh Bình Dương",
    phamVi: "Toàn tỉnh Bình Dương (9 huyện/thị/thành phố)",
    password_hash: "$2b$10$Ep99kFq7K32U8Dk75hV1..VlO6W7q2V4N8YtYx.7s/i58QpQ6X0/K",
    is_active: true,
  },
  "admin.phong@thudaumot.binhduong.gov.vn": {
    email: "admin.phong@thudaumot.binhduong.gov.vn",
    role: "ADMIN_PHONG",
    tenCanBo: "Nguyễn Thị Minh Thảo",
    chucVu: "Chuyên viên Một cửa & CSXH",
    donVi: "Phòng LĐTBXH TP. Thủ Dầu Một",
    phamVi: "Địa bàn 14 phường thuộc TP. Thủ Dầu Một",
    password_hash: "$2b$10$Ep99kFq7K32U8Dk75hV1..VlO6W7q2V4N8YtYx.7s/i58QpQ6X0/K",
    is_active: true,
  },
  "canbo.giaoduc@phucuong.binhduong.gov.vn": {
    email: "canbo.giaoduc@phucuong.binhduong.gov.vn",
    role: "CB_GIAO_DUC",
    tenCanBo: "ThS. Trần Thị Kim Oanh",
    chucVu: "Công chức Văn hóa - Xã hội phụ trách Giáo dục",
    donVi: "UBND Phường Phú Cường",
    phamVi: "Phường Phú Cường, TP. Thủ Dầu Một",
    password_hash: "$2b$10$Ep99kFq7K32U8Dk75hV1..VlO6W7q2V4N8YtYx.7s/i58QpQ6X0/K",
    is_active: true,
  },
};

export interface AuditLogItem {
  id: string;
  hanhDong: string;
  thoiGian: string;
  canBo: string;
  chiTiet: string;
}

/**
 * Backend In-Memory Database Store Class
 */
class BackendStore {
  public profiles: HoSo[] = [...hoSoList];
  public surveys: PhanHoi[] = [...phanHoiList];
  public payouts: ChiTraItem[] = [...appStore.getState().chiTraList];
  public orthotics: DungCuChinhHinhItem[] = [...initialDungCuChinhHinh];
  public cemeteryGraves: MoLietSiItem[] = [...initialMoLietSiList];
  public deceaseReports: BaoGiamItem[] = [...initialBaoGiamList];
  public earlyWarnings: CanhBaoSomItem[] = [...initialCanhBaoList];
  public auditLogs: AuditLogItem[] = [];

  // Domain 4: Giáo dục
  public hoSoGiaoDuc: HoSoTTHCGiaoDuc[] = [...initialHoSoTTHCGiaoDucList];
  public mamNonList: CoSoMamNonTuThuc[] = [...initialMamNonList];
  public truongCongLapList: TruongHocCongLap[] = [...initialTruongCongLapList];
  public phoCapList: SoLieuPhoCapGiaoDuc[] = [...initialPhoCapList];

  // Auth session
  public currentUser: CurrentUser = USERS["admin.so@binhduong.gov.vn"];

  // Log an audit action
  public logAudit(action: string, detail: string, actor?: string) {
    const newLog: AuditLogItem = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      hanhDong: action,
      thoiGian: new Date().toLocaleString("vi-VN"),
      canBo: actor || this.currentUser.tenCanBo,
      chiTiet: detail,
    };
    this.auditLogs.unshift(newLog);
    if (this.auditLogs.length > 200) {
      this.auditLogs = this.auditLogs.slice(0, 200);
    }
    return newLog;
  }

  // Reset to default test state
  public reset() {
    this.profiles = [...hoSoList];
    this.surveys = [...phanHoiList];
    this.payouts = [...appStore.getState().chiTraList];
    this.orthotics = [...initialDungCuChinhHinh];
    this.cemeteryGraves = [...initialMoLietSiList];
    this.deceaseReports = [...initialBaoGiamList];
    this.earlyWarnings = [...initialCanhBaoList];
    this.auditLogs = [];
    this.hoSoGiaoDuc = [...initialHoSoTTHCGiaoDucList];
    this.currentUser = USERS["admin.so@binhduong.gov.vn"];
  }
}

export const backendStore = new BackendStore();

