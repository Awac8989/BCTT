import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell, PageHeader, StatusBadge } from "@/components/AppShell";
import {
  coCauDoiTuong,
  formatNum,
  giaiNganTheoThang,
  wardDensity,
} from "@/data/mock";
import { useAppState } from "@/services/app-state";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bảng điều khiển điều hành · Hồ sơ Người có công" },
      {
        name: "description",
        content:
          "Dashboard điều hành quản lý hồ sơ Người có công phường Thủ Dầu Một: chỉ số KPI, giải ngân theo tháng, cơ cấu đối tượng và cảnh báo hồ sơ quá hạn.",
      },
      { property: "og:title", content: "Bảng điều khiển điều hành · Hồ sơ Người có công" },
      {
        property: "og:description",
        content:
          "Theo dõi tức thời số đối tượng NCC, kinh phí chi trả, tỷ lệ đúng hạn và chỉ số hài lòng của công dân.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const KPI = [
  {
    label: "Đối tượng NCC quản lý",
    value: "12.480",
    sub: "▲ +184 so cùng kỳ",
    borderColor: "border-t-[#00c0ef]",
    textColor: "text-[#0073b7]",
    subColor: "text-emerald-600",
  },
  {
    label: "Kinh phí chi trả tháng",
    value: "24,6",
    unit: " Tỷ",
    sub: "VNĐ · ngân hàng + tiền mặt",
    borderColor: "border-t-[#00a65a]",
    textColor: "text-[#008d4c]",
    subColor: "text-gray-500",
  },
  {
    label: "Duyệt đúng hạn",
    value: "98,4",
    unit: "%",
    sub: "1.204 / 1.224 hồ sơ",
    borderColor: "border-t-[#f39c12]",
    textColor: "text-[#d68000]",
    subColor: "text-gray-500",
  },
  {
    label: "Chỉ số hài lòng (CSAT)",
    value: "4,85",
    unit: "/5★",
    sub: "3.862 lượt khảo sát",
    borderColor: "border-t-[#dd4b39]",
    textColor: "text-[#c23321]",
    subColor: "text-emerald-600",
  },
];

const barHeights = giaiNganTheoThang.map(
  (m) => m.thuongXuyen + m.motLan + m.dieuDuong + m.bhyt,
);
const maxBar = Math.max(...barHeights);

function Dashboard() {
  const { hoSoList } = useAppState();
  const quaHan = hoSoList.filter((h) => h.quaHanNgay > 0);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Phòng Lao động – Thương binh và Xã hội TP. Thủ Dầu Một"
        title="Bảng điều khiển chỉ số điều hành"
        right={
          <div className="text-right">
            <div className="label-mono">Dữ liệu CSDL Quốc gia</div>
            <div className="font-mono text-xs font-semibold text-gray-700">Tháng 09/2026 · Trực quan hóa</div>
          </div>
        }
      />

      {/* 4 Thẻ KPI với viền màu trực quan theo chuẩn AdminLTE SLĐTBXH */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {KPI.map((k) => (
          <div
            key={k.label}
            className={`bg-white border-t-4 ${k.borderColor} border-x border-b border-[#d2d6de] p-3.5 rounded shadow-2xs hover:shadow-xs transition-shadow`}
          >
            <div className="text-xs font-bold text-gray-500 uppercase tracking-tight">{k.label}</div>
            <div className={`mt-1.5 text-3xl tabular-nums font-extrabold ${k.textColor} sm:text-4xl`}>
              {k.value}
              {k.unit && <span className="text-lg font-bold text-gray-500">{k.unit}</span>}
            </div>
            <div className={`mt-1 font-sans text-xs font-medium ${k.subColor}`}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="bg-white border border-[#d2d6de] rounded p-4 shadow-2xs lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2">
            <div>
              <div className="font-bold text-xs uppercase text-gray-800 tracking-wider">Xu hướng giải ngân theo tháng</div>
              <div className="text-xs font-semibold text-[#008d4c] mt-0.5">Đơn vị: Tỷ VNĐ</div>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span className="rounded bg-blue-100 px-2 py-0.5 font-bold text-blue-800">
                Năm 2026
              </span>
              <span className="rounded bg-gray-100 px-2 py-0.5 text-gray-600">
                Tất cả đối tượng
              </span>
            </div>
          </div>
          <div className="mt-4 flex h-40 items-end gap-2 border-b border-gray-200 pb-px">
            {giaiNganTheoThang.map((m, i) => {
              const total = barHeights[i] ?? 0;
              const pct = (total / maxBar) * 100;
              return (
                <div
                  key={m.thang}
                  className={`grow-bar flex-1 rounded-t transition-all hover:opacity-90 ${
                    i === 6
                      ? "bg-gradient-to-t from-[#00a65a] to-[#00c0ef] shadow-xs"
                      : "bg-gradient-to-t from-[#3c8dbc] to-[#00c0ef]/80"
                  }`}
                  style={{ height: `${pct}%`, animationDelay: `${i * 40}ms` }}
                  title={`${m.thang}: ${total.toFixed(1)} tỷ VNĐ`}
                />
              );
            })}
          </div>
          <div className="mt-2 flex gap-2">
            {giaiNganTheoThang.map((m, i) => (
              <span
                key={m.thang}
                className={`flex-1 text-center font-mono text-[11px] font-semibold ${
                  i === 6 ? "text-[#008d4c] font-bold" : "text-gray-500"
                }`}
              >
                {m.thang}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white border-t-3 border-t-[#dd4b39] border-x border-b border-[#d2d6de] p-4 rounded shadow-2xs">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <div className="font-bold text-xs uppercase text-gray-800 tracking-wider">Hồ sơ quá hạn xử lý</div>
            <span className="rounded bg-red-100 px-2 py-0.5 font-mono text-[10px] font-bold text-red-700">
              CẢNH BÁO
            </span>
          </div>
          <div className="mt-3 space-y-2">
            {quaHan.map((h) => (
              <Link
                key={h.id}
                to="/ho-so/$id"
                params={{ id: h.id }}
                className="flex items-center justify-between rounded border border-red-200 bg-red-50/60 px-3 py-2 transition-colors hover:bg-red-50"
              >
                <div>
                  <div className="font-mono text-xs font-bold text-gray-900">{h.id}</div>
                  <div className="text-[11px] text-gray-600">{h.hoTen} · {h.phuong}</div>
                </div>
                <span className="font-mono text-xs font-extrabold text-[#dd4b39]">+{h.quaHanNgay} ngày</span>
              </Link>
            ))}
          </div>
          <Link
            to="/ho-so"
            className="mt-3 block rounded border border-gray-300 py-1.5 text-center font-sans text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-100"
          >
            Xem tất cả ({hoSoList.length} hồ sơ)
          </Link>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="bg-white border border-[#d2d6de] rounded p-4 shadow-2xs">
          <div className="font-bold text-xs uppercase text-gray-800 tracking-wider border-b border-gray-100 pb-2 mb-3">
            Cơ cấu loại đối tượng NCC
          </div>
          <div className="mt-2 flex items-center gap-4">
            <div className="relative size-32 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={coCauDoiTuong}
                    dataKey="value"
                    nameKey="ten"
                    innerRadius="64%"
                    outerRadius="96%"
                    paddingAngle={3}
                    stroke="none"
                  >
                    {coCauDoiTuong.map((d) => (
                      <Cell key={d.ten} fill={d.mau} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
                <div>
                  <div className="text-base font-extrabold text-gray-900">12.480</div>
                  <div className="text-[10px] text-gray-500 uppercase font-semibold">Hồ sơ</div>
                </div>
              </div>
            </div>
            <ul className="space-y-1.5 text-xs flex-1">
              {coCauDoiTuong.map((d) => (
                <li key={d.ten} className="flex items-center gap-2">
                  <span
                    className="size-3 rounded-xs shrink-0"
                    style={{ backgroundColor: d.mau }}
                    aria-hidden
                  />
                  <span className="text-gray-800 font-medium">{d.ten}</span>
                  <span className="ml-auto font-mono font-bold text-gray-700">{d.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white border border-[#d2d6de] rounded p-4 shadow-2xs lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2 mb-3">
            <div className="font-bold text-xs uppercase text-gray-800 tracking-wider">Mật độ hồ sơ theo 14 phường</div>
            <span className="text-xs text-gray-500 font-medium">Sắp xếp theo khối lượng</span>
          </div>
          <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {wardDensity.map((w, i) => (
              <div key={w.phuong} className="flex items-center gap-2">
                <span className="w-24 shrink-0 truncate text-xs font-medium text-gray-800">
                  {w.phuong}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#3c8dbc] via-[#00c0ef] to-[#00a65a]"
                    style={{
                      width: `${(w.hoSo / (wardDensity[0]?.hoSo ?? 1)) * 100}%`,
                      opacity: 1 - i * 0.04,
                    }}
                  />
                </div>
                <span className="w-12 text-right font-mono text-[11px] font-bold tabular-nums text-gray-600">
                  {formatNum(w.hoSo)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BIỂU ĐỒ KINH PHÍ THEO PHƯỜNG MÀU SẮC TRỰC QUAN RÕ NÉT */}
      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="bg-white border border-[#d2d6de] rounded p-4 shadow-2xs lg:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-2">
            <div>
              <div className="font-bold text-xs uppercase text-gray-800 tracking-wider">
                Kinh phí chi trả theo phường
              </div>
              <div className="text-xs font-semibold text-[#0073b7] mt-0.5">
                Đơn vị: Tỷ VNĐ / tháng · 14 Phường thuộc TP. Thủ Dầu Một
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-600">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-xs bg-[#00a65a]" />
                Kinh phí cao (≥ 2.5 tỷ)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-xs bg-[#00c0ef]" />
                Trung bình (1.5 - 2.5 tỷ)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-xs bg-[#3c8dbc]" />
                Dưới 1.5 tỷ
              </span>
            </div>
          </div>

          <div className="mt-2 h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wardDensity} margin={{ top: 15, right: 10, left: -10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="phuong"
                  tick={{ fill: "#374151", fontSize: 10, fontWeight: 500 }}
                  interval={0}
                  angle={-35}
                  textAnchor="end"
                  height={55}
                  stroke="#cbd5e1"
                />
                <YAxis
                  tick={{ fill: "#6b7280", fontSize: 10 }}
                  stroke="#cbd5e1"
                  unit=" tỷ"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: 6,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                    fontSize: 12,
                    color: "#1f2937",
                  }}
                  formatter={(value: any) => [`${value} tỷ VNĐ`, "Kinh phí chi trả"]}
                  labelStyle={{ fontWeight: "bold", color: "#b91c1c", marginBottom: 3 }}
                />
                <Bar dataKey="chiTra" name="Chi trả (tỷ)" radius={[4, 4, 0, 0]}>
                  {wardDensity.map((entry, index) => {
                    // Màu sắc phân tầng trực quan: Xanh lá cho cao nhất, Xanh cyan cho trung bình, Xanh dương cho còn lại
                    const barColor =
                      entry.chiTra >= 2.5
                        ? "#00a65a"
                        : entry.chiTra >= 1.5
                          ? "#00c0ef"
                          : "#3c8dbc";
                    return <Cell key={`cell-${index}`} fill={barColor} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-[#d2d6de] rounded p-4 shadow-2xs">
          <div className="font-bold text-xs uppercase text-gray-800 tracking-wider border-b border-gray-100 pb-2 mb-3">
            Hồ sơ mới cần xử lý
          </div>
          <div className="space-y-2">
            {hoSoList.slice(0, 4).map((h) => (
              <Link
                key={h.id}
                to="/ho-so/$id"
                params={{ id: h.id }}
                className="block rounded border border-gray-200 bg-gray-50/70 p-2.5 transition-colors hover:bg-white hover:border-[#00c0ef]"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-gray-900">{h.id}</span>
                  <StatusBadge trangThai={h.trangThai} />
                </div>
                <div className="mt-1 text-xs text-gray-600 font-medium">
                  {h.hoTen} · {h.phuong}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
