/**
 * REST API CLIENT - PHÂN HỆ KHẢO SÁT & ĐÁNH GIÁ DỊCH VỤ CÔNG
 * Contract: Phần 4.3 TDD
 */

import { appStore } from "@/services/app-state";

export interface SurveyApiRequest {
  ho_so_id?: string | number;
  kenh_danh_gia: "KIOSK" | "QR_PHIEU_HEN" | "SMS_ZALO";
  diem_csat_chung: number;
  y_kien_dong_gop?: string;
  tieu_chi?: {
    ma_tieu_chi: string; // 'THAI_DO' | 'THOI_GIAN' | 'MINH_BACH' | 'HA_TANG'
    diem_so: number;
  }[];
}

export interface SurveyApiResponse {
  success: boolean;
  message: string;
  data?: {
    khao_sat_id: string;
    sentiment_tag: string;
  };
}

export const surveyApi = {
  /**
   * POST /api/v1/surveys/submit
   */
  async submitSurvey(payload: SurveyApiRequest): Promise<SurveyApiResponse> {
    await new Promise((r) => setTimeout(r, 120));

    // Chuyển đổi mảng tiêu chí sang map
    const thaiDo = payload.tieu_chi?.find((t) => t.ma_tieu_chi === "THAI_DO")?.diem_so ?? payload.diem_csat_chung;
    const thoiGian = payload.tieu_chi?.find((t) => t.ma_tieu_chi === "THOI_GIAN")?.diem_so ?? payload.diem_csat_chung;
    const minhBach = payload.tieu_chi?.find((t) => t.ma_tieu_chi === "MINH_BACH")?.diem_so ?? payload.diem_csat_chung;
    const haTang = payload.tieu_chi?.find((t) => t.ma_tieu_chi === "HA_TANG")?.diem_so ?? payload.diem_csat_chung;

    const result = appStore.submitSurvey({
      hoSoId: String(payload.ho_so_id || "TDM-NCC-2026-00412"),
      kenhDanhGia: payload.kenh_danh_gia,
      diemCsatChung: payload.diem_csat_chung,
      yKienDongGop: payload.y_kien_dong_gop || "",
      tieuChi: { thaiDo, thoiGian, minhBach, haTang },
    });

    return {
      success: true,
      message: "Tiếp nhận khảo sát thành công. Cảm ơn ý kiến của bạn!",
      data: {
        khao_sat_id: result.khaoSatId,
        sentiment_tag: result.sentimentTag,
      },
    };
  },

  /**
   * GET /api/v1/surveys
   */
  async getSurveys() {
    return appStore.getState().phanHoiList;
  },
};
