/**
 * CONTROLLER: CHẤM ĐIỂM KPI CÔNG VỤ ĐA CHIỀU & CƠ CHẾ THƯỞNG PHẠT
 * Căn cứ pháp lý: Nghị định 90/2020/NĐ-CP, Nghị định 48/2023/NĐ-CP, Quyết định 766/QĐ-TTg
 */

import { jsonOk, jsonCreated, jsonBadRequest, jsonNotFound } from "../utils/response";
import { appStore } from "@/services/app-state";

export async function handleKpiRoutes(request: Request, url: URL): Promise<Response> {
  const method = request.method;
  const pathname = url.pathname;

  // 1. GET /api/v1/kpi/evaluations - Lấy danh sách phiếu đánh giá KPI
  if (method === "GET" && pathname === "/api/v1/kpi/evaluations") {
    const list = appStore.getState().kpiEvaluationList;
    const canBoId = url.searchParams.get("canBoId");
    const ky = url.searchParams.get("ky");
    const xepLoai = url.searchParams.get("xepLoai");

    let filtered = list;
    if (canBoId) filtered = filtered.filter((k) => k.canBoId === canBoId);
    if (ky) filtered = filtered.filter((k) => k.kyDanhGia === ky);
    if (xepLoai) filtered = filtered.filter((k) => k.xepLoai === xepLoai);

    return jsonOk(filtered, "Lấy danh sách đánh giá KPI thành công");
  }

  // 2. GET /api/v1/kpi/summary-stats - Thống kê tổng hợp KPI lãnh đạo
  if (method === "GET" && pathname === "/api/v1/kpi/summary-stats") {
    const list = appStore.getState().kpiEvaluationList;
    const tongSoCanBo = list.length;
    const soXuatSac = list.filter((k) => k.xepLoai === "HOAN_THANH_XUAT_SAC").length;
    const soTot = list.filter((k) => k.xepLoai === "HOAN_THANH_TOT").length;
    const soHoanThanh = list.filter((k) => k.xepLoai === "HOAN_THANH").length;
    const soChuaDat = list.filter((k) => k.xepLoai === "KHONG_HOAN_THANH").length;
    const tongDiemThuong = list.reduce((acc, k) => acc + k.tongDiemThuong, 0);
    const tongDiemTru = list.reduce((acc, k) => acc + k.tongDiemTru, 0);
    const diemTrungBinh = Number((list.reduce((acc, k) => acc + k.diemTongKetCuoiCung, 0) / (tongSoCanBo || 1)).toFixed(1));
    const tyLeXuatSacPercent = Number(((soXuatSac / (tongSoCanBo || 1)) * 100).toFixed(1));

    return jsonOk({
      tongSoCanBo,
      soXuatSac,
      soTot,
      soHoanThanh,
      soChuaDat,
      tongDiemThuong,
      tongDiemTru,
      diemTrungBinh,
      tyLeXuatSacPercent,
    }, "Lấy thống kê tổng hợp KPI thành công");
  }

  // 3. GET /api/v1/kpi/evaluations/:id - Lấy chi tiết phiếu đánh giá KPI
  const detailMatch = pathname.match(/^\/api\/v1\/kpi\/evaluations\/([^/]+)$/);
  if (method === "GET" && detailMatch) {
    const id = detailMatch[1];
    const found = appStore.getState().kpiEvaluationList.find((k) => k.id === id);
    if (!found) {
      return jsonNotFound(`Không tìm thấy phiếu đánh giá KPI có mã '${id}'`);
    }
    return jsonOk(found, "Lấy chi tiết phiếu đánh giá KPI thành công");
  }

  // 4. POST /api/v1/kpi/evaluations/:id/self-eval - Cán bộ tự chấm điểm 5 tiêu chí
  const selfEvalMatch = pathname.match(/^\/api\/v1\/kpi\/evaluations\/([^/]+)\/self-eval$/);
  if (method === "POST" && selfEvalMatch) {
    const id = selfEvalMatch[1];
    const body = await request.json().catch(() => null);
    const tc1 = body?.tc1 ?? body?.tieuChi1;
    const tc2 = body?.tc2 ?? body?.tieuChi2;
    const tc3 = body?.tc3 ?? body?.tieuChi3;
    const tc4 = body?.tc4 ?? body?.tieuChi4;
    const tc5 = body?.tc5 ?? body?.tieuChi5;

    if (typeof tc1 !== "number") {
      return jsonBadRequest("Dữ liệu tự chấm điểm không hợp lệ. Cần tc1/tieuChi1..tc5/tieuChi5.");
    }

    appStore.capNhatTuChamKpi(id, {
      tc1,
      tc2: tc2 ?? 0,
      tc3: tc3 ?? 0,
      tc4: tc4 ?? 0,
      tc5: tc5 ?? 0,
      ghiChu: body?.ghiChu,
    });

    const updated = appStore.getState().kpiEvaluationList.find((k) => k.id === id);
    return jsonOk(updated, "Cập nhật bảng tự chấm điểm KPI thành công");
  }

  // 5. POST /api/v1/kpi/evaluations/:id/penalty-bonus - Ghi nhận điểm thưởng / điểm trừ
  const bonusMatch = pathname.match(/^\/api\/v1\/kpi\/evaluations\/([^/]+)\/penalty-bonus$/);
  if (method === "POST" && bonusMatch) {
    const id = bonusMatch[1];
    const body = await request.json().catch(() => null);
    if (!body || !body.loai || typeof body.soDiem !== "number" || !body.lyDo) {
      return jsonBadRequest("Dữ liệu điểm thưởng/trừ không đầy đủ. Cần loai ('THUONG' | 'PHAT'), soDiem, lyDo.");
    }

    appStore.ghiNhanDiemThuongPhat(id, {
      loai: body.loai,
      soDiem: body.soDiem,
      maLoiHoacSangKien: body.maLoiHoacSangKien || "DIEM_CONG_TRU",
      lyDo: body.lyDo,
      chungTuLienQuan: body.chungTuLienQuan,
    });

    const updated = appStore.getState().kpiEvaluationList.find((k) => k.id === id);
    return jsonCreated(updated, `Ghi nhận điểm ${body.loai === "THUONG" ? "thưởng" : "trừ"} thành công`);
  }

  // 6. POST /api/v1/kpi/evaluations/:id/leader-eval - Lãnh đạo thẩm định, bút phê và ký số SmartCA
  const leaderMatch = pathname.match(/^\/api\/v1\/kpi\/evaluations\/([^/]+)\/leader-eval$/);
  if (method === "POST" && leaderMatch) {
    const id = leaderMatch[1];
    const body = await request.json().catch(() => null);
    if (!body || !body.nhanXetButPhe) {
      return jsonBadRequest("Vui lòng nhập nhận xét bút phê của Lãnh đạo.");
    }

    const calculatedDiem =
      body.diemLanhDao ??
      (body.tieuChi1 !== undefined
        ? Number(body.tieuChi1) + Number(body.tieuChi2 || 0) + Number(body.tieuChi3 || 0) + Number(body.tieuChi4 || 0) + Number(body.tieuChi5 || 0)
        : undefined);

    appStore.lanhDaoPheDuyetKpi(id, {
      diemLanhDao: calculatedDiem,
      nhanXetButPhe: body.nhanXetButPhe,
      deXuatKhenThuong: body.deXuatKhenThuong,
      maKySoSmartCA: body.maKySoSmartCA || `SHA256:${Date.now().toString(16)}...smartca`,
    });

    const updated = appStore.getState().kpiEvaluationList.find((k) => k.id === id);
    return jsonOk(updated, "Lãnh đạo đã phê duyệt và ký số bảng điểm KPI thành công");
  }

  return jsonNotFound(`Endpoint API '${pathname}' không hợp lệ trong phân hệ KPI`);
}
