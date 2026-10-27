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
    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/v1/profiles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.message || "Lỗi khi tạo hồ sơ");
        }
        // Đồng bộ appStore
        appStore.createProfile(payload);
        return json;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        if (!msg.toLowerCase().includes("failed to fetch")) {
          throw err;
        }
      }
    }

    // Fallback in-memory
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
    if (typeof window !== "undefined") {
      try {
        const res = await fetch("/api/v1/profiles");
        if (res.ok) {
          const json = await res.json();
          if (json.data?.items) {
            return json.data.items;
          }
        }
      } catch {
        // Fallback below
      }
    }
    return appStore.getState().hoSoList;
  },

  /**
   * GET /api/v1/profiles/:id
   */
  async getProfileById(id: string) {
    if (typeof window !== "undefined") {
      try {
        const res = await fetch(`/api/v1/profiles/${id}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data) return json.data;
        }
      } catch {
        // Fallback below
      }
    }
    const list = appStore.getState().hoSoList;
    return list.find((h) => h.id === id) || null;
  },
};
