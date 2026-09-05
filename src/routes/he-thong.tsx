import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Calculator,
  Cpu,
  Database,
  Sparkles,
  Server,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Layers,
} from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { formatVND, MUC_CHUAN, PHUONG_LIST } from "@/data/mock";
import { calculateAllowance } from "@/services/calculator.service";
import { analyzeSentiment } from "@/services/sentiment.service";
import { useAppState, appStore } from "@/services/app-state";

export const Route = createFileRoute("/he-thong")({
  head: () => ({
    meta: [
      { title: "Quản trị hệ thống & liên thông LGSP · Người có công" },
      {
        name: "description",
        content:
          "Cấu hình danh mục phường/xã, loại đối tượng, mức chuẩn trợ cấp, công cụ kiểm thử Engine và giám sát log tích hợp LGSP.",
      },
      { property: "og:title", content: "Quản trị hệ thống Hồ sơ Người có công" },
      {
        property: "og:description",
        content: "Danh mục nghiệp vụ, phân quyền tác nhân, Engine Studio và log liên thông dữ liệu.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HeThong,
});

const TAC_NHAN = [
  { vai: "Cán bộ Tiếp nhận (Một cửa)", so: 28, quyen: "Nhập hồ sơ, kiểm tra CCCD, ghi nhận chi trả" },
  { vai: "Chuyên viên thẩm định", so: 9, quyen: "Thẩm định pháp lý, tính toán trợ cấp tự động" },
  { vai: "Lãnh đạo Phòng VH-XH", so: 3, quyen: "Phê duyệt, ban hành quyết định, giám sát Dashboard" },
  { vai: "Quản trị viên hệ thống", so: 2, quyen: "Cấu hình danh mục, tài khoản, giám sát LGSP & CSDL" },
];

const HE_SO = [
  { loai: "Mẹ VNAH (×3.0 + Chăm sóc ×1.0)", heSo: 3.0 },
  { loai: "Thương binh ≥ 81% (×3.85)", heSo: 3.85 },
  { loai: "Thương binh 61–80% (×2.63)", heSo: 2.63 },
  { loai: "Thương binh 41–60% (×1.82)", heSo: 1.82 },
  { loai: "Thương binh 21–40% (×1.15)", heSo: 1.15 },
  { loai: "Bệnh binh ≥ 81% (×3.10)", heSo: 3.1 },
  { loai: "Thân nhân liệt sĩ (×1.0)", heSo: 1.0 },
  { loai: "Cán bộ tiền khởi nghĩa (×1.45)", heSo: 1.45 },
];

function HeThong() {
  const { auditLogs } = useAppState();

  // State cho Testing Studio 1: Engine tính trợ cấp
  const [testMaDt, setTestMaDt] = useState("THUONG_BINH");
  const [testTyLe, setTestTyLe] = useState(81);
  const [testCaregiver, setTestCaregiver] = useState(true);

  const testCalcResult = calculateAllowance({
    maLoaiDt: testMaDt,
    tyLeThuongTat: testTyLe,
    coNguoiChamSoc: testCaregiver,
  });

  // State cho Testing Studio 2: Bộ phân tích Sentiment
  const [testText, setTestText] = useState("Thủ tục quá chậm trễ, cán bộ tiếp dân thái độ phiền hà");
  const testSentimentResult = analyzeSentiment(testText);

  const handleResetData = () => {
    if (confirm("Bạn có chắc chắn muốn khôi phục toàn bộ dữ liệu mẫu ban đầu không?")) {
      appStore.resetToDefault();
      toast.success("Đã khôi phục dữ liệu ban đầu!");
    }
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Phân hệ 5 · Quản trị, Tích hợp & Engine Studio"
        title="Quản trị hệ thống"
        right={
          <button
            onClick={handleResetData}
            className="flex items-center gap-1.5 rounded-md border border-border bg-ink-3/80 px-3 py-1.5 text-xs text-muted-foreground transition-all hover:bg-foreground/5 hover:text-foreground"
          >
            <RefreshCw className="size-3.5" />
            Khôi phục dữ liệu mẫu
          </button>
        }
      />

      {/* Trạng thái kiến trúc Microservices lai (Phần 1 TDD) */}
      <div className="glass-card mb-4 p-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <Layers className="size-4 text-gold" />
            <span className="font-semibold text-foreground text-sm">
              Trạng thái Cụm Dịch vụ (Hybrid Architecture Status)
            </span>
          </div>
          <span className="flex items-center gap-1 font-mono text-xs text-moss">
            <CheckCircle2 className="size-3.5" /> Tất cả dịch vụ hoạt động bình thường
          </span>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
          <div className="rounded-lg border bg-ink-3/60 p-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <Server className="size-3.5 text-primary" /> Node.js Gateway
              </span>
              <span className="font-mono text-moss">ONLINE</span>
            </div>
            <p className="mt-1 text-muted-foreground text-[11px]">JWT Auth, Profile CRUD &amp; CSAT</p>
            <div className="mt-2 font-mono text-[10px] text-muted-foreground">Port: 8080 · Express.js</div>
          </div>

          <div className="rounded-lg border bg-ink-3/60 p-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <Cpu className="size-3.5 text-gold" /> Spring Boot Core
              </span>
              <span className="font-mono text-moss">ONLINE</span>
            </div>
            <p className="mt-1 text-muted-foreground text-[11px]">Allowance BigDecimal Engine</p>
            <div className="mt-2 font-mono text-[10px] text-muted-foreground">Port: 8081 · Java 21</div>
          </div>

          <div className="rounded-lg border bg-ink-3/60 p-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <Database className="size-3.5 text-azure" /> MySQL 8.0 Cluster
              </span>
              <span className="font-mono text-moss">CONNECTED</span>
            </div>
            <p className="mt-1 text-muted-foreground text-[11px]">9 Tables · InnoDB 3NF · UTF8MB4</p>
            <div className="mt-2 font-mono text-[10px] text-muted-foreground">Lat: 1.2ms · Index OK</div>
          </div>

          <div className="rounded-lg border bg-ink-3/60 p-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-gold" /> Trục liên thông LGSP
              </span>
              <span className="font-mono text-moss">SYNCED</span>
            </div>
            <p className="mt-1 text-muted-foreground text-[11px]">OAuth2 / mTLS TP. Thủ Dầu Một</p>
            <div className="mt-2 font-mono text-[10px] text-muted-foreground">Status: 200 OK</div>
          </div>
        </div>
      </div>

      {/* KHU VỰC TESTING STUDIO DÀNH CHO LẬP TRÌNH VIÊN / KIỂM THỬ */}
      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        {/* Studio 1: Test Calculation Engine */}
        <div className="glass-card border-gold/40 p-4 ring-1 ring-gold/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="size-4 text-gold" />
              <span className="font-semibold text-foreground text-sm">
                Kiểm thử Engine Tính Trợ cấp (Nghị định 75/2021)
              </span>
            </div>
            <span className="label-mono text-[10px] text-gold">Spring Boot Engine</span>
          </div>

          <div className="mt-3 space-y-3 text-xs">
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <label className="label-mono mb-1 block">Loại đối tượng</label>
                <select
                  value={testMaDt}
                  onChange={(e) => setTestMaDt(e.target.value)}
                  className="w-full rounded-md border bg-ink-3/80 px-2.5 py-1.5 text-xs text-foreground outline-none"
                >
                  <option value="THUONG_BINH">Thương binh</option>
                  <option value="BENH_BINH">Bệnh binh</option>
                  <option value="ME_VNAH">Mẹ VNAH</option>
                  <option value="LIET_SI">Thân nhân Liệt sĩ</option>
                  <option value="CHAT_DOC_HOA_HOC">Nhiễm CĐHH</option>
                  <option value="TIEN_KHOI_NGHIA">Cán bộ tiền khởi nghĩa</option>
                </select>
              </div>

              <div>
                <label className="label-mono mb-1 block">Tỷ lệ thương tật: {testTyLe}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={testTyLe}
                  onChange={(e) => setTestTyLe(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="testCare"
                checked={testCaregiver}
                onChange={(e) => setTestCaregiver(e.target.checked)}
                className="size-3.5"
              />
              <label htmlFor="testCare" className="cursor-pointer text-foreground">
                Có người phục vụ (chăm sóc)
              </label>
            </div>

            {/* Kết quả tính toán */}
            <div className="rounded-lg border bg-ink-3/80 p-3 space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mức chuẩn (base):</span>
                <span className="text-foreground">{formatVND(testCalcResult.baseRate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hệ số áp dụng:</span>
                <span className="text-gold font-bold">×{testCalcResult.heSo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trợ cấp hàng tháng:</span>
                <span className="text-foreground">{formatVND(testCalcResult.troCapHangThang)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phụ cấp người phục vụ:</span>
                <span className="text-foreground">+{formatVND(testCalcResult.phuCapChamSoc)}</span>
              </div>
              <div className="flex justify-between border-t pt-1.5 font-bold text-sm">
                <span className="text-gold">Tổng thực nhận:</span>
                <span className="text-gold">{formatVND(testCalcResult.tongTienThucNhan)}</span>
              </div>
              <div className="text-[10px] text-muted-foreground font-sans mt-1">
                {testCalcResult.chiTietCongThuc}
              </div>
            </div>
          </div>
        </div>

        {/* Studio 2: Test Sentiment Analysis */}
        <div className="glass-card border-primary/30 p-4 ring-1 ring-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <span className="font-semibold text-foreground text-sm">
                Kiểm thử Bộ Phân tích Cảm xúc (Sentiment Engine)
              </span>
            </div>
            <span className="label-mono text-[10px] text-primary">Node.js Engine</span>
          </div>

          <div className="mt-3 space-y-3 text-xs">
            <div>
              <label className="label-mono mb-1 block">Nhập phản hồi thử nghiệm:</label>
              <textarea
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                rows={3}
                className="w-full rounded-md border bg-ink-3/80 p-2.5 text-xs text-foreground outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div className="flex flex-wrap gap-1 text-[10px]">
              <button
                type="button"
                onClick={() => setTestText("Cán bộ Nguyễn Văn An rất nhiệt tình và chu đáo")}
                className="rounded border bg-foreground/5 px-2 py-0.5 text-muted-foreground hover:bg-foreground/10"
              >
                Mẫu tích cực
              </button>
              <button
                type="button"
                onClick={() => setTestText("Phải chờ lâu hơn 1 giờ, thủ tục chậm trễ và phiền hà")}
                className="rounded border bg-foreground/5 px-2 py-0.5 text-muted-foreground hover:bg-foreground/10"
              >
                Mẫu tiêu cực
              </button>
            </div>

            {/* Kết quả phân tích */}
            <div className="rounded-lg border bg-ink-3/80 p-3 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Nhãn phân loại (Tag):</span>
                <span
                  className={`rounded-full px-2 py-0.5 font-bold font-mono text-[11px] ${
                    testSentimentResult.sentiment === "POSITIVE"
                      ? "bg-moss/20 text-moss border border-moss/30"
                      : testSentimentResult.sentiment === "NEGATIVE"
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "bg-foreground/10 text-muted-foreground"
                  }`}
                >
                  {testSentimentResult.sentiment} ({testSentimentResult.label})
                </span>
              </div>

              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">Từ khóa tích cực khớp:</span>
                <span className="font-mono text-moss">
                  {testSentimentResult.matchedPositive.length > 0
                    ? testSentimentResult.matchedPositive.join(", ")
                    : "Không có"}
                </span>
              </div>

              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">Từ khóa tiêu cực khớp:</span>
                <span className="font-mono text-primary">
                  {testSentimentResult.matchedNegative.length > 0
                    ? testSentimentResult.matchedNegative.join(", ")
                    : "Không có"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bảng cấu hình danh mục & phân quyền */}
      <div className="grid gap-3 lg:grid-cols-3">
        <div className="glass-card p-4">
          <div className="label-mono">Mức chuẩn trợ cấp ưu đãi</div>
          <div className="ledger-title mt-2 text-3xl tabular-nums text-gold">
            {formatVND(MUC_CHUAN)}
          </div>
          <p className="mt-2 text-[12px] text-muted-foreground">
            Áp dụng theo Nghị định 75/2021/NĐ-CP và văn bản sửa đổi của Chính phủ.
          </p>
        </div>

        <div className="glass-card p-4 lg:col-span-2">
          <div className="label-mono">Hệ số theo nhóm đối tượng chính</div>
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
          <div className="label-mono">Danh mục 14 phường/xã (Thủ Dầu Một)</div>
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
          <div className="label-mono">Tác nhân &amp; phân quyền (RBAC)</div>
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
          <div className="label-mono">Audit Logs &amp; Giám sát hệ thống</div>
          <div className="mt-3 space-y-2 max-h-72 overflow-y-auto pr-1">
            {auditLogs.map((l) => (
              <div key={l.id} className="rounded-md bg-foreground/5 p-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-muted-foreground">{l.timestamp}</span>
                  <span
                    className={`rounded-full border px-1.5 py-0.2 font-mono text-[9px] ${
                      l.status === "SUCCESS"
                        ? "border-moss/40 bg-moss/10 text-moss"
                        : l.status === "WARNING"
                        ? "border-gold/40 bg-gold/10 text-gold"
                        : "border-primary/40 bg-primary/10 text-primary"
                    }`}
                  >
                    {l.status}
                  </span>
                </div>
                <div className="mt-1 font-medium text-foreground">{l.action}</div>
                <div className="text-muted-foreground text-[11px] mt-0.5">{l.details}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
