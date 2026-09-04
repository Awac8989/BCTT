import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell, PageHeader } from "@/components/AppShell";
import { doiSoatCanhBao, dsChiTra, formatNum, formatVND, giaiNganTheoThang } from "@/data/mock";

export const Route = createFileRoute("/chi-tra")({
  head: () => ({
    meta: [
      { title: "Chi trả trợ cấp & quyết toán kinh phí · Người có công" },
      {
        name: "description",
        content:
          "Lập danh sách chi trả hàng tháng qua ngân hàng và bưu điện, phân rã dòng tiền theo loại chế độ và đối soát bất thường.",
      },
      { property: "og:title", content: "Chi trả trợ cấp Người có công" },
      {
        property: "og:description",
        content: "Bảng kê thanh toán theo phường, biểu đồ cột chồng ngân sách và cảnh báo đối soát.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChiTra,
});

function ChiTra() {
  const tong = dsChiTra.reduce((s, r) => s + r.soTien, 0);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Phân hệ 2 · Quyết định & lịch sử chi trả"
        title="Chi trả trợ cấp ưu đãi"
        right={
          <button
            onClick={() => toast.success("Đã xuất bảng kê mẫu C70a-HD (.xlsx)")}
            className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Xuất bảng kê C70a-HD
          </button>
        }
      />

      <div className="glass-card mb-3 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="label-mono">Xu hướng ngân sách theo tháng · tỷ VNĐ</div>
            <div className="ledger-title mt-0.5 text-lg text-foreground">Phân rã dòng tiền</div>
          </div>
          <div className="label-mono">Năm ngân sách 2026</div>
        </div>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={giaiNganTheoThang}>
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
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="thuongXuyen" stackId="a" name="Trợ cấp thường xuyên" fill="var(--color-primary)" />
              <Bar dataKey="motLan" stackId="a" name="Trợ cấp một lần" fill="var(--color-gold)" />
              <Bar dataKey="dieuDuong" stackId="a" name="Điều dưỡng phục hồi" fill="var(--color-azure)" />
              <Bar dataKey="bhyt" stackId="a" name="Bảo hiểm y tế" fill="var(--color-moss)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <div className="glass-card overflow-x-auto lg:col-span-2">
          <div className="flex items-center justify-between p-4">
            <div className="label-mono">Danh sách chi trả tháng 8/2026</div>
            <span className="font-mono text-[12px] text-gold">{formatVND(tong)}</span>
          </div>
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-y text-left">
                {["Kỳ chi trả", "Phường", "Số đối tượng", "Hình thức", "Số tiền", "Trạng thái"].map(
                  (h) => (
                    <th key={h} className="label-mono px-4 py-3">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {dsChiTra.map((r) => (
                <tr key={r.phuong} className="border-b last:border-0 hover:bg-foreground/5">
                  <td className="px-4 py-3 text-muted-foreground">{r.ky}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{r.phuong}</td>
                  <td className="px-4 py-3 font-mono tabular-nums text-muted-foreground">
                    {formatNum(r.soDoiTuong)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{r.qua}</td>
                  <td className="px-4 py-3 font-mono tabular-nums text-foreground">
                    {formatVND(r.soTien)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full border px-2 py-0.5 font-mono text-[10px] ${
                        r.trangThai === "ĐÃ CHI"
                          ? "border-moss/40 bg-moss/10 text-moss"
                          : r.trangThai === "ĐANG CHI"
                            ? "border-gold/40 bg-gold/10 text-gold"
                            : "border-border bg-foreground/5 text-muted-foreground"
                      }`}
                    >
                      {r.trangThai}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="glass-card border-primary/30 p-4 ring-1 ring-primary/20">
          <div className="flex items-center justify-between">
            <div className="label-mono">Đối soát chi trả bất thường</div>
            <span className="rounded-full bg-primary px-2 py-0.5 font-mono text-[10px] text-primary-foreground">
              {doiSoatCanhBao.length}
            </span>
          </div>
          <div className="mt-3 space-y-2">
            {doiSoatCanhBao.map((c) => (
              <div key={c.ma} className="rounded-md bg-primary/10 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-primary">{c.ma}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{c.mucDo}</span>
                </div>
                <div className="mt-1 text-[13px] font-medium text-foreground">{c.loai}</div>
                <p className="mt-1 text-[12px] text-muted-foreground">{c.noiDung}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
