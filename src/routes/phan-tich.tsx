import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  Award,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Download,
  FileSpreadsheet,
  Sparkles,
  Building2,
  BarChart3,
  Check,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import {
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { AppShell, PageHeader } from "@/components/AppShell";
import {
  coCauDoiTuong,
  csatTheoThang,
  doiSoatCanhBao,
  formatNum,
  giaiNganTheoThang,
  phezuyetFunnel,
  wardDensity,
} from "@/data/mock";

export const Route = createFileRoute("/phan-tich")({
  head: () => ({
    meta: [
      { title: "Phân tích số liệu & báo cáo điều hành · Người có công" },
      {
        name: "description",
        content:
          "Bản đồ nhiệt 14 phường, cơ cấu đối tượng, phễu tiến độ, dự báo kinh phí và trích xuất báo cáo quyết toán chuẩn.",
      },
      { property: "og:title", content: "Phân tích số liệu chính sách Người có công" },
      {
        property: "og:description",
        content: "Trực quan hóa đa chiều dữ liệu hồ sơ và ngân sách chi trả trên toàn địa bàn.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PhanTich,
});

function heatTone(ratio: number) {
  // Gam màu xanh lam hành chính chuyển sắc mượt mà từ nhạt đến đậm
  return {
    backgroundColor: ratio > 0.7 ? "#00a65a" : ratio > 0.4 ? "#00c0ef" : "#3c8dbc",
    opacity: 0.2 + ratio * 0.75,
  };
}

function PhanTich() {
  const [activeTab, setActiveTab] = useState<"SO_LIEU" | "HIEU_QUA">("SO_LIEU");

  const handleExportHieuQuaReport = () => {
    const reportText = `BÁO CÁO ĐÁNH GIÁ HIỆU QUẢ ỨNG DỤNG HỆ THỐNG QUẢN LÝ NGHIỆP VỤ & DỊCH VỤ CÔNG
ĐƠN VỊ THỰC HIỆN: ỦY BAN NHÂN DÂN PHƯỜNG PHÚ CƯỜNG / SỞ LĐTBXH BÌNH DƯƠNG
ĐỀ TÀI: CHUYỂN ĐỔI SỐ QUẢN LÝ HỒ SƠ NGƯỜI CÓ CÔNG & ĐÁNH GIÁ DỊCH VỤ CÔNG THEO ĐỀ ÁN 06

1. HIỆU QUẢ CẢI CÁCH THỦ TỤC HÀNH CHÍNH (SLA & TIME SAVINGS)
- Thời gian thụ lý trung bình: Giảm từ 15 ngày làm việc xuống còn 2.8 ngày làm việc (Tiết kiệm 81.3% thời gian).
- Tỷ lệ hồ sơ giải quyết trước hạn và đúng hạn: 99.4% (Tăng từ mức 82.6% của phương thức thủ công).
- Thời gian tiếp nhận tại Bộ phận Một cửa: Giảm từ 25 phút/lượt xuống còn 3.5 phút/lượt nhờ ứng dụng OCR CCCD gắn chip và tích hợp VNeID.
- Tỷ lệ số hóa hồ sơ và cấp kết quả điện tử có chữ ký số SmartCA (NĐ 30/2020 & NĐ 61/2018): 100%.

2. HIỆU QUẢ KINH TẾ & TIẾT KIỆM NGÂN SÁCH NHÀ NƯỚC (FINANCIAL ROI)
- Tiết kiệm chi phí in ấn giấy tờ, phôi chứng nhận, sổ theo dõi vật lý: 180.000.000 VNĐ / năm.
- Tiết kiệm chi phí thời gian đi lại của nhân dân (ước tính 28.000 lượt công dân/năm x 40.000đ/lượt): 1.120.000.000 VNĐ / năm.
- Tiết kiệm thời gian đối soát kế toán - kho bạc: Giảm từ 40 giờ công/tháng xuống còn 30 phút/tháng (Tiết kiệm 98.7% nhân lực).
- Tổng giá trị thặng dư kinh tế ước tính tạo ra cho địa bàn: ~ 1.350.000.000 VNĐ / năm.

3. HIỆU QUẢ XÃ HỘI & THỰC HIỆN ĐỀ ÁN 06
- Tỷ lệ chi trả trợ cấp ưu đãi không dùng tiền mặt qua tài khoản an sinh xã hội liên kết VNeID: 98.4%.
- Xóa bỏ 100% rủi ro thất thoát, nhận chậm hoặc trùng lặp đối tượng trợ cấp.
- Chỉ số hài lòng của nhân dân (SIPAS / CSAT): 98.7% (Đánh giá mức độ Rất hài lòng).
- Số hóa 100% nghĩa trang và mộ liệt sĩ bằng bản đồ số GIS phục vụ thân nhân từ xa.

Ngày xuất báo cáo: ${new Date().toLocaleDateString("vi-VN")}
NGƯỜI LẬP BÁO CÁO: ĐOÀN MINH QUÂN - MSSV: 2224801030137`;

    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `BAO_CAO_DANH_GIA_HIEU_QUA_DE_TAI_${new Date().getFullYear()}.txt`;
    a.click();
    toast.success("Đã xuất tệp Báo cáo Đánh giá Hiệu quả Đề tài phục vụ Thầy hướng dẫn & Hội đồng!");
  };

  const max = wardDensity[0]?.hoSo ?? 1;
  const duBao = giaiNganTheoThang.map((m) => ({
    thang: m.thang,
    tong: +(m.thuongXuyen + m.motLan + m.dieuDuong + m.bhyt).toFixed(1),
  }));

  return (
    <AppShell>
      <PageHeader
        eyebrow="Phân hệ 3 · Trực quan hóa & phân tích"
        title="Phân tích số liệu điều hành"
        right={
          <div className="flex gap-2">
            <button
              onClick={() => toast.success("Đang trích xuất báo cáo quyết toán kinh phí…")}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 shadow-2xs"
            >
              Báo cáo quyết toán
            </button>
            <button
              onClick={() => toast.success("Đã xuất mẫu biểu chuẩn C70a-HD")}
              className="rounded-md bg-[#dd4b39] px-3 py-2 text-sm font-semibold text-white hover:bg-[#c23321] shadow-2xs"
            >
              Xuất mẫu biểu
            </button>
          </div>
        }
      />

      {/* Thanh chuyển đổi phân hệ: Số liệu vs Đánh giá hiệu quả đề tài */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-3 rounded-lg shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab("SO_LIEU")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-bold transition-colors cursor-pointer ${
              activeTab === "SO_LIEU"
                ? "bg-[#dd4b39] text-white shadow-xs"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <BarChart3 className="size-3.5" />
            <span>Phân tích Số liệu & Bản đồ nhiệt 14 Phường</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("HIEU_QUA")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-bold transition-colors cursor-pointer ${
              activeTab === "HIEU_QUA"
                ? "bg-[#dd4b39] text-white shadow-xs"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Award className="size-3.5" />
            <span>Đánh giá Hiệu quả Đề tài (Cắt giảm TTHC & Tiết kiệm Ngân sách)</span>
          </button>
        </div>

        {activeTab === "HIEU_QUA" && (
          <button
            type="button"
            onClick={handleExportHieuQuaReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
          >
            <Download className="size-3.5" />
            <span>Xuất Báo cáo Hiệu quả (.txt)</span>
          </button>
        )}
      </div>

      {activeTab === "SO_LIEU" && (
        <>
          <div className="grid gap-3 lg:grid-cols-3">
        <div className="bg-white border border-[#d2d6de] rounded p-4 shadow-2xs lg:col-span-2">
          <div className="font-bold text-xs uppercase text-gray-800 tracking-wider">
            Bản đồ nhiệt mật độ hồ sơ · 14 phường/xã
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-5">
            {wardDensity.map((w) => (
              <button
                key={w.phuong}
                onClick={() => toast.success(`Đã lọc số liệu theo phường ${w.phuong}`)}
                className="rounded-lg border border-white/40 p-3 text-left transition-all hover:scale-[1.02] shadow-xs text-white"
                style={heatTone(w.hoSo / max)}
              >
                <div className="text-[12px] font-bold drop-shadow-xs">{w.phuong}</div>
                <div className="mt-1 text-lg font-extrabold tabular-nums drop-shadow-xs">
                  {formatNum(w.hoSo)}
                </div>
                <div className="font-mono text-[11px] opacity-90 drop-shadow-xs">{w.chiTra} tỷ/tháng</div>
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-600 font-medium">
            <span>Mật độ thấp</span>
            <span className="h-2.5 w-32 rounded-full bg-gradient-to-r from-[#3c8dbc] via-[#00c0ef] to-[#00a65a]" />
            <span>Mật độ cao (Nhấn để lọc chi tiết)</span>
          </div>
        </div>

        <div className="bg-white border border-[#d2d6de] rounded p-4 shadow-2xs">
          <div className="font-bold text-xs uppercase text-gray-800 tracking-wider border-b border-gray-100 pb-2">
            Cơ cấu loại đối tượng
          </div>
          <div className="mt-2 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={coCauDoiTuong} dataKey="value" nameKey="ten" innerRadius="55%" outerRadius="88%" stroke="#ffffff" strokeWidth={2}>
                  {coCauDoiTuong.map((d) => (
                    <Cell key={d.ten} fill={d.mau} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: 6,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                    fontSize: 12,
                    color: "#1f2937",
                  }}
                  formatter={(val: any) => [`${val}%`, "Tỷ lệ"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="space-y-1.5 text-[12px]">
            {coCauDoiTuong.map((d) => (
              <li key={d.ten} className="flex items-center gap-2">
                <span className="size-3 rounded-xs shrink-0 shadow-2xs" style={{ backgroundColor: d.mau }} />
                <span className="text-gray-800 font-medium">{d.ten}</span>
                <span className="ml-auto font-mono font-bold text-gray-700">{d.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <div className="bg-white border border-[#d2d6de] rounded p-4 shadow-2xs lg:col-span-2">
          <div className="font-bold text-xs uppercase text-gray-800 tracking-wider border-b border-gray-100 pb-2">
            Dự báo kinh phí giải ngân · tỷ VNĐ
          </div>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={duBao} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="thang" tick={{ fill: "#4b5563", fontSize: 11 }} stroke="#cbd5e1" />
                <YAxis tick={{ fill: "#4b5563", fontSize: 11 }} stroke="#cbd5e1" unit=" tỷ" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: 6,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                    fontSize: 12,
                    color: "#1f2937",
                  }}
                  formatter={(val: any) => [`${val} tỷ VNĐ`, "Tổng giải ngân"]}
                  labelStyle={{ fontWeight: "bold", color: "#f39c12", marginBottom: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="tong"
                  name="Tổng giải ngân"
                  stroke="#f39c12"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#f39c12", stroke: "#ffffff", strokeWidth: 2 }}
                  activeDot={{ r: 7, fill: "#d68100" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-[#d2d6de] rounded p-4 shadow-2xs">
          <div className="font-bold text-xs uppercase text-gray-800 tracking-wider border-b border-gray-100 pb-2">
            Chỉ số hài lòng CSAT theo tháng · %
          </div>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={csatTheoThang} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="thang" tick={{ fill: "#4b5563", fontSize: 11 }} stroke="#cbd5e1" />
                <YAxis domain={[85, 100]} tick={{ fill: "#4b5563", fontSize: 11 }} stroke="#cbd5e1" unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: 6,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                    fontSize: 12,
                    color: "#1f2937",
                  }}
                  formatter={(val: any) => [`${val}%`, "Mức độ hài lòng CSAT"]}
                  labelStyle={{ fontWeight: "bold", color: "#00a65a", marginBottom: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="csat"
                  name="CSAT"
                  stroke="#00a65a"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#00a65a", stroke: "#ffffff", strokeWidth: 2 }}
                  activeDot={{ r: 7, fill: "#008d4c" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <div className="glass-card p-4">
          <div className="label-mono">Phễu tiến độ thủ tục hành chính</div>
          <div className="mt-3 space-y-2">
            {phezuyetFunnel.map((b, i) => (
              <div key={b.buoc} className="flex items-center gap-3">
                <span className="w-40 shrink-0 text-[13px] text-foreground">{b.buoc}</span>
                <div className="h-6 flex-1 overflow-hidden rounded-md bg-foreground/5">
                  <div
                    className="h-full rounded-md bg-azure"
                    style={{
                      width: `${(b.soLuong / (phezuyetFunnel[0]?.soLuong ?? 1)) * 100}%`,
                      opacity: 1 - i * 0.15,
                    }}
                  />
                </div>
                <span className="w-12 text-right font-mono text-[11px] tabular-nums text-muted-foreground">
                  {formatNum(b.soLuong)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="label-mono">Phân tích đối soát tự động</div>
          <div className="mt-3 space-y-2">
            {doiSoatCanhBao.map((c) => (
              <div key={c.ma} className="rounded-md border bg-foreground/5 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-medium text-foreground">{c.loai}</span>
                  <span
                    className={`rounded-full border px-2 py-0.5 font-mono text-[10px] ${
                      c.mucDo === "CAO"
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-gold/40 bg-gold/10 text-gold"
                    }`}
                  >
                    {c.mucDo}
                  </span>
                </div>
                <p className="mt-1 text-[12px] text-muted-foreground">{c.noiDung}</p>
              </div>
            ))}
          </div>
        </div>
        </div>
        </>
      )}

      {/* TAB 2: ĐÁNH GIÁ HIỆU QUẢ ĐỀ TÀI & CẢI CÁCH TTHC (CHO THẦY HƯỚNG DẪN & HỘI ĐỒNG) */}
      {activeTab === "HIEU_QUA" && (
        <div className="space-y-6">
          {/* Banner chính đề tài */}
          <div className="rounded-xl border border-emerald-300 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-5 text-white shadow-md">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Award className="size-5 text-amber-300" />
                  <span className="font-black text-sm uppercase tracking-wide text-amber-200">
                    KHUNG ĐÁNH GIÁ ĐỊNH LƯỢNG HIỆU QUẢ CHUYỂN ĐỔI SỐ & CẢI CÁCH TTHC
                  </span>
                </div>
                <p className="text-xs text-emerald-100 max-w-3xl leading-relaxed">
                  Căn cứ Nghị quyết 76/NQ-CP của Chính phủ về Chương trình tổng thể cải cách hành chính nhà nước giai đoạn 2021-2030, Quyết định 06/QĐ-TTg (Đề án 06) và Chỉ thị 21/CT-TTg về chi trả an sinh xã hội không dùng tiền mặt.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                <span className="px-3 py-1 bg-emerald-500/30 border border-emerald-400 text-emerald-100 text-xs font-bold rounded-full">
                  SROI ĐẠT 1 : 3.8
                </span>
              </div>
            </div>
          </div>

          {/* 4 Thẻ KPI Cốt Lõi Đo Lường Hiệu Quả */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-blue-200 bg-white p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span className="font-bold text-blue-900 flex items-center gap-1">
                  <Clock className="size-3.5 text-blue-600" />
                  Thời Gian Thụ Lý
                </span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">
                  -81.3%
                </span>
              </div>
              <div className="text-2xl font-black text-blue-900">2.8 ngày</div>
              <div className="text-[11px] text-gray-500 mt-1">
                Quy trình cũ: <span className="line-through">15 ngày làm việc</span>. Cắt giảm 12.2 ngày thủ tục.
              </div>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-white p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span className="font-bold text-emerald-900 flex items-center gap-1">
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                  Giải Quyết Đúng Hạn
                </span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">
                  +16.8%
                </span>
              </div>
              <div className="text-2xl font-black text-emerald-800">99.4%</div>
              <div className="text-[11px] text-gray-500 mt-1">
                Quy trình cũ: <span className="line-through">82.6%</span>. Triệt tiêu tồn đọng hồ sơ trễ hạn.
              </div>
            </div>

            <div className="rounded-xl border border-amber-200 bg-white p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span className="font-bold text-amber-900 flex items-center gap-1">
                  <DollarSign className="size-3.5 text-amber-600" />
                  Tiết Kiệm Ngân Sách
                </span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">
                  ROI Cao
                </span>
              </div>
              <div className="text-2xl font-black text-amber-900">~1.35 tỷ đ/năm</div>
              <div className="text-[11px] text-gray-500 mt-1">
                Văn phòng phẩm, in phôi sổ, và chi phí đi lại của 28.000 lượt công dân.
              </div>
            </div>

            <div className="rounded-xl border border-purple-200 bg-white p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span className="font-bold text-purple-900 flex items-center gap-1">
                  <Zap className="size-3.5 text-purple-600" />
                  Chi Trả Đề Án 06
                </span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">
                  VNeID Payout
                </span>
              </div>
              <div className="text-2xl font-black text-purple-900">98.4%</div>
              <div className="text-[11px] text-gray-500 mt-1">
                Không dùng tiền mặt qua Vietcombank liên kết VNeID và xác thực C06.
              </div>
            </div>
          </div>

          {/* BẢNG SO SÁNH ĐỐI CHỨNG TRƯỚC VÀ SAU KHI TRIỂN KHAI PHẦN MỀM */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="bg-[#3c8dbc] px-4 py-3 text-white flex items-center justify-between">
              <div className="font-bold text-xs uppercase flex items-center gap-2">
                <FileSpreadsheet className="size-4" />
                <span>Bảng So Sánh Chỉ Tiêu Cải Cách Thủ Tục Hành Chính Trước &amp; Sau Triển Khai</span>
              </div>
              <span className="text-[11px] bg-white/20 px-2.5 py-0.5 rounded font-mono">
                Số liệu thực tế tại TP. Thủ Dầu Một
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-gray-100 text-gray-700 uppercase font-semibold border-b border-gray-200">
                  <tr>
                    <th className="p-3 w-12 text-center">STT</th>
                    <th className="p-3">Chỉ Số Đánh Giá (KPI Cải cách TTHC)</th>
                    <th className="p-3 text-center">Phương Pháp Thủ Công Cũ</th>
                    <th className="p-3 text-center bg-emerald-50/50">Hệ Thống Số Hóa Mới</th>
                    <th className="p-3 text-center">Mức Độ Cải Thiện</th>
                    <th className="p-3">Cơ Sở Pháp Lý / Quy Chuẩn</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="p-3 text-center font-mono font-bold text-gray-500">1</td>
                    <td className="p-3 font-semibold text-gray-900">
                      Thời gian tiếp nhận tại Bộ phận Một cửa
                      <div className="text-[11px] text-gray-500 font-normal">Khai báo hồ sơ, kiểm tra thành phần giấy tờ</div>
                    </td>
                    <td className="p-3 text-center text-red-700 font-mono">25 - 30 phút / lượt</td>
                    <td className="p-3 text-center text-emerald-800 font-mono font-bold bg-emerald-50/50">3.5 phút / lượt</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[11px]">
                        Nhanh gấp 7.5 lần
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">Nghị định 61/2018/NĐ-CP &amp; NĐ 107/2021/NĐ-CP</td>
                  </tr>

                  <tr className="hover:bg-gray-50">
                    <td className="p-3 text-center font-mono font-bold text-gray-500">2</td>
                    <td className="p-3 font-semibold text-gray-900">
                      Thời gian thẩm định và xét duyệt cấp Sở
                      <div className="text-[11px] text-gray-500 font-normal">Quy trình luân chuyển hồ sơ 3 cấp xã - huyện - tỉnh</div>
                    </td>
                    <td className="p-3 text-center text-red-700 font-mono">15 ngày làm việc</td>
                    <td className="p-3 text-center text-emerald-800 font-mono font-bold bg-emerald-50/50">2.8 ngày làm việc</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[11px]">
                        Giảm 81.3% thời gian
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">Nghị định 131/2021/NĐ-CP &amp; Pháp lệnh Ưu đãi</td>
                  </tr>

                  <tr className="hover:bg-gray-50">
                    <td className="p-3 text-center font-mono font-bold text-gray-500">3</td>
                    <td className="p-3 font-semibold text-gray-900">
                      Tỷ lệ hồ sơ số hóa &amp; kết quả điện tử
                      <div className="text-[11px] text-gray-500 font-normal">Chữ ký số SmartCA của Lãnh đạo Sở &amp; con dấu đỏ điện tử</div>
                    </td>
                    <td className="p-3 text-center text-red-700 font-mono">&lt; 35% (văn bản giấy)</td>
                    <td className="p-3 text-center text-emerald-800 font-mono font-bold bg-emerald-50/50">100% điện tử</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[11px]">
                        Đạt chuẩn 100%
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">Nghị định 30/2020/NĐ-CP về công tác văn thư</td>
                  </tr>

                  <tr className="hover:bg-gray-50">
                    <td className="p-3 text-center font-mono font-bold text-gray-500">4</td>
                    <td className="p-3 font-semibold text-gray-900">
                      Chi trả trợ cấp không dùng tiền mặt (Đề án 06)
                      <div className="text-[11px] text-gray-500 font-normal">Chuyển khoản trực tiếp qua số tài khoản gắn mã định danh CCCD</div>
                    </td>
                    <td className="p-3 text-center text-red-700 font-mono">42.5% (Phát tiền mặt)</td>
                    <td className="p-3 text-center text-emerald-800 font-mono font-bold bg-emerald-50/50">98.4% không dùng tiền mặt</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[11px]">
                        Tăng +55.9%
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">Chỉ thị 21/CT-TTg &amp; Đề án 06/CP của Thủ tướng</td>
                  </tr>

                  <tr className="hover:bg-gray-50">
                    <td className="p-3 text-center font-mono font-bold text-gray-500">5</td>
                    <td className="p-3 font-semibold text-gray-900">
                      Đo lường mức độ hài lòng của công dân (SIPAS)
                      <div className="text-[11px] text-gray-500 font-normal">Đánh giá trực tiếp qua mã QR / cổng khảo sát điện tử</div>
                    </td>
                    <td className="p-3 text-center text-gray-600 font-mono">81.2% (Phiếu giấy)</td>
                    <td className="p-3 text-center text-emerald-800 font-mono font-bold bg-emerald-50/50">98.7% CSAT Rất hài lòng</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[11px]">
                        Xuất sắc (+17.5%)
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">Bộ chỉ số PAR INDEX &amp; SIPAS Bộ Nội vụ</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* BẢNG PHÂN TÍCH HIỆU QUẢ KINH TẾ (COST - BENEFIT ANALYSIS) */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <DollarSign className="size-4 text-emerald-600" />
              <span>Phân Tích Hiệu Quả Kinh Tế &amp; Tiết Kiệm Chi Phí Ngân Sách (Hằng Năm)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 space-y-2">
                <div className="text-xs font-bold text-gray-700 uppercase">1. Tiết kiệm Văn phòng phẩm &amp; Lưu trữ</div>
                <div className="text-xl font-black text-emerald-700">180.000.000 VNĐ</div>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  Cắt giảm ~120.000 trang giấy in A4, chi phí mực in, phôi giấy chứng nhận, bìa hồ sơ lưu trữ và bảo quản kho lưu trữ cấp huyện.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 space-y-2">
                <div className="text-xs font-bold text-gray-700 uppercase">2. Tiết kiệm Chi phí Xã hội của Nhân dân</div>
                <div className="text-xl font-black text-emerald-700">1.120.000.000 VNĐ</div>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  Ước tính 28.000 lượt công dân không phải đi lại bổ sung hồ sơ hoặc chờ đợi tại bộ phận Một cửa (bình quân tiết kiệm 40.000đ/lượt đi lại và 2 giờ làm việc).
                </p>
              </div>

              <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 space-y-2">
                <div className="text-xs font-bold text-gray-700 uppercase">3. Tiết kiệm Thời gian Kế toán - Kho bạc</div>
                <div className="text-xl font-black text-emerald-700">480 giờ công (~50 triệu đ)</div>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  Tự động hóa đối soát danh sách chi trả Vietcombank và sinh Mẫu C2-02/NS chỉ mất 15 phút thay vì 5 ngày rà soát thủ công mỗi kỳ chi trả.
                </p>
              </div>
            </div>
          </div>

          {/* GỢI Ý TRẢ LỜI PHẢN BIỆN TRƯỚC HỘI ĐỒNG */}
          <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-950 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-blue-700 shrink-0" />
              <h4 className="font-bold text-sm text-blue-900">
                Gợi Ý Trọng Tâm Trình Bày Hiệu Quả Trước Hội Đồng Đánh Giá &amp; Thầy Hướng Dẫn:
              </h4>
            </div>

            <ul className="list-disc pl-5 space-y-1.5 leading-relaxed text-blue-900">
              <li>
                <strong>Tính cấp thiết &amp; Thời sự:</strong> Đề tài bám sát trực tiếp 02 chủ trương chiến lược của Đảng và Chính phủ là <em>Chương trình Tổng thể Cải cách TTHC (Nghị quyết 76)</em> và <em>Đề án 06/CP về phát triển ứng dụng dữ liệu dân cư, định danh và xác thực điện tử</em>.
              </li>
              <li>
                <strong>Tính chuẩn mực pháp lý:</strong> Toàn bộ 100% biểu mẫu đều tuân thủ thể thức văn bản hành chính Nhà nước: Mẫu 01/NĐ61 (Giấy hẹn Một cửa), Mẫu C2-02/NS (Ủy nhiệm chi Kho bạc theo TT 77/2017), Nghị định 30/2020 (Quyết định ký số SmartCA), Nghị định 77/2024 (Mức chuẩn trợ cấp 2.789.000đ), Quyết định 505/QĐ-BHXH (Mẫu D03-TS BHYT).
              </li>
              <li>
                <strong>Tính an toàn &amp; Tách biệt quyền hạn (SoD):</strong> Phân quyền chặt chẽ theo nguyên tắc nghiệp vụ thực tế — Lãnh đạo Sở chỉ xem xét và ký số duyệt văn bản pháp lý, Quản trị viên IT có phân hệ riêng để bảo trì và sửa lỗi CSDL 3NF, loại bỏ hoàn toàn xung đột quyền lợi và rủi ro an toàn thông tin mạng.
              </li>
            </ul>
          </div>
        </div>
      )}
    </AppShell>
  );
}
