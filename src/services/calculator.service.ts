/**
 * ĐỘNG CƠ TÍNH TOÁN TRỢ CẤP ƯU ĐÃI NGƯỜI CÓ CÔNG
 * Căn cứ pháp lý: Nghị định 75/2021/NĐ-CP & Văn bản sửa đổi
 * Thiết kế theo đặc tả Phần 5.2 TDD: Sử dụng logic làm tròn chuẩn RoundingMode.HALF_UP
 */

export interface AllowanceRequest {
  maLoaiDt: string; // VD: 'THUONG_BINH', 'ME_VNAH', 'BENH_BINH', 'LIET_SI', 'CHAT_DOC_HOA_HOC', 'TIEN_KHOI_NGHIA'
  tyLeThuongTat?: number | undefined; // 0 - 100%
  coNguoiChamSoc?: boolean | undefined;
}

export interface AllowanceResponse {
  status: "SUCCESS" | "FAILED";
  baseRate: number; // Mức chuẩn: 2.055.000 VNĐ
  heSo: number;
  troCapHangThang: number;
  phuCapChamSoc: number;
  troCapDieuDuong: number;
  tongTienThucNhan: number;
  ghiChuPhapLy: string;
  chiTietCongThuc: string;
}

// Mức chuẩn trợ cấp ưu đãi quy định theo Nghị định 75/2021/NĐ-CP (VND)
export const MUC_CHUAN_TRO_CAP = 2_055_000;

// Trợ cấp thờ cúng liệt sĩ hàng năm (phát dịp 27/7)
export const MUC_THO_CUNG_LIET_SI = 1_400_000;

// Trợ cấp điều dưỡng phục hồi sức khỏe tại nhà (0.9 lần mức chuẩn)
export const MUC_DIEU_DUONG_TAI_NHA = 1_849_500;

// Trợ cấp điều dưỡng tập trung (1.8 lần mức chuẩn)
export const MUC_DIEU_DUONG_TAP_TRUNG = 3_699_000;

// Trợ cấp mai táng phí (10 tháng lương cơ sở = 10 × 2.340.000đ)
export const MUC_MAI_TANG_PHI = 23_400_000;

/**
 * Hàm đọc số tiền thành chữ tiếng Việt chuẩn biểu mẫu tài chính ngân sách (C70a-HD)
 */
export function docSoTienBangChu(soTien: number): string {
  if (soTien <= 0) return "Không đồng";

  const chuSo = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
  const hangDonVi = ["", "nghìn", "triệu", "tỷ"];

  function docBlock3(num: number): string {
    const tram = Math.floor(num / 100);
    const chuc = Math.floor((num % 100) / 10);
    const donVi = num % 10;
    let res = "";

    if (tram > 0) {
      res += `${chuSo[tram]} trăm `;
    }
    if (chuc > 1) {
      res += `${chuSo[chuc]} mươi `;
      if (donVi === 1) res += "mốt ";
      else if (donVi === 5) res += "lăm ";
      else if (donVi > 0) res += `${chuSo[donVi]} `;
    } else if (chuc === 1) {
      res += "mười ";
      if (donVi === 5) res += "lăm ";
      else if (donVi > 0) res += `${chuSo[donVi]} `;
    } else if (tram > 0 && donVi > 0) {
      res += `lẻ ${chuSo[donVi]} `;
    } else if (donVi > 0) {
      res += `${chuSo[donVi]} `;
    }

    return res.trim();
  }

  let str = Math.round(soTien).toString();
  let blocks: number[] = [];
  while (str.length > 0) {
    const chunk = str.slice(-3);
    blocks.unshift(Number(chunk));
    str = str.slice(0, -3);
  }

  let result = "";
  for (let i = 0; i < blocks.length; i++) {
    const blockVal = blocks[i]!;
    if (blockVal > 0) {
      const bStr = docBlock3(blockVal);
      const unit = hangDonVi[blocks.length - 1 - i]!;
      result += `${bStr} ${unit} `;
    }
  }

  result = result.trim() + " đồng chẵn.";
  return result.charAt(0).toUpperCase() + result.slice(1);
}

/**
 * Tính hệ số thương tật theo bảng tỷ lệ tổn thương cơ thể
 */
export function calculateDisabilityFactor(tyLe: number): number {
  if (tyLe >= 81) return 3.85; // Thương tật nặng đặc biệt
  if (tyLe >= 61) return 2.63; // Thương tật nặng
  if (tyLe >= 41) return 1.82; // Thương tật trung bình
  if (tyLe >= 21) return 1.15; // Thương tật nhẹ
  return 0;
}

/**
 * Engine tính trợ cấp tài chính
 */
export function calculateAllowance(req: AllowanceRequest): AllowanceResponse {
  const tyLe = Number(req.tyLeThuongTat || 0);
  let heSo = 1.0;
  let troCapHangThang = 0;
  let phuCapChamSoc = 0;
  let troCapDieuDuong = 0;
  let chiTietCongThuc = "";

  const maDt = req.maLoaiDt?.toUpperCase() || "";

  switch (maDt) {
    case "THUONG_BINH":
    case "THƯƠNG BINH": {
      if (tyLe >= 21) {
        heSo = calculateDisabilityFactor(tyLe);
        troCapHangThang = Math.round(MUC_CHUAN_TRO_CAP * heSo);
        chiTietCongThuc = `Mức chuẩn (${MUC_CHUAN_TRO_CAP.toLocaleString("vi-VN")}đ) × Hệ số ${heSo} (tỷ lệ ${tyLe}%)`;
      } else {
        heSo = 0;
        troCapHangThang = 0;
        chiTietCongThuc = "Tỷ lệ tổn thương < 21%: Không đủ điều kiện hưởng trợ cấp hàng tháng";
      }

      // Nếu thương tật >= 81% và có người phục vụ
      if (tyLe >= 81 && req.coNguoiChamSoc) {
        phuCapChamSoc = Math.round(MUC_CHUAN_TRO_CAP * 1.0);
      }

      // Trợ cấp điều dưỡng hàng năm phân bổ
      if (tyLe >= 81) {
        troCapDieuDuong = Math.round((MUC_CHUAN_TRO_CAP * 1.8) / 12);
      }
      break;
    }

    case "ME_VNAH":
    case "MẸ VNAH":
    case "BÀ MẸ VIỆT NAM ANH HÙNG": {
      // Phụ cấp Mẹ VNAH = 3.0 lần mức chuẩn + Phụ cấp chăm sóc 1.0 lần
      heSo = 3.0;
      troCapHangThang = Math.round(MUC_CHUAN_TRO_CAP * 3.0);
      phuCapChamSoc = Math.round(MUC_CHUAN_TRO_CAP * 1.0);
      troCapDieuDuong = Math.round((MUC_CHUAN_TRO_CAP * 2.0) / 12);
      chiTietCongThuc = `Trợ cấp danh hiệu (×3.0) + Phụ cấp người phục vụ (×1.0) theo NĐ 75/2021/NĐ-CP`;
      break;
    }

    case "BENH_BINH":
    case "BỆNH BINH": {
      if (tyLe >= 81) heSo = 3.1;
      else if (tyLe >= 61) heSo = 2.25;
      else if (tyLe >= 41) heSo = 1.5;
      else heSo = 1.0;

      troCapHangThang = Math.round(MUC_CHUAN_TRO_CAP * heSo);
      if (tyLe >= 81 && req.coNguoiChamSoc) {
        phuCapChamSoc = Math.round(MUC_CHUAN_TRO_CAP * 1.0);
      }
      chiTietCongThuc = `Bệnh binh hệ số ${heSo} theo tỷ lệ mất sức lao động ${tyLe}%`;
      break;
    }

    case "LIET_SI":
    case "THÂN NHÂN LIỆT SĨ":
    case "THAN_NHAN_LIET_SI": {
      heSo = 1.0;
      troCapHangThang = Math.round(MUC_CHUAN_TRO_CAP * 1.0);
      chiTietCongThuc = `Định suất thờ cúng / nuôi dưỡng thân nhân liệt sĩ: 1.0 × Mức chuẩn`;
      break;
    }

    case "CHAT_DOC_HOA_HOC":
    case "NHIỄM CHẤT ĐỘC HÓA HỌC": {
      heSo = tyLe >= 81 ? 2.4 : tyLe >= 61 ? 1.7 : 1.15;
      troCapHangThang = Math.round(MUC_CHUAN_TRO_CAP * heSo);
      if (tyLe >= 81 && req.coNguoiChamSoc) {
        phuCapChamSoc = Math.round(MUC_CHUAN_TRO_CAP * 1.0);
      }
      chiTietCongThuc = `Người hoạt động kháng chiến nhiễm CĐHH hệ số ${heSo}`;
      break;
    }

    case "TIEN_KHOI_NGHIA":
    case "CÁN BỘ TIỀN KHỞI NGHĨA": {
      heSo = 1.45;
      troCapHangThang = Math.round(MUC_CHUAN_TRO_CAP * heSo);
      chiTietCongThuc = `Cán bộ tiền khởi nghĩa hệ số ưu đãi 1.45`;
      break;
    }

    default: {
      heSo = 1.0;
      troCapHangThang = MUC_CHUAN_TRO_CAP;
      chiTietCongThuc = `Áp dụng định mức chuẩn cơ bản`;
      break;
    }
  }

  const tongTienThucNhan = troCapHangThang + phuCapChamSoc + troCapDieuDuong;

  return {
    status: "SUCCESS",
    baseRate: MUC_CHUAN_TRO_CAP,
    heSo,
    troCapHangThang,
    phuCapChamSoc,
    troCapDieuDuong,
    tongTienThucNhan,
    ghiChuPhapLy: "Tính theo quy định chuẩn tại Nghị định 75/2021/NĐ-CP của Chính phủ",
    chiTietCongThuc,
  };
}
