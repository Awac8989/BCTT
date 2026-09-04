import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Search, X } from "lucide-react";
import { useState, type ReactNode } from "react";

const NAV = [
  { to: "/", label: "Tổng quan" },
  { to: "/ho-so", label: "Quản lý Hồ sơ" },
  { to: "/tham-dinh", label: "Thẩm định" },
  { to: "/chi-tra", label: "Chi trả trợ cấp" },
  { to: "/phan-tich", label: "Phân tích số liệu" },
  { to: "/danh-gia", label: "Đánh giá dịch vụ" },
  { to: "/he-thong", label: "Hệ thống" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  const nav = (
    <>
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="grid size-9 place-items-center rounded-md bg-primary font-ledger text-lg font-bold text-primary-foreground">
          VX
        </div>
        <div className="leading-tight">
          <div className="ledger-title text-[13px] text-foreground">Hồ sơ NCC</div>
          <div className="label-mono">Phòng VH-XH</div>
        </div>
      </div>
      <nav className="mt-2 flex-1 space-y-0.5 px-3 text-sm">
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setOpen(false)}
            className={
              isActive(item.to)
                ? "flex items-center justify-between rounded-md bg-foreground/8 px-3 py-2 font-medium text-foreground"
                : "flex items-center justify-between rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
            }
          >
            <span>{item.label}</span>
            {isActive(item.to) && <span className="font-mono text-[10px] text-primary">●</span>}
          </Link>
        ))}
      </nav>
      <div className="m-3 rounded-lg border bg-ink-3/60 p-3">
        <div className="label-mono">Phiên đăng nhập</div>
        <div className="mt-1 text-sm font-semibold text-foreground">Hứa Trọng Duy</div>
        <div className="label-mono normal-case">Lãnh đạo Phòng · Thủ Dầu Một</div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r bg-ink-2/60 backdrop-blur-md lg:flex">
        {nav}
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            aria-label="Đóng menu"
            className="absolute inset-0 bg-ink/80"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col border-r bg-ink-2 backdrop-blur-md">
            <button
              aria-label="Đóng menu"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-4 text-muted-foreground"
            >
              <X className="size-4" />
            </button>
            {nav}
          </aside>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b bg-ink/70 px-4 py-3 backdrop-blur-md sm:px-5">
          <button
            aria-label="Mở menu"
            onClick={() => setOpen(true)}
            className="rounded-md border p-2 text-muted-foreground lg:hidden"
          >
            <Menu className="size-4" />
          </button>
          <label className="flex flex-1 items-center gap-2 rounded-md border bg-ink-3/70 px-3 py-2 text-sm">
            <Search className="size-3.5 text-primary" />
            <input
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              placeholder="Tìm CCCD / Mã hồ sơ…"
            />
            <span className="hidden rounded bg-foreground/10 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:block">
              ⌘K
            </span>
          </label>
          <Link
            to="/danh-gia"
            className="relative hidden rounded-md border px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            Thông báo
            <span className="ml-1 inline-grid size-4 place-items-center rounded-full bg-primary font-mono text-[10px] text-primary-foreground">
              3
            </span>
          </Link>
        </header>
        <main className="p-4 sm:p-5">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  right,
}: {
  eyebrow: string;
  title: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <div className="font-mono text-[11px] uppercase tracking-widest text-gold">{eyebrow}</div>
        <h1 className="ledger-title mt-1 text-2xl text-foreground sm:text-3xl">{title}</h1>
      </div>
      {right}
    </div>
  );
}

export function StatusBadge({ trangThai }: { trangThai: string }) {
  const tone =
    trangThai === "ĐÃ_DUYỆT"
      ? "border-moss/40 bg-moss/10 text-moss"
      : trangThai === "TỪ_CHỐI" || trangThai === "YÊU_CẦU_BỔ_SUNG"
        ? "border-primary/40 bg-primary/10 text-primary"
        : trangThai === "CHỜ_PHÊ_DUYỆT"
          ? "border-gold/40 bg-gold/10 text-gold"
          : "border-border bg-foreground/5 text-muted-foreground";
  return (
    <span className={`rounded-full border px-2 py-0.5 font-mono text-[10px] ${tone}`}>
      {trangThai}
    </span>
  );
}
