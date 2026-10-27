/**
 * CEMETERY GIS & ONLINE INCENSE RITUAL CONTROLLER
 * Endpoints: /api/v1/cemetery/*
 * Implements: TC-GIS-01, TC-GIS-02
 */

import { backendStore } from "../services/backend-store";
import { jsonOk, jsonNotFound, jsonBadRequest } from "../utils/response";

export async function handleCemeteryRoutes(req: Request, url: URL): Promise<Response> {
  const path = url.pathname.replace(/^\/api\/v1\/cemetery/, "");
  const method = req.method;

  // 1. GET /api/v1/cemetery/graves - Tra cứu & định vị mộ liệt sĩ GIS (TC-GIS-01)
  if ((path === "/graves" || path === "" || path === "/") && method === "GET") {
    const search = url.searchParams.get("search")?.toLowerCase() || "";
    const khuMo = url.searchParams.get("khu_mo");

    let items = backendStore.cemeteryGraves;
    if (search) {
      items = items.filter(
        (m) =>
          m.hoTen.toLowerCase().includes(search) ||
          m.soMo.toLowerCase().includes(search) ||
          m.queQuan.toLowerCase().includes(search)
      );
    }
    if (khuMo && khuMo !== "ALL") {
      items = items.filter((m) => m.khuMo === khuMo);
    }

    return jsonOk({
      total: items.length,
      items,
    });
  }

  // 2. POST /api/v1/cemetery/graves/:id/incense - Thắp hương tưởng niệm trực tuyến (TC-GIS-02)
  const incenseMatch = path.match(/^\/graves\/([^/]+)\/incense$/);
  if (incenseMatch && method === "POST") {
    const id = decodeURIComponent(incenseMatch[1]);
    const grave = backendStore.cemeteryGraves.find((m) => m.id === id || m.soMo === id);

    if (!grave) {
      return jsonNotFound(`Không tìm thấy phần mộ liệt sĩ: ${id}`);
    }

    grave.luotThapHuong = (grave.luotThapHuong || 0) + 1;

    backendStore.logAudit(
      "Dâng hương tưởng niệm",
      `Công dân thắp nén hương tri ân trước phần mộ Liệt sĩ ${grave.hoTen} (${grave.soMo}, ${grave.khuMo})`
    );

    return jsonOk({
      grave_id: grave.id,
      so_mo: grave.soMo,
      ho_ten_liet_si: grave.hoTen,
      luot_thap_huong: grave.luotThapHuong,
    }, `Đã dâng nén tâm hương tri ân Liệt sĩ ${grave.hoTen}! Số lượt thắp hương hiện tại: ${grave.luotThapHuong}.`);
  }

  return jsonBadRequest("Endpoint nghĩa trang GIS không tồn tại");
}
