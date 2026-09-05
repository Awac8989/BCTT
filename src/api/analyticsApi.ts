/**
 * REST API CLIENT - PHÂN HỆ THỐNG KÊ & DASHBOARD ANALYTICS
 * Contract: Phần 4.1 TDD
 */

import { appStore } from "@/services/app-state";
import { wardDensity } from "@/data/mock";

export interface DashboardAnalyticsResponse {
  success: boolean;
  data: {
    summary: {
      total_profiles: number;
      total_monthly_payout: number;
      on_time_rate: number;
      average_csat: number;
    };
    category_distribution: {
      name: string;
      count: number;
      percentage: number;
    }[];
    heat_map_wards: {
      ward_id: number;
      ward_name: string;
      count: number;
    }[];
  };
}

export const analyticsApi = {
  /**
   * GET /api/v1/analytics/dashboard
   */
  async getDashboardAnalytics(params?: { year?: number; ward_id?: string }): Promise<DashboardAnalyticsResponse> {
    await new Promise((r) => setTimeout(r, 100));

    const state = appStore.getState();
    const profiles = state.hoSoList;
    const surveys = state.phanHoiList;

    const avgCsat =
      surveys.length > 0
        ? Number((surveys.reduce((acc, s) => acc + s.diemCsat, 0) / surveys.length).toFixed(2))
        : 4.85;

    const heatMapWards = wardDensity.map((w, idx) => ({
      ward_id: idx + 1,
      ward_name: `Phường ${w.phuong}`,
      count: w.hoSo,
    }));

    return {
      success: true,
      data: {
        summary: {
          total_profiles: 12480 + profiles.length - 14,
          total_monthly_payout: 24650000000,
          on_time_rate: 98.4,
          average_csat: avgCsat,
        },
        category_distribution: [
          { name: "Thương binh", count: 5241, percentage: 42.0 },
          { name: "Thân nhân Liệt sĩ", count: 3744, percentage: 30.0 },
          { name: "Bệnh binh", count: 1872, percentage: 15.0 },
          { name: "CĐHH & khác", count: 1623, percentage: 13.0 },
        ],
        heat_map_wards: heatMapWards,
      },
    };
  },
};
