/**
 * UTILITIES & CONSTANTS - PHÂN HỆ VĂN HÓA, THỂ THAO & ĐỜI SỐNG VĂN MINH ĐÔ THỊ
 * UBND Phường Thủ Dầu Một / TP. Thủ Dầu Một, Tỉnh Bình Dương
 * Căn cứ pháp lý:
 * - Nghị định 86/2023/NĐ-CP: Tiêu chuẩn công nhận Gia đình văn hóa, Khu phố văn hóa
 * - Nghị định 54/2019/NĐ-CP & NĐ 144/2021/NĐ-CP: Quản lý Karaoke, Bar, Thể thao giải trí
 * - Nghị định 38/2021/NĐ-CP: Xử phạt VPHC trong lĩnh vực văn hóa và quảng cáo
 * - Thông tư 04/2023/TT-BTC: Quản lý, thu chi tài chính cho công tác tổ chức lễ hội và tiền công đức
 * - Luật Tín ngưỡng, tôn giáo 2016 (Điều 43: Thông báo danh mục hoạt động tôn giáo)
 * - Luật Phòng, chống bạo lực gia đình 2022 (Điều 25: Quyết định cấm tiếp xúc)
 * - Nghị định 61/2018/NĐ-CP: Cơ chế một cửa, một cửa liên thông trong giải quyết TTHC
 */

export interface ScoreBreakdown {
  diemGuongMau: number; // max 30
  diemKinhTe: number; // max 30
  diemHoaThuan: number; // max 40
}

export function calculateTongDiem(scores: ScoreBreakdown): number {
  return (
    Math.min(30, Math.max(0, scores.diemGuongMau)) +
    Math.min(30, Math.max(0, scores.diemKinhTe)) +
    Math.min(40, Math.max(0, scores.diemHoaThuan))
  );
}

export function evaluateGiaDinhVanHoa(tongDiem: number): {
  ketQua: "DAT_CHUAN" | "CHUA_DAT";
  xepLoai: string;
  duocDeNghiKhenThuong: boolean;
} {
  if (tongDiem >= 85) {
    return {
      ketQua: "DAT_CHUAN",
      xepLoai: tongDiem >= 95 ? "Gia đình văn hóa Xuất sắc" : "Gia đình văn hóa Tiêu chuẩn",
      duocDeNghiKhenThuong: tongDiem >= 95,
    };
  }
  return {
    ketQua: "CHUA_DAT",
    xepLoai: "Chưa đạt chuẩn (Cần phấn đấu)",
    duocDeNghiKhenThuong: false,
  };
}

export const PHAN_LOAI_DI_TICH_LABELS: Record<string, { label: string; color: string }> = {
  DI_TICH_QUOC_GIA: {
    label: "Di tích Lịch sử cấp Quốc gia",
    color: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900",
  },
  DI_TICH_CAP_TINH: {
    label: "Di tích Lịch sử - Kiến trúc cấp Tỉnh",
    color: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900",
  },
  CO_SO_TIN_NGUONG: {
    label: "Cơ sở Tín ngưỡng Dân gian trọng điểm",
    color: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
  },
  DANH_THANG: {
    label: "Danh lam thắng cảnh tiêu biểu",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900",
  },
  DI_SAN_PHI_VAT_THE: {
    label: "Di sản Văn hóa Phi vật thể Quốc gia",
    color: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900",
  },
};

export const LOAI_HINH_DICH_VU_LABELS: Record<string, { label: string; icon: string }> = {
  KARAOKE: { label: "Kinh doanh dịch vụ Karaoke (NĐ 54/2019)", icon: "Mic2" },
  QUAN_BAR_PUB: { label: "Quán Bar, Vũ trường, Pub âm nhạc", icon: "Wine" },
  BI_A_CLUB: { label: "Câu lạc bộ Thể thao Bi-a / Snooker", icon: "CircleDot" },
  PHONG_GYM_FITNESS: { label: "Phòng tập Gym, Thể hình & Yoga", icon: "Dumbbell" },
  BIEN_HIEU_QUANG_CAO: { label: "Biển hiệu, Bảng quảng cáo ngoài trời (NĐ 38/2021)", icon: "Tv" },
};

export const HE_PHAI_TON_GIAO_LABELS: Record<string, string> = {
  PHAT_GIAO: "Phật giáo (GHPGVN)",
  CONG_GIAO: "Công giáo (Giáo phận Phú Cường)",
  TIN_LANH: "Hội thánh Tin Lành Việt Nam",
  CAO_DAI: "Đại Đạo Tam Kỳ Phổ Độ (Cao Đài)",
  TIN_NGUONG_DAN_GIAN: "Tín ngưỡng dân gian (Miếu / Đình thần)",
};

export const BIEN_PHAP_PCBLGD_LABELS: Record<string, { label: string; badgeClass: string }> = {
  CAM_TIEP_XUC_UBND: {
    label: "Quyết định Cấm tiếp xúc của Chủ tịch UBND",
    badgeClass: "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/50 dark:text-rose-200",
  },
  TAM_LANH_DIA_CHI_TIN_CAY: {
    label: "Tạm lánh khẩn cấp tại Địa chỉ tin cậy",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-200",
  },
  HOA_GIAI_CO_SO: {
    label: "Hòa giải mâu thuẫn tại cơ sở khu phố",
    badgeClass: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/50 dark:text-blue-200",
  },
};

export const TRANG_THAI_TTHC_LABELS: Record<string, { label: string; color: string }> = {
  TIEP_NHAN: {
    label: "Mới tiếp nhận (Mẫu 01)",
    color: "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300",
  },
  DANG_THAM_DINH: {
    label: "Đang thẩm định hồ sơ",
    color: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300",
  },
  TRINH_LANH_DAO: {
    label: "Trình Lãnh đạo UBND phê duyệt",
    color: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300",
  },
  CHO_TRA_KET_QUA: {
    label: "Đã ký duyệt - Chờ trả kết quả",
    color: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300",
  },
  DA_HOAN_THANH: {
    label: "Đã hoàn thành & Ký số SmartCA",
    color: "bg-green-100 text-green-800 border-green-300 dark:bg-green-950 dark:text-green-300",
  },
};
