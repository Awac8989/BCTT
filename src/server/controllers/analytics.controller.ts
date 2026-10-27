/**
 * ANALYTICS & DASHBOARD BI CONTROLLER
 * Endpoints: /api/v1/analytics/*
 */

import { backendStore, WARDS } from "../services/backend-store";
import { wardDensity } from "@/data/mock";
import { jsonOk } from "../utils/response";

export async function handleAnalyticsRoutes(req: Request, url: URL): Promise<Response> {
  const path = url.pathname.replace(/^\/api\/v1\/analytics/, "");

  // GET /api/v1/analytics/dashboard
  if ((path === "/dashboard" || path === "") && req.method === "GET") {
    const profiles = backendStore.profiles;
    const surveys = backendStore.surveys;

    const avgCsat =
      surveys.length > 0
        ? Number((surveys.reduce((acc, s) => acc + s.diemCsat, 0) / surveys.length).toFixed(2))
        : 4.85;

    // Phân bổ loại đối tượng
    const catMap: Record<string, number> = {};
    profiles.forEach((p) => {
      catMap[p.loaiDoiTuong] = (catMap[p.loaiDoiTuong] || 0) + 1;
    });

    const categoryDistribution = Object.entries(catMap).map(([name, count]) => ({
      name,
      count,
      percentage: Number(((count / profiles.length) * 100).toFixed(1)),
    }));

    // Mật độ 14 phường
    const heatMapWards = wardDensity.map((w, idx) => ({
      ward_id: idx + 1,
      ward_name: `Phường ${w.phuong}`,
      count: w.hoSo,
      budget: w.kinhPhi,
    }));

    // Tổng kinh phí hàng tháng
    const totalMonthlyPayout = profiles.reduce((acc, p) => acc + (p.mucTroCap || 0) + (p.phuCapPhucVu || 0), 0) + 24_600_000_000;

    return jsonOk({
      summary: {
        total_profiles: 12480 + profiles.length - 14,
        total_monthly_payout: totalMonthlyPayout,
        on_time_rate: 98.4,
        average_csat: avgCsat,
        pending_review_count: profiles.filter((p) => p.trangThai === "CHỜ_PHÊ_DUYỆT" || p.trangThai === "ĐANG_THẨM_ĐỊNH").length,
        early_warning_count: backendStore.earlyWarnings.filter((w) => w.trangThai === "CHƯA_XỬ_LÝ").length,
      },
      category_distribution: categoryDistribution,
      heat_map_wards: heatMapWards,
    }, "Lấy dữ liệu thống kê Dashboard thành công");
  }

  // GET /api/v1/analytics/budget
  if (path === "/budget" && req.method === "GET") {
    const totalYearlyBudget = 295_800_000_000; // ~295.8 tỷ đồng
    const disbursed = 221_850_000_000; // 75%

    return jsonOk({
      total_yearly_budget: totalYearlyBudget,
      disbursed_to_date: disbursed,
      disbursement_rate: Number(((disbursed / totalYearlyBudget) * 100).toFixed(1)),
      q1: 73950000000,
      q2: 73950000000,
      q3: 73950000000,
      q4_forecast: 73950000000,
      wards_allocation: WARDS.map((w) => ({
        ward_id: w.ward_id,
        ward_name: w.ward_name,
        allocated_budget: 18_500_000_000 + (w.ward_id * 800_000_000),
      })),
    });
  }

  return jsonOk({ endpoints: ["/dashboard", "/budget"] });
}
