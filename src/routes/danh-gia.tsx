import { createFileRoute, Link } from "@tanstack/react-router";
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
import { AppShell, PageHeader } from "@/components/AppShell";
import { keywordCloud, phanHoiList, tieuChiRadar, xepHangPhuong } from "@/data/mock";

export const Route = createFileRoute("/danh-gia")({
  head: () => ({
    meta: [
      { title: "Phân tích sự hài lòng của công dân · Citizen Voice" },
      {
        name: "description",
        content:
          "Dashboard đo lường mức độ hài lòng theo bộ tiêu chí SIPAS: biểu đồ radar, đám mây từ khóa, xếp hạng phường và phản hồi kém cần xử lý.",
      },
      { property: "og:title", content: "Phân tích sự hài lòng của công dân" },
      {
        property: "og:description",
        content: "Ghi nhận tiếng nói người dân qua Kiosk, QR phiếu hẹn và Zalo ZNS/SMS.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DanhGia,
});

const KENH = [
  { ten: "QR phiếu hẹn", luot: 1842, tyLe: 48 },
  { ten: "Kiosk một cửa", luot: 1387, tyLe: 36 },
  { ten: "Zalo ZNS / SMS", luot: 633, tyLe: 16 },
];

function DanhGia() {
  const kem = phanHoiList.filter((p) => p.diemCsat <= 2);
  const csat = Math.round(
    (phanHoiList.filter((p) => p.diemCsat >= 4).length / phanHoiList.length) * 100,
  );

  return (
    <AppShell>
      <PageHeader
        eyebrow="Phân hệ 4 · Thu thập & đánh giá chất lượng phục vụ"
        title="Tiếng nói công dân"
        right={
          <Link
            to="/khao-sat"
            className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Mở giao diện khảo sát
          </Link>
        }
      />

      <div className="glass-card mb-3 grid gap-2 p-3 sm:grid-cols-4">
        <input
          type="date"
          defaultValue="2026-08-01"
          className="rounded-md border bg-ink-3/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <input
          type="date"
          defaultValue="2026-09-04"
          className="rounded-md border bg-ink-3/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <select className="rounded-md border bg-ink-3/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring">
          <option>Tất cả cán bộ tiếp nhận</option>
          <option>Nguyễn Văn An</option>
          <option>Phạm Thị Lệ</option>
          <option>Trần Quốc Bảo</option>
          <option>Lý Thu Vân</option>
        </select>
        <select className="rounded-md border bg-ink-3/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring">
          <option>Tất cả phường/xã</option>
          {xepHangPhuong.map((p) => (
            <option key={p.phuong}>{p.phuong}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="glass-card p-4">
          <div className="label-mono">CSAT kỳ hiện tại</div>
          <div className="ledger-title mt-2 text-4xl tabular-nums text-foreground">
            {csat}
            <span className="text-xl text-muted-foreground">%</span>
          </div>
          <div className="mt-1 font-mono text-[11px] text-moss">▲ +1,3 điểm so tháng trước</div>
        </div>
        <div className="glass-card p-4">
          <div className="label-mono">Tổng lượt khảo sát</div>
          <div className="ledger-title mt-2 text-4xl tabular-nums text-foreground">3.862</div>
          <div className="mt-1 font-mono text-[11px] text-gold">3 kênh thu thập</div>
        </div>
        <div className="glass-card p-4">
          <div className="label-mono">Phản hồi cần xử lý</div>
          <div className="ledger-title mt-2 text-4xl tabular-nums text-primary">{kem.length}</div>
          <div className="mt-1 font-mono text-[11px] text-muted-foreground">Rating ≤ 2 sao</div>
        </div>
        <div className="glass-card p-4">
          <div className="label-mono">Tỷ lệ sentiment tiêu cực</div>
          <div className="ledger-title mt-2 text-4xl tabular-nums text-foreground">
            2,8<span className="text-xl text-muted-foreground">%</span>
          </div>
          <div className="mt-1 font-mono text-[11px] text-muted-foreground">Đã gắn cờ CẢNH_BÁO</div>
        </div>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <div className="glass-card p-4">
          <div className="label-mono">Radar 5 tiêu chí SIPAS</div>
          <div className="mt-2 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={tieuChiRadar} outerRadius="72%">
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis dataKey="tieuChi" tick={{ fill: "var(--color-lab)", fontSize: 10 }} />
                <PolarRadiusAxis domain={[3, 5]} tick={{ fill: "var(--color-lab)", fontSize: 9 }} />
                <Radar
                  dataKey="diem"
                  name="Điểm bình quân"
                  stroke="var(--color-gold)"
                  fill="var(--color-gold)"
                  fillOpacity={0.35}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-ink-2)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="label-mono">Đám mây từ khóa từ bình luận</div>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
            {keywordCloud.map((k) => (
              <span
                key={k.tu}
                className={
                  k.cuc === "POSITIVE"
                    ? "text-azure"
                    : k.cuc === "NEGATIVE"
                      ? "text-primary"
                      : "text-muted-foreground"
                }
                style={{ fontSize: `${12 + (k.trong / 184) * 20}px`, fontWeight: 600 }}
                title={`${k.trong} lượt nhắc · ${k.cuc}`}
              >
                {k.tu}
              </span>
            ))}
          </div>
          <div className="mt-4 label-mono normal-case">
            Xanh: tích cực · Đỏ: tiêu cực (tự động gắn cờ cho Lãnh đạo phòng)
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="label-mono">Xếp hạng hài lòng theo phường</div>
          <div className="mt-3 space-y-2">
            {xepHangPhuong.map((p, i) => (
              <div key={p.phuong} className="flex items-center gap-2">
                <span className="w-5 font-mono text-[11px] text-gold">#{i + 1}</span>
                <span className="w-28 shrink-0 truncate text-[12px] text-foreground">{p.phuong}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-foreground/5">
                  <div
                    className={`h-full rounded-full ${p.csat >= 95 ? "bg-moss" : p.csat >= 90 ? "bg-gold" : "bg-primary"}`}
                    style={{ width: `${p.csat}%` }}
                  />
                </div>
                <span className="w-12 text-right font-mono text-[11px] tabular-nums text-muted-foreground">
                  {p.csat}%
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 label-mono">Đa kênh thu thập</div>
          <div className="mt-2 space-y-1.5">
            {KENH.map((k) => (
              <div key={k.ten} className="flex items-center justify-between text-[12px]">
                <span className="text-foreground">{k.ten}</span>
                <span className="font-mono text-muted-foreground">
                  {k.luot} · {k.tyLe}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card mt-3 overflow-x-auto border-primary/30 ring-1 ring-primary/20">
        <div className="flex items-center justify-between p-4">
          <div className="label-mono">Phản hồi kém cần xử lý · rating ≤ 2 sao</div>
          <span className="rounded-full bg-primary px-2 py-0.5 font-mono text-[10px] text-primary-foreground">
            CẢNH_BÁO
          </span>
        </div>
        <table className="w-full min-w-[860px] text-sm">
          <thead>
            <tr className="border-y text-left">
              {["Mã hồ sơ", "Người phản ánh", "Phường", "Cán bộ", "Kênh", "Điểm", "Nội dung", ""].map(
                (h) => (
                  <th key={h} className="label-mono px-4 py-3">
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {kem.map((p) => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-foreground/5">
                <td className="px-4 py-3 font-mono text-[12px] text-gold">{p.hoSoId}</td>
                <td className="px-4 py-3 text-foreground">{p.nguoiDanhGia}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.phuong}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.canBo}</td>
                <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">{p.kenh}</td>
                <td className="px-4 py-3 font-mono text-primary">{p.diemCsat}★</td>
                <td className="max-w-[280px] px-4 py-3 text-[12px] text-muted-foreground">{p.yKien}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toast.success(`Đã tạo phiếu xử lý khiếu nại cho ${p.hoSoId}`)}
                    className="whitespace-nowrap rounded-md border border-primary/40 bg-primary/10 px-2 py-1 font-mono text-[10px] text-primary hover:bg-primary/20"
                  >
                    Tạo phiếu xử lý
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
