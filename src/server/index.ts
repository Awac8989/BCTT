/**
 * BACKEND API ROUTER & DISPATCHER
 * Entry point for all incoming /api/* requests
 */

import { handleCorsPreflight, jsonOk, jsonNotFound, jsonServerError } from "./utils/response";
import { handleAuthRoutes } from "./controllers/auth.controller";
import { handleProfileRoutes } from "./controllers/profile.controller";
import { handleCalculatorRoutes } from "./controllers/calculator.controller";
import { handleSurveyRoutes } from "./controllers/survey.controller";
import { handleAnalyticsRoutes } from "./controllers/analytics.controller";
import { handlePayoutRoutes } from "./controllers/payout.controller";
import { handleDeceaseRoutes } from "./controllers/decease.controller";
import { handleOrthoticsRoutes } from "./controllers/orthotics.controller";
import { handleCemeteryRoutes } from "./controllers/cemetery.controller";
import { handleWarningRoutes } from "./controllers/warnings.controller";
import { handleGiaoDucRoutes } from "./controllers/giao-duc.controller";
import { handleVanHoaRoutes } from "./controllers/van-hoa.controller";
import { handleAnSinhRoutes } from "./controllers/an-sinh.controller";
import { handleKpiRoutes } from "./controllers/kpi.controller";
import { handleThongTinRoutes } from "./controllers/thong-tin.controller";
import { handleHealthRoutes } from "./controllers/health.controller";
import { handleDatabaseRoutes } from "./controllers/database.controller";

export async function handleBackendApiRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);

  // 1. Handle CORS Preflight OPTIONS requests
  if (request.method === "OPTIONS") {
    return handleCorsPreflight();
  }

  try {
    const pathname = url.pathname;

    // 2. Health & System Info
    if (pathname === "/api/health" || pathname === "/api/v1/health" || pathname === "/api/v1/system/info") {
      return handleHealthRoutes(request, url);
    }

    // 3. API Catalog Root
    if (pathname === "/api" || pathname === "/api/" || pathname === "/api/v1" || pathname === "/api/v1/") {
      return jsonOk({
        service: "Hệ thống Quản lý Hồ sơ Người có công & Đánh giá Dịch vụ công (Phiên bản 2.0)",
        api_version: "v1",
        base_url: "/api/v1",
        endpoints: {
          auth: "/api/v1/auth (login, me, switch-role, logout)",
          profiles: "/api/v1/profiles (CRUD, search, validation, ACID approve)",
          calculator: "/api/v1/calculator/allowance (NĐ 75/2021 financial engine)",
          surveys: "/api/v1/surveys (submit CSAT, analytics, SIPAS radar, sentiment)",
          analytics: "/api/v1/analytics/dashboard (stats, category distribution, 14 wards)",
          payouts: "/api/v1/payouts (batch pay, bank reconciliation, C70a-HD receipt)",
          decease_report: "/api/v1/decease-report (stop payouts, funeral grant Mẫu 02)",
          orthotics: "/api/v1/orthotics (assistive devices, 3-5yr lifespan alerts)",
          cemetery: "/api/v1/cemetery/graves (GIS map, online incense ritual)",
          early_warnings: "/api/v1/early-warnings (18yo age limit, overdue SLA)",
          giao_duc: "/api/v1/giao-duc (TTHC dossiers, 6-stage lifecycle, SmartCA)",
          van_hoa: "/api/v1/van-hoa (gia-dinh, khu-pho, di-tich, ton-giao, co-so-dich-vu, dia-chi-tin-cay)",
          kpi: "/api/v1/kpi (evaluations, penalty-bonus, leader SmartCA review)",
          health: "/api/v1/health (16 tables status & database verification)",
        },
      }, "Hệ thống Backend API hoạt động bình thường");
    }

    // 4. Domain Route Handlers
    if (pathname.startsWith("/api/v1/auth")) {
      return await handleAuthRoutes(request, url);
    }

    if (pathname.startsWith("/api/v1/profiles")) {
      return await handleProfileRoutes(request, url);
    }

    if (pathname.startsWith("/api/v1/calculator")) {
      return await handleCalculatorRoutes(request, url);
    }

    if (pathname.startsWith("/api/v1/surveys")) {
      return await handleSurveyRoutes(request, url);
    }

    if (pathname.startsWith("/api/v1/analytics")) {
      return await handleAnalyticsRoutes(request, url);
    }

    if (pathname.startsWith("/api/v1/payouts")) {
      return await handlePayoutRoutes(request, url);
    }

    if (pathname.startsWith("/api/v1/decease-report")) {
      return await handleDeceaseRoutes(request, url);
    }

    if (pathname.startsWith("/api/v1/orthotics")) {
      return await handleOrthoticsRoutes(request, url);
    }

    if (pathname.startsWith("/api/v1/cemetery")) {
      return await handleCemeteryRoutes(request, url);
    }

    if (pathname.startsWith("/api/v1/early-warnings")) {
      return await handleWarningRoutes(request, url);
    }

    if (pathname.startsWith("/api/v1/giao-duc")) {
      return await handleGiaoDucRoutes(request, url);
    }

    if (pathname.startsWith("/api/v1/van-hoa")) {
      return await handleVanHoaRoutes(request, url);
    }

    if (pathname.startsWith("/api/v1/an-sinh")) {
      return await handleAnSinhRoutes(request, url);
    }

    if (pathname.startsWith("/api/v1/kpi")) {
      return await handleKpiRoutes(request, url);
    }

    if (pathname.startsWith("/api/v1/thong-tin")) {
      return await handleThongTinRoutes(request, url);
    }

    if (pathname.startsWith("/api/v1/database")) {
      return await handleDatabaseRoutes(request, url);
    }

    return jsonNotFound(`Endpoint API '${pathname}' không tồn tại trên hệ thống`);
  } catch (error) {
    return jsonServerError("Lỗi không mong muốn trong quá trình xử lý yêu cầu API", error);
  }
}
