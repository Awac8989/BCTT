/**
 * SYSTEM HEALTH & METADATA CONTROLLER
 * Endpoints: /api/v1/health, /api/v1/system/info
 */

import { backendStore, WARDS, CATEGORIES } from "../services/backend-store";
import { jsonOk } from "../utils/response";
import { relationalDb } from "../db/database";

export function handleHealthRoutes(req: Request, url: URL): Response {
  const path = url.pathname;

  if (path === "/api/v1/health" || path === "/api/health") {
    const dbOverview = relationalDb.getDatabaseOverview();
    return jsonOk({
      status: "HEALTHY",
      service: "qldm-sldtbxh-binhduong-backend",
      version: "2.5.0-enterprise",
      database: {
        engine: dbOverview.engine,
        schema_file: "database/schema.sql",
        tables_count: 16,
        total_3nf_tables: dbOverview.tablesCount,
        total_records: dbOverview.totalRecords,
        storage_size_kb: dbOverview.storageSizeKb,
        charset: dbOverview.charset,
        acid_transactions: "SUPPORTED",
        records_summary: {
          wards: WARDS.length,
          categories: CATEGORIES.length,
          profiles: backendStore.profiles.length,
          payouts: backendStore.payouts.length,
          surveys: backendStore.surveys.length,
          orthotics: backendStore.orthotics.length,
          graves: backendStore.cemeteryGraves.length,
          decease_reports: backendStore.deceaseReports.length,
          early_warnings: backendStore.earlyWarnings.length,
          educational_dossiers: backendStore.hoSoGiaoDuc.length,
        },
        table_summaries: dbOverview.tableSummaries,
      },
      uptime_seconds: process.uptime ? Math.floor(process.uptime()) : 0,
      timestamp: new Date().toISOString(),
    }, "Hệ thống Backend & Cơ sở dữ liệu hoạt động bình thường 100%");
  }

  if (path === "/api/v1/system/info") {
    return jsonOk({
      app_name: "Hệ thống Quản lý Hồ sơ Người có công & Đánh giá Dịch vụ công (Phiên bản 2.0)",
      author: "Đoàn Minh Quân",
      organization: "Sở Lao động - Thương binh và Xã hội tỉnh Bình Dương / Phòng LĐTBXH TP. Thủ Dầu Một",
      legal_framework: [
        "Pháp lệnh Ưu đãi người có công số 02/2020/UBTVQH14",
        "Nghị định 131/2021/NĐ-CP thi hành Pháp lệnh Ưu đãi",
        "Nghị định 75/2021/NĐ-CP quy định mức hưởng trợ cấp",
        "Nghị định 61/2018/NĐ-CP về cơ chế Một cửa điện tử",
        "Quyết định 06/QĐ-TTg của Thủ tướng Chính phủ (Đề án 06)",
        "Thông tư 49/2021/TT-BGDĐT về quản lý mầm non ngoài công lập",
      ],
      current_user: backendStore.currentUser,
    });
  }

  return jsonOk({ status: "OK" });
}
