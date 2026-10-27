/**
 * DECEASE REPORTING & FUNERAL ALLOWANCE CONTROLLER
 * Endpoints: /api/v1/decease-report/*
 * Implements: TC-DEC-01, TC-DEC-02, TC-DEC-03
 */

import { backendStore } from "../services/backend-store";
import { jsonOk, jsonCreated, jsonBadRequest, jsonNotFound } from "../utils/response";
import type { BaoGiamItem } from "@/data/mock";

export async function handleDeceaseRoutes(req: Request, url: URL): Promise<Response> {
  const path = url.pathname.replace(/^\/api\/v1\/decease-report/, "");
  const method = req.method;

  // 1. GET /api/v1/decease-report - Danh sách báo giảm từ trần
  if ((path === "" || path === "/") && method === "GET") {
    return jsonOk({
      total: backendStore.deceaseReports.length,
      items: backendStore.deceaseReports,
    });
  }

  // 2. POST /api/v1/decease-report - Báo giảm từ trần & ban hành QĐ Mai táng phí (TC-DEC-01, TC-DEC-02, TC-DEC-03)
  if ((path === "" || path === "/") && method === "POST") {
    try {
      const body = await req.json() as {
        ho_so_id?: string;
        hoSoId?: string;
        ngay_mat?: string;
        ngayMat?: string;
        so_trich_luc_khai_tu?: string;
        soTrichLucKhaiTu?: string;
        nguoi_khai?: string;
        nguoiKhaiBao?: string;
        quan_he?: string;
        quanHe?: string;
        so_cccd_nguoi_khai?: string;
        cccdNguoiKhai?: string;
        so_dien_thoai?: string;
        sdtNguoiKhai?: string;
      };

      const hoSoId = body.ho_so_id || body.hoSoId;
      if (!hoSoId) {
        return jsonBadRequest("Vui lòng cung cấp mã hồ sơ người có công (ho_so_id)");
      }

      const hoSo = backendStore.profiles.find((h) => h.id === hoSoId);
      if (!hoSo) {
        return jsonNotFound(`Không tìm thấy hồ sơ có mã: ${hoSoId}`);
      }

      const ngayMat = body.ngay_mat || body.ngayMat || new Date().toLocaleDateString("vi-VN");
      const soTrichLuc = body.so_trich_luc_khai_tu || body.soTrichLucKhaiTu || `${Math.floor(100 + Math.random() * 900)}/TLKT`;
      const nguoiKhai = body.nguoi_khai || body.nguoiKhaiBao || "Thân nhân đại diện";
      const quanHe = body.quan_he || body.quanHe || "Con";

      // TC-DEC-01: Đánh dấu hồ sơ đã từ trần
      (hoSo as any).isTuTran = true;
      (hoSo as any).ngayTuTran = ngayMat;

      // TC-DEC-02: Tự động ngắt tất cả các khoản chi đang chờ hoặc đang chờ chi trả của đối tượng
      let stoppedPayoutsCount = 0;
      backendStore.payouts.forEach((p) => {
        if (p.cccd === hoSo.cccd && p.trangThai !== "ĐÃ_CHI_TRẢ") {
          p.trangThai = "TỒN_ĐỌNG";
          p.ghiChu = `TẠM NGỪNG: Đối tượng đã từ trần ngày ${ngayMat}`;
          stoppedPayoutsCount++;
        }
      });

      // TC-DEC-01 & TC-DEC-03: Ban hành Quyết định trợ cấp Mai táng phí Mẫu 02 (10 × Mức chuẩn = 20.550.000đ)
      const soQuyetDinhMaiTang = `QĐ-UBND/2026-MTP-${Math.floor(100 + Math.random() * 900)}`;
      const mucMaiTangPhi = 20_550_000;

      const newBaoGiam: BaoGiamItem = {
        id: `BG-${Date.now()}`,
        hoSoId: hoSo.id,
        hoTenNguoiMat: hoSo.hoTen,
        ngayMat,
        soKhaiTu: soTrichLuc,
        nguoiKhai,
        quanHe,
        soTienMaiTangPhi: mucMaiTangPhi,
        soQuyetDinh: soQuyetDinhMaiTang,
        ngayQuyetDinh: new Date().toLocaleDateString("vi-VN"),
        trangThaiChiTra: "CHỜ_CHI_TRẢ",
      };

      backendStore.deceaseReports.unshift(newBaoGiam);

      backendStore.logAudit(
        "Báo giảm từ trần",
        `Báo giảm từ trần cho đối tượng ${hoSo.hoTen} (${hoSo.id}), ban hành QĐ Mai táng phí ${soQuyetDinhMaiTang} (20.550.000 đ), tạm ngừng ${stoppedPayoutsCount} kỳ chi trợ cấp đang chờ`,
        backendStore.currentUser.tenCanBo
      );

      return jsonCreated({
        success: true,
        bao_giam_id: newBaoGiam.id,
        ho_so_id: hoSo.id,
        ho_ten_nguoi_mat: hoSo.hoTen,
        so_quyet_dinh_mai_tang: soQuyetDinhMaiTang,
        so_tien_mai_tang_phi: mucMaiTangPhi,
        ngung_chi_tra_count: stoppedPayoutsCount,
        bao_giam_item: newBaoGiam,
      }, `Đã hoàn tất thủ tục báo giảm và ban hành Quyết định Mai táng phí ${soQuyetDinhMaiTang}!`);
    } catch (err) {
      return jsonBadRequest("Lỗi trong quá trình tiếp nhận báo giảm từ trần", err instanceof Error ? err.message : String(err));
    }
  }

  return jsonNotFound();
}
