import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/khao-sat")({
  head: () => ({
    meta: [
      { title: "Khảo sát chất lượng phục vụ dịch vụ công · Thủ Dầu Một" },
      {
        name: "description",
        content:
          "Phiếu khảo sát mức độ hài lòng dành cho người có công và thân nhân: chữ lớn, tương phản cao, gửi đánh giá 1 chạm trên Kiosk hoặc điện thoại.",
      },
      { property: "og:title", content: "Khảo sát chất lượng phục vụ dịch vụ công" },
      {
        property: "og:description",
        content: "Ý kiến của Bác/Cô/Chú giúp cải thiện chất lượng phục vụ tại Bộ phận Một cửa.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: KhaoSat,
});

const THAI_DO = [
  { icon: "😡", label: "Rất tệ", diem: 1 },
  { icon: "🙁", label: "Chưa tốt", diem: 2 },
  { icon: "😐", label: "Bình thường", diem: 3 },
  { icon: "😊", label: "Hài lòng", diem: 4 },
  { icon: "⭐", label: "Rất hài lòng", diem: 5 },
];

const THOI_GIAN = ["Quá chậm trễ", "Đúng hẹn", "Nhanh chóng"];

function KhaoSat() {
  const [thaiDo, setThaiDo] = useState<number | null>(null);
  const [thoiGian, setThoiGian] = useState<string | null>(null);
  const [yKien, setYKien] = useState("");
  const [daGui, setDaGui] = useState(false);

  if (daGui) {
    return (
      <div className="grid min-h-screen place-items-center px-4">
        <div className="glass-card max-w-lg p-8 text-center">
          <div className="text-5xl">🎖️</div>
          <h1 className="ledger-title mt-4 text-2xl text-foreground">Xin trân trọng cảm ơn</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Ý kiến của Bác/Cô/Chú đã được ghi nhận và chuyển tới Lãnh đạo Phòng Văn hóa – Xã hội.
          </p>
          <Link
            to="/danh-gia"
            className="mt-6 inline-block rounded-md border px-4 py-2 text-sm text-muted-foreground hover:bg-foreground/5"
          >
            Xem dashboard đánh giá
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <header className="glass-card p-6 text-center">
        <div className="label-mono">Ủy ban nhân dân thành phố Thủ Dầu Một</div>
        <h1 className="ledger-title mt-2 text-2xl text-foreground sm:text-3xl">
          Khảo sát chất lượng phục vụ dịch vụ công
        </h1>
      </header>

      <div className="glass-card mt-3 grid gap-2 p-5 text-base sm:grid-cols-3">
        <div>
          <div className="label-mono">Mã hồ sơ</div>
          <div className="font-mono text-foreground">TDM-NCC-2026-00412</div>
        </div>
        <div>
          <div className="label-mono">Thủ tục</div>
          <div className="text-foreground">Trợ cấp Thương binh</div>
        </div>
        <div>
          <div className="label-mono">Cán bộ tiếp nhận</div>
          <div className="text-foreground">Nguyễn Văn An · Một cửa</div>
        </div>
      </div>

      <section className="glass-card mt-3 p-5">
        <h2 className="text-xl font-semibold text-foreground">
          1. Bác/Cô/Chú đánh giá thế nào về sự tiếp đón và hướng dẫn của cán bộ công chức?
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {THAI_DO.map((t) => (
            <button
              key={t.diem}
              onClick={() => setThaiDo(t.diem)}
              className={`rounded-xl border p-4 text-center transition-transform active:scale-95 ${
                thaiDo === t.diem
                  ? "border-gold bg-gold/15 text-foreground ring-2 ring-gold/40"
                  : "bg-foreground/5 text-muted-foreground hover:bg-foreground/10"
              }`}
            >
              <div className="text-3xl">{t.icon}</div>
              <div className="mt-2 text-base font-semibold">{t.label}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="glass-card mt-3 p-5">
        <h2 className="text-xl font-semibold text-foreground">
          2. Thời gian tiếp nhận và xử lý hồ sơ:
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {THOI_GIAN.map((t) => (
            <button
              key={t}
              onClick={() => setThoiGian(t)}
              className={`rounded-xl border px-4 py-4 text-lg transition-transform active:scale-95 ${
                thoiGian === t
                  ? "border-gold bg-gold/15 font-semibold text-foreground ring-2 ring-gold/40"
                  : "bg-foreground/5 text-muted-foreground hover:bg-foreground/10"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      <section className="glass-card mt-3 p-5">
        <h2 className="text-xl font-semibold text-foreground">3. Ý kiến đóng góp thêm (nếu có):</h2>
        <textarea
          value={yKien}
          onChange={(e) => setYKien(e.target.value)}
          rows={4}
          placeholder="Bác/Cô/Chú vui lòng ghi ý kiến tại đây…"
          className="mt-4 w-full rounded-xl border bg-ink-3/70 px-4 py-3 text-lg outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
        />
      </section>

      <button
        onClick={() => {
          if (!thaiDo || !thoiGian) {
            toast.error("Vui lòng chọn đáp án cho câu 1 và câu 2");
            return;
          }
          setDaGui(true);
        }}
        className="mt-4 w-full rounded-xl bg-primary px-6 py-5 text-xl font-bold uppercase tracking-wide text-primary-foreground transition-transform active:scale-[0.99] hover:bg-primary/90"
      >
        Gửi đánh giá
      </button>
      <p className="mt-3 text-center text-sm text-muted-foreground">
        Phiếu khảo sát mở qua mã QR trên giấy hẹn, Kiosk một cửa hoặc liên kết Zalo ZNS/SMS · không
        cần đăng nhập.
      </p>
    </div>
  );
}
