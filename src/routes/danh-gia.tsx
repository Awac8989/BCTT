import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Star,
  QrCode,
  Tablet,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  ExternalLink,
  MessageSquare,
  Building,
  User,
  Clock,
  ShieldCheck,
  Send,
  Eye,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { keywordCloud, tieuChiRadar, xepHangPhuong } from "@/data/mock";
import { useAppState } from "@/services/app-state";

export const Route = createFileRoute("/danh-gia")({
  head: () => ({
    meta: [
      { title: "Giám sát Đánh giá Dịch vụ công (CSAT & SIPAS) · SLĐTBXH Bình Dương" },
      {
        name: "description",
        content:
          "Trung tâm giám sát thời gian thực tiếng nói và đánh giá của công dân về chất lượng phục vụ tại Bộ phận Một cửa theo 4 kênh: QR Giấy hẹn, Kiosk cảm ứng, Zalo ZNS và QR Phiếu chi.",
      },
    ],
  }),
  component: GiamSatDanhGiaPage,
});

const KENH_THU_THAP = [
  { ten: "QR trên Giấy hẹn Một cửa", luot: 1842, tyLe: 48, icon: QrCode, color: "text-blue-600 bg-blue-50 border-blue-200" },
  { ten: "Màn hình Kiosk tại quầy Một cửa", luot: 1387, tyLe: 36, icon: Tablet, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { ten: "Tin nhắn Zalo ZNS / SMS tự động", luot: 633, tyLe: 16, icon: Smartphone, color: "text-amber-600 bg-amber-50 border-amber-200" },
];

function GiamSatDanhGiaPage() {
  const { phanHoiList } = useAppState();
  const [selectedCanBo, setSelectedCanBo] = useState("Tất cả cán bộ tiếp nhận");
  const [selectedPhuong, setSelectedPhuong] = useState("Tất cả phường/xã");
  const [tabFilter, setTabFilter] = useState<"ALL" | "POSITIVE" | "NEGATIVE">("ALL");

  // Thống kê CSAT
  const tongSoLuot = phanHoiList.length + 3862;
  const haiLongCount = phanHoiList.filter((p) => p.diemCsat >= 4).length;
  const csatScore = Math.round(((haiLongCount + 3760) / tongSoLuot) * 100);
  const negativeList = phanHoiList.filter((p) => p.diemCsat <= 2);

  const filteredFeed = phanHoiList.filter((p) => {
    if (tabFilter === "POSITIVE") return p.diemCsat >= 4;
    if (tabFilter === "NEGATIVE") return p.diemCsat <= 2;
    return true;
  });

  const handleExportReport = () => {
    toast.success("Đang xuất Báo cáo Chỉ số Hài lòng SIPAS/CSAT định kỳ gửi UBND Tỉnh…");
  };

  return (
    <AppShell>
      {/* 1. Header Cán bộ theo phong cách Sở LĐTBXH Bình Dương */}
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-[#333333] flex items-baseline">
            Giám sát chất lượng Dịch vụ công
            <span className="text-sm font-normal text-[#777777] ml-2">
              (Chỉ số CSAT & Tiếng nói người dân)
            </span>
          </h1>
          <div className="text-xs text-[#666666] mt-0.5">
            Dữ liệu khảo sát được thu thập tự động từ người dân qua Mã QR Giấy hẹn, Kiosk cảm ứng và Zalo ZNS
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <a
            href="/khao-sat?maHoSo=BD/NCC-12029&kenh=QR_PHIEU_HEN"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-[3px] border border-[#00c0ef] bg-[#00c0ef]/10 text-[#0073b7] px-3 py-1 font-semibold hover:bg-[#00c0ef]/20 transition-colors"
            title="Mở tab mới mô phỏng giao diện khi người dân dùng điện thoại quét mã QR trên Giấy hẹn"
          >
            <ExternalLink className="size-3.5" />
            Mở giao diện Công dân quét QR
          </a>
          <button
            type="button"
            onClick={handleExportReport}
            className="flex items-center gap-1.5 rounded-[3px] bg-[#00a65a] hover:bg-[#008d4c] px-3.5 py-1 font-bold text-white shadow-xs cursor-pointer transition-colors"
          >
            <FileSpreadsheet className="size-3.5" />
            Xuất Báo cáo SIPAS gửi UBND Tỉnh
          </button>
        </div>
      </div>

      {/* 2. 4 Thẻ KPI Chỉ số Hài lòng (CSAT) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {/* Card 1: CSAT chung */}
        <div className="bg-white border-t-3 border-t-[#00a65a] border-x border-b border-[#d2d6de] p-3.5 rounded-xs shadow-xs">
          <div className="text-xs uppercase font-bold text-gray-500">Chỉ số hài lòng (CSAT)</div>
          <div className="text-2xl font-extrabold text-[#00a65a] mt-1 flex items-baseline gap-1">
            {csatScore}%
            <span className="text-xs font-normal text-gray-500">hài lòng</span>
          </div>
          <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
            <span className="text-[#00a65a] font-bold">▲ +1.4%</span> so với kỳ đánh giá trước
          </div>
        </div>

        {/* Card 2: Tổng lượt khảo sát */}
        <div className="bg-white border-t-3 border-t-[#00c0ef] border-x border-b border-[#d2d6de] p-3.5 rounded-xs shadow-xs">
          <div className="text-xs uppercase font-bold text-gray-500">Tổng lượt đánh giá</div>
          <div className="text-2xl font-extrabold text-[#0073b7] mt-1">
            {tongSoLuot.toLocaleString("vi-VN")}
            <span className="text-xs font-normal text-gray-500 ml-1">lượt</span>
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            Bao gồm tiếp nhận và chi trả trợ cấp
          </div>
        </div>

        {/* Card 3: Phản ánh cần xử lý */}
        <div className="bg-white border-t-3 border-t-[#dd4b39] border-x border-b border-[#d2d6de] p-3.5 rounded-xs shadow-xs">
          <div className="text-xs uppercase font-bold text-gray-500">Ý kiến chưa hài lòng (≤ 2 sao)</div>
          <div className="text-2xl font-extrabold text-[#dd4b39] mt-1">
            {negativeList.length + 3}
            <span className="text-xs font-normal text-gray-500 ml-1">phản ánh</span>
          </div>
          <div className="text-[11px] text-red-600 font-semibold mt-1">
            Cần cán bộ Một cửa liên hệ giải trình
          </div>
        </div>

        {/* Card 4: Kênh hiệu quả nhất */}
        <div className="bg-white border-t-3 border-t-[#f39c12] border-x border-b border-[#d2d6de] p-3.5 rounded-xs shadow-xs">
          <div className="text-xs uppercase font-bold text-gray-500">Kênh quét QR Giấy hẹn</div>
          <div className="text-2xl font-extrabold text-[#f39c12] mt-1">
            48%
            <span className="text-xs font-normal text-gray-500 ml-1">(1.842 lượt)</span>
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            Tỷ lệ người dân quét qua Zalo/Camera
          </div>
        </div>
      </div>

      {/* 3. Phân tích Kênh Thu Thập Ý Kiến Thực Tế Của Người Dân */}
      <div className="bg-white border border-[#d2d6de] rounded-xs shadow-xs p-4 mb-4">
        <h3 className="font-bold text-xs uppercase text-gray-800 tracking-wider mb-3 flex items-center gap-1.5">
          <QrCode className="size-4 text-[#dd4b39]" />
          Phương thức người dân tiếp cận để thực hiện đánh giá:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {KENH_THU_THAP.map((k) => {
            const Icon = k.icon;
            return (
              <div key={k.ten} className={`p-3.5 rounded border ${k.color} flex items-center gap-3`}>
                <div className="p-2.5 rounded bg-white shadow-2xs shrink-0">
                  <Icon className="size-6 text-gray-800" />
                </div>
                <div>
                  <div className="font-bold text-xs text-gray-900">{k.ten}</div>
                  <div className="text-xs text-gray-600 mt-0.5">
                    <strong>{k.luot.toLocaleString("vi-VN")} lượt</strong> ({k.tyLe}% tổng số)
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Bộ Lọc Nghiệp Vụ Cán Bộ */}
      <div className="bg-white border border-[#d2d6de] rounded-xs shadow-xs p-3 mb-4 grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
        <div>
          <label className="text-gray-600 block mb-1 font-medium">Từ ngày:</label>
          <input
            type="date"
            defaultValue="2026-08-01"
            className="w-full rounded border border-[#d2d6de] px-2.5 py-1.5 outline-none focus:border-[#dd4b39]"
          />
        </div>
        <div>
          <label className="text-gray-600 block mb-1 font-medium">Đến ngày:</label>
          <input
            type="date"
            defaultValue="2026-09-05"
            className="w-full rounded border border-[#d2d6de] px-2.5 py-1.5 outline-none focus:border-[#dd4b39]"
          />
        </div>
        <div>
          <label className="text-gray-600 block mb-1 font-medium">Cán bộ tiếp nhận:</label>
          <select
            value={selectedCanBo}
            onChange={(e) => setSelectedCanBo(e.target.value)}
            className="w-full rounded border border-[#d2d6de] px-2.5 py-1.5 outline-none focus:border-[#dd4b39] bg-white"
          >
            <option>Tất cả cán bộ tiếp nhận</option>
            <option>Nguyễn Văn An (Một cửa TP)</option>
            <option>Phạm Thị Lệ (Một cửa Chánh Nghĩa)</option>
            <option>Trần Quốc Bảo (Một cửa Phú Cường)</option>
            <option>Lý Thu Vân (Một cửa Định Hòa)</option>
          </select>
        </div>
        <div>
          <label className="text-gray-600 block mb-1 font-medium">Phường / Xã tiếp nhận:</label>
          <select
            value={selectedPhuong}
            onChange={(e) => setSelectedPhuong(e.target.value)}
            className="w-full rounded border border-[#d2d6de] px-2.5 py-1.5 outline-none focus:border-[#dd4b39] bg-white"
          >
            <option>Tất cả phường/xã</option>
            {xepHangPhuong.map((p) => (
              <option key={p.phuong}>{p.phuong}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 5. Biểu Đồ Radar 4 Tiêu Chí & Bảng Xếp Hạng 14 Phường */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Radar 4 tiêu chí cốt lõi */}
        <div className="bg-white border border-[#d2d6de] rounded-xs shadow-xs p-4">
          <div className="font-bold text-xs uppercase text-gray-800 tracking-wider mb-2">
            Đánh giá theo 4 tiêu chí cốt lõi (Chuẩn SIPAS)
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={tieuChiRadar}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="tieuChi" tick={{ fill: "#4b5563", fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 5]} />
                <Radar name="Điểm thực tế" dataKey="diem" stroke="#dd4b39" fill="#dd4b39" fillOpacity={0.4} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: 6,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                    fontSize: 12,
                    color: "#1f2937",
                  }}
                  formatter={(val: any) => [`${val} / 5.0 điểm`, "Điểm đánh giá"]}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs mt-2 border-t pt-2">
            <div>
              <div className="text-gray-500">Thái độ phục vụ</div>
              <strong className="text-emerald-700 font-bold">4.88 / 5</strong>
            </div>
            <div>
              <div className="text-gray-500">Thời gian xử lý</div>
              <strong className="text-blue-700 font-bold">4.82 / 5</strong>
            </div>
            <div>
              <div className="text-gray-500">Tính minh bạch</div>
              <strong className="text-emerald-700 font-bold">4.91 / 5</strong>
            </div>
            <div>
              <div className="text-gray-500">Cơ sở vật chất</div>
              <strong className="text-amber-700 font-bold">4.75 / 5</strong>
            </div>
          </div>
        </div>

        {/* Bảng xếp hạng mức độ hài lòng 14 Phường/Xã */}
        <div className="bg-white border border-[#d2d6de] rounded-xs shadow-xs p-4 flex flex-col justify-between">
          <div>
            <div className="font-bold text-xs uppercase text-gray-800 tracking-wider mb-2">
              Xếp hạng CSAT theo 14 Phường/Xã tại TP. Thủ Dầu Một
            </div>
            <div className="overflow-y-auto max-h-64 text-xs">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50 text-gray-600">
                    <th className="p-2 text-left">Phường / Xã</th>
                    <th className="p-2 text-center">Số lượt</th>
                    <th className="p-2 text-center">Tỷ lệ CSAT</th>
                    <th className="p-2 text-center">Xếp loại</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {xepHangPhuong.map((p, idx) => (
                    <tr key={p.phuong} className="hover:bg-gray-50">
                      <td className="p-2 font-medium text-gray-900">
                        {idx + 1}. {p.phuong}
                      </td>
                      <td className="p-2 text-center font-mono">{p.luot}</td>
                      <td className="p-2 text-center font-bold text-emerald-700 font-mono">
                        {p.csat}%
                      </td>
                      <td className="p-2 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Xuất sắc
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Danh Sách Ý Kiến Người Dân Đổ Về Thời Gian Thực */}
      <div className="bg-white border border-[#d2d6de] rounded-xs shadow-xs p-4 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 mb-3">
          <div>
            <div className="font-bold text-sm text-gray-900">
              Nhật ký tiếp nhận ý kiến của Người Dân theo thời gian thực
            </div>
            <div className="text-xs text-gray-500">
              Cán bộ có trách nhiệm theo dõi và xử lý giải trình đối với các đánh giá dưới 3 sao
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => setTabFilter("ALL")}
              className={`px-3 py-1 rounded transition-colors font-medium ${
                tabFilter === "ALL" ? "bg-gray-800 text-white font-bold" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Tất cả ({phanHoiList.length})
            </button>
            <button
              type="button"
              onClick={() => setTabFilter("POSITIVE")}
              className={`px-3 py-1 rounded transition-colors font-medium ${
                tabFilter === "POSITIVE" ? "bg-emerald-700 text-white font-bold" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              }`}
            >
              Hài lòng (≥ 4★)
            </button>
            <button
              type="button"
              onClick={() => setTabFilter("NEGATIVE")}
              className={`px-3 py-1 rounded transition-colors font-medium ${
                tabFilter === "NEGATIVE" ? "bg-[#dd4b39] text-white font-bold" : "bg-red-50 text-[#dd4b39] hover:bg-red-100"
              }`}
            >
              Cần xử lý (≤ 2★)
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {filteredFeed.map((item) => {
            const isNegative = item.diemCsat <= 2;
            return (
              <div
                key={item.id}
                className={`p-3.5 rounded border transition-colors ${
                  isNegative
                    ? "border-red-300 bg-red-50/50"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-gray-800">
                      Mã HS: {item.hoSoId}
                    </span>
                    <span className="text-gray-400">|</span>
                    <span className="text-xs text-gray-500">
                      Kênh: <strong>{item.kenh === "QR_PHIEU_HEN" ? "QR Giấy hẹn" : "Kiosk một cửa"}</strong>
                    </span>
                    <span className="text-gray-400">|</span>
                    <span className="text-[11px] text-gray-500 font-mono">
                      {item.ngay}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`size-3.5 ${
                            i < item.diemCsat ? "fill-amber-400 text-amber-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded font-bold ${
                        isNegative
                          ? "bg-red-100 text-red-700"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {item.diemCsat} / 5 Sao
                    </span>
                  </div>
                </div>

                <div className="text-xs text-gray-800 mt-2 font-medium">
                  {item.yKien}
                </div>

                {/* Tiêu chí chi tiết */}
                {item.tieuChi && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 pt-2 border-t border-gray-100 text-[11px] text-gray-600">
                    <div>Thái độ: <strong>{item.tieuChi.thaiDo}/5★</strong></div>
                    <div>Thời gian: <strong>{item.tieuChi.thoiGian}/5★</strong></div>
                    <div>Minh bạch: <strong>{item.tieuChi.minhBach}/5★</strong></div>
                    <div>Hạ tầng: <strong>{item.tieuChi.haTang}/5★</strong></div>
                  </div>
                )}

                {/* Xử lý kiến nghị nếu không hài lòng */}
                {isNegative && (
                  <div className="mt-2.5 pt-2 border-t border-red-200 flex items-center justify-between">
                    <span className="text-[11px] text-red-600 font-semibold flex items-center gap-1">
                      <AlertTriangle className="size-3.5" />
                      Phản ánh chưa hài lòng: Yêu cầu Tổ Một cửa liên hệ xác minh giải trình
                    </span>
                    <button
                      type="button"
                      onClick={() => toast.info(`Đã mở biên bản giải trình cho phản ánh của hồ sơ ${item.hoSoId}`)}
                      className="px-2.5 py-1 bg-white border border-red-300 text-red-700 hover:bg-red-100 rounded text-xs font-bold transition-colors cursor-pointer"
                    >
                      Lập biên bản giải trình
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
