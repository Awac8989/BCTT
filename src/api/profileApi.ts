/**
 * REST API CLIENT - PHÂN HỆ QUẢN LÝ HỒ SƠ
 * Contract: Phần 4.1 TDD
 */

import { appStore } from "@/services/app-state";
import { type CreateProfileInput } from "@/services/profile.validation";

export interface CreateProfileResponse {
  success: boolean;
  message: string;
  data?: {
    ho_so_id: number | string;
    ma_so_quan_ly: string;
    trang_thai_hs: string;
  };
}

export const profileApi = {
  /**
   * POST /api/v1/profiles
   * Tạo mới hồ sơ người có công
   */
  async createProfile(payload: CreateProfileInput): Promise<CreateProfileResponse> {
    // Giả lập network latency 150ms
    await new Promise((r) => setTimeout(r, 150));

    const result = appStore.createProfile(payload);
    if (!result.success) {
      throw new Error(result.message);
    }

    return {
      success: true,
      message: "Tạo hồ sơ thành công",
      data: {
        ho_so_id: result.hoSo?.id || "HS-2026-00105",
        ma_so_quan_ly: result.hoSo?.id || "HS-2026-00105",
        trang_thai_hs: result.hoSo?.trangThai || "MOI_TIEP_NHAN",
      },
    };
  },

  /**
   * GET /api/v1/profiles
   */
  async getProfiles() {
    return appStore.getState().hoSoList;
  },

  /**
   * GET /api/v1/profiles/:id
   */
  async getProfileById(id: string) {
    const list = appStore.getState().hoSoList;
    return list.find((h) => h.id === id) || null;
  },
};
