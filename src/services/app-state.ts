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
  type HoSoTTHCAnSinhItem,
  initialHoSoTTHCAnSinhList,
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
  type GiaDinhVanHoaItem,
  type KhuPhoVanHoaItem,
  type DiTichLeHoiItem,
  type CoSoTonGiaoItem,
  type CoSoDichVuVanHoaItem,
  type ThietCheVanHoaItem,
  type DiaChiTinCayItem,
  type LangNgheTruyenThongItem,
  type GisDiaDiemVanHoaItem,
  type HoSoBaoLucGiaDinhItem,
  type HoSoTTHCVanHoaItem,
  type ProductCheckInItem,
  type TaskAssignmentItem,
  type InternalChatMessage,
  type OnlineMeetingItem,
  initialGiaDinhVanHoaList,
  initialKhuPhoVanHoaList,
  initialDiTichLeHoiList,
  initialCoSoTonGiaoList,
  initialCoSoDichVuVanHoaList,
  initialThietCheVanHoaList,
  initialDiaChiTinCayList,
  initialLangNgheList,
  initialGisDiaDiemList,
  initialBaoLucGiaDinhList,
  initialHoSoTTHCVanHoaList,
  initialProductCheckInList,
  initialTaskAssignmentList,
  initialChatMessagesList,
  initialOnlineMeetingList,
  type VanBanDenItem,
  type VanBanDiItem,
  type TiepCongDanItem,
  type HoSoMotCuaLienThongItem,
  type LichTuanItem,
  initialVanBanDenList,
  initialVanBanDiList,
  initialTiepCongDanList,
  initialHoSoMotCuaLienThongList,
  initialLichTuanList,
  type ChoThoKhuPhoItem,
  type LietSiKhuPhoItem,
  type YeuCauXuLyMoItem,
  type LichSuXuLyMoItem,
  initialChoThoKhuPhoList,
  initialLietSiKhuPhoList,
  initialYeuCauXuLyMoList,
  type KpiEvaluationItem,
  type DiemThuongPhatItem,
  initialKpiEvaluationList,
  type KiemThuc3BuocItem,
  initialKiemThuc3BuocList,
  type DieuDuongNccItem,
  initialDieuDuongNccList,
  type KhaoSatHocNgheItem,
  initialKhaoSatHocNgheList,
  type KiemTra814Item,
  initialKiemTra814List,
  type DoThiVanMinhTieuChiItem,
  initialDoThiVanMinhList,
  type PhanAnh1022Item,
  initialPhanAnh1022List,
  type DtiCapXaItem,
  initialDtiCapXaList,
  type PhoCapGiaoDucItem,
  initialPhoCapGiaoDucList,
  type CongDongHocTapItem,
  initialCongDongHocTapList,
  type ThoCungLietSiItem,
  initialThoCungLietSiList,
  type HoiDongKhuyetTatItem,
  initialHoiDongKhuyetTatList,
  type NgheNhanDiSanItem,
  initialNgheNhanDiSanList,
  type CoSoTheThaoItem,
  initialCoSoTheThaoList,
  type TinBaiCongThongTinItem,
  initialTinBaiList,
  type GiamSatKhongGianMangItem,
  initialKhongGianMangList,
  type QuyDenOnDapNghiaItem,
  initialQuyDenOnList,
  type NhaTinhNghiaItem,
  initialNhaTinhNghiaList,
} from "@/data/domain-mock";
export type { DomainCode };
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
  role: "ADMIN_SO" | "ADMIN_PHONG" | "ADMIN_TECH" | "CB_THONG_TIN" | "CB_AN_SINH" | "CB_GIAO_DUC" | "CB_VAN_HOA" | string;
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

export type MockRoleKey = "ADMIN_SO" | "ADMIN_PHONG" | "ADMIN_TECH" | "CB_THONG_TIN" | "CB_AN_SINH" | "CB_GIAO_DUC" | "CB_VAN_HOA";

export const MOCK_USERS = {
  ADMIN_SO: {
    id: "USR-SO-001",
    username: "admin.so",
    fullName: "TS. Nguyễn Văn Hùng",
    role: "ADMIN_SO",
    roleName: "Lãnh đạo Ban Giám đốc Sở (Sếp)",
    title: "Phó Giám đốc Sở LĐTBXH tỉnh Bình Dương",
    department: "Ban Giám đốc Sở",
    unit: "Sở Lao động - Thương binh và Xã hội tỉnh Bình Dương",
    email: "admin.so@binhduong.gov.vn",
    phone: "0274.3822.456",
    avatarText: "NVH",
    permissions: [
      "Toàn quyền chỉ đạo điều hành công tác Lao động - Thương binh & Xã hội toàn tỉnh",
      "Ký số phê duyệt hồ sơ chính sách & ban hành quyết định trợ cấp",
      "Thẩm tra, phân bổ dự toán và quyết toán ngân sách an sinh xã hội địa bàn",
      "Giám sát chỉ số điều hành vĩ mô, tiến độ giải quyết Một cửa & CSAT công dân",
      "Phê duyệt quy chế phân công nhiệm vụ cán bộ các phòng ban chuyên môn",
    ],
    assignedDomains: ["ALL", "TT_CDS", "LDTBXH_NCC", "LDTBXH_AN_SINH", "GD_DT", "VH_TT_DL"],
    isActive: true,
  },
  ADMIN_TECH: {
    id: "USR-TECH-001",
    username: "admin.kythuat",
    fullName: "KS. Lê Văn Khoa",
    role: "ADMIN_TECH",
    roleName: "Quản trị viên Kỹ thuật & CSDL (DevOps / DBA)",
    title: "Kỹ sư An toàn thông tin & Quản trị CSDL",
    department: "Tổ Kỹ thuật Công nghệ thông tin & CSDL Chuyên ngành",
    unit: "Trung tâm CNTT & Truyền thông - Sở LĐTBXH Bình Dương",
    email: "admin.kythuat@binhduong.gov.vn",
    phone: "0274.3899.112",
    avatarText: "LVK",
    permissions: [
      "Toàn quyền truy cập Trung tâm Kỹ thuật, CSDL 3NF & API Engine",
      "Rà soát, chẩn đoán dị biệt dữ liệu & thực thi lệnh SQL UPDATE Fix",
      "Tiếp nhận, phân loại và xử lý phiếu báo lỗi kỹ thuật hệ thống",
      "Quản trị bản sao lưu Snapshot, xuất SQL Dump & khôi phục CSDL",
      "Giám sát an toàn thông tin, mTLS và cấu hình tích hợp VNeID",
    ],
    assignedDomains: ["ALL", "TT_CDS"],
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
  CB_VAN_HOA: {
    id: "USR-VH-001",
    username: "cb.vanhoa",
    fullName: "Nguyễn Thanh Tùng",
    role: "CB_VAN_HOA",
    roleName: "Cán bộ Văn hóa, Thể thao & Đời sống văn minh",
    title: "Công chức Văn hóa - Xã hội (Văn hóa, Thể thao, Du lịch & Gia đình)",
    department: "Bộ phận Văn hóa - Xã hội Phường",
    unit: "Ủy ban nhân dân Phường Phú Cường, TP. Thủ Dầu Một",
    email: "nttung.phucuong@thudaumot.binhduong.gov.vn",
    phone: "0918.665.432",
    avatarText: "NTT",
    permissions: [
      "Bình xét & công nhận danh hiệu Gia đình văn hóa, Khu phố văn hóa (NĐ 86/2023)",
      "Quản lý di tích lịch sử, danh thắng, số hóa mã QR & kiểm tra tiền công đức (TT 04/2023)",
      "Hướng dẫn sinh hoạt tôn giáo, tín ngưỡng & văn minh lễ hội Chùa Bà",
      "Kiểm tra liên ngành cơ sở Karaoke, quán bar, bida & biển hiệu quảng cáo",
      "Quản lý Trung tâm VHTCĐ, CLB Đờn ca tài tử Nam Bộ, Đội Lân sư rồng",
      "Vận hành mạng lưới Địa chỉ tin cậy & phòng chống bạo lực gia đình (Luật 2022)",
    ],
    assignedDomains: ["VH_TT_DL"],
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
  hoSoTTHCAnSinhList: HoSoTTHCAnSinhItem[];
  // Dữ liệu Mảng Giáo dục và Đào tạo
  mamNonList: CoSoMamNonTuThuc[];
  truongCongLapList: TruongHocCongLap[];
  phoCapList: SoLieuPhoCapGiaoDuc[];
  khuyenHocList: HoatDongKhuyenHoc[];
  moHinhHocTapList: MoHinhHocTap[];
  lopHocHTCDList: LopHocTrungTamHTCD[];
  hoSoTTHCGiaoDucList: HoSoTTHCGiaoDuc[];
  // Dữ liệu Mảng Văn hóa, Thể thao & Đời sống văn minh đô thị
  giaDinhVanHoaList: GiaDinhVanHoaItem[];
  khuPhoVanHoaList: KhuPhoVanHoaItem[];
  diTichLeHoiList: DiTichLeHoiItem[];
  coSoTonGiaoList: CoSoTonGiaoItem[];
  coSoDichVuVanHoaList: CoSoDichVuVanHoaItem[];
  thietCheVanHoaList: ThietCheVanHoaItem[];
  diaChiTinCayList: DiaChiTinCayItem[];
  langNgheList: LangNgheTruyenThongItem[];
  gisDiaDiemList: GisDiaDiemVanHoaItem[];
  baoLucGiaDinhList: HoSoBaoLucGiaDinhItem[];
  hoSoTTHCVanHoaList: HoSoTTHCVanHoaItem[];
  // Dữ liệu Điều hành Lãnh đạo, Check-in sản phẩm KPI, Chat nội bộ & Họp trực tuyến
  productCheckInList: ProductCheckInItem[];
  taskAssignmentList: TaskAssignmentItem[];
  chatMessagesList: InternalChatMessage[];
  onlineMeetingList: OnlineMeetingItem[];
  // Hệ thống Văn phòng điện tử (e-Office), Một cửa liên thông & Lịch tuần tiếp dân
  vanBanDenList: VanBanDenItem[];
  vanBanDiList: VanBanDiItem[];
  tiepCongDanList: TiepCongDanItem[];
  hoSoMotCuaLienThongList: HoSoMotCuaLienThongItem[];
  lichTuanList: LichTuanItem[];
  // Quản lý mộ liệt sĩ & Chỗ thờ liệt sĩ 4 Khu phố (NĐ 131/2021)
  choThoKhuPhoList: ChoThoKhuPhoItem[];
  lietsiKhuPhoList: LietSiKhuPhoItem[];
  yeuCauXuLyMoList: YeuCauXuLyMoItem[];
  // Chấm điểm KPI đa chiều & Thưởng phạt (NĐ 90/2020 & NĐ 48/2023)
  kpiEvaluationList: KpiEvaluationItem[];
  // Gói 1: Bếp ăn bán trú & Sổ kiểm thực 3 bước (QĐ 1246/QĐ-BYT)
  kiemThuc3BuocList: KiemThuc3BuocItem[];
  // Gói 2: Điều dưỡng NCC (Pháp lệnh 02/2020) & Khảo sát Học nghề KCN
  dieuDuongNccList: DieuDuongNccItem[];
  khaoSatHocNgheList: KhaoSatHocNgheItem[];
  // Gói 3: Đội Kiểm tra liên ngành 814 & Đô thị văn minh (QĐ 04/2022)
  kiemTra814List: KiemTra814Item[];
  doThiVanMinhList: DoThiVanMinhTieuChiItem[];
  // Gói 4: Phản ánh hiện trường 1022 & Bộ chỉ số DTI cấp Xã
  phanAnh1022List: PhanAnh1022Item[];
  dtiCapXaList: DtiCapXaItem[];
  // Gói bổ sung chuyên môn toàn diện đợt 2 (5 gói)
  phoCapGiaoDucList: PhoCapGiaoDucItem[];
  congDongHocTapList: CongDongHocTapItem[];
  thoCungLietSiList: ThoCungLietSiItem[];
  hoiDongKhuyetTatList: HoiDongKhuyetTatItem[];
  ngheNhanDiSanList: NgheNhanDiSanItem[];
  coSoTheThaoList: CoSoTheThaoItem[];
  tinBaiList: TinBaiCongThongTinItem[];
  khongGianMangList: GiamSatKhongGianMangItem[];
  quyDenOnList: QuyDenOnDapNghiaItem[];
  nhaTinhNghiaList: NhaTinhNghiaItem[];
  technicalErrorReports: TechnicalErrorReport[];
  auditLogs: {
    id: string;
    timestamp: string;
    action: string;
    details: string;
    status: "SUCCESS" | "FAILED" | "WARNING";
  }[];
}

export interface TechnicalErrorReport {
  id: string;
  code: string;
  title: string;
  module: "MOT_CUA" | "THAM_DINH" | "CHI_TRA" | "CSDL_3NF" | "LGSP_VNEID" | "HE_THONG";
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  reportedBy: string;
  reporterRole: string;
  reportedAt: string;
  description: string;
  stackTrace?: string;
  status: "OPEN" | "INVESTIGATING" | "RESOLVED" | "IGNORED";
  resolutionNote?: string;
  resolvedAt?: string;
  resolvedBy?: string;
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
          currentUser: parsed.currentUser
            ? parsed.currentUser.role === "ADMIN_SO"
              ? { ...parsed.currentUser, roleName: "Lãnh đạo Ban Giám đốc Sở (Sếp)" }
              : parsed.currentUser
            : MOCK_USERS.ADMIN_SO,
          usersList: parsed.usersList?.some((u: CurrentUser) => u.role === "ADMIN_TECH")
            ? parsed.usersList
            : [...(parsed.usersList || initialUsers), MOCK_USERS.ADMIN_TECH],
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
          hoSoTTHCAnSinhList: parsed.hoSoTTHCAnSinhList || initialHoSoTTHCAnSinhList,
          truongCongLapList: parsed.truongCongLapList || initialTruongCongLapList,
          phoCapList: parsed.phoCapList || initialPhoCapList,
          khuyenHocList: parsed.khuyenHocList || initialKhuyenHocList,
          moHinhHocTapList: parsed.moHinhHocTapList || initialMoHinhHocTapList,
          lopHocHTCDList: parsed.lopHocHTCDList || initialLopHocHTCDList,
          hoSoTTHCGiaoDucList: parsed.hoSoTTHCGiaoDucList || initialHoSoTTHCGiaoDucList,
          giaDinhVanHoaList: parsed.giaDinhVanHoaList || initialGiaDinhVanHoaList,
          khuPhoVanHoaList: parsed.khuPhoVanHoaList || initialKhuPhoVanHoaList,
          diTichLeHoiList: parsed.diTichLeHoiList || initialDiTichLeHoiList,
          coSoTonGiaoList: parsed.coSoTonGiaoList || initialCoSoTonGiaoList,
          coSoDichVuVanHoaList: parsed.coSoDichVuVanHoaList || initialCoSoDichVuVanHoaList,
          thietCheVanHoaList: parsed.thietCheVanHoaList || initialThietCheVanHoaList,
          diaChiTinCayList: parsed.diaChiTinCayList || initialDiaChiTinCayList,
          langNgheList: parsed.langNgheList || initialLangNgheList,
          gisDiaDiemList: parsed.gisDiaDiemList || initialGisDiaDiemList,
          baoLucGiaDinhList: parsed.baoLucGiaDinhList || initialBaoLucGiaDinhList,
          hoSoTTHCVanHoaList: parsed.hoSoTTHCVanHoaList || initialHoSoTTHCVanHoaList,
          productCheckInList: parsed.productCheckInList || initialProductCheckInList,
          taskAssignmentList: parsed.taskAssignmentList || initialTaskAssignmentList,
          chatMessagesList: parsed.chatMessagesList || initialChatMessagesList,
          onlineMeetingList: parsed.onlineMeetingList || initialOnlineMeetingList,
          vanBanDenList: parsed.vanBanDenList || initialVanBanDenList,
          vanBanDiList: parsed.vanBanDiList || initialVanBanDiList,
          tiepCongDanList: parsed.tiepCongDanList || initialTiepCongDanList,
          hoSoMotCuaLienThongList: parsed.hoSoMotCuaLienThongList || initialHoSoMotCuaLienThongList,
          lichTuanList: parsed.lichTuanList || initialLichTuanList,
          choThoKhuPhoList: parsed.choThoKhuPhoList || initialChoThoKhuPhoList,
          lietsiKhuPhoList: parsed.lietsiKhuPhoList || initialLietSiKhuPhoList,
          yeuCauXuLyMoList: parsed.yeuCauXuLyMoList || initialYeuCauXuLyMoList,
          kpiEvaluationList: parsed.kpiEvaluationList || initialKpiEvaluationList,
          kiemThuc3BuocList: parsed.kiemThuc3BuocList || initialKiemThuc3BuocList,
          dieuDuongNccList: parsed.dieuDuongNccList || initialDieuDuongNccList,
          khaoSatHocNgheList: parsed.khaoSatHocNgheList || initialKhaoSatHocNgheList,
          kiemTra814List: parsed.kiemTra814List || initialKiemTra814List,
          doThiVanMinhList: parsed.doThiVanMinhList || initialDoThiVanMinhList,
          phanAnh1022List: parsed.phanAnh1022List || initialPhanAnh1022List,
          dtiCapXaList: parsed.dtiCapXaList || initialDtiCapXaList,
          phoCapGiaoDucList: parsed.phoCapGiaoDucList || initialPhoCapGiaoDucList,
          congDongHocTapList: parsed.congDongHocTapList || initialCongDongHocTapList,
          thoCungLietSiList: parsed.thoCungLietSiList || initialThoCungLietSiList,
          hoiDongKhuyetTatList: parsed.hoiDongKhuyetTatList || initialHoiDongKhuyetTatList,
          ngheNhanDiSanList: parsed.ngheNhanDiSanList || initialNgheNhanDiSanList,
          coSoTheThaoList: parsed.coSoTheThaoList || initialCoSoTheThaoList,
          tinBaiList: parsed.tinBaiList || initialTinBaiList,
          khongGianMangList: parsed.khongGianMangList || initialKhongGianMangList,
          quyDenOnList: parsed.quyDenOnList || initialQuyDenOnList,
          nhaTinhNghiaList: parsed.nhaTinhNghiaList || initialNhaTinhNghiaList,
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
    hoSoTTHCAnSinhList: initialHoSoTTHCAnSinhList,
    mamNonList: initialMamNonList,
    truongCongLapList: initialTruongCongLapList,
    phoCapList: initialPhoCapList,
    khuyenHocList: initialKhuyenHocList,
    moHinhHocTapList: initialMoHinhHocTapList,
    lopHocHTCDList: initialLopHocHTCDList,
    hoSoTTHCGiaoDucList: initialHoSoTTHCGiaoDucList,
    giaDinhVanHoaList: initialGiaDinhVanHoaList,
    khuPhoVanHoaList: initialKhuPhoVanHoaList,
    diTichLeHoiList: initialDiTichLeHoiList,
    coSoTonGiaoList: initialCoSoTonGiaoList,
    coSoDichVuVanHoaList: initialCoSoDichVuVanHoaList,
    thietCheVanHoaList: initialThietCheVanHoaList,
    diaChiTinCayList: initialDiaChiTinCayList,
    langNgheList: initialLangNgheList,
    gisDiaDiemList: initialGisDiaDiemList,
    baoLucGiaDinhList: initialBaoLucGiaDinhList,
    hoSoTTHCVanHoaList: initialHoSoTTHCVanHoaList,
    productCheckInList: initialProductCheckInList,
    taskAssignmentList: initialTaskAssignmentList,
    chatMessagesList: initialChatMessagesList,
    onlineMeetingList: initialOnlineMeetingList,
    vanBanDenList: initialVanBanDenList,
    vanBanDiList: initialVanBanDiList,
    tiepCongDanList: initialTiepCongDanList,
    hoSoMotCuaLienThongList: initialHoSoMotCuaLienThongList,
    lichTuanList: initialLichTuanList,
    choThoKhuPhoList: initialChoThoKhuPhoList,
    lietsiKhuPhoList: initialLietSiKhuPhoList,
    yeuCauXuLyMoList: initialYeuCauXuLyMoList,
    kpiEvaluationList: initialKpiEvaluationList,
    kiemThuc3BuocList: initialKiemThuc3BuocList,
    dieuDuongNccList: initialDieuDuongNccList,
    khaoSatHocNgheList: initialKhaoSatHocNgheList,
    kiemTra814List: initialKiemTra814List,
    doThiVanMinhList: initialDoThiVanMinhList,
    phanAnh1022List: initialPhanAnh1022List,
    dtiCapXaList: initialDtiCapXaList,
    phoCapGiaoDucList: initialPhoCapGiaoDucList,
    congDongHocTapList: initialCongDongHocTapList,
    thoCungLietSiList: initialThoCungLietSiList,
    hoiDongKhuyetTatList: initialHoiDongKhuyetTatList,
    ngheNhanDiSanList: initialNgheNhanDiSanList,
    coSoTheThaoList: initialCoSoTheThaoList,
    tinBaiList: initialTinBaiList,
    khongGianMangList: initialKhongGianMangList,
    quyDenOnList: initialQuyDenOnList,
    nhaTinhNghiaList: initialNhaTinhNghiaList,
    technicalErrorReports: [
      {
        id: "ERR-2026-001",
        code: "ERR_DB_CCCD_FORMAT",
        title: "Dị biệt định dạng số CCCD trong bảng hồ sơ người có công",
        module: "CSDL_3NF",
        severity: "HIGH",
        reportedBy: "Hệ thống Rà soát CSDL",
        reporterRole: "SYSTEM_DIAGNOSTICS",
        reportedAt: "03/11/2026 09:15",
        description: "Số CCCD '07402600120' chỉ có 11 chữ số (thiếu 1 số so với quy chuẩn 12 số của Bộ Công an). Cần chuẩn hóa dữ liệu cũ.",
        stackTrace: "Table: ho_so_ncc | RecordId: 12029 | Field: cccd | PatternMismatch: ^\\d{12}$",
        status: "RESOLVED",
        resolutionNote: "Đã thực thi câu lệnh SQL UPDATE ho_so_ncc SET cccd = '074026001202' WHERE id = '12029'",
        resolvedAt: "03/11/2026 14:40",
        resolvedBy: "KS. Lê Văn Khoa (DevOps)",
      },
      {
        id: "ERR-2026-002",
        code: "ERR_BANK_MISSING_ACCOUNT",
        title: "Thiếu số tài khoản ngân hàng trong phiếu chi trợ cấp qua ATM",
        module: "CHI_TRA",
        severity: "CRITICAL",
        reportedBy: "Nguyễn Thị Minh Thảo",
        reporterRole: "ADMIN_PHONG",
        reportedAt: "03/11/2026 10:30",
        description: "Phương thức chi trả là chuyển khoản ngân hàng nhưng trường 'soTaiKhoan' bị bỏ trống hoặc chưa liên kết với Ngân hàng Chính sách Xã hội.",
        stackTrace: "Table: chi_tra_tro_cap | Field: soTaiKhoan IS NULL AND hinhThucNhan = 'CHUYEN_KHOAN'",
        status: "INVESTIGATING",
        resolutionNote: "Đang yêu cầu cán bộ phường xác minh số tài khoản với đối tượng thụ hưởng.",
      },
      {
        id: "ERR-2026-003",
        code: "ERR_LGSP_TIMEOUT",
        title: "Độ trễ xác thực kết nối liên thông LGSP / VNeID",
        module: "LGSP_VNEID",
        severity: "MEDIUM",
        reportedBy: "Tổ Giám sát Kỹ thuật",
        reporterRole: "SECURITY_OPERATIONS",
        reportedAt: "03/11/2026 11:45",
        description: "Độ trễ bắt tay mTLS giữa API Gateway và LGSP tỉnh vượt ngưỡng 800ms trong giờ cao điểm tiếp nhận hồ sơ Một cửa.",
        stackTrace: "HTTPS/TLS Handshake Timeout at lgsp.binhduong.gov.vn:8443 (SocketTimeoutException)",
        status: "OPEN",
      },
      {
        id: "ERR-2026-004",
        code: "ERR_DOC_DECISION_NUMBER",
        title: "Hồ sơ đã duyệt nhưng chưa sinh số quyết định hành chính chuẩn",
        module: "THAM_DINH",
        severity: "LOW",
        reportedBy: "Cán bộ thụ lý Một cửa",
        reporterRole: "CAN_BO_MOT_CUA",
        reportedAt: "03/11/2026 13:20",
        description: "Có hồ sơ đã duyệt trợ cấp nhưng chưa được cấp số quyết định theo định dạng QĐ-SLĐTBXH/2026 chuẩn.",
        status: "RESOLVED",
        resolutionNote: "Đã cấp số quyết định tự động và đồng bộ vào bảng CSDL.",
        resolvedAt: "03/11/2026 14:41",
        resolvedBy: "KS. Lê Văn Khoa (DevOps)",
      },
    ],
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
      const soQd = `QĐ-SLĐTBXH-${now.getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;
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

      // 3. Tự động liên thông danh sách chi trả hàng tháng (Kỳ chi trả tiếp theo)
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const kyChiTra = `${String(nextMonth.getMonth() + 1).padStart(2, "0")}/${nextMonth.getFullYear()}`;
      const newChiTraItem: ChiTraItem = {
        id: `CT-${nextMonth.getFullYear()}${String(nextMonth.getMonth() + 1).padStart(2, "0")}-${Math.floor(100 + Math.random() * 900)}`,
        hoSoId: hoSo.id,
        soHoSoTinh: hoSo.soHoSoTinh || hoSo.id,
        hoTen: hoSo.hoTen,
        cccd: hoSo.cccd,
        loaiDoiTuong: hoSo.loaiDoiTuong,
        loaiCheDo: "HÀNG_THÁNG",
        tenCheDo: `Trợ cấp ${hoSo.loaiDoiTuong.toLowerCase()} hàng tháng (NĐ 75/2021 & NĐ 77/2024)`,
        soTien: calc.tongTienThucNhan,
        hinhThuc: hoSo.soTaiKhoan ? "NGAN_HANG" : "BUU_DIEN",
        thongTinChiTra: hoSo.soTaiKhoan
          ? `${hoSo.tenNganHang || "Vietcombank"} CN Bình Dương`
          : `Bưu điện văn hóa xã ${hoSo.phuong}`,
        tenNganHang: hoSo.tenNganHang || (hoSo.soTaiKhoan ? "Vietcombank" : undefined),
        soTaiKhoan: hoSo.soTaiKhoan,
        phuong: hoSo.phuong,
        huyen: hoSo.huyen || "TP. Thủ Dầu Một",
        kyChiTra,
        trangThai: "CHỜ_CHI_TRẢ",
        nguoiNhan: hoSo.hoTen,
      };

      // 4. Atomically Cập nhật hồ sơ & Lưu quyết định & Đồng bộ chi trả
      state = {
        ...state,
        quyetDinhList: [newQuyetDinh, ...state.quyetDinhList],
        chiTraList: [newChiTraItem, ...state.chiTraList],
        hoSoList: state.hoSoList.map((h) =>
          h.id === hoSoId
            ? {
              ...h,
              trangThai: "ĐÃ_DUYỆT",
              soQuyetDinh: soQd,
              mucTroCap: calc.troCapHangThang,
              phuCapPhucVu: calc.phuCapChamSoc,
              troCapDieuDuong: calc.troCapDieuDuong,
              ghiChuThamDinh: `Đã phê duyệt và ban hành ${soQd}. Tổng tiền hưởng: ${calc.tongTienThucNhan.toLocaleString("vi-VN")}đ/tháng. Đã đưa vào kỳ chi trả ${kyChiTra}.`,
            }
            : h,
        ),
        auditLogs: [
          {
            id: `LOG-${Date.now()}`,
            timestamp: new Date().toLocaleString("vi-VN"),
            action: "Ban hành Quyết định hưởng & Liên thông Chi trả",
            details: `Lãnh đạo ${canBoPheDuyet} phê duyệt hồ sơ ${hoSoId}, ban hành ${soQd}, tự động đưa vào kỳ chi trả ${kyChiTra}`,
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
   * Báo lỗi sự cố kỹ thuật (Dành cho Cán bộ hoặc Lãnh đạo gửi về Tổ Kỹ thuật)
   */
  reportTechnicalError(report: {
    title: string;
    module: "MOT_CUA" | "THAM_DINH" | "CHI_TRA" | "CSDL_3NF" | "LGSP_VNEID" | "HE_THONG";
    severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    description: string;
    stackTrace?: string;
  }) {
    const newReport: TechnicalErrorReport = {
      id: `ERR-${Date.now().toString().slice(-4)}`,
      code: `ERR_${report.module}_${Date.now().toString().slice(-3)}`,
      title: report.title,
      module: report.module,
      severity: report.severity,
      reportedBy: state.currentUser.fullName,
      reporterRole: state.currentUser.role,
      reportedAt: new Date().toLocaleString("vi-VN"),
      description: report.description,
      stackTrace: report.stackTrace,
      status: "OPEN",
    };

    state = {
      ...state,
      technicalErrorReports: [newReport, ...(state.technicalErrorReports || [])],
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toLocaleString("vi-VN"),
          action: "Gửi báo cáo sự cố kỹ thuật",
          details: `Cán bộ ${state.currentUser.fullName} gửi báo lỗi: ${report.title} [${report.module}]`,
          status: "WARNING",
        },
        ...state.auditLogs,
      ],
    };
    notify();
    return newReport;
  },

  /**
   * Quản trị viên Kỹ thuật xử lý / giải quyết lỗi hệ thống
   */
  resolveTechnicalError(id: string, resolutionNote: string) {
    state = {
      ...state,
      technicalErrorReports: (state.technicalErrorReports || []).map((err) =>
        err.id === id
          ? {
              ...err,
              status: "RESOLVED" as const,
              resolutionNote,
              resolvedAt: new Date().toLocaleString("vi-VN"),
              resolvedBy: state.currentUser.fullName,
            }
          : err
      ),
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toLocaleString("vi-VN"),
          action: "Xử lý sự cố kỹ thuật",
          details: `Admin Kỹ thuật ${state.currentUser.fullName} đã giải quyết sự cố ${id}: ${resolutionNote}`,
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

  thoiHuongBaoTro(id: string, lyDo: string, soQuyetDinh: string) {
    const updated = state.baoTroList.map((b) =>
      b.id === id ? { ...b, trangThai: "THOI_HUONG" as const, soQuyetDinh, thongTinChiTra: `Đã thôi hưởng: ${lyDo}` } : b
    );
    state = { ...state, baoTroList: updated };
    notify();
  },

  chamDiemHoNgheo(
    id: string,
    phanLoai: HoGheoCanGheoItem["phanLoai"],
    chieuThieuHut: string[],
    soTienVayCSXHVND?: number
  ) {
    const updated = state.hoGheoList.map((h) =>
      h.id === id
        ? {
            ...h,
            phanLoai,
            chieuThieuHut,
            soTienVayCSXHVND: soTienVayCSXHVND !== undefined ? soTienVayCSXHVND : h.soTienVayCSXHVND,
          }
        : h
    );
    state = { ...state, hoGheoList: updated };
    notify();
  },

  ketNoiViecLam(id: string, doanhNghiepTuyenDung: string, mucLuongKyVong: string) {
    const updated = state.cungCauLaoDongList.map((c) =>
      c.id === id
        ? {
            ...c,
            tinhTrangViecLam: "DA_KET_NOI_VIEC_LAM" as const,
            doanhNghiepTuyenDung,
            mucLuongKyVong,
            ngayCapNhat: new Date().toLocaleDateString("vi-VN"),
          }
        : c
    );
    state = { ...state, cungCauLaoDongList: updated };
    notify();
  },

  lapKeHoachCanThiepTreEm(id: string, noiDungCanThiep: string) {
    const updated = state.treEmList.map((t) =>
      t.id === id
        ? {
            ...t,
            chinhSachTroCap: noiDungCanThiep,
            daDuocTangHocBong: true,
            ghiChuTheoDoi: `Kế hoạch can thiệp phê duyệt ngày ${new Date().toLocaleDateString("vi-VN")}: ${noiDungCanThiep}`,
          }
        : t
    );
    state = { ...state, treEmList: updated };
    notify();
  },

  capNhatXetNghiemTeNan(id: string, ketQua: "AM_TINH" | "DUONG_TINH", hoTroMoi?: string) {
    const updated = state.teNanList.map((t) =>
      t.id === id
        ? {
            ...t,
            ketQuaXetNghiemDinhKy: ketQua,
            hoTroViecLam: hoTroMoi || t.hoTroViecLam,
            ngayCapNhat: new Date().toLocaleDateString("vi-VN"),
          }
        : t
    );
    state = { ...state, teNanList: updated };
    notify();
  },

  addHoSoTTHCAnSinh(item: HoSoTTHCAnSinhItem) {
    state = { ...state, hoSoTTHCAnSinhList: [item, ...state.hoSoTTHCAnSinhList] };
    notify();
  },

  updateHoSoTTHCAnSinhStatus(
    id: string,
    trangThai: HoSoTTHCAnSinhItem["trangThai"],
    extra?: Partial<HoSoTTHCAnSinhItem>
  ) {
    const updated = state.hoSoTTHCAnSinhList.map((h) =>
      h.id === id ? { ...h, trangThai, ...extra } : h
    );
    state = { ...state, hoSoTTHCAnSinhList: updated };
    notify();
  },

  kySoHoSoTTHCAnSinh(id: string, quyetDinhData: NonNullable<HoSoTTHCAnSinhItem["quyetDinhKySo"]>) {
    const updated = state.hoSoTTHCAnSinhList.map((h) =>
      h.id === id
        ? {
            ...h,
            trangThai: "DA_KY_SO" as const,
            quyetDinhKySo: quyetDinhData,
          }
        : h
    );
    state = { ...state, hoSoTTHCAnSinhList: updated };
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

    // 4. Tự động bổ sung khoản chi trả Mai táng phí một lần cho thân nhân
    const kyChiTraCurrent = `${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;
    const newMaiTangChiTraItem: ChiTraItem = {
      id: `CT-MTP-${now.getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      hoSoId: hoSo.id,
      soHoSoTinh: hoSo.soHoSoTinh || hoSo.id,
      hoTen: hoSo.hoTen,
      cccd: hoSo.cccd,
      loaiDoiTuong: hoSo.loaiDoiTuong,
      loaiCheDo: "MỘT_LẦN",
      tenCheDo: "Trợ cấp mai táng phí theo NĐ 131/2021 & NĐ 77/2024",
      soTien: soTienMaiTangPhi,
      hinhThuc: "NGAN_HANG",
      thongTinChiTra: `Người nhận mai táng phí: ${input.nguoiKhaiBao} (CCCD: ${input.soCccdNguoiKhai})`,
      phuong: hoSo.phuong,
      huyen: hoSo.huyen || "TP. Thủ Dầu Một",
      kyChiTra: kyChiTraCurrent,
      trangThai: "CHỜ_CHI_TRẢ",
      nguoiNhan: input.nguoiKhaiBao,
    };

    state = {
      ...state,
      hoSoList: updatedHoSoList,
      baoGiamList: [newBaoGiamItem, ...state.baoGiamList],
      chiTraList: [newMaiTangChiTraItem, ...updatedChiTraList],
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
   * Nghiệp vụ Mảng Văn hóa, Thể thao & Đời sống văn minh đô thị
   */
  binhXetGiaDinhVanHoa(data: {
    id: string;
    diemGuongMau: number;
    diemKinhTe: number;
    diemHoaThuan: number;
    deNghiKhenThuong?: boolean;
    ghiChu?: string;
  }) {
    const now = new Date();
    const tongDiem = data.diemGuongMau + data.diemKinhTe + data.diemHoaThuan;
    const ketQua = tongDiem >= 85 ? ("DAT_CHUAN" as const) : ("CHUA_DAT" as const);

    const updated = state.giaDinhVanHoaList.map((g) => {
      if (g.id === data.id) {
        return {
          ...g,
          diemGuongMau: data.diemGuongMau,
          diemKinhTe: data.diemKinhTe,
          diemHoaThuan: data.diemHoaThuan,
          tongDiem,
          ketQua,
          deNghiKhenThuong: data.deNghiKhenThuong ?? g.deNghiKhenThuong,
          ngayCham: now.toLocaleDateString("vi-VN"),
          ghiChu: data.ghiChu ?? g.ghiChu,
        };
      }
      return g;
    });

    state = {
      ...state,
      giaDinhVanHoaList: updated,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toLocaleString("vi-VN"),
          action: "Bình xét Gia đình văn hóa (NĐ 86/2023)",
          details: `Hoàn tất chấm điểm hộ ${data.id}: ${tongDiem}/100 điểm (${ketQua === "DAT_CHUAN" ? "Đạt chuẩn" : "Chưa đạt"})`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };

    notify();
    return { success: true, tongDiem, ketQua };
  },

  kiemTraCoSoVanHoa(
    id: string,
    ketLuan: CoSoDichVuVanHoaItem["ketLuan"],
    mucPhatVND: number,
    noiDungXuLy: string,
    pccc: CoSoDichVuVanHoaItem["tinhTrangPCCC"] = "DAT_TIEU_CHUAN"
  ) {
    const now = new Date();
    const updated = state.coSoDichVuVanHoaList.map((cs) => {
      if (cs.id === id) {
        return {
          ...cs,
          ketLuan,
          mucPhatVND,
          noiDungXuLy,
          tinhTrangPCCC: pccc,
          lanKiemTraGanNhat: now.toLocaleDateString("vi-VN"),
        };
      }
      return cs;
    });

    state = {
      ...state,
      coSoDichVuVanHoaList: updated,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toLocaleString("vi-VN"),
          action: "Kiểm tra liên ngành cơ sở dịch vụ văn hóa (NĐ 54/2019)",
          details: `Đoàn kiểm tra liên ngành kết luận cơ sở ${id}: ${ketLuan}. Xử lý: ${noiDungXuLy}`,
          status: ketLuan === "CHUP_HANH_TOT" ? "SUCCESS" : "WARNING",
        },
        ...state.auditLogs,
      ],
    };

    notify();
  },

  capNhatPcccDiTich(id: string, congTacPCCC: DiTichLeHoiItem["congTacPCCC"]) {
    const now = new Date();
    const updated = state.diTichLeHoiList.map((dt) => {
      if (dt.id === id) {
        return {
          ...dt,
          congTacPCCC,
        };
      }
      return dt;
    });

    state = {
      ...state,
      diTichLeHoiList: updated,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toLocaleString("vi-VN"),
          action: "Cập nhật an toàn PCCC Di tích Lịch sử & Lễ hội",
          details: `Di tích ${id} cập nhật PCCC sang: ${congTacPCCC}`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };

    notify();
  },

  dangKySinhHoatTonGiao(id: string) {
    const now = new Date();
    const updated = state.coSoTonGiaoList.map((tg) => {
      if (tg.id === id) {
        return {
          ...tg,
          tinhTrangDangKy: "DA_DANG_KY_HANG_NAM" as const,
        };
      }
      return tg;
    });

    state = {
      ...state,
      coSoTonGiaoList: updated,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toLocaleString("vi-VN"),
          action: "Tiếp nhận thông báo hoạt động tôn giáo hàng năm",
          details: `UBND Phường tiếp nhận & xác nhận thông báo hoạt động của cơ sở ${id}`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };

    notify();
  },

  tiepNhanBaoLucGiaDinh(id: string) {
    const now = new Date();
    const updated = state.diaChiTinCayList.map((dc) => {
      if (dc.id === id) {
        return {
          ...dc,
          soVuViecTiepNhan: dc.soVuViecTiepNhan + 1,
          trangThai: "DANG_HO_TRO_NAN_NHAN" as const,
        };
      }
      return dc;
    });

    state = {
      ...state,
      diaChiTinCayList: updated,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toLocaleString("vi-VN"),
          action: "Kích hoạt bảo vệ nạn nhân bạo lực gia đình (Luật 2022)",
          details: `Địa chỉ tin cậy ${id} tiếp nhận 01 trường hợp cần hỗ trợ khẩn cấp`,
          status: "WARNING",
        },
        ...state.auditLogs,
      ],
    };

    notify();
  },

  addGiaDinhVanHoa(item: GiaDinhVanHoaItem) {
    const now = new Date();
    state = {
      ...state,
      giaDinhVanHoaList: [item, ...state.giaDinhVanHoaList],
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toLocaleString("vi-VN"),
          action: "Đăng ký danh hiệu Gia đình văn hóa mới",
          details: `Thêm hộ gia đình ${item.chuHo} (${item.khuPho}) vào danh sách bình xét`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };
    notify();
  },

  banHanhQuyetDinhCamTiepXuc(id: string, thoiHanNgay = 3) {
    const now = new Date();
    const soQd = `QĐ-UBND-CTX/${Date.now().toString().slice(-4)}`;
    const updated = state.baoLucGiaDinhList.map((bl) => {
      if (bl.id === id) {
        return {
          ...bl,
          bienPhapBaoVe: "CAM_TIEP_XUC_UBND" as const,
          soQuyetDinhCamTiepXuc: soQd,
          thoiHanCamNgay: thoiHanNgay,
          trangThai: "DA_HOA_GIAI_ON_DINH" as const,
          bienBanGhiNhan: `Chủ tịch UBND Phường ban hành Quyết định cấm tiếp xúc ${thoiHanNgay} ngày (Số: ${soQd}). Người gây bạo lực không được tiếp cận nạn nhân trong bán kính 100m.`,
        };
      }
      return bl;
    });

    state = {
      ...state,
      baoLucGiaDinhList: updated,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toLocaleString("vi-VN"),
          action: "Ban hành Quyết định cấm tiếp xúc (Luật PCBLGĐ 2022)",
          details: `Chủ tịch UBND Phường ban hành Quyết định ${soQd} thời hạn ${thoiHanNgay} ngày để bảo vệ khẩn cấp nạn nhân`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };

    notify();
    return { success: true, soQuyetDinh: soQd };
  },

  kySoTthcVanHoa(id: string, nguoiKy?: string, chucVu?: string) {
    const now = new Date();
    const signer = nguoiKy || state.currentUser.fullName;
    const title = chucVu || state.currentUser.title;
    const maXacThuc = `SHA256:${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

    const updated = state.hoSoTTHCVanHoaList.map((hs) => {
      if (hs.id === id) {
        return {
          ...hs,
          trangThai: "DA_HOAN_THANH" as const,
          kySoSmartCA: {
            nguoiKy: signer,
            chucVu: title,
            ngayKy: now.toLocaleString("vi-VN"),
            maXacThuc,
          },
        };
      }
      return hs;
    });

    state = {
      ...state,
      hoSoTTHCVanHoaList: updated,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toLocaleString("vi-VN"),
          action: "Ký số SmartCA TTHC Lĩnh vực Văn hóa",
          details: `Lãnh đạo ${signer} ký số điện tử phê duyệt hồ sơ ${id}. Mã xác thực: ${maXacThuc}`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };

    notify();
    return { success: true, maXacThuc };
  },

  tiepNhanTthcVanHoa(item: Omit<HoSoTTHCVanHoaItem, "id" | "maHoSo" | "trangThai">) {
    const now = new Date();
    const newId = `TTHC-VH-${Date.now().toString().slice(-4)}`;
    const maHoSo = `HSO-VH-2026-${Date.now().toString().slice(-3)}`;

    const newHoSo: HoSoTTHCVanHoaItem = {
      ...item,
      id: newId,
      maHoSo,
      trangThai: "TIEP_NHAN",
    };

    state = {
      ...state,
      hoSoTTHCVanHoaList: [newHoSo, ...state.hoSoTTHCVanHoaList],
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toLocaleString("vi-VN"),
          action: "Tiếp nhận hồ sơ TTHC Văn hóa mới (Mẫu 01)",
          details: `Bộ phận Một cửa tiếp nhận hồ sơ ${maHoSo} (${item.tenThuTuc}) từ công dân ${item.nguoiNop}`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };

    notify();
    return newHoSo;
  },

  // -------------------------------------------------------------
  // ĐIỀU HÀNH LÃNH ĐẠO, CHECK-IN SẢN PHẨM & GIAO VIỆC
  // -------------------------------------------------------------
  pheDuyetProductCheckIn(
    id: string,
    status: "DA_PHE_CHUAN" | "YEU_CAU_BO_SUNG",
    yKien?: string,
    diem?: number
  ) {
    const now = new Date();
    const lanhDao = state.currentUser.fullName;

    const updated = state.productCheckInList.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          trangThai: status,
          yKienLanhDao: yKien || (status === "DA_PHE_CHUAN" ? "Lãnh đạo đã phê chuẩn đạt yêu cầu." : "Yêu cầu chỉnh sửa bổ sung theo quy định."),
          diemDanhGia: diem ?? (status === "DA_PHE_CHUAN" ? 5 : 3),
          ngayPheDuyet: now.toLocaleString("vi-VN"),
          lanhDaoPheDuyet: lanhDao,
        };
      }
      return p;
    });

    state = {
      ...state,
      productCheckInList: updated,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toLocaleString("vi-VN"),
          action: status === "DA_PHE_CHUAN" ? "Phê chuẩn sản phẩm đầu ra" : "Yêu cầu hoàn thiện sản phẩm",
          details: `Lãnh đạo ${lanhDao} đánh giá sản phẩm ${id}: ${status}`,
          status: status === "DA_PHE_CHUAN" ? "SUCCESS" : "WARNING",
        },
        ...state.auditLogs,
      ],
    };

    notify();
  },

  nopProductCheckIn(item: Omit<ProductCheckInItem, "id" | "maSanPham" | "trangThai" | "ngayNop">) {
    const now = new Date();
    const id = `PROD-${Date.now().toString().slice(-4)}`;
    const maSanPham = `SP-CHECKIN-${Date.now().toString().slice(-4)}`;

    const newItem: ProductCheckInItem = {
      ...item,
      id,
      maSanPham,
      ngayNop: now.toLocaleString("vi-VN"),
      trangThai: "CHO_LANH_DAO_DUYET",
    };

    state = {
      ...state,
      productCheckInList: [newItem, ...state.productCheckInList],
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toLocaleString("vi-VN"),
          action: "Cán bộ check-in sản phẩm công việc",
          details: `Cán bộ ${item.canBoNop} nộp sản phẩm: ${item.tenSanPham}`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };

    notify();
    return newItem;
  },

  giaoTaskAssignment(item: Omit<TaskAssignmentItem, "id" | "maCongViec" | "trangThai" | "tienDoPercent" | "ngayGiao">) {
    const now = new Date();
    const id = `TASK-${Date.now().toString().slice(-4)}`;
    const maCongViec = `CV-UBND-${Date.now().toString().slice(-4)}`;

    const newTask: TaskAssignmentItem = {
      ...item,
      id,
      maCongViec,
      ngayGiao: now.toLocaleDateString("vi-VN"),
      trangThai: "MOI_GIAO",
      tienDoPercent: 0,
    };

    // Tự động gửi 1 tin nhắn vào kênh chat toàn phường để thông báo
    const newMsg: InternalChatMessage = {
      id: `MSG-${Date.now()}`,
      channelId: "toan-phuong",
      senderName: item.nguoiGiaoViec || state.currentUser.fullName,
      senderRole: item.chucVuNguoiGiao || state.currentUser.title,
      senderAvatar: state.currentUser.avatarText || "LĐ",
      timestamp: now.toLocaleString("vi-VN"),
      content: `[GIAO VIỆC MỚI] Giao đồng chí ${item.canBoPhuTrach}: ${item.tieuDe}. Hạn chót: ${item.hanChot}. Sản phẩm yêu cầu: ${item.sanPhamYeuCau}`,
      isImportant: item.mucDoUuTien === "HOA_TOC",
      attachedTask: {
        id,
        title: item.tieuDe,
        deadline: item.hanChot,
      },
    };

    state = {
      ...state,
      taskAssignmentList: [newTask, ...state.taskAssignmentList],
      chatMessagesList: [...state.chatMessagesList, newMsg],
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toLocaleString("vi-VN"),
          action: "Lãnh đạo phân công nhiệm vụ mới",
          details: `Giao việc ${maCongViec} cho cán bộ ${item.canBoPhuTrach}. Hạn: ${item.hanChot}`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };

    notify();
    return newTask;
  },

  capNhatTienDoTask(id: string, tienDo: number, status?: TaskAssignmentItem["trangThai"]) {
    const updated = state.taskAssignmentList.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          tienDoPercent: Math.min(100, Math.max(0, tienDo)),
          trangThai: status || (tienDo >= 100 ? "HOAN_THANH" : tienDo >= 90 ? "CHO_DUYET_CHECKIN" : "DANG_THUC_HIEN"),
        };
      }
      return t;
    });

    state = {
      ...state,
      taskAssignmentList: updated,
    };

    notify();
  },

  sendChatMessage(
    channelId: string,
    content: string,
    attachedTask?: { id: string; title: string; deadline: string }
  ) {
    const now = new Date();
    const newMsg: InternalChatMessage = {
      id: `MSG-${Date.now()}`,
      channelId,
      senderName: state.currentUser.fullName,
      senderRole: state.currentUser.roleName,
      senderAvatar: state.currentUser.avatarText,
      timestamp: now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      content,
      attachedTask,
    };

    state = {
      ...state,
      chatMessagesList: [...state.chatMessagesList, newMsg],
    };

    notify();
    return newMsg;
  },

  taoOnlineMeeting(item: Omit<OnlineMeetingItem, "id" | "maCuocHop" | "trangThai">) {
    const now = new Date();
    const id = `MEET-${Date.now().toString().slice(-4)}`;
    const maCuocHop = `HOP-UBND-${Date.now().toString().slice(-4)}`;

    const newMeeting: OnlineMeetingItem = {
      ...item,
      id,
      maCuocHop,
      trangThai: "SAP_DIEN_RA",
    };

    // Tự động báo vào kênh toàn phường
    const newMsg: InternalChatMessage = {
      id: `MSG-${Date.now()}`,
      channelId: "toan-phuong",
      senderName: state.currentUser.fullName,
      senderRole: state.currentUser.roleName,
      senderAvatar: state.currentUser.avatarText,
      timestamp: now.toLocaleString("vi-VN"),
      content: `[LỊCH HỌP MỚI] ${item.tieuDe}. Thời gian: ${item.thoiGian}. Phòng họp: ${item.diaDiem}. Kính mời các đồng chí tham dự đầy đủ.`,
      isImportant: true,
    };

    state = {
      ...state,
      onlineMeetingList: [newMeeting, ...state.onlineMeetingList],
      chatMessagesList: [...state.chatMessagesList, newMsg],
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toLocaleString("vi-VN"),
          action: "Lên lịch họp giao ban / chuyên đề",
          details: `Tạo cuộc họp ${maCuocHop}: ${item.tieuDe}`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };

    notify();
    return newMeeting;
  },

  // ============================================================================
  // HÀM NGHIỆP VỤ VĂN PHÒNG ĐIỆN TỬ, MỘT CỬA LIÊN THÔNG & LỊCH TUẦN TIẾP DÂN
  // ============================================================================

  butPheVanBanDen(
    vanBanId: string,
    canBoChuTriId: string,
    canBoChuTriName: string,
    butPhe: string,
    hanXuLy: string
  ) {
    const now = new Date();
    const targetVbd = state.vanBanDenList.find((v) => v.id === vanBanId);
    if (!targetVbd) return;

    // 1. Cập nhật văn bản đến
    const updatedVbdList = state.vanBanDenList.map((v) =>
      v.id === vanBanId
        ? {
            ...v,
            canBoChuTriId,
            canBoChuTriName,
            butPheLanhDao: butPhe,
            hanXuLy,
            trangThai: "DANG_XU_LY" as const,
          }
        : v
    );

    // 2. Tự động sinh Task Assignment cho cán bộ
    const newTask: TaskAssignmentItem = {
      id: `TASK-${Date.now().toString().slice(-4)}`,
      maNhiemVu: `NV-VB-${targetVbd.soDen}-${Date.now().toString().slice(-3)}`,
      tenNhiemVu: `Xử lý Văn bản đến số ${targetVbd.soDen}: ${targetVbd.trichYeu.slice(0, 80)}...`,
      canBoPhuTrachId: canBoChuTriId,
      canBoPhuTrachName: canBoChuTriName,
      nguoiGiao: state.currentUser.fullName,
      ngayGiao: now.toLocaleDateString("vi-VN"),
      hanHoanThanh: hanXuLy,
      doUuTien:
        targetVbd.doKhan === "HOA_TOC"
          ? "HOA_TOC"
          : targetVbd.doKhan === "THUONG_KHAN" || targetVbd.doKhan === "KHAN"
            ? "KHAN"
            : "BINH_THUONG",
      trangThai: "DANG_THUC_HIEN",
      tienDoPhanTram: 15,
      yeuCauSanPham: "Dự thảo văn bản đi (Tờ trình/Báo cáo/Kế hoạch) kèm file PDF trình ký Lãnh đạo",
    };

    // 3. Tự động bắn tin nhắn vào kênh chỉ đạo chung
    const newChatMsg: InternalChatMessage = {
      id: `MSG-${Date.now()}`,
      channelId: "toan-phuong",
      senderName: state.currentUser.fullName,
      senderRole: state.currentUser.roleName,
      senderAvatar: state.currentUser.avatarText,
      timestamp: now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      content: `[BÚT PHÊ VĂN BẢN ĐẾN SỐ ${targetVbd.soDen}/${targetVbd.soKyHieu}]: "${butPhe}". Giao đ/c ${canBoChuTriName} chủ trì xử lý xong trước ngày ${hanXuLy}.`,
      attachedTask: newTask,
      isImportant: targetVbd.doKhan === "HOA_TOC" || targetVbd.doKhan === "THUONG_KHAN",
    };

    state = {
      ...state,
      vanBanDenList: updatedVbdList,
      taskAssignmentList: [newTask, ...state.taskAssignmentList],
      chatMessagesList: [...state.chatMessagesList, newChatMsg],
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toLocaleString("vi-VN"),
          action: "Bút phê & Phân công Văn bản đến",
          details: `VB số ${targetVbd.soDen} giao đ/c ${canBoChuTriName} (Hạn: ${hanXuLy})`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };

    notify();
  },

  trinhKyVanBanDi(payload: {
    trichYeu: string;
    loaiVanBan: VanBanDiItem["loaiVanBan"];
    nguoiSoan: string;
    boPhanSoan: string;
    noiNhan: string[];
    tepDinhKem: string;
    vanBanDenLienQuanId?: string;
  }) {
    const now = new Date();
    const id = `VBD-DI-${Date.now().toString().slice(-4)}`;
    const soKyHieu = `DT-${Date.now().toString().slice(-3)}/DT-UBND`;

    const newVbDi: VanBanDiItem = {
      id,
      soKyHieu,
      trichYeu: payload.trichYeu,
      loaiVanBan: payload.loaiVanBan,
      nguoiSoan: payload.nguoiSoan,
      boPhanSoan: payload.boPhanSoan,
      ngaySoan: now.toLocaleDateString("vi-VN"),
      theThucHopLe: true,
      nguoiKiemTraTheThuc: "Văn phòng HĐND-UBND Phường",
      trangThai: "CHO_KY_SO",
      noiNhan: payload.noiNhan,
      tepDinhKem: payload.tepDinhKem,
      vanBanDenLienQuanId: payload.vanBanDenLienQuanId,
      dongDauCoQuan: false,
    };

    state = {
      ...state,
      vanBanDiList: [newVbDi, ...state.vanBanDiList],
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toLocaleString("vi-VN"),
          action: "Trình ký Văn bản đi",
          details: `${payload.nguoiSoan} trình ký: ${payload.trichYeu}`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };

    notify();
    return newVbDi;
  },

  thamTraTheThuc(vanBanDiId: string, theThucHopLe: boolean, nguoiKiemTra: string) {
    const updated = state.vanBanDiList.map((v) =>
      v.id === vanBanDiId
        ? {
            ...v,
            theThucHopLe,
            nguoiKiemTraTheThuc: nguoiKiemTra,
            trangThai: theThucHopLe ? ("CHO_KY_SO" as const) : ("CHO_THAM_TRA" as const),
          }
        : v
    );

    state = {
      ...state,
      vanBanDiList: updated,
    };
    notify();
  },

  kySoPhatHanhVanBanDi(vanBanDiId: string, lanhDaoKy: string, chucVu: string) {
    const now = new Date();
    const target = state.vanBanDiList.find((v) => v.id === vanBanDiId);
    if (!target) return;

    const newSoDi =
      state.vanBanDiList.reduce((max, v) => (v.soDi && v.soDi > max ? v.soDi : max), 120) + 1;
    const soKyHieuChinhThuc = `${newSoDi}/${target.loaiVanBan === "BAO_CAO" ? "BC" : target.loaiVanBan === "TO_TRINH" ? "TTr" : target.loaiVanBan === "QUYET_DINH" ? "QĐ" : "KH"}-UBND`;
    const maKySo = `CA-BDU-TDM-${Date.now().toString().slice(-8)}-2026`;

    // 1. Cập nhật văn bản đi thành đã phát hành
    const updatedVbDi = state.vanBanDiList.map((v) =>
      v.id === vanBanDiId
        ? {
            ...v,
            soDi: newSoDi,
            soKyHieu: soKyHieuChinhThuc,
            lanhDaoKyDuyet: lanhDaoKy,
            chucVuNguoiKy: chucVu,
            ngayKy: now.toLocaleString("vi-VN"),
            maKySoSmartCA: maKySo,
            trangThai: "DA_PHAT_HANH" as const,
            ngayPhatHanh: now.toLocaleString("vi-VN"),
            dongDauCoQuan: true,
          }
        : v
    );

    // 2. Tự động sinh ProductCheckInItem để Sếp nghiệm thu KPI
    const newCheckIn: ProductCheckInItem = {
      id: `CKIN-${Date.now().toString().slice(-4)}`,
      maSanPham: `SP-VB-${newSoDi}`,
      tenSanPham: `Văn bản phát hành số ${soKyHieuChinhThuc}: ${target.trichYeu}`,
      canBoId: "cb_van_hoa",
      canBoName: target.nguoiSoan,
      linhVuc: "VAN_HOA_XA_HOI",
      ngayNop: now.toLocaleDateString("vi-VN"),
      fileDinhKemUrl: target.tepDinhKem,
      fileType: "PDF",
      trangThai: "DANG_THAM_DINH",
      moTaChiTiet: `Văn bản đi đã ký số SmartCA và phát hành liên thông VDXP. Đề nghị Lãnh đạo nghiệm thu KPI.`,
    };

    // 3. Nếu có liên kết văn bản đến, chuyển văn bản đến thành ĐÃ_HOAN_THANH
    let updatedVbDen = state.vanBanDenList;
    if (target.vanBanDenLienQuanId) {
      updatedVbDen = state.vanBanDenList.map((v) =>
        v.id === target.vanBanDenLienQuanId ? { ...v, trangThai: "DA_HOAN_THANH" as const } : v
      );
    }

    state = {
      ...state,
      vanBanDiList: updatedVbDi,
      vanBanDenList: updatedVbDen,
      productCheckInList: [newCheckIn, ...state.productCheckInList],
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toLocaleString("vi-VN"),
          action: "Ký số & Phát hành Văn bản đi",
          details: `Phát hành số ${soKyHieuChinhThuc} ký bởi ${lanhDaoKy} (${chucVu})`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };

    notify();
  },

  tiepNhanHoSoMotCuaMoi(payload: {
    tenThuTuc: string;
    maTthc: string;
    linhVuc: HoSoMotCuaLienThongItem["linhVuc"];
    mucDoDvc: HoSoMotCuaLienThongItem["mucDoDvc"];
    nguoiNop: string;
    cccd: string;
    soDienThoai: string;
    diaChi: string;
    ngayHenTra: string;
    canBoThuLy: string;
    lePhiVND: number;
    trangThaiThanhToan: HoSoMotCuaLienThongItem["trangThaiThanhToan"];
  }) {
    const now = new Date();
    const id = `MC-${Date.now().toString().slice(-4)}`;
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const maHoSo = `H50.01-261027-${randomSeq}`;

    const newHoSo: HoSoMotCuaLienThongItem = {
      id,
      maHoSo,
      ...payload,
      ngayTiepNhan: now.toLocaleString("vi-VN"),
      trangThai: "DANG_THU_LY",
      mauBieuSuDung: "MAU_01_GIAY_HEN",
    };

    state = {
      ...state,
      hoSoMotCuaLienThongList: [newHoSo, ...state.hoSoMotCuaLienThongList],
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toLocaleString("vi-VN"),
          action: "Tiếp nhận hồ sơ Một cửa điện tử",
          details: `Mã hồ sơ ${maHoSo} người nộp ${payload.nguoiNop} (${payload.tenThuTuc})`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };

    notify();
    return newHoSo;
  },

  taoPhieuYeuCauBoSungMau02(hoSoId: string, lyDo: string) {
    const now = new Date();
    const updated = state.hoSoMotCuaLienThongList.map((h) =>
      h.id === hoSoId
        ? {
            ...h,
            trangThai: "CHO_BO_SUNG" as const,
            mauBieuSuDung: "MAU_02_PHIEU_BO_SUNG" as const,
            lyDoBoSungHoacXinLoi: lyDo,
          }
        : h
    );

    state = {
      ...state,
      hoSoMotCuaLienThongList: updated,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toLocaleString("vi-VN"),
          action: "Ban hành Phiếu yêu cầu bổ sung hồ sơ (Mẫu 02/NĐ 61)",
          details: `Hồ sơ ID ${hoSoId}: ${lyDo}`,
          status: "WARNING",
        },
        ...state.auditLogs,
      ],
    };

    notify();
  },

  taoPhieuXinLoiMau04(hoSoId: string, lyDo: string, ngayHenMoi: string) {
    const now = new Date();
    const updated = state.hoSoMotCuaLienThongList.map((h) =>
      h.id === hoSoId
        ? {
            ...h,
            mauBieuSuDung: "MAU_04_PHIEU_XIN_LOI" as const,
            lyDoBoSungHoacXinLoi: lyDo,
            ngayHenTraMoi: ngayHenMoi,
          }
        : h
    );

    state = {
      ...state,
      hoSoMotCuaLienThongList: updated,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toLocaleString("vi-VN"),
          action: "Ban hành Phiếu xin lỗi và hẹn lại ngày trả (Mẫu 04/NĐ 61)",
          details: `Hồ sơ ID ${hoSoId} hẹn lại đến ngày ${ngayHenMoi}`,
          status: "WARNING",
        },
        ...state.auditLogs,
      ],
    };

    notify();
  },

  traKetQuaHoSoMotCua(hoSoId: string, soKyHieuKetQua: string) {
    const now = new Date();
    const maXacThuc = `SHA256:${Date.now().toString(16)}a${Math.random().toString(16).slice(2, 8)}`;

    const updated = state.hoSoMotCuaLienThongList.map((h) =>
      h.id === hoSoId
        ? {
            ...h,
            trangThai: "DA_HOAN_THANH" as const,
            soKyHieuKetQua,
            ngayTraThucTe: now.toLocaleDateString("vi-VN"),
            maXacThucDienTu: maXacThuc,
          }
        : h
    );

    state = {
      ...state,
      hoSoMotCuaLienThongList: updated,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toLocaleString("vi-VN"),
          action: "Trả kết quả TTHC Một cửa & Cấp kết quả điện tử",
          details: `Hồ sơ ID ${hoSoId} - Số kết quả: ${soKyHieuKetQua}`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };

    notify();
  },

  ghiNhanTiepCongDan(payload: Omit<TiepCongDanItem, "id" | "maSoDon">) {
    const now = new Date();
    const id = `TCD-${Date.now().toString().slice(-4)}`;
    const randomSeq = Math.floor(10 + Math.random() * 90);
    const maSoDon = `TCD-PC-2026-0${randomSeq}`;

    const newTcd: TiepCongDanItem = {
      ...payload,
      id,
      maSoDon,
    };

    state = {
      ...state,
      tiepCongDanList: [newTcd, ...state.tiepCongDanList],
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toLocaleString("vi-VN"),
          action: "Ghi nhận Sổ Tiếp công dân định kỳ",
          details: `Đơn ${maSoDon} của công dân ${payload.hoTenCongDan} (${payload.phanLoai})`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };

    notify();
    return newTcd;
  },

  themLichTuan(payload: Omit<LichTuanItem, "id">) {
    const id = `LT-${Date.now().toString().slice(-4)}`;
    const newLich: LichTuanItem = {
      ...payload,
      id,
    };

    state = {
      ...state,
      lichTuanList: [newLich, ...state.lichTuanList],
    };

    notify();
    return newLich;
  },

  // ============================================================================
  // HÀM NGHIỆP VỤ QUẢN LÝ MỘ LIỆT SĨ & CHỖ THỜ LIỆT SĨ KHU PHỐ (NĐ 131/2021)
  // ============================================================================

  taoYeuCauXuLyMo(
    payload: Omit<YeuCauXuLyMoItem, "id" | "maHoSoYeuCau" | "trangThai" | "ngayNop">
  ) {
    const now = new Date();
    const id = `YC-MO-${Date.now().toString().slice(-4)}`;
    const randomSeq = Math.floor(10 + Math.random() * 90);
    const maHoSoYeuCau = `HS-${payload.loaiYeuCau.slice(0, 4)}-2026-${randomSeq}`;

    const newYc: YeuCauXuLyMoItem = {
      ...payload,
      id,
      maHoSoYeuCau,
      ngayNop: now.toLocaleDateString("vi-VN"),
      trangThai: "CHO_KHAO_SAT",
    };

    state = {
      ...state,
      yeuCauXuLyMoList: [newYc, ...state.yeuCauXuLyMoList],
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toLocaleString("vi-VN"),
          action: "Tiếp nhận hồ sơ xử lý mộ liệt sĩ",
          details: `${payload.nguoiYeuCau} yêu cầu ${payload.loaiYeuCau} cho liệt sĩ ${payload.tenLietSi}`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };

    notify();
    return newYc;
  },

  pheDuyetTuBoMo(yeuCauId: string, kinhPhi: number, soQuyetDinh: string) {
    const now = new Date();
    const targetYc = state.yeuCauXuLyMoList.find((y) => y.id === yeuCauId);
    if (!targetYc) return;

    // 1. Cập nhật yêu cầu thành Đã phê duyệt
    const updatedYcList = state.yeuCauXuLyMoList.map((y) =>
      y.id === yeuCauId
        ? {
            ...y,
            kinhPhiDeXuatVND: kinhPhi,
            soQuyetDinhUbnd: soQuyetDinh,
            trangThai: "DA_PHE_DUYET" as const,
          }
        : y
    );

    // 2. Thêm vào lịch sử xử lý của liệt sĩ
    const updatedLietSiList = state.lietsiKhuPhoList.map((ls) => {
      if (ls.id === targetYc.lietsiId) {
        const newLichSu: LichSuXuLyMoItem = {
          id: `LSXL-${Date.now().toString().slice(-4)}`,
          ngayThucHien: now.toLocaleDateString("vi-VN"),
          loaiXuLy: "TU_BO_VO_MO",
          noiDungChiTiet: `Chủ tịch UBND Phường ban hành Quyết định ${soQuyetDinh} cấp kinh phí hỗ trợ xây vỏ mộ ${kinhPhi.toLocaleString("vi-VN")} đ theo Điều 152 Nghị định 131/2021`,
          canBoThucHien: state.currentUser.fullName,
          kinhPhiHoTroVND: kinhPhi,
          soQuyetDinh,
          trangThai: "DANG_XU_LY",
        };
        return {
          ...ls,
          tinhTrangMo: "DANG_TU_BO" as const,
          lichSuXuLy: [newLichSu, ...ls.lichSuXuLy],
        };
      }
      return ls;
    });

    state = {
      ...state,
      yeuCauXuLyMoList: updatedYcList,
      lietsiKhuPhoList: updatedLietSiList,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toLocaleString("vi-VN"),
          action: "Phê duyệt kinh phí tu bổ vỏ mộ liệt sĩ",
          details: `QĐ: ${soQuyetDinh} - Mức hỗ trợ: ${kinhPhi.toLocaleString("vi-VN")} đ`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };

    notify();
  },

  dinhChinhBiaMo(lietsiId: string, yeuCauId: string, noiDungDinhChinh: string, soQuyetDinh: string) {
    const now = new Date();

    const updatedLietSiList = state.lietsiKhuPhoList.map((ls) => {
      if (ls.id === lietsiId) {
        const newLichSu: LichSuXuLyMoItem = {
          id: `LSXL-${Date.now().toString().slice(-4)}`,
          ngayThucHien: now.toLocaleDateString("vi-VN"),
          loaiXuLy: "DINH_CHINH_BIA",
          noiDungChiTiet: `Đính chính thông tin bia mộ: ${noiDungDinhChinh} (Căn cứ QĐ: ${soQuyetDinh})`,
          canBoThucHien: state.currentUser.fullName,
          kinhPhiHoTroVND: 0,
          soQuyetDinh,
          trangThai: "DA_HOAN_THANH",
        };
        return {
          ...ls,
          tinhTrangBia: "RO_NET" as const,
          lichSuXuLy: [newLichSu, ...ls.lichSuXuLy],
        };
      }
      return ls;
    });

    const updatedYcList = state.yeuCauXuLyMoList.map((y) =>
      y.id === yeuCauId
        ? {
            ...y,
            noiDungDinhChinhHoacNoiDen: noiDungDinhChinh,
            soQuyetDinhUbnd: soQuyetDinh,
            trangThai: "DA_HOAN_THANH" as const,
          }
        : y
    );

    state = {
      ...state,
      lietsiKhuPhoList: updatedLietSiList,
      yeuCauXuLyMoList: updatedYcList,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toLocaleString("vi-VN"),
          action: "Đính chính thông tin bia mộ liệt sĩ",
          details: `Liệt sĩ ID ${lietsiId}: ${noiDungDinhChinh}`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };

    notify();
  },

  diChuyenHaiCotMo(lietsiId: string, yeuCauId: string, noiDenMoi: string, soQuyetDinh: string) {
    const now = new Date();

    const updatedLietSiList = state.lietsiKhuPhoList.map((ls) => {
      if (ls.id === lietsiId) {
        const newLichSu: LichSuXuLyMoItem = {
          id: `LSXL-${Date.now().toString().slice(-4)}`,
          ngayThucHien: now.toLocaleDateString("vi-VN"),
          loaiXuLy: "DI_CHUYEN_HAI_COT",
          noiDungChiTiet: `Cất bốc và di chuyển hài cốt liệt sĩ về ${noiDenMoi} theo Quyết định ${soQuyetDinh}`,
          canBoThucHien: state.currentUser.fullName,
          kinhPhiHoTroVND: 4000000,
          soQuyetDinh,
          trangThai: "DA_HOAN_THANH",
        };
        return {
          ...ls,
          chiTietViTriMo: noiDenMoi,
          tinhTrangMo: "DA_DI_CHUYEN" as const,
          lichSuXuLy: [newLichSu, ...ls.lichSuXuLy],
        };
      }
      return ls;
    });

    const updatedYcList = state.yeuCauXuLyMoList.map((y) =>
      y.id === yeuCauId
        ? {
            ...y,
            noiDungDinhChinhHoacNoiDen: noiDenMoi,
            soQuyetDinhUbnd: soQuyetDinh,
            trangThai: "DA_HOAN_THANH" as const,
          }
        : y
    );

    state = {
      ...state,
      lietsiKhuPhoList: updatedLietSiList,
      yeuCauXuLyMoList: updatedYcList,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toLocaleString("vi-VN"),
          action: "Di chuyển hài cốt liệt sĩ",
          details: `Di chuyển về ${noiDenMoi} (QĐ: ${soQuyetDinh})`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };

    notify();
  },

  capNhatChiTraThoCung(lietsiId: string, daNhan: boolean) {
    const updated = state.lietsiKhuPhoList.map((ls) =>
      ls.id === lietsiId
        ? {
            ...ls,
            thongTinThoCung: {
              ...ls.thongTinThoCung,
              daNhanTroCap277: daNhan,
            },
          }
        : ls
    );

    state = {
      ...state,
      lietsiKhuPhoList: updated,
    };
    notify();
  },

  thapHuongNhaBiaKhuPho(choThoId: string) {
    const updated = state.choThoKhuPhoList.map((ct) =>
      ct.id === choThoId
        ? {
            ...ct,
            luotDangHuong: ct.luotDangHuong + 1,
          }
        : ct
    );

    state = {
      ...state,
      choThoKhuPhoList: updated,
    };
    notify();
  },

  // =========================================================================
  // NGHIỆP VỤ CHẤM ĐIỂM KPI ĐA CHIỀU & CƠ CHẾ THƯỞNG PHẠT TỰ ĐỘNG
  // (Nghị định 90/2020/NĐ-CP & Nghị định 48/2023/NĐ-CP)
  // =========================================================================

  capNhatTuChamKpi(
    evaluationId: string,
    tieuChiData: {
      tc1: number;
      tc2: number;
      tc3: number;
      tc4: number;
      tc5: number;
      ghiChu?: string;
    }
  ) {
    const updated = state.kpiEvaluationList.map((kpi) => {
      if (kpi.id !== evaluationId) return kpi;

      const tc1 = Math.min(40, Math.max(0, tieuChiData.tc1));
      const tc2 = Math.min(25, Math.max(0, tieuChiData.tc2));
      const tc3 = Math.min(15, Math.max(0, tieuChiData.tc3));
      const tc4 = Math.min(10, Math.max(0, tieuChiData.tc4));
      const tc5 = Math.min(10, Math.max(0, tieuChiData.tc5));
      const tongTuCham = tc1 + tc2 + tc3 + tc4 + tc5;

      return {
        ...kpi,
        tieuChi1_NhiemVuChuyenMon: { ...kpi.tieuChi1_NhiemVuChuyenMon, diemTuCham: tc1 },
        tieuChi2_MotCuaDvcQd766: { ...kpi.tieuChi2_MotCuaDvcQd766, diemTuCham: tc2 },
        tieuChi3_CsatHaiLongDan: { ...kpi.tieuChi3_CsatHaiLongDan, diemTuCham: tc3 },
        tieuChi4_KyLuatVanHoaCongSo: { ...kpi.tieuChi4_KyLuatVanHoaCongSo, diemTuCham: tc4 },
        tieuChi5_SangKienChuyenDoiSo: { ...kpi.tieuChi5_SangKienChuyenDoiSo, diemTuCham: tc5 },
        diemTuChamTong: tongTuCham,
        trangThai: "CHO_LANH_DAO_DUYET" as const,
      };
    });

    state = {
      ...state,
      kpiEvaluationList: updated,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toLocaleString("vi-VN"),
          action: "Cán bộ tự chấm điểm KPI",
          details: `Cán bộ cập nhật bảng tự chấm điểm KPI phiếu ID: ${evaluationId}`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };
    notify();
  },

  ghiNhanDiemThuongPhat(
    evaluationId: string,
    item: {
      loai: "THUONG" | "PHAT";
      soDiem: number;
      maLoiHoacSangKien: string;
      lyDo: string;
      chungTuLienQuan?: string;
    }
  ) {
    const newItem: DiemThuongPhatItem = {
      id: `TP-${Date.now().toString().slice(-4)}`,
      loai: item.loai,
      soDiem: Math.abs(item.soDiem),
      maLoiHoacSangKien: item.maLoiHoacSangKien,
      lyDo: item.lyDo,
      ngayGhiNhan: new Date().toLocaleDateString("vi-VN"),
      nguoiQuyetDinh: state.currentUser.fullName || "Lãnh đạo UBND Phường",
      chungTuLienQuan: item.chungTuLienQuan,
    };

    const updated = state.kpiEvaluationList.map((kpi) => {
      if (kpi.id !== evaluationId) return kpi;

      const danhSachMoi = [newItem, ...kpi.danhSachThuongPhat];
      const tongThuong = danhSachMoi.filter((d) => d.loai === "THUONG").reduce((acc, d) => acc + d.soDiem, 0);
      const tongTru = danhSachMoi.filter((d) => d.loai === "PHAT").reduce((acc, d) => acc + d.soDiem, 0);

      // Điểm tổng kết = Điểm Lãnh đạo (hoặc Hệ thống) + Thưởng - Phạt
      const diemGoc = kpi.diemLanhDaoTong || kpi.diemHeThongAutoTong;
      const diemTongKet = Math.min(100, Math.max(0, diemGoc + tongThuong - tongTru));

      let xepLoai: KpiEvaluationItem["xepLoai"] = "HOAN_THANH_TOT";
      if (diemTongKet >= 90 && tongTru === 0) xepLoai = "HOAN_THANH_XUAT_SAC";
      else if (diemTongKet >= 70) xepLoai = "HOAN_THANH_TOT";
      else if (diemTongKet >= 50) xepLoai = "HOAN_THANH";
      else xepLoai = "KHONG_HOAN_THANH";

      return {
        ...kpi,
        danhSachThuongPhat: danhSachMoi,
        tongDiemThuong: tongThuong,
        tongDiemTru: tongTru,
        diemTongKetCuoiCung: diemTongKet,
        xepLoai,
      };
    });

    state = {
      ...state,
      kpiEvaluationList: updated,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toLocaleString("vi-VN"),
          action: `Ghi nhận điểm ${item.loai === "THUONG" ? "thưởng" : "trừ"} KPI`,
          details: `${item.loai === "THUONG" ? "+" : "-"}${item.soDiem} điểm cho hồ sơ KPI ${evaluationId}. Lý do: ${item.lyDo}`,
          status: item.loai === "THUONG" ? "SUCCESS" : "WARNING",
        },
        ...state.auditLogs,
      ],
    };
    notify();
  },

  lanhDaoPheDuyetKpi(
    evaluationId: string,
    payload: {
      diemLanhDao?: number;
      nhanXetButPhe: string;
      deXuatKhenThuong?: string;
      maKySoSmartCA?: string;
    }
  ) {
    const updated = state.kpiEvaluationList.map((kpi) => {
      if (kpi.id !== evaluationId) return kpi;

      const diemLanhDao = payload.diemLanhDao !== undefined ? payload.diemLanhDao : kpi.diemLanhDaoTong;
      const diemTongKet = Math.min(100, Math.max(0, diemLanhDao + kpi.tongDiemThuong - kpi.tongDiemTru));

      let xepLoai: KpiEvaluationItem["xepLoai"] = "HOAN_THANH_TOT";
      if (diemTongKet >= 90 && kpi.tongDiemTru === 0) xepLoai = "HOAN_THANH_XUAT_SAC";
      else if (diemTongKet >= 70) xepLoai = "HOAN_THANH_TOT";
      else if (diemTongKet >= 50) xepLoai = "HOAN_THANH";
      else xepLoai = "KHONG_HOAN_THANH";

      return {
        ...kpi,
        diemLanhDaoTong: diemLanhDao,
        diemTongKetCuoiCung: diemTongKet,
        xepLoai,
        trangThai: "DA_PHE_DUYET" as const,
        lanhDaoThamDinh: {
          nguoiDuyet: state.currentUser.fullName || "TS. Nguyễn Văn Hùng",
          chucVu: state.currentUser.title || "Lãnh đạo UBND Phường",
          ngayDuyet: new Date().toLocaleDateString("vi-VN"),
          nhanXetButPhe: payload.nhanXetButPhe,
          deXuatKhenThuong: payload.deXuatKhenThuong,
          maKySoSmartCA: payload.maKySoSmartCA || `SHA256:${Date.now().toString(16)}...smartca`,
        },
      };
    });

    state = {
      ...state,
      kpiEvaluationList: updated,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toLocaleString("vi-VN"),
          action: "Lãnh đạo phê duyệt bảng điểm KPI",
          details: `Phê chuẩn kết quả đánh giá KPI phiếu ${evaluationId}. Xếp loại: ${updated.find((k) => k.id === evaluationId)?.xepLoai}`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };
    notify();
  },

  // ==========================================================================
  // GÓI 1: BẾP ĂN BÁN TRÚ HỌC ĐƯỜNG & SỔ KIỂM THỰC 3 BƯỚC (QĐ 1246/QĐ-BYT)
  // ==========================================================================
  themKiemThuc3Buoc(data: Omit<KiemThuc3BuocItem, "id" | "maPhieu">) {
    const newItem: KiemThuc3BuocItem = {
      ...data,
      id: `KT3B-${Date.now().toString().slice(-4)}`,
      maPhieu: `KT3B-2026-${Date.now().toString().slice(-4)}`,
    };
    state = {
      ...state,
      kiemThuc3BuocList: [newItem, ...state.kiemThuc3BuocList],
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toLocaleString("vi-VN"),
          action: "Kiểm tra ATTP Bếp ăn Bán trú",
          details: `Lập sổ kiểm thực 3 bước cho ${newItem.tenCoSo}. Kết luận: ${newItem.ketLuanChung}`,
          status: newItem.ketLuanChung === "DU_DIEU_KIEN_AN_TOAN" ? "SUCCESS" : "WARNING",
        },
        ...state.auditLogs,
      ],
    };
    notify();
  },

  // ==========================================================================
  // GÓI 2: ĐIỀU DƯỠNG NGƯỜI CÓ CÔNG (PHÁP LỆNH 02/2020) & HỌC NGHỀ KCN
  // ==========================================================================
  dangKyDieuDuongNcc(data: Omit<DieuDuongNccItem, "id" | "maHoSo" | "trangThai">) {
    const newItem: DieuDuongNccItem = {
      ...data,
      id: `DD-${Date.now().toString().slice(-4)}`,
      maHoSo: `NCC-DD-2026-${Date.now().toString().slice(-4)}`,
      trangThai: "CHO_DUYET",
    };
    state = {
      ...state,
      dieuDuongNccList: [newItem, ...state.dieuDuongNccList],
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toLocaleString("vi-VN"),
          action: "Đăng ký điều dưỡng Người có công",
          details: `Lập hồ sơ điều dưỡng năm 2026 cho ${newItem.hoTen} (${newItem.hinhThucDangKy === "TAP_TRUNG" ? "Tập trung" : "Tại nhà"})`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };
    notify();
  },

  pheDuyetDieuDuongNcc(id: string, payload: { soQuyetDinh: string; hinhThuc?: "TAP_TRUNG" | "TAI_NHA" }) {
    const updated = state.dieuDuongNccList.map((item) => {
      if (item.id !== id) return item;
      return {
        ...item,
        trangThai: "DA_PHE_DUYET" as const,
        soQuyetDinh: payload.soQuyetDinh,
        ngayQuyetDinh: new Date().toLocaleDateString("vi-VN"),
        hinhThucDangKy: payload.hinhThuc || item.hinhThucDangKy,
      };
    });
    state = {
      ...state,
      dieuDuongNccList: updated,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toLocaleString("vi-VN"),
          action: "Phê duyệt chế độ điều dưỡng NCC",
          details: `Phê duyệt danh sách điều dưỡng hồ sơ ${id}. Số QĐ: ${payload.soQuyetDinh}`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };
    notify();
  },

  chiTraDieuDuongNcc(id: string) {
    const updated = state.dieuDuongNccList.map((item) => {
      if (item.id !== id) return item;
      return {
        ...item,
        trangThai: "DA_CHI_TRA_HOAN_TAT" as const,
      };
    });
    state = {
      ...state,
      dieuDuongNccList: updated,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toLocaleString("vi-VN"),
          action: "Chi trả kinh phí điều dưỡng NCC",
          details: `Hoàn tất chi trả chế độ điều dưỡng hồ sơ ${id}`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };
    notify();
  },

  themKhaoSatHocNghe(data: Omit<KhaoSatHocNgheItem, "id">) {
    const newItem: KhaoSatHocNgheItem = {
      ...data,
      id: `HN-${Date.now().toString().slice(-4)}`,
    };
    state = {
      ...state,
      khaoSatHocNgheList: [newItem, ...state.khaoSatHocNgheList],
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toLocaleString("vi-VN"),
          action: "Khảo sát nhu cầu học nghề",
          details: `Tiếp nhận phiếu đăng ký học nghề của ${newItem.hoTen} (${newItem.nguyenVongHocNghe})`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };
    notify();
  },

  // ==========================================================================
  // GÓI 3: ĐỘI KIỂM TRA LIÊN NGÀNH 814 & ĐÔ THỊ VĂN MINH (QĐ 04/2022)
  // ==========================================================================
  themKiemTra814(data: Partial<KiemTra814Item>) {
    const newItem: any = {
      id: data.id || `KT814-${Date.now().toString().slice(-4)}`,
      soBienBan: data.soBienBan || `BB-814-2026-${Date.now().toString().slice(-4)}`,
      tenCoSo: data.tenCoSo || "Cơ sở dịch vụ",
      loaiHinh: data.loaiHinh || "KARAOKE",
      diaChi: data.diaChi || "Khu phố 1",
      ngayKiemTra: data.ngayKiemTra || new Date().toISOString().split("T")[0],
      thanhPhanDoan: data.thanhPhanDoan || ["Công an Phường", "Công chức VH-XH", "Bảo vệ dân phố"],
      noiDungKiemTra: data.noiDungKiemTra || "Kiểm tra chấp hành quy chế văn hóa và an toàn PCCC",
      hanhViViPham: data.hanhViViPham || [],
      ketLuan: data.ketLuan || "CHUP_HANH_TOT",
      soTienPhatVND: data.soTienPhatVND || 0,
      soTienXuPhatDuKienVND: data.soTienXuPhatDuKienVND || data.soTienPhatVND || 0,
      bienPhapXuLy: data.bienPhapXuLy || data.bienPhapKhac || "Nhắc nhở chấp hành nghiêm quy chế văn hóa",
      daNopPhat: data.daNopPhat ?? (data.soTienPhatVND ? false : true),
      trangThai: data.trangThai || "DA_KIEM_TRA",
      nguoiLapBienBan: data.nguoiLapBienBan || "Tổ trưởng Đội 814",
    };
    state = {
      ...state,
      kiemTra814List: [newItem, ...state.kiemTra814List],
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toLocaleString("vi-VN"),
          action: "Đội 814 kiểm tra liên ngành",
          details: `Lập biên bản kiểm tra cơ sở ${newItem.tenCoSo} (${newItem.loaiHinh})`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };
    notify();
  },

  xuLyViPham814(
    id: string,
    payload: {
      bienPhapXuLy?: KiemTra814Item["bienPhapXuLy"];
      bienPhapKhac?: string;
      ketLuan?: KiemTra814Item["ketLuan"];
      soTienXuPhatDuKienVND?: number;
      soTienPhatVND?: number;
      trangThai?: KiemTra814Item["trangThai"];
      daNopPhat?: boolean;
    }
  ) {
    const updated = state.kiemTra814List.map((item) => {
      if (item.id !== id) return item;
      const soTien = payload.soTienPhatVND !== undefined ? payload.soTienPhatVND : (payload.soTienXuPhatDuKienVND !== undefined ? payload.soTienXuPhatDuKienVND : item.soTienPhatVND);
      return {
        ...item,
        ketLuan: payload.ketLuan || item.ketLuan,
        bienPhapXuLy: payload.bienPhapXuLy || payload.bienPhapKhac || item.bienPhapXuLy,
        soTienPhatVND: soTien,
        soTienXuPhatDuKienVND: soTien,
        daNopPhat: payload.daNopPhat !== undefined ? payload.daNopPhat : item.daNopPhat,
        trangThai: payload.trangThai || "DA_RA_QUYET_DINH",
      };
    });
    state = {
      ...state,
      kiemTra814List: updated,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toLocaleString("vi-VN"),
          action: "Xử lý vi phạm Đội 814",
          details: `Ban hành biện pháp xử lý cho biên bản ${id}`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };
    notify();
  },

  danhGiaDoThiVanMinh(
    id: string,
    arg2: number | { datChuan?: boolean; diemDanhGia?: number; ghiChu?: string; nguoiDanhGia?: string },
    ketQua?: "DAT_CHUAN" | "CAN_BO_SUNG",
    ghiChuThucHien?: string
  ) {
    const updated = state.doThiVanMinhList.map((item) => {
      if (item.id !== id) return item;
      if (typeof arg2 === "object" && arg2 !== null) {
        return {
          ...item,
          datChuan: arg2.datChuan ?? item.datChuan,
          diemDanhGia: arg2.diemDanhGia !== undefined ? arg2.diemDanhGia : item.diemDanhGia,
          diemDatDuoc: arg2.diemDanhGia !== undefined ? arg2.diemDanhGia : item.diemDatDuoc,
          ghiChuThucHien: arg2.ghiChu || item.ghiChuThucHien,
          ghiChu: arg2.ghiChu || item.ghiChu,
          nguoiDanhGia: arg2.nguoiDanhGia || item.nguoiDanhGia,
        };
      }
      return {
        ...item,
        diemDatDuoc: arg2,
        diemDanhGia: arg2,
        ketQua: ketQua || (arg2 >= item.diemToiDa * 0.8 ? "DAT_CHUAN" : "CAN_BO_SUNG"),
        datChuan: (ketQua === "DAT_CHUAN") || (arg2 >= item.diemToiDa * 0.8),
        ghiChuThucHien: ghiChuThucHien || item.ghiChuThucHien,
      };
    });
    state = {
      ...state,
      doThiVanMinhList: updated,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toLocaleString("vi-VN"),
          action: "Đánh giá Tiêu chí Đô thị văn minh",
          details: `Cập nhật tiêu chí ${id}`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };
    notify();
  },

  // ==========================================================================
  // GÓI 4: PHẢN ÁNH HIỆN TRƯỜNG 1022 & BỘ CHỈ SỐ DTI CẤP XÃ
  // ==========================================================================
  tiepNhanPhanAnh1022(data: Omit<PhanAnh1022Item, "id" | "maPhanAnh" | "trangThai">) {
    const newItem: PhanAnh1022Item = {
      ...data,
      id: `PA-${Date.now().toString().slice(-4)}`,
      maPhanAnh: `PA1022-2026-${Date.now().toString().slice(-4)}`,
      trangThai: "TIEP_NHAN",
    };
    state = {
      ...state,
      phanAnh1022List: [newItem, ...state.phanAnh1022List],
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toLocaleString("vi-VN"),
          action: "Tiếp nhận phản ánh 1022/IOC",
          details: `Phản ánh lĩnh vực ${newItem.linhVuc} tại ${newItem.diaDiem || (newItem as any).diaChiSuCo}`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };
    notify();
  },

  xuLyPhanAnh1022(
    id: string,
    payload: {
      ketQuaXuLy: string;
      canBoXuLy?: string;
      anhSauXuLy?: string;
      trangThai?: PhanAnh1022Item["trangThai"];
      danhGiaCuaDan?: PhanAnh1022Item["danhGiaCuaDan"];
    }
  ) {
    const updated = state.phanAnh1022List.map((item) => {
      if (item.id !== id) return item;
      return {
        ...item,
        ketQuaXuLy: payload.ketQuaXuLy,
        canBoXuLy: payload.canBoXuLy || item.canBoXuLy || "Công chức xử lý",
        anhSauXuLy: payload.anhSauXuLy || item.anhSauXuLy,
        ngayHoanThanh: new Date().toLocaleString("vi-VN"),
        trangThai: payload.trangThai || "DA_XU_LY",
        danhGiaCuaDan: payload.danhGiaCuaDan || item.danhGiaCuaDan || "RAT_HAI_LONG",
      };
    });
    state = {
      ...state,
      phanAnh1022List: updated,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toLocaleString("vi-VN"),
          action: "Xử lý phản ánh hiện trường 1022",
          details: `Hoàn tất xử lý phản ánh ${id}. Nội dung: ${payload.ketQuaXuLy}`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };
    notify();
  },

  capNhatChiSoDti(
    id: string,
    arg2: number | { giaTriHienTai?: string; diemDatDuoc?: number; ghiChuMinhChung?: string }
  ) {
    const updated = state.dtiCapXaList.map((item) => {
      if (item.id !== id) return item;
      if (typeof arg2 === "object" && arg2 !== null) {
        return {
          ...item,
          giaTriHienTai: arg2.giaTriHienTai || item.giaTriHienTai,
          diemDatDuoc: arg2.diemDatDuoc !== undefined ? arg2.diemDatDuoc : item.diemDatDuoc,
          ghiChuMinhChung: arg2.ghiChuMinhChung || item.ghiChuMinhChung,
        };
      }
      const thucTeDat = arg2;
      const danhGia = thucTeDat >= item.chiTieuGiao ? (thucTeDat > item.chiTieuGiao ? "VUOT_CHI_TIEU" : "DAT") : "CAN_PHAN_DAU";
      return {
        ...item,
        thucTeDat,
        danhGia,
      };
    });
    state = {
      ...state,
      dtiCapXaList: updated,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toLocaleString("vi-VN"),
          action: "Cập nhật Chỉ số Chuyển đổi số DTI",
          details: `Cập nhật chỉ số DTI ${id}`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };
    notify();
  },

  // ==========================================================================
  // GÓI BỔ SUNG 1: PHỔ CẬP GIÁO DỤC & CỘNG ĐỒNG HỌC TẬP (NĐ 20/2014 & TT 44/2014)
  // ==========================================================================
  themDieuTraPhoCap(data: Partial<PhoCapGiaoDucItem>) {
    const newItem: PhoCapGiaoDucItem = {
      id: data.id || `PC-${Date.now().toString().slice(-4)}`,
      khuPho: data.khuPho || "Khu phố 1",
      bacHoc: data.bacHoc || "TIEU_HOC",
      doTuoiDieuTra: data.doTuoiDieuTra || "Độ tuổi 6 - 11 tuổi",
      tongSoTre: data.tongSoTre || 100,
      soTreDiHoc: data.soTreDiHoc || 99,
      soTreBoHoc: data.soTreBoHoc || 0,
      soTreNguyCoBoHoc: data.soTreNguyCoBoHoc || 1,
      tyLeHuyDongPercent: data.tyLeHuyDongPercent || (data.tongSoTre ? +(((data.soTreDiHoc || 99) / data.tongSoTre) * 100).toFixed(2) : 99.5),
      mucDoDatChuan: data.mucDoDatChuan || "Đạt chuẩn Mức độ 3",
      namDieuTra: data.namDieuTra || 2026,
      canBoPhuTrach: data.canBoPhuTrach || "Cán bộ phụ trách PCGD",
      bienPhapVanDong: data.bienPhapVanDong || "Vận động gia đình cho con em đến trường đầy đủ",
    };
    state = {
      ...state,
      phoCapGiaoDucList: [newItem, ...state.phoCapGiaoDucList],
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toLocaleString("vi-VN"),
          action: "Điều tra Phổ cập giáo dục",
          details: `Ghi nhận dữ liệu phổ cập ${newItem.bacHoc} tại ${newItem.khuPho}`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };
    notify();
  },

  danhGiaCongDongHocTap(
    id: string,
    arg2: number | { diemTuDanhGia?: number; diemDoanKiemTra?: number; minhChungKetQua?: string },
    diemDoanKiemTra?: number,
    minhChungKetQua?: string
  ) {
    const updated = state.congDongHocTapList.map((item) => {
      if (item.id !== id) return item;
      if (typeof arg2 === "object" && arg2 !== null) {
        return {
          ...item,
          diemTuDanhGia: arg2.diemTuDanhGia !== undefined ? arg2.diemTuDanhGia : item.diemTuDanhGia,
          diemDoanKiemTra: arg2.diemDoanKiemTra !== undefined ? arg2.diemDoanKiemTra : item.diemDoanKiemTra,
          minhChungKetQua: arg2.minhChungKetQua || item.minhChungKetQua,
        };
      }
      return {
        ...item,
        diemTuDanhGia: arg2,
        diemDoanKiemTra: diemDoanKiemTra !== undefined ? diemDoanKiemTra : item.diemDoanKiemTra,
        minhChungKetQua: minhChungKetQua || item.minhChungKetQua,
      };
    });
    state = {
      ...state,
      congDongHocTapList: updated,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toLocaleString("vi-VN"),
          action: "Đánh giá Cộng đồng học tập",
          details: `Cập nhật tiêu chí ${id}`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };
    notify();
  },

  // ==========================================================================
  // GÓI BỔ SUNG 2: THỜ CÚNG LIỆT SĨ & HỘI ĐỒNG KHUYẾT TẬT (NĐ 131/2021 & TT 01/2019)
  // ==========================================================================
  dangKyThoCungLietSi(data: Partial<ThoCungLietSiItem>) {
    const newItem: ThoCungLietSiItem = {
      id: data.id || `TCLS-${Date.now().toString().slice(-4)}`,
      maHoSo: data.maHoSo || `TCLS/2026/${Date.now().toString().slice(-3)}`,
      hoTenLietSi: data.hoTenLietSi || "Liệt sĩ chưa cập nhật tên",
      namSinh: data.namSinh || 1950,
      namHySinh: data.namHySinh || 1972,
      queQuan: data.queQuan || "Phường Phú Cường, TP. Thủ Dầu Một",
      hoTenNguoiThoCung: data.hoTenNguoiThoCung || "Người thờ cúng",
      quanHeVoiLietSi: data.quanHeVoiLietSi || "Thân nhân",
      cccdNguoiThoCung: data.cccdNguoiThoCung || "074000000000",
      diaChiNguoiThoCung: data.diaChiNguoiThoCung || "Phường Phú Cường",
      khuPho: data.khuPho || "Khu phố 1",
      soVanBanUyQuyen: data.soVanBanUyQuyen || "Mẫu 04 - Giấy ủy quyền",
      dinhMucNamVND: data.dinhMucNamVND || 1400000,
      namChiTra: data.namChiTra || 2026,
      trangThaiChiTra: data.trangThaiChiTra || "CHO_CHI_TRA",
      hinhThucNhan: data.hinhThucNhan || "CHUYEN_KHOAN_ATM",
    };
    state = {
      ...state,
      thoCungLietSiList: [newItem, ...state.thoCungLietSiList],
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toLocaleString("vi-VN"),
          action: "Tiếp nhận thờ cúng liệt sĩ",
          details: `Ghi nhận hồ sơ thờ cúng Liệt sĩ ${newItem.hoTenLietSi} cho ông/bà ${newItem.hoTenNguoiThoCung}`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };
    notify();
  },

  chiTraThoCungLietSi(id: string, hinhThuc?: "TIEN_MAT" | "CHUYEN_KHOAN_ATM") {
    const updated = state.thoCungLietSiList.map((item) => {
      if (item.id !== id) return item;
      return {
        ...item,
        trangThaiChiTra: "DA_CHI_TRA" as const,
        ngayChiTra: new Date().toLocaleDateString("vi-VN"),
        hinhThucNhan: hinhThuc || item.hinhThucNhan,
      };
    });
    state = {
      ...state,
      thoCungLietSiList: updated,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toLocaleString("vi-VN"),
          action: "Chi trả trợ cấp thờ cúng liệt sĩ",
          details: `Đã chi trả 1.400.000 VNĐ cho hồ sơ ${id}`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };
    notify();
  },

  hopHoiDongKhuyetTat(data: Partial<HoiDongKhuyetTatItem>) {
    const newItem: HoiDongKhuyetTatItem = {
      id: data.id || `HDKT-${Date.now().toString().slice(-4)}`,
      maHoSo: data.maHoSo || `HDKT/2026/${Date.now().toString().slice(-3)}`,
      hoTen: data.hoTen || "Người yêu cầu xác định dạng tật",
      ngaySinh: data.ngaySinh || "01/01/1980",
      gioiTinh: data.gioiTinh || "NAM",
      cccd: data.cccd || "074000000000",
      diaChi: data.diaChi || "Phường Phú Cường",
      khuPho: data.khuPho || "Khu phố 1",
      dangTat: data.dangTat || "VAN_DONG",
      mucDoKhuyetTat: data.mucDoKhuyetTat || "NANG",
      ngayHopHoiDong: data.ngayHopHoiDong || new Date().toLocaleDateString("vi-VN"),
      thanhVienHoiDong: data.thanhVienHoiDong || "Hội đồng xét duyệt mức độ khuyết tật cấp phường",
      ketLuan: data.ketLuan || "Đủ điều kiện hưởng trợ cấp bảo trợ xã hội",
      soGiayXacNhan: data.soGiayXacNhan || `GCN-KT/2026/${Date.now().toString().slice(-3)}`,
      trangThaiCapGiay: data.trangThaiCapGiay || "CHO_XET_DUYET",
    };
    state = {
      ...state,
      hoiDongKhuyetTatList: [newItem, ...state.hoiDongKhuyetTatList],
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toLocaleString("vi-VN"),
          action: "Hội đồng xét duyệt khuyết tật",
          details: `Ghi nhận hồ sơ xét duyệt của ${newItem.hoTen} (${newItem.dangTat})`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };
    notify();
  },

  capGiayXacNhanKhuyetTat(id: string, soGiay?: string, ketLuan?: string) {
    const updated = state.hoiDongKhuyetTatList.map((item) => {
      if (item.id !== id) return item;
      return {
        ...item,
        trangThaiCapGiay: "DA_CAP_GIAY" as const,
        soGiayXacNhan: soGiay || item.soGiayXacNhan,
        ketLuan: ketLuan || item.ketLuan,
      };
    });
    state = {
      ...state,
      hoiDongKhuyetTatList: updated,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toLocaleString("vi-VN"),
          action: "Cấp Giấy xác nhận mức độ khuyết tật",
          details: `Chủ tịch UBND Phường ký cấp Giấy xác nhận khuyết tật cho hồ sơ ${id}`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };
    notify();
  },

  // ==========================================================================
  // GÓI BỔ SUNG 3: NGHỆ NHÂN DI SẢN & THỂ DỤC THỂ THAO (NĐ 109/2015 & NĐ 36/2019)
  // ==========================================================================
  themNgheNhanDiSan(data: Partial<NgheNhanDiSanItem>) {
    const newItem: NgheNhanDiSanItem = {
      id: data.id || `NN-${Date.now().toString().slice(-4)}`,
      hoTen: data.hoTen || "Nghệ nhân dân gian",
      namSinh: data.namSinh || 1960,
      danhHieu: data.danhHieu || "NGHE_NHAN_DAN_GIAN",
      loaiHinhDiSan: data.loaiHinhDiSan || "Đờn ca tài tử Nam Bộ",
      namPhongTang: data.namPhongTang || 2026,
      khuPho: data.khuPho || "Khu phố 1",
      tinhTrangSucKhoe: data.tinhTrangSucKhoe || "Bình thường",
      mucTroCapThangVND: data.mucTroCapThangVND || 1000000,
      clbSinhHoat: data.clbSinhHoat || "CLB Văn hóa phường",
      thanhTichTruyenDay: data.thanhTichTruyenDay || "Tích cực truyền dạy thế hệ trẻ gìn giữ di sản",
    };
    state = {
      ...state,
      ngheNhanDiSanList: [newItem, ...state.ngheNhanDiSanList],
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toLocaleString("vi-VN"),
          action: "Quản lý Nghệ nhân Di sản",
          details: `Ghi nhận thông tin Nghệ nhân ${newItem.hoTen} (${newItem.danhHieu})`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };
    notify();
  },

  themCoSoTheThao(data: Partial<CoSoTheThaoItem>) {
    const newItem: CoSoTheThaoItem = {
      id: data.id || `TT-${Date.now().toString().slice(-4)}`,
      tenCoSo: data.tenCoSo || "Cơ sở thể thao",
      loaiHinh: data.loaiHinh || "PHONG_GYM_FITNESS",
      diaChi: data.diaChi || "Khu phố 1",
      chuCoSo: data.chuCoSo || "Chủ cơ sở",
      sdt: data.sdt || "0900.000.000",
      giayPhepKinhDoanh: data.giayPhepKinhDoanh || "GPKD-TT/2026",
      soNhanVienCuuHo: data.soNhanVienCuuHo || 0,
      chungChiChuyenMon: data.chungChiChuyenMon ?? true,
      tinhTrangPCCC: data.tinhTrangPCCC || "DAT",
      ketQuaKiemTra: data.ketQuaKiemTra || "DAT_CHUAN",
      ngayKiemTraGanNhat: data.ngayKiemTraGanNhat || new Date().toLocaleDateString("vi-VN"),
      ghiChu: data.ghiChu || "Đã kiểm tra điều kiện hoạt động TDTT",
    };
    state = {
      ...state,
      coSoTheThaoList: [newItem, ...state.coSoTheThaoList],
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toLocaleString("vi-VN"),
          action: "Đăng ký Cơ sở Thể thao",
          details: `Thêm cơ sở thể thao ${newItem.tenCoSo}`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };
    notify();
  },

  kiemTraCoSoTheThao(
    id: string,
    ketQua: "DAT_CHUAN" | "CAN_KHAC_PHUC" | "DINH_CHI",
    ghiChu?: string
  ) {
    const updated = state.coSoTheThaoList.map((item) => {
      if (item.id !== id) return item;
      return {
        ...item,
        ketQuaKiemTra: ketQua,
        ghiChu: ghiChu || item.ghiChu,
        ngayKiemTraGanNhat: new Date().toLocaleDateString("vi-VN"),
      };
    });
    state = {
      ...state,
      coSoTheThaoList: updated,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toLocaleString("vi-VN"),
          action: "Kiểm tra cơ sở thể thao",
          details: `Cập nhật kết luận kiểm tra cơ sở ${id}: ${ketQua}`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };
    notify();
  },

  // ==========================================================================
  // GÓI BỔ SUNG 4: CỔNG TTĐT, ZALO OA & KHÔNG GIAN MẠNG (NĐ 42/2022 & CT 14/CT-TTg)
  // ==========================================================================
  themTinBaiCongThongTin(data: Partial<TinBaiCongThongTinItem>) {
    const newItem: TinBaiCongThongTinItem = {
      id: data.id || `TB-${Date.now().toString().slice(-4)}`,
      tieuDe: data.tieuDe || "Tiêu đề tin bài",
      chuyenMuc: data.chuyenMuc || "VAN_HOA_XA_HOI",
      tacGia: data.tacGia || "Ban Biên tập Cổng TTĐT",
      ngayGui: data.ngayGui || new Date().toLocaleDateString("vi-VN"),
      trangThai: data.trangThai || "CHO_DUYET",
      luotXem: data.luotXem || 0,
      dongBoZaloOA: data.dongBoZaloOA ?? false,
      luotGuiBroadcast: data.luotGuiBroadcast || 0,
    };
    state = {
      ...state,
      tinBaiList: [newItem, ...state.tinBaiList],
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toLocaleString("vi-VN"),
          action: "Biên tập Tin bài Cổng TTĐT",
          details: `Gửi tin bài mới: ${newItem.tieuDe}`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };
    notify();
  },

  duyetXuatBanTinBai(id: string, nguoiDuyet?: string) {
    const updated = state.tinBaiList.map((item) => {
      if (item.id !== id) return item;
      return {
        ...item,
        trangThai: "DA_XUAT_BAN" as const,
        nguoiDuyet: nguoiDuyet || "Chủ tịch UBND Phường",
        ngayXuatBan: new Date().toLocaleString("vi-VN"),
      };
    });
    state = {
      ...state,
      tinBaiList: updated,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toLocaleString("vi-VN"),
          action: "Duyệt xuất bản tin bài",
          details: `Phê duyệt phát hành tin bài ${id} lên Cổng TTĐT Phường`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };
    notify();
  },

  dongBoBroadcastZalo(id: string, luotGui?: number) {
    const updated = state.tinBaiList.map((item) => {
      if (item.id !== id) return item;
      return {
        ...item,
        dongBoZaloOA: true,
        luotGuiBroadcast: luotGui || 12000,
      };
    });
    state = {
      ...state,
      tinBaiList: updated,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toLocaleString("vi-VN"),
          action: "Phát tin nhắn Zalo OA",
          details: `Gửi thông điệp truyền thông chính sách bài ${id} tới người theo dõi Zalo OA Phường`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };
    notify();
  },

  ghiNhanTinXauDoc(data: Partial<GiamSatKhongGianMangItem>) {
    const newItem: GiamSatKhongGianMangItem = {
      id: data.id || `KGM-${Date.now().toString().slice(-4)}`,
      maTin: data.maTin || `KGM/2026/${Date.now().toString().slice(-3)}`,
      kenhPhatHien: data.kenhPhatHien || "FACEBOOK",
      tieuDeNoiDung: data.tieuDeNoiDung || "Thông tin nghi vấn trên không gian mạng",
      duongDanLink: data.duongDanLink || "https://mxh.vn",
      mucDoNguyHiem: data.mucDoNguyHiem || "TRUNG_BINH",
      ngayPhatHien: data.ngayPhatHien || new Date().toLocaleString("vi-VN"),
      bienPhapXuLy: data.bienPhapXuLy || "DANG_TIN_DINH_CHINH",
      ketQuaXuLy: data.ketQuaXuLy || "Đang xác minh sự thật và chuẩn bị nội dung định hướng dư luận",
      canBoTheoDoi: data.canBoTheoDoi || "Tổ Tác chiến không gian mạng (Lực lượng 35)",
    };
    state = {
      ...state,
      khongGianMangList: [newItem, ...state.khongGianMangList],
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toLocaleString("vi-VN"),
          action: "Phát hiện thông tin mạng xã hội",
          details: `Ghi nhận tin xấu độc/tin giả: ${newItem.tieuDeNoiDung}`,
          status: "WARNING",
        },
        ...state.auditLogs,
      ],
    };
    notify();
  },

  xuLyTinXauDoc(
    id: string,
    bienPhap: GiamSatKhongGianMangItem["bienPhapXuLy"],
    ketQua: string
  ) {
    const updated = state.khongGianMangList.map((item) => {
      if (item.id !== id) return item;
      return {
        ...item,
        bienPhapXuLy: bienPhap,
        ketQuaXuLy: ketQua,
      };
    });
    state = {
      ...state,
      khongGianMangList: updated,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toLocaleString("vi-VN"),
          action: "Xử lý thông tin xấu độc",
          details: `Đã xử lý thông tin ${id} với biện pháp: ${bienPhap}`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };
    notify();
  },

  // ==========================================================================
  // GÓI BỔ SUNG 5: QUỸ ĐỀN ƠN ĐÁP NGHĨA & NHÀ TÌNH NGHĨA (NĐ 45/2017)
  // ==========================================================================
  dongGopQuyDenOn(data: Partial<QuyDenOnDapNghiaItem>) {
    const newItem: QuyDenOnDapNghiaItem = {
      id: data.id || `QDO-${Date.now().toString().slice(-4)}`,
      loaiGiaoDich: data.loaiGiaoDich || "THU_QUY",
      noiDung: data.noiDung || "Ủng hộ Quỹ Đền ơn đáp nghĩa",
      donViCaNhan: data.donViCaNhan || "Cán bộ / Doanh nghiệp hảo tâm",
      khuPho: data.khuPho,
      soTienVND: data.soTienVND || 1000000,
      ngayThucHien: data.ngayThucHien || new Date().toLocaleDateString("vi-VN"),
      nguoiThuNhan: data.nguoiThuNhan || "Ban Quản lý Quỹ ĐƠĐN",
      chungTuSo: data.chungTuSo || `PT-QDO/2026/${Date.now().toString().slice(-3)}`,
      mucDichChi: data.mucDichChi,
    };
    state = {
      ...state,
      quyDenOnList: [newItem, ...state.quyDenOnList],
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toLocaleString("vi-VN"),
          action: "Giao dịch Quỹ Đền ơn đáp nghĩa",
          details: `${newItem.loaiGiaoDich === "THU_QUY" ? "Thu" : "Chi"} số tiền ${newItem.soTienVND.toLocaleString("vi-VN")} VNĐ`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };
    notify();
  },

  dangKyNhaTinhNghia(data: Partial<NhaTinhNghiaItem>) {
    const newItem: NhaTinhNghiaItem = {
      id: data.id || `NTN-${Date.now().toString().slice(-4)}`,
      maHoSo: data.maHoSo || `NTN/2026/${Date.now().toString().slice(-3)}`,
      hoTenChuHo: data.hoTenChuHo || "Chủ hộ chính sách",
      dienDoiTuong: data.dienDoiTuong || "THAN_NHAN_LIET_SI",
      khuPho: data.khuPho || "Khu phố 1",
      diaChi: data.diaChi || "Phường Phú Cường",
      loaiHinhHoTro: data.loaiHinhHoTro || "XAY_MOI",
      kinhPhiHoTroVND: data.kinhPhiHoTroVND || 80000000,
      kinhPhiGiaDinhVND: data.kinhPhiGiaDinhVND || 20000000,
      tongDuToanVND: data.tongDuToanVND || 100000000,
      tienDoThiCongPercent: data.tienDoThiCongPercent || 0,
      ngayKhoiCong: data.ngayKhoiCong || new Date().toLocaleDateString("vi-VN"),
      ngayNghiemThuDuKien: data.ngayNghiemThuDuKien || "30/12/2026",
      trangThai: data.trangThai || "KHAO_SAT",
    };
    state = {
      ...state,
      nhaTinhNghiaList: [newItem, ...state.nhaTinhNghiaList],
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toLocaleString("vi-VN"),
          action: "Hỗ trợ Nhà Tình nghĩa",
          details: `Lập hồ sơ hỗ trợ nhà tình nghĩa cho hộ ${newItem.hoTenChuHo}`,
          status: "SUCCESS",
        },
        ...state.auditLogs,
      ],
    };
    notify();
  },

  capNhatTienDoNhaTinhNghia(
    id: string,
    tienDo: number,
    trangThai?: NhaTinhNghiaItem["trangThai"]
  ) {
    const updated = state.nhaTinhNghiaList.map((item) => {
      if (item.id !== id) return item;
      const newStatus = trangThai || (tienDo >= 100 ? "DA_BAN_GIAO" : "DANG_THI_CONG");
      return {
        ...item,
        tienDoThiCongPercent: tienDo,
        trangThai: newStatus,
      };
    });
    state = {
      ...state,
      nhaTinhNghiaList: updated,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toLocaleString("vi-VN"),
          action: "Cập nhật tiến độ Nhà Tình nghĩa",
          details: `Cập nhật tiến độ nhà tình nghĩa ${id} đạt ${tienDo}%`,
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
