import React, { useState, useEffect } from "react";
import {
  Activity,
  ShieldCheck,
  Radio,
  HeartHandshake,
  Building2,
  Users,
  Award,
  Zap,
  Clock,
  Sparkles,
  Send,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  TrendingUp,
  MapPin,
  RefreshCw,
  Bell,
  Sliders,
  Flame,
  FileSignature,
  Compass,
} from "lucide-react";
import { useAppState, appStore } from "@/services/app-state";
import { toast } from "sonner";

interface IocSmartDashboardProps {
  onNavigateTab?: (tabKey: string) => void;
}

export const IocSmartDashboard: React.FC<IocSmartDashboardProps> = ({ onNavigateTab }) => {
  const {
    currentUser,
    hoSoList,
    toCNSList,
    quyDenOnList,
    nhaTinhNghiaList,
    phanAnh1022List,
    diTichLeHoiList,
    coSoDichVuVanHoaList,
  } = useAppState();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAlertBroadcasting, setIsAlertBroadcasting] = useState(false);
  const [alertContent, setAlertContent] = useState("");
  const [showDirectDirectiveModal, setShowDirectDirectiveModal] = useState(false);
  const [directiveTarget, setDirectiveTarget] = useState("TO_CNS_CONG_DONG");
  const [directiveMessage, setDirectiveMessage] = useState("");

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Tính toán số liệu nhanh
  const totalNcc = 12480;
  const totalKinhPhi = 24.6; // Tỷ
  const tyLeKhongTienMat = 94.2; // %
  const tongThuQdo = (quyDenOnList || []).reduce((s, i) => s + (i.soTienVND || 0), 0);
  const totalPhanAnh = (phanAnh1022List || []).length;
  const phanAnhChuaXuLy = (phanAnh1022List || []).filter((p) => p.trangThai === "DANG_XU_LY").length;

  const handleBroadcastAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directiveMessage.trim()) return;
    toast.success("Lãnh đạo UBND Phường đã phát lệnh chỉ đạo hỏa tốc qua Trục IOC!", {
      description: `Đơn vị nhận: ${
        directiveTarget === "TO_CNS_CONG_DONG"
          ? "14 Tổ Công nghệ số cộng đồng"
          : directiveTarget === "MOT_CUA"
          ? "Bộ phận Một cửa & DVCQG"
          : "Bộ phận Nội vụ - An sinh xã hội"
      }`,
    });
    setShowDirectDirectiveModal(false);
    setDirectiveMessage("");
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER BANNER - IOC COMMAND CENTER */}
      <div className="relative overflow-hidden rounded-xl border border-[#dd4b39]/40 bg-gradient-to-r from-[#1a2226] via-[#222d32] to-[#1a2226] border-b-2 border-[#dd4b39] p-5 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 h-48 w-48 rounded-full bg-[#dd4b39]/10 blur-2xl pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#dd4b39]/20 border border-[#dd4b39]/40 px-2.5 py-0.5 text-[11px] font-bold text-red-200">
                <span className="size-2 rounded-full bg-[#dd4b39] animate-pulse" />
                TRỰC TUYẾN 24/7 (IOC) · TRỤC LIÊN THÔNG VDXP / LGSP
              </span>
              <span className="text-xs text-gray-400 font-mono">
                MÃ ĐƠN VỊ: UBND-TDM-711
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Activity className="size-6 text-[#dd4b39] animate-pulse" />
              TRUNG TÂM GIÁM SÁT ĐIỀU HÀNH THÔNG MINH (IOC) PHƯỜNG THỦ DẦU MỘT
            </h2>
            <p className="text-xs text-gray-300">
              Vận hành theo Khoản 8 Điều 3 Quyết định số 2698/QĐ-UBND của UBND phường Thủ Dầu Một · Kết nối IOC Thành phố &amp; IOC Tỉnh
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-black/40 border border-gray-700 px-3.5 py-2 text-right">
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Thời gian hệ thống</div>
              <div className="text-lg font-mono font-black text-amber-300 tabular-nums">
                {currentTime.toLocaleTimeString("vi-VN")}
              </div>
              <div className="text-[10px] text-slate-300 font-medium">
                {currentTime.toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </div>
            </div>

            <button
              onClick={() => setShowDirectDirectiveModal(true)}
              className="flex items-center gap-1.5 rounded-lg bg-[#dd4b39] hover:bg-[#c23321] px-3.5 py-2.5 text-xs font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Zap className="size-4 text-amber-300 animate-bounce" />
              <span>Chỉ đạo Hỏa tốc</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. BỐN TRỤ CỘT ĐIỀU HÀNH CHUYÊN NGÀNH (THEO QUYẾT ĐỊNH 2698/QĐ-UBND) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TRỤ CỘT 1: NGƯỜI CÓ CÔNG & AN SINH */}
        <div className="rounded-xl border border-rose-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-1.5 w-full bg-gradient-to-r from-rose-500 to-red-600" />
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-rose-100">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-rose-50 text-rose-700">
                <HeartHandshake className="size-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-rose-950">1. Người có công & An sinh</h3>
                <span className="text-[10px] text-gray-500 font-medium">Điểm t Khoản 4 Điều 3</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Khớp lệnh 100%
            </span>
          </div>

          <div className="space-y-2 mt-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-gray-600">Đối tượng NCC:</span>
              <span className="text-lg font-mono font-black text-rose-700">12.480 hồ sơ</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-gray-600">Kinh phí chi trả/tháng:</span>
              <span className="text-sm font-mono font-bold text-gray-800">24,6 Tỷ VNĐ</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-gray-600 font-medium">
                <span>Chi trả qua Thẻ/VNeID:</span>
                <span className="font-mono font-bold text-emerald-600">94,2%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "94.2%" }} />
              </div>
            </div>
            <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-600 flex justify-between">
              <span>Quỹ Đền ơn đáp nghĩa:</span>
              <span className="font-mono font-bold text-rose-700">223,5 Triệu</span>
            </div>
          </div>
        </div>

        {/* TRỤ CỘT 2: DỊCH VỤ CÔNG & MỘT CỬA */}
        <div className="rounded-xl border border-sky-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-1.5 w-full bg-gradient-to-r from-sky-500 to-blue-600" />
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-sky-100">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-sky-50 text-sky-700">
                <Building2 className="size-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-sky-950">2. Một cửa & Dịch vụ công</h3>
                <span className="text-[10px] text-gray-500 font-medium">Khoản 12 Điều 3 · NĐ 61</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
              SLA 99.2%
            </span>
          </div>

          <div className="space-y-2 mt-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-gray-600">Hồ sơ tiếp nhận:</span>
              <span className="text-lg font-mono font-black text-sky-700">1.224 hồ sơ</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-gray-600">Đã giải quyết:</span>
              <span className="text-sm font-mono font-bold text-emerald-700">1.204 (98,4%)</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-gray-600 font-medium">
                <span>Ký số SmartCA điện tử:</span>
                <span className="font-mono font-bold text-sky-600">99,1%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full" style={{ width: "99.1%" }} />
              </div>
            </div>
            <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-600 flex justify-between">
              <span>Hồ sơ quá hạn:</span>
              <span className="font-mono font-bold text-emerald-600">0 hồ sơ (0%)</span>
            </div>
          </div>
        </div>

        {/* TRỤ CỘT 3: CHUYỂN ĐỔI SỐ & TỔ CNSCĐ */}
        <div className="rounded-xl border border-purple-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-1.5 w-full bg-gradient-to-r from-purple-500 to-indigo-600" />
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-purple-100">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-50 text-purple-700">
                <Radio className="size-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-purple-950">3. Chuyển đổi số & Tổ CNS</h3>
                <span className="text-[10px] text-gray-500 font-medium">Khoản 14 Điều 3 (Mới)</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
              14/14 Khu phố
            </span>
          </div>

          <div className="space-y-2 mt-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-gray-600">Mạng lưới Tổ CNSCĐ:</span>
              <span className="text-lg font-mono font-black text-purple-700">14 Tổ / 108 NV</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-gray-600">Tỷ lệ VNeID Mức 2:</span>
              <span className="text-sm font-mono font-bold text-purple-700">94,6%</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-gray-600 font-medium">
                <span>Chỉ số DTI Cấp xã:</span>
                <span className="font-mono font-bold text-purple-600">845 / 1000 điểm</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: "84.5%" }} />
              </div>
            </div>
            <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-600 flex justify-between">
              <span>Đài truyền thanh thông minh:</span>
              <span className="font-mono font-bold text-emerald-600">14 Cụm loa IP</span>
            </div>
          </div>
        </div>

        {/* TRỤ CỘT 4: VĂN HÓA, THỂ THAO & DU LỊCH */}
        <div className="rounded-xl border border-amber-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-1.5 w-full bg-gradient-to-r from-amber-500 to-orange-600" />
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-100">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-800">
                <Compass className="size-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-amber-950">4. Văn hóa, Di tích & 814</h3>
                <span className="text-[10px] text-gray-500 font-medium">Khoản 7 Điều 3</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
              8 Di tích
            </span>
          </div>

          <div className="space-y-2 mt-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-gray-600">Gia đình văn hóa:</span>
              <span className="text-lg font-mono font-black text-amber-700">98,6% (14.280)</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-gray-600">Khu phố văn hóa:</span>
              <span className="text-sm font-mono font-bold text-emerald-700">14 / 14 Khu phố</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-gray-600 font-medium">
                <span>Hậu kiểm Liên ngành 814:</span>
                <span className="font-mono font-bold text-amber-700">100% tuân thủ</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: "100%" }} />
              </div>
            </div>
            <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-600 flex justify-between">
              <span>Cơ sở Karaoke, Game, Net:</span>
              <span className="font-mono font-bold text-gray-800">32 Cơ sở quản lý</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BẢNG ĐIỀU PHỐI 14 KHU PHỐ & TIẾN ĐỘ TỔ CÔNG NGHỆ SỐ CỘNG ĐỒNG */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
        <div className="flex items-center justify-between bg-gray-50/80 px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <MapPin className="size-4.5 text-red-600" />
            <h3 className="font-bold text-sm text-gray-900">
              Bản Đồ Chỉ Số Thực Địa 14 Khu Phố Phường Thủ Dầu Một (Theo Dõi Tổ CNSCĐ & An Sinh)
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500">Dữ liệu đồng bộ trực tiếp từ VNeID & CSDL Quốc gia</span>
            <button
              onClick={() => toast.success("Đã đồng bộ lại dữ liệu 14 khu phố!")}
              className="p-1 rounded hover:bg-gray-200 text-gray-600"
              title="Làm mới"
            >
              <RefreshCw className="size-3.5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-gray-100/75 text-gray-600 font-bold border-b border-gray-200">
                <th className="py-2.5 px-3">Khu phố</th>
                <th className="py-2.5 px-3">Tổ CNS cộng đồng phụ trách</th>
                <th className="py-2.5 px-3 text-center">Hộ dân</th>
                <th className="py-2.5 px-3 text-center">Tỷ lệ VNeID Mức 2</th>
                <th className="py-2.5 px-3 text-center">Tỷ lệ Nộp DVC</th>
                <th className="py-2.5 px-3 text-center">Chi trả không tiền mặt</th>
                <th className="py-2.5 px-3 text-center">Phản ánh 1022</th>
                <th className="py-2.5 px-3 text-center">Xếp loại</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-sans">
              {(toCNSList || []).map((to, idx) => (
                <tr key={to.id} className="hover:bg-sky-50/40 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-gray-900 flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    {to.khuPho}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-gray-800">{to.tenTo}</div>
                    <div className="text-[10px] text-gray-500 font-mono">Tổ trưởng: {to.toTruong}</div>
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-medium text-gray-700">
                    {to.soHoDanQuanLy} hộ
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      {to.tyLeCaiVNeIDPercent}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                      {to.tyLeDVCPercent}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {to.tyLeThanhToanSoPercent}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="font-mono font-bold text-gray-700">
                      {idx % 3 === 0 ? "1 tin" : "0 tin"}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold border ${
                        to.danhGiaHoatDong === "XUAT_SAC"
                          ? "bg-purple-100 text-purple-800 border-purple-300"
                          : to.danhGiaHoatDong === "TOT"
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : "bg-gray-100 text-gray-700 border-gray-300"
                      }`}
                    >
                      {to.danhGiaHoatDong === "XUAT_SAC" ? "Xuất sắc" : to.danhGiaHoatDong === "TOT" ? "Tốt" : "Đạt"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. MODAL CHỈ ĐẠO HỎA TỐC CỦA LÃNH ĐẠO QUA TRỤC IOC */}
      {showDirectDirectiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in duration-200">
            <div className="bg-gradient-to-r from-red-600 to-rose-700 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="size-5 text-amber-300 animate-pulse" />
                  <h3 className="font-bold text-base">Ban Hành Lệnh Chỉ Đạo Hỏa Tốc Qua Trục IOC</h3>
                </div>
                <button
                  onClick={() => setShowDirectDirectiveModal(false)}
                  className="rounded-lg p-1 text-white/80 hover:bg-white/10"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-red-100 mt-1">
                Lệnh điều hành trực tiếp từ Lãnh đạo UBND phường Thủ Dầu Một xuống các bộ phận chuyên môn
              </p>
            </div>

            <form onSubmit={handleBroadcastAlert} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Đơn vị / Bộ phận tiếp nhận chỉ đạo:
                </label>
                <select
                  value={directiveTarget}
                  onChange={(e) => setDirectiveTarget(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium focus:border-red-500 focus:outline-hidden"
                >
                  <option value="TO_CNS_CONG_DONG">14 Tổ Công nghệ số cộng đồng các Khu phố</option>
                  <option value="MOT_CUA">Bộ phận Tiếp nhận và Trả kết quả (Một cửa)</option>
                  <option value="NOI_VU_AN_SINH">Bộ phận Nội vụ – Lao động, Thương binh và Xã hội</option>
                  <option value="VAN_HOA_TT">Bộ phận Văn hóa – Thông tin và Chuyển đổi số</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Nội dung lệnh chỉ đạo hỏa tốc:
                </label>
                <textarea
                  rows={4}
                  required
                  value={directiveMessage}
                  onChange={(e) => setDirectiveMessage(e.target.value)}
                  placeholder="Ví dụ: Yêu cầu 14 Tổ CNSCĐ tập trung cao điểm cuối tuần hỗ trợ đối tượng NCC cài đặt VNeID Mức 2 và xác thực số tài khoản ngân hàng để bảo đảm 100% chi trả an sinh không dùng tiền mặt trong kỳ tháng này..."
                  className="w-full rounded-lg border border-gray-300 p-3 text-xs focus:border-red-500 focus:outline-hidden"
                />
              </div>

              <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-amber-600" />
                  Ký số điện tử xác thực:
                </div>
                <p className="text-[11px] text-amber-700">
                  Lệnh sẽ được gắn kèm chữ ký số cá nhân của Chủ tịch UBND phường / Trưởng phòng VH-XH và truyền tin tức thời đến điện thoại công vụ của cán bộ phụ trách.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowDirectDirectiveModal(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-md"
                >
                  <Send className="size-3.5" />
                  <span>Phát Lệnh Ngay</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

