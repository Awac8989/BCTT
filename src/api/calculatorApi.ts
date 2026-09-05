/**
 * REST API CLIENT - PHÂN HỆ TÍNH TOÁN TRỢ CẤP (JAVA SPRING BOOT CORE ENGINE)
 * Contract: Phần 4.2 TDD
 */

import { calculateAllowance } from "@/services/calculator.service";

export interface AllowanceApiRequest {
  ma_loai_dt: string;
  ty_le_thuong_tat: number;
  co_nguoi_cham_soc?: boolean;
}

export interface AllowanceApiResponse {
  status: "SUCCESS" | "FAILED";
  base_rate: number;
  tro_cap_hang_thang: number;
  phu_cap_nguoi_phuc_vu: number;
  tong_tien_thuc_nhan: number;
  ghi_chu_phap_ly: string;
}

export const calculatorApi = {
  /**
   * POST /api/v1/calculator/allowance
   */
  async calculateAllowance(payload: AllowanceApiRequest): Promise<AllowanceApiResponse> {
    await new Promise((r) => setTimeout(r, 80));

    const res = calculateAllowance({
      maLoaiDt: payload.ma_loai_dt,
      tyLeThuongTat: payload.ty_le_thuong_tat,
      coNguoiChamSoc: payload.co_nguoi_cham_soc,
    });

    return {
      status: res.status,
      base_rate: res.baseRate,
      tro_cap_hang_thang: res.troCapHangThang,
      phu_cap_nguoi_phuc_vu: res.phuCapChamSoc,
      tong_tien_thuc_nhan: res.tongTienThucNhan,
      ghi_chu_phap_ly: res.ghiChuPhapLy,
    };
  },
};
