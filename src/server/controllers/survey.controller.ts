/**
 * SURVEY & CSAT / SIPAS CONTROLLER
 * Endpoints: /api/v1/surveys/*
 * Implements: TC-SUR-01, TC-SUR-02, TC-SUR-03
 */

import { backendStore } from "../services/backend-store";
import { analyzeSentiment } from "@/services/sentiment.service";
import { jsonOk, jsonCreated, jsonBadRequest } from "../utils/response";
import type { PhanHoi } from "@/data/mock";

export async function handleSurveyRoutes(req: Request, url: URL): Promise<Response> {
  const path = url.pathname.replace(/^\/api\/v1\/surveys/, "");

  // 1. POST /api/v1/surveys/submit - Tiếp nhận ý kiến đánh giá công dân (TC-SUR-01, TC-SUR-02)
  if ((path === "/submit" || path === "") && req.method === "POST") {
    try {
      const body = await req.json() as {
        ho_so_id?: string | number;
        hoSoId?: string | number;
        kenh_danh_gia?: "KIOSK" | "QR_PHIEU_HEN" | "SMS_ZALO";
        kenhDanhGia?: "KIOSK" | "QR_PHIEU_HEN" | "SMS_ZALO";
        diem_csat_chung?: number;
        diemCsat?: number;
        y_kien_dong_gop?: string;
        nhanXet?: string;
        tieu_chi?: Array<{ ma_tieu_chi: string; diem_so: number }>;
      };

      const hoSoId = String(body.ho_so_id || body.hoSoId || "KHONG_RO");
      const diemCsat = Number(body.diem_csat_chung ?? body.diemCsat ?? 5);
      const kenh = body.kenh_danh_gia || body.kenhDanhGia || "QR_PHIEU_HEN";
      const nhanXet = body.y_kien_dong_gop || body.nhanXet || "";

      if (diemCsat < 1 || diemCsat > 5) {
        return jsonBadRequest("Điểm đánh giá CSAT phải từ 1 đến 5 sao");
      }

      // Phân tích cảm xúc bằng Sentiment Engine tiếng Việt (TC-SUR-02)
      const sentimentResult = analyzeSentiment(nhanXet);
      let sentimentTag = sentimentResult.sentiment;

      // Nếu người dân chấm 1 hoặc 2 sao, tự động nâng cờ NEGATIVE nếu đang là NEUTRAL
      if (diemCsat <= 2 && sentimentTag === "NEUTRAL") {
        sentimentTag = "NEGATIVE";
      }

      const newId = `PH-${Date.now()}`;
      const now = new Date();

      const newSurvey: PhanHoi = {
        id: newId,
        hoSoId,
        nguoiGui: `Công dân (Hồ sơ ${hoSoId})`,
        ngayGui: now.toLocaleDateString("vi-VN"),
        diemCsat,
        nhanXet: nhanXet || (diemCsat >= 4 ? "Hài lòng với thái độ phục vụ của cán bộ." : "Cần rút ngắn thời gian giải quyết."),
        sentiment: sentimentTag,
        kenh: kenh === "KIOSK" ? "Kiosk Một cửa" : kenh === "QR_PHIEU_HEN" ? "Quét mã QR" : "Cổng DVC",
        tieuChi: {
          thaiDo: diemCsat,
          thoiGian: diemCsat <= 2 ? 2 : Math.min(5, diemCsat),
          minhBach: diemCsat >= 4 ? 5 : 3,
          haTang: 5,
        },
      };

      backendStore.surveys.unshift(newSurvey);

      // Nếu phản hồi TIÊU CỰC (<= 2 sao hoặc có từ khóa tiêu cực): Kích hoạt Cảnh Báo Sớm
      if (sentimentTag === "NEGATIVE" || diemCsat <= 2) {
        const warningId = `CB-CSAT-${Date.now()}`;
        backendStore.earlyWarnings.unshift({
          id: warningId,
          loai: "KHẢO_SÁT_TIÊU_CỰC",
          tieuDe: `Cảnh báo CSAT thấp (${diemCsat} sao) - Hồ sơ ${hoSoId}`,
          moTa: `Công dân đánh giá ${diemCsat} sao qua kênh ${newSurvey.kenh}. Nhận xét: "${newSurvey.nhanXet}". Cần rà soát thái độ phục vụ!`,
          mucDo: "CAO",
          ngayTao: now.toLocaleDateString("vi-VN"),
          trangThai: "CHƯA_XỬ_LÝ",
        });

        backendStore.logAudit(
          "Cảnh báo tiêu cực",
          `Phát hiện phản hồi CSAT ${diemCsat} sao (NEGATIVE) cho hồ sơ ${hoSoId}. Đã tạo cảnh báo ${warningId}`
        );
      } else {
        backendStore.logAudit(
          "Tiếp nhận CSAT",
          `Nhận đánh giá CSAT ${diemCsat} sao (${sentimentTag}) từ công dân qua ${newSurvey.kenh}`
        );
      }

      return jsonCreated({
        success: true,
        khao_sat_id: newId,
        diem_csat: diemCsat,
        sentiment_tag: sentimentTag,
        score: sentimentResult.score,
        kenh_danh_gia: kenh,
      }, "Tiếp nhận khảo sát thành công. Cảm ơn ý kiến đóng góp của bạn!");
    } catch (err) {
      return jsonBadRequest("Lỗi trong quá trình xử lý ý kiến khảo sát", err instanceof Error ? err.message : String(err));
    }
  }

  // 2. GET /api/v1/surveys/analytics - Phân tích CSAT & Radar SIPAS 4 tiêu chí
  if (path === "/analytics" && req.method === "GET") {
    const list = backendStore.surveys;
    const total = list.length;
    const avgCsat = total > 0 ? Number((list.reduce((acc, s) => acc + s.diemCsat, 0) / total).toFixed(2)) : 4.85;

    const positive = list.filter((s) => s.sentiment === "POSITIVE").length;
    const neutral = list.filter((s) => s.sentiment === "NEUTRAL").length;
    const negative = list.filter((s) => s.sentiment === "NEGATIVE").length;

    // Tính điểm 4 tiêu chí chuẩn SIPAS
    const thaiDoAvg = total > 0 ? Number((list.reduce((acc, s) => acc + (s.tieuChi?.thaiDo || s.diemCsat), 0) / total).toFixed(2)) : 4.8;
    const thoiGianAvg = total > 0 ? Number((list.reduce((acc, s) => acc + (s.tieuChi?.thoiGian || s.diemCsat), 0) / total).toFixed(2)) : 4.6;
    const minhBachAvg = total > 0 ? Number((list.reduce((acc, s) => acc + (s.tieuChi?.minhBach || s.diemCsat), 0) / total).toFixed(2)) : 4.9;
    const haTangAvg = total > 0 ? Number((list.reduce((acc, s) => acc + (s.tieuChi?.haTang || 5), 0) / total).toFixed(2)) : 4.7;

    return jsonOk({
      total_surveys: total,
      average_csat: avgCsat,
      csat_percentage: Number(((avgCsat / 5) * 100).toFixed(1)),
      sentiment_breakdown: {
        positive,
        neutral,
        negative,
        positive_rate: total > 0 ? Number(((positive / total) * 100).toFixed(1)) : 88.5,
      },
      sipas_radar_criteria: [
        { ma: "THAI_DO", label: "Thái độ phục vụ", score: thaiDoAvg, max: 5 },
        { ma: "THOI_GIAN", label: "Thời gian xử lý", score: thoiGianAvg, max: 5 },
        { ma: "MINH_BACH", label: "Công khai, minh bạch", score: minhBachAvg, max: 5 },
        { ma: "HA_TANG", label: "Cơ sở vật chất & Kiosk", score: haTangAvg, max: 5 },
      ],
    });
  }

  // 3. GET /api/v1/surveys - Danh sách khảo sát
  if ((path === "" || path === "/") && req.method === "GET") {
    return jsonOk({
      total: backendStore.surveys.length,
      items: backendStore.surveys,
    });
  }

  return jsonBadRequest("Endpoint khảo sát không tồn tại");
}
