import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
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
import {
  Star,
  QrCode,
  Tablet,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  ExternalLink,
  MessageSquare,
  Building,
  User,
  Clock,
  ShieldCheck,
  Eye,
  Lock,
  Award,
  Filter,
  Check,
  Search,
  FileText,
  Printer,
  X,
  ThumbsUp,
  ThumbsDown,
  Info,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  danhSachCanBoDanhGia,
  tieuChiRadar,
  xepHangPhuong,
  type CanBoDanhGiaSummary,
  type PhanHoi,
} from "@/data/mock";
import { useAppState } from "@/services/app-state";

export const Route = createFileRoute("/danh-gia")({
  head: () => ({
    meta: [
      { title: "Sổ theo dõi & Xem Nhận xét, Đánh giá Cán bộ · SLĐTBXH Bình Dương" },
      {
        name: "description",
        content:
          "Chế độ chỉ xem dành cho Cán bộ và Lãnh đạo nghiệp vụ. Giám sát thời gian thực ý kiến nhận xét và đánh giá của công dân về cán bộ tiếp nhận tại Bộ phận Một cửa.",
      },
    ],
  }),
  component: GiamSatDanhGiaPage,
});

const KENH_THU_THAP = [
  {
    ten: "QR trên Giấy hẹn Một cửa",
    luot: 1842,
    tyLe: 48,
    icon: QrCode,
    color: "text-blue-700 bg-blue-50 border-blue-200",
    desc: "Công dân dùng Zalo / Camera điện thoại quét mã in trên phiếu hẹn",
  },
  {
    ten: "Màn hình Kiosk tại quầy tiếp nhận",
    luot: 1387,
    tyLe: 36,
    icon: Tablet,
    color: "text-emerald-700 bg-emerald-50 border-emerald-200",
    desc: "Người dân chạm đánh giá trực tiếp sau khi hoàn tất thủ tục tại quầy",
  },
  {
    ten: "Khảo sát tự động Zalo ZNS / SMS",
    luot: 633,
    tyLe: 16,
    icon: Smartphone,
    color: "text-amber-700 bg-amber-50 border-amber-200",
    desc: "Hệ thống tự động gửi tin nhắn hỏi thăm sau khi trả kết quả thành công",
  },
];

function GiamSatDanhGiaPage() {
  const { phanHoiList } = useAppState();
  const [selectedCanBo, setSelectedCanBo] = useState("Tất cả cán bộ tiếp nhận");
  const [selectedPhuong, setSelectedPhuong] = useState("Tất cả phường/xã");
  const [tabFilter, setTabFilter] = useState<"ALL" | "POSITIVE" | "NEGATIVE">("ALL");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedGiaiTrinh, setSelectedGiaiTrinh] = useState<PhanHoi | null>(null);

  // Thống kê CSAT chung
  const tongSoLuot = phanHoiList.length + 3862;
  const haiLongCount = phanHoiList.filter((p) => p.diemCsat >= 4).length;
  const csatScore = Math.round(((haiLongCount + 3760) / tongSoLuot) * 100);
  const negativeList = phanHoiList.filter((p) => p.diemCsat <= 2);

  // Bộ lọc dữ liệu nhận xét
  const filteredFeed = phanHoiList.filter((p) => {
    // Lọc theo Tab cảm xúc
    if (tabFilter === "POSITIVE" && p.diemCsat < 4) return false;
    if (tabFilter === "NEGATIVE" && p.diemCsat > 2) return false;

    // Lọc theo Cán bộ tiếp nhận
    if (selectedCanBo !== "Tất cả cán bộ tiếp nhận" && p.canBo !== selectedCanBo) {
      return false;
    }

    // Lọc theo Phường/Xã
    if (selectedPhuong !== "Tất cả phường/xã" && p.phuong !== selectedPhuong) {
      return false;
    }

    // Lọc theo từ khóa tìm kiếm
    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase();
      const matchText =
        p.yKien.toLowerCase().includes(q) ||
        p.hoSoId.toLowerCase().includes(q) ||
        p.nguoiDanhGia.toLowerCase().includes(q) ||
        p.canBo.toLowerCase().includes(q);
      if (!matchText) return false;
    }

    return true;
  });

  const handleExportReport = () => {
    toast.success("Đang kết xuất Báo cáo Kết quả Đánh giá Cán bộ Một cửa gửi UBND Tỉnh…");
  };

  const handleSelectCanBoFromTable = (cbName: string) => {
    setSelectedCanBo(cbName);
    toast.info(`Đang lọc ý kiến nhận xét của công dân dành riêng cho cán bộ ${cbName}`);
    // Cuộn xuống danh sách nhận xét
    const el = document.getElementById("danh-sach-nhan-xet");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <AppShell>
      {/* 1. Header Trang theo phong cách Sở LĐTBXH Bình Dương */}
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded bg-[#222d32] text-white px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider">
              <Lock className="size-3 text-amber-400" />
              Chế độ chỉ xem nội bộ
            </span>
            <span className="text-xs text-gray-500 font-medium">
              SLĐTBXH Bình Dương · Phân hệ Giám sát Công vụ Một cửa
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-[#333333] flex items-baseline mt-1">
            Sổ theo dõi & Xem Nhận xét, Đánh giá Cán bộ
            <span className="text-sm font-normal text-[#777777] ml-2">
              (Chỉ số CSAT & Tiếng nói người dân)
            </span>
          </h1>
          <div className="text-xs text-[#666666] mt-0.5">
            Dữ liệu khảo sát được thu thập độc lập từ người dân qua Mã QR Giấy hẹn, Kiosk cảm ứng tại quầy và tin nhắn Zalo. Cán bộ không tự đánh giá trên phần mềm này.
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setQrModalOpen(true)}
            className="flex items-center gap-1.5 rounded-[3px] border border-[#00c0ef] bg-[#00c0ef]/10 text-[#0073b7] px-3 py-1.5 font-bold hover:bg-[#00c0ef]/20 transition-colors cursor-pointer"
            title="Xem mã QR để in dán tại bàn tiếp nhận cho công dân quét"
          >
            <QrCode className="size-4" />
            Xem Mã QR in tại quầy
          </button>
          <button
            type="button"
            onClick={handleExportReport}
            className="flex items-center gap-1.5 rounded-[3px] bg-[#00a65a] hover:bg-[#008d4c] px-3.5 py-1.5 font-bold text-white shadow-xs cursor-pointer transition-colors"
          >
            <FileSpreadsheet className="size-4" />
            Xuất Báo cáo gửi UBND Tỉnh
          </button>
        </div>
      </div>

      {/* 2. Banner Nghiệp vụ Quan trọng: Khẳng định Chế độ CHỈ XEM cho Cán bộ & Lãnh đạo */}
      <div className="mb-4 bg-gradient-to-r from-[#1e282c] via-[#222d32] to-[#2c3b41] text-white rounded-xs p-3.5 shadow-xs border-l-4 border-l-amber-400">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded bg-amber-400/20 text-amber-300 shrink-0 mt-0.5">
              <Eye className="size-5" />
            </div>
            <div>
              <div className="font-bold text-xs uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <span>Chế độ CHỈ XEM dành cho Cán bộ & Lãnh đạo nghiệp vụ</span>
                <span className="text-[10px] bg-amber-400/30 px-1.5 py-0.2 rounded font-normal text-amber-200">
                  READ-ONLY MONITORING
                </span>
              </div>
              <p className="text-xs text-gray-200 mt-1 leading-relaxed">
                Đây là phần mềm nghiệp vụ nội bộ của Cán bộ Sở LĐTBXH. <strong>Cán bộ không tự chấm điểm hay nhập đánh giá tại đây</strong>. Toàn bộ điểm số, xếp hạng và nhận xét được đồng bộ khách quan từ Người dân và Thân nhân gửi về. Cán bộ và Lãnh đạo có trách nhiệm theo dõi chất lượng phục vụ và xử lý giải trình đối với các phản ánh chưa hài lòng.
              </p>
            </div>
          </div>
          <div className="shrink-0 flex sm:flex-col items-end justify-between gap-1 border-t sm:border-t-0 sm:border-l border-gray-600 pt-2 sm:pt-0 sm:pl-3 text-right">
            <span className="text-[11px] text-gray-300">Dữ liệu thời gian thực:</span>
            <span className="font-mono text-xs font-bold text-emerald-400">
              Đồng bộ 100% khách quan
            </span>
          </div>
        </div>
      </div>

      {/* 3. 4 Thẻ KPI Chỉ số Hài lòng (CSAT) & Đánh giá Cán bộ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {/* Card 1: CSAT chung */}
        <div className="bg-white border-t-3 border-t-[#00a65a] border-x border-b border-[#d2d6de] p-3.5 rounded-xs shadow-xs">
          <div className="text-xs uppercase font-bold text-gray-500">Chỉ số hài lòng chung (CSAT)</div>
          <div className="text-2xl font-extrabold text-[#00a65a] mt-1 flex items-baseline gap-1">
            {csatScore}%
            <span className="text-xs font-normal text-gray-500">hài lòng</span>
          </div>
          <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
            <span className="text-[#00a65a] font-bold">▲ +1.4%</span> so với kỳ đánh giá trước
          </div>
        </div>

        {/* Card 2: Tổng lượt người dân đánh giá cán bộ */}
        <div className="bg-white border-t-3 border-t-[#00c0ef] border-x border-b border-[#d2d6de] p-3.5 rounded-xs shadow-xs">
          <div className="text-xs uppercase font-bold text-gray-500">Tổng lượt dân đánh giá</div>
          <div className="text-2xl font-extrabold text-[#0073b7] mt-1">
            {tongSoLuot.toLocaleString("vi-VN")}
            <span className="text-xs font-normal text-gray-500 ml-1">lượt</span>
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            Ghi nhận tại 14 quầy tiếp nhận Một cửa
          </div>
        </div>

        {/* Card 3: Nhận xét khen ngợi */}
        <div className="bg-white border-t-3 border-t-emerald-600 border-x border-b border-[#d2d6de] p-3.5 rounded-xs shadow-xs">
          <div className="text-xs uppercase font-bold text-gray-500">Ý kiến khen ngợi (≥ 4 sao)</div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">
            {(haiLongCount + 3760).toLocaleString("vi-VN")}
            <span className="text-xs font-normal text-gray-500 ml-1">lượt</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            Cán bộ hướng dẫn chu đáo, tận tâm
          </div>
        </div>

        {/* Card 4: Phản ánh cần giải trình */}
        <div className="bg-white border-t-3 border-t-[#dd4b39] border-x border-b border-[#d2d6de] p-3.5 rounded-xs shadow-xs">
          <div className="text-xs uppercase font-bold text-gray-500">Ý kiến cần giải trình (≤ 2 sao)</div>
          <div className="text-2xl font-extrabold text-[#dd4b39] mt-1">
            {negativeList.length}
            <span className="text-xs font-normal text-gray-500 ml-1">phản ánh</span>
          </div>
          <div className="text-[11px] text-red-600 font-semibold mt-1">
            Cán bộ Một cửa cần lập biên bản giải trình
          </div>
        </div>
      </div>

      {/* 4. BẢNG TỔNG HỢP & XẾP HẠNG ĐÁNH GIÁ TỪNG CÁN BỘ TIẾP NHẬN */}
      <div className="bg-white border border-[#d2d6de] rounded-xs shadow-xs p-4 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 mb-3">
          <div>
            <h2 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <Award className="size-4 text-amber-500" />
              Bảng Tổng hợp & Xếp loại Đánh giá từng Cán bộ Tiếp nhận Một cửa
            </h2>
            <div className="text-xs text-gray-500 mt-0.5">
              Dữ liệu xếp loại thực tế từ điểm chấm của Người dân. Bấm vào nút <strong>"Xem nhận xét"</strong> để lọc chi tiết các phản ánh về cán bộ đó.
            </div>
          </div>
          {selectedCanBo !== "Tất cả cán bộ tiếp nhận" && (
            <button
              type="button"
              onClick={() => setSelectedCanBo("Tất cả cán bộ tiếp nhận")}
              className="text-xs text-[#dd4b39] hover:underline font-bold self-start sm:self-center flex items-center gap-1"
            >
              <X className="size-3.5" />
              Bỏ lọc: {selectedCanBo}
            </button>
          )}
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 font-bold border-y border-gray-200">
                <th className="p-2.5 text-left">Cán bộ tiếp nhận</th>
                <th className="p-2.5 text-left">Vị trí công tác</th>
                <th className="p-2.5 text-center">Số lượt đánh giá</th>
                <th className="p-2.5 text-center">Điểm CSAT TB</th>
                <th className="p-2.5 text-center">Tỷ lệ hài lòng</th>
                <th className="p-2.5 text-center">Thái độ</th>
                <th className="p-2.5 text-center">Thời gian</th>
                <th className="p-2.5 text-center">Minh bạch</th>
                <th className="p-2.5 text-center">Khen / Góp ý</th>
                <th className="p-2.5 text-center">Xếp loại</th>
                <th className="p-2.5 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {danhSachCanBoDanhGia.map((cb) => {
                const isSelected = selectedCanBo === cb.hoTen;
                return (
                  <tr
                    key={cb.id}
                    className={`transition-colors ${
                      isSelected
                        ? "bg-amber-50/80 font-medium"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {/* Cán bộ */}
                    <td className="p-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-full bg-[#0073b7] text-white font-bold flex items-center justify-center text-xs shadow-2xs shrink-0">
                          {cb.avatarText}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-xs">{cb.hoTen}</div>
                          <div className="text-[11px] text-gray-500 font-mono">{cb.quaySo}</div>
                        </div>
                      </div>
                    </td>

                    {/* Vị trí */}
                    <td className="p-2.5">
                      <div className="text-gray-800 font-medium">{cb.chucVu}</div>
                      <div className="text-[11px] text-gray-500">{cb.donVi}</div>
                    </td>

                    {/* Lượt đánh giá */}
                    <td className="p-2.5 text-center font-mono font-bold text-gray-700">
                      {cb.soLuotDanhGia.toLocaleString("vi-VN")}
                    </td>

                    {/* Điểm TB */}
                    <td className="p-2.5 text-center">
                      <div className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <Star className="size-3 fill-amber-400 text-amber-400" />
                        <span>{cb.diemCsat.toFixed(2)} / 5</span>
                      </div>
                    </td>

                    {/* Tỷ lệ hài lòng */}
                    <td className="p-2.5 text-center font-mono font-bold text-emerald-700">
                      {cb.tyLeHaiLong}%
                    </td>

                    {/* Điểm chi tiết */}
                    <td className="p-2.5 text-center font-mono text-emerald-800">
                      {cb.tieuChi.thaiDo.toFixed(2)}
                    </td>
                    <td className="p-2.5 text-center font-mono text-blue-800">
                      {cb.tieuChi.thoiGian.toFixed(2)}
                    </td>
                    <td className="p-2.5 text-center font-mono text-emerald-800">
                      {cb.tieuChi.minhBach.toFixed(2)}
                    </td>

                    {/* Khen / Khắc phục */}
                    <td className="p-2.5 text-center">
                      <span className="text-emerald-700 font-semibold">{cb.soKhen} khen</span>
                      <span className="text-gray-400 mx-1">/</span>
                      <span className={cb.soKhacPhuc > 5 ? "text-red-600 font-bold" : "text-gray-500"}>
                        {cb.soKhacPhuc} góp ý
                      </span>
                    </td>

                    {/* Xếp loại */}
                    <td className="p-2.5 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          cb.xepLoai === "Xuất sắc"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : cb.xepLoai === "Tốt"
                            ? "bg-blue-100 text-blue-800 border border-blue-300"
                            : "bg-amber-100 text-amber-800 border border-amber-300"
                        }`}
                      >
                        {cb.xepLoai}
                      </span>
                    </td>

                    {/* Thao tác */}
                    <td className="p-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleSelectCanBoFromTable(cb.hoTen)}
                        className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 mx-auto ${
                          isSelected
                            ? "bg-[#dd4b39] text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300"
                        }`}
                        title={`Xem toàn bộ nhận xét của công dân về cán bộ ${cb.hoTen}`}
                      >
                        <Eye className="size-3" />
                        {isSelected ? "Đang xem" : "Xem nhận xét"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Phân tích Kênh Thu Thập Ý Kiến Thực Tế Của Người Dân */}
      <div className="bg-white border border-[#d2d6de] rounded-xs shadow-xs p-4 mb-4">
        <h3 className="font-bold text-xs uppercase text-gray-800 tracking-wider mb-3 flex items-center gap-1.5">
          <QrCode className="size-4 text-[#dd4b39]" />
          Phương thức tiếp nhận ý kiến đánh giá từ Nhân dân:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {KENH_THU_THAP.map((k) => {
            const Icon = k.icon;
            return (
              <div key={k.ten} className={`p-3.5 rounded border ${k.color} flex items-center gap-3`}>
                <div className="p-2.5 rounded bg-white shadow-2xs shrink-0">
                  <Icon className="size-6 text-gray-800" />
                </div>
                <div>
                  <div className="font-bold text-xs text-gray-900">{k.ten}</div>
                  <div className="text-xs text-gray-600 mt-0.5">
                    <strong>{k.luot.toLocaleString("vi-VN")} lượt</strong> ({k.tyLe}% tổng số)
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1">{k.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Biểu Đồ Radar 4 Tiêu Chí & Bảng Xếp Hạng 14 Phường */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Radar 4 tiêu chí cốt lõi */}
        <div className="bg-white border border-[#d2d6de] rounded-xs shadow-xs p-4">
          <div className="font-bold text-xs uppercase text-gray-800 tracking-wider mb-2 flex items-center justify-between">
            <span>Đánh giá theo 4 tiêu chí cốt lõi (Chuẩn SIPAS)</span>
            <span className="text-[11px] text-gray-500 font-normal">Thang điểm 5.0</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={tieuChiRadar}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="tieuChi" tick={{ fill: "#4b5563", fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 5]} />
                <Radar name="Điểm thực tế" dataKey="diem" stroke="#dd4b39" fill="#dd4b39" fillOpacity={0.4} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: 6,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                    fontSize: 12,
                    color: "#1f2937",
                  }}
                  formatter={(val: any) => [`${val} / 5.0 điểm`, "Điểm đánh giá"]}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs mt-2 border-t pt-2">
            <div>
              <div className="text-gray-500">1. Thái độ phục vụ</div>
              <strong className="text-emerald-700 font-bold">4.88 / 5★</strong>
            </div>
            <div>
              <div className="text-gray-500">2. Thời gian xử lý</div>
              <strong className="text-blue-700 font-bold">4.82 / 5★</strong>
            </div>
            <div>
              <div className="text-gray-500">3. Tính minh bạch</div>
              <strong className="text-emerald-700 font-bold">4.91 / 5★</strong>
            </div>
            <div>
              <div className="text-gray-500">4. Cơ sở vật chất</div>
              <strong className="text-amber-700 font-bold">4.75 / 5★</strong>
            </div>
          </div>
        </div>

        {/* Bảng xếp hạng mức độ hài lòng 14 Phường/Xã */}
        <div className="bg-white border border-[#d2d6de] rounded-xs shadow-xs p-4 flex flex-col justify-between">
          <div>
            <div className="font-bold text-xs uppercase text-gray-800 tracking-wider mb-2">
              Xếp hạng CSAT theo Phường/Xã tại TP. Thủ Dầu Một
            </div>
            <div className="overflow-y-auto max-h-64 text-xs">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50 text-gray-600">
                    <th className="p-2 text-left">Phường / Xã</th>
                    <th className="p-2 text-center">Số lượt</th>
                    <th className="p-2 text-center">Tỷ lệ CSAT</th>
                    <th className="p-2 text-center">Xếp loại</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {xepHangPhuong.map((p, idx) => (
                    <tr key={p.phuong} className="hover:bg-gray-50">
                      <td className="p-2 font-medium text-gray-900">
                        {idx + 1}. {p.phuong}
                      </td>
                      <td className="p-2 text-center font-mono">{p.luot}</td>
                      <td className="p-2 text-center font-bold text-emerald-700 font-mono">
                        {p.csat}%
                      </td>
                      <td className="p-2 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Xuất sắc
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="text-[11px] text-gray-500 border-t pt-2 mt-2">
            Đánh giá trung bình đạt chuẩn 96.2% chỉ số SIPAS theo Quyết định của UBND Tỉnh Bình Dương.
          </div>
        </div>
      </div>

      {/* 7. BỘ LỌC NGHIỆP VỤ & TRA CỨU Ý KIẾN CÔNG DÂN */}
      <div id="danh-sach-nhan-xet" className="bg-white border border-[#d2d6de] rounded-xs shadow-xs p-3.5 mb-4">
        <div className="font-bold text-xs uppercase text-gray-800 tracking-wider mb-2.5 flex items-center gap-1.5">
          <Filter className="size-4 text-[#dd4b39]" />
          Bộ Lọc Tra cứu Ý kiến Nhận xét & Đánh giá Cán bộ:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-xs">
          <div>
            <label className="text-gray-600 block mb-1 font-medium">Cán bộ tiếp nhận:</label>
            <select
              value={selectedCanBo}
              onChange={(e) => setSelectedCanBo(e.target.value)}
              className="w-full rounded border border-[#d2d6de] px-2.5 py-1.5 outline-none focus:border-[#dd4b39] bg-white font-medium"
            >
              <option>Tất cả cán bộ tiếp nhận</option>
              {danhSachCanBoDanhGia.map((cb) => (
                <option key={cb.id} value={cb.hoTen}>
                  {cb.hoTen} ({cb.quaySo})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-gray-600 block mb-1 font-medium">Phường / Xã:</label>
            <select
              value={selectedPhuong}
              onChange={(e) => setSelectedPhuong(e.target.value)}
              className="w-full rounded border border-[#d2d6de] px-2.5 py-1.5 outline-none focus:border-[#dd4b39] bg-white"
            >
              <option>Tất cả phường/xã</option>
              {xepHangPhuong.map((p) => (
                <option key={p.phuong} value={p.phuong}>{p.phuong}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-gray-600 block mb-1 font-medium">Mức độ hài lòng:</label>
            <select
              value={tabFilter}
              onChange={(e) => setTabFilter(e.target.value as any)}
              className="w-full rounded border border-[#d2d6de] px-2.5 py-1.5 outline-none focus:border-[#dd4b39] bg-white"
            >
              <option value="ALL">Tất cả mức độ</option>
              <option value="POSITIVE">Hài lòng & Khen ngợi (≥ 4★)</option>
              <option value="NEGATIVE">Ý kiến cần giải trình (≤ 2★)</option>
            </select>
          </div>
          <div>
            <label className="text-gray-600 block mb-1 font-medium">Tìm theo từ khóa / Mã HS:</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Nhập nội dung, tên dân, mã HS..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full rounded border border-[#d2d6de] pl-7 pr-2.5 py-1.5 outline-none focus:border-[#dd4b39]"
              />
              <Search className="size-3.5 text-gray-400 absolute left-2 top-2" />
            </div>
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => {
                setSelectedCanBo("Tất cả cán bộ tiếp nhận");
                setSelectedPhuong("Tất cả phường/xã");
                setTabFilter("ALL");
                setSearchKeyword("");
              }}
              className="w-full rounded border border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-700 py-1.5 font-bold transition-colors cursor-pointer"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* 8. NHẬT KÝ CHI TIẾT NHẬN XÉT CỦA NGƯỜI DÂN DÀNH CHO CÁN BỘ (CHỈ XEM) */}
      <div className="bg-white border border-[#d2d6de] rounded-xs shadow-xs p-4 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 mb-3">
          <div>
            <div className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <MessageSquare className="size-4 text-[#dd4b39]" />
              Nhật ký Tiếp nhận Nhận xét & Đánh giá Cán bộ từ Người Dân
            </div>
            <div className="text-xs text-gray-500">
              Hiển thị <strong>{filteredFeed.length}</strong> ý kiến nhận xét (Chế độ CHỈ XEM dành cho Cán bộ & Lãnh đạo)
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => setTabFilter("ALL")}
              className={`px-3 py-1 rounded transition-colors font-medium ${
                tabFilter === "ALL" ? "bg-gray-800 text-white font-bold" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Tất cả ({phanHoiList.length})
            </button>
            <button
              type="button"
              onClick={() => setTabFilter("POSITIVE")}
              className={`px-3 py-1 rounded transition-colors font-medium ${
                tabFilter === "POSITIVE" ? "bg-emerald-700 text-white font-bold" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              }`}
            >
              Hài lòng (≥ 4★)
            </button>
            <button
              type="button"
              onClick={() => setTabFilter("NEGATIVE")}
              className={`px-3 py-1 rounded transition-colors font-medium ${
                tabFilter === "NEGATIVE" ? "bg-[#dd4b39] text-white font-bold" : "bg-red-50 text-[#dd4b39] hover:bg-red-100"
              }`}
            >
              Cần giải trình (≤ 2★)
            </button>
          </div>
        </div>

        {filteredFeed.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-xs">
            <Info className="size-8 text-gray-400 mx-auto mb-2" />
            <div>Không tìm thấy ý kiến nhận xét nào phù hợp với điều kiện lọc hiện tại.</div>
            <button
              type="button"
              onClick={() => {
                setSelectedCanBo("Tất cả cán bộ tiếp nhận");
                setSelectedPhuong("Tất cả phường/xã");
                setTabFilter("ALL");
                setSearchKeyword("");
              }}
              className="mt-2 text-[#dd4b39] font-bold hover:underline"
            >
              Xem tất cả nhận xét
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFeed.map((item) => {
              const isNegative = item.diemCsat <= 2;
              const isPositive = item.diemCsat >= 4;
              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded border transition-colors ${
                    isNegative
                      ? "border-red-300 bg-red-50/40"
                      : isPositive
                      ? "border-emerald-200 bg-emerald-50/20"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  {/* Dòng tiêu đề thẻ nhận xét */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Thẻ Cán bộ được đánh giá */}
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-blue-100 text-blue-900 font-bold text-xs border border-blue-200">
                        <User className="size-3 text-blue-700" />
                        Cán bộ được đánh giá: {item.canBo}
                      </span>

                      <span className="text-gray-300">|</span>
                      <span className="font-mono text-xs text-gray-700">
                        Mã HS: <strong>{item.hoSoId}</strong>
                      </span>

                      <span className="text-gray-300">|</span>
                      <span className="text-xs text-gray-600">
                        Người gửi: <strong>{item.nguoiDanhGia}</strong> ({item.phuong})
                      </span>

                      <span className="text-gray-300">|</span>
                      <span className="text-xs text-gray-500">
                        Kênh:{" "}
                        <strong>
                          {item.kenh === "QR_PHIEU_HEN"
                            ? "QR Giấy hẹn"
                            : item.kenh === "KIOSK"
                            ? "Kiosk Một cửa"
                            : "SMS / Zalo"}
                        </strong>
                      </span>

                      <span className="text-gray-300">|</span>
                      <span className="text-[11px] text-gray-500 font-mono">
                        {item.ngay}
                      </span>
                    </div>

                    {/* Điểm số và Nhãn cảm xúc */}
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <div className="flex text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`size-3.5 ${
                              i < item.diemCsat ? "fill-amber-400 text-amber-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded font-bold ${
                          isNegative
                            ? "bg-red-100 text-red-700"
                            : isPositive
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {item.diemCsat} / 5 Sao
                      </span>
                    </div>
                  </div>

                  {/* Nội dung ý kiến nhận xét nguyên văn của người dân (Read-only quotation) */}
                  <div className="mt-2.5 bg-white/80 p-2.5 rounded border border-gray-200/80 text-xs sm:text-sm text-gray-900 font-medium leading-relaxed">
                    <span className="text-gray-400 mr-1 font-serif text-base">“</span>
                    {item.yKien}
                    <span className="text-gray-400 ml-1 font-serif text-base">”</span>
                  </div>

                  {/* Điểm 4 tiêu chí cốt lõi người dân chấm cho cán bộ */}
                  {item.tieuChi && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 pt-2 border-t border-gray-100 text-[11px] text-gray-600">
                      <div>
                        Thái độ cán bộ:{" "}
                        <strong className={item.tieuChi.thaiDo <= 2 ? "text-red-600" : "text-emerald-700"}>
                          {item.tieuChi.thaiDo}/5★
                        </strong>
                      </div>
                      <div>
                        Thời gian giải quyết:{" "}
                        <strong className={item.tieuChi.thoiGian <= 2 ? "text-red-600" : "text-blue-700"}>
                          {item.tieuChi.thoiGian}/5★
                        </strong>
                      </div>
                      <div>
                        Tính minh bạch:{" "}
                        <strong className={item.tieuChi.minhBach <= 2 ? "text-red-600" : "text-emerald-700"}>
                          {item.tieuChi.minhBach}/5★
                        </strong>
                      </div>
                      <div>
                        Cơ sở vật chất:{" "}
                        <strong className="text-gray-700">
                          {item.tieuChi.haTang}/5★
                        </strong>
                      </div>
                    </div>
                  )}

                  {/* Khu vực Xử lý Nghiệp vụ & Giải trình (Dành riêng cho cán bộ theo dõi) */}
                  <div className="mt-2.5 pt-2 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    {isNegative ? (
                      <div className="text-red-600 font-semibold flex items-center gap-1.5 text-[11px]">
                        <AlertTriangle className="size-3.5 shrink-0" />
                        <span>Ý kiến chưa hài lòng: Yêu cầu cán bộ phụ trách quầy lập biên bản giải trình công vụ</span>
                      </div>
                    ) : (
                      <div className="text-emerald-700 font-medium flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="size-3.5 shrink-0 text-emerald-600" />
                        <span>Đánh giá tích cực: Ghi nhận vào điểm thi đua công tác Một cửa</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <Link
                        to="/ho-so"
                        search={{ maHoSo: item.hoSoId } as any}
                        className="px-2 py-1 bg-white hover:bg-gray-100 border border-gray-300 rounded text-gray-700 font-semibold text-[11px] flex items-center gap-1"
                        title="Xem hồ sơ lưu trữ liên quan"
                      >
                        <FileText className="size-3" />
                        Xem hồ sơ
                      </Link>

                      {isNegative && (
                        <button
                          type="button"
                          onClick={() => setSelectedGiaiTrinh(item)}
                          className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          Lập / Xem biên bản giải trình
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL 1: XEM MÃ QR ĐỂ IN TẠI BÀN TIẾP NHẬN MỘT CỬA */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded shadow-2xl max-w-md w-full border border-gray-300 p-6 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div className="font-bold text-sm text-gray-900 uppercase tracking-tight">
                Mã QR Đánh giá Dịch vụ công tại Quầy Tiếp nhận
              </div>
              <button
                type="button"
                onClick={() => setQrModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="border-2 border-dashed border-[#dd4b39] p-4 rounded bg-red-50/50 mb-4">
              <div className="text-[11px] font-extrabold uppercase text-[#dd4b39]">
                UBND TỈNH BÌNH DƯƠNG - SỞ LĐTBXH
              </div>
              <div className="text-xs font-bold text-gray-800 mt-0.5">
                BỘ PHẬN TIẾP NHẬN VÀ TRẢ KẾT QUẢ MỘT CỬA
              </div>

              {/* QR Image Simulation */}
              <div className="size-48 bg-white border border-gray-300 mx-auto my-3 p-2 rounded shadow-inner flex flex-col items-center justify-center">
                <QrCode className="size-40 text-gray-900" />
              </div>

              <div className="text-xs font-extrabold text-gray-900">
                QUÉT MÃ ĐỂ ĐÁNH GIÁ SỰ HÀI LÒNG CỦA CÔNG DÂN
              </div>
              <div className="text-[11px] text-gray-600 mt-1">
                Kính mời Quý Bác / Cô / Chú / Anh / Chị mở Zalo hoặc Camera điện thoại quét mã trên để đánh giá tinh thần trách nhiệm của Cán bộ tiếp nhận.
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  window.print();
                  toast.success("Đang gửi lệnh in biển mã QR để dán tại quầy...");
                }}
                className="px-4 py-2 bg-[#00a65a] hover:bg-[#008d4c] text-white text-xs font-bold rounded flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="size-3.5" />
                In Biển Mã QR đặt tại quầy
              </button>
              <button
                type="button"
                onClick={() => setQrModalOpen(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-semibold rounded cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: XEM BIÊN BẢN GIẢI TRÌNH CÔNG VỤ */}
      {selectedGiaiTrinh && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded shadow-2xl max-w-lg w-full border border-gray-300 p-6 text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div>
                <div className="font-bold text-sm text-gray-900 uppercase">
                  Biên bản Tiếp thu & Giải trình Công vụ
                </div>
                <div className="text-xs text-gray-500">
                  Hồ sơ: <strong className="font-mono text-gray-800">{selectedGiaiTrinh.hoSoId}</strong>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedGiaiTrinh(null)}
                className="text-gray-400 hover:text-gray-700 p-1"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-red-50 border border-red-200 p-3 rounded text-red-900">
                <div className="font-bold text-xs mb-1">Nội dung phản ánh của công dân {selectedGiaiTrinh.nguoiDanhGia}:</div>
                <p className="italic leading-relaxed">"{selectedGiaiTrinh.yKien}"</p>
                <div className="mt-2 text-[11px] text-red-700 font-semibold flex items-center gap-1">
                  <span>Cán bộ bị phản ánh:</span>
                  <strong className="underline">{selectedGiaiTrinh.canBo}</strong>
                  <span>({selectedGiaiTrinh.phuong})</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Ý kiến tiếp thu và giải trình của Cán bộ Một cửa:
                </label>
                <textarea
                  defaultValue="Đã liên hệ trực tiếp với người dân qua số điện thoại trên hồ sơ để xin lỗi về sự chậm trễ và giải thích rõ quy định bổ sung giấy tờ. Người dân đã đồng thuận và không còn thắc mắc."
                  rows={4}
                  className="w-full p-2.5 border border-gray-300 rounded outline-none focus:border-[#dd4b39] text-xs leading-relaxed"
                />
              </div>

              <div className="bg-gray-50 p-3 rounded border border-gray-200 flex justify-between items-center text-[11px]">
                <span className="text-gray-600">Trạng thái giải trình:</span>
                <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Đã tiếp thu & khắc phục
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-5 pt-3 border-t">
              <button
                type="button"
                onClick={() => {
                  toast.success(`Đã lưu biên bản giải trình cho hồ sơ ${selectedGiaiTrinh.hoSoId}!`);
                  setSelectedGiaiTrinh(null);
                }}
                className="px-4 py-2 bg-[#00a65a] hover:bg-[#008d4c] text-white text-xs font-bold rounded cursor-pointer"
              >
                Lưu biên bản giải trình
              </button>
              <button
                type="button"
                onClick={() => setSelectedGiaiTrinh(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-semibold rounded cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
