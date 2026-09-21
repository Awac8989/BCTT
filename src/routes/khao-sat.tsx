import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  Star,
  CheckCircle,
  RotateCcw,
  Sparkles,
  QrCode,
  Smartphone,
  Tablet,
  FileCheck2,
  Building2,
  Send,
  Heart,
  Smile,
  Meh,
  Frown,
} from "lucide-react";
import { appStore } from "@/services/app-state";
import { analyzeSentiment } from "@/services/sentiment.service";

export const Route = createFileRoute("/khao-sat")({
  head: () => ({
    meta: [
      { title: "Cổng đánh giá sự hài lòng của công dân · UBND Tỉnh Bình Dương - SLĐTBXH" },
      {
        name: "description",
        content:
          "Hệ thống khảo sát độc lập dành riêng cho người dân, người có công và thân nhân đánh giá chất lượng phục vụ của Bộ phận Một cửa.",
      },
    ],
  }),
  component: CongDanKhaoSatPage,
});

const TIEU_CHI_CONFIG = [
  { id: "thaiDo", name: "1. Thái độ phục vụ và tinh thần trách nhiệm của cán bộ", icon: "🤝" },
  { id: "thoiGian", name: "2. Thời gian tiếp nhận và xử lý hồ sơ hành chính", icon: "⏱️" },
  { id: "minhBach", name: "3. Tính công khai, rõ ràng của quy định và mức trợ cấp", icon: "📋" },
  { id: "haTang", name: "4. Cơ sở vật chất, nơi ngồi chờ và trang thiết bị phục vụ", icon: "🏛️" },
] as const;

const QUICK_TAGS = [
  "Cán bộ nhiệt tình, chu đáo",
  "Hướng dẫn thủ tục dễ hiểu",
  "Giải quyết hồ sơ nhanh gọn",
  "Thái độ phục vụ lễ phép, kính trọng",
  "Cần giảm bớt giấy tờ chứng thực",
  "Thời gian chờ đợi cần nhanh hơn",
  "Cơ sở vật chất khang trang, sạch sẽ",
];

const CSAT_LEVELS = [
  { score: 5, label: "Rất hài lòng", icon: Smile, color: "text-emerald-600 border-emerald-500 bg-emerald-50" },
  { score: 4, label: "Hài lòng", icon: Smile, color: "text-blue-600 border-blue-500 bg-blue-50" },
  { score: 3, label: "Bình thường", icon: Meh, color: "text-amber-600 border-amber-500 bg-amber-50" },
  { score: 2, label: "Chưa hài lòng", icon: Frown, color: "text-orange-600 border-orange-500 bg-orange-50" },
  { score: 1, label: "Rất không hài lòng", icon: Frown, color: "text-red-600 border-red-500 bg-red-50" },
];

function CongDanKhaoSatPage() {
  // Lấy mã hồ sơ và kênh từ URL (ví dụ khi người dân quét mã QR trên Giấy hẹn)
  const urlParams = useMemo(() => {
    if (typeof window === "undefined") return { maHoSo: "BD/NCC-12029", kenh: "QR_PHIEU_HEN" };
    const params = new URLSearchParams(window.location.search);
    return {
      maHoSo: params.get("maHoSo") || "BD/NCC-12029",
      kenh: (params.get("kenh") as "QR_PHIEU_HEN" | "KIOSK" | "SMS_ZALO") || "QR_PHIEU_HEN",
    };
  }, []);

  const [maHoSo, setMaHoSo] = useState(urlParams.maHoSo);
  const [csatChung, setCsatChung] = useState<number>(5);
  const [tieuChi, setTieuChi] = useState({
    thaiDo: 5,
    thoiGian: 5,
    minhBach: 5,
    haTang: 5,
  });

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [yKien, setYKien] = useState("");
  const [daGui, setDaGui] = useState(false);
  const [countdown, setCountdown] = useState(30);

  // Phân tích sentiment thời gian thực
  const liveSentiment = analyzeSentiment(yKien);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleReset = () => {
    setCsatChung(5);
    setTieuChi({ thaiDo: 5, thoiGian: 5, minhBach: 5, haTang: 5 });
    setSelectedTags([]);
    setYKien("");
    setDaGui(false);
    setCountdown(30);
  };

  // Đồng hồ đếm ngược reset màn hình
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (daGui) {
      setCountdown(30);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleReset();
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [daGui]);

  // Gửi đánh giá vào CSDL hệ thống
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fullComment = [
      selectedTags.join(", "),
      yKien.trim(),
    ].filter(Boolean).join(" - ");

    appStore.submitSurvey({
      hoSoId: maHoSo,
      hoTen: "Công dân",
      kenhDanhGia: urlParams.kenh as "KIOSK" | "QR_PHIEU_HEN" | "SMS_ZALO",
      diemCsatChung: csatChung,
      tieuChi,
      yKienDongGop: fullComment || "Công dân đánh giá trực tiếp qua mã QR / Kiosk",
    });

    setDaGui(true);
    toast.success("Cảm ơn Quý Bác/Cô/Chú/Anh/Chị đã gửi ý kiến đánh giá!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-gray-50 text-gray-900 font-sans pb-16">
      {/* 1. Thanh chỉ đỏ trên cùng chuẩn Cổng Dịch vụ công */}
      <div className="h-1.5 w-full bg-[#dd4b39]" />

      {/* Thông báo phân định nghiệp vụ: Đây là màn hình mô phỏng công dân */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-900 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold uppercase tracking-wider bg-amber-200 px-1.5 py-0.5 rounded text-[10px] text-amber-950">
            MÔ PHỎNG CỔNG DÂN
          </span>
          <span>
            Đây là giao diện mô phỏng dành riêng cho <strong>Người dân quét mã QR trên Giấy hẹn</strong> hoặc tại <strong>Kiosk Một cửa</strong>.
          </span>
        </div>
        <Link
          to="/danh-gia"
          className="font-bold text-[#dd4b39] hover:underline flex items-center gap-1 shrink-0"
        >
          <span>⬅ Quay lại Phần mềm Cán bộ (Xem Đánh giá Cán bộ)</span>
        </Link>
      </div>

      {/* 2. Header Quốc Gia Dành Riêng Cho Công Dân (Độc lập, KHÔNG CÓ MENU CÁN BỘ) */}
      <header className="bg-white border-b border-gray-200 py-4 px-4 sm:px-8 shadow-xs">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          {/* Quốc huy & Tên cơ quan */}
          <div className="flex items-center gap-3.5">
            <div className="size-14 rounded-full bg-gradient-to-tr from-amber-400 via-red-500 to-amber-300 p-0.5 shadow-md shrink-0 flex items-center justify-center">
              <div className="size-full rounded-full bg-[#c82333] border border-amber-300 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="size-7 fill-amber-300" aria-label="Quốc huy Việt Nam">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                </svg>
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider font-bold text-gray-600">
                UBND TỈNH BÌNH DƯƠNG
              </div>
              <div className="text-sm sm:text-base font-extrabold uppercase text-[#dd4b39] tracking-tight">
                SỞ LAO ĐỘNG - THƯƠNG BINH VÀ XÃ HỘI
              </div>
              <div className="text-[11px] text-gray-500 font-medium">
                Cổng tiếp nhận ý kiến đánh giá chất lượng phục vụ của người dân
              </div>
            </div>
          </div>

          {/* Biểu tượng kênh tiếp nhận */}
          <div className="hidden sm:flex items-center gap-2 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full text-xs font-semibold text-[#dd4b39]">
            {urlParams.kenh === "QR_PHIEU_HEN" ? (
              <>
                <QrCode className="size-4" />
                <span>Quét mã QR Giấy hẹn</span>
              </>
            ) : urlParams.kenh === "KIOSK" ? (
              <>
                <Tablet className="size-4" />
                <span>Kiosk cảm ứng Một cửa</span>
              </>
            ) : (
              <>
                <Smartphone className="size-4" />
                <span>Khảo sát qua tin nhắn</span>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 3. Nội dung khảo sát chính */}
      <main className="max-w-2xl mx-auto px-4 pt-6">
        {daGui ? (
          /* MÀN HÌNH THƯ CẢM ƠN SAU KHI GỬI ĐÁNH GIÁ */
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center animate-in fade-in-50 duration-300">
            <div className="size-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <CheckCircle className="size-10" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              TRÂN TRỌNG CẢM ƠN QUÝ BÁC, CÔ, CHÚ!
            </h2>

            <p className="text-sm text-gray-600 mt-2 max-w-lg mx-auto leading-relaxed">
              Ý kiến đánh giá quý báu của Quý vị đã được ghi nhận trực tiếp vào Hệ thống Giám sát Dịch vụ công của Sở Lao động – Thương binh và Xã hội tỉnh Bình Dương.
            </p>

            <div className="my-6 p-4 rounded-lg bg-gray-50 border border-gray-200 text-left text-xs text-gray-700 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Mã số hồ sơ đã đánh giá:</span>
                <strong className="font-mono text-gray-900">{maHoSo}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Mức độ hài lòng chung:</span>
                <strong className="text-emerald-700 font-bold">{csatChung} / 5 Sao ({CSAT_LEVELS.find((l) => l.score === csatChung)?.label})</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Kênh gửi ý kiến:</span>
                <span>{urlParams.kenh === "QR_PHIEU_HEN" ? "Mã QR Giấy hẹn Một cửa" : "Kiosk điện tử Một cửa"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Thời gian tiếp nhận:</span>
                <span>{new Date().toLocaleString("vi-VN")}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#dd4b39] hover:bg-[#c23321] text-white text-sm font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="size-4" />
                Gửi thêm đánh giá khác
              </button>
            </div>

            <div className="text-xs text-gray-400 mt-6 flex items-center justify-center gap-1.5">
              <span>Màn hình sẽ tự động làm mới sau</span>
              <strong className="text-gray-700 font-mono text-sm">{countdown}s</strong>
            </div>
          </div>
        ) : (
          /* FORM KHẢO SÁT CHUẨN SIPAS & ĐỀ ÁN 06 DÀNH CHO CÔNG DÂN */
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hộp nhận diện mã hồ sơ từ QR */}
            <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-red-100 text-[#dd4b39] rounded-lg flex items-center justify-center shrink-0">
                  <FileCheck2 className="size-5" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">Hồ sơ tiếp nhận tại Một cửa:</div>
                  <div className="text-base font-bold text-gray-900 font-mono">{maHoSo}</div>
                </div>
              </div>
              <div className="text-right text-xs text-gray-500">
                <span>TP. Thủ Dầu Một</span>
              </div>
            </div>

            {/* CÂU HỎI 1: ĐÁNH GIÁ MỨC ĐỘ HÀI LÒNG CHUNG (CSAT) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6 text-center">
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Bác / Cô / Chú / Anh / Chị đánh giá mức độ hài lòng chung về dịch vụ tiếp nhận hồ sơ hôm nay như thế nào?
              </h2>
              <div className="text-xs text-gray-500 mt-1">
                (Vui lòng chạm / click để chọn mức độ phù hợp nhất)
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-5">
                {CSAT_LEVELS.map((level) => {
                  const Icon = level.icon;
                  const isSelected = csatChung === level.score;
                  return (
                    <button
                      key={level.score}
                      type="button"
                      onClick={() => setCsatChung(level.score)}
                      className={`p-3.5 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? `${level.color} shadow-md scale-105 font-bold`
                          : "border-gray-200 hover:border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className={`size-8 ${isSelected ? "" : "text-gray-400"}`} />
                      <span className="text-xs">{level.label}</span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: level.score }).map((_, i) => (
                          <Star key={i} className={`size-3 fill-current ${isSelected ? "text-amber-400" : "text-gray-300"}`} />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CÂU HỎI 2: ĐÁNH GIÁ THEO 4 TIÊU CHÍ CỐT LÕI CỦA BỘ PHẬN MỘT CỬA */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6">
              <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide border-b pb-2 mb-4 flex items-center gap-2">
                <Sparkles className="size-4 text-[#dd4b39]" />
                Đánh giá chi tiết 4 tiêu chí phục vụ:
              </h3>

              <div className="space-y-4">
                {TIEU_CHI_CONFIG.map((tc) => {
                  const currentScore = tieuChi[tc.id as keyof typeof tieuChi];
                  return (
                    <div
                      key={tc.id}
                      className="p-3.5 rounded-lg border border-gray-100 bg-gray-50/70 hover:bg-white transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="text-xs sm:text-sm font-semibold text-gray-800 flex items-center gap-2">
                          <span className="text-base">{tc.icon}</span>
                          <span>{tc.name}</span>
                        </div>

                        {/* Nút 5 sao lớn dễ chạm cho người lớn tuổi */}
                        <div className="flex items-center gap-1.5 self-end sm:self-auto">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setTieuChi((prev) => ({ ...prev, [tc.id]: star }))}
                              className="p-1 hover:scale-110 transition-transform cursor-pointer"
                              title={`${star} sao`}
                            >
                              <Star
                                className={`size-6 ${
                                  star <= currentScore
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-gray-300"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CÂU HỎI 3: Ý KIẾN GÓP Ý NHANH & LỜI NHẮN */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6">
              <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide border-b pb-2 mb-3">
                Ý kiến đóng góp xây dựng (nếu có):
              </h3>

              {/* Thẻ gợi ý nhanh */}
              <div className="text-xs text-gray-500 mb-2">Chạm nhanh các ý kiến phù hợp:</div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {QUICK_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-red-50 border-[#dd4b39] text-[#dd4b39] font-semibold"
                          : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {isSelected ? "✓ " : "+ "}
                      {tag}
                    </button>
                  );
                })}
              </div>

              {/* Ô văn bản góp ý */}
              <textarea
                value={yKien}
                onChange={(e) => setYKien(e.target.value)}
                rows={3}
                placeholder="Nhập thêm ý kiến của Quý vị để chúng tôi phục vụ ngày một tốt hơn..."
                className="w-full text-xs sm:text-sm p-3 border border-gray-300 rounded-lg outline-none focus:border-[#dd4b39] focus:ring-1 focus:ring-[#dd4b39]"
              />
            </div>

            {/* Nút gửi đánh giá lớn nổi bật */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-6 bg-[#dd4b39] hover:bg-[#c23321] text-white font-extrabold text-sm sm:text-base rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:shadow-lg active:scale-[0.99]"
              >
                <Send className="size-5" />
                GỬI Ý KIẾN ĐÁNH GIÁ
              </button>
              <div className="text-center text-[11px] text-gray-500 mt-2">
                Thông tin đánh giá được bảo mật và tự động đồng bộ về Sở LĐTBXH tỉnh Bình Dương
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
