/**
 * PAYOUT & BANK RECONCILIATION CONTROLLER
 * Endpoints: /api/v1/payouts/*
 * Implements: TC-PAY-01, TC-PAY-02, TC-PAY-03, TC-REC-01, TC-REC-02
 */

import { backendStore } from "../services/backend-store";
import { docSoTienBangChu } from "@/services/calculator.service";
import { jsonOk, jsonBadRequest, jsonNotFound } from "../utils/response";

export async function handlePayoutRoutes(req: Request, url: URL): Promise<Response> {
  const path = url.pathname.replace(/^\/api\/v1\/payouts/, "");
  const method = req.method;

  // 1. GET /api/v1/payouts - Danh sách chi trả
  if ((path === "" || path === "/") && method === "GET") {
    const trangThai = url.searchParams.get("trang_thai");
    const hinhThuc = url.searchParams.get("hinh_thuc");
    const thang = url.searchParams.get("thang");

    let list = backendStore.payouts;
    if (trangThai && trangThai !== "ALL") {
      list = list.filter((p) => p.trangThai === trangThai);
    }
    if (hinhThuc && hinhThuc !== "ALL") {
      list = list.filter((p) => p.hinhThuc === hinhThuc);
    }
    if (thang && thang !== "ALL") {
      list = list.filter((p) => String(p.thang) === String(thang));
    }

    const totalMoney = list.reduce((acc, p) => acc + p.soTien, 0);
    const paidCount = list.filter((p) => p.trangThai === "ĐÃ_CHI_TRẢ").length;

    return jsonOk({
      total: list.length,
      paid_count: paidCount,
      pending_count: list.length - paidCount,
      total_amount: totalMoney,
      items: list,
    });
  }

  // 2. POST /api/v1/payouts/batch-pay - Phát tiền hàng loạt (TC-PAY-02)
  if (path === "/batch-pay" && method === "POST") {
    try {
      const body = await req.json() as { ids?: string[] };
      const ids = body.ids || [];

      if (!Array.isArray(ids) || ids.length === 0) {
        return jsonBadRequest("Vui lòng cung cấp mảng danh sách ID cần phát tiền");
      }

      let updatedCount = 0;
      const today = new Date().toLocaleDateString("vi-VN");

      backendStore.payouts.forEach((p) => {
        if (ids.includes(p.id)) {
          p.trangThai = "ĐÃ_CHI_TRẢ";
          p.ngayChi = today;
          p.maGiaoDich = `UNC-BATCH-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          updatedCount++;
        }
      });

      backendStore.logAudit(
        "Phát tiền hàng loạt",
        `Đã giải ngân chi trả trợ cấp cho ${updatedCount} đối tượng qua hệ thống ngân hàng / bưu điện`,
        backendStore.currentUser.tenCanBo
      );

      return jsonOk({
        updated_count: updatedCount,
        ids: ids,
      }, `Đã phát tiền thành công cho ${updatedCount} đối tượng!`);
    } catch {
      return jsonBadRequest("Dữ liệu phát tiền hàng loạt không hợp lệ");
    }
  }

  // 3. POST /api/v1/payouts/reconcile - Đối soát tự động ngân hàng (TC-REC-01, TC-REC-02)
  if (path === "/reconcile" && method === "POST") {
    try {
      const body = await req.json() as {
        bankName?: string;
        records?: Array<{
          maGiaoDich?: string;
          cccd?: string;
          soTien?: number;
          trangThai: "THÀNH_CÔNG" | "THẤT_BẠI";
          lyDoLoi?: string;
        }>;
      };

      const bank = body.bankName || "Vietcombank";
      const records = body.records || [];

      if (!Array.isArray(records) || records.length === 0) {
        return jsonBadRequest("Danh sách bản ghi sao kê đối soát không được để trống");
      }

      let matchedSuccess = 0;
      let matchedFailed = 0;
      let totalAmountReconciled = 0;

      records.forEach((rec) => {
        const payout = backendStore.payouts.find((p) => (rec.cccd && p.cccd === rec.cccd) || (rec.maGiaoDich && p.maGiaoDich === rec.maGiaoDich));
        if (payout) {
          totalAmountReconciled += payout.soTien;
          if (rec.trangThai === "THÀNH_CÔNG") {
            payout.trangThai = "ĐÃ_CHI_TRẢ";
            payout.ngayChi = new Date().toLocaleDateString("vi-VN");
            matchedSuccess++;
          } else {
            // TC-REC-02: Lỗi đối soát, chuyển sang TỒN_ĐỌNG
            payout.trangThai = "TỒN_ĐỌNG";
            payout.ghiChu = `[LỖI ĐỐI SOÁT ${bank.toUpperCase()}: ${rec.lyDoLoi || "Tài khoản bị đóng / sai số thẻ"}]`;
            matchedFailed++;
          }
        }
      });

      backendStore.logAudit(
        "Đối soát ngân hàng",
        `Đối soát tệp sao kê ${bank}: ${matchedSuccess} thành công, ${matchedFailed} lỗi/tồn đọng`,
        backendStore.currentUser.tenCanBo
      );

      return jsonOk({
        bank_name: bank,
        total_records: records.length,
        matched_success: matchedSuccess,
        matched_failed: matchedFailed,
        total_amount: totalAmountReconciled,
      }, `Hoàn tất đối soát sao kê ${bank}! Khớp ${matchedSuccess}/${records.length} giao dịch.`);
    } catch (err) {
      return jsonBadRequest("Lỗi trong quá trình xử lý đối soát ngân hàng", err instanceof Error ? err.message : String(err));
    }
  }

  // 4. POST /api/v1/payouts/:id/pay - Phát tiền đơn lẻ (TC-PAY-01)
  const payMatch = path.match(/^\/([^/]+)\/pay$/);
  if (payMatch && method === "POST") {
    const id = decodeURIComponent(payMatch[1]);
    const item = backendStore.payouts.find((p) => p.id === id);

    if (!item) {
      return jsonNotFound(`Không tìm thấy bản ghi chi trả: ${id}`);
    }

    item.trangThai = "ĐÃ_CHI_TRẢ";
    item.ngayChi = new Date().toLocaleDateString("vi-VN");
    item.maGiaoDich = `UNC-VCB-20260905-${Math.floor(1000 + Math.random() * 9000)}`;

    backendStore.logAudit(
      "Phát tiền đơn lẻ",
      `Chi trả ${item.soTien.toLocaleString("vi-VN")} đ cho ${item.hoTen} (${item.cccd}) qua mã giao dịch ${item.maGiaoDich}`,
      backendStore.currentUser.tenCanBo
    );

    return jsonOk(item, `Đã chi trả thành công cho ${item.hoTen}!`);
  }

  // 5. GET /api/v1/payouts/:id/receipt - Xuất in Phiếu chi Mẫu C70a-HD (TC-PAY-03)
  const receiptMatch = path.match(/^\/([^/]+)\/receipt$/);
  if (receiptMatch && method === "GET") {
    const id = decodeURIComponent(receiptMatch[1]);
    const item = backendStore.payouts.find((p) => p.id === id);

    if (!item) {
      return jsonNotFound(`Không tìm thấy bản ghi chi trả: ${id}`);
    }

    return jsonOk({
      mau_bieu: "C70a-HD",
      co_quan_ban_hanh: "Bộ Tài chính",
      don_vi: "Phòng Lao động - Thương binh và Xã hội TP. Thủ Dầu Một",
      so_phieu: item.id,
      ma_vach: `*${item.id}*`,
      ho_ten: item.hoTen,
      cccd: item.cccd,
      dia_chi: `Phường ${item.phuong}, TP. Thủ Dầu Một`,
      so_tien: item.soTien,
      so_tien_bang_chu: docSoTienBangChu(item.soTien),
      ngay_chi: item.ngayChi || new Date().toLocaleDateString("vi-VN"),
      nguoi_lap_bieu: backendStore.currentUser.tenCanBo,
      thu_quy: "Trương Thị Hồng",
      ke_toan_truong: "Lê Văn Tám",
    });
  }

  return jsonNotFound();
}
