import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { formatVND, MUC_CHUAN, PHUONG_LIST } from "@/data/mock";

export const Route = createFileRoute("/he-thong")({
  head: () => ({
    meta: [
      { title: "Quản trị hệ thống & liên thông LGSP · Người có công" },
      {
        name: "description",
        content:
          "Cấu hình danh mục phường/xã, loại đối tượng, mức chuẩn trợ cấp, quản lý tài khoản và giám sát log tích hợp LGSP.",
      },
      { property: "og:title", content: "Quản trị hệ thống Hồ sơ Người có công" },
      {
        property: "og:description",
        content: "Danh mục nghiệp vụ, phân quyền tác nhân và log liên thông dữ liệu.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HeThong,
});

const TAC_NHAN = [
  { vai: "Cán bộ Tiếp nhận", so: 28, quyen: "Nhập hồ sơ, đính kèm, ghi nhận chi trả" },
  { vai: "Chuyên viên thẩm định", so: 9, quyen: "Thẩm định pháp lý, đề xuất mức trợ cấp" },
  { vai: "Lãnh đạo Phòng", so: 3, quyen: "Phê duyệt, ban hành quyết định, xem báo cáo" },
  { vai: "Quản trị viên", so: 2, quyen: "Danh mục, tài khoản, log, tích hợp LGSP" },
];

const HE_SO = [
  { loai: "Mẹ VNAH", heSo: 2.0 },
  { loai: "Thương binh 21–40%", heSo: 0.6 },
  { loai: "Thương binh 41–60%", heSo: 1.5 },
  { loai: "Thương binh 61–80%", heSo: 1.98 },
  { loai: "Thương binh > 81%", heSo: 2.4 },
  { loai: "Thân nhân liệt sĩ", heSo: 1.0 },
];

const LOG = [
  { thoiGian: "04/09/2026 18:12", su: "Đồng bộ dân cư LGSP", ketQua: "THÀNH CÔNG", so: "128 bản ghi" },
  { thoiGian: "04/09/2026 12:40", su: "Gửi Zalo ZNS khảo sát", ketQua: "THÀNH CÔNG", so: "64 tin" },
  { thoiGian: "03/09/2026 22:05", su: "Đối soát chi trả tự động", ketQua: "CẢNH BÁO", so: "3 bất thường" },
  { thoiGian: "03/09/2026 08:15", su: "Xác thực CCCD qua LGSP", ketQua: "LỖI", so: "2 yêu cầu timeout" },
];

function HeThong() {
  return (
    <AppShell>
      <PageHeader eyebrow="Phân hệ 5 · Quản trị & tích hợp" title="Quản trị hệ thống" />

      <div className="grid gap-3 lg:grid-cols-3">
        <div className="glass-card p-4">
          <div className="label-mono">Mức chuẩn trợ cấp ưu đãi hiện hành</div>
          <div className="ledger-title mt-2 text-3xl tabular-nums text-gold">
            {formatVND(MUC_CHUAN)}
          </div>
          <p className="mt-2 text-[12px] text-muted-foreground">
            Áp dụng theo Nghị định 75/2021/NĐ-CP và văn bản sửa đổi.
          </p>
        </div>
        <div className="glass-card p-4 lg:col-span-2">
          <div className="label-mono">Hệ số theo nhóm đối tượng</div>
          <div className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {HE_SO.map((h) => (
              <div key={h.loai} className="flex items-center justify-between border-b pb-1.5 text-[13px]">
                <span className="text-foreground">{h.loai}</span>
                <span className="font-mono tabular-nums text-gold">×{h.heSo.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <div className="glass-card p-4">
          <div className="label-mono">Danh mục 14 phường/xã</div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {PHUONG_LIST.map((p) => (
              <span
                key={p}
                className="rounded-md border bg-foreground/5 px-2 py-1 text-[12px] text-foreground"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="label-mono">Tác nhân & phân quyền</div>
          <div className="mt-3 space-y-2">
            {TAC_NHAN.map((t) => (
              <div key={t.vai} className="rounded-md bg-foreground/5 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-medium text-foreground">{t.vai}</span>
                  <span className="font-mono text-[11px] text-gold">{t.so} tài khoản</span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">{t.quyen}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="label-mono">Log tích hợp LGSP</div>
          <div className="mt-3 space-y-2">
            {LOG.map((l) => (
              <div key={l.thoiGian} className="rounded-md bg-foreground/5 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-muted-foreground">{l.thoiGian}</span>
                  <span
                    className={`rounded-full border px-2 py-0.5 font-mono text-[10px] ${
                      l.ketQua === "THÀNH CÔNG"
                        ? "border-moss/40 bg-moss/10 text-moss"
                        : l.ketQua === "CẢNH BÁO"
                          ? "border-gold/40 bg-gold/10 text-gold"
                          : "border-primary/40 bg-primary/10 text-primary"
                    }`}
                  >
                    {l.ketQua}
                  </span>
                </div>
                <div className="mt-1 text-[13px] text-foreground">{l.su}</div>
                <div className="label-mono normal-case">{l.so}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
