/**
 * TRUNG TÂM QUẢN LÝ TRẠNG THÁI VÀ GIAO DỊCH NGHIỆP VỤ (APP STATE & BUSINESS STORE)
 * Mô phỏng logic giao dịch ACID và phân hệ Node.js Gateway + Spring Boot Engine
 */

import { useSyncExternalStore } from "react";
import {
  hoSoList as initialHoSoList,
  phanHoiList as initialPhanHoiList,
  PHUONG_LIST,
  MUC_CHUAN,
  type HoSo,
  type PhanHoi,
  type TrangThai,
  type DungCuChinhHinhItem,
  type MoLietSiItem,
  type CanhBaoSomItem,
  type BaoGiamItem,
  initialDungCuChinhHinh,
  initialMoLietSiList,
  initialCanhBaoList,
  initialBaoGiamList,
} from "@/data/mock";
import {
  type DomainCode,
  type CumLoaTruyenThanh,
  type BanTinTruyenThanh,
  type BangTinDienTu,
  type CoDongTrucQuanItem,
  type CoSoInternetBuuChinh,
  type ToCongNgheSoCongDong,
  type DoiTuongBaoTroXaHoi,
  type HoSoCuuTroDotXuat,
  type HoGheoCanGheoItem,
  type CungCauLaoDongItem,
  type CoSoKiemTraATLaoDong,
  type TreEmHoanCanhDacBiet,
  type HoSoPhongChongTeNan,
  type CoSoMamNonTuThuc,
  type TruongHocCongLap,
  type SoLieuPhoCapGiaoDuc,
  type HoatDongKhuyenHoc,
  type MoHinhHocTap,
  type LopHocTrungTamHTCD,
  type HoSoTTHCGiaoDuc,
  type TrangThaiHoSoGD,
  initialCumLoaList,
  initialBanTinList,
  initialBangTinList,
  initialCoDongList,
  initialCoSoInternetList,
  initialToCNSList,
  initialBaoTroList,
  initialCuuTroList,
  initialHoGheoList,
  initialCungCauLaoDongList,
  initialATLaoDongList,
  initialTreEmList,
  initialTeNanList,
  initialMamNonList,
  initialTruongCongLapList,
  initialPhoCapList,
  initialKhuyenHocList,
  initialMoHinhHocTapList,
  initialLopHocHTCDList,
  initialHoSoTTHCGiaoDucList,
} from "@/data/domain-mock";
import { calculateAllowance } from "./calculator.service";
import { createProfileSchema, type CreateProfileInput } from "./profile.validation";
import { analyzeSentiment } from "./sentiment.service";

export interface QuyetDinhHuong {
  quyetDinhId: string;
  hoSoId: string;
  soQuyetDinh: string;
  ngayBanHanh: string;
  ngayHieuLuc: string;
  soTienHangThang: number;
  phuCapChamSoc: number;
  tongTien: number;
  isActive: boolean;
  canBoPheDuyet: string;
}

export interface SurveySubmissionInput {
  hoSoId?: string;
  hoTen?: string;
  kenhDanhGia: "KIOSK" | "QR_PHIEU_HEN" | "SMS_ZALO";
  diemCsatChung: number;
  yKienDongGop: string;
  tieuChi: {
    thaiDo: number; // 1-5
    thoiGian: number; // 1-5
    minhBach: number; // 1-5
    haTang: number; // 1-5
  };
}

export interface ChiTraItem {
  id: string;
  hoSoId: string;
  soHoSoTinh: string;
  hoTen: string;
  cccd?: string;
  loaiDoiTuong: string; // "Hồ sơ liệt sĩ", "Thương binh", "Mẹ VNAH", ...
  loaiCheDo: "HÀNG_THÁNG" | "THỜ_CÚNG_LIỆT_SĨ" | "MỘT_LẦN" | "ĐIỀU_DƯỠNG";
  tenCheDo: string; // "Trợ cấp thương binh hàng tháng", "Tiền tuất thân nhân liệt sĩ", "Trợ cấp thờ cúng liệt sĩ (27/7)"
  soTien: number;
  hinhThuc: "NGAN_HANG" | "BUU_DIEN";
  thongTinChiTra: string; // "Vietcombank - 0121000889922" hoặc "Bưu điện văn hóa Bình An"
  soTaiKhoan?: string;
  tenNganHang?: string;
  phuong: string;
  huyen: string;
  kyChiTra: string; // "09/2026", "08/2026", "07/2026"
  trangThai: "ĐÃ_CHI_TRẢ" | "CHỜ_CHI_TRẢ" | "TỒN_ĐỌNG";
  ngayChiTra?: string;
  maGiaoDich?: string;
  nguoiNhan?: string;
}

export interface CurrentUser {
  id: string;
  username: string;
  fullName: string;
  role: "ADMIN_SO" | "ADMIN_PHONG" | "CB_THONG_TIN" | "CB_AN_SINH" | "CB_GIAO_DUC" | string;
  roleName: string;
  title: string;
  department: string;
  unit: string;
  email: string;
  phone: string;
  avatarText: string;
  permissions: string[];
  assignedDomains: DomainCode[];
  isActive?: boolean;
}

export type MockRoleKey = "ADMIN_SO" | "ADMIN_PHONG" | "CB_THONG_TIN" | "CB_AN_SINH" | "CB_GIAO_DUC";

export const MOCK_USERS = {
  ADMIN_SO: {
    id: "USR-SO-001",
    username: "admin.so",
    fullName: "TS. Nguyễn Văn Hùng",
    role: "ADMIN_SO",
    roleName: "Quản trị viên Toàn quyền (Admin Cấp Sở)",
    title: "Phó Giám đốc Sở LĐTBXH tỉnh Bình Dương",
    department: "Ban Giám đốc Sở",
    unit: "Sở Lao động - Thương binh và Xã hội tỉnh Bình Dương",
    email: "admin.so@binhduong.gov.vn",
    phone: "0274.3822.456",
    avatarText: "NVH",
    permissions: [
      "Toàn quyền điều hành & giám sát toàn diện các mảng nghiệp vụ",
      "Phê duyệt hồ sơ chính sách & ban hành QĐ hưởng trợ cấp",
      "Phân bổ & thẩm tra quyết toán ngân sách các huyện/thị/phường",
      "Cấp quyền & phân nhiệm cán bộ phụ trách từng mảng",
      "Cấu hình tham số hệ thống & định mức phụ cấp toàn tỉnh",
    ],
    assignedDomains: ["ALL", "TT_CDS", "LDTBXH_NCC", "LDTBXH_AN_SINH", "GD_DT"],
    isActive: true,
  },
  ADMIN_PHONG: {
    id: "USR-PHONG-001",
    username: "admin.phong",
    fullName: "Nguyễn Thị Minh Thảo",
    role: "ADMIN_PHONG",
    roleName: "Cán bộ Thụ lý Cấp Phòng (Chính sách & CSXH)",
    title: "Chuyên viên thụ lý Một cửa & CSXH",
    department: "Bộ phận Tiếp nhận & Trả kết quả (Một cửa)",
    unit: "Phòng Lao động - Thương binh và Xã hội TP. Thủ Dầu Một",
    email: "admin.phong@thudaumot.binhduong.gov.vn",
    phone: "0274.3833.789",
    avatarText: "MT",
    permissions: [
      "Tiếp nhận hồ sơ Người có công tại địa bàn",
      "Thẩm định điều kiện và lập tờ trình đề nghị giải quyết",
      "Lập danh sách chi trả trợ cấp tháng (ATM / Bưu điện)",
      "Quản lý danh sách điều dưỡng & dụng cụ chỉnh hình",
      "Giám sát đánh giá CSAT dịch vụ công địa bàn",
    ],
    assignedDomains: ["LDTBXH_NCC", "LDTBXH_AN_SINH"],
    isActive: true,
  },
  CB_THONG_TIN: {
    id: "USR-TT-001",
    username: "cb.thongtin",
    fullName: "Vũ Đình Cường",
    role: "CB_THONG_TIN",
    roleName: "Cán bộ Thông tin, Truyền thông & Chuyển đổi số",
    title: "Chuyên viên Văn hóa - Thông tin & Chuyển đổi số",
    department: "Tổ Công nghệ số & Đài Truyền thanh Phường",
    unit: "Ủy ban nhân dân Phường Phú Cường, TP. Thủ Dầu Một",
    email: "vdcuong.phucuong@thudaumot.binhduong.gov.vn",
    phone: "0908.556.789",
    avatarText: "VDC",
    permissions: [
      "Quản lý & vận hành hệ thống Đài truyền thanh thông minh",
      "Biên tập & duyệt lịch phát bản tin phát thanh cơ sở",
      "Điều khiển nội dung Bảng tin điện tử LED / LCD công cộng",
      "Quản lý điểm cổ động trực quan (Pano, Băng rôn, Cờ phướn)",
      "Quản lý Cổng TTĐT, Zalo OA & Fanpage chính thức của phường",
      "Kiểm tra đại lý Internet công cộng & điểm bưu chính viễn thông",
      "Chỉ đạo & hướng dẫn Tổ công nghệ số cộng đồng tại các khu phố",
    ],
    assignedDomains: ["TT_CDS"],
    isActive: true,
  },
  CB_AN_SINH: {
    id: "USR-AS-001",
    username: "cb.ansinh",
    fullName: "Lê Hoàng Nam",
    role: "CB_AN_SINH",
    roleName: "Cán bộ Lao động, Việc làm & An sinh xã hội",
    title: "Công chức Văn hóa - Xã hội phụ trách LĐ-TB&XH",
    department: "Bộ phận Lao động - Thương binh và Xã hội Phường",
    unit: "Ủy ban nhân dân Phường Phú Cường, TP. Thủ Dầu Một",
    email: "lhnam.phucuong@thudaumot.binhduong.gov.vn",
    phone: "0912.889.334",
    avatarText: "LHN",
    permissions: [
      "Quản lý hồ sơ chính sách Người có công & Đền ơn đáp nghĩa",
      "Thẩm định & chi trả trợ cấp Bảo trợ xã hội hàng tháng (NĐ 20)",
      "Tham mưu cứu trợ khẩn cấp thiên tai, hỏa hoạn, rủi ro",
      "Rà soát hộ nghèo, cận nghèo & triển khai chính sách giảm nghèo",
      "Thu thập cung - cầu lao động & kết nối việc làm bộ đội xuất ngũ",
      "Kiểm tra an toàn vệ sinh lao động tại các cơ sở, xưởng nhỏ",
      "Quản lý dữ liệu trẻ em & chương trình phòng chống đuối nước",
      "Phối hợp quản lý người nghiện, cai nghiện tự nguyện & tệ nạn",
    ],
    assignedDomains: ["LDTBXH_NCC", "LDTBXH_AN_SINH"],
    isActive: true,
  },
  CB_GIAO_DUC: {
    id: "USR-GD-001",
    username: "cb.giaoduc",
    fullName: "ThS. Trần Thị Kim Oanh",
    role: "CB_GIAO_DUC",
    roleName: "Cán bộ Giáo dục & Đào tạo cơ sở",
    title: "Công chức phụ trách Giáo dục - Đào tạo & Khuyến học",
    department: "Bộ phận Giáo dục & Trung tâm Học tập cộng đồng",
    unit: "Ủy ban nhân dân Phường Phú Cường, TP. Thủ Dầu Một",
    email: "ttkoanh.phucuong@thudaumot.binhduong.gov.vn",
    phone: "0987.334.221",
    avatarText: "TKO",
    permissions: [
      "Thẩm định, cấp phép & giám sát nhóm trẻ, mầm non tư thục",
      "Kiểm tra an toàn thực phẩm, PCCC và điều kiện giữ trẻ",
      "Phối hợp các trường MN, TH, THCS trong tuyển sinh đầu cấp",
      "Phối hợp đảm bảo an ninh trật tự, cổng trường an toàn giao thông",
      "Thực hiện công tác phổ cập giáo dục MN 5 tuổi, Tiểu học, THCS",
      "Xóa mù chữ & vận động học sinh nguy cơ bỏ học đến trường",
      "Quản lý hoạt động Trung tâm HTCĐ & Quỹ Khuyến học phường",
    ],
    assignedDomains: ["GD_DT"],
    isActive: true,
  },
} satisfies Record<MockRoleKey, CurrentUser> & Record<string, CurrentUser>;

export function hasDomainAccess(user: CurrentUser | null | undefined, domain: DomainCode): boolean {
  if (!user) return false;
  if (user.assignedDomains.includes("ALL")) return true;
  return user.assignedDomains.includes(domain);
}

interface AppState {
  currentUser: CurrentUser;
  usersList: CurrentUser[];
  hoSoList: HoSo[];
  quyetDinhList: QuyetDinhHuong[];
  phanHoiList: PhanHoi[];
  chiTraList: ChiTraItem[];
  dungCuChinhHinhList: DungCuChinhHinhItem[];
  moLietSiList: MoLietSiItem[];
  baoGiamList: BaoGiamItem[];
  canhBaoList: CanhBaoSomItem[];
  // Dữ liệu Mảng Thông tin, Truyền thông & Chuyển đổi số
  cumLoaList: CumLoaTruyenThanh[];
  banTinList: BanTinTruyenThanh[];
  bangTinList: BangTinDienTu[];
  coDongList: CoDongTrucQuanItem[];
  coSoInternetList: CoSoInternetBuuChinh[];
  toCNSList: ToCongNgheSoCongDong[];
  // Dữ liệu Mảng Lao động, Người có công & An sinh xã hội
  baoTroList: DoiTuongBaoTroXaHoi[];
  cuuTroList: HoSoCuuTroDotXuat[];
  hoGheoList: HoGheoCanGheoItem[];
  cungCauLaoDongList: CungCauLaoDongItem[];
  atLaoDongList: CoSoKiemTraATLaoDong[];
  treEmList: TreEmHoanCanhDacBiet[];
  teNanList: HoSoPhongChongTeNan[];
  // Dữ liệu Mảng Giáo dục và Đào tạo
  mamNonList: CoSoMamNonTuThuc[];
  truongCongLapList: TruongHocCongLap[];
  phoCapList: SoLieuPhoCapGiaoDuc[];
  khuyenHocList: HoatDongKhuyenHoc[];
  moHinhHocTapList: MoHinhHocTap[];
  lopHocHTCDList: LopHocTrungTamHTCD[];
  hoSoTTHCGiaoDucList: HoSoTTHCGiaoDuc[];
  auditLogs: {
    id: string;
    timestamp: string;
    action: string;
    details: string;
    status: "SUCCESS" | "FAILED" | "WARNING";
  }[];
}

const STORAGE_KEY = "QDM_NCC_APP_STATE_V3";

const initialChiTraData: ChiTraItem[] = [
  {
    id: "CT-202609-001",
    hoSoId: "BD-16720-1",
    soHoSoTinh: "BD/16720-1",
    hoTen: "Phạm Ngọc Dưỡng",
    cccd: "074045001923",
    loaiDoiTuong: "Hồ sơ liệt sĩ",
    loaiCheDo: "HÀNG_THÁNG",
    tenCheDo: "Tiền tuất thân nhân liệt sĩ (1 suất)",
    soTien: 2_055_000,
    hinhThuc: "NGAN_HANG",
    thongTinChiTra: "Vietcombank CN Bình Dương",
    tenNganHang: "Vietcombank",
    soTaiKhoan: "0121000889922",
    phuong: "Bình An",
    huyen: "TP. Dĩ An",
    kyChiTra: "09/2026",
    trangThai: "ĐÃ_CHI_TRẢ",
    ngayChiTra: "05/09/2026",
    maGiaoDich: "UNC-VCB-20260905-0812",
    nguoiNhan: "Phạm Ngọc Dưỡng",
  },
  {
    id: "CT-202609-002",
    hoSoId: "BD-16718-1",
    soHoSoTinh: "BD/16718-1",
    hoTen: "Nguyễn Văn Hạn",
    cccd: "074048002841",
    loaiDoiTuong: "Hồ sơ liệt sĩ",
    loaiCheDo: "HÀNG_THÁNG",
    tenCheDo: "Tiền tuất thân nhân liệt sĩ (1 suất)",
    soTien: 2_055_000,
    hinhThuc: "NGAN_HANG",
    thongTinChiTra: "Agribank Bắc Tân Uyên",
    tenNganHang: "Agribank",
    soTaiKhoan: "5590205128841",
    phuong: "Bình Mỹ",
    huyen: "Bắc Tân Uyên",
    kyChiTra: "09/2026",
    trangThai: "ĐÃ_CHI_TRẢ",
    ngayChiTra: "05/09/2026",
    maGiaoDich: "UNC-AGR-20260905-0922",
    nguoiNhan: "Nguyễn Văn Hạn",
  },
  {
    id: "CT-202609-003",
    hoSoId: "BD-16723-1",
    soHoSoTinh: "BD/16723-1",
    hoTen: "Nguyễn Văn Lý",
    cccd: "074052003344",
    loaiDoiTuong: "Hồ sơ liệt sĩ",
    loaiCheDo: "HÀNG_THÁNG",
    tenCheDo: "Tiền tuất thân nhân liệt sĩ (1 suất)",
    soTien: 2_055_000,
    hinhThuc: "NGAN_HANG",
    thongTinChiTra: "BIDV Nam Bình Dương",
    tenNganHang: "BIDV",
    soTaiKhoan: "65010001889944",
    phuong: "Dĩ An",
    huyen: "TP. Dĩ An",
    kyChiTra: "09/2026",
    trangThai: "ĐÃ_CHI_TRẢ",
    ngayChiTra: "05/09/2026",
    maGiaoDich: "UNC-BIDV-20260905-1102",
    nguoiNhan: "Nguyễn Văn Lý",
  },
  {
    id: "CT-202609-004",
    hoSoId: "BD-16715-1",
    soHoSoTinh: "BD/16715-1",
    hoTen: "Lê Văn Xiêm",
    cccd: "074050004455",
    loaiDoiTuong: "Hồ sơ liệt sĩ",
    loaiCheDo: "HÀNG_THÁNG",
    tenCheDo: "Tiền tuất thân nhân liệt sĩ (1 suất)",
    soTien: 2_055_000,
    hinhThuc: "BUU_DIEN",
    thongTinChiTra: "Điểm Bưu điện Văn hóa Tam Lập",
    phuong: "Tam Lập",
    huyen: "Phú Giáo",
    kyChiTra: "09/2026",
    trangThai: "CHỜ_CHI_TRẢ",
    nguoiNhan: "Lê Văn Xiêm (Trực tiếp)",
  },
  {
    id: "CT-202609-005",
    hoSoId: "BD-16717-1",
    soHoSoTinh: "BD/16717-1",
    hoTen: "Nguyễn Văn Quỳnh",
    cccd: "074047005566",
    loaiDoiTuong: "Hồ sơ liệt sĩ",
    loaiCheDo: "HÀNG_THÁNG",
    tenCheDo: "Tiền tuất thân nhân liệt sĩ (1 suất)",
    soTien: 2_055_000,
    hinhThuc: "NGAN_HANG",
    thongTinChiTra: "VietinBank Bình Dương",
    tenNganHang: "VietinBank",
    soTaiKhoan: "102870192841",
    phuong: "Vĩnh Hòa",
    huyen: "Phú Giáo",
    kyChiTra: "09/2026",
    trangThai: "ĐÃ_CHI_TRẢ",
    ngayChiTra: "05/09/2026",
    maGiaoDich: "UNC-CTG-20260905-1412",
    nguoiNhan: "Nguyễn Văn Quỳnh",
  },
  {
    id: "CT-202609-006",
    hoSoId: "BD-16711-1",
    soHoSoTinh: "BD/16711-1",
    hoTen: "Nguyễn Đình Việt",
    cccd: "074049006677",
    loaiDoiTuong: "Hồ sơ liệt sĩ",
    loaiCheDo: "HÀNG_THÁNG",
    tenCheDo: "Tiền tuất thân nhân liệt sĩ (1 suất)",
    soTien: 2_055_000,
    hinhThuc: "BUU_DIEN",
    thongTinChiTra: "Bưu điện Trung tâm Bến Cát (Phát tận nhà)",
    phuong: "Tân Định",
    huyen: "Bến Cát",
    kyChiTra: "09/2026",
    trangThai: "CHỜ_CHI_TRẢ",
    nguoiNhan: "Nguyễn Đình Việt",
  },
  {
    id: "CT-202609-007",
    hoSoId: "BD-16705-1",
    soHoSoTinh: "BD/16705-1",
    hoTen: "Nguyễn Văn Thành",
    cccd: "074052007788",
    loaiDoiTuong: "Thương binh",
    loaiCheDo: "HÀNG_THÁNG",
    tenCheDo: "Trợ cấp thương binh suy giảm KNLĐ 61%",
    soTien: 5_404_650,
    hinhThuc: "NGAN_HANG",
    thongTinChiTra: "Vietcombank PGD Phú Cường",
    tenNganHang: "Vietcombank",
    soTaiKhoan: "0121000456789",
    phuong: "Phú Cường",
    huyen: "TP. Thủ Dầu Một",
    kyChiTra: "09/2026",
    trangThai: "ĐÃ_CHI_TRẢ",
    ngayChiTra: "05/09/2026",
    maGiaoDich: "UNC-VCB-20260905-1550",
    nguoiNhan: "Nguyễn Văn Thành",
  },
  {
    id: "CT-202609-008",
    hoSoId: "BD-16701-1",
    soHoSoTinh: "BD/16701-1",
    hoTen: "Lê Thị Mai",
    cccd: "074030008899",
    loaiDoiTuong: "Mẹ VNAH",
    loaiCheDo: "HÀNG_THÁNG",
    tenCheDo: "Trợ cấp phụng dưỡng Mẹ VNAH + Phụ cấp phục vụ",
    soTien: 8_220_000,
    hinhThuc: "BUU_DIEN",
    thongTinChiTra: "Bưu điện Thủ Dầu Một (Chi trả tận nhà)",
    phuong: "Định Hòa",
    huyen: "TP. Thủ Dầu Một",
    kyChiTra: "09/2026",
    trangThai: "CHỜ_CHI_TRẢ",
    nguoiNhan: "Lê Thị Mai (Bưu tá phát tận nhà)",
  },
  {
    id: "CT-202607-009",
    hoSoId: "BD-16720-1",
    soHoSoTinh: "BD/16720-1",
    hoTen: "Phạm Ngọc Dưỡng",
    cccd: "074045001923",
    loaiDoiTuong: "Hồ sơ liệt sĩ",
    loaiCheDo: "THỜ_CÚNG_LIỆT_SĨ",
    tenCheDo: "Trợ cấp thờ cúng liệt sĩ năm 2026 (Dịp 27/7)",
    soTien: 1_400_000,
    hinhThuc: "NGAN_HANG",
    thongTinChiTra: "Vietcombank CN Bình Dương",
    tenNganHang: "Vietcombank",
    soTaiKhoan: "0121000889922",
    phuong: "Bình An",
    huyen: "TP. Dĩ An",
    kyChiTra: "07/2026",
    trangThai: "ĐÃ_CHI_TRẢ",
    ngayChiTra: "20/07/2026",
    maGiaoDich: "UNC-VCB-20260720-0012",
    nguoiNhan: "Phạm Ngọc Dưỡng",
  },
  {
    id: "CT-202607-010",
    hoSoId: "BD-16705-1",
    soHoSoTinh: "BD/16705-1",
    hoTen: "Nguyễn Văn Thành",
    cccd: "074052007788",
    loaiDoiTuong: "Thương binh",
    loaiCheDo: "ĐIỀU_DƯỠNG",
    tenCheDo: "Trợ cấp điều dưỡng phục hồi sức khỏe tại nhà năm 2026",
    soTien: 1_849_500,
    hinhThuc: "NGAN_HANG",
    thongTinChiTra: "Vietcombank PGD Phú Cường",
    tenNganHang: "Vietcombank",
    soTaiKhoan: "0121000456789",
    phuong: "Phú Cường",
    huyen: "TP. Thủ Dầu Một",
    kyChiTra: "07/2026",
    trangThai: "ĐÃ_CHI_TRẢ",
    ngayChiTra: "22/07/2026",
    maGiaoDich: "UNC-VCB-20260722-0045",
    nguoiNhan: "Nguyễn Văn Thành",
  },
  {
    id: "CT-202609-011",
    hoSoId: "BD-16709-1",
    soHoSoTinh: "BD/16709-1",
    hoTen: "Trần Văn Bé",
    cccd: "074044001122",
    loaiDoiTuong: "Hồ sơ liệt sĩ",
    loaiCheDo: "HÀNG_THÁNG",
    tenCheDo: "Tiền tuất thân nhân liệt sĩ (1 suất)",
    soTien: 2_055_000,
    hinhThuc: "BUU_DIEN",
    thongTinChiTra: "Điểm Bưu điện Xã An Tây",
    phuong: "An Tây",
    huyen: "Bến Cát",
    kyChiTra: "09/2026",
    trangThai: "CHỜ_CHI_TRẢ",
    nguoiNhan: "Trần Văn Bé",
  },
  {
    id: "CT-202609-012",
    hoSoId: "BD-16707-1",
    soHoSoTinh: "BD/16707-1",
    hoTen: "Võ Văn Đèo",
    cccd: "074043003344",
    loaiDoiTuong: "Hồ sơ liệt sĩ",
    loaiCheDo: "HÀNG_THÁNG",
    tenCheDo: "Tiền tuất thân nhân liệt sĩ (1 suất)",
    soTien: 2_055_000,
    hinhThuc: "NGAN_HANG",
    thongTinChiTra: "Agribank Bến Cát",
    tenNganHang: "Agribank",
    soTaiKhoan: "5590205882314",
    phuong: "Phú An",
    huyen: "Bến Cát",
    kyChiTra: "09/2026",
    trangThai: "ĐÃ_CHI_TRẢ",
    ngayChiTra: "05/09/2026",
    maGiaoDich: "UNC-AGR-20260905-1882",
    nguoiNhan: "Võ Văn Đèo",
  },
];

// Khởi tạo trạng thái ban đầu từ mock data
function getInitialState(): AppState {
  const initialUsers: CurrentUser[] = Object.values(MOCK_USERS);

  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          currentUser: parsed.currentUser || MOCK_USERS.ADMIN_SO,
          usersList: parsed.usersList || initialUsers,
          dungCuChinhHinhList: parsed.dungCuChinhHinhList || initialDungCuChinhHinh,
          moLietSiList: parsed.moLietSiList || initialMoLietSiList,
          baoGiamList: parsed.baoGiamList || initialBaoGiamList,
          canhBaoList: parsed.canhBaoList || initialCanhBaoList,
          cumLoaList: parsed.cumLoaList || initialCumLoaList,
          banTinList: parsed.banTinList || initialBanTinList,
          bangTinList: parsed.bangTinList || initialBangTinList,
          coDongList: parsed.coDongList || initialCoDongList,
          coSoInternetList: parsed.coSoInternetList || initialCoSoInternetList,
          toCNSList: parsed.toCNSList || initialToCNSList,
          baoTroList: parsed.baoTroList || initialBaoTroList,
          cuuTroList: parsed.cuuTroList || initialCuuTroList,
          hoGheoList: parsed.hoGheoList || initialHoGheoList,
          cungCauLaoDongList: parsed.cungCauLaoDongList || initialCungCauLaoDongList,
          atLaoDongList: parsed.atLaoDongList || initialATLaoDongList,
          treEmList: parsed.treEmList || initialTreEmList,
          teNanList: parsed.teNanList || initialTeNanList,
          mamNonList: parsed.mamNonList || initialMamNonList,
          truongCongLapList: parsed.truongCongLapList || initialTruongCongLapList,
          phoCapList: parsed.phoCapList || initialPhoCapList,
          khuyenHocList: parsed.khuyenHocList || initialKhuyenHocList,
          moHinhHocTapList: parsed.moHinhHocTapList || initialMoHinhHocTapList,
          lopHocHTCDList: parsed.lopHocHTCDList || initialLopHocHTCDList,
          hoSoTTHCGiaoDucList: parsed.hoSoTTHCGiaoDucList || initialHoSoTTHCGiaoDucList,
        };
      }
    } catch (e) {
      console.error("Lỗi đọc state từ localStorage:", e);
    }
  }

  // Khởi tạo các quyết định mẫu cho những hồ sơ đã duyệt
  const initialQuyetDinh: QuyetDinhHuong[] = initialHoSoList
    .filter((h) => h.trangThai === "ĐÃ_DUYỆT")
    .map((h, idx) => ({
      quyetDinhId: `QD-${2026000 + idx}`,
      hoSoId: h.id,
      soQuyetDinh: `QĐ-UBND-2026/0${100 + idx}`,
      ngayBanHanh: "15/08/2026",
      ngayHieuLuc: "01/09/2026",
      soTienHangThang: h.mucTroCap,
      phuCapChamSoc: h.phuCapPhucVu,
      tongTien: h.mucTroCap + h.phuCapPhucVu + h.troCapDieuDuong,
      isActive: true,
      canBoPheDuyet: "Hứa Trọng Duy",
    }));

  return {
    currentUser: MOCK_USERS.ADMIN_SO,
    usersList: initialUsers,
    hoSoList: initialHoSoList,
    quyetDinhList: initialQuyetDinh,
    phanHoiList: initialPhanHoiList,
    chiTraList: initialChiTraData,
    dungCuChinhHinhList: initialDungCuChinhHinh,
    moLietSiList: initialMoLietSiList,
    baoGiamList: initialBaoGiamList,
    canhBaoList: initialCanhBaoList,
    cumLoaList: initialCumLoaList,
    banTinList: initialBanTinList,
    bangTinList: initialBangTinList,
    coDongList: initialCoDongList,
    coSoInternetList: initialCoSoInternetList,
    toCNSList: initialToCNSList,
    baoTroList: initialBaoTroList,
    cuuTroList: initialCuuTroList,
    hoGheoList: initialHoGheoList,
    cungCauLaoDongList: initialCungCauLaoDongList,
    atLaoDongList: initialATLaoDongList,
    treEmList: initialTreEmList,
    teNanList: initialTeNanList,
    mamNonList: initialMamNonList,
    truongCongLapList: initialTruongCongLapList,
    phoCapList: initialPhoCapList,
    khuyenHocList: initialKhuyenHocList,
    moHinhHocTapList: initialMoHinhHocTapList,
    lopHocHTCDList: initialLopHocHTCDList,
    hoSoTTHCGiaoDucList: initialHoSoTTHCGiaoDucList,
    auditLogs: [
      {
        id: "LOG-01",
        timestamp: "04/09/2026 18:12",
        action: "Đồng bộ dân cư LGSP",
        details: "Đồng bộ 128 bản ghi từ Trục liên thông LGSP",
        status: "SUCCESS",
      },
      {
        id: "LOG-02",
        timestamp: "04/09/2026 12:40",
        action: "Gửi Zalo ZNS khảo sát",
        details: "Phát hành 64 liên kết khảo sát tới người có công",
        status: "SUCCESS",
      },
    ],
  };
}

let state: AppState = getInitialState();
const listeners = new Set<() => void>();

function notify() {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Lỗi lưu state vào localStorage:", e);
    }
  }
  listeners.forEach((listener) => listener());
}

export const appStore = {
  getState() {
    return state;
  },

  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  /**
   * Tạo mới hồ sơ người có công (Mô phỏng POST /api/v1/profiles)
   * Kiểm tra Zod validation, chống trùng CCCD, sinh mã số quản lý
   */
  createProfile(rawInput: unknown): { success: boolean; message: string; hoSo?: HoSo } {
    // 1. Kiểm tra định dạng đầu vào bằng Zod
    const parseResult = createProfileSchema.safeParse(rawInput);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.errors[0]?.message || "Dữ liệu không hợp lệ";
      return { success: false, message: errorMsg };
    }

    const data: CreateProfileInput = parseResult.data;

    // 2. Kiểm tra trùng lặp CCCD (Yêu cầu TDD Phần 5.1 & Checklist)
    const duplicate = state.hoSoList.find((h) => h.cccd === data.so_cccd);
    if (duplicate) {
      return {
        success: false,
        message: `Số CCCD ${data.so_cccd} đã tồn tại trong hồ sơ ${duplicate.id} (${duplicate.hoTen})!`,
      };
    }

    // 3. Tra cứu tên phường từ ward_id
    const wardName = PHUONG_LIST[data.ward_id - 1] || "Phú Cường";

    // 4. Tính toán mức trợ cấp sơ bộ qua Calculation Engine
    const calc = calculateAllowance({
      maLoaiDt: data.ma_loai_dt,
      tyLeThuongTat: data.ty_le_thuong_tat,
      coNguoiChamSoc: data.co_nguoi_cham_soc,
    });

    // 5. Sinh mã số quản lý tự động (HS-YYYY-XXXXXX) và mã số tỉnh (BD/XXXXX-X)
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const maSoQuanLy = `HS-${new Date().getFullYear()}-${randomSuffix}`;
    const huyenVal = data.huyen || "TP. Thủ Dầu Một";
    const soHoSoTinhVal = data.so_ho_so_tinh?.trim() || `BD/${Math.floor(16000 + Math.random() * 4000)}-1`;
    const soBhytVal = data.so_bhyt?.trim() || `HT2747420${Math.floor(100000 + Math.random() * 900000)}`;

    const newProfile: HoSo = {
      id: maSoQuanLy,
      soHoSoTinh: soHoSoTinhVal,
      hoTen: data.ho_ten,
      cccd: data.so_cccd,
      ngaySinh: data.ngay_sinh,
      namSinh: data.ngay_sinh ? data.ngay_sinh.slice(0, 4) : 1960,
      gioiTinh: data.gioi_tinh === "NAM" ? "Nam" : "Nữ",
      huyen: huyenVal,
      phuong: wardName,
      khuPho: data.khu_pho || "Khu phố 1",
      diaChiTiepNhan: `${wardName} - ${huyenVal}`,
      loaiDoiTuong: data.ma_loai_dt as any,
      banSaoBanGoc: data.ban_sao_ban_goc || "Bản gốc",
      soBhyt: soBhytVal,
      danToc: data.dan_toc || "Kinh",
      tyLeTonThuong: data.ty_le_thuong_tat,
      trangThai: "MỚI_TIẾP_NHẬN",
      ngayTiepNhan: new Date().toLocaleDateString("vi-VN"),
      hanXuLy: "15 ngày làm việc",
      quaHanNgay: 0,
      canBoTiepNhan: "Nguyễn Văn An (Một cửa)",
      canBoQuanLy: "admin",
      mucTroCap: calc.troCapHangThang,
      phuCapPhucVu: calc.phuCapChamSoc,
      troCapDieuDuong: calc.troCapDieuDuong,
      taiLieu: [
        "Bản sao CCCD gắn chip (đã đối soát LGSP)",
        "Đơn đề nghị hưởng chế độ ưu đãi (Mẫu 01)",
        "Biên bản giám định y khoa tỷ lệ thương tật",
      ],
      ghiChuThamDinh: "Hồ sơ mới tạo, đang chờ chuyên viên thẩm định pháp lý.",
    };

    state = {
      ...state,
      hoSoList: [newProfile, ...state.hoSoList],
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toLocaleString("vi-VN"),
          action: "Tạo mới hồ sơ",
          details: `Tạo thành công hồ sơ ${maSoQuanLy} cho ${data.ho_ten} (${data.so_cccd})`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };

    notify();
    return { success: true, message: "Tạo mới hồ sơ thành công", hoSo: newProfile };
  },

  /**
   * Cập nhật trạng thái hồ sơ
   */
  updateProfileStatus(id: string, newStatus: TrangThai, ghiChu?: string) {
    state = {
      ...state,
      hoSoList: state.hoSoList.map((h) =>
        h.id === id
          ? {
            ...h,
            trangThai: newStatus,
            ghiChuThamDinh: ghiChu !== undefined ? ghiChu : h.ghiChuThamDinh,
          }
          : h,
      ),
    };
    notify();
  },

  /**
   * Thẩm định & Phê duyệt hồ sơ - Kiểm soát giao dịch mô phỏng ACID (Phần 2 Luồng 1)
   * 1. Tính toán trợ cấp chính xác qua Spring Boot Engine
   * 2. Insert quyet_dinh_huong
   * 3. Update ho_so_ncc -> ĐÃ_DUYỆT
   */
  approveProfile(hoSoId: string, canBoPheDuyet: string = "Hứa Trọng Duy") {
    const hoSo = state.hoSoList.find((h) => h.id === hoSoId);
    if (!hoSo) {
      return { success: false, message: "Không tìm thấy hồ sơ chỉ định!" };
    }

    try {
      // 1. Gọi Engine tính toán chính xác
      const calc = calculateAllowance({
        maLoaiDt: hoSo.loaiDoiTuong,
        tyLeThuongTat: hoSo.tyLeTonThuong,
        coNguoiChamSoc: hoSo.phuCapPhucVu > 0 || hoSo.tyLeTonThuong >= 81,
      });

      // 2. Tạo Quyết định hưởng trợ cấp
      const now = new Date();
      const soQd = `QĐ-UBND-${now.getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;
      const newQuyetDinh: QuyetDinhHuong = {
        quyetDinhId: `QD-${Date.now()}`,
        hoSoId: hoSo.id,
        soQuyetDinh: soQd,
        ngayBanHanh: now.toLocaleDateString("vi-VN"),
        ngayHieuLuc: `01/${String(now.getMonth() + 2).padStart(2, "0")}/${now.getFullYear()}`,
        soTienHangThang: calc.troCapHangThang,
        phuCapChamSoc: calc.phuCapChamSoc,
        tongTien: calc.tongTienThucNhan,
        isActive: true,
        canBoPheDuyet,
      };

      // 3. Atomically Cập nhật hồ sơ & Lưu quyết định
      state = {
        ...state,
        quyetDinhList: [newQuyetDinh, ...state.quyetDinhList],
        hoSoList: state.hoSoList.map((h) =>
          h.id === hoSoId
            ? {
              ...h,
              trangThai: "ĐÃ_DUYỆT",
              mucTroCap: calc.troCapHangThang,
              phuCapPhucVu: calc.phuCapChamSoc,
              troCapDieuDuong: calc.troCapDieuDuong,
              ghiChuThamDinh: `Đã phê duyệt và ban hành ${soQd}. Tổng tiền hưởng: ${calc.tongTienThucNhan.toLocaleString("vi-VN")}đ/tháng.`,
            }
            : h,
        ),
        auditLogs: [
          {
            id: `LOG-${Date.now()}`,
            timestamp: new Date().toLocaleString("vi-VN"),
            action: "Ban hành Quyết định hưởng",
            details: `Phê duyệt hồ sơ ${hoSoId}, ban hành ${soQd}`,
            status: "SUCCESS",
          },
          ...state.auditLogs,
        ],
      };

      notify();
      return {
        success: true,
        message: `Phê duyệt thành công! Đã ban hành Quyết định số ${soQd}`,
        quyetDinh: newQuyetDinh,
      };
    } catch (err: any) {
      return { success: false, message: `Lỗi giao dịch: ${err.message || "Rollback giao dịch"}` };
    }
  },

  /**
   * Tiếp nhận khảo sát đánh giá công dân (Phần 4.3 & 5.3 TDD)
   * Tự động phân tích cảm xúc sentiment
   */
  submitSurvey(input: SurveySubmissionInput): {
    success: boolean;
    message: string;
    sentimentTag: string;
    khaoSatId: string;
  } {
    const analysis = analyzeSentiment(input.yKienDongGop);
    const khaoSatId = `KS-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPhanHoi: PhanHoi = {
      id: khaoSatId,
      hoSoId: input.hoSoId || "TDM-NCC-2026-00412",
      nguoiDanhGia: input.hoTen || "Công dân ẩn danh",
      phuong: "Phú Cường",
      canBo: "Nguyễn Văn An",
      kenh: input.kenhDanhGia,
      diemCsat: input.diemCsatChung,
      yKien: input.yKienDongGop || "Đánh giá qua cổng Kiosk một cửa",
      sentiment: analysis.sentiment,
      ngay: new Date().toLocaleDateString("vi-VN"),
      daXuLy: analysis.sentiment !== "NEGATIVE",
      tieuChi: input.tieuChi,
    };

    state = {
      ...state,
      phanHoiList: [newPhanHoi, ...state.phanHoiList],
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toLocaleString("vi-VN"),
          action: "Tiếp nhận khảo sát CSAT",
          details: `Phiếu ${khaoSatId} (${input.diemCsatChung} sao, sentiment: ${analysis.sentiment})`,
          status: analysis.sentiment === "NEGATIVE" ? "WARNING" : "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };

    notify();
    return {
      success: true,
      message: "Tiếp nhận khảo sát thành công. Cảm ơn ý kiến của bạn!",
      sentimentTag: analysis.sentiment,
      khaoSatId,
    };
  },

  /**
   * Thực hiện phát tiền cho 1 đối tượng
   */
  thucHienChiTra(id: string): { success: boolean; message: string } {
    const item = state.chiTraList.find((c) => c.id === id);
    if (!item) {
      return { success: false, message: "Không tìm thấy bản ghi chi trả!" };
    }

    const now = new Date();
    const maGd =
      item.hinhThuc === "NGAN_HANG"
        ? `UNC-${(item.tenNganHang || "NH").slice(0, 3).toUpperCase()}-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`
        : `PC-VNPOST-${Math.floor(10000 + Math.random() * 90000)}`;

    state = {
      ...state,
      chiTraList: state.chiTraList.map((c) =>
        c.id === id
          ? {
            ...c,
            trangThai: "ĐÃ_CHI_TRẢ",
            ngayChiTra: now.toLocaleDateString("vi-VN"),
            maGiaoDich: maGd,
          }
          : c,
      ),
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toLocaleString("vi-VN"),
          action: "Chi trả trợ cấp",
          details: `Phát tiền thành công cho ${item.hoTen} (${item.soTien.toLocaleString("vi-VN")}đ) qua ${item.hinhThuc === "NGAN_HANG" ? "Ngân hàng" : "Bưu điện"}. Mã GD: ${maGd}`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };

    notify();
    return {
      success: true,
      message: `Phát tiền thành công cho ${item.hoTen} (${item.soTien.toLocaleString("vi-VN")}đ)!`,
    };
  },

  /**
   * Phát tiền hàng loạt (Batch Payout)
   */
  phatTienHangLoat(ids: string[]): { success: boolean; count: number; message: string } {
    if (ids.length === 0) {
      return { success: false, count: 0, message: "Chưa chọn bản ghi nào!" };
    }

    const now = new Date();
    let updatedCount = 0;

    state = {
      ...state,
      chiTraList: state.chiTraList.map((c) => {
        if (ids.includes(c.id) && c.trangThai !== "ĐÃ_CHI_TRẢ") {
          updatedCount++;
          const maGd =
            c.hinhThuc === "NGAN_HANG"
              ? `UNC-BATCH-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`
              : `PC-VNPOST-BATCH-${Math.floor(10000 + Math.random() * 90000)}`;
          return {
            ...c,
            trangThai: "ĐÃ_CHI_TRẢ",
            ngayChiTra: now.toLocaleDateString("vi-VN"),
            maGiaoDich: maGd,
          };
        }
        return c;
      }),
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toLocaleString("vi-VN"),
          action: "Phát tiền hàng loạt (Batch Payout)",
          details: `Thực hiện giải ngân đồng loạt cho ${updatedCount} đối tượng người có công`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };

    notify();
    return {
      success: true,
      count: updatedCount,
      message: `Đã phát tiền thành công cho ${updatedCount} đối tượng!`,
    };
  },

  /**
   * Đăng nhập với vai trò hoặc ID tài khoản
   */
  login(roleOrId: string, _credentials?: { username?: string; password?: string }) {
    const mockDict = MOCK_USERS as Record<string, CurrentUser>;
    const foundUser: CurrentUser | undefined =
      mockDict[roleOrId] ||
      state.usersList.find((u) => u.id === roleOrId || u.username === roleOrId || u.role === roleOrId);
    const user: CurrentUser = foundUser || MOCK_USERS.ADMIN_SO;
    const now = new Date();
    state = {
      ...state,
      currentUser: user,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toLocaleString("vi-VN"),
          action: `Đăng nhập (${user.roleName})`,
          details: `Cán bộ ${user.fullName} (${user.title}) đăng nhập thành công vào phiên làm việc`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };
    notify();
    return user;
  },

  /**
   * Chuyển đổi nhanh vai trò / tài khoản
   */
  switchRole(role: string) {
    return this.login(role);
  },

  /**
   * Chuyển đổi tài khoản người dùng theo User ID
   */
  switchUser(userId: string) {
    const targetUser = state.usersList.find((u) => u.id === userId) || MOCK_USERS[userId];
    if (targetUser) {
      state = {
        ...state,
        currentUser: targetUser,
      };
      notify();
      return targetUser;
    }
    return state.currentUser;
  },

  /**
   * Cập nhật danh sách mảng nghiệp vụ được cấp quyền cho tài khoản
   */
  updateUserDomains(userId: string, assignedDomains: DomainCode[], permissions?: string[]) {
    const updatedUsers = state.usersList.map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          assignedDomains,
          permissions: permissions || u.permissions,
        };
      }
      return u;
    });

    // Cập nhật cả currentUser nếu đang đăng nhập đúng tài khoản này
    const updatedCurrent = state.currentUser.id === userId
      ? { ...state.currentUser, assignedDomains, permissions: permissions || state.currentUser.permissions }
      : state.currentUser;

    state = {
      ...state,
      usersList: updatedUsers,
      currentUser: updatedCurrent,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toLocaleString("vi-VN"),
          action: "Cập nhật phân quyền mảng nghiệp vụ",
          details: `Cập nhật cấp quyền mảng cho tài khoản ID: ${userId} -> [${assignedDomains.join(", ")}]`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };
    notify();
  },

  /**
   * Tạo tài khoản cán bộ mới
   */
  addUser(newUser: CurrentUser) {
    state = {
      ...state,
      usersList: [newUser, ...state.usersList],
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toLocaleString("vi-VN"),
          action: "Thêm tài khoản cán bộ",
          details: `Thêm tài khoản mới: ${newUser.fullName} (${newUser.title}) - Quyền: [${newUser.assignedDomains.join(", ")}]`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };
    notify();
  },

  /**
   * Cập nhật thông tin tài khoản
   */
  updateUser(userId: string, data: Partial<CurrentUser>) {
    const updatedList = state.usersList.map((u) => (u.id === userId ? { ...u, ...data } : u));
    const updatedCurrent = state.currentUser.id === userId ? { ...state.currentUser, ...data } : state.currentUser;

    state = {
      ...state,
      usersList: updatedList,
      currentUser: updatedCurrent,
    };
    notify();
  },

  /**
   * Xóa tài khoản cán bộ
   */
  deleteUser(userId: string) {
    if (state.currentUser.id === userId) {
      // Không cho phép tự xóa tài khoản đang đăng nhập
      return false;
    }
    state = {
      ...state,
      usersList: state.usersList.filter((u) => u.id !== userId),
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toLocaleString("vi-VN"),
          action: "Xóa tài khoản cán bộ",
          details: `Đã thu hồi & xóa tài khoản ID: ${userId}`,
          status: "WARNING",
        },
        ...state.auditLogs,
      ],
    };
    notify();
    return true;
  },

  // ==========================================================================
  // CÁC HÀM NGHIỆP VỤ MẢNG 1: THÔNG TIN, TRUYỀN THÔNG & CHUYỂN ĐỔI SỐ
  // ==========================================================================
  toggleCumLoa(loaId: string) {
    const updated = state.cumLoaList.map((l) => {
      if (l.id === loaId) {
        const nextStatus = l.trangThai === "DANG_PHAT" ? "HOAT_DONG" : "DANG_PHAT";
        return { ...l, trangThai: nextStatus as any, lanCapNhatCuoi: new Date().toLocaleString("vi-VN") };
      }
      return l;
    });
    state = { ...state, cumLoaList: updated };
    notify();
  },

  addBanTin(banTin: BanTinTruyenThanh) {
    state = { ...state, banTinList: [banTin, ...state.banTinList] };
    notify();
  },

  duyetBanTin(id: string) {
    const updated = state.banTinList.map((b) => (b.id === id ? { ...b, trangThai: "CHO_PHAT" as const } : b));
    state = { ...state, banTinList: updated };
    notify();
  },

  updateBangTinLED(id: string, noiDungHienTai: string) {
    const updated = state.bangTinList.map((b) => (b.id === id ? { ...b, noiDungHienTai } : b));
    state = { ...state, bangTinList: updated };
    notify();
  },

  addCoDongItem(item: CoDongTrucQuanItem) {
    state = { ...state, coDongList: [item, ...state.coDongList] };
    notify();
  },

  addCoSoInternet(item: CoSoInternetBuuChinh) {
    state = { ...state, coSoInternetList: [item, ...state.coSoInternetList] };
    notify();
  },

  // ==========================================================================
  // CÁC HÀM NGHIỆP VỤ MẢNG 2: LAO ĐỘNG, NGƯỜI CÓ CÔNG & AN SINH XÃ HỘI
  // ==========================================================================
  addBaoTroItem(item: DoiTuongBaoTroXaHoi) {
    state = { ...state, baoTroList: [item, ...state.baoTroList] };
    notify();
  },

  addCuuTroDotXuat(item: HoSoCuuTroDotXuat) {
    state = { ...state, cuuTroList: [item, ...state.cuuTroList] };
    notify();
  },

  duyetCuuTroDotXuat(id: string) {
    const updated = state.cuuTroList.map((c) =>
      c.id === id ? { ...c, trangThai: "DA_CHI_TRA" as const, ngayPheDuyet: new Date().toLocaleDateString("vi-VN") } : c
    );
    state = { ...state, cuuTroList: updated };
    notify();
  },

  addHoGheo(item: HoGheoCanGheoItem) {
    state = { ...state, hoGheoList: [item, ...state.hoGheoList] };
    notify();
  },

  addCungCauLaoDong(item: CungCauLaoDongItem) {
    state = { ...state, cungCauLaoDongList: [item, ...state.cungCauLaoDongList] };
    notify();
  },

  addATLaoDong(item: CoSoKiemTraATLaoDong) {
    state = { ...state, atLaoDongList: [item, ...state.atLaoDongList] };
    notify();
  },

  addTreEm(item: TreEmHoanCanhDacBiet) {
    state = { ...state, treEmList: [item, ...state.treEmList] };
    notify();
  },

  addTeNan(item: HoSoPhongChongTeNan) {
    state = { ...state, teNanList: [item, ...state.teNanList] };
    notify();
  },

  // ==========================================================================
  // CÁC HÀM NGHIỆP VỤ MẢNG 3: GIÁO DỤC VÀ ĐÀO TẠO CƠ SỞ
  // ==========================================================================
  addMamNonTuThuc(item: CoSoMamNonTuThuc) {
    state = { ...state, mamNonList: [item, ...state.mamNonList] };
    notify();
  },

  updateKiemTraMamNon(id: string, ketQua: CoSoMamNonTuThuc["ketQuaKiemTraCuoi"], noiDung: string) {
    const updated = state.mamNonList.map((m) =>
      m.id === id
        ? {
            ...m,
            ketQuaKiemTraCuoi: ketQua,
            noiDungKiemTra: noiDung,
            ngayKiemTraCuoi: new Date().toLocaleDateString("vi-VN"),
          }
        : m
    );
    state = { ...state, mamNonList: updated };
    notify();
  },

  dinhChiCoSoMamNon(id: string, lyDo: string, thoiHanThang: number = 3) {
    const now = new Date();
    const soQD = `QĐ-ĐC-${Math.floor(10 + Math.random() * 90)}/2026/UBND`;
    const updated = state.mamNonList.map((m) =>
      m.id === id
        ? {
            ...m,
            ketQuaKiemTraCuoi: "TAM_DINH_CHI" as const,
            noiDungKiemTra: `[ĐÃ BAN HÀNH QUYẾT ĐỊNH ĐÌNH CHỈ HOẠT ĐỘNG ${thoiHanThang} THÁNG] Số QĐ: ${soQD} ngày ${now.toLocaleDateString("vi-VN")}. Lý do: ${lyDo}`,
            ngayKiemTraCuoi: now.toLocaleDateString("vi-VN"),
          }
        : m
    );
    state = {
      ...state,
      mamNonList: updated,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toLocaleString("vi-VN"),
          action: "Ban hành QĐ tạm đình chỉ cơ sở mầm non vi phạm",
          details: `Đình chỉ hoạt động cơ sở ${id} trong ${thoiHanThang} tháng. Số QĐ: ${soQD}. Lý do: ${lyDo}`,
          status: "WARNING",
        },
        ...state.auditLogs,
      ],
    };
    notify();
    return soQD;
  },

  phucHoiCoSoMamNon(id: string, noiDungKiemTraLai: string) {
    const now = new Date();
    const updated = state.mamNonList.map((m) =>
      m.id === id
        ? {
            ...m,
            ketQuaKiemTraCuoi: "DAT_CHUAN_AN_TOAN" as const,
            noiDungKiemTra: `[ĐÃ PHỤC HỒI HOẠT ĐỘNG NGÀY ${now.toLocaleDateString("vi-VN")}] Kết quả kiểm tra lại: ${noiDungKiemTraLai}`,
            ngayKiemTraCuoi: now.toLocaleDateString("vi-VN"),
          }
        : m
    );
    state = {
      ...state,
      mamNonList: updated,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toLocaleString("vi-VN"),
          action: "Phục hồi hoạt động cơ sở mầm non sau khắc phục",
          details: `Cho phép cơ sở ${id} hoạt động trở lại sau khi đoàn liên ngành kiểm tra đạt chuẩn an toàn.`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };
    notify();
  },

  addKhuyenHoc(item: HoatDongKhuyenHoc) {
    state = { ...state, khuyenHocList: [item, ...state.khuyenHocList] };
    notify();
  },

  addLopHocHTCD(item: LopHocTrungTamHTCD) {
    state = { ...state, lopHocHTCDList: [item, ...state.lopHocHTCDList] };
    notify();
  },

  updateMoHinhHocTap(id: string, soDatChuan: number) {
    state = {
      ...state,
      moHinhHocTapList: state.moHinhHocTapList.map((m) =>
        m.id === id
          ? {
              ...m,
              soDatChuan,
              tyLePercent: Number(((soDatChuan / m.soDangKy) * 100).toFixed(1)),
            }
          : m
      ),
    };
    notify();
  },

  updateTruongCongLap(id: string, updates: Partial<TruongHocCongLap>) {
    state = {
      ...state,
      truongCongLapList: state.truongCongLapList.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    };
    notify();
  },

  // ==========================================================================
  // QUY TRÌNH GIẢI QUYẾT GIẤY TỜ & THỦ TỤC HÀNH CHÍNH GIÁO DỤC (MỘT CỬA)
  // ==========================================================================
  addHoSoTTHCGiaoDuc(item: HoSoTTHCGiaoDuc) {
    const now = new Date();
    state = {
      ...state,
      hoSoTTHCGiaoDucList: [item, ...state.hoSoTTHCGiaoDucList],
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toLocaleString("vi-VN"),
          action: "Tiếp nhận hồ sơ TTHC Giáo dục",
          details: `Tiếp nhận hồ sơ ${item.maHoSo}: ${item.tenThuTuc} cho ${item.nguoiNop} (${item.tenCoSoDeNghi})`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };
    notify();
  },

  updateHoSoTTHCGiaoDucStatus(
    hoSoId: string,
    trangThai: TrangThaiHoSoGD,
    extra?: Partial<HoSoTTHCGiaoDuc>
  ) {
    const now = new Date();
    const updated = state.hoSoTTHCGiaoDucList.map((h) => {
      if (h.id === hoSoId) {
        return {
          ...h,
          ...extra,
          trangThai,
        };
      }
      return h;
    });

    state = {
      ...state,
      hoSoTTHCGiaoDucList: updated,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toLocaleString("vi-VN"),
          action: "Cập nhật tiến độ hồ sơ TTHC Giáo dục",
          details: `Hồ sơ ${hoSoId} chuyển sang trạng thái: ${trangThai}`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };
    notify();
  },

  phatHanhYeuCauBoSung(hoSoId: string, lyDo: string, hanBoSung: string) {
    const now = new Date();
    const updated = state.hoSoTTHCGiaoDucList.map((h) => {
      if (h.id === hoSoId) {
        return {
          ...h,
          trangThai: "YEU_CAU_BO_SUNG" as const,
          lyDoBoSung: lyDo,
          hanBoSung,
        };
      }
      return h;
    });

    state = {
      ...state,
      hoSoTTHCGiaoDucList: updated,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toLocaleString("vi-VN"),
          action: "Phát hành Phiếu yêu cầu bổ sung hồ sơ TTHC",
          details: `Phát hành Mẫu 02 cho hồ sơ ${hoSoId}. Hạn bổ sung: ${hanBoSung}`,
          status: "WARNING",
        },
        ...state.auditLogs,
      ],
    };
    notify();
  },

  luuBienBanThucDia(hoSoId: string, data: NonNullable<HoSoTTHCGiaoDuc["ketQuaThucDia"]>) {
    const now = new Date();
    const updated = state.hoSoTTHCGiaoDucList.map((h) => {
      if (h.id === hoSoId) {
        return {
          ...h,
          ketQuaThucDia: data,
          trangThai: (data.ketLuan === "DAT_YEU_CAU" ? "CHO_PHE_DUYET" : "YEU_CAU_BO_SUNG") as TrangThaiHoSoGD,
        };
      }
      return h;
    });

    state = {
      ...state,
      hoSoTTHCGiaoDucList: updated,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toLocaleString("vi-VN"),
          action: "Lập Biên bản kiểm tra thẩm định thực địa liên ngành",
          details: `Biên bản số ${data.bienBanSo} cho hồ sơ ${hoSoId}. Kết luận: ${data.ketLuan}`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };
    notify();
  },

  soanToTrinhPheDuyet(hoSoId: string, data: NonNullable<HoSoTTHCGiaoDuc["toTrinh"]>) {
    const now = new Date();
    const updated = state.hoSoTTHCGiaoDucList.map((h) => {
      if (h.id === hoSoId) {
        return {
          ...h,
          toTrinh: data,
          trangThai: "CHO_PHE_DUYET" as const,
        };
      }
      return h;
    });

    state = {
      ...state,
      hoSoTTHCGiaoDucList: updated,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toLocaleString("vi-VN"),
          action: "Soạn Tờ trình trình Lãnh đạo UBND Phường",
          details: `Tờ trình số ${data.soToTrinh} - ${data.noiDungTrinh}`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };
    notify();
  },

  kySoQuyetDinhGiaoDuc(hoSoId: string, nguoiKy?: string, chucVu?: string) {
    const signer = nguoiKy || "TS. Nguyễn Văn Hùng";
    const title = chucVu || "Chủ tịch UBND Phường Phú Cường";
    const now = new Date();
    const maXacThuc = `SHA256:${Math.random().toString(36).substring(2, 8).toUpperCase()}-UBND-GD-${Date.now().toString(36).toUpperCase()}`;

    let tenCoSoMoi = "";
    let chuCoSoMoi = "";
    let diaChiMoi = "";
    let khuPhoMoi = "";
    let soQDMoi = "";
    let sdtMoi = "";

    const updated = state.hoSoTTHCGiaoDucList.map((h) => {
      if (h.id === hoSoId) {
        soQDMoi = h.quyetDinh?.soQuyetDinh || `${Math.floor(150 + Math.random() * 50)}/QĐ-UBND`;
        tenCoSoMoi = h.tenCoSoDeNghi;
        chuCoSoMoi = h.nguoiNop;
        diaChiMoi = h.diaDiemCoSo;
        khuPhoMoi = h.khuPho;
        sdtMoi = h.soDienThoai;

        return {
          ...h,
          trangThai: "DA_PHE_DUYET" as const,
          quyetDinh: {
            soQuyetDinh: soQDMoi,
            ngayBanHanh: now.toLocaleDateString("vi-VN"),
            nguoiKy: signer,
            chucVu: title,
            maXacThucKySo: maXacThuc,
            noiDungQuyetDinh: `Cho phép thành lập ${h.tenCoSoDeNghi} tại ${h.diaDiemCoSo}, do ${h.nguoiNop} làm chủ cơ sở.`,
            daKySo: true,
          },
        };
      }
      return h;
    });

    // Nếu hồ sơ là thành lập mầm non, tự động bổ sung vào danh sách mamNonList nếu chưa có
    let newMamNonList = state.mamNonList;
    if (tenCoSoMoi && !state.mamNonList.some((m) => m.tenCoSo.toLowerCase() === tenCoSoMoi.toLowerCase())) {
      newMamNonList = [
        {
          id: `MN-${Math.floor(10 + Math.random() * 90)}`,
          maCoSo: `MN-TT-${Math.floor(100 + Math.random() * 900)}`,
          tenCoSo: tenCoSoMoi,
          loaiHinh: tenCoSoMoi.toLowerCase().includes("lớp") ? "LOP_MAU_GIAO_DOC_LAP" : "NHOM_TRE_DOC_LAP",
          chuCoSo: chuCoSoMoi,
          nguoiPhuTrachChuyenMon: chuCoSoMoi,
          diaChi: diaChiMoi,
          khuPho: khuPhoMoi,
          soDienThoai: sdtMoi,
          soQuyetDinhCapPhep: soQDMoi,
          ngayCapPhep: now.toLocaleDateString("vi-VN"),
          soTreDangGiu: 25,
          soGiaoVienBaoMau: 4,
          dienTichPhongHocM2: 120,
          coCameraGiamSat: true,
          bepAnMotChieu: true,
          ketQuaKiemTraCuoi: "DAT_CHUAN_AN_TOAN",
          ngayKiemTraCuoi: now.toLocaleDateString("vi-VN"),
          noiDungKiemTra: `Cơ sở mới thành lập theo Quyết định ${soQDMoi} ngày ${now.toLocaleDateString("vi-VN")} của UBND Phường.`,
        },
        ...state.mamNonList,
      ];
    }

    state = {
      ...state,
      hoSoTTHCGiaoDucList: updated,
      mamNonList: newMamNonList,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toLocaleString("vi-VN"),
          action: "Ký số điện tử Quyết định phê duyệt TTHC Giáo dục",
          details: `Lãnh đạo ${signer} (${title}) ký số ban hành Quyết định ${soQDMoi} cho hồ sơ ${hoSoId}. Mã xác thực: ${maXacThuc}`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };

    notify();
    return { signer, title, ngayKy: now.toLocaleString("vi-VN"), maXacThuc, soQuyetDinh: soQDMoi };
  },

  phatHanhPhieuXinLoi(hoSoId: string, lyDo: string, ngayHenMoi: string) {
    const now = new Date();
    const soPhieu = `${Math.floor(10 + Math.random() * 90)}/PXL-UBND`;
    const updated = state.hoSoTTHCGiaoDucList.map((h) => {
      if (h.id === hoSoId) {
        return {
          ...h,
          ngayHenTra: ngayHenMoi,
          phieuXinLoi: {
            soPhieu,
            ngayLap: now.toLocaleDateString("vi-VN"),
            lyDo,
            ngayHenMoi,
            nguoiKy: "TS. Nguyễn Văn Hùng",
            chucVu: "Chủ tịch UBND Phường Phú Cường",
          },
        };
      }
      return h;
    });

    state = {
      ...state,
      hoSoTTHCGiaoDucList: updated,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toLocaleString("vi-VN"),
          action: "Phát hành Phiếu xin lỗi và gia hạn trả kết quả TTHC",
          details: `Phát hành Mẫu 04 cho hồ sơ ${hoSoId}. Hẹn trả mới: ${ngayHenMoi}. Lý do: ${lyDo}`,
          status: "WARNING",
        },
        ...state.auditLogs,
      ],
    };

    notify();
    return { soPhieu, ngayHenMoi };
  },

  /**
   * Đăng xuất khỏi phiên làm việc an toàn
   */
  logout() {
    const now = new Date();
    const prevUser = state.currentUser;
    state = {
      ...state,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toLocaleString("vi-VN"),
          action: "Đăng xuất hệ thống",
          details: `Cán bộ ${prevUser.fullName} (${prevUser.title}) đã kết thúc phiên làm việc`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };
    notify();
  },

  /**
   * Báo giảm đối tượng từ trần & Sinh Quyết định Mai táng phí (Mẫu số 02 - NĐ 131/2021)
   */
  baoGiamTuTran(input: {
    hoSoId: string;
    ngayTuTran: string;
    noiTuTran: string;
    soTrichLucKhaiTu: string;
    ngayCapKhaiTu: string;
    noiCapKhaiTu: string;
    nguoiKhaiBao: string;
    quanHeVoiNguoiMat: string;
    soCccdNguoiKhai: string;
    soDienThoaiNguoiKhai: string;
    diaChiNguoiKhai: string;
  }) {
    const hoSo = state.hoSoList.find((h) => h.id === input.hoSoId);
    if (!hoSo) {
      throw new Error(`Không tìm thấy hồ sơ với mã ${input.hoSoId}`);
    }

    const soTienMaiTangPhi = 10 * MUC_CHUAN; // 20.550.000 VNĐ
    const troCapMotLan = hoSo.mucTroCap * 3; // 3 tháng trợ cấp (nếu có)
    const now = new Date();
    const ngayQuyetDinh = now.toLocaleDateString("vi-VN");
    const soQuyetDinhMaiTang = `QĐ-UBND/${now.getFullYear()}-MTP-${Math.floor(100 + Math.random() * 900)}`;

    // 1. Cập nhật trạng thái hồ sơ
    const updatedHoSoList = state.hoSoList.map((h) => {
      if (h.id === input.hoSoId) {
        return {
          ...h,
          isTuTran: true,
          ngayTuTran: input.ngayTuTran,
          soTrichLucKhaiTu: input.soTrichLucKhaiTu,
          nguoiNhanMaiTangPhi: input.nguoiKhaiBao,
          soTienMaiTangPhi,
          ngayQuyetDinhMaiTang: ngayQuyetDinh,
          ghiChuThamDinh: `[ĐÃ BÁO GIẢM TỪ TRẦN] Ngày mất: ${input.ngayTuTran}. Trích lục khai tử: ${input.soTrichLucKhaiTu}`,
        };
      }
      return h;
    });

    // 2. Thêm vào danh sách báo giảm mai táng phí
    const newBaoGiamItem: BaoGiamItem = {
      id: `BG-${now.getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      hoSoId: hoSo.id,
      soHoSoTinh: hoSo.soHoSoTinh || hoSo.id,
      hoTen: hoSo.hoTen,
      cccd: hoSo.cccd,
      loaiDoiTuong: hoSo.loaiDoiTuong,
      phuong: hoSo.phuong,
      huyen: hoSo.huyen || "TP. Thủ Dầu Một",
      ngayTuTran: input.ngayTuTran,
      noiTuTran: input.noiTuTran,
      soTrichLucKhaiTu: input.soTrichLucKhaiTu,
      ngayCapKhaiTu: input.ngayCapKhaiTu,
      noiCapKhaiTu: input.noiCapKhaiTu,
      nguoiKhaiBao: input.nguoiKhaiBao,
      quanHeVoiNguoiMat: input.quanHeVoiNguoiMat,
      soCccdNguoiKhai: input.soCccdNguoiKhai,
      soDienThoaiNguoiKhai: input.soDienThoaiNguoiKhai,
      diaChiNguoiKhai: input.diaChiNguoiKhai,
      soQuyetDinhMaiTang,
      ngayQuyetDinh,
      soTienMaiTangPhi,
      troCapMotLan,
      trangThai: "ĐÃ_BAN_HÀNH_QĐ",
      daNgungChiTraHangThang: true,
      canBoThuLy: state.currentUser.fullName,
    };

    // 3. Tự động chuyển các khoản chi chưa phát sang trạng thái ngừng do từ trần
    const updatedChiTraList = state.chiTraList.map((c) => {
      if (c.hoSoId === hoSo.id && c.trangThai === "CHỜ_CHI_TRẢ") {
        return {
          ...c,
          trangThai: "TỒN_ĐỌNG" as const,
          thongTinChiTra: `${c.thongTinChiTra} (TẠM NGỪNG: Đối tượng đã từ trần ngày ${input.ngayTuTran})`,
        };
      }
      return c;
    });

    state = {
      ...state,
      hoSoList: updatedHoSoList,
      baoGiamList: [newBaoGiamItem, ...state.baoGiamList],
      chiTraList: updatedChiTraList,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toLocaleString("vi-VN"),
          action: "Báo giảm từ trần & Ban hành QĐ Mai táng phí",
          details: `Hoàn tất thủ tục báo giảm cho ${hoSo.hoTen} (${hoSo.soHoSoTinh || hoSo.id}), ban hành ${soQuyetDinhMaiTang} chi trả mai táng phí ${soTienMaiTangPhi.toLocaleString("vi-VN")}đ`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };

    notify();
    return newBaoGiamItem;
  },

  /**
   * Cấp mới hoặc gia hạn phương tiện trợ giúp / Dụng cụ chỉnh hình (NĐ 131/2021)
   */
  capDungCuChinhHinh(input: {
    id?: string;
    hoSoId: string;
    soHoSoTinh: string;
    hoTen: string;
    cccd: string;
    loaiDoiTuong: string;
    phuong: string;
    huyen: string;
    tenDungCu: string;
    loaiDungCu: "CHÂN_GIẢ" | "TAY_GIẢ" | "XE_LĂN" | "XE_LẮC" | "MÁY_TRỢ_THÍNH" | "KHÁC";
    nienHanNam: number;
    dinhMucTien: number;
    tienBoiDuongPhucHoi: number;
  }) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const ngayCapMoi = now.toLocaleDateString("vi-VN");
    const soQuyetDinhCap = `QĐ-SLĐTBXH/${currentYear}-${Math.floor(100 + Math.random() * 900)}`;

    let updatedList: DungCuChinhHinhItem[];

    if (input.id) {
      updatedList = state.dungCuChinhHinhList.map((item) => {
        if (item.id === input.id) {
          return {
            ...item,
            ...input,
            namCapGanNhat: currentYear,
            namDenHanCapMoi: currentYear + input.nienHanNam,
            trangThai: "ĐÃ_CẤP" as const,
            ngayCapMoi,
            soQuyetDinhCap,
            canBoTheoDoi: state.currentUser.fullName,
          };
        }
        return item;
      });
    } else {
      const newItem: DungCuChinhHinhItem = {
        id: `DC-${currentYear}-${Math.floor(100 + Math.random() * 900)}`,
        ...input,
        namCapGanNhat: currentYear,
        namDenHanCapMoi: currentYear + input.nienHanNam,
        trangThai: "ĐÃ_CẤP",
        ngayCapMoi,
        soQuyetDinhCap,
        canBoTheoDoi: state.currentUser.fullName,
      };
      updatedList = [newItem, ...state.dungCuChinhHinhList];
    }

    state = {
      ...state,
      dungCuChinhHinhList: updatedList,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toLocaleString("vi-VN"),
          action: "Cấp phương tiện trợ giúp & Dụng cụ chỉnh hình",
          details: `Cấp ${input.tenDungCu} cho đối tượng ${input.hoTen}, định mức: ${input.dinhMucTien.toLocaleString("vi-VN")}đ, niên hạn: ${input.nienHanNam} năm`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };

    notify();
    return true;
  },

  /**
   * Đối soát tự động dữ liệu chi trả từ Ngân hàng / Bưu điện
   */
  doiSoatGiaoDichNganHang(records: {
    maGiaoDich: string;
    soHoSoTinh?: string;
    cccd?: string;
    soTien: number;
    trangThai: "THÀNH_CÔNG" | "THẤT_BẠI";
    lyDoLoi?: string;
  }[]) {
    let successCount = 0;
    let failCount = 0;
    let totalSuccessAmount = 0;
    let totalFailAmount = 0;
    const now = new Date();

    const updatedChiTraList = state.chiTraList.map((item) => {
      const matched = records.find(
        (r) =>
          (r.soHoSoTinh && r.soHoSoTinh === item.soHoSoTinh) ||
          (r.cccd && r.cccd === item.cccd) ||
          (r.maGiaoDich && r.maGiaoDich === item.maGiaoDich)
      );

      if (matched) {
        if (matched.trangThai === "THÀNH_CÔNG") {
          successCount++;
          totalSuccessAmount += item.soTien;
          return {
            ...item,
            trangThai: "ĐÃ_CHI_TRẢ" as const,
            ngayChiTra: now.toLocaleDateString("vi-VN"),
            maGiaoDich: matched.maGiaoDich || item.maGiaoDich || `UNC-${Date.now()}`,
          };
        } else {
          failCount++;
          totalFailAmount += item.soTien;
          return {
            ...item,
            trangThai: "TỒN_ĐỌNG" as const,
            thongTinChiTra: `${item.thongTinChiTra} [LỖI ĐỐI SOÁT: ${matched.lyDoLoi || "Tài khoản không hợp lệ"}]`,
          };
        }
      }
      return item;
    });

    state = {
      ...state,
      chiTraList: updatedChiTraList,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toLocaleString("vi-VN"),
          action: "Đối soát tự động Ngân hàng (Bank Reconciliation)",
          details: `Xử lý ${records.length} giao dịch: ${successCount} thành công (${totalSuccessAmount.toLocaleString("vi-VN")}đ), ${failCount} thất bại/tồn đọng (${totalFailAmount.toLocaleString("vi-VN")}đ)`,
          status: failCount > 0 ? "WARNING" : "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };

    notify();
    return {
      total: records.length,
      successCount,
      failCount,
      totalSuccessAmount,
      totalFailAmount,
    };
  },

  /**
   * Thắp nén hương / Dâng hoa tưởng niệm mộ liệt sĩ trên bản đồ số
   */
  thapHuongMoLietSi(moId: string) {
    const updated = state.moLietSiList.map((m) => {
      if (m.id === moId) {
        return {
          ...m,
          luotThapHuong: m.luotThapHuong + 1,
        };
      }
      return m;
    });
    state = {
      ...state,
      moLietSiList: updated,
    };
    notify();
  },

  /**
   * Ký số điện tử lãnh đạo (SmartCA / PKI Token)
   */
  kySoHoSo(hoSoId: string, nguoiKy?: string, chucVu?: string) {
    const signer = nguoiKy || state.currentUser.fullName;
    const title = chucVu || state.currentUser.title;
    const now = new Date();
    const maXacThuc = `SHA256:${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

    const updated = state.hoSoList.map((h) => {
      if (h.id === hoSoId) {
        return {
          ...h,
          kySoLanhDao: {
            nguoiKy: signer,
            chucVu: title,
            ngayKy: now.toLocaleString("vi-VN"),
            maXacThuc,
          },
        };
      }
      return h;
    });

    state = {
      ...state,
      hoSoList: updated,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toLocaleString("vi-VN"),
          action: "Ký số điện tử công vụ (SmartCA)",
          details: `Lãnh đạo ${signer} ký số điện tử phê duyệt hồ sơ ${hoSoId}. Mã xác thực: ${maXacThuc}`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };

    notify();
    return { signer, title, ngayKy: now.toLocaleString("vi-VN"), maXacThuc };
  },

  /**
   * Xử lý cảnh báo rủi ro / gian lận chính sách
   */
  xuLyCanhBao(canhBaoId: string) {
    const now = new Date();
    const updated = state.canhBaoList.map((cb) => {
      if (cb.id === canhBaoId) {
        return {
          ...cb,
          trangThai: "ĐÃ_XỬ_LÝ" as const,
        };
      }
      return cb;
    });

    state = {
      ...state,
      canhBaoList: updated,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toLocaleString("vi-VN"),
          action: "Xử lý cảnh báo rủi ro chính sách",
          details: `Đã xác nhận xử lý xong cảnh báo mã ${canhBaoId}`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };

    notify();
  },

  /**
   * Khôi phục lại dữ liệu mẫu gốc
   */
  resetToDefault() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
    state = getInitialState();
    notify();
  },
};

/**
 * React Hook sử dụng state toàn cục
 */
export function useAppState() {
  return useSyncExternalStore(appStore.subscribe, appStore.getState, getInitialState);
}
