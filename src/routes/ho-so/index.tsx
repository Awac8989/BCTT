import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, PageHeader, StatusBadge } from "@/components/AppShell";
import { formatVND, hoSoList, PHUONG_LIST } from "@/data/mock";

export const Route = createFileRoute("/ho-so/")({
  head: () => ({
    meta: [
      { title: "Quản lý hồ sơ Người có công · Danh sách" },
      {
        name: "description",
        content:
          "Danh sách hồ sơ Người có công theo phường, loại đối tượng và trạng thái thẩm định, kèm mức trợ cấp dự kiến.",
      },
      { property: "og:title", content: "Quản lý hồ sơ Người có công" },
      {
        property: "og:description",
        content: "Tra cứu, lọc và mở thẩm định hồ sơ Người có công trên toàn địa bàn.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HoSoIndex,
});

const TRANG_THAI = [
  "Tất cả",
  "MỚI_TIẾP_NHẬN",
  "ĐANG_THẨM_ĐỊNH",
  "CHỜ_PHÊ_DUYỆT",
  "ĐÃ_DUYỆT",
  "YÊU_CẦU_BỔ_SUNG",
  "TỪ_CHỐI",
];

function HoSoIndex() {
  const [q, setQ] = useState("");
  const [phuong, setPhuong] = useState("Tất cả");
  const [tt, setTt] = useState("Tất cả");

  const rows = useMemo(
    () =>
      hoSoList.filter(
        (h) =>
          (phuong === "Tất cả" || h.phuong === phuong) &&
          (tt === "Tất cả" || h.trangThai === tt) &&
          (q.trim() === "" ||
            h.hoTen.toLowerCase().includes(q.toLowerCase()) ||
            h.cccd.includes(q) ||
            h.id.toLowerCase().includes(q.toLowerCase())),
      ),
    [q, phuong, tt],
  );

  return (
    <AppShell>
      <PageHeader
        eyebrow="Phân hệ 1 · Tiếp nhận & thẩm định"
        title="Quản lý hồ sơ Người có công"
        right={
          <div className="label-mono">
            {rows.length} / {hoSoList.length} hồ sơ
          </div>
        }
      />

      <div className="glass-card mb-3 grid gap-2 p-3 sm:grid-cols-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm họ tên / CCCD / mã hồ sơ"
          className="rounded-md border bg-ink-3/70 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
        />
        <select
          value={phuong}
          onChange={(e) => setPhuong(e.target.value)}
          className="rounded-md border bg-ink-3/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          <option>Tất cả</option>
          {PHUONG_LIST.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
        <select
          value={tt}
          onChange={(e) => setTt(e.target.value)}
          className="rounded-md border bg-ink-3/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          {TRANG_THAI.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="glass-card overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b text-left">
              {[
                "Mã hồ sơ",
                "Họ và tên",
                "CCCD",
                "Phường",
                "Loại đối tượng",
                "Tỷ lệ",
                "Trạng thái",
                "Trợ cấp/tháng",
              ].map((h) => (
                <th key={h} className="label-mono px-4 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((h) => (
              <tr key={h.id} className="border-b transition-colors last:border-0 hover:bg-foreground/5">
                <td className="px-4 py-3">
                  <Link
                    to="/ho-so/$id"
                    params={{ id: h.id }}
                    className="font-mono text-[12px] text-gold underline-offset-4 hover:underline"
                  >
                    {h.id}
                  </Link>
                </td>
                <td className="px-4 py-3 font-medium text-foreground">{h.hoTen}</td>
                <td className="px-4 py-3 font-mono text-[12px] text-muted-foreground">{h.cccd}</td>
                <td className="px-4 py-3 text-muted-foreground">{h.phuong}</td>
                <td className="px-4 py-3 text-muted-foreground">{h.loaiDoiTuong}</td>
                <td className="px-4 py-3 font-mono tabular-nums text-muted-foreground">
                  {h.tyLeTonThuong ? `${h.tyLeTonThuong}%` : "—"}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge trangThai={h.trangThai} />
                </td>
                <td className="px-4 py-3 font-mono tabular-nums text-foreground">
                  {formatVND(h.mucTroCap + h.phuCapPhucVu)}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  Không tìm thấy hồ sơ phù hợp bộ lọc.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
