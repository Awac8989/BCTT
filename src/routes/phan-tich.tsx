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
  return { backgroundColor: "var(--color-primary)", opacity: 0.18 + ratio * 0.8 };
}

function PhanTich() {
  const max = wardDensity[0].hoSo;
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
              className="rounded-md border px-3 py-2 text-sm text-muted-foreground hover:bg-foreground/5"
            >
              Báo cáo quyết toán
            </button>
            <button
              onClick={() => toast.success("Đã xuất mẫu biểu chuẩn C70a-HD")}
              className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Xuất mẫu biểu
            </button>
          </div>
        }
      />

      <div className="grid gap-3 lg:grid-cols-3">
        <div className="glass-card p-4 lg:col-span-2">
          <div className="label-mono">Bản đồ nhiệt mật độ hồ sơ · 14 phường/xã</div>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-5">
            {wardDensity.map((w) => (
              <button
                key={w.phuong}
                onClick={() => toast.success(`Đã lọc số liệu theo phường ${w.phuong}`)}
                className="rounded-lg border p-3 text-left transition-transform hover:scale-[1.02]"
                style={heatTone(w.hoSo / max)}
              >
                <div className="text-[12px] font-medium text-foreground">{w.phuong}</div>
                <div className="ledger-title mt-1 text-lg tabular-nums text-foreground">
                  {formatNum(w.hoSo)}
                </div>
                <div className="font-mono text-[10px] text-foreground/70">{w.chiTra} tỷ/tháng</div>
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 label-mono">
            Mật độ thấp
            <span className="h-2 w-24 rounded-full bg-gradient-to-r from-primary/20 to-primary" />
            Cao · nhấn để lọc
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="label-mono">Cơ cấu loại đối tượng</div>
          <div className="mt-2 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={coCauDoiTuong} dataKey="value" nameKey="ten" innerRadius="55%" outerRadius="88%" stroke="none">
                  {coCauDoiTuong.map((d) => (
                    <Cell key={d.ten} fill={d.mau} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--color-ink-2)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="space-y-1.5 text-[12px]">
            {coCauDoiTuong.map((d) => (
              <li key={d.ten} className="flex items-center gap-2">
                <span className="size-2.5 rounded-sm" style={{ backgroundColor: d.mau }} />
                <span className="text-foreground">{d.ten}</span>
                <span className="ml-auto font-mono text-muted-foreground">{d.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <div className="glass-card p-4 lg:col-span-2">
          <div className="label-mono">Dự báo kinh phí giải ngân · tỷ VNĐ</div>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={duBao}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="thang" tick={{ fill: "var(--color-lab)", fontSize: 11 }} stroke="var(--color-border)" />
                <YAxis tick={{ fill: "var(--color-lab)", fontSize: 11 }} stroke="var(--color-border)" />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-ink-2)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="tong"
                  name="Tổng giải ngân"
                  stroke="var(--color-gold)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "var(--color-gold)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="label-mono">Chỉ số hài lòng CSAT theo tháng · %</div>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={csatTheoThang}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="thang" tick={{ fill: "var(--color-lab)", fontSize: 11 }} stroke="var(--color-border)" />
                <YAxis domain={[85, 100]} tick={{ fill: "var(--color-lab)", fontSize: 11 }} stroke="var(--color-border)" />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-ink-2)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Line type="monotone" dataKey="csat" name="CSAT" stroke="var(--color-moss)" strokeWidth={2} />
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
                      width: `${(b.soLuong / phezuyetFunnel[0].soLuong) * 100}%`,
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
