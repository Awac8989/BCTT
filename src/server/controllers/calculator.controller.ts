/**
 * CALCULATOR CONTROLLER (CORE FINANCIAL ENGINE)
 * Endpoints: /api/v1/calculator/*
 * Implements: Nghị định 75/2021/NĐ-CP & Nghị định 131/2021/NĐ-CP
 */

import { calculateAllowance, docSoTienBangChu, MUC_CHUAN_TRO_CAP } from "@/services/calculator.service";
import { jsonOk, jsonBadRequest } from "../utils/response";

export async function handleCalculatorRoutes(req: Request, url: URL): Promise<Response> {
  const path = url.pathname.replace(/^\/api\/v1\/calculator/, "");

  // POST /api/v1/calculator/allowance
  if ((path === "/allowance" || path === "") && req.method === "POST") {
    try {
      const body = await req.json() as {
        ma_loai_dt?: string;
        maLoaiDt?: string;
        ty_le_thuong_tat?: number;
        tyLeThuongTat?: number;
        co_nguoi_cham_soc?: boolean;
        coNguoiChamSoc?: boolean;
      };

      const maLoaiDt = body.ma_loai_dt || body.maLoaiDt || "THUONG_BINH";
      const tyLe = body.ty_le_thuong_tat ?? body.tyLeThuongTat ?? 0;
      const coChamSoc = body.co_nguoi_cham_soc ?? body.coNguoiChamSoc ?? false;

      if (tyLe < 0 || tyLe > 100) {
        return jsonBadRequest("Tỷ lệ tổn thương thương tật phải từ 0% đến 100%");
      }

      const result = calculateAllowance({
        maLoaiDt,
        tyLeThuongTat: tyLe,
        coNguoiChamSoc: coChamSoc,
      });

      return jsonOk({
        status: result.status,
        base_rate: MUC_CHUAN_TRO_CAP,
        he_so: result.heSo,
        tro_cap_hang_thang: result.troCapHangThang,
        phu_cap_nguoi_phuc_vu: result.phuCapChamSoc,
        tro_cap_dieu_duong: result.troCapDieuDuong,
        tong_tien_thuc_nhan: result.tongTienThucNhan,
        so_tien_bang_chu: docSoTienBangChu(result.tongTienThucNhan),
        ghi_chu_phap_ly: result.ghiChuPhapLy,
        chi_tiet_cong_thuc: result.chiTietCongThuc,
      }, "Tính toán trợ cấp ưu đãi thành công");
    } catch (err) {
      return jsonBadRequest("Lỗi xử lý tham số tính toán", err instanceof Error ? err.message : String(err));
    }
  }

  // POST /api/v1/calculator/number-to-words
  if (path === "/number-to-words" && req.method === "POST") {
    try {
      const body = await req.json() as { number?: number };
      if (typeof body.number !== "number") {
        return jsonBadRequest("Tham số number phải là số");
      }
      return jsonOk({
        number: body.number,
        words: docSoTienBangChu(body.number),
      });
    } catch {
      return jsonBadRequest("Dữ liệu đầu vào không hợp lệ");
    }
  }

  return jsonBadRequest("Endpoint tính toán không tồn tại");
}
