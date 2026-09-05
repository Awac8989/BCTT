import { createFileRoute } from "@tanstack/react-router";
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
    </AppShell>
  );
}
