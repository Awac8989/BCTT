import { useState } from "react";
import {
  Landmark,
  QrCode,
  Flame,
  Volume2,
  Calendar,
  Users,
  CheckCircle2,
  AlertTriangle,
  Building2,
  FileSpreadsheet,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { type DiTichLeHoiItem } from "@/data/domain-mock";
import { formatVND } from "@/data/mock";
import { PHAN_LOAI_DI_TICH_LABELS } from "../utils";

interface DiTichLeHoiTabProps {
  diTichList: DiTichLeHoiItem[];
  onOpenQrModal: (item: DiTichLeHoiItem) => void;
  onTogglePccc: (id: string, currentStatus: DiTichLeHoiItem["congTacPCCC"]) => void;
}

export function DiTichLeHoiTab({
  diTichList,
  onOpenQrModal,
  onTogglePccc,
}: DiTichLeHoiTabProps) {
  const [selectedPhanLoai, setSelectedPhanLoai] = useState("ALL");

  const filteredDiTich = diTichList.filter((d) => {
    if (selectedPhanLoai === "ALL") return true;
    return d.phanLoai === selectedPhanLoai;
  });

  return (
    <div className="space-y-6">
      {/* Banner giới thiệu Lễ hội Chùa Bà & Di tích Thủ Dầu Một */}
      <div className="bg-gradient-to-r from-red-600 via-amber-600 to-orange-600 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full opacity-10 pointer-events-none flex items-center justify-center">
          <Landmark className="w-80 h-80" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <Landmark className="w-3.5 h-3.5" />
            Không gian Di sản & Lễ hội Đất Thủ
          </div>
          <h3 className="text-2xl font-bold mb-2">
            Lễ hội Miếu Bà Thiên Hậu & Hệ thống Di tích Lịch sử Văn hóa
          </h3>
          <p className="text-red-50 text-sm leading-relaxed mb-4">
            Lễ hội Rằm tháng Giêng Chùa Bà Bình Dương là lễ hội dân gian lớn nhất vùng Đông Nam Bộ, nổi tiếng với nét đẹp văn hóa &quot;Lễ hội nghĩa tình&quot; miễn phí khăn lạnh, nước suối, vá xe và thức ăn chay cho hơn 1.5 triệu lượt khách thập phương. Phường triển khai số hóa mã QR Audio Guide và quản lý tiền công đức minh bạch theo Thông tư 04/2023/TT-BTC.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>100% Di tích đạt an toàn PCCC Lễ hội</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg">
              <QrCode className="w-4 h-4 text-amber-300" />
              <span>Số hóa thuyết minh tự động qua App / Zalo</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg">
              <FileSpreadsheet className="w-4 h-4 text-blue-300" />
              <span>Mở tài khoản Kho bạc quản lý tiền công đức</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setSelectedPhanLoai("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              selectedPhanLoai === "ALL"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
            }`}
          >
            Tất cả ({diTichList.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedPhanLoai("DI_TICH_QUOC_GIA")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              selectedPhanLoai === "DI_TICH_QUOC_GIA"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
            }`}
          >
            Di tích Quốc gia
          </button>
          <button
            type="button"
            onClick={() => setSelectedPhanLoai("CO_SO_TIN_NGUONG")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              selectedPhanLoai === "CO_SO_TIN_NGUONG"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
            }`}
          >
            Miếu Bà & Tín ngưỡng
          </button>
          <button
            type="button"
            onClick={() => setSelectedPhanLoai("DI_TICH_CAP_TINH")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              selectedPhanLoai === "DI_TICH_CAP_TINH"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
            }`}
          >
            Di tích cấp Tỉnh
          </button>
        </div>
      </div>

      {/* Grid di tích */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredDiTich.map((item) => {
          const phanLoaiInfo = PHAN_LOAI_DI_TICH_LABELS[item.phanLoai] || {
            label: item.phanLoai,
            color: "bg-slate-100 text-slate-700",
          };

          return (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span
                      className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full border mb-1.5 ${phanLoaiInfo.color}`}
                    >
                      {phanLoaiInfo.label} (Xếp hạng {item.namXepHang})
                    </span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {item.tenDiTich}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {item.diaChi}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenQrModal(item)}
                    className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 rounded-lg transition-colors cursor-pointer flex-shrink-0"
                    title="Mã QR thuyết minh Audio Guide"
                  >
                    <QrCode className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2.5 my-4 text-xs">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      Lễ hội tiêu biểu:
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {item.thoiGianLeHoi}
                    </span>
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 italic">
                    &quot;{item.leHoiTieuBieu}&quot;
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="border border-slate-100 dark:border-slate-800 p-2 rounded-lg">
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Lượng khách ước tính:
                      </div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-blue-500" />
                        {item.luongKhachUocTinh.toLocaleString("vi-VN")} lượt/năm
                      </div>
                    </div>

                    <div className="border border-slate-100 dark:border-slate-800 p-2 rounded-lg">
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        An toàn PCCC Lễ hội:
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <span
                          className={`font-semibold flex items-center gap-1 ${
                            item.congTacPCCC === "DAM_BAO_100%"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          <Flame className="w-3.5 h-3.5" />
                          {item.congTacPCCC === "DAM_BAO_100%" ? "Đảm bảo 100%" : "Đang bổ sung"}
                        </span>
                        <button
                          type="button"
                          onClick={() => onTogglePccc(item.id, item.congTacPCCC)}
                          className="text-[10px] text-blue-600 hover:underline cursor-pointer"
                        >
                          Đổi
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quản lý tiền công đức Thông tư 04/2023 */}
                  <div className="bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg p-2.5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-amber-900 dark:text-amber-300 flex items-center gap-1">
                        <FileSpreadsheet className="w-3.5 h-3.5 text-amber-600" />
                        Minh bạch Tiền công đức (TT 04/2023/TT-BTC)
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-medium">
                        Công khai
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-amber-800 dark:text-amber-400">Tổng thu hòm công đức 2025:</span>
                      <span className="font-bold text-amber-900 dark:text-amber-200 text-sm">
                        {formatVND(item.quanLyTienCongDuc.tongThuNam2025)}
                      </span>
                    </div>
                    <div className="text-[11px] text-amber-700 dark:text-amber-400 mt-1">
                      Tài khoản Kho bạc Nhà nước: <span className="font-mono font-medium">{item.quanLyTienCongDuc.soTaiKhoanKhoBac}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                  BQL: {item.banQuanLy}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenQrModal(item)}
                    className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    Audio Guide
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
