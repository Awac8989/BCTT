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
  role: "ADMIN_SO" | "ADMIN_PHONG";
  roleName: string;
  title: string;
  department: string;
  unit: string;
  email: string;
  phone: string;
  avatarText: string;
  permissions: string[];
}

export const MOCK_USERS: Record<"ADMIN_SO" | "ADMIN_PHONG", CurrentUser> = {
  ADMIN_SO: {
    id: "USR-SO-001",
    username: "admin.so",
    fullName: "TS. Nguyễn Văn Hùng",
    role: "ADMIN_SO",
    roleName: "Quản trị viên Cấp Sở (Admin Cấp Sở)",
    title: "Phó Giám đốc Sở LĐTBXH tỉnh Bình Dương",
    department: "Ban Giám đốc Sở",
    unit: "Sở Lao động - Thương binh và Xã hội tỉnh Bình Dương",
    email: "admin.so@binhduong.gov.vn",
    phone: "0274.3822.456",
    avatarText: "NVH",
    permissions: [
      "Toàn quyền điều hành & giám sát toàn tỉnh",
      "Phê duyệt hồ sơ chính sách & ban hành QĐ hưởng trợ cấp",
      "Phân bổ & thẩm tra quyết toán ngân sách các huyện/thị",
      "Phê duyệt danh ngạch điều dưỡng toàn tỉnh (NĐ 131)",
      "Cấu hình tham số hệ thống, danh mục định mức phụ cấp",
      "Khai thác kho dữ liệu & báo cáo thống kê chuyên sâu 14 phường",
    ],
  },
  ADMIN_PHONG: {
    id: "USR-PHONG-001",
    username: "admin.phong",
    fullName: "Nguyễn Thị Minh Thảo",
    role: "ADMIN_PHONG",
    roleName: "Cán bộ Thụ lý Cấp Phòng (Admin Cấp Phòng)",
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
      "Xuất Giấy tiếp nhận & Hẹn trả kết quả có Mã QR Code",
      "Lập danh sách điều dưỡng người có công địa phương",
      "Giám sát đánh giá CSAT dịch vụ công địa bàn TP. Thủ Dầu Một",
    ],
  },
};

interface AppState {
  currentUser: CurrentUser;
  hoSoList: HoSo[];
  quyetDinhList: QuyetDinhHuong[];
  phanHoiList: PhanHoi[];
  chiTraList: ChiTraItem[];
  dungCuChinhHinhList: DungCuChinhHinhItem[];
  moLietSiList: MoLietSiItem[];
  baoGiamList: BaoGiamItem[];
  canhBaoList: CanhBaoSomItem[];
  auditLogs: {
    id: string;
    timestamp: string;
    action: string;
    details: string;
    status: "SUCCESS" | "FAILED" | "WARNING";
  }[];
}

const STORAGE_KEY = "QDM_NCC_APP_STATE_V2";

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
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          currentUser: parsed.currentUser || MOCK_USERS.ADMIN_PHONG,
          dungCuChinhHinhList: parsed.dungCuChinhHinhList || initialDungCuChinhHinh,
          moLietSiList: parsed.moLietSiList || initialMoLietSiList,
          baoGiamList: parsed.baoGiamList || initialBaoGiamList,
          canhBaoList: parsed.canhBaoList || initialCanhBaoList,
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
    currentUser: MOCK_USERS.ADMIN_PHONG,
    hoSoList: initialHoSoList,
    quyetDinhList: initialQuyetDinh,
    phanHoiList: initialPhanHoiList,
    chiTraList: initialChiTraData,
    dungCuChinhHinhList: initialDungCuChinhHinh,
    moLietSiList: initialMoLietSiList,
    baoGiamList: initialBaoGiamList,
    canhBaoList: initialCanhBaoList,
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
   * Đăng nhập với vai trò Admin Cấp Sở hoặc Admin Cấp Phòng
   */
  login(role: "ADMIN_SO" | "ADMIN_PHONG", _credentials?: { username?: string; password?: string }) {
    const user = MOCK_USERS[role];
    const now = new Date();
    state = {
      ...state,
      currentUser: user,
      auditLogs: [
        {
          id: `LOG-${Date.now()}`,
          timestamp: now.toLocaleString("vi-VN"),
          action: `Đăng nhập (${role === "ADMIN_SO" ? "Admin Cấp Sở" : "Admin Cấp Phòng"})`,
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
   * Chuyển đổi nhanh vai trò giữa Admin Cấp Sở và Cấp Phòng
   */
  switchRole(role: "ADMIN_SO" | "ADMIN_PHONG") {
    return this.login(role);
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
