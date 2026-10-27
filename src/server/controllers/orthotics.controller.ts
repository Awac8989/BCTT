/**
 * ORTHOTICS & ASSISTIVE DEVICES CONTROLLER
 * Endpoints: /api/v1/orthotics/*
 * Implements: TC-ORT-01, TC-ORT-02 (Nghị định 131/2021/NĐ-CP Điều 90-93)
 */

import { backendStore } from "../services/backend-store";
import { jsonOk, jsonCreated, jsonBadRequest } from "../utils/response";
import type { DungCuChinhHinhItem } from "@/data/mock";

export async function handleOrthoticsRoutes(req: Request, url: URL): Promise<Response> {
  const path = url.pathname.replace(/^\/api\/v1\/orthotics/, "");
  const method = req.method;

  // 1. GET /api/v1/orthotics - Danh sách dụng cụ chỉnh hình & cảnh báo đến hạn (TC-ORT-02)
  if ((path === "" || path === "/") && method === "GET") {
    const currentYear = new Date().getFullYear();

    // Tự động kiểm tra và cập nhật trạng thái ĐẾN_HẠN_CẤP_MỚI nếu namDenHanCapMoi <= currentYear (TC-ORT-02)
    const items = backendStore.orthotics.map((item) => {
      const isDue = item.namDenHanCapMoi <= currentYear && item.trangThai !== "CHỜ_DUYỆT_CẤP";
      return {
        ...item,
        trangThai: isDue ? ("ĐẾN_HẠN_CẤP_MỚI" as const) : item.trangThai,
        isDueForRenewal: isDue,
      };
    });

    const dueCount = items.filter((i) => i.isDueForRenewal).length;

    return jsonOk({
      total: items.length,
      due_for_renewal_count: dueCount,
      current_year: currentYear,
      items,
    });
  }

  // 2. POST /api/v1/orthotics - Cấp dụng cụ chỉnh hình / xe lăn mới (TC-ORT-01)
  if ((path === "" || path === "/") && method === "POST") {
    try {
      const body = await req.json() as {
        ho_so_id?: string;
        hoSoId?: string;
        ho_ten?: string;
        hoTen?: string;
        ten_dung_cu?: string;
        tenDungCu?: string;
        loai_dung_cu?: "CHÂN_GIẢ" | "TAY_GIẢ" | "XE_LĂN" | "XE_LẮC" | "MÁY_TRỢ_THÍNH" | "KHÁC";
        loaiDungCu?: "CHÂN_GIẢ" | "TAY_GIẢ" | "XE_LĂN" | "XE_LẮC" | "MÁY_TRỢ_THÍNH" | "KHÁC";
        nien_han_nam?: number;
        nienHanNam?: number;
        dinh_muc_tien?: number;
        dinhMucTien?: number;
        tien_boi_duong?: number;
      };

      const hoSoId = body.ho_so_id || body.hoSoId || "HS-2026-CHINH-HINH";
      const hoTen = body.ho_ten || body.hoTen || "Thương binh thụ hưởng";
      const tenDungCu = body.ten_dung_cu || body.tenDungCu || "Xe lăn tay tiêu chuẩn";
      const loaiDungCu = body.loai_dung_cu || body.loaiDungCu || "XE_LĂN";
      const nienHan = Number(body.nien_han_nam ?? body.nienHanNam ?? 5);
      const dinhMuc = Number(body.dinh_muc_tien ?? body.dinhMucTien ?? 4_500_000);

      const currentYear = new Date().getFullYear();
      const namDenHan = currentYear + nienHan;
      const soQuyetDinh = `QĐ-SLĐTBXH/2026-${Math.floor(100 + Math.random() * 900)}`;

      const newItem: DungCuChinhHinhItem = {
        id: `DC-${Date.now()}`,
        hoSoId,
        hoTen,
        phuong: "Phú Cường",
        tenDungCu,
        loaiDungCu,
        nienHanNam: nienHan,
        namCapGanNhat: currentYear,
        namDenHanCapMoi: namDenHan,
        dinhMucTien: dinhMuc,
        tienBoiDuongPhucHoi: body.tien_boi_duong || 1_000_000,
        trangThai: "ĐÃ_CẤP",
        soQuyetDinhCap: soQuyetDinh,
      };

      backendStore.orthotics.unshift(newItem);

      backendStore.logAudit(
        "Cấp dụng cụ chỉnh hình",
        `Ban hành Quyết định ${soQuyetDinh} cấp ${tenDungCu} (niên hạn ${nienHan} năm, định mức ${dinhMuc.toLocaleString("vi-VN")} đ) cho ${hoTen}`,
        backendStore.currentUser.tenCanBo
      );

      return jsonCreated({
        success: true,
        dung_cu_id: newItem.id,
        so_quyet_dinh: soQuyetDinh,
        nam_cap_gan_nhat: currentYear,
        nam_den_han_cap_moi: namDenHan,
        dung_cu_item: newItem,
      }, `Đã cấp mới ${tenDungCu} cho đối tượng thành công!`);
    } catch (err) {
      return jsonBadRequest("Lỗi trong quá trình tiếp nhận cấp dụng cụ chỉnh hình", err instanceof Error ? err.message : String(err));
    }
  }

  return jsonBadRequest("Endpoint không tồn tại");
}
