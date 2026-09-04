import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader, StatusBadge } from "@/components/AppShell";
import { formatNum, hoSoList, phezuyetFunnel } from "@/data/mock";

export const Route = createFileRoute("/tham-dinh")({
  head: () => ({
    meta: [
      { title: "Thẩm định & phê duyệt hồ sơ · Người có công" },
      {
        name: "description",
        content:
          "Hàng đợi thẩm định hồ sơ Người có công theo từng công đoạn, kèm biểu đồ phễu tiến độ giải quyết thủ tục hành chính.",
      },
      { property: "og:title", content: "Thẩm định & phê duyệt hồ sơ Người có công" },
      {
        property: "og:description",
        content: "Theo dõi tỷ lệ hồ sơ ở từng bước tiếp nhận, thẩm định, phê duyệt và trả kết quả.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ThamDinh,
});

const COT: { tt: string; ten: string }[] = [
  { tt: "MỚI_TIẾP_NHẬN", ten: "Mới tiếp nhận" },
  { tt: "ĐANG_THẨM_ĐỊNH", ten: "Đang thẩm định" },
  { tt: "CHỜ_PHÊ_DUYỆT", ten: "Chờ phê duyệt" },
  { tt: "ĐÃ_DUYỆT", ten: "Đã duyệt" },
];

function ThamDinh() {
  const max = phezuyetFunnel[0]?.soLuong ?? 1;

  return (
    <AppShell>
      <PageHeader
        eyebrow="Phân hệ 1.2 · Thẩm định pháp lý"
        title="Hàng đợi thẩm định & phê duyệt"
      />

      <div className="glass-card mb-3 p-4">
        <div className="label-mono">Phễu tiến độ xử lý thủ tục hành chính</div>
        <div className="mt-4 space-y-2">
          {phezuyetFunnel.map((b, i) => (
            <div key={b.buoc} className="flex items-center gap-3">
              <span className="w-40 shrink-0 text-[13px] text-foreground">{b.buoc}</span>
              <div className="h-7 flex-1 overflow-hidden rounded-md bg-foreground/5">
                <div
                  className="flex h-full items-center justify-end rounded-md bg-primary/70 pr-2 font-mono text-[11px] text-primary-foreground"
                  style={{ width: `${(b.soLuong / max) * 100}%`, opacity: 1 - i * 0.12 }}
                >
                  {formatNum(b.soLuong)}
                </div>
              </div>
              <span className="w-14 text-right font-mono text-[11px] tabular-nums text-muted-foreground">
                {((b.soLuong / max) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-4">
        {COT.map((c) => {
          const items = hoSoList.filter((h) => h.trangThai === c.tt);
          return (
            <div key={c.tt} className="glass-card p-3">
              <div className="flex items-center justify-between">
                <div className="label-mono">{c.ten}</div>
                <span className="font-mono text-[11px] text-gold">{items.length}</span>
              </div>
              <div className="mt-3 space-y-2">
                {items.map((h) => (
                  <Link
                    key={h.id}
                    to="/ho-so/$id"
                    params={{ id: h.id }}
                    className="block rounded-md bg-foreground/5 p-3 transition-colors hover:bg-foreground/8"
                  >
                    <div className="font-mono text-[12px] text-gold">{h.id}</div>
                    <div className="mt-1 text-[13px] font-medium text-foreground">{h.hoTen}</div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground">
                      {h.loaiDoiTuong} · {h.phuong}
                    </div>
                    {h.quaHanNgay > 0 && (
                      <div className="mt-2 font-mono text-[10px] text-primary">
                        ⚠ Quá hạn {h.quaHanNgay} ngày
                      </div>
                    )}
                  </Link>
                ))}
                {items.length === 0 && (
                  <div className="rounded-md border border-dashed p-4 text-center text-[11px] text-muted-foreground">
                    Không có hồ sơ
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
