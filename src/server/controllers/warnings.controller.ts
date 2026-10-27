/**
 * EARLY WARNING SYSTEM CONTROLLER
 * Endpoints: /api/v1/early-warnings/*
 * Implements: TC-WRN-01 (18yo age limit), TC-WRN-02 (SLA deadline warnings)
 */

import { backendStore } from "../services/backend-store";
import { jsonOk, jsonNotFound, jsonBadRequest } from "../utils/response";

export async function handleWarningRoutes(req: Request, url: URL): Promise<Response> {
  const path = url.pathname.replace(/^\/api\/v1\/early-warnings/, "");
  const method = req.method;

  // 1. GET /api/v1/early-warnings - Danh sách cảnh báo sớm
  if ((path === "" || path === "/") && method === "GET") {
    const list = backendStore.earlyWarnings;
    const pendingCount = list.filter((w) => w.trangThai === "CHƯA_XỬ_LÝ").length;

    return jsonOk({
      total: list.length,
      pending_count: pendingCount,
      items: list,
    });
  }

  // 2. PATCH /api/v1/early-warnings/:id/resolve - Đánh dấu đã xử lý cảnh báo
  const resolveMatch = path.match(/^\/([^/]+)\/resolve$/);
  if (resolveMatch && method === "PATCH") {
    const id = decodeURIComponent(resolveMatch[1]);
    const warning = backendStore.earlyWarnings.find((w) => w.id === id);

    if (!warning) {
      return jsonNotFound(`Không tìm thấy cảnh báo: ${id}`);
    }

    warning.trangThai = "ĐÃ_XỬ_LÝ";
    backendStore.logAudit(
      "Xử lý cảnh báo",
      `Đã hoàn thành rà soát và đóng cảnh báo ${warning.id}: ${warning.tieuDe}`,
      backendStore.currentUser.tenCanBo
    );

    return jsonOk(warning, "Đã xử lý cảnh báo thành công");
  }

  return jsonBadRequest("Endpoint cảnh báo không tồn tại");
}
