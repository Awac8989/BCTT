import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { FileText, UploadCloud } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader, StatusBadge } from "@/components/AppShell";
import { formatVND, hoSoList, MUC_CHUAN } from "@/data/mock";

export const Route = createFileRoute("/ho-so/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Thẩm định hồ sơ ${params.id} · Người có công` },
      {
        name: "description",
        content:
          "Màn hình nhập liệu và thẩm định hồ sơ Người có công: thông tin định danh, tài liệu số hóa và bảng tính trợ cấp tự động.",
      },
      { property: "og:title", content: `Thẩm định hồ sơ ${params.id}` },
      {
        property: "og:description",
        content: "Xem trước mức trợ cấp do động cơ tính toán và ra quyết định phê duyệt.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ params }) => {
    const hoSo = hoSoList.find((h) => h.id === params.id);
    if (!hoSo) throw notFound();
    return { hoSo };
  },
  component: HoSoDetail,
});

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-ink-3/50 px-3 py-2">
      <div className="label-mono">{label}</div>
      <div className="mt-0.5 text-sm text-foreground">{value}</div>
    </div>
  );
}

function HoSoDetail() {
  const { hoSo } = Route.useLoaderData();
  const [ghiChu, setGhiChu] = useState(hoSo.ghiChuThamDinh ?? "");
  const tong = hoSo.mucTroCap + hoSo.phuCapPhucVu + hoSo.troCapDieuDuong;

  return (
    <AppShell>
      <PageHeader
        eyebrow={`Hồ sơ ${hoSo.id} · Tiếp nhận ${hoSo.ngayTiepNhan}`}
        title={hoSo.hoTen}
        right={
          <div className="flex items-center gap-2">
            <StatusBadge trangThai={hoSo.trangThai} />
            <Link
              to="/ho-so"
              className="rounded-md border px-3 py-1.5 font-mono text-[11px] text-muted-foreground hover:bg-foreground/5"
            >
              ← Danh sách
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
        <section className="space-y-3 lg:col-span-3">
          <div className="glass-card p-4">
            <div className="label-mono">Khối thông tin định danh</div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <Field label="Họ và tên" value={hoSo.hoTen} />
              <Field label="Số CCCD (12 số · đã kiểm tra trùng)" value={hoSo.cccd} />
              <Field label="Ngày sinh" value={hoSo.ngaySinh} />
              <Field label="Giới tính" value={hoSo.gioiTinh} />
            </div>
          </div>

          <div className="glass-card p-4">
            <div className="label-mono">Địa chỉ thường trú</div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <Field label="Phường / Xã" value={hoSo.phuong} />
              <Field label="Khu phố / Ấp" value={hoSo.khuPho} />
              <Field label="Đơn vị hành chính" value="TP. Thủ Dầu Một" />
            </div>
          </div>

          <div className="glass-card p-4">
            <div className="label-mono">Khối nghiệp vụ chính sách</div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <Field label="Nhóm đối tượng ưu đãi" value={hoSo.loaiDoiTuong} />
              <Field
                label="Tỷ lệ tổn thương cơ thể"
                value={hoSo.tyLeTonThuong ? `${hoSo.tyLeTonThuong}%` : "Không áp dụng"}
              />
              <Field label="Hạn xử lý" value={hoSo.hanXuLy} />
            </div>

            <div className="mt-3 rounded-lg border border-dashed p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <UploadCloud className="size-4 text-gold" />
                Kéo &amp; thả tài liệu số hóa (PDF, JPG) vào đây
              </div>
              <ul className="mt-3 space-y-1.5">
                {hoSo.taiLieu.map((t) => (
                  <li
                    key={t}
                    className="flex items-center gap-2 rounded-md bg-foreground/5 px-3 py-2 text-[13px] text-foreground"
                  >
                    <FileText className="size-3.5 text-gold" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <aside className="space-y-3 lg:col-span-2">
          <div className="glass-card border-gold/30 p-4 ring-1 ring-gold/20">
            <div className="label-mono">Động cơ tính trợ cấp · Nghị định 75/2021/NĐ-CP</div>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Mức chuẩn trợ cấp</span>
                <span className="font-mono tabular-nums text-foreground">
                  {formatVND(MUC_CHUAN)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Trợ cấp theo đối tượng / thương tật</span>
                <span className="font-mono tabular-nums text-foreground">
                  {formatVND(hoSo.mucTroCap)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Phụ cấp người phục vụ</span>
                <span className="font-mono tabular-nums text-foreground">
                  {formatVND(hoSo.phuCapPhucVu)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Trợ cấp điều dưỡng</span>
                <span className="font-mono tabular-nums text-foreground">
                  {formatVND(hoSo.troCapDieuDuong)}
                </span>
              </div>
              <div className="mt-3 flex items-end justify-between border-t pt-3">
                <span className="label-mono">Tổng thực nhận</span>
                <span className="ledger-title text-2xl tabular-nums text-gold">
                  {formatVND(tong)}
                </span>
              </div>
            </div>
          </div>

          <div className="glass-card p-4">
            <div className="label-mono">Ghi chú thẩm định</div>
            <textarea
              value={ghiChu}
              onChange={(e) => setGhiChu(e.target.value)}
              rows={4}
              placeholder="Nêu rõ lý do khi trả lại hoặc từ chối hồ sơ…"
              className="mt-2 w-full rounded-md border bg-ink-3/70 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
            />
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <button
                onClick={() => toast.success("Đã lưu nháp hồ sơ " + hoSo.id)}
                className="rounded-md border px-3 py-2 text-sm text-muted-foreground hover:bg-foreground/5"
              >
                Lưu nháp
              </button>
              <button
                onClick={() => toast.success("Đã trình Lãnh đạo phê duyệt")}
                className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Trình Lãnh đạo duyệt
              </button>
              <button
                onClick={() =>
                  ghiChu.trim()
                    ? toast.success("Đã gửi yêu cầu bổ sung tới cán bộ tiếp nhận")
                    : toast.error("Cần ghi chú lý do yêu cầu bổ sung")
                }
                className="rounded-md border border-gold/40 bg-gold/10 px-3 py-2 text-sm text-gold hover:bg-gold/15"
              >
                Yêu cầu bổ sung
              </button>
              <button
                onClick={() =>
                  ghiChu.trim()
                    ? toast.success("Đã từ chối hồ sơ kèm lý do")
                    : toast.error("Cần ghi chú lý do từ chối")
                }
                className="rounded-md border border-primary/40 bg-primary/10 px-3 py-2 text-sm text-primary hover:bg-primary/15"
              >
                Từ chối kèm lý do
              </button>
            </div>
          </div>

          <div className="glass-card p-4">
            <div className="label-mono">Luồng trạng thái</div>
            <ol className="mt-3 space-y-2 text-[13px]">
              {[
                "MỚI_TIẾP_NHẬN",
                "ĐANG_THẨM_ĐỊNH",
                "CHỜ_PHÊ_DUYỆT",
                "ĐÃ_DUYỆT",
              ].map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <span
                    className={`size-2 rounded-full ${
                      b === hoSo.trangThai ? "bg-primary" : "bg-ink-4"
                    }`}
                  />
                  <span
                    className={
                      b === hoSo.trangThai ? "font-mono text-foreground" : "font-mono text-muted-foreground"
                    }
                  >
                    {b}
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-2 label-mono normal-case">
              Cán bộ tiếp nhận: {hoSo.canBoTiepNhan}
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
