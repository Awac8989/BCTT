import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
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
  hoSoList,
  wardDensity,
} from "@/data/mock";

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
  { label: "Đối tượng NCC quản lý", value: "12.480", sub: "▲ +184 so cùng kỳ", tone: "text-primary" },
  {
    label: "Kinh phí chi trả tháng",
    value: "24,6",
    unit: " Tỷ",
    sub: "VNĐ · ngân hàng + tiền mặt",
    tone: "text-gold",
  },
  {
    label: "Duyệt đúng hạn",
    value: "98,4",
    unit: "%",
    sub: "1.204 / 1.224 hồ sơ",
    tone: "text-muted-foreground",
  },
  {
    label: "Chỉ số hài lòng",
    value: "4,85",
    unit: "/5★",
    sub: "3.862 lượt khảo sát",
    tone: "text-muted-foreground",
  },
];

const barHeights = giaiNganTheoThang.map(
  (m) => m.thuongXuyen + m.motLan + m.dieuDuong + m.bhyt,
);
const maxBar = Math.max(...barHeights);

function Dashboard() {
  const quaHan = hoSoList.filter((h) => h.quaHanNgay > 0);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Phòng Văn hóa – Xã hội · Phường Thủ Dầu Một"
        title="Bảng điều khiển điều hành"
        right={
          <div className="text-right">
            <div className="label-mono">Cập nhật thời gian thực</div>
            <div className="font-mono text-sm text-foreground">18:42 · 04/09/2026</div>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {KPI.map((k) => (
          <div key={k.label} className="glass-card p-4">
            <div className="label-mono">{k.label}</div>
            <div className="ledger-title mt-2 text-3xl tabular-nums text-foreground sm:text-4xl">
              {k.value}
              {k.unit && <span className="text-xl text-muted-foreground">{k.unit}</span>}
            </div>
            <div className={`mt-1 font-mono text-[11px] ${k.tone}`}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="glass-card p-4 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="label-mono">Xu hướng giải ngân theo tháng</div>
              <div className="ledger-title mt-0.5 text-lg text-foreground">Tỷ VNĐ</div>
            </div>
            <div className="flex gap-1">
              <span className="rounded bg-primary/20 px-2 py-1 font-mono text-[10px] text-primary">
                2026
              </span>
              <span className="rounded bg-foreground/5 px-2 py-1 font-mono text-[10px] text-muted-foreground">
                Tất cả loại
              </span>
            </div>
          </div>
          <div className="mt-4 flex h-40 items-end gap-2 border-b pb-px">
            {giaiNganTheoThang.map((m, i) => {
              const total = barHeights[i] ?? 0;
              const pct = (total / maxBar) * 100;
              return (
                <div
                  key={m.thang}
                  className={`grow-bar flex-1 rounded-t ${
                    i === 6 ? "bg-gold/80" : "bg-primary/80"
                  }`}
                  style={{ height: `${pct}%`, animationDelay: `${i * 40}ms` }}
                  title={`${m.thang}: ${total.toFixed(1)} tỷ`}
                />
              );
            })}
          </div>
          <div className="mt-2 flex gap-2">
            {giaiNganTheoThang.map((m, i) => (
              <span
                key={m.thang}
                className={`flex-1 text-center font-mono text-[10px] ${
                  i === 6 ? "text-gold" : "text-muted-foreground"
                }`}
              >
                {m.thang}
              </span>
            ))}
          </div>
        </div>

        <div className="glass-card border-primary/30 p-4 ring-1 ring-primary/20">
          <div className="flex items-center justify-between">
            <div className="label-mono">Hồ sơ quá hạn xử lý</div>
            <span className="rounded-full bg-primary px-2 py-0.5 font-mono text-[10px] text-primary-foreground">
              CẢNH BÁO
            </span>
          </div>
          <div className="mt-3 space-y-2">
            {quaHan.map((h) => (
              <Link
                key={h.id}
                to="/ho-so/$id"
                params={{ id: h.id }}
                className="flex items-center justify-between rounded-md bg-primary/10 px-3 py-2 transition-colors hover:bg-primary/15"
              >
                <div>
                  <div className="font-mono text-sm text-foreground">{h.id}</div>
                  <div className="text-[11px] text-muted-foreground">{h.trangThai}</div>
                </div>
                <span className="font-mono text-[11px] text-primary">+{h.quaHanNgay} ngày</span>
              </Link>
            ))}
          </div>
          <Link
            to="/ho-so"
            className="mt-3 block rounded-md border py-1.5 text-center font-mono text-[11px] text-muted-foreground transition-colors hover:bg-foreground/5"
          >
            Xem tất cả ({hoSoList.length} hồ sơ)
          </Link>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="glass-card p-4">
          <div className="label-mono">Cơ cấu loại đối tượng NCC</div>
          <div className="mt-2 flex items-center gap-4">
            <div className="relative size-32 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={coCauDoiTuong}
                    dataKey="value"
                    nameKey="ten"
                    innerRadius="66%"
                    outerRadius="100%"
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
                  <div className="ledger-title text-lg tabular-nums text-foreground">12.480</div>
                  <div className="label-mono">Hồ sơ</div>
                </div>
              </div>
            </div>
            <ul className="space-y-1.5 text-[12px]">
              {coCauDoiTuong.map((d) => (
                <li key={d.ten} className="flex items-center gap-2">
                  <span
                    className="size-2.5 rounded-sm"
                    style={{ backgroundColor: d.mau }}
                    aria-hidden
                  />
                  <span className="text-foreground">{d.ten}</span>
                  <span className="ml-auto font-mono text-muted-foreground">{d.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="glass-card p-4 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="label-mono">Mật độ hồ sơ theo 14 phường</div>
            <span className="label-mono">Sắp xếp theo khối lượng</span>
          </div>
          <div className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {wardDensity.map((w, i) => (
              <div key={w.phuong} className="flex items-center gap-2">
                <span className="w-24 shrink-0 truncate text-[12px] text-foreground">
                  {w.phuong}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-foreground/5">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${(w.hoSo / (wardDensity[0]?.hoSo ?? 1)) * 100}%`,
                      opacity: 1 - i * 0.05,
                    }}
                  />
                </div>
                <span className="w-12 text-right font-mono text-[11px] tabular-nums text-muted-foreground">
                  {formatNum(w.hoSo)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="glass-card p-4 lg:col-span-2">
          <div className="label-mono">Kinh phí theo phường · tỷ VNĐ</div>
          <div className="mt-3 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wardDensity}>
                <XAxis
                  dataKey="phuong"
                  tick={{ fill: "var(--color-lab)", fontSize: 9 }}
                  interval={0}
                  angle={-35}
                  textAnchor="end"
                  height={54}
                  stroke="var(--color-border)"
                />
                <YAxis tick={{ fill: "var(--color-lab)", fontSize: 10 }} stroke="var(--color-border)" />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-ink-2)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="chiTra" name="Chi trả (tỷ)" fill="var(--color-gold)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="label-mono">Hồ sơ mới cần xử lý</div>
          <div className="mt-3 space-y-2">
            {hoSoList.slice(0, 4).map((h) => (
              <Link
                key={h.id}
                to="/ho-so/$id"
                params={{ id: h.id }}
                className="block rounded-md bg-foreground/5 px-3 py-2 transition-colors hover:bg-foreground/8"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[12px] text-foreground">{h.id}</span>
                  <StatusBadge trangThai={h.trangThai} />
                </div>
                <div className="mt-0.5 text-[11px] text-muted-foreground">
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
